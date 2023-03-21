import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    View,
    TextInput,
    Pressable,
    Dimensions,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView
} from "react-native";
import Colors from "../../config/colors";
import DateAndTimePicker from "../../components/DateAndTimePicker";
import OverlayLoader from "../../components/OverlayLoader";
import { Ionicons, Entypo, FontAwesome5 } from "@expo/vector-icons";
import PressableButton from "../../components/PressableButton";
import AwesomeAlert from 'react-native-awesome-alerts';
import Header from "../../components/Header";
import { getFormattedDate } from "../../utils/Util";
import { AddBillExpenses } from "../../services/OrderService";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function RadioInputStatus(props) {
    return(
        <Ionicons
            name={ props.isChecked === true ? "radio-button-on" : "radio-button-off"}
            color={ (props.color) ? props.color : Colors.primary  }
            size={ (props.size) ? props.size : 20 }
        />
    )
}

export default class AddExpenses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaderVisible: false,
            bill_id: this.props.route.params.id,
            paid_type: 'cash',
            amount: '',
            cash_collector: '',
            cash_collect_date: '',
            cheque_number: '',
            cheque_date: '',
            utr: '',

            showAlertModal: false,
            alertTitle: '',
            alertMessage: '',
            formErrors: {}
        }
    }

    hideAlert = () => {
		this.setState({
			showAlertModal: false
		}, () => {
            this.props.navigation.goBack()
        });
	}

    validateData = () => {

        let errors = {}

        if(this.state.amount == '') {
            errors.amount = "Please enter an amount"
        }

        this.setState({
            formErrors: {}
        });

        if( Object.keys(errors).length != 0 ) {
            this.setState({
                formErrors: errors
            })
            return false;
        }

        return true;
    }

    addExpenses = () => {
        if(this.validateData()) {
            const data = {};
            data.bill_id = this.state.bill_id;
            data.amount = this.state.amount;
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
            AddBillExpenses(data)
            .then( (result) => {
                if(result.is_success) {
                    this.setState({
                        showAlertModal: true,
                        alertTitle: 'Success',
                        alertMessage: 'Expences added successfully',
                    });
                } else {
                    this.setState({
                        showAlertModal: true,
                        alertTitle: 'Alert',
                        alertMessage: result.message
                    });
                }
            } )
            .catch( (err) => console.log(err) )
            .finally( () => {
                this.setState({isLoaderVisible: true});
            } )
        }
    }

    render() {
        return (
            <>
                {this.state.isLoaderVisible && <OverlayLoader />}
                <SafeAreaView style={styles.container}>
                    <Header title={"Add Expenses"} />
                        <View style={styles.form}>
                            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                                <View style={[styles.rowContainer, { marginTop: 0 }]}>

                                    <View style={[styles.row, { paddingVertical: Platform.OS === 'android' ? 4 : 4, paddingBottom: Platform.OS === 'android' ? 2 : 4, borderBottomWidth: 0.8 }]}>
                                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                            <Text style={styles.inputLable}>Amount:</Text>
                                        </View>
                                        <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                                            <TextInput
                                                value={this.state.amount}
                                                autoCompleteType="off"
                                                keyboardType="numeric"
                                                style={styles.textInput}
                                                onChangeText={(amount) =>
                                                    this.setState({ amount: amount })
                                                }
                                            />
                                        </View>
                                    </View>
                                    {this.state.formErrors.amount && <Text style={{ color: Colors.danger }}>{this.state.formErrors.amount}</Text>}


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
                                                <RadioInputStatus isChecked={this.state.paid_type == 'cash' ? true : false} />
                                            </TouchableOpacity>


                                            <TouchableOpacity
                                                style={styles.radioItem}
                                                onPress={() => this.setState({ paid_type: 'cheque' })}
                                            >
                                                <Text>Cheque</Text>
                                                <RadioInputStatus isChecked={this.state.paid_type == 'cheque' ? true : false} />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.radioItem}
                                                onPress={() => this.setState({ paid_type: 'online' })}
                                            >
                                                <Text>Online</Text>
                                                <RadioInputStatus isChecked={this.state.paid_type == 'online' ? true : false} />
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
                                                    LabelStyle={{ color: Colors.dark }}
                                                    customContainerStyle={{ marginBottom: 0 }}
                                                    value={this.state.cash_collect_date}
                                                    onChange={(value) => this.setState({ cash_collect_date: value })}
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
                                                    LabelStyle={{ color: Colors.dark }}
                                                    customContainerStyle={{ marginBottom: 0 }}
                                                    value={this.state.cheque_date}
                                                    onChange={(value) => this.setState({ cheque_date: value })}
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



                                </View>

                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={this.addExpenses}
                                >
                                    <Text style={{ fontSize: 18, color: Colors.white }}>Add Expense</Text>
                                </TouchableOpacity>
                            </KeyboardAwareScrollView>
                        </View>

                    <AwesomeAlert
                        show={this.state.showAlertModal}
                        showProgress={false}
                        title={this.state.alertType}
                        message={this.state.alertMessage}
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={false}
                        showConfirmButton={true}
                        cancelText="cancel"
                        confirmText="Ok"
                        confirmButtonColor={Colors.primary}
                        onCancelPressed={() => {
                            this.hideAlert();
                        }}
                        onConfirmPressed={() => {
                            this.hideAlert();
                        }}
                    />
                </SafeAreaView>
            </>
        )
    }
}



