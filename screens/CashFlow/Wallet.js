/*
*
* move and modify from cashflow app
* updated by - Rahul Saha
* updated on - 24.11.22
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
  Modal
} from "react-native";
import Category from "../../components/CashFlow/component/category/index";
import Project from "../../components/CashFlow/component/project/index";
import * as ImagePicker from "expo-image-picker";
import AuthService from "../../services/CashFlow/Auth";
import moment from "moment";
import Colors from '../../config/colors';
import AppContext from '../../context/AppContext';
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from "expo-barcode-scanner";
import { bank_amount_transfer, get_bank_details, transfer_amount, verify_bank_account, verify_upi } from "../../services/APIServices";
import OverlayLoader from "../../components/OverlayLoader";
import SearchableDropdown from 'react-native-searchable-dropdown';
import { Dropdown } from 'react-native-element-dropdown';
import SubCategory from "../../components/CashFlow/component/subCategory/index"

export default class Wallet extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      selected2: "Cash",
      catName: null,
      catValue: null,
      localUri: null,
      inputDate: new Date(),
      mode: "date",
      show: false,
      catContent: this.props.catContent,
      amount: null,
      memo: null,
      event: null,
      visible: false,
      startDate: new Date(),
      isUserModalVisible: false,
      userName: null,
      userID: null,
      isSubProjectVisible: false,
      isCatVisible: false,
      minDateValue: new Date(),
      projects: this.props.projects,
      project_name: "Event",
      project_id: '2',
      subprojects: this.props.subprojects,
      subproject_name: '',
      subproject_id: '',
      payMethod: this.props.payMethod,
      paymethod_name: "",
      paymethod_id: "",
      selectedSubProject: undefined,
      selectedItem: undefined,
      vendorList: null,
      vendorId: "",
      vendorName: "",
      selectedVendor: null,
      isVendorVisible: false,
      loggedInUser: '',
      amountFocused: false,
      memoFocused: false,
      walletAmount: 0,
      isProjectVisible: false,
      subcatContent: [],
      subcatName: null,
      subcatVal: '',
      isSubCatVisible: false,

      //project id = 2 for event
      selectedProject_id: 2,

      extraData_id: '',
      Order_CashFlow: false,
      isDateTimePickerVisible: false,

      paid: false,
      showMore: false,
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
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
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
      if (this.state.payOption == 'Scan') {
        if (this.state.bank_name == '') {
          this.setState({ openScanner: true })
        } else {
          this.Transfer_amount()
        }
      } else if (this.state.payOption == 'UPI') {
        if (!this.state.bank_name == '') {
          this.Transfer_amount()
        } else {
          Alert.alert('please varify upi id')
        }
      } else {
        if (this.state.selected_Account != null) {
          this.VerifyBankAccount()
        } else {
          Alert.alert('please select bank account')
        }
      }
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
    let result = await AuthService.expenseAdd(
      newDate,
      this.state.project_id,
      this.state.project_name,
      this.state.paymethod_name,
      this.state.vendorId,
      this.state.catVal,
      this.state.amount,
      this.state.event,
      this.state.memo,
      this.state.localUri,
      userAcc.cust_code,
      this.state.extraData_id,
      // this.state.subproject_name
      JSON.stringify(this.state.catValue)
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

  UNSAFE_componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide.bind(this)
    );
  }

  workingDateHandler = (value) => {
    this.setState({ workingDate: value });
  };

  getPayMethod = async () => {
    const payMethod = await AuthService.getPayMethod();
    this.setState({ payMethod: payMethod });
  };

  _handleBackButtonClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
    return true;
  };

  getCategory = async () => {
    // let contentt = await AuthService.getCat();
    let contentt = await AuthService.getCatnew();
    if (contentt != "Failed") {
      this.setState({
        catContent: contentt,
        serverError: false,
      });
    } else {
      this.setState({
        serverError: true,
      });
    }
  };

  async updateAccount() {
    // let userAcc = await AuthService.getAccount();
    let userAcc = this.context.userData;
    let acdata = await AuthService.retriveAccount(
      userAcc.cust_code,
      userAcc.id
    );
    this.setState({ walletAmount: acdata.account.amount })
    if (acdata.status != 0) {
      this.setState({ loggedInUser: this.context.userData, serverError: false }, () => this.getminDate());
      await AuthService.setAccount(acdata.account);
      this.getBalanceAcc(acdata);
    } else if (acdata == "failed") {
      this.setState({
        serverError: true,
      });
    }
  }

  getProjectDetails = async () => {
    let projects = await AuthService.getProject();
    this.setState({ projects: projects });
  };
  // getSubProjectDetails = async () => {
  //   // let userAcc = await AuthService.getAccount();
  //   let userAcc = this.context.userData;
  //   let subprojects = await AuthService.getSubProject(userAcc.user_code);
  //   this.setState({ subprojects: subprojects });
  // };

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

  getBalanceAcc = async (user) => {
    // console.log("User----->", user.account.user_type)
    let acdata = await AuthService.fetchDetailsAccounts(
      user.account.type,
      user.account.cust_code
    );
    if (acdata != "failed") {
      if (acdata.status != 0) {
        this.setState({ balanceAcc: acdata.account });
      }
    }
  };

  _refreshHandler = () => {
    this.getminDate();
    this.updateAccount();
    this.getCategory();
    this.getPayMethod();
    this.getProjectDetails();
    // this.getSubProjectDetails();
    this.getSubProjectList(this.state.selectedProject_id);
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    // Remove the event listener
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

  onValueChange2 = (value) => {
    console.log("value ", value);
    this.setState({
      selected2: value,
    });
    //console.log(this.state.selected2);
  };

  //Filter By Type
  filterProjectsByType = (type) => {
    return this.state.projects.filter((results) => {
      return results.category_type == type;
    });
  };
  filterSubProjectsByType = (type) => {
    if (
      typeof this.state.subprojects !== "undefined" &&
      this.state.subprojects != null
    ) {
      return this.state.subprojects.filter((results) => {
        return results.category_type == type;
      });
    } else {
      return null;
    }
  };
  filterPayMethodByType = (type) => {
    if (
      typeof this.state.payMethod !== "undefined" &&
      this.state.payMethod != null
    ) {
      return this.state.payMethod.filter((results) => {
        return results.category_type == type;
      });
    } else {
      return null;
    }
  };

  filterResultsByType = (type, content) => {
    return content.filter((results) => {
      return results.category_type == type;
    });
  };

  filterVendorByType = (type) => {
    if (
      typeof this.state.vendorList !== "undefined" &&
      this.state.vendorList != null
    ) {
      return this.state.vendorList.filter((results) => {
        return results.category_type == type;
      });
    } else {
      // alert("No Vendor Found");
      return null;
    }
  };

  //Option Pressed Section

  payMethodPressed = (item) => {
    if (this.state.project_id) {
      this.setState({
        paymethod_name: item.val,
        paymethod_id: item.id,
        isPayMethodVisible: !this.state.isPayMethodVisible,
      });
    } else {
      this.setState({
        paymethod_name: item.val,
        paymethod_id: item.id,
        isPayMethodVisible: !this.state.isPayMethodVisible,
        isProjectVisible: !this.state.isProjectVisible,
      });
    }
  };

  projectPressed = (item) => {
    if (this.state.subproject_id) {
      this.setState({
        project_name: item.val,
        project_id: item.id,
        isProjectVisible: !this.state.isProjectVisible,
      });
    } else {
      this.setState({
        project_name: item.val,
        project_id: item.id,
        isProjectVisible: !this.state.isProjectVisible,
        isSubProjectVisible: !this.state.isSubProjectVisible,
      });
    }
    this.onPickerValueChange(item.id)
  };

  subprojectPressed = (item, extraData) => {
    let data = `${item.data.order_id}/${item.data.venue}/${moment(item.data.event_start_timestamp).format(" Do MMM YY")}/${item.data.customer_name}/${item.data.order_status}`
    // console.log('............data...........',data);
    if (this.state.catVal) {
      this.setState({
        // subproject_name: item.val,
        subproject_name: data,
        subproject_id: extraData.category_id,
        isSubProjectVisible: !this.state.isSubProjectVisible,
        isVendorVisible: false,
        extraData_id: item.id
      });
    } else {
      this.setState({
        // subproject_name: item.val,
        subproject_name: data,
        subproject_id: extraData.category_id,
        isSubProjectVisible: !this.state.isSubProjectVisible,
        isVendorVisible: false,
        isCatVisible: !this.state.isCatVisible,
        extraData_id: item.id
      });
    }
  };

  catPressed = (item) => {
    if (item.category_name) {
      this.setState({
        catName: item.category_name,
        catVal: item.category_id,
        isCatVisible: !this.state.isCatVisible,
        amountFocused: true
      });
    } else {
      this.setState({
        catName: item.val,
        catValue: {
          id:item.data.id,
          customer_name : item.data.customer_name,
          venue : item.data.venue,
          event_start_timestamp : item.data.event_start_timestamp
        },
        catVal: item.id,
        isCatVisible: !this.state.isCatVisible,
        amountFocused: true
      });
    }
    if (!this.state.amount) {
      setTimeout(() => {
        this.amountRef.focus();
      }, 100);
    }
  };

  vendorPressed = (item) => {
    this.setState({
      vendorName: item.val,
      vendorId: item.id,
      isVendorVisible: !this.state.isVendorVisible,
    });
    // setTimeout(() => {
    //   this.amountRef._root.focus();
    // }, 100);
  };


  _keyboardDidShow() {
    //console.log("Keyboard Showed")
    // console.log("Keyboard Dismiss---------->",Keyboard.dismiss)
    this.setState({
      isSubProjectVisible: false,
      isCatVisible: false,
      isProjectVisible: false,
      isVendorVisible: false,
      isPayMethodVisible: false,
      isSubCatVisible: false,
    });
    //alert("Key Board Pops")
  }

  _keyboardDidHide() {
  }
  //Toggle Section
  toggleProjectVisible = () => {
    this.setState({
      isProjectVisible: !this.state.isProjectVisible,
      isCatVisible: false,
      isPayMethodVisible: false,
      isSubProjectVisible: false,
      isVendorVisible: false,
      isSubCatVisible: false,
    });
  };
  toggleSubProjectVisible = () => {
    this.setState({
      isSubProjectVisible: !this.state.isSubProjectVisible,
      isCatVisible: false,
      isProjectVisible: false,
      isVendorVisible: false,
      isPayMethodVisible: false,
      isSubCatVisible: false,
    });
    Keyboard.dismiss();
  };
  toggleVendorVisible = () => {
    this.setState({
      isVendorVisible: !this.state.isVendorVisible,
      isCatVisible: false,
      isSubProjectVisible: false,
      isPayMethodVisible: false,
      isSubCatVisible: false,
    });
    Keyboard.dismiss();
  };
  togglePayMethodVisible = () => {
    this.setState({
      isPayMethodVisible: !this.state.isPayMethodVisible,
      isSubProjectVisible: false,
      isCatVisible: false,
      isProjectVisible: false,
      isVendorVisible: false,
      isSubCatVisible: false,
    });
    Keyboard.dismiss();
  };
  toggleCatVisible = () => {
    this.setState({
      isCatVisible: !this.state.isCatVisible,
      isSubProjectVisible: false,
      isVendorVisible: false,
      isPayMethodVisible: false,
      isSubCatVisible: false,
      isProjectVisible: false,
    });
    Keyboard.dismiss();
  };
  getVendors = async (cat_id) => {
    let vendorResult = await AuthService.getVendorList(cat_id);
    console.log("vendorResult", vendorResult);
    //  console.log("Vendor List-------->", vendorResult)
    this.setState({ vendorList: vendorResult });
    // setTimeout(() => {
    //   this.amountRef._root.focus();
    // }, 100);
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
  eventSet = (val) => {
    this.setState({ event: val });
  };
  payAmount = () => {
    let userAcc = this.context.userData;
    const str = this.state.inputDate;
    const newDate = moment(str).format("ddd-MMM-DD-YYYY");
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
      subproject_name: this.state.subproject_name
    }
    // console.log('..............data..........',data)
    if (this.state.project_id && this.state.project_name && this.state.paymethod_name && this.state.catVal && this.state.amount && userAcc.cust_code && this.state.extraData_id && this.state.subproject_name) {
      this.props.navigation.navigate("NewPayment", {
        data: data,
        type: 'expense'
      })
    } else {
      ToastAndroid.show(
        "empty input field",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  }

  componentWillUnmount() { }

  onPickerValueChange(value) {
    this.setState({
      selected1: value,
    });
    this.getSubProjectList(value);
  }

  getSubProjectList = async (value) => {
    let result = await AuthService.getNewSubProjectList(value);
    // console.log("Resultr-------------------->", result);
    this.setState({
      subprojects: result,
    });
  };

  onPickerVendorValueChange(value) {
    this.setState({
      selectedVendor: value,
    });
  }
  onPickerPayMethodValueChange(value) {
    this.setState({
      selectedpayMethod: value,
    });
  }

  selectdrowerIcon = () => {
    // this.props.navigation.navigate('AccountDetailsScreen')
    this.props.navigation.navigate('ChangePayMethod')
  }

  render() {
    const {
      visible,
      style,
      inputDate,
      minDateValue,
      catName,
      catValue,
      localUri,
      amount,
      memo,
      event,
      mode,
      show,
      isCatVisible,
      catContent,
      vendorList,
      payMethod,
      subprojects,
      projects,
      startDate,
      isProjectVisible,
      paymethod_name,
      subproject_name,
      isSubProjectVisible,
      isPayMethodVisible,
      vendorName,
      isVendorVisible,
      loggedInUser,
      networkAvailable,
      serverError,
      workingDate,
      project_name,
      subcatName,
      isSubCatVisible,
      subcatContent,
      upi_id
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

      this.setState({ localUri: pickerResult.uri });
    };



    return (
      <SafeAreaView style={styles.container}>
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

                  {/* {this.state.Order_CashFlow == true ?
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
                      <Text>Project :</Text>
                      <TouchableWithoutFeedback >
                        <View style={{ flex: 1, height: 42 }}>
                          <TextInput
                            placeholder="Project"
                            style={styles.inputStyle}
                            editable={false}
                            defaultValue={project_name != null ? project_name : null}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                    :
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
                      <Text>Project :</Text>
                      <TouchableWithoutFeedback onPress={this.toggleProjectVisible}>
                        <View style={{ flex: 1, height: 42 }}>
                          <TextInput
                            placeholder="Project"
                            style={styles.inputStyle}
                            editable={false}
                            defaultValue={project_name != null ? project_name : null}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  } */}
                  {/* {this.state.Order_CashFlow == true ?
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isSubProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
                      <Text>Sub Project :</Text>
                      <TouchableWithoutFeedback>
                        <View style={{ flex: 1, height: 40 }}>
                          <TextInput
                            placeholder="Sub Project"
                            style={styles.inputStyle}
                            editable={false}
                            multiline={true}
                            defaultValue={
                              subproject_name != null ? subproject_name : null
                            }
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                    :
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isSubProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
                      <Text>Sub Project :</Text>
                      <TouchableWithoutFeedback
                        onPress={this.toggleSubProjectVisible}
                      >
                        <View style={{ flex: 1, height: 40 }}>
                          <TextInput
                            placeholder="Sub Project"
                            style={styles.inputStyle}
                            editable={false}
                            multiline={true}
                            defaultValue={
                              subproject_name != null ? subproject_name : null
                            }
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  } */}
                  <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isCatVisible ? styles.activeBottom : styles.inactiveBottom]}>
                    <Text>Category :</Text>
                    <TouchableWithoutFeedback onPress={this.toggleCatVisible}>
                        {catValue == null ?
                      <View style={{ flex: 1, height: 40 }}>
                          <TextInput
                            placeholder="Category"
                            style={styles.inputStyle}
                            editable={false}
                            defaultValue={catName != null ? catName : null}
                          />
                          </View>
                          :
                          <View style={{ flex: 1, height: 65,marginLeft:10}}>
                            <Text style={{color:Colors.black}}>{catValue.customer_name}</Text>
                            <Text style={{color:Colors.black}}>{catValue.venue}</Text>
                            <Text style={{color:Colors.black}}>{moment(catValue.event_start_timestamp).format("DD/MM/YY")}</Text>
                            </View>
                        }
                     
                    </TouchableWithoutFeedback>
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
                  {subproject_name == "Events" ? (
                    <View>
                      <Text>Events :</Text>
                      <TextInput
                        placeholder="Event"
                        ref={(ref) => (this.eventRef = ref)}
                        keyboardType={"default"}
                        style={styles.inputStyle}
                        onChangeText={this.eventSet}
                        value={event}
                      // onSubmitEditing={() => this.memoRef.focus()}
                      />
                    </View>
                  ) : null}
                  {this.state.showMore ?
                    <>
                      <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.memoFocused ? styles.activeBottom : styles.inactiveBottom]}>
                        <Text>Memo :</Text>
                        <TextInput
                          placeholder="Memo"
                          ref={(ref) => (this.memoRef = ref)}
                          keyboardType={"default"}
                          style={styles.inputStyle}
                          onChangeText={this.memoSet}
                          value={memo}
                          onBlur={this.memoFocusHandler}
                        />
                        <TouchableOpacity
                          onPress={openImagePickerAsync}
                          style={{ position: 'absolute', right: 10 }}
                        >
                          <MaterialCommunityIcons name="camera" size={20} color="black" />
                        </TouchableOpacity>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Vendor :</Text>
                        <TouchableWithoutFeedback onPress={this.toggleVendorVisible}>
                          <View style={{ flex: 1, height: 40 }}>
                            <TextInput
                              placeholder="Choose Vendor"
                              style={styles.inputStyle}
                              editable={false}
                              defaultValue={vendorName != null ? vendorName : null}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </>
                    : null}
                  <View style={{ width: '100%', marginTop: 5 }}>
                    <TouchableOpacity
                      style={styles.more_btn}
                      onPress={() => { this.setState({ showMore: true }) }}
                    >
                      <AntDesign name="plus" size={18} color={Colors.white} />
                    </TouchableOpacity>
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
            {localUri ? (
              <Image
                source={{ uri: localUri }}
                style={styles.thumbnail}
              />
            ) : null}
            {isProjectVisible ? (
              <View style={{ flex: 0.8, backgroundColor: "#fff", marginVertical: 10 }}>
                <Category
                  categoryData={this.filterResultsByType("1", projects)}
                  onCatPress={this.projectPressed}
                  heading={"Choose Project"}
                  userType={loggedInUser}
                  navigation={this.props.navigation}
                  permission={"No"}
                  screen={"AddPaymentOption"}
                  project={true}
                />
              </View>
            ) : null}
            {isSubProjectVisible ? (
              <View style={{ flex: 0.8, backgroundColor: "#fff", marginVertical: 10 }}>
                <Category
                  categoryData={subprojects}
                  onCatPress={this.subprojectPressed}
                  heading={"Choose Sub Project"}
                  userType={loggedInUser}
                  navigation={this.props.navigation}
                  subproject={true}
                  screen={"AddProjects"}
                />
              </View>
            ) : null}
            {isPayMethodVisible ? (
              <View style={{ flex: 0.8, backgroundColor: "#fff", marginVertical: 10 }}>
                <Category
                  categoryData={this.filterResultsByType("1", payMethod)}
                  onCatPress={this.payMethodPressed}
                  heading={"Choose Pay Method"}
                  userType={loggedInUser}
                  navigation={this.props.navigation}
                  screen={"AddPaymentOption"}
                />
              </View>
            ) : null}
            {isVendorVisible ? (
              <View style={{ flex: 0.8, backgroundColor: "#fff" }}>
                <Project
                  categoryData={vendorList}
                  onCatPress={this.vendorPressed}
                  heading={"Choose Vendor"}
                  userType={loggedInUser}
                  navigation={this.props.navigation}
                  screen={"AddVendor"}
                />
              </View>
            ) : null}
            {isCatVisible ? (
              <View style={{ flex: 0.8, backgroundColor: "#fff" }}>
                <SubCategory
                  categoryData={this.filterResultsByType("1", catContent)}
                  onCatPress={this.catPressed}
                  heading={"Choose Category"}
                  userType={loggedInUser}
                  navigation={this.props.navigation}
                  permission={"Yes"}
                  screen={"CategorySettings"}
                />
              </View>
            ) : null}

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
                      <View style={{ width: 85, height: 85, backgroundColor: Colors.primary, marginRight: '28%', borderTopLeftRadius: 6 }}></View>
                      <View style={{ width: 85, height: 85, backgroundColor: Colors.primary, borderTopRightRadius: 6 }}></View>
                    </View>
                    <View style={{ width: '70%', height: '35%', padding: 5, zIndex: 1 }}>
                      <Camera
                        style={[StyleSheet.absoluteFill, { borderRadius: 6, margin: 5 }]}
                        barCodeScannerSettings={{
                          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                        }}
                        onBarCodeScanned={this.handleBarCodeScanned}
                        flashMode={this.state.flashMode ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}

                      />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', top: "41%" }}>
                      <View style={{ width: 85, height: 85, backgroundColor: Colors.primary, marginRight: '28%', borderBottomLeftRadius: 6 }}></View>
                      <View style={{ width: 85, height: 85, backgroundColor: Colors.primary, borderBottomRightRadius: 6 }}></View>
                    </View>
                  </>
                </View>
              </SafeAreaView>
            </Modal>
          </>
        }
      </SafeAreaView>
    );
  }
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
    height: 40,
    color: Colors.black,
    marginLeft: 10,
    width: '100%'
  },
  boxStyle: {
    fontSize: 14,
    color:Colors.black,
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
  }
});
