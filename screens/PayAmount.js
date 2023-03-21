/*
*
* payAmount 
* updated by - Rahul Saha
* updated on - 16.03.23
*
*/

import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Alert,
  Keyboard,
  SafeAreaView,
  TextInput,
  Text,
  ToastAndroid,
  Modal,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Platform
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AuthService from "../services/CashFlow/Auth";
import moment from "moment";
import Colors from '../config/colors';
import AppContext from '../context/AppContext';
import { AntDesign, MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from "expo-barcode-scanner";
import { bank_amount_transfer, get_bank_details, transfer_amount, verify_bank_account, verify_upi } from "../services/APIServices";
import OverlayLoader from "../components/OverlayLoader";
import { Dropdown } from 'react-native-element-dropdown';
import Modal2 from "react-native-modal";
import { SearchAllType, SearchGameForUpdateOrder } from "../services/GameApiService";
import CachedImage from 'expo-cached-image';
import LottieView from "lottie-react-native";
import Configs from "../config/Configs";
import { Header } from "../components";
import * as DocumentPicker from 'expo-document-picker';
import { getFileData } from "../utils/Util";

let debouceTimerId = null;

export default class PayAmount extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      description: null,
      localUri: null,
      inputDate: new Date(),
      mode: "date",
      show: false,
      amount: null,
      memo: null,
      event: null,
      visible: false,
      startDate: new Date(),
      isUserModalVisible: false,
      isCatVisible: false,
      minDateValue: new Date(),
      project_name: "Event",
      project_id: '2',
      subproject_name: '',
      subproject_id: '',
      paymethod_name: "",
      vendorId: "",
      loggedInUser: '',
      amountFocused: false,
      memoFocused: false,
      walletAmount: 0,

      extraData_id: '',
      Order_CashFlow: false,
      isDateTimePickerVisible: false,
      radio_props: [
        { id: 1, label: 'Scan', value: 'Scan' },
        { id: 2, label: 'UPI', value: 'UPI' },
        { id: 3, label: 'Bank Transfer', value: 'Bank Transfer' }
      ],
      openScanner: false,
      payOption: 'Scan',
      scan_permission: false,
      flashMode: false,
      pay_Index: 0,
      upi_id: null,
      Accounts: [],
      selected_Account: null,
      account_number: '',
      confirm_acc_number: '',
      account_ifsc: '',
      bankname: '',
      requesttype: '',
      acc: '',
      bank_name: '',

      gameAddModalVisible: false,
      searchQuery: "",
      searchLists: [],
      isSearching: false,
      isSearchedPreviously: false,
      selectedGame: null,
      fileName: null,
      attachment: undefined
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListner = this.props.navigation.addListener("focus", () => {
    this.setState({
      fileName:null,
      attachment: undefined,
      
    })
  })
    this.GetBankDetails()
    this.openBarCodePickerAsync()
    if (this.props.subproject_name) {
      this.setState({
        subproject_name: this.props.subproject_name,
        extraData_id: this.props.subproject_id,
        Order_CashFlow: this.props.Order_CashFlow,
      })
    }
    if (this.props.Order_CashFlow == true) {
      this.setState({
        isCatVisible: true
      })
    } else if (this.props.Order_CashFlow == false) {
      this.setState({
        isCatVisible: true
      })
    }
    // })
  }
  componentWillUnmount() {
    this.focusListner();
  }

  /**
 * search game 
 */
  closeAlertModal = () => {
    this.setState({
      showAlertModal: false,
    });
  };

  selectSearchedGame = (item) => {
    this.setState({
      gameAddModalVisible: false,
      searchQuery: "",
      searchLists: [],
      isSearchedPreviously: false,
      selectedGame: item
    });
  };

  searchGames = (text) => {
    this.setState({
      isSearching: true,
      isSearchedPreviously: true,
    });

    SearchAllType(text)
      .then((result) => {
        this.setState({
          isSearching: false,
          searchLists: result.data,
        });
      })
      .catch((err) => console.log(err));
  };

  GetBankDetails = () => {
    get_bank_details().then((res) => {
      // console.log('.......res............',res.data);
      this.setState({ Accounts: res.data })
    }).catch(err => { console.log('.......err............', err); })
  }

  openBarCodePickerAsync = () => {
    if (this.state.scan_permission == false) {
      Camera.requestCameraPermissionsAsync().then(res => {
        if (res.status == 'granted') {
          this.setState({ scan_permission: true })
        }
      })
    }
  };

  paymentMode = (value, i) => {
    this.setState({ payOption: value, pay_Index: i, paymethod_name: value, bank_name: '' })
  }

  PayButtonPressed = () => {
    // console.log('.........this.state.payOption................', this.state.payOption)
    const str = this.state.inputDate;

    const newDate = moment(str).format("ddd-MMM-DD-YYYY");
    let userAcc = this.context.userData;
    if (newDate == "" || newDate == null) {
      // console.log("Date is required");
      ToastAndroid.show(
        "Date is required",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else if (this.state.description == "" || this.state.description == null) {
      ToastAndroid.show(
        "description is required",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else if (this.state.amount == "" || this.state.amount == null) {
      // console.log("Amount is required");
      ToastAndroid.show(
        "Amount is required",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      this.Add_expanse()
      // if (this.state.payOption == 'Scan') {
      //   if (this.state.bank_name == '') {
      //     this.setState({ openScanner: true })
      //   } else {
      //     this.Transfer_amount()
      //   }
      // } else if (this.state.payOption == 'UPI') {
      //   if (!this.state.bank_name == '') {
      //     this.Transfer_amount()
      //   } else {
      //     Alert.alert('please varify upi id')
      //   }
      // } else {
      //   if (this.state.selected_Account != null) {
      //     this.VerifyBankAccount()
      //   } else {
      //     Alert.alert('please select bank account')
      //   }
      // }
    }
  }

  addBankDetails = () => {
    // console.log('.........this.state.payOption................', this.state.payOption)
    const str = this.state.inputDate;

    const newDate = moment(str).format("ddd-MMM-DD-YYYY");
    let userAcc = this.context.userData;
    if (newDate == "" || newDate == null) {
      // console.log("Date is required");
      ToastAndroid.show(
        "Date is required",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else if (this.state.catVal == "" || this.state.catVal == null) {
      // console.log("Category is required");
      ToastAndroid.show(
        "Category is required",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else if (this.state.amount == "" || this.state.amount == null) {
      // console.log("Amount is required");
      ToastAndroid.show(
        "Amount is required",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      this.bank_payment()
    }
  }


  VerifyUpi = (upi) => {
    let value = {
      upi_id: upi,
    }
    console.log('.....value.......', value);
    this.setState({ visible: true })
    verify_upi(value).then((res) => {
      console.log('.....res.......', res);
      if (res.message == 'Upi Verification Successfull') {
        // this.scannQR(res.upi_holder_name, upi)
        this.setState({ bank_name: res.upi_holder_name })
        if (this.state.payOption == 'Scan') {
          if (this.state.bank_name == '') {
            this.setState({ openScanner: true })
          } else {
            this.Transfer_amount()
          }
        }
      } else {
        Alert.alert(res.message);
      }

    }).catch((err) => { })
      .finally(() => { this.setState({ visible: false }) })
  }

  VerifyBankAccount = () => {
    let value = {
      account_number: this.state.account_number,
      confirm_acc_number: this.state.confirm_acc_number,
      account_ifsc: this.state.account_ifsc,
      bankname: this.state.bankname,
    }
    console.log('...........value...........', value)
    this.setState({ visible: true })
    verify_bank_account(value).then((res) => {
      if (res.status == 'TXN') {
        console.log('.....res.......', res.Account_Holder_Name);
        // this.bankTransfer(res)
        this.Transfer_bank_amount(res)
        // Alert.alert(res.Account_Holder_Name);
      } else {
        Alert.alert(res.message);
      }

    }).catch((err) => { this.setState({ visible: false }) })
  }

  bankTransfer = (res) => {
    const str = this.state.inputDate;
    const newDate = moment(str).format("ddd-MMM-DD-YYYY");
    let userAcc = this.context.userData;
    let data = {
      newDate: newDate,
      project_id: this.state.project_id,
      project_name: this.state.project_name,
      paymethod_name: this.state.paymethod_name,
      vendorId: this.state.vendorId,
      catVal: this.state.catVal,
      amount: this.state.amount,
      event: this.state.event,
      memo: this.state.memo,
      localUri: this.state.localUri,
      cust_code: userAcc.cust_code,
      extraData_id: this.state.extraData_id,
      subproject_name: this.state.subproject_name,
    }
    this.props.navigation.navigate("BankAmountTransfer", {
      data: data,
      beneficiary_name: res.Account_Holder_Name,
      account_number: this.state.account_number,
      confirm_acc_number: this.state.confirm_acc_number,
      account_ifsc: this.state.account_ifsc,
      bankname: this.state.bankname,
      requesttype: this.state.requesttype,
    })
  }

  scannQR = (upi_holder_name, upi) => {
    const str = this.state.inputDate;

    const newDate = moment(str).format("ddd-MMM-DD-YYYY");
    let userAcc = this.context.userData;
    let data = {
      newDate: newDate,
      project_id: this.state.project_id,
      project_name: this.state.project_name,
      paymethod_name: this.state.paymethod_name,
      vendorId: this.state.vendorId,
      catVal: this.state.catVal,
      amount: this.state.amount,
      event: this.state.event,
      memo: this.state.memo,
      localUri: this.state.localUri,
      cust_code: userAcc.cust_code,
      extraData_id: this.state.extraData_id,
      subproject_name: this.state.subproject_name,
      upi_holder_name: upi_holder_name,
      upi: upi
    }
    this.props.navigation.navigate("ScannAndPay", {
      data: data,
    })
  }
  bank_payment = () => {
    const str = this.state.inputDate;
    const newDate = moment(str).format("ddd-MMM-DD-YYYY");
    let userAcc = this.context.userData;
    let data = {
      newDate: newDate,
      project_id: this.state.project_id,
      project_name: this.state.project_name,
      paymethod_name: this.state.paymethod_name,
      vendorId: this.state.vendorId,
      catVal: this.state.catVal,
      amount: this.state.amount,
      event: this.state.event,
      memo: this.state.memo,
      localUri: this.state.localUri,
      cust_code: userAcc.cust_code,
      extraData_id: this.state.extraData_id,
      subproject_name: this.state.subproject_name,
    }
    this.props.navigation.navigate("BankPayment", {
      data: data,
    })
  }
  Transfer_bank_amount = (res) => {
    let data = {
      beneficiary_name: res.Account_Holder_Name,
      amount: this.state.amount,
      account_number: this.state.account_number,
      account_ifsc: this.state.account_ifsc,
      bankname: this.state.bankname,
      confirm_acc_number: this.state.confirm_acc_number,
      requesttype: this.state.requesttype,
    }
    console.log('.......data.....', data)
    // this.setState({ visible: true })
    bank_amount_transfer(data).then((res) => {
      console.log('........TransferAmount..res........', JSON.parse(res))
      if (JSON.parse(res).status != 'failure') {
        this.Add_expanse()
        ToastAndroid.show(
          JSON.parse(res).message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        this.props.navigation.pop(2) // pop(2) use for back 2 screen 
      } else {
        ToastAndroid.show(
          JSON.parse(res).message,
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
    }).finally(() => { this.setState({ visible: false }) })
  }
  Transfer_amount = () => {
    let data = {
      beneficiary_name: this.state.bank_name,
      amount: this.state.amount,
      upi_id: this.state.upi_id
    }
    this.setState({ visible: true })
    transfer_amount(data).then((res) => {
      console.log('........TransferAmount..res........', JSON.parse(res))

      if (JSON.parse(res).status == 'success') {

        this.Add_expanse()

        ToastAndroid.show(
          "Payment Successfull",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        this.props.navigation.pop(2) // pop(2) use for back 2 screen 
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
    }).finally(() => { this.setState({ visible: false }) })
  }

  Add_expanse = async () => {
    const str = this.state.inputDate;
    const newDate = moment(str).format("ddd-MMM-DD-YYYY");
    let userAcc = this.context.userData;
    let result = await AuthService.payAmountAdd(
      newDate,
      userAcc.cust_code,
      this.state.description,
      this.state.amount,
      this.state.payOption,
      this.state.memo,
      this.state.attachment
    );
    console.log('............result................', result)
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
          this.props.goBack()
        }
      }
    }
  }

  handleBarCodeScanned = (data) => {
    try {
      let Demo_upi = data.data.split('=')[1];
      let Upi = Demo_upi.split('&')[0];
      console.log('.................data..............', data)
      this.VerifyUpi(Upi)
      this.setState({ openScanner: false, upi_id: Upi })
    } catch (e) {
      console.log('....e......', e)
      this.setState({ openScanner: false })
      Alert.alert(
        "Something went wrong",
        "please try again",
        [
          {
            text: "ok",
            onPress: () => {
              this.setState({ openScanner: true })
            },
          },
          {
            text: "Cancel",
          },
        ]
      );
    }
  }


  workingDateHandler = (value) => {
    this.setState({ workingDate: value });
  };



  _handleBackButtonClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
    return true;
  };



  getminDate() {
    var days = this.state.loggedInUser.day_perm;
    var today = new Date();
    var prevDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - days,
      today.getHours(),
      today.getMinutes(),
      today.getSeconds(),
      today.getMilliseconds()
    );
    this.setState({ minDateValue: prevDate, visible: false });
  }


  _refreshHandler = () => {
    this.getminDate();
  };

  componentWillUnmount() {

    this.focusListener.remove();
  }
  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.startDate;
    this.setState({
      inputDate: currentDate,
      show: false,
    });
  };

  showMode = (currentMode) => {
    this.setState({
      show: true,
      mode: currentMode,
    });
  };

  showDatepicker = () => {
    this.showMode("date");
  };
  hideDatePicker = () => {
    this.setState({ isDateTimePickerVisible: false })
  };

  handleConfirm = (selectedDate) => {
    const currentDate = selectedDate;
    this.setState({
      inputDate: currentDate.toDateString(),
      show: false,
    });
    this.hideDatePicker();
  };

  showDatePicker = () => {
    console.log('.....showDatePicker...........');
    this.setState({ mode: 'date', isDateTimePickerVisible: true, show: true })
  };

  toggleModal = () => {
    //console.log('isModalVisible', this.state.isModalVisible)
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };


  amountFocusHandler = () => {
    this.setState({ amountFocused: !this.state.amountFocused, memoFocused: !this.state.memoFocused }, () => {
      // if (!this.state.memo) {
      //   this.memoRef.focus();
      // }
    })
  }

  memoFocusHandler = () => {
    this.setState({ memoFocused: !this.state.memoFocused })
  }
  amountSet = (val) => {
    //console.log("Amount", val)
    this.setState({
      amount: val,
    });
    //        console.log("Val",val.nativeEvent.text)
  };
  memoSet = (val) => {
    this.setState({ memo: val });
  };


  componentWillUnmount() { }


  render() {
    const {
      visible,
      inputDate,
      description,
      localUri,
      amount,
      memo,
      mode,
      show,
      upi_id,
      fileName
    } = this.state;


    let openImagePickerAsync = async () => {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync();

      if (pickerResult.cancelled === true) {
        return;
      }

      // this.setState({ localUri: pickerResult.uri });
    };

    const encode = uri => {
      if (Platform.OS === 'android') return encodeURI(`file://${uri}`)
      else return uri
    }
    const browseFile = async () => {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("Warning", "Please grant the permission to access the media library.");
        return;
      }
      else {
        let result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, type: '*/*' });
        // console.log('.....result.....', result.name)
        if (result.type === "success") {
          // let fileBase64 = await FileSystem.readAsStringAsync(encode(result.uri), { encoding: 'base64' });
          this.setState({
            fileName: result.name,
            attachment: getFileData(result)
          });
        }
      }
    }



    return (
      <SafeAreaView style={styles.container}>
        <Header title={"PayAmount"} />
        {visible ?
          <OverlayLoader />
          :
          <>
            <View>
              <View>
                <View style={{ marginHorizontal: 15 }}>
                  <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.show ? styles.activeBottom : styles.inactiveBottom]}>
                    <Text>Date :</Text>
                    <TouchableOpacity
                      onPress={this.showDatePicker}
                      style={[
                        styles.inputStyle,
                        { width: "100%", justifyContent: "center" },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 14, color: Colors.black }}>
                        {/* {moment(inputDate).format("ddd MMM DD YYYY ")} */}
                        {moment(inputDate).format("DD/MM/YY")}
                      </Text>
                    </TouchableOpacity>
                  </View>


                  <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isCatVisible ? styles.activeBottom : styles.inactiveBottom]}>
                    <Text>Description :</Text>

                    <View style={{ flex: 1, minHeight: 40 }}>
                      <TextInput
                        placeholder="description"
                        style={styles.inputStyle}
                        defaultValue={description != null ? description : null}
                        onChangeText={(description) => { this.setState({ description: description }) }}
                        multiline={true}
                      />
                    </View>
                  </View>

                  <View>
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.amountFocused ? styles.activeBottom : styles.inactiveBottom]}>
                      <Text>Amount :</Text>
                      <TextInput
                        placeholder="Amount"
                        ref={(ref) => (this.amountRef = ref)}
                        keyboardType={"number-pad"}
                        onChangeText={this.amountSet}
                        style={styles.inputStyle}
                        value={amount}
                        onBlur={this.amountFocusHandler}
                      />
                    </View>

                    <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }, this.state.amountFocused ? styles.activeBottom : styles.inactiveBottom]}>
                      <RadioForm
                        formHorizontal={true}
                        animation={true}
                      >
                        {/* To create radio buttons, loop through your array of options */}
                        {
                          this.state.radio_props.map((obj, i) => (
                            <RadioButton labelHorizontal={false} key={i} >
                              {/*  You can set RadioButtonLabel before RadioButtonInput */}
                              <RadioButtonInput
                                obj={obj}
                                index={i}
                                isSelected={this.state.pay_Index === i}
                                onPress={(value) => { this.paymentMode(value, i) }}
                                borderWidth={1}
                                buttonInnerColor={this.state.pay_Index === i ? Colors.primary : Colors.white}
                                buttonOuterColor={Colors.primary}
                                buttonSize={10}
                                buttonOuterSize={16}
                                buttonStyle={{ marginRight: '18%' }}
                                buttonWrapStyle={{ marginLeft: 0 }}
                              />
                              <RadioButtonLabel
                                obj={obj}
                                index={i}
                                labelHorizontal={true}
                                onPress={(value) => { this.paymentMode(value, i) }}
                                labelStyle={{ fontSize: 14, color: Colors.black, paddingLeft: 0, marginLeft: -15 }}
                                labelWrapStyle={{}}
                              />
                            </RadioButton>
                          ))
                        }
                      </RadioForm>
                    </View>
                    {this.state.payOption == "UPI" ?
                      <>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }, this.state.payOption == "UPI" ? styles.activeBottom : styles.inactiveBottom]}>
                          <Text>UPI ID :</Text>
                          <TextInput
                            placeholder="abc@bankname"
                            keyboardType={"default"}
                            style={[styles.inputStyle, { width: '70%' }]}
                            onChangeText={(id) => this.setState({ upi_id: id })}
                            value={upi_id}
                          />
                          <TouchableOpacity
                            style={{ width: '15%', height: 30, backgroundColor: Colors.primary, borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => this.VerifyUpi(upi_id)}
                          >
                            <Text style={{ color: Colors.white }}>Verify</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                      : null}
                    {this.state.payOption == "Bank Transfer" ?

                      <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }, this.state.payOption == "Bank Transfer" ? styles.activeBottom : styles.inactiveBottom]}>
                        <Text>Bank Details:</Text>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '75%' }]}>
                          {/* <SearchableDropdown
                            onItemSelect={(item) => {
                              this.setState({ selected_Account: item.name, account_number: item.acc_number,
                              confirm_acc_number: item.confirm_acc_number,
                              account_ifsc: item.ifsc,
                              bankname: item.bank_name,
                              requesttype: item.transfer_type,
                            })
                            }}
                            containerStyle={{ padding: 5 }}
                            itemStyle={{
                              padding: 10,
                              marginTop: 2,
                            }}
                            itemTextStyle={{ color: '#222' }}
                            itemsContainerStyle={{ maxHeight: 140 }}
                            items={this.state.Accounts}
                            defaultIndex={0}
                            resetValue={false}
                            textInputProps={
                              {
                                placeholder: this.state.selected_Account == null ? 'Select Account' : this.state.selected_Account,
                                underlineColorAndroid: "transparent",
                                style: {
                                  padding: 12,
                                },
                                onTextChange: text => alert(text)
                              }
                            }
                            listProps={
                              {
                                nestedScrollEnabled: true,
                              }
                            }
                          /> */}
                          <Dropdown
                            value={this.state.acc}
                            data={this.state.Accounts}
                            style={{ width: '100%', marginLeft: 5 }}
                            search
                            labelField="name"
                            valueField="name"
                            placeholder={!this.state.selected_Account ? 'Select Bank Account' : this.state.acc}
                            placeholderStyle={{ fontSize: 14, color: Colors.black }}
                            searchPlaceholder="Search..."
                            selectedTextStyle={{ fontSize: 14, color: Colors.black, opacity: 1 }}
                            itemTextStyle={{ fontSize: 14, color: Colors.black, opacity: 1 }}
                            onChange={(item) => {
                              this.setState({
                                selected_Account: item.name,
                                account_number: item.acc_number,
                                confirm_acc_number: item.confirm_acc_number,
                                account_ifsc: item.ifsc,
                                bankname: item.bank_name,
                                requesttype: item.transfer_type,
                                acc: `${item.name}/${new Array(item.acc_number.length - 3).join('x') +
                                  item.acc_number.substr(item.acc_number.length - 4, 4)}`

                              })
                            }}
                          />
                          {/* <TouchableOpacity
                            onPress={() => this.addBankDetails()}
                            style={{ width: '10%', }}
                          >
                            <Ionicons name="add-outline" size={24} color={Colors.black} />
                          </TouchableOpacity> */}
                        </View>
                      </View>
                      : null}
                    {this.state.bank_name != '' ?
                      <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }, this.state.payOption == "UPI" ? styles.activeBottom : styles.inactiveBottom]}>
                        <Text>Banking Name :</Text>
                        <TextInput
                          keyboardType={"default"}
                          style={[styles.inputStyle,]}
                          value={this.state.bank_name}
                          editable={false}
                        />
                      </View>
                      : null}
                  </View>


                  <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.memoFocused ? styles.activeBottom : styles.inactiveBottom]}>
                    <Text>Document :</Text>
                    <TextInput
                      placeholder="Document"
                      ref={(ref) => (this.memoRef = ref)}
                      keyboardType={"default"}
                      style= {styles.inputStyle}
                      onChangeText={this.memoSet}
                      value={memo}
                      onBlur={this.memoFocusHandler}
                    />
                    <View  style={{ position: 'absolute', right: 10,alignItems: 'center',justifyContent:'center',width:'50%',marginLeft:'55%'}}>
                    {fileName == null ? (
                    <TouchableOpacity
                      onPress={browseFile}
                      style={{ position: 'absolute', right: 10 }}
                    >
                      <MaterialCommunityIcons name="camera" size={20} color="black" />
                  
                    </TouchableOpacity>)
                   :
                    ( 
                      
                    <TextInput
                     style={[styles.inputStyle,{fontSize:12,opacity:0.7}]}
                     value={fileName}
                     editable={false}
                     multiline={true}
                   />
                      ) }
                    </View>
                  </View>

                </View>
                <View
                  style={{
                    marginHorizontal: 15,
                    marginTop: 10,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <TouchableOpacity
                    primary
                    block
                    onPress={this.PayButtonPressed}
                    style={{
                      backgroundColor: Colors.primary,
                      height: 40,
                      paddingTop: 4,
                      paddingBottom: 4,
                      width: 150,
                    }}
                  >
                    <Text style={{ color: "#fff", alignSelf: 'center', marginTop: 5 }}> Pay </Text>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
            {show && (
              <DateTimePickerModal
                mode={mode}
                display={Platform.OS == 'ios' ? 'inline' : 'default'}
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleConfirm}
                onCancel={this.hideDatePicker}
              />
            )}
            {/* {localUri ? (
              <Image
                source={{ uri: localUri }}
                style={styles.thumbnail}
              />
            ) : null} */}



            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.openScanner}
              onRequestClose={() => { this.setState({ openScanner: false }) }}
            >
              <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
                <View style={{ paddingTop: '20%', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)', width: windowWidth, height: windowHeight }}>
                  <>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ marginLeft: '5%', marginBottom: 10 }}>
                        <TouchableOpacity
                          onPress={() => this.setState({ openScanner: false })}
                        >
                          <AntDesign name="close" size={30} color={Colors.white} />
                        </TouchableOpacity>
                      </View>
                      <View style={{ marginLeft: '50%', marginBottom: 10 }}>
                        <TouchableOpacity
                          onPress={() => this.setState({ flashMode: !this.state.flashMode })}
                          style={{ borderRadius: 6, backgroundColor: this.state.flashMode ? Colors.white : null, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
                        >
                          <MaterialCommunityIcons name="flashlight" size={30} color={this.state.flashMode ? Colors.black : Colors.white} />
                        </TouchableOpacity>
                      </View>

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', top: "16%" }}>
                      <View style={{ width: 90, height: 90, marginRight: '26%', borderTopLeftRadius: 20, borderLeftWidth: 5, borderColor: Colors.primary, borderTopWidth: 5, }}></View>
                      <View style={{ width: 90, height: 90, borderTopRightRadius: 20, borderTopWidth: 5, borderColor: Colors.primary, borderRightWidth: 5, }}></View>
                    </View>
                    <View style={{ width: '65%', height: '33%', padding: 5, zIndex: 1 }}>
                      <Camera
                        style={[StyleSheet.absoluteFill, { borderRadius: 6, margin: 5, marginTop: '10%' }]}
                        barCodeScannerSettings={{
                          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                        }}
                        onBarCodeScanned={this.handleBarCodeScanned}
                        flashMode={this.state.flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}

                      />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', top: "41%" }}>
                      <View style={{ width: 90, height: 90, borderBottomWidth: 5, borderColor: Colors.primary, borderLeftWidth: 5, marginRight: '26%', borderBottomLeftRadius: 20 }}></View>
                      <View style={{ width: 90, height: 90, borderBottomWidth: 5, borderColor: Colors.primary, borderRightWidth: 5, borderBottomRightRadius: 20 }}></View>
                    </View>
                  </>
                </View>
              </SafeAreaView>
            </Modal>

            <Modal2
              isVisible={this.state.gameAddModalVisible}
              onBackdropPress={() => {
                this.setState({
                  gameAddModalVisible: false,
                  searchQuery: "",
                  searchLists: [],
                  isSearchedPreviously: false,
                });
              }}
            >

              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 25,
                }}
              >
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLable}>Find Games:</Text>
                  <TextInput
                    value={this.state.searchQuery}
                    autoCompleteType="off"
                    autoCapitalize="words"
                    placeholder="Type to search..."
                    style={styles.textInput}
                    onChangeText={(text) =>
                      this.setState({ searchQuery: text }, () => {
                        if (debouceTimerId) {
                          clearTimeout(debouceTimerId);
                        }
                        debouceTimerId = setTimeout(() => {
                          this.searchGames(text);
                        }, 1000);
                      })
                    }
                  />
                </View>

                <View>
                  {this.state.isSearching ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <>
                      {this.state.isSearchedPreviously && (
                        <SearchedGameList
                          items={this.state.searchLists}
                          onSelectSearchedGame={(item) =>
                            this.selectSearchedGame(item)
                          }
                        />
                      )}
                    </>
                  )}
                </View>
              </View>

            </Modal2>
          </>
        }
      </SafeAreaView>
    );
  }
}

