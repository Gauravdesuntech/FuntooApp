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
  ToastAndroid
} from "react-native";
import { Toast } from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import Category from "../../components/CashFlow/component/category/index";
import Project from "../../components/CashFlow/component/project/index";
import MainHeader from "../../components/CashFlow/component/MainHeader";
import NetInfo from "@react-native-community/netinfo";
import ServerErrorComponent from "../../components/CashFlow/component/Error/serverError";
import NetworkErrorComponent from "../../components/CashFlow/component/Error/networkError";
import * as ImagePicker from "expo-image-picker";
import AuthService from "../../services/CashFlow/Auth";
import moment from "moment";
import { Header } from '../../components'
import Loader from '../../components/Loader';
import Colors from '../../config/colors';
import AppContext from '../../context/AppContext';
import { MaterialIcons, AntDesign, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default class ToPay extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    //  console.log("Props expense---------->", props.loggedInUser)
    super(props);

    this.state = {
      isModalVisible: false,
      selected2: "Cash",
      catName: null,
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
      paymethod_name: "Cash",
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

  componentDidMount() {
    const { navigation } = this.props;
    // this.focusListener = navigation.addListener("focus", () => {
    //   this.updateAccount();
    //   this.getCategory();
    //   this.getPayMethod();
    //   this.getProjectDetails();
    //   // this.getSubProjectDetails();
    //   this.getSubProjectList(this.state.selectedProject_id);
    //   // if (this.context.userData.wallet != null) {
    //   //   this.setState({walletAmount:parseInt(this.context.userData.wallet.amount)})
    //   //   }
    // });
    // NetInfo.addEventListener((state) => {
    //   if (state.isConnected) {
    //     this.setState({
    //       networkAvailable: true,
    //     });
    //   } else {
    //     this.setState({
    //       networkAvailable: false,
    //     });
    //     Toast.show({
    //       text: "Back Online",
    //       textStyle: { fontSize: 14 },
    //       duration: 2000,
    //       position: "bottom",
    //       type: "danger",
    //     });
    //   }
    // });
    //   this.workingDateHandler();
    // console.log('...............expense......this.props.Order_CashFlow............', this.props.Order_CashFlow)
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
        isSubProjectVisible: true
      })
    }
    // })
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
  // subcatPressed = (item) => {

  //   this.setState({
  //     subcatName: item.val,
  //     subcatVal: item.id,
  //     isSubCatVisible: !this.state.isSubCatVisible,
  //     amountFocused: true
  //   });
  //   if (!this.state.amount) {
  //     setTimeout(() => {
  //       this.amountRef.focus();
  //     }, 100);
  //   }
  // };


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
    });
    Keyboard.dismiss();
  };
  // toggleSubCatVisible = () => {
  //   this.setState({
  //     isSubCatVisible: !this.state.isSubCatVisible,
  //     isProjectVisible: false,
  //     isPayMethodVisible: false,
  //     isSubProjectVisible: false,
  //     isCatVisible: false
  //   });
  //   Keyboard.dismiss();
  // };

  getVendors = async (cat_id) => {
    let vendorResult = await AuthService.getVendorList(cat_id);
    console.log("vendorResult", vendorResult);
    //  console.log("Vendor List-------->", vendorResult)
    this.setState({ vendorList: vendorResult });
    // setTimeout(() => {
    //   this.amountRef._root.focus();
    // }, 100);
  };
  // catFocus = ()=>{
  //     console.log("Expense")
  //     Keyboard.dismiss()
  //    this.CategoryBottom.open()

  // }
  amountFocusHandler = () => {
    this.setState({ amountFocused: !this.state.amountFocused, memoFocused: !this.state.memoFocused }, () => {
      if (!this.state.memo) {
        this.memoRef.focus();
      }
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
    }else{
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

  addExpenseHandler = async () => {
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
        let result = await AuthService.expenseAdd(
          newDate,
          // this.state.subproject_id,
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
          this.state.subproject_name
        );
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
          this.props.navigation.push("Home");
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
              this.props.navigation.goBack();
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

  addContinueHandler = async () => {
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
        let result = await AuthService.expenseAdd(
          newDate,
          // this.state.subproject_id,
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
          this.state.subproject_name
        );
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
          this.props.navigation.push("Home");
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
              Keyboard.dismiss();
              this.setState({
                visible: false,
                project_name: "",
                project_id: "",
                vendorName: "",
                vendorId: "",
                subproject_name: this.state.loggedInUser.project_name,
                subproject_id: this.state.loggedInUser.project_id,
                paymethod_name: "Cash",
                catVal: "",
                catName: "",
                amount: "",
                event: "",
                memo: "",
                localUri: null,
                isCatVisible: true,
              });
              this._refreshHandler();
              //this.props.navigation.push("TabNavigator");
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

  onPickerValueChange(value) {
    this.setState({
      selected1: value,
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
      subcatContent
    } = this.state;

    // if (!networkAvailable) {
    //   return (
    //     <NetworkErrorComponent onRequestClose={this._handleBackButtonClick} />
    //   );
    // }

    // if (serverError) {
    //   return (
    //     <ServerErrorComponent
    //       onPress={this._refreshHandler}
    //       onRequestClose={this._handleBackButtonClick}
    //     />
    //   );
    // }

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
        {/* <Header
          // title="Expense" 
          title={`${this.context.userData.name}`}
          walletAmount={`${this.state.walletAmount}`}
          date={`${moment(this.state.workingDate).format('Do MMM yy ')}`}
          search={false}
          drowerIcon={true}
          onPress_drowerIcon={this.selectdrowerIcon}
        /> */}
        {visible ?
          <Loader />
          :
          <>
            <View>
              <View>
                <View style={{ marginHorizontal: 15 }}>
                  <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.show ? styles.activeBottom : styles.inactiveBottom]}>
                    <AntDesign name="calendar" size={20} color="black" />
                    <TouchableOpacity
                      onPress={this.showDatePicker}
                      style={[
                        styles.inputStyle,
                        { width: "100%", justifyContent: "center" },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 14, color: "#656565" }}>
                        {moment(inputDate).format("ddd MMM DD YYYY ")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                 
                  {/* <<<<<-----this code edited by sharad yadav on date 03-02-23---->>>>> */}
                  
                  {/* <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isPayMethodVisible ? styles.activeBottom : styles.inactiveBottom]}>
                    <MaterialIcons name="payment" size={20} color="black" />
                    <TouchableWithoutFeedback onPress={this.togglePayMethodVisible}>
                      <View style={{ flex: 1, height: 40 }}>
                        <TextInput
                          placeholder="Select Pay Method"
                          style={styles.inputStyle}
                          editable={false}
                          // ref={ref => this.cateRef = ref }
                          // onFocus={this.catFocus}
                          defaultValue={
                            paymethod_name != null ? paymethod_name : null
                          }
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View> */}

                  {this.state.Order_CashFlow == true ?
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
                      <MaterialIcons name="list-alt" size={20} color="black" />
                      <TouchableWithoutFeedback >
                        <View style={{ flex: 1, height: 42 }}>
                          <TextInput
                            placeholder="Project"
                            style={styles.inputStyle}
                            editable={false}
                            // ref={ref => this.cateRef = ref }
                            // onFocus={this.catFocus}
                            defaultValue={project_name != null ? project_name : null}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                    :
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
                      <MaterialIcons name="list-alt" size={20} color="black" />
                      <TouchableWithoutFeedback onPress={this.toggleProjectVisible}>
                        <View style={{ flex: 1, height: 42 }}>
                          <TextInput
                            placeholder="Project"
                            style={styles.inputStyle}
                            editable={false}
                            // ref={ref => this.cateRef = ref }
                            // onFocus={this.catFocus}
                            defaultValue={project_name != null ? project_name : null}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  }
                  {this.state.Order_CashFlow == true ?
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isSubProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
                      <Octicons name="project" size={20} color="black" />
                      <TouchableWithoutFeedback>
                        <View style={{ flex: 1, height: 40 }}>
                          <TextInput
                            placeholder="Sub Project"
                            style={styles.inputStyle}
                            editable={false}
                            multiline={true}
                            // ref={ref => this.cateRef = ref }
                            // onFocus={this.catFocus}
                            defaultValue={
                              subproject_name != null ? subproject_name : null
                            }
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                    :
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isSubProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
                      <Octicons name="project" size={20} color="black" />
                      <TouchableWithoutFeedback
                        onPress={this.toggleSubProjectVisible}
                      >
                        <View style={{ flex: 1, height: 40 }}>
                          <TextInput
                            placeholder="Sub Project"
                            style={styles.inputStyle}
                            editable={false}
                            multiline={true}
                            // ref={ref => this.cateRef = ref }
                            // onFocus={this.catFocus}
                            defaultValue={
                              subproject_name != null ? subproject_name : null
                            }
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  }
                  <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isCatVisible ? styles.activeBottom : styles.inactiveBottom]}>
                    <MaterialIcons name="category" size={20} color="black" />
                    <TouchableWithoutFeedback onPress={this.toggleCatVisible}>
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

                  {/* <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isSubCatVisible ? styles.activeBottom : styles.inactiveBottom]}>
                    <MaterialIcons name="category" size={20} color="black" />
                    <TouchableWithoutFeedback onPress={this.toggleSubCatVisible}>
                      <View style={{ flex: 1, height: 40 }}>
                        <TextInput
                          placeholder="Sub Category"
                          style={styles.inputStyle}
                          editable={false}
                          // ref={ref => this.cateRef = ref }
                          // onFocus={this.catFocus}
                          defaultValue={subcatName != null ? subcatName : null}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View> */}

                  <View>
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.amountFocused ? styles.activeBottom : styles.inactiveBottom]}>
                      <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
                      <TextInput
                        placeholder="Amount"
                        ref={(ref) => (this.amountRef = ref)}
                        keyboardType={"number-pad"}
                        onChangeText={this.amountSet}
                        style={styles.inputStyle}
                        value={amount}
                        onBlur={this.amountFocusHandler}
                      // onSubmitEditing={() => this.eventRef._root.focus()}
                      />
                    </View>

                    {/* code has been changed by sharad on the date 02/02/23, that is if payment method is by Cash then dont't show paymenn div option ----->>>> */}

                    {paymethod_name != "Cash" ? (
                    <View style={[{ flexDirection: 'row', alignItems: 'center',height:40 }, this.state.amountFocused ? styles.activeBottom : styles.inactiveBottom]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center',marginHorizontal: 5 }}>
                        <TouchableWithoutFeedback onPress={() => {
                          this.payAmount()
                        }}>
                          <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="black" />
                        </TouchableWithoutFeedback>
                        <Text style={styles.boxStyle}>to pay</Text>
                      </View>
                       <View style={{ flexDirection: 'row', alignItems: 'center',marginHorizontal: 5 }}>
                          {this.state.paid ?
                            <TouchableOpacity onPress={()=>this.setState({paid:false})}>
                              <MaterialCommunityIcons name="checkbox-intermediate" size={24} color={Colors.primary} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={()=>this.setState({paid:true})}>
                              <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="black" />
                            </TouchableOpacity>
                          }
                          <Text style={[styles.boxStyle]}>already paid</Text>
                        </View>
                      </View> )
                      : null }
                  </View> 
                  {subproject_name == "Events" ? (
                    <View>
                      <MaterialIcons name="event-note" size={20} color="black" />
                      <TextInput
                        placeholder="Event"
                        ref={(ref) => (this.eventRef = ref)}
                        keyboardType={"default"}
                        style={styles.inputStyle}
                        onChangeText={this.eventSet}
                        value={event}
                        onSubmitEditing={() => this.memoRef.focus()}
                      />
                    </View>
                  ) : null}

                  <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.memoFocused ? styles.activeBottom : styles.inactiveBottom]}>
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

                  {/* <<<<<-----this code edited by sharad yadav on date 03-02-23---->>>>> */}

                  {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AntDesign name="isv" size={20} color="black" />
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
                  </View> */}
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
                    onPress={this.addExpenseHandler}
                    style={{
                      backgroundColor: Colors.primary,
                      height: 40,
                      paddingTop: 4,
                      paddingBottom: 4,
                      width: 150,
                    }}
                  >
                    <Text style={{ color: "#fff", alignSelf: 'center', marginTop: 5 }}>Pay</Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    primary
                    block
                    onPress={this.addContinueHandler}
                    style={{
                      backgroundColor: Colors.primary,
                      width: 150,
                      height: 40,
                      paddingTop: 4,
                      paddingBottom: 4,
                    }}
                  >
                    <Text style={{ color: "#fff", alignSelf: 'center', marginTop: 5 }}> Continue </Text>
                  </TouchableOpacity> */}
                </View>

              </View>
            </View>
            {show && (
              // <DateTimePicker
              //   testID="dateTimePicker"
              //   timeZoneOffsetInMinutes={0}
              //   value={startDate}
              //   mode={mode}
              //   is24Hour={true}
              //   display="default"
              //   onChange={this.onChange}
              //   minimumDate={minDateValue}
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
                  // categoryData={this.filterResultsByType("1", subprojects)}
                  categoryData={subprojects}
                  onCatPress={this.subprojectPressed}
                  heading={"Choose Sub Project"}
                  userType={loggedInUser}
                  navigation={this.props.navigation}
                  subproject={true}
                  // permission={"Yes"}
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
                  // permission={"Yes"}
                  screen={"AddPaymentOption"}
                />
              </View>
            ) : null}
            {isVendorVisible ? (
              <View style={{ flex: 0.8, backgroundColor: "#fff" }}>
                <Project
                  // categoryData={this.filterResultsByType("1", vendorList)} 
                  categoryData={vendorList}
                  onCatPress={this.vendorPressed}
                  heading={"Choose Vendor"}
                  userType={loggedInUser}
                  navigation={this.props.navigation}
                  // permission={"Yes"}
                  screen={"AddVendor"}
                />
              </View>
            ) : null}
            {isCatVisible ? (
              <View style={{ flex: 0.8, backgroundColor: "#fff" }}>
                <Category
                  categoryData={this.filterResultsByType("1", catContent)}
                  onCatPress={this.catPressed}
                  heading={"Choose Category"}
                  userType={loggedInUser}
                  navigation={this.props.navigation}
                  // permission={"Yes"}
                  screen={"AddCategory_Cashflow"}
                />
              </View>
            ) : null}
            {/* {isSubCatVisible ? (
              <View style={{ flex: 0.8, backgroundColor: "#fff", marginVertical: 10 }}>
                <Category
                  categoryData={this.filterResultsByType("1", catContent)}
                  onCatPress={this.subcatPressed}
                  heading={"Choose Sub Category"}
                  userType={loggedInUser}
                  navigation={this.props.navigation}
                // permission={"Yes"}
                // screen={"AddCategory_Cashflow"}
                />
              </View>
            ) : null} */}
          </>
        }
      </SafeAreaView>
    );
  }
}

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
    color: "#656565",
    marginLeft: 10,
  },
  boxStyle: {
    fontSize: 14,
    color: "#656565",
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
  }
});
