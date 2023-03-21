/*
*
* move and modify from cashflow app
* updated by - Rahul Saha
* updated on - 29.12.22
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
    Modal,
  } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Category from "../../components/CashFlow/component/category/index";
import Project from "../../components/CashFlow/component/project/index";
import UserList from "../../components/CashFlow/component/UserList";
import Colors from '../../config/colors';
import MainHeader from "../../components/CashFlow/component/MainHeader";
import * as ImagePicker from "expo-image-picker";
import AuthService from "../../services/CashFlow/Auth";
import moment from "moment";
import { Header } from '../../components';
import Loader from '../../components/Loader';
import AppContext from "../../context/AppContext";
import { MaterialIcons , AntDesign ,Octicons , MaterialCommunityIcons,FontAwesome} from '@expo/vector-icons';
import AwesomeAlert from 'react-native-awesome-alerts';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SubCategory from "../../components/CashFlow/component/subCategory/index";


export default class TransferEdit extends React.Component {
    static contextType = AppContext;
  constructor(props) {
    super(props);
    const timeStamp = Date.parse(
        this.props.route.params.data.transaction_date
    );
    // console.log('............this.props.route.params.subprojects.......',this.props.route.params.subprojects)
    this.state = {
      transfer_id: this.props.route.params.id,
      transaction_id:this.props.route.params.transaction_id,
      catName:this.props.route.params.data.cat_name,
      // catValue: JSON.parse(this.props.route.params.data.event_details),
      catValue: (this.props.route.params.data.event_details),
      catVal:this.props.route.params.data.category_id,
      localUri: this.props.route.params.data.image == null ? null :  this.props.route.params.data.image,
      inputDate: new Date(timeStamp).toDateString(),
      mode: "date",
      show: false,
      catContent:this.props.route.params.categoryData,
      amount:this.props.route.params.data.amount,
      memo:this.props.route.params.data.remarks,
      visible: false,
      startDate: new Date(),
      userList: this.props.route.params.userList,
      isUserModalVisible: false,
      userName: this.props.route.params.data.received_person_name,
      userID: this.props.route.params.data.received_on_account,
      isCatVisible: false,
      minDateValue: new Date(),
      editable: false,
      saveBtnVisibility: false,
      editBtnVisibility: true,
      deleteBtnVisibility: true,
      payMethod:this.props.route.params.payMethod,
      paymethod_name:this.props.route.params.data.pay_method,
      paymethod_id: "",
      loggedinUser: this.props.route.params.account,
      balanceAcc: [],
      projects:this.props.route.params.projects,
      project_name:this.props.route.params.data.project,
      project_id: this.props.route.params.data.project_id,
      subprojects:this.props.route.params.subprojects,
      subproject_name:this.props.route.params.data.event_details,
      subproject_id: this.props.route.params.data
      .sub_project_id,
      isProjectVisible: false,
      isSubProjectVisible: false,
      workingDate: new Date(),

      walletAmount: 0,
      showAlert: false,
      check: '',
      message: '',
      //project id = 2 for event
      selectedProject_id: 2,
      extraData_id:this.props.route.params.data.extra_id,
      isDateTimePickerVisible: false
    };
  }

  async componentDidMount() {
    this.getminDate();
    //this.getBalanceAcc(this.state.loggedinUser);
    this.workingDateHandler();
    // this.getUserList();
    this.updateAccount();
    // this.getCategory();
    this.getPayMethod();
    // this.getProjectDetails();
    // this.getSubProjectList(this.state.selectedProject_id);
  }
  gotoBack = () => this.props.navigation.goBack();
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
    //   this.getBalanceAcc(acdata);
    } else if (acdata == "failed") {
      this.setState({
        serverError: true,
      });
    }
  }

  getUserList = async () => {
    // let userAcc = await AuthService.getAccount();
    let userAcc = this.context.userData;
    let result = await AuthService.getUserList(userAcc.cust_code);
    // console.log('..............userList...............',result);
    this.setState({ userList: result })
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

  getPayMethod = async () => {
    const payMethod = await AuthService.getPayMethod();
    this.setState({ payMethod: payMethod });
  };

  getProjectDetails = async () => {
    let projects = await AuthService.getProject();
    this.setState({ projects: projects });
  };

  workingDateHandler = (value) => {
    this.setState({ workingDate: value });
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
    this.setState({ minDateValue: prevDate });
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

  UNSAFE_componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidHide() {
    console.log("Keyboard hidee");
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
      inputDate: currentDate.toDateString(),
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

  //Toggle Section
  toggleProjectVisible = () => {
    this.setState({
      isProjectVisible: !this.state.isProjectVisible,
      isCatVisible: false,
      isPayMethodVisible: false,
      isSubProjectVisible: false,
    });
  };
  toggleSubProjectVisible = () => {
    this.setState({
      isSubProjectVisible: !this.state.isSubProjectVisible,
      isCatVisible: false,
      isProjectVisible: false,
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
    });
    Keyboard.dismiss();
  };
  toggleCatVisible = () => {
    this.setState({
      isCatVisible: !this.state.isCatVisible,
      isSubProjectVisible: false,
      isPayMethodVisible: false,
      isProjectVisible: false,
    });
    Keyboard.dismiss();
  };

  toggleUserModal = () => {
    this.setState({ isUserModalVisible: !this.state.isUserModalVisible });
    Keyboard.dismiss();
  };

  onValueChange2 = (value) => {
    // console.log("value ", value);
    this.setState({
      selected2: value,
    });
    // console.log(this.state.selected2);
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

  //Option Pressed Section

  projectPressed = (item) => {
    if (this.state.subproject_id){
      this.setState({
        project_name: item.val,
        project_id: item.id,
        isProjectVisible: !this.state.isProjectVisible,
        isCatVisible:false,
        isPayMethodVisible:false,
      });
    }else{
    this.setState({
      project_name: item.val,
      project_id: item.id,
      isProjectVisible: !this.state.isProjectVisible,
      isSubProjectVisible: !this.state.isSubProjectVisible,
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
        isVendorVisible: false,
        extraData_id: item.id
      });
    } else {
      this.setState({ // subproject_name: item.val,
        subproject_name: data,  subproject_name: item.val,
        subproject_id: extraData.category_id,
        isSubProjectVisible: !this.state.isSubProjectVisible,
        isVendorVisible: false,
        isCatVisible: !this.state.isCatVisible,
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
  // catPressed = (item) => {
  //   //console.log(item)
  //   this.setState({
  //     catName: item.val,
  //     catVal: item.id,
  //     isCatVisible: !this.state.isCatVisible,
  //   });
  //   if (!this.state.userID) {
  //     setTimeout(() => {
  //       this.setState({ isUserModalVisible: !this.state.isUserModalVisible });
  //     }, 100);
  //   }
  // };
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
        // catValue: {
        //   id: item.data.id,
        //   customer_name: item.data.customer_name,
        //   venue: item.data.venue,
        //   event_start_timestamp: item.data.event_start_timestamp
        // },
        catVal: item.id,
        isCatVisible: !this.state.isCatVisible,
        amountFocused: true
      });
    }
    if (!this.state.userID) {
          setTimeout(() => {
            this.setState({ isUserModalVisible: !this.state.isUserModalVisible });
          }, 100);
        }
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  userPressed = (item) => {
    console.log('...............userPressed....', item.cust_code)
    this.setState({
      userName: item.name,
      userID: item.cust_code,
      isUserModalVisible: !this.state.isUserModalVisible,
      isPayMethodVisible: false,
      isSubProjectVisible: false,
      isCatVisible: false,
    });
    Keyboard.dismiss();
    if (!this.state.amount) {
      this.setState({
        amountFocused: !this.state.amountFocused
      })
      setTimeout(() => {
        this.amountRef.focus();
      }, 300);
    }

  };

  amountSet = (val) => {
    //console.log("Amount", val)
    this.setState({
      amount: val,
    });
    //        console.log("Val",val.nativeEvent.text)
  };
  memoSet = (val) => {
    this.setState({ memo: val.nativeEvent.text });
  };

  editHandler = () => {
    this.setState({
      editable: true,
      saveBtnVisibility: true,
      editBtnVisibility: false,
      deleteBtnVisibility: false,
      isCatVisible: true,
      isSubProjectVisible: false,
      isPayMethodVisible: false,
      isProjectVisible: false,
      isUserModalVisible:false
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
    let result = await AuthService.removeTransfer(transaction_id);
    if (result.status == "1") {
    //   ToastAndroid.show({
    //     text: "Transaction deleted successfully",
    //     textStyle: { fontSize: 14 },
    //     duration: 1000,
    //     position: "bottom",
    //     type: "success",
    //   });
    this.setState({
        showAlert: true,
        check: 'Success',
        message: 'Transaction deleted successfully',
      });
      // navigation.navigate("CashFlow");
      this.gotoBack();
    } else {
    //   ToastAndroid.show({
    //     text: "Failed to delete transaction",
    //     textStyle: { fontSize: 14 },
    //     duration: 1000,
    //     position: "bottom",
    //     type: "danger",
    //   });
    this.setState({
        showAlert: true,
        check: 'Error',
        message: 'Failed to delete transaction',
      });
      // navigation.navigate("CashFlow");
      this.gotoBack();
    }
  };

  transferHandler = async () => {
    const str = this.state.inputDate;
    const newDate = str.replace(/ /g, "-");

    // console.log("newDate", typeof(this.state.memo))
    // const userAcc = await AuthService.getAccount();
    let userAcc = this.context.userData;
    // console.log("UserAcc", userAcc);
    if (newDate == "" || newDate == null) {
    //   ToastAndroid.show({
    //     text: "Date is required",
    //     textStyle: { fontSize: 14 },
    //     duration: 3000,
    //     position: "bottom",
    //     type: "danger",
    //   });
    this.setState({
        showAlert: true,
        check: 'Error',
        message: 'Date is required',
      });
    } else if (
      this.state.paymethod_name == "" ||
      this.state.paymethod_name == null
    ) {
    //   ToastAndroid.show({
    //     text: "Paymethod is required",
    //     textStyle: { fontSize: 14 },
    //     duration: 3000,
    //     position: "bottom",
    //     type: "danger",
    //   });
      this.setState({
        showAlert: true,
        check: 'Error',
        message: 'Paymethod is required',
      });
    } else if (this.state.catVal == "" || this.state.catVal == null) {
    //   ToastAndroid.show({
    //     text: "Category is required",
    //     textStyle: { fontSize: 14 },
    //     duration: 3000,
    //     position: "bottom",
    //     type: "danger",
    //   });
    this.setState({
        showAlert: true,
        check: 'Error',
        message: 'Category is required',
      });
    } else if (this.state.userID == "" || this.state.userID == null) {
    //   ToastAndroid.show({
    //     text: "You need to select a user",
    //     textStyle: { fontSize: 14 },
    //     duration: 3000,
    //     position: "bottom",
    //     type: "danger",
    //   });
    this.setState({
        showAlert: true,
        check: 'Error',
        message: 'You need to select a user',
      });
    } else if (this.state.amount == "" || this.state.amount == null) {
    //   ToastAndroid.show({
    //     text: "Amount is required",
    //     textStyle: { fontSize: 14 },
    //     duration: 3000,
    //     position: "bottom",
    //     type: "danger",
    //   });
    this.setState({
        showAlert: true,
        check: 'Error',
        message: 'Amount is required',
      });
    } else {
      if (userAcc != null) {
        this.setState({
          visible: true,
        });
        let result = await AuthService.updateTransfer(
          newDate,
          // this.state.subproject_id,
          this.state.project_id,
          this.state.project_name,
          this.state.paymethod_name,
          this.state.catVal,
          this.state.amount,
          this.state.memo,
          this.state.userID,
          this.state.localUri,
          userAcc.cust_code,
          this.state.transfer_id,
          this.state.extraData_id,
          // this.state.subproject_name
          JSON.stringify(this.state.catValue)
        );
        console.log(result)
        
        if (result == "Failed") {
        //   ToastAndroid.show({
        //     text: "We are faceing some server issues",
        //     textStyle: { fontSize: 14 },
        //     duration: 3000,
        //     position: "bottom",
        //     type: "danger",
        //   });
        this.setState({
            showAlert: true,
            check: 'Error',
            message: 'We are faceing some server issues',
          });
          // this.props.navigation.push("CashFlow");
          this.gotoBack();
        } else {
          if (result.status == "2") {
            // ToastAndroid.show({
            //   text: "We are faceing some issues",
            //   textStyle: { fontSize: 14 },
            //   duration: 3000,
            //   position: "bottom",
            //   type: "danger",
            // });
            this.setState({
                showAlert: true,
                check: 'Error',
                message: 'We are faceing some issues',
              });
          } else if (result.status == "0") {
            // ToastAndroid.show({
            //   text: "We are faceing some issues",
            //   textStyle: { fontSize: 14 },
            //   duration: 3000,
            //   position: "bottom",
            //   type: "danger",
            // });
            this.setState({
                showAlert: true,
                check: 'Error',
                message: 'We are faceing some issues',
              });
          } else {
            if (result.status == "1") {
                // this.props.navigation.push("CashFlow");
                this.gotoBack();   
            //   ToastAndroid.show({
            //     text: "Transfer done successfully",
            //     textStyle: { fontSize: 14 },
            //     duration: 3000,
            //     position: "bottom",
            //     type: "success",
            //   });
              this.setState({
                visible: false,
                showAlert: true,
                check: 'Success',
                message: 'Transfer done successfully',
              });
              
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
                this.props.navigation.push("Login");
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  };

//   getSubProjectList = async (value) => {
//     let result = await AuthService.getSubProjectList(value);
//     // console.log("Resultr-------------------->", result);
//     this.setState({
//       subprojects: result,
//     });
//   };
onValueChange(value) {
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
  // console.log("props expense===============>", props)
  render() {
    const {
      isCatVisible,
      style,
      inputDate,
      minDateValue,
      catName,
      catValue,
      localUri,
      amount,
      memo,
      mode,
      show,
      userList,
      isUserModalVisible,
      userName,
      editable,
      saveBtnVisibility,
      editBtnVisibility,
      deleteBtnVisibility,
      paymethod_name,
      isPayMethodVisible,
      loggedinUser,
      isProjectVisible,
      isSubProjectVisible,
      subproject_name,
      workingDate,
      balanceAcc,
      project_name,
      projects,
      subprojects,
      catContent,
      loggedInUser
    } = this.state;
    //console.log("Localuri=============>", !localUri);
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
          date={`${moment(workingDate).format('Do MMM yy ')}`}
          // drowerIcon={true}
          // onPress_drowerIcon={this.selectdrowerIcon}
        />
        <View>
          {isUserModalVisible ? (
            <Modal isVisible={isUserModalVisible}>
              <View style={{ flex: 1, backgroundColor: Colors.white }}>
                <UserList userData={userList} onUserPress={this.userPressed} />
                <TouchableOpacity
                style={{ backgroundColor: Colors.primary, height: 50, width: '100%', justifyContent: 'center' }}
                  block
                  onPress={this.toggleUserModal}
                >
                  <Text style={{ color: Colors.white, fontSize: 18, alignSelf: 'center' }}> Close </Text>
                </TouchableOpacity>
              </View>
            </Modal>
          ) : (
            <View></View>
          )}
          <View style={{ marginHorizontal: 15 }}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
              <TouchableOpacity
                style={{
                  flex: 1,
                }}
                onPress={this.showDatePicker} 
              >
              <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.show ? styles.activeBottom : styles.inactiveBottom]}>
                 {/* <AntDesign name="calendar" size={20} color="black" /> */}
                 <Text>Date :</Text>
                  <TextInput
                    placeholder="Date"
                    style={styles.inputStyle}
                    value={inputDate}
                    editable={false}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isPayMethodVisible ? styles.activeBottom : styles.inactiveBottom]}>
          
            <Text>Payment :</Text>
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

            <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isUserModalVisible ? styles.activeBottom : styles.inactiveBottom]}>
            {/* <FontAwesome name="user" size={20} color="black" /> */}
            <Text>User :</Text>
              <TouchableWithoutFeedback onPress={this.toggleUserModal}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    placeholder="Select User"
                    style={styles.inputStyle}
                    editable={false}
                    defaultValue={userName ? userName : null}
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
                // onSubmitEditing={() => this.memoRef._root.focus()}
              />
            </View>
            <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.memoFocused ? styles.activeBottom : styles.inactiveBottom]}>
            <Text>Memo :</Text>
              <TextInput
                placeholder="Memo"
                ref={(ref) => (this.memoRef = ref)}
                keyboardType={"default"}
                style={styles.inputStyle}
                onChange={this.memoSet}
                value={memo}
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
              style={{
                marginHorizontal: 25,
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <TouchableOpacity
                primary
                block
                onPress={this.transferHandler}
                style={{
                  backgroundColor: Colors.primary,
                  paddingTop: 4,
                  paddingBottom: 4,
                  height: 40,
                }}
              >
                <Text style={{ color:Colors.white , alignSelf: 'center', marginTop: 5}}> Save </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
            //   flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {deleteBtnVisibility ? (
              <View
                style={{
                  width: "40%",
                }}
              >
                <TouchableOpacity
                  block
                  onPress={this.deleteHandler}
                  style={{
                    backgroundColor: Colors.danger,
                  }}
                >
                  <Text style={{ color: Colors.white, alignSelf: 'center', marginVertical: 10 }}> Delete </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {editBtnVisibility ? (
              <View
                style={{
                  width: "40%",
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
                  <Text style={{ color: Colors.white , alignSelf: 'center', marginVertical: 10}}> Edit </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          {localUri !=null ? (
            <Image source={{ uri: localUri }} style={styles.thumbnail} />
          ) : null}
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
        {isPayMethodVisible ? (
          <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <Project
              categoryData={this.filterPayMethodByType("1")}
              onCatPress={this.payMethodPressed}
              heading={"Choose Pay Method"}
              userType={loggedinUser}
              navigation={this.props.navigation}
              permission={"Yes"}
              screen={"AddPaymentOption"}
            />
          </View>
        ) : null}
        {isCatVisible ? (
      <View style={{ flex: 0.8, backgroundColor: Colors.white, marginVertical: 10 }}>
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
         {isProjectVisible ? (
          <View style={{ flex: 0.8, backgroundColor: Colors.white, marginVertical: 10 }}>
            <Category
              categoryData={this.filterProjectsByType("1", projects)}
              onCatPress={this.projectPressed}
              heading={"Choose Project"}
              userType={loggedInUser}
              navigation={this.props.navigation}
              permission={"Yes"}
            //   screen={"AddPaymentOption"}
            project={true}
            />
          </View>
        ) : null}

        {isSubProjectVisible ? (
          <View style={{ flex: 0.8, backgroundColor: Colors.white, marginVertical: 10 }}>
            <Category
              // categoryData={this.filterSubProjectsByType("1", subprojects)}
              categoryData={subprojects}
              onCatPress={this.subprojectPressed}
              heading={"Choose Sub Project"}
              userType={loggedInUser}
              navigation={this.props.navigation}
              permission={"Yes"}
              screen={"AddProjects"}
              subproject={true}
            />
          </View>
        ) : null}

<AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title={this.state.check}
          message={this.state.message}
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