const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d9dfe0',
        justifyContent: "center",
        alignItems: "center",
    },

    box: {
        borderColor: "#eee",
        borderWidth: 1,
        padding: 10,
        margin: 2,
    },

    boxHead: {
        fontFamily: 'serif',
        fontSize: 16,
        margin: 5,
        color: Colors.grey,
        fontWeight: 'bold'
    },
    lsitContainer: {
        flex: 1,
    },
    card: {
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 8,
        paddingVertical: 8,
        backgroundColor: Colors.white,
        // borderBottomWidth: 0.5,
        borderColor: Colors.textInputBorder,
    },
    qtyContainer: {
        width: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    titleText: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.grey,
        marginBottom: 2,
    },
    subText: {
        fontSize: 13,
        color: Colors.grey,
        opacity: 0.9,
        marginBottom: 2,
    },
    modalOverlay: {
        justifyContent: "center",
        alignItems: "center",
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.white,
    },
    itemModalContainer: {
        flex: 1,
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.white,
    },
    itemModalHeader: {
        height: 55,
        flexDirection: "row",
        width: "100%",
        backgroundColor: Colors.primary,
        elevation: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    headerBackBtnContainer: {
        width: "15%",
        height: 55,
        paddingLeft: 5,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    headerTitleContainer: {
        width: "70%",
        paddingLeft: 20,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
    },
    itemModalBody: {
        flex: 1,
        height: windowHeight - 55,
    },
    form: {
        flex: 1,
        paddingVertical: 4,
        paddingHorizontal: 5,
        //borderRadius: 10,
    },
    iconPickerContainer: {
        flexDirection: "row",
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "space-between",
    },
    imageContainer: {
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 3,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    image: {
        height: 50,
        width: 50,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    inputLable: {
        fontSize: 16,
        color: Colors.grey,
        marginBottom: 10,
        opacity: 0.8,
    },
    textInput: {
borderWidth:1,
        padding: 9,
        fontSize: 14,
        width: "100%",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        //backgroundColor: Colors.textInputBg,
    },
    submitBtn: {
        marginTop: 15,
        height: 45,
        width: "100%",
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
    },

    textInput: {
borderWidth:1,
        fontSize: 14,
        width: "100%",
        borderWidth: 0,
        // borderRadius: 4,
        borderColor: "#fff",
        backgroundColor: "#fff",
        marginBottom: 0,
        color: Colors.black,
        opacity: 0.8
    },
    submitBtn: {
        marginTop: 15,
        height: 45,
        width: "100%",
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
    },

    rowContainer: {
        borderColor: "#d2d1cd",
        borderWidth: 0,
        borderRadius: 5,
        paddingVertical: 0,
        paddingHorizontal: 5,
        backgroundColor: Colors.white,
    },

    row: {
        flexDirection: 'row',
        borderBottomColor: Colors.lightGrey,
        borderBottomWidth: 0.5,
        paddingBottom: 7
    },

    rowTop: {
        flexDirection: 'row',
        borderBottomColor: '#cfcfcf',
        paddingBottom: 8
    },

    inputLable: {
        fontSize: 14,
        color: Colors.black,
        marginBottom: 0,
        opacity: 0.8,
    },

    rowRight: {
        flexDirection: "row",
        width: '53%',
        marginLeft: 10,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },

    rowLeft: {
        width: '47%',
        backgroundColor: '#fff',
        paddingLeft: 10,
        justifyContent: 'center',
    },

    divider: {
        width: "2%",
        borderLeftWidth: 0.3,
        alignSelf: 'center',
        height: 20,
        borderLeftColor: '#444',
        opacity: 0.4
    },
    radioItem: {
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }
});