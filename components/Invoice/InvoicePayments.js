import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    View,
    TextInput,
    Pressable
} from "react-native";
import Colors from "../../config/colors";
import DateAndTimePicker from "../DateAndTimePicker";
import OverlayLoader from "../OverlayLoader";
import { Ionicons, Entypo, FontAwesome5   } from "@expo/vector-icons";
import PressableButton from "../PressableButton";
import AwesomeAlert from 'react-native-awesome-alerts';
import { MakeInvoicePayment } from "../../services/OrderService";
import { getFormattedDate } from "../../utils/Util";


function RadioInputStatus(props) {
    return(
        <Ionicons
            name={ props.isChecked === true ? "radio-button-on" : "radio-button-off"}
            color={ (props.color) ? props.color : Colors.primary  }
            size={ (props.size) ? props.size : 20 }
        />
    )
}

export default class InvoicePayments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaderVisible: false,
            invoice_id: this.props.invoiceData?.id,
            invoiceData: this.props?.invoiceData,
            isNeedToShowAddPaymentBtn: false,
            isPaymentCleared: false,
            paid_type: 'cash',
            paid_amount: '0',
            cash_collector: '',
            cash_collect_date: '',
            cheque_number: '',
            cheque_date: '',
            utr: '',

            showAlertModal: false,
            alertTitle: '',
            alertMessage: ''
        }
    }

    componentDidMount() {
        this.setState({
            isPaymentCleared: (this.state.invoiceData.paid_status == 'paid') ? true : false
        });
    }

    checkAndRenderAddPaymentsButton = () => {
        if(parseFloat(this.state.paid_amount) > 0) {
            this.setState({isNeedToShowAddPaymentBtn : true});
        } else {
            this.setState({isNeedToShowAddPaymentBtn : false});
        }
    }

    hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
	}

    addPaymentsForInvoice = () => {
        const data = {};
        data.invoice_id = this.state.invoice_id;
        data.amount = this.state.paid_amount;
        if(this.state.paid_type == 'cash') {
            data.payment_type = 'cash';
            data.cash_collected_by = this.state.cash_collector;
            data.cash_collected_date = getFormattedDate(this.state.cash_collect_date);
        } else if(this.state.paid_type == 'cheque') {
            data.payment_type = 'cheque';
            data.cheque_number = this.state.cheque_number;
            data.cheque_date = getFormattedDate(this.state.cheque_date);
        } else {
            data.payment_type = 'online';
            data.utr_number = this.state.utr;
        }

        this.setState({isLoaderVisible: true});
        MakeInvoicePayment(data)
        .then( (result) => {
            if(result.is_success) {
                const invoiceData = result.data.invoice;
                this.setState({
                    showAlertModal: true,
                    alertTitle: 'Success',
                    alertMessage: result.message,
                    paid_amount: '0',
                    isNeedToShowAddPaymentBtn: false,
                    cash_collector: '',
                    cash_collect_date: '',
                    cheque_number: '',
                    cheque_date: '',
                    utr: '',
                    isPaymentCleared: (invoiceData.paid_status == 'paid') ? true : false
                });
                this.props.callbackAfterMakePayment(invoiceData);
            } else {
                this.setState({
                    showAlertModal: true,
                    alertTitle: 'Error',
                    alertMessage: result.message
                });
            }
        })
        .catch( (err) => console.log(err) )
        .finally( () => {
            this.setState({isLoaderVisible: false});
        });
    }

    render() {

        if(this.state.isPaymentCleared) {
            return (
                <View style={{ height: 40, padding: 10, margin: 10, justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: 5 }}>
                    <Text style={{ alignSelf: 'center', color: Colors.white, fontSize: 15 }}><FontAwesome5 name="check" size={15} color="white" /> Payments is cleared for this invoice</Text>
                </View>
            )
        } else {
            return (
                <>

                    { this.state.isLoaderVisible && <OverlayLoader visible={this.state.isLoaderVisible} /> }
                    
                    <View style={{ borderColor: 'red', borderRadius: 30, borderBottomColor: 'red' }}>
                        <View style={styles.row}>
                            <View style={styles.rowLeft}>
                                <Text style={styles.textInput}>Paid Amount:</Text>
                            </View>
                            <View style={styles.rowRight}>
                                <TextInput
                                    value={this.state.paid_amount}
                                    autoCompleteType="off"
                                    autoCapitalize="words"
                                    keyboardType="numeric"
                                    style={[styles.textInput, { backgroundColor: Colors.white }]}
                                    onChangeText={(paid_amount) => {
                                        this.setState({ paid_amount });
                                    }}
                                    onEndEditing={ () => {this.checkAndRenderAddPaymentsButton() } }
                                />
                            </View>
                        </View>
    
                        <View style={styles.row}>
                            <View style={[styles.rowLeft, { width: '40%' }]}>
                                <Text style={styles.textInput}>Paid Type:</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                flex: 1,
                                justifyContent: 'center'
                            }}>
                                <TouchableOpacity
                                    style={styles.radioItem}
                                    onPress={() => this.setState({ paid_type: 'cash' })}
                                >
                                    <Text>Cash</Text>
                                    <RadioInputStatus isChecked = { this.state.paid_type == 'cash' ? true : false } />
                                </TouchableOpacity>
    
    
                                <TouchableOpacity
                                    style={styles.radioItem}
                                    onPress={() => this.setState({ paid_type: 'cheque' })}
                                >
                                    <Text>Cheque</Text>
                                    <RadioInputStatus isChecked = { this.state.paid_type == 'cheque' ? true : false } />
                                </TouchableOpacity>
    
                                <TouchableOpacity
                                    style={styles.radioItem}
                                    onPress={() => this.setState({ paid_type: 'online' })}
                                >
                                    <Text>Online</Text>
                                    <RadioInputStatus isChecked = { this.state.paid_type == 'online' ? true : false } />
                                </TouchableOpacity>
                            </View>
                        </View>
    
                        <View style={{ marginTop: 10 }}>
                            {this.state.paid_type == 'cash' && <View style={{ margin: 10 }}>
    
                                <Text style={{ marginBottom: 10 }}>Cash Collecting By</Text>
                                <TextInput
                                    value={this.state.cash_collector}
                                    autoCompleteType="off"
                                    autoCapitalize="words"
                                    keyboardType="default"
                                    placeholder="Cash collecting by"
                                    style={[styles.textInput, { backgroundColor: Colors.white }]}
                                    onChangeText={(cash_collector) => this.setState({ cash_collector })}
                                />
    
                                <View style={{ marginTop: 10 }}>
                                    <DateAndTimePicker
                                        mode={"date"}
                                        label={"Date:"}
                                        LabelStyle={ { color: Colors.dark } }
                                        customContainerStyle={ { marginBottom: 0 } }
                                        value={this.state.cash_collect_date}
                                        onChange={ (value) => this.setState({ cash_collect_date: value }) }
                                    />
                                </View>
                            </View>}
    
                            {this.state.paid_type == 'cheque' && <View>
                                <Text style={{ marginBottom: 10 }}>Cheque Number :</Text>
                                <TextInput
                                    value={this.state.cheque_number}
                                    autoCompleteType="off"
                                    autoCapitalize="words"
                                    keyboardType="default"
                                    placeholder="Cheque Number"
                                    style={[styles.textInput, { backgroundColor: Colors.white }]}
                                    onChangeText={(cheque_number) => this.setState({ cheque_number })}
    
                                />
    
                                <View style={{ marginTop: 10 }}>
                                    <DateAndTimePicker
                                        mode={"date"}
                                        label={"Date:"}
                                        LabelStyle={ { color: Colors.dark } }
                                        customContainerStyle={ { marginBottom: 0 } }
                                        value={this.state.cheque_date}
                                        onChange={ (value) => this.setState({ cheque_date: value }) }
                                    />
                                </View>
                            </View>}
    
                            {this.state.paid_type == 'online' && <View>
                                <Text style={{ marginBottom: 10 }}>UTR :</Text>
                                <TextInput
                                    value={this.state.utr}
                                    autoCompleteType="off"
                                    keyboardType='numeric'
                                    placeholder="UTR"
                                    style={[styles.textInput, { backgroundColor: Colors.white }]}
                                    onChangeText={(utr) => this.setState({ utr })}
    
                                />
                            </View>}
                        </View>
    
                        { (this.state.isNeedToShowAddPaymentBtn) && <View style={{ marginBottom: 10, marginTop: 5 }}>
                                <PressableButton 
                                btnStyle={{alignSelf: 'flex-end', width: '30%', height: 30 } }
                                text={'Add Payments'}
                                btnTextStyle={ { fontSize: 12 } }
                                onPress={this.addPaymentsForInvoice}
                            />
                        </View>  }
                    </View>
    
                    <AwesomeAlert
                        show={this.state.showAlertModal}
                        showProgress={false}
                        title={this.state.alertTitle}
                        message={this.state.alertMessage}
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={false}
                        showConfirmButton={true}
                        cancelText="cancel"
                        confirmText="Ok"
                        confirmButtonColor="#DD6B55"
                        onCancelPressed={() => {
                            this.hideAlert();
                        }}
                        onConfirmPressed={() => {
                            this.hideAlert();
                        }}
                    />
                </>
            );
        }
    }
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.textColor,
        marginBottom: 2,
    },
    subText: {
        fontSize: 13,
        color: Colors.textColor,
    },

    qtyContainer: {
        width: "30%",
        alignItems: "center",
        justifyContent: "center",
    },

    pricingItemContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    pricingText: {
        fontSize: 14,
        color: Colors.textColor,
    },

    btn: {
        marginTop: 15,
        height: 50,
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        borderRadius: 4,
    },

    row: {
        marginTop: 5,
        flexDirection: 'row'
    },
    rowLeft: {
        width: '70%',
        justifyContent: 'center',
        //backgroundColor: '#f9f9f9',
        //alignItems: 'center'
    },
    rowRight: {
        width: '30%', marginLeft: 5
    },


    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    inputLable: {
        //fontSize: 16,
        color: Colors.textColor,
        marginBottom: 10,
        // opacity: 0.8,
    },
    textInput: {
borderWidth:1,
        padding: 9,
        fontSize: 14,
        width: "100%",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
    },
    row_item: {
        fontSize: 14,
        color: Colors.textColor,
        marginBottom: 3,
        fontWeight: "normal",
        // opacity: 0.9,
    },

    radioItem: {
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }
});