import React from "react";
import {
  StyleSheet,
  View,
  Modal,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Alert,
  ToastAndroid,
  SafeAreaView,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Pressable
} from "react-native";
import { Foundation, MaterialIcons, AntDesign, Octicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker";
import Category from "../../components/CashFlow/component/category/index";
import Project from "../../components/CashFlow/component/project/index";
import UserList from "../../components/CashFlow/component/UserList";
import MainHeader from "../../components/CashFlow/component/MainHeader";
import NetInfo from "@react-native-community/netinfo";
import ServerErrorComponent from "../../components/CashFlow/component/Error/serverError";
import NetworkErrorComponent from "../../components/CashFlow/component/Error/networkError";
import * as ImagePicker from "expo-image-picker";
import AuthService from "../../services/CashFlow/Auth";
import Colors from '../../config/colors';
import { Header } from "../../components";
import AppContext from '../../context/AppContext';
import moment from "moment";
import AwesomeAlert from 'react-native-awesome-alerts';
import { showDateAsClientWant } from "../../utils/Util";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SubCategory from "../../components/CashFlow/component/subCategory/index";
import Modal2 from "react-native-modal";
import { SearchAllType, SearchGameForUpdateOrder } from "../../services/GameApiService";
import CachedImage from 'expo-cached-image';
import LottieView from "lottie-react-native";
import Configs from "../../config/Configs";

let debouceTimerId = null;

export default class Transfer extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    //console.log("Transfer Props-------->", props.loggedInUser)
    this.state = {
      isModalVisible: false,
      selected2: "",
      catName: null,
      catValue: null,
      localUri: null,
      TextInputDate: new Date().toDateString(),
      mode: "date",
      show: false,
      catContent: this.props.catContent,
      amount: null,
      memo: '',
      visible: false,
      startDate: new Date(),
      userList: this.props.userList,
      isUserModalVisible: false,
      userName: null,
      userID: null,
      //userID = receiver cust_code,
      isSubProjectVisible: false,
      isCatVisible: false,
      minDateValue: new Date(),
      projects: this.props.projects,
      project_name: "Event",
      project_id: '2',
      subprojects: this.props.subprojects,
      subproject_name: '',
      subproject_id: '',
      selectedItem: undefined,
      selectedSubProject: undefined,
      payMethod: this.props.payMethod,
      paymethod_name: "Cash",
      paymethod_id: "",
      loggedInUser: '',
      workingDate: new Date(),
      serverError: false,
      networkAvailable: true,
      walletAmount: 0,
      amountFocused: false,
      memoFocused: false,
      showAlert: false,
      check: '',
      message: '',
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
      showMore: false,

      gameAddModalVisible: false,
      searchQuery: "",
      searchLists: [],
      isSearching: false,
      isSearchedPreviously: false,
      selectedGame: null
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    //   this.getminDate();
    // this.focusListener = navigation.addListener("focus", () => {
    //   this.getUserList();
    //   this.updateAccount();
    //   this.getCategory();
    //   this.getPayMethod();
    //   this.getProjectDetails();
    //   // this.getSubProjectDetails();
    //   this.getSubProjectList(this.state.selectedProject_id);
    //   this.setState({
    //     amount: null,
    //     memo: '',
    //   })
    // });
    // NetInfo.addEventListener((state) => {
    //   if (state.isConnected) {
    //     this.setState({
    //       networkAvailable: true,
    //     });
    //   } else {
    //     this.setState({
    //       networkAvailable: false,
    //       showAlert: true,
    //       check: 'Success',
    //       message: 'Back Online',
    //     });
    //     // ToastAndroid.show({
    //     //   text: "Back Online",
    //     //   textStyle: { fontSize: 14 },
    //     //   duration: 2000,
    //     //   position: "bottom",
    //     //   type: "danger",
    //     // });
    //   }
    // });
    // this.workingDateHandler();
    console.log('.............transfer........this.props.Order_CashFlow............', this.props.Order_CashFlow)
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

  // getCategory = async () => {
  //   // let contentt = await AuthService.getCat();
  //   let contentt = await AuthService.getCatnew();
  //   if (contentt != "Failed") {
  //     this.setState({
  //       catContent: contentt,
  //       serverError: false,
  //     });
  //   } else {
  //     this.setState({
  //       serverError: true,
  //     });
  //   }
  // };

  getCategory = async () =>{
    get_new_category().then((res)=>{
      console.log('.........res..........',res);
      this.setState({
              catContent: res,
              serverError: false,
            });
    }).catch(()=>{})
  }

  async updateAccount() {
    // let userAcc = await AuthService.getAccount();
    let userAcc = this.context.userData;
    let acdata = await AuthService.retriveAccount(
      userAcc.cust_code,
      userAcc.id
    );
    console.log('.......acdata.account.amount..............', acdata.account.amount);
    this.setState({ walletAmount: acdata.account.amount })
    if (acdata.status != 0) {
      this.setState({ loggedInUser: acdata.account, serverError: false });
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
  //   let subprojects = await AuthService.getSubProject(userAcc.cust_code);
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
    this.setState({ minDateValue: prevDate });
  }

  getBalanceAcc = async (user) => {
    // console.log("User----->", user.account.user_type)
    let userAcc = this.context.userData;
    let acdata = await AuthService.fetchDetailsAccounts(
      userAcc.cust_code,
      userAcc.id
    );
    // this.setState({walletAmount:acdata.account.amount})
    if (acdata != "failed") {
      if (acdata.status != 0) {
        this.setState({ balanceAcc: acdata.account });
      }
    }
  };

  _refreshHandler = () => {
    this.getUserList();
    this.getminDate();
    this.updateAccount();
    this.getCategory();
    this.getPayMethod();
    this.getProjectDetails();
    // this.getSubProjectDetails();
    this.getSubProjectList(this.state.selectedProject_id);
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
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    // Remove the event listener
    // this.focusListener.remove();
  }

  _keyboardDidShow() {
    //console.log("Keyboard Showed")
    // console.log("Keyboard Dismiss---------->",Keyboard.dismiss)
    this.setState({
      isCatVisible: false,
      isPayMethodVisible: false,
      isSubProjectVisible: false,
    });
    //alert("Key Board Pops")
  }

  _keyboardDidHide() {
    console.log("Keyboard hidee");
  }

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.startDate;
    this.setState({
      TextInputDate: currentDate.toDateString(),
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

  toggleModal = () => {
    //console.log('isModalVisible', this.state.isModalVisible)
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  toggleUserModal = () => {
    //console.log('isModalVisible', this.state.isModalVisible)
    this.setState({ isUserModalVisible: !this.state.isUserModalVisible });
  };

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

  onValueChange2 = (value) => {
    //console.log("value ", value);
    this.setState({
      selected2: value,
    });
    // console.log(this.state.selected2);
  };

  filterPayMethodByType = (type) => {
    return this.state.payMethod.filter((results) => {
      return results.category_type == type;
    });
  };

  // filterResultsByType = (type) => {
  //   return this.state.catContent.filter((results) => {
  //     return results.category_type == type;
  //   });
  // };

  filterResultsByType = (type, content) => {
    return content.filter((results) => {
      return results.category_type == type;
    });
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
        isProjectVisible: !this.state.isProjectVisible
      });
    }
    // setTimeout(() => {
    //   this.amountRef.focus();
    // }, 100);
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

  subprojectPressed = (item, extraData) => {
    // let data = `${item.data.order_id}/${item.data.venue}/${moment(item.data.event_start_timestamp).format(" Do MMM YY")}/${item.data.customer_name}/${item.data.order_status}`
    // console.log('............data...........',data);
    if (this.state.catVal) {
      this.setState({
        subproject_name: item.val,
        // subproject_name: data,
        subproject_id: extraData.category_id,
        isSubProjectVisible: !this.state.isSubProjectVisible,
        isVendorVisible: false,
        extraData_id: item.id
      });
    } else {
      this.setState({
        subproject_name: item.val,
        // subproject_name: data,
        subproject_id: extraData.category_id,
        isSubProjectVisible: !this.state.isSubProjectVisible,
        isVendorVisible: false,
        isCatVisible: !this.state.isCatVisible,
        extraData_id: item.id
      });
    }
  };

  togglePayMethodVisible = () => {
    this.setState({
      isPayMethodVisible: !this.state.isPayMethodVisible,
      isSubProjectVisible: false,
      isCatVisible: false,
      isProjectVisible: false,
      isSubCatVisible: false,
    });
    Keyboard.dismiss();
  };
  toggleCatVisible = () => {
    this.setState({
      isCatVisible: !this.state.isCatVisible,
      isPayMethodVisible: false,
      isSubProjectVisible: false,
      isSubCatVisible: false,
    });
    Keyboard.dismiss();
  };

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
      isPayMethodVisible: false,
      isSubCatVisible: false,
      isVendorVisible: false,
    });
    Keyboard.dismiss();
  };
  // toggleSubCatVisible = () => {
  //   this.setState({
  //     isSubCatVisible: !this.state.isSubCatVisible,
  //     isProjectVisible: false,
  //     isPayMethodVisible: false,
  //     isSubProjectVisible: false,
  //     isCatVisible: false,
  //     isVendorVisible: false,
  //   });
  //   Keyboard.dismiss();
  // };
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
      isSubCatVisible: false,
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

  getUserList = async () => {
    // let userAcc = await AuthService.getAccount();
    let userAcc = this.context.userData;
    let result = await AuthService.getUserList(userAcc.cust_code);
    // console.log('..............userList...............',result);
    this.setState({ userList: result })
  };
  amountFocusHandler = () => {
    this.setState({ amountFocused: !this.state.amountFocused, memoFocused: !this.state.memoFocused }, () => {
      if (this.state.memo.length < 0) {
        // this.memoRef.focus();
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
    this.setState({ memo: val.nativeEvent.text });
  };

  transferHandler = async () => {
    const str = this.state.TextInputDate;
    const newDate = str.replace(/ /g, "-");
    console.log('.....this.state.userID ...........', this.state.userID);
    // return
    // console.log("newDate", typeof(this.state.memo))
    // const userAcc = await AuthService.getAccount();
    let userAcc = this.context.userData;
    //  console.log("UserAcc", userAcc);
    if (newDate == "" || newDate == null) {
      // ToastAndroid.show({
      //   text: "Date is required",
      //   textStyle: { fontSize: 14 },
      //   duration: 3000,
      //   position: "bottom",
      //   type: "danger",
      // });
      this.setState
        ({
          showAlert: true,
          check: 'Error',
          message: 'Date is required',
        })
    } else if (
      this.state.paymethod_name == "" ||
      this.state.paymethod_name == null
    ) {
      // ToastAndroid.show({
      //   text: "Paymethod is required",
      //   textStyle: { fontSize: 14 },
      //   duration: 3000,
      //   position: "bottom",
      //   type: "danger",
      // });
      this.setState
        ({
          showAlert: true,
          check: 'Error',
          message: 'Paymethod is required',
        })
    } else if (this.state.catVal == "" || this.state.catVal == null) {

      this.setState
        ({
          showAlert: true,
          check: 'Error',
          message: 'Category is required',
        })
    } else if (this.state.userID == "" || this.state.userID == null) {
      // ToastAndroid.show({
      //   text: "You need to select a user",
      //   textStyle: { fontSize: 14 },
      //   duration: 3000,
      //   position: "bottom",
      //   type: "danger",
      // });
      this.setState
        ({
          showAlert: true,
          check: 'Error',
          message: 'You need to select a user',
        })
    } else if (this.state.amount == "" || this.state.amount == null) {
      // ToastAndroid.show({
      //   text: "Amount is required",
      //   textStyle: { fontSize: 14 },
      //   duration: 3000,
      //   position: "bottom",
      //   type: "danger",
      // });
      this.setState
        ({
          showAlert: true,
          check: 'Error',
          message: 'Amount is required',
        })
    } else {
      if (userAcc != null) {
        this.setState({
          visible: true,
        });
        let result = await AuthService.addTransfer(
          newDate,
          // this.state.subproject_id,
          this.state.project_id,
          this.state.project_name,
          this.state.paymethod_name,
          this.state.catVal,
          this.state.amount,
          this.state.memo,
          this.state.localUri,
          this.state.userID,
          userAcc.cust_code,
          this.state.extraData_id,
          // this.state.subproject_name
          // JSON.stringify(this.state.catValue)
          this.state.catName
        );
        if (result == "Failed") {
          console.log("Result===========>", result);
          // ToastAndroid.show({
          //   text: "We are faceing some server issues",
          //   textStyle: { fontSize: 14 },
          //   duration: 3000,
          //   position: "bottom",
          //   type: "danger",
          // });
          this.setState({
            visible: false,
            showAlert: true,
            check: 'Error',
            message: 'We are faceing some server issues',
          });
        } else {
          if (result.status == "2") {
            this.setState({
              visible: false,
              showAlert: true,
              check: 'Error',
              message: 'We are faceing some issues',
            });
            // ToastAndroid.show({
            //   text: "We are faceing some issues",
            //   textStyle: { fontSize: 14 },
            //   duration: 3000,
            //   position: "bottom",
            //   type: "danger",
            // });
          } else if (result.status == "0") {
            this.setState({
              visible: false,
              showAlert: true,
              check: 'Error',
              message: 'We are faceing some issues',
            });
            // ToastAndroid.show({
            //   text: "We are faceing some issues",
            //   textStyle: { fontSize: 14 },
            //   duration: 3000,
            //   position: "bottom",
            //   type: "danger",
            // });
          } else {
            if (result.status == "1") {
              this.setState({
                visible: false,
                showAlert: true,
                check: 'Success',
                message: 'Transfer done successfully',
              });
              this.props.navigation.push("CashFlow");
              // return;
              // ToastAndroid.show({
              //   text: "Transfer done successfully",
              //   textStyle: { fontSize: 14 },
              //   duration: 3000,
              //   position: "bottom",
              //   type: "success",
              // });
            }
          }
        }
      } else {
        // console.log("Error");
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
  hideDatePicker = () => {
    this.setState({ isDateTimePickerVisible: false })
  };
 
  handleConfirm = (selectedDate) => {
    const currentDate = selectedDate;
    this.setState({
      TextInputDate: currentDate.toDateString(),
      show: false,
    });
    this.hideDatePicker();
  };

  showDatePicker = () => {
    console.log('.....showDatePicker...........');
    this.setState({ mode: 'date', isDateTimePickerVisible: true, show:true })
  };

  transferContinueHandler = async () => {
    const str = this.state.TextInputDate;
    const newDate = str.replace(/ /g, "-");
    Keyboard.dismiss();
    console.log('.....this.state.userID ...........', this.state.userID);
    // return
    // console.log("newDate", typeof(this.state.memo))
    const userAcc = await AuthService.getAccount();
    //  console.log("UserAcc-->", userAcc);
    if (newDate == "" || newDate == null) {
      // ToastAndroid.show({
      //   text: "Date is required",
      //   textStyle: { fontSize: 14 },
      //   duration: 3000,
      //   position: "bottom",
      //   type: "danger",
      // });
      ({
        showAlert: true,
        check: 'Error',
        message: 'Date is required',
      })
    } else if (
      this.state.paymethod_name == "" ||
      this.state.paymethod_name == null
    ) {
      // ToastAndroid.show({
      //   text: "Paymethod is required",
      //   textStyle: { fontSize: 14 },
      //   duration: 3000,
      //   position: "bottom",
      //   type: "danger",
      // });
      this.setState
        ({
          showAlert: true,
          check: 'Error',
          message: 'Paymethod is required',
        })
    } else if (this.state.catVal == "" || this.state.catVal == null) {
      // ToastAndroid.show({
      //   text: "Category is required",
      //   textStyle: { fontSize: 14 },
      //   duration: 3000,
      //   position: "bottom",
      //   type: "danger",
      // });
      this.setState
        ({
          showAlert: true,
          check: 'Error',
          message: 'Category is required',
        })
    } else if (this.state.userID == "" || this.state.userID == null) {
      // ToastAndroid.show({
      //   text: "You need to select a user",
      //   textStyle: { fontSize: 14 },
      //   duration: 3000,
      //   position: "bottom",
      //   type: "danger",
      // });
      this.setState
        ({
          showAlert: true,
          check: 'Error',
          message: 'You need to select a user',
        })
    } else if (this.state.amount == "" || this.state.amount == null) {
      // ToastAndroid.show({
      //   text: "Amount is required",
      //   textStyle: { fontSize: 14 },
      //   duration: 3000,
      //   position: "bottom",
      //   type: "danger",
      // });
      this.setState
        ({
          showAlert: true,
          check: 'Error',
          message: 'Amount is required',
        })
      // }else if (this.state.localUri == "" || this.state.localUri == null) {
      //   ToastAndroid.show({
      //     text: "Image is required",
      //     textStyle: { fontSize: 14 },
      //     duration: 3000,
      //     position: "bottom",
      //     type: "danger",
      //   });
    } else {
      if (userAcc != null) {
        this.setState({
          visible: true,
        });
        let result = await AuthService.addTransfer(
          newDate,
          // this.state.subproject_id,
          this.state.project_id,
          this.state.project_name,
          this.state.paymethod_name,
          this.state.catVal,
          this.state.amount,
          this.state.memo,
          this.state.localUri,
          this.state.userID,
          userAcc.cust_code,
          this.state.extraData_id,
          // this.state.subproject_name
          // JSON.stringify(this.state.catValue)
          this.state.catName
        );
        if (result == "Failed") {
          //console.log("Result===========>", result);
          // ToastAndroid.show({
          //   text: "We are faceing some server issues",
          //   textStyle: { fontSize: 14 },
          //   duration: 3000,
          //   position: "bottom",
          //   type: "danger",
          // });
          this.setState({
            visible: false,
            showAlert: true,
            check: 'Error',
            message: 'We are faceing some server issues',
          });
        } else {
          if (result.status == "2") {
            this.setState({
              visible: false,
              showAlert: true,
              check: 'Error',
              message: 'We are faceing some server issues',
            });
            // ToastAndroid.show({
            //   text: "We are faceing some issues",
            //   textStyle: { fontSize: 14 },
            //   duration: 3000,
            //   position: "bottom",
            //   type: "danger",
            // });
          } else if (result.status == "0") {
            this.setState({
              visible: false,
              showAlert: true,
              check: 'Error',
              message: 'We are faceing some server issues',
            });
            // ToastAndroid.show({
            //   text: "We are faceing some issues",
            //   textStyle: { fontSize: 14 },
            //   duration: 3000,
            //   position: "bottom",
            //   type: "danger",
            // });
          } else {
            if (result.status == "1") {
              this.setState({
                visible: false,
                paymethod_name: "Cash",
                catVal: "",
                catName: "",
                amount: "",
                memo: "",
                userID: "",
                userName: "",
                isCatVisible: true,
                showAlert: true,
                check: 'Success',
                message: 'Transfer done successfully',
              });
              this._refreshHandler()
              // ToastAndroid.show({
              //   text: "Transfer done successfully",
              //   textStyle: { fontSize: 14 },
              //   duration: 3000,
              //   position: "bottom",
              //   type: "success",
              // });
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

  selectdrowerIcon = () => {
    // this.state.navigation.navigate('AccountDetailsScreen')
    this.props.navigation.navigate('ChangePayMethod')
  }

  // console.log("props expense===============>", props)
  render() {
    const {
      style,
      TextInputDate,
      minDateValue,
      catName,
      catValue,
      localUri,
      amount,
      memo,
      isCatVisible,
      mode,
      show,
      startDate,
      userList,
      isUserModalVisible,
      userName,
      paymethod_name,
      isPayMethodVisible,
      loggedInUser,
      subproject_name,
      isSubProjectVisible,
      subprojects,
      catContent,
      networkAvailable,
      serverError,
      workingDate,
      project_name,
      isProjectVisible,
      projects,
      subcatName,
      isSubCatVisible,
      subcatContent
    } = this.state;
    // console.log('.........transfer..props................',this.props)
    if (!networkAvailable) {
      return (
        <NetworkErrorComponent onRequestClose={this._handleBackButtonClick} />
      );
    }

    if (serverError) {
      return (
        <ServerErrorComponent
          onPress={this._refreshHandler}
          onRequestClose={this._handleBackButtonClick}
        />
      );
    }

    let openImagePickerAsync = async () => {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync();
      // console.log("Result -->", pickerResult);

      if (pickerResult.cancelled === true) {
        return;
      }
      console.log("Result -->", pickerResult.uri);
      this.setState({ localUri: pickerResult.uri });

    };

  let Newdate = moment(TextInputDate).format("DD/MM/YY")

    return (
      <SafeAreaView style={styles.container}>
        {/* <MainHeader
          style={styles}
          navigation={this.props.navigation}
          account={loggedInUser}
          balanceAcc={balanceAcc}
          workingDate={workingDate}
          setWorkingDate={this.workingDateHandler}
        /> */}
        {/* <Header
          // title={"Income"}
          title={`${this.context.userData.name}`}
          search={false}
          walletAmount={`${this.state.walletAmount}`}
          date={`${moment(workingDate).format('Do MMM yy ')}`}
          drowerIcon={true}
          onPress_drowerIcon={this.selectdrowerIcon}
        /> */}
        <View contentContainerStyle={{ flex: 1 }}>
          <View style={{ marginHorizontal: 15 }}>
            <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.show ? styles.activeBottom : styles.inactiveBottom]}>
              {/* <AntDesign name="calendar" size={20} color="black" /> */}
              <Text>Date :</Text>
              <TouchableWithoutFeedback  onPress={()=>this.showDatePicker()}>
              <TextInput
                placeholder="Date"
                style={styles.TextInputStyle}
                value={Newdate}
                // value={TextInputDate}
                // onTouchStart={this.showDatepicker}
                onTouchStart={this.showDatePicker}
              />
              {/* <Text style={styles.TextInputStyle}>{TextInputDate}</Text> */}
              </TouchableWithoutFeedback>
            </View>
            {/* <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isPayMethodVisible ? styles.activeBottom : styles.inactiveBottom]}>
              <Text>Payment :</Text>
              <TouchableWithoutFeedback onPress={this.togglePayMethodVisible}>
                <View style={{ flex: 1, height: 40 }}>
                  <TextInput
                    placeholder="Select Pay Method"
                    style={styles.TextInputStyle}
                    editable={false}
                    defaultValue={
                      paymethod_name != null ? paymethod_name : null
                    }
                  />
                </View>
              </TouchableWithoutFeedback>
            </View> */}
            {/* {this.state.Order_CashFlow == true ?
              <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
              
                <Text>Project :</Text>
                <TouchableWithoutFeedback >
                  <View style={{ flex: 1, height: 40 }}>
                    <TextInput
                      placeholder="Project"
                      style={styles.TextInputStyle}
                      editable={false}
                     
                      defaultValue={
                        project_name != null ? project_name : null
                      }
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              :
              <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
              
                <Text>Project :</Text>
                <TouchableWithoutFeedback onPress={this.toggleProjectVisible}>
                  <View style={{ flex: 1, height: 40 }}>
                    <TextInput
                      placeholder="Project"
                      style={styles.TextInputStyle}
                      editable={false}
                      
                      defaultValue={
                        project_name != null ? project_name : null
                      }
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            } */}
            {/* {this.state.Order_CashFlow == true ?
              <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isSubProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
             
                <Text>Sub Project :</Text>
                <TouchableWithoutFeedback >
                  <View style={{ flex: 1, height: 40 }}>
                    <TextInput
                      placeholder="Sub Project"

                      style={styles.TextInputStyle}
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
                <TouchableWithoutFeedback onPress={this.toggleSubProjectVisible}>
                  <View style={{ flex: 1, height: 40 }}>
                    <TextInput
                      placeholder="Sub Project"

                      style={styles.TextInputStyle}
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
              {/* <MaterialIcons name="category" size={20} color="black" /> */}
              <Text>Category :</Text>
              <TouchableWithoutFeedback onPress={this.toggleCatVisible}>
            
                      <View style={{ flex: 1, height: 40 }}>
                          <TextInput
                            placeholder="Category"
                            style={styles.TextInputStyle}
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
                    style={styles.TextInputStyle}
                    editable={false}
                    // ref={ref => this.cateRef = ref }
                    // onFocus={this.catFocus}
                    defaultValue={subcatName != null ? subcatName : null}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View> */}

            <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isUserModalVisible ? styles.activeBottom : styles.inactiveBottom]}>
              {/* <FontAwesome name="user" size={20} color="black" /> */}
              <Text>User :</Text>
              <TouchableWithoutFeedback onPress={this.toggleUserModal}>
                <View style={{ flex: 1, height: 40 }}>
                  <TextInput
                    placeholder="Select User"
                    editable={false}
                    style={styles.TextInputStyle}
                    defaultValue={userName != null ? userName : null}
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
                style={styles.TextInputStyle}
                onChangeText={this.amountSet}
                value={amount}
                onBlur={this.amountFocusHandler}
              // onSubmitEditing={() => this.memoRef._root.focus()}
              />
            </View>
            {this.state.showMore ?
            <>
            <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.memoFocused ? styles.activeBottom : styles.inactiveBottom]}>
            <Text>Memo :</Text>
              <TextInput
                placeholder="Memo"
                ref={(ref) => (this.memoRef = ref)}
                keyboardType={"default"}
                style={styles.TextInputStyle}
                onChange={this.memoSet}
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

            <View style={[{ flexDirection: 'row', alignItems: 'center',marginVertical :5 },]}>
                        {/* <AntDesign name="isv" size={20} color="black" /> */}
                        <Text>Product :</Text>
                        <TouchableWithoutFeedback onPress={() => { this.setState({ gameAddModalVisible: true }) }}>
                          <View style={{ flex: 1, height: 40 }}>
                            {this.state.selectedGame == null ?
                              <TextInput
                                placeholder="Choose Product"
                                style={styles.inputStyle}
                                editable={false}
                               
                              />
                              :
                              <View style={{flexDirection:'row',alignItems: 'center',marginLeft:10}}>
                                <View style={{ width: "20%" }}>
                                  <CachedImage
                                    style={{ height: 57, width: "100%" }}
                                    source={{ uri: Configs.NEW_COLLECTION_URL + this.state.selectedGame.image }}
                                    resizeMode="cover"
                                    cacheKey={`${this.state.selectedGame.image}+${this.state.selectedGame.id}`}
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
                                    paddingLeft: 10,
                                  }}
                                >
                                  <Text
                                    style={[styles.titleText,]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                  >
                                    {this.state.selectedGame.name}
                                  </Text>
                                </View>
                                <View style={{ width: "25%" }}>
                                  <Text style={[styles.inputLable, { marginBottom: 0, padding: 0, fontSize: 14 }]}>
                                    <FontAwesome name="rupee" size={13} color={Colors.grey} />
                                    {Math.trunc(this.state.selectedGame.rent)}
                                  </Text>
                                </View>
                              </View>
                            }
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
            </>
  : null}
            <View style={{ width: '100%',marginTop:5}}>
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
            }}
          >
            <TouchableOpacity
              primary
              block
              onPress={this.transferHandler}
              style={{
                backgroundColor: Colors.primary,
                height: 40,
                paddingTop: 4,
                paddingBottom: 4,
                width: 150,
              }}
            >
              <Text style={{ color: Colors.white, alignSelf: 'center', marginTop: 5 }}> Save </Text>
            </TouchableOpacity>

            <TouchableOpacity
              primary
              block
              onPress={this.transferContinueHandler}
              style={{
                backgroundColor: Colors.primary,
                width: 150,
                height: 40,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              <Text style={{ color: Colors.white, alignSelf: 'center', marginTop: 5 }}> Continue </Text>
            </TouchableOpacity>
          </View>
        </View>
        {isUserModalVisible ? (
          <Modal isVisible={isUserModalVisible}>
            <View style={{ flex: 1, backgroundColor: Colors.white }}>
              <UserList userData={this.state.userList} onUserPress={this.userPressed} />
              <TouchableOpacity
                block
                style={{ backgroundColor: Colors.primary, height: 50, width: '100%', justifyContent: 'center' }}
                onPress={this.toggleUserModal}
              >
                <Text style={{ color: Colors.white, fontSize: 18, alignSelf: 'center' }}> Close </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        ) : (
          <View></View>
        )}
        {show && (
          // <DateTimePicker
          //   testID="dateTimePicker"
          //   timeZoneOffsetInMinutes={0}
          //   value={startDate}
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
        {isPayMethodVisible ? (
          <View style={{ flex: 0.8, backgroundColor: "#fff", marginVertical: 10 }}>
            <Project
              categoryData={this.filterPayMethodByType("1")}
              onCatPress={this.payMethodPressed}
              heading={"Choose Pay Method"}
              userType={loggedInUser}
              navigation={this.props.navigation}
              permission={"Yes"}
              screen={"AddPaymentOption"}
            />
          </View>
        ) : null}
        {isCatVisible ? (
          <View style={{ flex: 0.8, backgroundColor: "#fff", marginVertical: 10 }}>
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
          <View style={{ flex: 0.8, backgroundColor: "#fff", marginVertical: 10 }}>
            <Category
              categoryData={this.filterResultsByType("1", projects)}
              onCatPress={this.projectPressed}
              heading={"Choose Project"}
              userType={loggedInUser}
              navigation={this.props.navigation}
              permission={"Yes"}
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
              permission={"Yes"}
              screen={"AddProjects"}
              subproject={true}
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

function SearchEmptyScreen() {
  return (
    <>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <LottieView
          style={{
            width: 80,
            height: 80,
          }}
          source={require("../../assets/lottie/no-result-found.json")}
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

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
  },
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
  TextInputStyle: {
    fontSize: 14,
    height: 40,
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
  inputStyle: {
    fontSize: 14,
    height: 40,
    color: '#656565',
    marginLeft: 10,
  },
});