function SearchEmptyScreen() {
  return (
    <>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <LottieView
          style={{
            width: 80,
            height: 80,
          }}
          source={require("../assets/lottie/no-result-found.json")}
          autoPlay
          loop
        />
      </View>

      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Text style={{ fontSize: 15, color: "red" }}>
          We've searched near and far.
        </Text>
        <Text style={{ fontSize: 10, color: "grey" }}>
          No games are found. Try another spelling or different terms.
        </Text>
      </View>
    </>
  );
}

function SearchedGameList({ items, onSelectSearchedGame }) {
  if (items.length == 0) {
    return <SearchEmptyScreen />;
  }
  return (
    <ScrollView>
      <View style={{ alignItems: "center", marginVertical: 10 }}>
        <Text style={{ fontSize: 16 }}>Matched Games</Text>
      </View>
      <ScrollView>
        {items.map((item) => {
          return (

            <>
              {item.search_type == "game" ?
                <View
                  style={{
                    borderBottomColor: Colors.lightGrey,
                    borderBottomWidth: 1,
                    marginVertical: 10,
                  }}
                  key={item.game_id}
                >

                  <Pressable
                    onPress={() => {
                      onSelectSearchedGame(item);
                    }}
                    style={{ flexDirection: "row", alignItems: 'center', paddingVertical: 3 }}
                  >
                    <View style={{ width: "20%" }}>
                      <CachedImage
                        style={{ height: 57, width: "100%" }}
                        source={{ uri: Configs.NEW_COLLECTION_URL + item.image }}
                        resizeMode="cover"
                        cacheKey={`${item.image}+${item.id}`}
                        placeholderContent={(
                          <ActivityIndicator
                            color={Colors.primary}
                            size="small"
                            style={{
                              flex: 1,
                              justifyContent: "center",
                            }}
                          />
                        )}
                      />
                    </View>
                    <View
                      style={{
                        width: "50%",
                        // flexWrap: "wrap",
                        paddingLeft: 10,
                      }}
                    >
                      <Text
                        style={[styles.titleText,]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.name}
                      </Text>
                    </View>
                    <View style={{ width: "25%" }}>
                      {/* <Text style={[styles.inputLable, { marginBottom: 0, padding: 0, fontSize: 14 }]}>Price</Text> */}
                      <Text style={[styles.inputLable, { marginBottom: 0, padding: 0, fontSize: 14 }]}>
                        <FontAwesome name="rupee" size={13} color={Colors.grey} />
                        {Math.trunc(item.rent)}
                      </Text>
                    </View>
                  </Pressable>
                </View>
                : null}
            </>
          );
        })}
      </ScrollView>
    </ScrollView>
  );
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  thumbnail: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 20,
  },
  iconStyle: {
    fontSize: 15,
  },
  inputStyle: {
    fontSize: 14,
    minHeight: 40,
    color: Colors.black,
    marginLeft: 10,
    width: '100%'
  },
  input_Style: {
    fontSize: 14,
    color: Colors.black,
    marginLeft: 10,
    width: '100%',
    minHeight:60
  },
  boxStyle: {
    fontSize: 14,
    color: Colors.black,
    marginLeft: 10,
  },
  mainHeader: {
    backgroundColor: Colors.primary,
  },
  headerButton: {
    flexDirection: "row",
    flex: 1,
  },
  whiteColor: {
    color: Colors.secondary,
  },
  inactiveBottom: {
    borderBottomColor: '#656565',
    borderBottomWidth: 0.5
  },
  activeBottom: {
    borderBottomColor: Colors.primary,
    borderBottomWidth: 1
  },
  more_btn: {
    backgroundColor: Colors.primary,
    height: 35,
    paddingTop: 4,
    paddingBottom: 4,
    width: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '90%'
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
    borderWidth: 1,
    padding: 9,
    fontSize: 14,
    width: "100%",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.textInputBorder,
    backgroundColor: Colors.textInputBg,
  },
});
