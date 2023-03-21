import moment from "moment";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Alert, Button, Image, StyleSheet, Text, TextInput, View, ToastAndroid, ActivityIndicator, BackHandler, Dimensions } from "react-native";
import Colors from "../../config/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components";
import AppContext from '../../context/AppContext';
import { verify_bank_account, transfer_amount, add_bank_details } from "../../services/APIServices";
import AuthService from "../../services/CashFlow/Auth";
import { TouchableOpacity } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';

const BankPayment = (props) => {
    const context = useContext(AppContext);
    const [acc_no, setAcc_no] = useState("");
    const [re_acc_no, setRE_Acc_no] = useState("");
    const [ifsc, setIFSC] = useState("");
    const [bank_name, setBank_name] = useState("");
    const [requesttype, setRequesttype] = useState("");
    const [account_Holder_Name, setAccount_Holder_Name] = useState("");
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState([
        {
          id: 1,
          name: 'NEFT'
        },
        {
          id: 2,
          name: 'IMPS'
        }
      ]);

    useEffect(() => {
        // console.log('.................data..............',props.navigation)
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
        if (acc_no == '' || acc_no == null) {
            ToastAndroid.show(
                "Account Number is required",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        } else if (re_acc_no == '' || re_acc_no == null) {
            ToastAndroid.show(
                "Confirm account number is required",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        } else if (ifsc == '' || ifsc == null) {
            ToastAndroid.show(
                "Account ifsc is required",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        } else if (requesttype == '' || requesttype == null) {
            ToastAndroid.show(
                "Transfer type is required",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        } else {
            let value = {
                account_number: acc_no,
                confirm_acc_number: re_acc_no,
                account_ifsc: ifsc,
                bankname: bank_name != '' ? bank_name : 'N/A',
            }
            setLoading(true)
            verify_bank_account(value).then((res) => {
                if (res.status == 'TXN') {
                    console.log('.....res.......', res.Account_Holder_Name);
                    setAccount_Holder_Name(res.Account_Holder_Name)
                    addBankDetails(res.Account_Holder_Name)
                    // bankTransfer(res)
                    // Alert.alert(res.Account_Holder_Name);
                } else {
                    Alert.alert(res.message);
                }

            }).catch((err) => { }).finally(() => { setLoading(false) })
        }
    }
    const addBankDetails = (name) => {
        let data = {
            user_id: context.userData.id,
            account_number: acc_no,
            confirm_acc_number: re_acc_no,
            account_ifsc: ifsc,
            bankname: bank_name != '' ? bank_name : 'N/A',
            requesttype: requesttype,
            account_holder_name: name
        }
        console.log('.....called..........',data)
        add_bank_details(data).then(res => {
            console.log('...............res.........', res)
            gotoBack()
        }).catch(err => { console.log('.err.......', err) })
    }
    // const bankTransfer = (res) => {
    //     console.log('.....called..........')
    //     props.navigation.navigate("BankAmountTransfer", {
    //         data: props.route.params.data,
    //         beneficiary_name: res.Account_Holder_Name,
    //         account_number: acc_no,
    //         account_ifsc: ifsc,
    //         bankname: bank_name != '' ? bank_name : 'N/A',
    //         confirm_acc_number: re_acc_no,
    //         requesttype: requesttype,
    //     })
    // }

    // const Add_expanse = async () => {
    //     let result = await AuthService.expenseAdd(
    //         props.route.params.data.newDate,
    //         props.route.params.data.project_id,
    //         props.route.params.data.project_name,
    //         props.route.params.data.paymethod_name,
    //         props.route.params.data.vendorId,
    //         props.route.params.data.catVal,
    //         props.route.params.data.amount,
    //         props.route.params.data.event,
    //         props.route.params.data.memo,
    //         props.route.params.data.localUri,
    //         props.route.params.data.cust_code,
    //         props.route.params.data.extraData_id,
    //         props.route.params.data.subproject_name
    //     );
    //     // console.log('............result................',result)
    //     if (result == "Failed") {
    //         ToastAndroid.show(
    //             "We are faceing some server issues",
    //             ToastAndroid.LONG,
    //             ToastAndroid.BOTTOM,
    //             25,
    //             50
    //         );
    //         this.setState({
    //             visible: false,
    //         });
    //     } else {
    //         if (result.status == "2") {
    //             ToastAndroid.show(
    //                 "We are faceing some issues",
    //                 ToastAndroid.LONG,
    //                 ToastAndroid.BOTTOM,
    //                 25,
    //                 50
    //             );
    //             this.setState({
    //                 visible: false,
    //             });
    //         } else if (result.status == "0") {
    //             ToastAndroid.show(
    //                 "We are faceing some issues",
    //                 ToastAndroid.LONG,
    //                 ToastAndroid.BOTTOM,
    //                 25,
    //                 50
    //             );
    //             this.setState({
    //                 visible: false,
    //             });
    //         } else {
    //             if (result.status == "1") {
    //                 ToastAndroid.show(
    //                     "Expense added successfully",
    //                     ToastAndroid.LONG,
    //                     ToastAndroid.BOTTOM,
    //                     25,
    //                     50
    //                 );
    //                 this.setState({
    //                     visible: false,
    //                 });
    //             }
    //         }
    //     }
    // }
    const gotoBack = () => props.navigation.goBack();

    return (
        <SafeAreaView style={[style.safeArea]}>
            <Header backArrowDisable={loading} showHome={false} />

            <View style={style.container}>

                <View style={{ marginTop: 10 }}>
                    <View style={{ margin: 5 }}>
                        <TextInput
                            style={style.PayInput}
                            value={acc_no}
                            placeholder="Account Number"
                            onChangeText={(acc_no) => setAcc_no(acc_no)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={{ margin: 5 }}>
                        <TextInput
                            style={style.PayInput}
                            value={re_acc_no}
                            placeholder="Re-enter account number"
                            onChangeText={(re_acc_no) => setRE_Acc_no(re_acc_no)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={{ margin: 5 }}>
                        <TextInput
                            style={style.PayInput}
                            value={ifsc}
                            placeholder="IFSC"
                            autoCapitalize='characters'
                            onChangeText={(ifsc) => setIFSC(ifsc)}
                        />
                    </View>
                    <View style={{ margin: 5 }}>
                        <TextInput
                            style={style.PayInput}
                            value={bank_name}
                            placeholder="Bank Name"
                            onChangeText={(bank_name) => setBank_name(bank_name)}
                        />
                    </View>
                    <View style={{ margin: 5 }}>
                        {/* <TextInput
                            style={style.PayInput}
                            value={requesttype}
                            placeholder="Transfer Type"
                            onChangeText={(requesttype) => setRequesttype(requesttype)}
                        /> */}
                      <Dropdown
							value={requesttype}
							data={accounts}
							style={style.PayInput}
							search
							labelField="name"
							valueField="name"
							placeholder={!requesttype ? 'Select Category Name' : requesttype} 
							searchPlaceholder="Search..."
							onChange={(requesttype) => setRequesttype(requesttype.name)}
						/>
                    </View>
                </View>

                <View style={{ marginTop: 30 }}>
                    {!loading ?
                        <TouchableOpacity style={style.Verify} onPress={() => VerifyUpi()}>
                            <Text style={{ color: Colors.white, fontWeight: '500', fontSize: 18 }}>Confirm</Text>
                        </TouchableOpacity>
                        :
                        <ActivityIndicator size="small" color={Colors.white} style={style.Verify} />
                    }
                </View>



            </View>
        </SafeAreaView>
    );
};

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
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
    PayInput: {
        borderColor: "grey",
        borderWidth: 1,
        width: windowWidth - 15,
        height: 50,
        paddingLeft: 20,
        fontSize: 17,
        // marginBottom: 20,
        borderRadius: 6,
    },
    Verify: {
        marginTop: 20,
        width: 150,
        height: 50,
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

export default BankPayment;
