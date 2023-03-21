import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Dimensions
} from "react-native";
import Colors from "../../config/colors";
import OverlayLoader from "../../components/OverlayLoader";
import { GetAllOrderInvoicePayments, GetInvoice, GetOrderBills, GetAllOrderExpenses } from "../../services/OrderService";
import { showDateAsClientWant } from "../../utils/Util";
import LottieView from 'lottie-react-native';
import PressableButton from "../../components/PressableButton";
import { useNavigation } from "@react-navigation/native";
import Order_CashFlow from "./Order_Cashflow";
import AuthService from "../../services/CashFlow/Auth";
import AppContext from "../../context/AppContext";
import Loader from "../../components/Loader";
import moment from "moment";

const TABS = [
    { tab: 0, name: "Expenses" },
    { tab: 1, name: "Billing" },
    { tab: 2, name: "Invoice" },
    { tab: 3, name: "Payment" }
]

export default class Accounting extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            active_tab: 2,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            tabs: TABS,
            isLoading: false,
            payments: [],
            expenses: [],
            invoice: undefined,
            bills: [],
            incomeSum: 0.0,
            expenseSum: 0.0,
            total: 0,
            transferSum: 0.0,
            Ob: 0,
            dailyTrans: null,
            workingDate: new Date(),
            subproject_name: '',
            subproject_id: '',
        };
    }

    componentDidMount() {
        if (this.state.active_tab == 0) {
            this.getExpensesRecords()
        } else if (this.state.active_tab == 1) {
            this.getBillingRecords()
        } else if (this.state.active_tab == 2) {
            this.getInvoiceRecords()
        } else {
            this.getPaymentRecords()
        }
        this.AlltransDetail(this.context.userData, this.state.workingDate, this.props.orderData.id)
        let data = `${this.props.orderData.order_id}/${this.props.orderData.venue}/${moment(this.props.orderData.event_start_timestamp).format(" Do MMM YY")}/${this.props.orderData.customer_name}/${this.props.orderData.order_status}`
        console.log('.......Accounting......data.........', data);
        this.setState({
            subproject_name: data,
            subproject_id: this.props.orderData.id
        })
    }

    getPaymentRecords() {
        this.setState({ isLoading: true });
        GetAllOrderInvoicePayments({ order_id: this.props.orderData.id })
            .then((result) => {
                if (result.is_success) {
                    this.setState({
                        payments: result.data
                    });
                }
            })
            .catch(e => console.log(e))
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    AlltransDetail = async (userAcc, workingDate, order_id) => {
        this.setState({ isLoading: true });
        let date = workingDate;
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let result = await AuthService.getTransferDetailsByOrder(
            userAcc.cust_code,
            day,
            month,
            year,
            order_id
        );
        console.log('.......AlltransDetail..result...........', result)
        if (result.data != null) {
            let sumIncome = result.data.totalIncome;
            let sumExpense = result.data.totalExpense;
            let totalOb = result.data.totalOB;
            let total = result.data.totalCB;
            let totalTransfer = result.data.totalTransfer;
            this.setState({
                incomeSum: sumIncome,
                expenseSum: sumExpense,
                total: total,
                transferSum: totalTransfer,
                Ob: totalOb,
                dailyTrans: result,
                isLoading: false
            })
        } else {
            this.setState({
                incomeSum: 0.0,
                expenseSum: 0.0,
                total: 0,
                transferSum: 0.0,
                Ob: 0,
                dailyTrans: null,
                isLoading: false
            })
        }
    };

    getBillingRecords() {
        this.setState({ isLoading: true });

        GetOrderBills({ order_id: this.props.orderData.id })
            .then((result) => {
                if (result.is_success) {
                    this.setState({
                        bills: result.data
                    });
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    getInvoiceRecords() {
        this.setState({ isLoading: true })
        GetInvoice({ order_id: this.props.orderData.id })
            .then((result) => {
                if (result.is_success) {
                    this.setState({
                        invoice: result.data
                    })
                }
            })
            .catch(err => console.log(err))
            .finally(() => this.setState({ isLoading: false }))
    }

    getExpensesRecords() {
        this.setState({ isLoading: true });
        GetAllOrderExpenses({ order_id: this.props.orderData.id })
            .then((result) => {
                if (result.is_success) {
                    this.setState({
                        expenses: result.data
                    })
                }
            })
            .catch(err => console.log(err))
            .finally(() => this.setState({ isLoading: false }))
    }

    switchTabs = (tab) => {
        this.setState({ active_tab: tab.tab }, () => {
            if (this.state.active_tab == 0) {
                this.getExpensesRecords()
            } else if (this.state.active_tab == 1) {
                this.getBillingRecords()
            } else if (this.state.active_tab == 2) {
                this.getInvoiceRecords()
            } else {
                this.getPaymentRecords()
            }
        })
    }

    render() {
        console.log('....this.state.dailyTrans..........',this.state.dailyTrans != null)
        return (
            // <SafeAreaView style={styles.container}>

            //     {
            //         this.state.isLoading && <OverlayLoader visible={this.state.isLoading} />
            //     }

            //     <View style={styles.tabContainer}>
            //         {this.state.tabs.map(tab => {
            //             return (
            //                 <TouchableOpacity key={tab.tab} style={[{ backgroundColor: tab.tab === this.state.active_tab ? Colors.danger : Colors.primary }, styles.tab]}
            //                     onPress={() => this.switchTabs(tab)}>
            //                     <Text style={{ color: Colors.white }}>{tab.name}</Text>
            //                 </TouchableOpacity>
            //             )
            //         })}
            //     </View>

            //     {this.state.active_tab == 0 &&
            //         <BaseAccountingRecords
            //             isLoading={this.state.isLoading}
            //             data={this.state.expenses}
            //             render={(data) => <ExpensesRecords expenses={data} />}
            //         />
            //     }

            //     {this.state.active_tab == 1 &&
            //         <BaseAccountingRecords
            //             isLoading={this.state.isLoading}
            //             data={this.state.bills}
            //             render={(data) => <BillingRecords bills={data} />}
            //         />
            //     }

            //     {this.state.active_tab == 2 &&
            //         <BaseAccountingRecords
            //             isLoading={this.state.isLoading}
            //             data={this.state.invoice}
            //             render={(data) => <InvoiceRecords invoice={data} />}
            //         />
            //     }

            //     {this.state.active_tab == 3 &&
            //         <BaseAccountingRecords
            //             isLoading={this.state.isLoading}
            //             data={this.state.payments}
            //             render={(data) => <PaymentRecords payments={data} />}
            //         />
            //     }
            // </SafeAreaView>
            <SafeAreaView>
                {this.state.isLoading == false ?
                <>
               {this.state.dailyTrans != null?
                    <Order_CashFlow
                        navigation={this.props.navigation}
                        order_id={this.props.orderData.id}
                        daily_Trans={this.state.dailyTrans}
                        subproject_name={this.state.subproject_name}
                        subproject_id={this.state.subproject_id}
                    />
                    :
                    <View style={{width:windowWidth,height:windowHeight/1.25,justifyContent:'center'}}>
                        <EmptyScreen />
                    </View>
               }
                    </>
                    :
                    <OverlayLoader /> 
                }
            </SafeAreaView>
        )
    }
}

function EmptyScreen() {
    return (
        <>
            <View style={{ alignItems: 'center' }}>
                <LottieView
                    style={{
                        width: 180,
                        height: 180,
                        alignSelf: 'center'
                    }}
                    source={require('../../assets/lottie/no-result-found.json')}
                    autoPlay loop
                />
            </View>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: 'grey' }}>No records found !</Text>
            </View>
        </>
    )
}

function BaseAccountingRecords(props) {
    if (props.isLoading) {
        return null;
    }

    if (Array.isArray(props.data) && props.data.length == 0) {
        return <EmptyScreen />
    }

    if (typeof props.data == 'undefined') {
        return <EmptyScreen />
    }

    return props.render(props.data)
}

function ExpensesRecords({ expenses }) {
    return (
        <>
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.tableHeader}>
                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Bill</Text>
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Amount</Text>
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Paid On</Text>
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Payment Mode</Text>
                    </View>
                </View>
            </View>

            <ScrollView>
                {
                    expenses.map((item) => {
                        return (
                            <View style={[{ flexDirection: 'row' }, { marginTop: 10 }]} key={item.id}>
                                <View style={[styles.tableHeader, { backgroundColor: Colors.lightGrey }]}>
                                    <Text style={{ alignSelf: 'center' }}>{'#'}{item.bill_number}</Text>
                                </View>

                                <View style={[styles.tableHeader, { backgroundColor: Colors.lightGrey }]}>
                                    <Text style={{ alignSelf: 'center' }}>{'₹'}{item.amount}</Text>
                                </View>

                                <View style={[styles.tableHeader, { backgroundColor: Colors.lightGrey }]}>
                                    <Text style={{ alignSelf: 'center' }}>{showDateAsClientWant(item.paid_on)}</Text>
                                </View>

                                <View style={[styles.tableHeader, { backgroundColor: Colors.lightGrey }]}>
                                    <Text style={{ alignSelf: 'center' }}>{item.payment_type}</Text>
                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>
        </>
    )
}


function BillingRecords({ bills }) {
    const navigation = useNavigation();

    return (
        <>
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.tableHeader}>
                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Bill Number</Text>
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Billed For</Text>
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Amount</Text>
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Date</Text>
                    </View>
                </View>
            </View>

            <ScrollView>
                {
                    bills.map((item) => {
                        return (

                            <TouchableOpacity
                                onLongPress={() => {
                                    navigation.navigate("AddExpenses", {
                                        id: item.id
                                    })
                                }}
                                key={item.id}
                            >
                                <View style={[{ flexDirection: 'row' }, { marginTop: 10 }]}>
                                    <View style={[styles.tableHeader, { backgroundColor: Colors.lightGrey }]}>
                                        <Text style={{ alignSelf: 'center' }}>{'#'}{item.bill_number}</Text>
                                    </View>

                                    <View style={[styles.tableHeader, { backgroundColor: Colors.lightGrey }]}>
                                        <Text style={{ alignSelf: 'center' }}>{item.bill_for}</Text>
                                    </View>

                                    <View style={[styles.tableHeader, { backgroundColor: Colors.lightGrey }]}>
                                        <Text style={{ alignSelf: 'center' }}>{'₹'}{item.amount}</Text>
                                    </View>

                                    <View style={[styles.tableHeader, { backgroundColor: Colors.lightGrey }]}>
                                        <Text style={{ alignSelf: 'center' }}>{showDateAsClientWant(item.billed_on)}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
        </>
    )
}

function InvoiceRecords({ invoice }) {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, marginBottom: 20 }}>
            <ScrollView>
                <View style={styles.rowContainer}>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Invoice Number:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>#{invoice.invoice_number}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Invoice Date:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>{invoice.invoice_date}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Total Items:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>{invoice.total_item}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Sub Total:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>₹ {invoice.sub_total}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Transport Charges:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>₹ {invoice.transport_charges}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Installation Charges:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>₹ {invoice.installation_charges}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Additional Charges:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>₹ {invoice.additional_charges}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Total Tax:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>₹ {invoice.total_tax}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Discount:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>₹ {invoice.discount}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Grand Total:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>₹ {invoice.grand_total}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Paid Amount:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>₹ {invoice.paid_amount}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Amount Due:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>₹ {invoice.amount_due}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Excess Amount:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>₹ {invoice.excess_amount}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Paid Status:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>{invoice.paid_status.toUpperCase()}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Received Copy:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>{invoice.received_copy.toUpperCase()}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text>Billing Type:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                            <Text>{invoice.billing_type.toUpperCase()}</Text>
                        </View>
                    </View>

                </View>
            </ScrollView>
            <View style={{ paddingHorizontal: 30 }}>
                <PressableButton text={'Update Invoice'} onPress={() => {
                    navigation.navigate("OrderInvoice", {
                        id: invoice.id
                    });
                }} />
            </View>
        </View>
    );
}

function PaymentRecords({ payments }) {

    return (
        <>
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.tableHeader}>
                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Invoice</Text>
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Amount</Text>
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Paid On</Text>
                    </View>

                    <View style={styles.tableHeader}>
                        <Text style={{ alignSelf: 'center', fontSize: 12, color: Colors.white }}>Payment Mode</Text>
                    </View>
                </View>
            </View>

            <ScrollView>
                {
                    payments.map((item) => {
                        return (
                            <View style={[{ flexDirection: 'row' }, { marginTop: 10 }]} key={item.id}>
                                <View style={[styles.tableHeader, { backgroundColor: Colors.lightGrey }]}>
                                    <Text style={{ alignSelf: 'center' }}>{'#'}{item.invoice_number}</Text>
                                </View>

                                <View style={[styles.tableHeader, { backgroundColor: Colors.lightGrey }]}>
                                    <Text style={{ alignSelf: 'center' }}>{'₹'}{item.amount}</Text>
                                </View>

                                <View style={[styles.tableHeader, { backgroundColor: Colors.lightGrey }]}>
                                    <Text style={{ alignSelf: 'center' }}>{showDateAsClientWant(item.paid_on)}</Text>
                                </View>

                                <View style={[styles.tableHeader, { backgroundColor: Colors.lightGrey }]}>
                                    <Text style={{ alignSelf: 'center' }}>{item.payment_type}</Text>
                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>
        </>
    )
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    tableHeader: {
        width: '25%',
        justifyContent: 'center',
        padding: 3,
        backgroundColor: Colors.primary
    },
    tab: {
        margin: 5,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        elevation: 4,
        borderRadius: 10
    },
    tabContainer: {
        margin: 5,
        flexDirection: "row",
        flexWrap: 'wrap',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowContainer: {
        paddingHorizontal: 6,
        backgroundColor: Colors.white,
        borderRadius: 4,
        elevation: 10,
        margin: 10,
        shadowColor: Colors.grey,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    row: {
        marginTop: 0,
        flexDirection: 'row',
        marginBottom: 0,
        borderBottomWidth: 1.5,
        borderBottomColor: '#cfcfcf'
    },
    rowLeft: {
        width: '47%',
        backgroundColor: '#fff',
        paddingLeft: 0,
        paddingVertical: 10,
        justifyContent: 'center',
        marginTop: 0
    },
    rowRight: {
        flexDirection: "row",
        width: '53%',
        marginLeft: 0,
        backgroundColor: '#fff',
        marginTop: 0,
        paddingVertical: 10,
        justifyContent: 'space-evenly'
    },
    button_style: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignContent: 'center'
    }

});