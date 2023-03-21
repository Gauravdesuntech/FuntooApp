/*
*
* move and modify from cashflow app
* updated by - Rahul Saha
* updated on - 25.11.22
*
*/

import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  Alert,
  SafeAreaView,
  TextInput,
  Text,
  BackHandler,
  ToastAndroid,
} from "react-native";
import { Toast, } from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import Category from "../../components/CashFlow/component/category";
import Project from "../../components/CashFlow/component/project";
import { Header } from '../../components'
import Colors from '../../config/colors';
import MainHeader from "../../components/CashFlow/component/MainHeader";
import * as ImagePicker from "expo-image-picker";
import Loader from '../../components/Loader';
import AuthService from "../../services/CashFlow/Auth";
import AppContext from '../../context/AppContext';
import moment from "moment";
import { MaterialIcons, AntDesign, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SubCategory from "../../components/CashFlow/component/subCategory/index";

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default class IncomeEdit extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    // console.log("IncomeEdit Props==================>", this.props.route.params.data);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    const timeStamp = Date.parse(
      this.props.route.params.data.transaction_date
    );
    this.state = {
      isCatVisible: false,
      selected2: "Cash",
      expense_id: this.props.route.params.id,
      transaction_id: this.props.route.params.transaction_id,
      catName: this.props.route.params.data.cat_name,
      // catValue: JSON.parse(this.props.route.params.data.event_details),
      catValue: (this.props.route.params.data.event_details),
      catVal: this.props.route.params.data.category_id,
      localUri: this.props.route.params.data.image,
      inputDate: new Date(timeStamp),
      mode: "date",
      show: false,
      catContent: this.props.route.params.categoryData,
      amount: this.props.route.params.data.amount,
      memo: this.props.route.params.data.remarks,
      event: this.props.route.params.data.event,
      visible: true,
      startDate: props.datePickerStartDate,
      isUserModalVisible: false,
      userName: null,
      userID: null,
      minDateValue: new Date(),
      saveBtnVisibility: false,
      editBtnVisibility: true,
      deleteBtnVisibility: true,
      editable: false,
      projects: this.props.route.params.projects,
      project_name: this.props.route.params.data.project,
      project_id: this.props.route.params.data.project_id,
      subprojects: this.props.route.params.subprojects,
      subproject_name: this.props.route.params.data
        .event_details,
      subproject_id: this.props.route.params.data
        .sub_project_id,
      payMethod: this.props.route.params.payMethod,
      paymethod_name: this.props.route.params.data.pay_method,
      paymethod_id: "",
      loggedinUser: this.props.route.params.account,
      balanceAcc: [],
      workingDate: new Date(),
      amountFocused: false,
      memoFocused: false,

      walletAmount:0,
       //project id = 2 for event
       selectedProject_id: 2,
       extraData_id:this.props.route.params.data.extra_id,
       isDateTimePickerVisible: false,

      // user_Data:{
      //   "amount": "3550",
      //   "assigned_project_id": "2",
      //   "created_by": "0",
      //   "created_on": "2021-02-03",
      //   "day_perm": "180",
      //   "ecode": null,
      //   "email": "akshay.@gmail.com",
      //   "full_name": "Akash",
      //   "id": "1",
      //   "is_email_verified": "1",
      //   "is_mobile_verified": "0",
      //   "main_project_id": "1",
      //   "mcode": null,
      //   "mobile": "9876543210",
      //   "mpin": "1111",
      //   "password": "535b8a7c260ccef00aa9ac0ecde6067f",
      //   "profile_photo": "USER2100000013:38:55trans.png",
      //   "profile_url": "akshay",
      //   "project_code": "",
      //   "project_id": "2",
      //   "project_name": "Event",
      //   "status": "1",
      //   "updated_on": null,
      //   "user_code": "USER21000000",
      //   "user_type": "admin",
      // }
    };
  }

  async componentDidMount(props) {
    //  await this.getCategory()
    // console.log("uri==========================>", this.props.route.params.data.event_details)
    this.updateAccount();
    this.getminDate();
    this.getBalanceAcc(this.state.loggedinUser);
    this.workingDateHandler();
    // this.getSubProjectList(this.state.selectedProject_id);
  }

  async updateAccount() {
    // let userAcc = await AuthService.getAccount();
    let userAcc = this.context.userData;
    let acdata = await AuthService.retriveAccount(
      userAcc.cust_code,
      userAcc.id
    );
    // console.log(acdata.account);
    this.setState({ walletAmount: acdata.account.amount })
    if (acdata.status != 0) {
      this.setState({ loggedInUser: acdata.account, serverError: false }, () => this.getminDate());
      await AuthService.setAccount(acdata.account);
      this.getBalanceAcc(acdata);
    } else if (acdata == "failed") {
      this.setState({
        serverError: true,
      });
    }
  }

  workingDateHandler = (value) => {
    this.setState({ workingDate: value });
  };

  UNSAFE_componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide.bind(this)
    );
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  getBalanceAcc = async (user) => {
    let acdata = await AuthService.fetchDetailsAccounts(
      user.type,
      user.cust_code
    );
    if (acdata != "failed") {
      if (acdata.status != 0) {
        this.setState({ balanceAcc: acdata.account });
      }
    }
  };

  getminDate() {
    var days = this.state.loggedinUser.day_perm;
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

  _keyboardDidHide() {
  }

  _keyboardDidShow() {
    //console.log("Keyboard Showed")
    // console.log("Keyboard Dismiss---------->",Keyboard.dismiss)
    this.setState({
      isSubProjectVisible: false,
      isCatVisible: false,
      isProjectVisible: false,

      isPayMethodVisible: false,
    });
    //alert("Key Board Pops")
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
    this.setState({ mode: 'date', isDateTimePickerVisible: true, show:true })
  };

  //Toggle Section

  toggleProjectVisible = () => {
    this.setState({
      isProjectVisible: !this.state.isProjectVisible,
      isCatVisible: false,
      isPayMethodVisible: false,
      isSubProjectVisible: false,
      isVendorVisible: false,
    });
  };
  toggleSubProjectVisible = () => {
    this.setState({
      isSubProjectVisible: !this.state.isSubProjectVisible,
      isCatVisible: false,
      isProjectVisible: false,
      isVendorVisible: false,
      isPayMethodVisible: false
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
    });
    Keyboard.dismiss();
  };
  toggleCatVisible = () => {
    this.setState({
      isCatVisible: !this.state.isCatVisible,
      isSubProjectVisible: false,
      isPayMethodVisible: false,
      isProjectVisible: false,
      isVendorVisible: false,
    });
    Keyboard.dismiss();
  };

  onValueChange2 = (value) => {
    this.setState({
      selected2: value,
    });
  };

  //Option Pressed Section
  gotoBack = () => this.props.navigation.goBack();
  projectPressed = (item) => {
    if (this.state.subproject_id){
      this.setState({
        project_name: item.val,
        project_id: item.id,
        isProjectVisible: !this.state.isProjectVisible,
        isSubProjectVisible:false,
        isCatVisible:false,
        isUserModalVisible:false,
        isVendorVisible:false,
        isPayMethodVisible:false
      });
    }else{
    this.setState({
      project_name: item.val,
      project_id: item.id,
      isProjectVisible: !this.state.isProjectVisible,
      isSubProjectVisible: !this.state.isSubProjectVisible,
      isCatVisible:false,
        isUserModalVisible:false,
        isVendorVisible:false,
        isPayMethodVisible:false
    });
  }
    // this.onValueChange(item.id)
  };
  subprojectPressed = (item,extraData) => {
    let data = `${item.data.order_id}/${item.data.venue}/${moment(item.data.event_start_timestamp).format(" Do MMM YY")}/${item.data.customer_name}/${item.data.order_status}`
    if (this.state.catVal) {
      this.setState({
        // subproject_name: item.val,
        subproject_name: data,
        subproject_id: extraData.category_id,
        isSubProjectVisible: !this.state.isSubProjectVisible,
        isProjectVisible: false,
        isCatVisible:false,
        isUserModalVisible:false,
        isVendorVisible:false,
        isPayMethodVisible:false,
        extraData_id: item.id
      });
    } else {
      this.setState({
        // subproject_name: item.val,
        subproject_name: data,
        subproject_id: extraData.category_id,
        isSubProjectVisible: !this.state.isSubProjectVisible,
        isVendorVisible: false,
        isUserModalVisible:false,
        isProjectVisible: false,
        isCatVisible: !this.state.isCatVisible,
        isPayMethodVisible:false,
        extraData_id: item.id
      });
    }
  };
  payMethodPressed = (item) => {
    if (this.state.project_id) {
      this.setState({
        paymethod_name: item.val,
        paymethod_id: item.id,
        isPayMethodVisible: !this.state.isPayMethodVisible,
        isSubProjectVisible: false,
        isProjectVisible: false,
        isCatVisible:false,
        isUserModalVisible:false,
        isVendorVisible:false,
       
      });
    } else {
      this.setState({
        paymethod_name: item.val,
        paymethod_id: item.id,
        isPayMethodVisible: !this.state.isPayMethodVisible,
        isProjectVisible: !this.state.isProjectVisible,
        isSubProjectVisible: false,
        isCatVisible:false,
        isUserModalVisible:false,
        isVendorVisible:false,
      });
    }
  };
  catPressed = (item) => {
    this.setState({
      catName: item.val,
      // catValue: {
      //   id:item.data.id,
      //   customer_name : item.data.customer_name,
      //   venue : item.data.venue,
      //   event_start_timestamp : item.data.event_start_timestamp
      // },
      catVal: item.id,
      isCatVisible: !this.state.isCatVisible,
      isSubProjectVisible: false,
        isProjectVisible: false,
        isUserModalVisible:false,
        isVendorVisible:false,

    });
    // this.getVendors(item.id);
    if (!this.state.amount) {
      this.setState({
        amountFocused: !this.state.amountFocused
      },() => {
        this.amountRef.focus();
      })
    }
  };
  //Filter By Type
  filterProjectsByType = (type) => {
    return this.state.projects.filter((results) => {
      return results.category_type == type;
    });
  };
  filterSubProjectsByType = (type) => {
    return this.state.subprojects.filter((results) => {
      // console.log("Sub Projects-------->", results);
      return results.category_type == type;
    });
  };
  filterPayMethodByType = (type) => {
    return this.state.payMethod.filter((results) => {
      return results.category_type == type;
    });
  };
  filterResultsByType = (type) => {
    return this.state.catContent.filter((results) => {
      return results.category_type == type;
    });
  };
  amountFocusHandler = () => {
    this.setState({ amountFocused: !this.state.amountFocused, memoFocused: !this.state.memoFocused }, () => {
      if (this.state.memo) {
        this.memoRef.focus();
      }
    })
  }

  memoFocusHandler = () => {
    this.setState({ memoFocused: !this.state.memoFocused })
  }
  amountSet = (val) => {
    this.setState({
      amount: val,
    });
  };
  memoSet = (val) => {
    this.setState({ memo: val });
  };
  eventSet = (val) => {
    this.setState({ event: val });
  };
  editHandler = () => {
    this.setState({
      editable: true,
      saveBtnVisibility: true,
      editBtnVisibility: false,
      deleteBtnVisibility: false,
      isCatVisible: true,
    });
  };

  deleteHandler = () => {
    Alert.alert(
      "Delete this transaction?",
      "",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: this.deleteTransaction.bind(this) },
      ],
      { cancelable: false }
    );
  };

  deleteTransaction = async () => {
    const { transaction_id } = this.state;
    const { navigation } = this.props;
    let result = await AuthService.removeIncome(transaction_id);
    if (result.status == "1") {
      ToastAndroid.show(
        "Transaction deleted successfully",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      // navigation.push("CashFlow");
      this.gotoBack();
    } else {
      ToastAndroid.show(
        "Failed to delete transaction",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      // navigation.push("CashFlow");
      this.gotoBack();
    }
  };

  addIncomeHandler = async () => {
    const str = this.state.inputDate;
    // expanse Manager
    const newDate = moment(str).format("ddd-MMM-DD-YYYY");
    // const userAcc = await AuthService.getAccount();
    let userAcc = this.context.userData;
    // console.log("UserAcc", userAcc);
    if (newDate == "" || newDate == null) {
      console.log("Date is required");
      ToastAndroid.show(
        "Date is required",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else if (
      this.state.paymethod_name == "" ||
      this.state.paymethod_name == null
    ) {
      console.log("Paymethod is required");
      ToastAndroid.show(
        "Paymethod is required",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else if (this.state.catVal == "" || this.state.catVal == null) {
      console.log("Category is required");
      ToastAndroid.show(
        "Category is required",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else if (this.state.amount == "" || this.state.amount == null) {
      console.log("Amount is required");
      ToastAndroid.show(
        "Amount is required",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      if (userAcc != null) {
        this.setState({
          visible: true,
        });
        let result = await AuthService.incomeUpdate(
          newDate,
          // this.state.subproject_id,
          this.state.project_id,
          this.state.project_name,
          this.state.paymethod_name,
          this.state.catVal,
          this.state.amount,
          this.state.event,
          this.state.memo,
          this.state.localUri,
          this.state.imgName,
          this.state.expense_id,
          userAcc.cust_code,
          this.state.extraData_id,
          // this.state.subproject_name
          // JSON.stringify(this.state.catValue)
          this.state.catName
        );
        if (result == "Failed") {
          ToastAndroid.show(
            "We are faceing some server issues",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
          );
          // this.props.navigation.push("CashFlow");
          this.gotoBack();
        } else {
          if (result.status == "2") {
            ToastAndroid.show(
              "We are faceing some issues",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
          } else if (result.status == "0") {
            ToastAndroid.show(
              "We are faceing some issues",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50
            );
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
              // this.props.navigation.goBack();
              // this.props.navigation.push("CashFlow");
              this.gotoBack();
            }
          }
        }
      } else {
        Alert.alert(
          "You Need To Login",
          ``,
          [
            {
              text: "OK",
              onPress: () => {
                this.props.navigation.navigate("Login");
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  };

  onValueChange(value) {
    this.setState({
      project_id: value,
    });
    this.getSubProjectList(value);
  }

  // getSubProjectList = async (value) => {
  //   let result = await AuthService.getSubProjectList(value);
  //   // console.log("Resultr-------------------->", result);
  //   this.setState({
  //     subprojects: result,
  //   });
  // };
  getSubProjectList = async (value) => {
    let result = await AuthService.getNewSubProjectList(value);
    // console.log("Resultr-------------------->", result);
    this.setState({
      subprojects: result,
    });
  };

  onPickerProjectValueChange(value) {
    this.setState({
      selectedSubProject: value,
    });
  }

  onPayMethodValueChange(value) {
    this.setState({
      selectedPayMethod: value,
    });
  }
  componentWillUnmount() { }

  render() {
    const {
      visible,
      isCatVisible,
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
      editable,
      saveBtnVisibility,
      editBtnVisibility,
      deleteBtnVisibility,
      isProjectVisible,
      paymethod_name,
      subproject_name,
      isSubProjectVisible,
      isPayMethodVisible,
      loggedinUser,
      balanceAcc,
      workingDate,
      vendorList,
      payMethod,
      subprojects,
      projects,
      catContent,
      project_name
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
        {/* <MainHeader
          style={styles}
          navigation={this.props.navigation}
          account={loggedinUser}
          balanceAcc={balanceAcc}
          workingDate={workingDate}
          setWorkingDate={this.workingDateHandler}
        /> */}
           <Header
            // title={"Income"}
            title={`${this.context.userData.name}`}
            search={false}
            walletAmount={`${this.state.walletAmount}`}
            date={`${moment(this.state.workingDate).format('Do MMM yy ')}`}
            // drowerIcon={true}
            // onPress_drowerIcon={this.selectdrowerIcon}
          />
        {visible ?
          <Loader />
          :
          <>
            <View>
              <View style={{ marginHorizontal: 15 }}>
                <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.show ? styles.activeBottom : styles.inactiveBottom]}>
                  {/* <AntDesign name="calendar" size={20} color="black" /> */}
                  <Text>Date :</Text>
                  <TouchableOpacity
                    onPress={this.showDatePicker} 
                    style={[styles.inputStyle, { width: '100%', justifyContent: 'center' }]}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 14, color: '#656565' }}>{moment(inputDate).format("ddd MMM DD YYYY ")}</Text>
                  </TouchableOpacity>
                </View>
                {/* <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isPayMethodVisible ? styles.activeBottom : styles.inactiveBottom]}>
              
                  <TouchableWithoutFeedback onPress={this.togglePayMethodVisible}>
                    <View style={{ flex: 1, height: 40 }}>
                      <TextInput
                        placeholder="Select Pay Method"
                        style={styles.inputStyle}
                        editable={false}
                       
                        defaultValue={
                          paymethod_name != null ? paymethod_name : null
                        }
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View> */}

                {/* <View style={[{flexDirection:'row',alignItems:'center'},this.state.isProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
           
            <Text>Project :</Text>
              <TouchableWithoutFeedback onPress={this.toggleProjectVisible}>
                <View style={{ flex: 1, height: 40 }}>
                  <TextInput
                    placeholder="Project"
                    style={styles.inputStyle}
                    editable={false}
                  
                    defaultValue={
                      project_name != null ? project_name : null
                    }
                  />
                </View>
              </TouchableWithoutFeedback>
            </View> */}

                {/* <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isSubProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
                
                  <Text>Sub Project :</Text>
                  <TouchableWithoutFeedback onPress={this.toggleSubProjectVisible}>
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
                </View> */}

                <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isCatVisible ? styles.activeBottom : styles.inactiveBottom]}>
                  {/* <MaterialIcons name="category" size={20} color="black" /> */}
                  <Text>Category :</Text>
                  <TouchableWithoutFeedback onPress={this.toggleCatVisible}>
                    {/* <View style={{ flex: 1, height: 40 }}>
                      <TextInput
                        placeholder="Category"
                        style={styles.inputStyle}
                        editable={false}
                        defaultValue={catName != null ? catName : null}
                      />
                    </View> */}
                      <View style={{ flex: 1, height: 40 }}>
                          <TextInput
                            placeholder="Category"
                            style={styles.inputStyle}
                            editable={false}
                            defaultValue={catName != null ? catName : null}
                          />
                          </View>
                      
                  </TouchableWithoutFeedback>
                </View>
                <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.amountFocused ? styles.activeBottom : styles.inactiveBottom]}>
                  {/* <MaterialCommunityIcons name="currency-inr" size={20} color="black" /> */}
                  <Text>Amount :</Text>
                  <TextInput
                    placeholder="Amount"
                    ref={(ref) => (this.amountRef = ref)}
                    keyboardType={"number-pad"}
                    style={styles.inputStyle}
                    onChangeText={this.amountSet}
                    value={amount}
                    editable={editable}
                  //onSubmitEditing={() => this.eventRef._root.focus()}
                  />
                </View>
                {subproject_name == "Events" ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <MaterialIcons name="event-note" size={20} color="black" /> */}
                    <Text>Events :</Text>
                    <TextInput
                      placeholder="Event"
                      ref={(ref) => (this.eventRef = ref)}
                      style={styles.inputStyle}
                      keyboardType={"default"}
                      onChangeText={this.eventSet}
                      value={event == "null" ? "" : event}
                      editable={editable}
                      onSubmitEditing={() => this.memoRef._root.focus()}
                    />
                  </View>
                ) : null}
                <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.memoFocused ? styles.activeBottom : styles.inactiveBottom]}>
                <Text>Memo :</Text>
                  <TextInput
                    placeholder="Memo"
                    style={styles.inputStyle}
                    ref={(ref) => (this.memoRef = ref)}
                    keyboardType={"default"}
                    onChangeText={this.memoSet}
                    value={memo == "null" ? "" : memo}
                    editable={editable}
                  />
                  <TouchableOpacity
                    onPress={openImagePickerAsync}
                    style={{ position: 'absolute', right: 10 }}
                  >
                    <MaterialCommunityIcons name="camera" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
              {saveBtnVisibility ? (
                <View
                  style={{ marginHorizontal: 25, marginTop: 10, marginBottom: 10 }}
                >
                  <TouchableOpacity
                    primary
                    block
                    style={{
                      backgroundColor:Colors.primary,
                      height: 40,
                      paddingTop: 4,
                      paddingBottom: 4,
                    }}
                    onPress={this.addIncomeHandler}
                  >
                    <Text style={{ color:Colors.white, alignSelf: 'center', marginTop: 5 }}> Save </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <View
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  // flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                {deleteBtnVisibility ? (
                  <View
                    style={{
                      width: "40%",
                      padding: 5
                    }}
                  >
                    <TouchableOpacity
                      block
                      onPress={this.deleteHandler}
                      style={{
                        backgroundColor: "#F32013",
                      }}
                    >
                      <Text style={{ color: "#fff", alignSelf: 'center', marginVertical: 10 }}> Delete </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {editBtnVisibility ? (
                  <View
                    style={{
                      width: "40%",
                      padding: 5
                    }}
                  >
                    <TouchableOpacity
                      primary
                      block
                      onPress={this.editHandler}
                      style={{
                        backgroundColor: "#00B386",
                      }}
                    >
                      <Text style={{ color: "#fff", alignSelf: 'center', marginVertical: 10 }}> Edit </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View>

            {show && (
              // <DateTimePicker
              //   testID="dateTimePicker"
              //   timeZoneOffsetInMinutes={0}
              //   value={new Date()}
              //   mode={mode}
              //   is24Hour={true}
              //   display="default"
              //   onChange={this.onChange}
              //   // minimumDate={minDateValue}
              //   maximumDate={new Date()}
              // />
              <DateTimePickerModal
              mode={mode}
              display={Platform.OS == 'ios' ? 'inline' : 'default'}
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleConfirm}
              onCancel={this.hideDatePicker}
            />
            )}

            {localUri ? (
            <Image source={{ uri: localUri }} style={styles.thumbnail} />
          ) : null}

            {isProjectVisible ? (
              <View style={{ flex: 1, backgroundColor: "#fff" }}>
                {/* <Project
                  categoryData={this.filterProjectsByType("1")}
                  onCatPress={this.projectPressed}
                  heading={"Choose Project"}
                  userType={loggedinUser}
                  navigation={this.props.navigation}
                  permission={"No"}
                  screen={"AddPaymentOption"}
                /> */}
                      <Category
                    categoryData={this.filterProjectsByType("1",projects)}
                    onCatPress={this.projectPressed}
                    heading={"Choose Project"}
                  userType={loggedinUser}
                  navigation={this.props.navigation}
                  project={true}
                // permission={"Yes"}
                />
              </View>
            ) : null}
            {isSubProjectVisible ? (
              <View style={{ flex: 1, backgroundColor: "#fff" }}>
                {/* <Project
                  categoryData={this.filterSubProjectsByType("1")}
                  onCatPress={this.subprojectPressed}
                  heading={"Choose Sub Project"}
                  userType={loggedinUser}
                  navigation={this.props.navigation}
                  // permission={"Yes"}
                  screen={"AddProjects"}
                /> */}
                     <Category
                    // categoryData={this.filterSubProjectsByType("1",subprojects)}
                    categoryData={subprojects}
                    onCatPress={this.subprojectPressed}
                    heading={"Choose Sub Project"}
                  userType={loggedinUser}
                  navigation={this.props.navigation}
                  subproject={true}
                // permission={"Yes"}
                />
              </View>
            ) : null}
            {isPayMethodVisible ? (
              <View style={{ flex: 1, backgroundColor: "#fff" }}>
                {/* <Project
                  categoryData={this.filterPayMethodByType("1")}
                  onCatPress={this.payMethodPressed}
                  heading={"Choose Pay Method"}
                  userType={loggedinUser}
                  navigation={this.props.navigation}
                  // permission={"Yes"}
                  screen={"AddPaymentOption"}
                /> */}
                <Category
                  categoryData={this.filterPayMethodByType("1",payMethod)}
                  onCatPress={this.payMethodPressed}
                  heading={"Choose Pay Method"}
                  userType={loggedinUser}
                  navigation={this.props.navigation}
                // permission={"Yes"}
                />
              </View>
            ) : null}
            {isCatVisible ? (
              <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <SubCategory
                  categoryData={this.filterResultsByType("1",catContent)}
                  onCatPress={this.catPressed}
                  heading={"Choose Category"}
                  userType={loggedinUser}
                  navigation={this.props.navigation}
                permission={"Yes"}
                screen={"CategorySettings"}
                />
              </View>
            ) : null}
          </>
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  thumbnail: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 20,
  },
  indicatorStyle: {
    backgroundColor: "#ccc",
    height: 2,
  },
  tabBarFocusText: {
    color: "#fff",
    fontSize: 15,
    margin: 4,
    fontWeight: "600",
  },
  tabBarText: {
    color: "#eee",
    fontSize: 15,
    margin: 4,
    fontWeight: "600",
  },
  tabBarBackground: {
    backgroundColor: "#00B386",
  },
  iconStyle: {
    fontSize: 15,
  },
  inputStyle: {
    fontSize: 14,
    height: 40,
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
