import moment from "moment";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Alert, Button, Image, StyleSheet, Text, TextInput, View, ToastAndroid, ActivityIndicator, BackHandler } from "react-native";
import Colors from "../../config/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components";
import AppContext from '../../context/AppContext';
import { verify_upi, transfer_amount } from "../../services/APIServices";
import AuthService from "../../services/CashFlow/Auth";
import { TouchableOpacity } from "react-native";

const ScannAndPay = (props) => {
    const context = useContext(AppContext);
    const [upi, setUpi] = useState("");
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(props.route.params.data.amount);
    const [status, setStatus] = useState(false);
    const [upi_holder_name, setUpi_holder_name] = useState(null);
    const [type, setType] = useState(null);
    const [note, setNote] = useState(null);
    const inputRef = useRef(null);

    const checkVerifiedUser = () => {
        console.log("this is your upi-->>>", upi);
        if (upi) {
            Alert.alert("verifying your upi id please wait");
            setUpi("");
        }
    };

    useEffect(() => {
        // console.log("props-orderData-from-payment-page...........",props.route.params.type); 
        inputRef.current.focus();
        setAmount(props.route.params.data.amount)
        setType(props.route.params.type)
        setUpi(props.route.params.data.upi);
        setUpi_holder_name(props.route.params.data.upi_holder_name);
        const backAction = () => {
            if (loading == false) {
                props.navigation.goBack();
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, [])

    const VerifyUpi = () => {
        let value = {
            upi_id: upi,
        }
        setLoading(true)
        verify_upi(value).then((res) => {
            console.log('.....res.......', res);
            if (res.message == 'Upi Verification Successfull') {
                setStatus(true)
                setUpi_holder_name(res.upi_holder_name)
            } else {
                Alert.alert(res.message);
            }

        }).catch((err) => { }).finally(() => { setLoading(false) })
    }
    const Transfer_amount = () => {
        let data = {
            beneficiary_name: upi_holder_name,
            amount: amount,
            upi_id: upi

        }
        console.log('.......data.....', data)
        setLoading(true)
        transfer_amount(data).then((res) => {
            console.log('........TransferAmount..res........', JSON.parse(res))

            if (JSON.parse(res).status == 'success') {
                Add_expanse()
                ToastAndroid.show(
                    "Payment Successfull",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
                props.navigation.pop(2) // pop(2) use for back 2 screen 
            } else {
                ToastAndroid.show(
                    "Payment Failed",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
            }
        }).catch((err) => {
            console.log('...TransferAmount err .......', err);
            ToastAndroid.show(
                "Payment Failed",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }).finally(() => { setLoading(false) })
    }

    const Add_expanse = async () => {
        let result = await AuthService.expenseAdd(
            props.route.params.data.newDate,
            props.route.params.data.project_id,
            props.route.params.data.project_name,
            props.route.params.data.paymethod_name,
            props.route.params.data.vendorId,
            props.route.params.data.catVal,
            props.route.params.data.amount,
            props.route.params.data.event,
            props.route.params.data.memo,
            props.route.params.data.localUri,
            props.route.params.data.cust_code,
            props.route.params.data.extraData_id,
            props.route.params.data.subproject_name
        );
        // console.log('............result................',result)
        if (result == "Failed") {
            ToastAndroid.show(
                "We are faceing some server issues",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
            this.setState({
                visible: false,
            });
        } else {
            if (result.status == "2") {
                ToastAndroid.show(
                    "We are faceing some issues",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
                this.setState({
                    visible: false,
                });
            } else if (result.status == "0") {
                ToastAndroid.show(
                    "We are faceing some issues",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
                this.setState({
                    visible: false,
                });
            } else {
                if (result.status == "1") {
                    ToastAndroid.show(
                        "Expense added successfully",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                    this.setState({
                        visible: false,
                    });
                }
            }
        }
    }

    return (
        <SafeAreaView style={[style.safeArea]}>
            <Header backArrowDisable={loading} showHome={false}/>

            <View style={style.container}>
                <Text style={style.ToPayAmount}>{(props.route.params.data.upi_holder_name).charAt(0).toUpperCase()}{((props.route.params.data.upi_holder_name).split(' ')[1]).charAt(0).toUpperCase()}</Text>
                <View style={style.upiContainer}>
                    <Text>Paying {props.route.params.data.upi_holder_name}</Text>
                    <Text>{props.route.params.data.upi}</Text>
                    <Text>Banking Name: {(props.route.params.data.upi_holder_name).toUpperCase()}</Text>
                </View>

                {/* <View style={{ marginTop: 20 }}>
                            <Text>Amount :</Text>
                            <TextInput
                                style={style.PayInput}
                                value={amount}
                                placeholder="select amount to pay"
                                onChangeText={(amount) => setAmount(amount)}
                                keyboardType="numeric"
                            />
                        </View> */}
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={{ fontSize: 30 }}>₹ </Text>
                    <Text style={{ fontSize: 40 }}>{amount}</Text>
                </View>
                <View>
                    <TextInput
                        ref={inputRef}
                        style={style.PayInput}
                        value={note}
                        placeholder="Add a note"
                        onChangeText={(note) => setNote(note)}
                    />
                </View>
                <View style={{ marginTop: 50 }}>
                    {!loading ?
                        // <Button style={style.Verify} color={Colors.primary} title="Send Money" onPress={() => Transfer_amount()} />
                        <TouchableOpacity onPress={() => Transfer_amount()} style={style.Verify}>
                            <Text style={{ color: Colors.white, fontWeight: '500' }}>Pay</Text>
                        </TouchableOpacity>
                        :
                        <ActivityIndicator size="small" color={Colors.white} style={style.Verify} />
                    }
                </View>



            </View>
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    safeArea: {
        // flex: 1,
        // justifyContent: 'center',
        // marginHorizontal: 17,

    },
    container: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: 'center'
    },
    ToPayAmount: {
        fontSize: 18,
        textAlign: "center",
        borderColor: "white",
        borderWidth: 1,
        width: 50,
        height: 50,
        paddingTop: 10,
        // marginBottom: 20,
        marginTop: 100,
        borderRadius: 10,
        backgroundColor: Colors.primary,
        color: "white",
    },
    UpiInput: {
        borderColor: "grey",
        borderWidth: 1,
        width: 320,
        height: 50,
        paddingLeft: 20,
        fontSize: 17,
        marginBottom: 20,
        marginTop: 40,
        borderRadius: 6,
    },
    PayInput: {
        borderColor: "grey",
        borderWidth: 1,
        width: 150,
        height: 50,
        paddingLeft: 20,
        fontSize: 17,
        marginBottom: 20,
        borderRadius: 6,
    },
    Verify: {
        marginTop: 20,
        width: 120,
        height: 40,
        padding: 5,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
    },
    upiLogo: {
        width: 50,
        height: 50,
    },
    upiContainer: {
        marginTop: 10,
        justifyContent: "center",
        height: 60,
        paddingTop: 5,
        borderRadius: 12,
        alignItems: 'center'
    },
});

export default ScannAndPay;
