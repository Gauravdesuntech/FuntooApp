import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, TextInput, View, ToastAndroid, ActivityIndicator, BackHandler } from "react-native";
import Colors from "../config/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components";
// import Header from "../components/CashFlow/component/accountDetails/Header";
import AppContext from "../context/AppContext";
import { verify_upi, transfer_amount } from "../services/APIServices";
import OverlayLoader from "../components/OverlayLoader"
import AuthService from "../services/CashFlow/Auth";
import { TouchableOpacity } from "react-native";

const NewPayment = (props) => {
    const context = useContext(AppContext);
    const [upi, setUpi] = useState("");
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(props.route.params.data.amount);
    const [status, setStatus] = useState(false);
    const [upi_holder_name, setUpi_holder_name] = useState(null);
    const [type, setType] = useState(null);

    const checkVerifiedUser = () => {
        console.log("this is your upi-->>>", upi);
        if (upi) {
            Alert.alert("verifying your upi id please wait");
            setUpi("");
        }
    };

    useEffect(() => {
        // console.log("props-orderData-from-payment-page...........",props.route.params.type); 
        setAmount(props.route.params.data.amount)
        setType(props.route.params.type)

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
        setLoading(true)
        transfer_amount(data).then((res) => {
            console.log('........TransferAmount..res........', JSON.parse(res))

            if (JSON.parse(res).status == 'success') {
                if(type == 'expense' ){
                    Add_expanse()
                }
                if(type == 'income' ){
                    Add_income()
                }
                // if(type == 'transfer' ){
                //     Add_expanse
                // }
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

    const Add_income = async () => {
        let result = await AuthService.incomeAdd(
            props.route.params.data.newDate,
             props.route.params.data.project_id,
             props.route.params.data.project_name,
             props.route.params.data.paymethod_name,
             props.route.params.data.catVal,
             props.route.params.data.amount,
             props.route.params.data.event,
             props.route.params.data.memo,
             props.route.params.data.localUri,
             props.route.params.data.cust_code,
             props.route.params.data.extraData_id,
             props.route.params.data.subproject_name
          );
          // console.log('.........result..........',result);
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
                  "Income added successfully",
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
    const Add_transfer = () => {

    }

    return (
        <SafeAreaView style={[style.safeArea]}>
            <Header backArrowDisable={loading} />

            <View style={style.container}>
                <Text style={style.ToPayAmount}>Amount to pay: ₹{amount}</Text>
                <View style={style.upiContainer}>
                    <Image style={style.upiLogo} source={{ uri: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/upi-icon.png' }} />
                    <Image style={style.upiLogo} source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/google-pay-2038779-1721670.png' }} />
                    <Image style={style.upiLogo} source={{ uri: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/phonepe-logo-icon.png' }} />
                    <Image style={style.upiLogo} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/825/825454.png' }} />
                </View>
                <TextInput
                    style={style.UpiInput}
                    placeholder="Please varify your @upi_id"
                    value={upi}
                    onChangeText={(text) => setUpi(text)}
                />
                {status ?
                    <>
                        <Text>{upi_holder_name}</Text>
                        <View style={{ marginTop: 20 }}>
                            <Text>Amount :</Text>
                            <TextInput
                                style={style.PayInput}
                                value={amount}
                                placeholder="select amount to pay"
                                onChangeText={(amount) => setAmount(amount)}
                                keyboardType="numeric"
                            />
                        </View>
                    </>
                    : null
                }
                {status ?
                    <>
                        {!loading ?
                            // <Button style={style.Verify} color={Colors.primary} title="Send Money" onPress={() => Transfer_amount()} />
                            <TouchableOpacity onPress={() => Transfer_amount()} style={style.Verify}>
                                <Text style={{ color: Colors.white, fontWeight: '500' }}>Send Money</Text>
                            </TouchableOpacity>
                            :
                            <ActivityIndicator size="small" color={Colors.white} style={style.Verify} />
                        }
                    </>
                    :
                    <>
                        {!loading ?
                            <TouchableOpacity onPress={() => VerifyUpi()} style={style.Verify}>
                                <Text style={{ color: Colors.white, fontWeight: '500' }}>Verify</Text>
                            </TouchableOpacity>
                            // <Button style={style.Verify} color={Colors.primary} title="Verify" onPress={() => VerifyUpi()} />
                            :
                            <ActivityIndicator size="small" color={Colors.white} style={style.Verify} />
                        }
                    </>
                }


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
    },
    ToPayAmount: {
        fontSize: 18,
        textAlign: "center",
        borderColor: "white",
        borderWidth: 1,
        width: 230,
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
        width: 320,
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
        flexDirection: "row",
        marginTop: 70,
        width: "90%",
        justifyContent: "space-evenly",
        // borderWidth: 1,
        // borderColor:"navy",
        height: 60,
        paddingTop: 5,
        borderRadius: 12,
        // backgroundColor:"white",
    },
    // PayUsingCard: {
    //     fontSize: 18,
    //     textAlign: "center",
    // 	width: 280,
    //     height: 40,
    //     paddingTop: 10,
    //     marginTop: 100,
    //     borderRadius: 10,
    // },
    // cardContainer: {
    //     flexDirection: "row",
    //     marginTop:20,
    //     width: "90%",
    //     justifyContent: "space-evenly",
    //     // borderWidth: 1,
    //     // borderColor:"navy",
    //     height: 60,
    //     paddingTop: 5,
    //     borderRadius:12,
    // }

});

export default NewPayment;
