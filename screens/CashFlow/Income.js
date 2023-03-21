/*
*
* move and modify from cashflow app
* updated by - Rahul Saha
* updated on - 24.11.22
*
*/


import React from 'react'
import { Header } from '../../components'
import Colors from '../../config/colors';
import Configs from '../../config/Configs'
import AppContext from '../../context/AppContext';
import { Foundation, MaterialIcons, AntDesign, Octicons, MaterialCommunityIcons,  } from '@expo/vector-icons';
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
  ToastAndroid,
  Text,
  ActivityIndicator,
  ScrollView,
  Pressable
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Category from "../../components/CashFlow/component/category";
import MainHeader from "../../components/CashFlow/component/MainHeader";
import NetInfo from "@react-native-community/netinfo";
import ServerErrorComponent from "../../components/CashFlow/component/Error/serverError";
import NetworkErrorComponent from "../../components/CashFlow/component/Error/networkError";
import * as ImagePicker from "expo-image-picker";
import AuthService from "../../services/CashFlow/Auth";
import moment from "moment";
import OverlayLoader from '../../components/OverlayLoader';
import Loader from '../../components/Loader';
import { showDateAsClientWant } from '../../utils/Util';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SubCategory from "../../components/CashFlow/component/subCategory/index"
import Modal from "react-native-modal";
import { SearchAllType, SearchGameForUpdateOrder } from "../../services/GameApiService";
import CachedImage from 'expo-cached-image';
import LottieView from "lottie-react-native";

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

let debouceTimerId = null;
export default class Income extends React.Component {
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
      isProjectVisible: false,
      isSubProjectVisible: false,
      catContent: this.props.catContent,
      subcatContent: [],
      amount: null,
      memo: null,
      event: "",
      visible: false,
      startDate: new Date(),
      isUserModalVisible: false,
      userName: null,
      userID: null,
      isCatVisible: false,
      // isSubCatVisible: false,
      minDateValue: new Date(),
      projects: this.props.projects,
      project_name: "Event",
      project_id: '2',
      // subprojects: '',
      subproject_name: '',
      subproject_id: '',
      selectedItem: undefined,
      selected1: '',
      subprojects: this.props.subprojects,
      selectedSubProject: undefined,
      payMethod: this.props.payMethod,
      paymethod_name: "Cash",
      paymethod_id: "",
      loggedInUser: '',
      workingDate: new Date(),
      serverError: false,
      networkAvailable: true,
      amountFocused: false,
      projectFocused: false,
      memoFocused: false,
      walletAmount: 0,

      //project id = 2 for event
      selectedProject_id: 2,

      extraData_id: '',

      subcatName: null,
      subcatVal: '',
      Order_CashFlow: false,
      isDateTimePickerVisible: false,
      paid: false,
      showMore: false,
     
      gameAddModalVisible: false,
      searchQuery: "",
      searchLists: [],
      isSearching: false,
      isSearchedPreviously: false,
      selectedGame: null
    }
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
    //   // this.setState({walletAmount:parseInt(this.context.userData.wallet.amount)})
    //   // }
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
    //     ToastAndroid.show({
    //       text: "Back Online",
    //       textStyle: { fontSize: 14 },
    //       duration: 2000,
    //       position: "bottom",
    //       type: "danger",
    //     });
    //   }
    // });
    // this.workingDateHandler();
    console.log('...............income......this.props.projects............', this.props.projects)
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
    // console.log('.....................this.props.subproject_id............',this.props)
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
    this.setState({ minDateValue: prevDate, visible: false });
  }

  getBalanceAcc = async (user) => {
    // console.log("User----->", user.account.user_type)
    let userAcc = this.context.userData;
    let acdata = await AuthService.fetchDetailsAccounts(
      userAcc.cust_code,
      userAcc.id
    );
    if (acdata != "failed") {
      if (acdata.status != 0) {
        this.setState({ balanceAcc: acdata.account });
      }
    }
  };

  _refreshHandler = () => {
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
    // this.focusListener.remove();
  }

  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.startDate;
    this.setState({
      inputDate: selectedDate,
      show: false,
    })
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
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  onValueChange2 = (value) => {
    //console.log("value ", value);
    this.setState({
      selected2: value,
    });
    //console.log(this.state.selected2);
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
  projectPressed = (item) => {
    if (this.state.subproject_name) {
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

  filterResultsByType = (type, content) => {
    return content.filter((results) => {
      return results.category_type == type;
    });
  };

  _keyboardDidShow() {
    //console.log("Keyboard Showed")
    // console.log("Keyboard Dismiss---------->",Keyboard.dismiss)
    this.setState({
      isPayMethodVisible: false,
      isSubProjectVisible: false,
      isCatVisible: false,
      isProjectVisible: false,
      // isSubCatVisible: false,
    });
    //alert("Key Board Pops")
  }

  _keyboardDidHide() {
  }

  toggleProjectVisible = () => {
    this.setState({
      isProjectVisible: !this.state.isProjectVisible,
      isCatVisible: false,
      isPayMethodVisible: false,
      isSubProjectVisible: false,
      // isSubCatVisible: false,
    });
    Keyboard.dismiss();
  };
  toggleSubProjectVisible = () => {
    this.setState({
      isSubProjectVisible: !this.state.isSubProjectVisible,
      isCatVisible: false,
      isProjectVisible: false,
      isPayMethodVisible: false,
      // isSubCatVisible: false,
    });
    Keyboard.dismiss();
  };
  toggleCatVisible = () => {
    this.setState({
      isCatVisible: !this.state.isCatVisible,
      isProjectVisible: false,
      isPayMethodVisible: false,
      isSubProjectVisible: false,
      // isSubCatVisible: false,
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
  togglePayMethodVisible = () => {
    this.setState({
      isPayMethodVisible: !this.state.isPayMethodVisible,
      isSubProjectVisible: false,
      isCatVisible: false,
      isProjectVisible: false,
      // isSubCatVisible: false,
    });
    Keyboard.dismiss();
  };

  projectFocusHandler = () => {
    this.setState({ projectFocused: !this.state.projectFocused, memoFocused: !this.state.memoFocused }, () => {
      // this.memoRef.focus();
    })
  }

  amountFocusHandler = () => {
    this.setState({ amountFocused: !this.state.amountFocused, memoFocused: !this.state.memoFocused }, () => {
      if (this.state.memo) {
        // this.memoRef.focus();
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
        let result = await AuthService.incomeAdd(
          newDate,
          this.state.project_id,
          // this.state.subproject_id,
          this.state.project_name,
          // this.state.subproject_name,
          this.state.paymethod_name,
          this.state.catVal,
          this.state.amount,
          this.state.event,
          this.state.memo,
          this.state.localUri,
          userAcc.cust_code,
          this.state.extraData_id,
        // this.state.subproject_name
        // JSON.stringify(this.state.catValue)
        this.state.catName
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
          this.props.navigation.push("CashFlow");
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
        let result = await AuthService.incomeAdd(
          newDate,
          this.state.project_id,
          // this.state.subproject_id,
          this.state.project_name,
          // this.state.subproject_name,
          this.state.paymethod_name,
          this.state.catVal,
          this.state.amount,
          this.state.event,
          this.state.memo,
          this.state.localUri,
          userAcc.cust_code,
          this.state.extraData_id,
          // this.state.subproject_name
          // JSON.stringify(this.state.catValue)
          this.state.catName
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
          this.props.navigation.push("CashFlow");
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
              Keyboard.dismiss();
              this.setState({
                visible: false,
                project_id: "",
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
              this._refreshHandler()
              // this.props.navigation.push("Home");
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

  payAmount = () => {
    let userAcc = this.context.userData;
    const str = this.state.inputDate;
    const newDate = moment(str).format("ddd-MMM-DD-YYYY");
    let data = {
      newDate: newDate,
      project_id: this.state.project_id,
      project_name: this.state.project_name,
      paymethod_name: this.state.paymethod_name,
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
        type: 'income'
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

  onPickerProjectValueChange(value) {
    this.setState({
      selectedSubProject: value,
    });
  }

  onPaymethodPickerValueChange(value) {
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
      isProjectVisible,
      startDate,
      paymethod_name,
      subproject_name,
      project_name,
      isSubProjectVisible,
      isPayMethodVisible,
      loggedInUser,
      catContent,
      payMethod,
      subprojects,
      projects,
      networkAvailable,
      serverError,
      workingDate,
      visible,
      subcatName,
      // isSubCatVisible,
      subcatContent
    } = this.state;
    // console.log('..........income.........this.props.subprojects.......',this.props.subprojects);
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

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* <Header
            // title={"Income"}
            title={`${this.context.userData.name}`}
            search={false}
            walletAmount={`${this.state.walletAmount}`}
            date={`${moment(this.state.workingDate).format('Do MMM yy ')}`}
            drowerIcon={true}
            onPress_drowerIcon={this.selectdrowerIcon}
          /> */}
          {visible ?
            <Loader />
            :
            <>
              <View contentContainerStyle={{ flex: 1 }}>
                <View style={{ marginHorizontal: 15 }}>

                  <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.show ? styles.activeBottom : styles.inactiveBottom]}>
                    {/* <AntDesign name="calendar" size={20} color="black" /> */}
                    <Text>Date :</Text>
                    <TouchableOpacity
                      onPress={this.showDatePicker}
                      style={[styles.inputStyle, { width: '100%', justifyContent: 'center' }]}
                      activeOpacity={0.7}
                    >
                      {/* <Text style={{ fontSize: 14, color: '#656565' }}>{moment(inputDate).format("ddd MMM DD YYYY ")}</Text> */}
                      <Text style={{ fontSize: 14, color: '#656565' }}> {moment(inputDate).format("DD/MM/YY")}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isPayMethodVisible ? styles.activeBottom : styles.inactiveBottom]}>
                   
                    <Text>Payment :</Text>
                    <TouchableWithoutFeedback
                      onPress={this.togglePayMethodVisible}
                    >
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
                  {/* {this.state.Order_CashFlow == true ?
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
                     
                      <Text>Project :</Text>
                      <TouchableWithoutFeedback >
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
                    </View>
                    :
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
                     
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
                    </View>
                  } */}
                  {/* {this.state.Order_CashFlow == true ?
                    <View style={[{ flexDirection: 'row', alignItems: 'center' }, this.state.isSubProjectVisible ? styles.activeBottom : styles.inactiveBottom]}>
                 
                      <Text>Sub Project :</Text>
                      <TouchableWithoutFeedback >
                        <View style={{ flex: 1, minHeight: 40, }}>
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
                      <TouchableWithoutFeedback onPress={this.toggleSubProjectVisible}>
                        <View style={{ flex: 1, minHeight: 40, }}>
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
                    {/* <MaterialIcons name="category" size={20} color="black" /> */}
                    <Text>Category :</Text>
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
                      {/* <MaterialCommunityIcons name="currency-inr" size={20} color="black" /> */}
                      <Text>Amount :</Text>
                      <TextInput
                        placeholder="Amount"
                        ref={(ref) => (this.amountRef = ref)}
                        style={styles.inputStyle}
                        keyboardType={"number-pad"}
                        onChangeText={this.amountSet}
                        onBlur={this.amountFocusHandler}
                        value={amount}
                      />
                    </View>
                    {/* <View style={[{ flexDirection: 'row', alignItems: 'center',height:40 }, this.state.amountFocused ? styles.activeBottom : styles.inactiveBottom]}>
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
                    </View> */}
                  </View>

                  {subproject_name == "Events" ? (
                    <View>
                      {/* <MaterialIcons name="event-note" size={20} color="black" /> */}
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
                    {/* <Foundation name="clipboard-pencil" size={20} color="black" /> */}
                    <Text>Memo :</Text>
                    <TextInput
                      placeholder="Memo"
                      ref={(ref) => (this.memoRef = ref)}
                      style={styles.inputStyle}
                      keyboardType={"default"}
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
                    success
                    block
                    style={{
                      backgroundColor: Colors.primary,
                      height: 40,
                      paddingTop: 4,
                      paddingBottom: 4,
                      width: 150,
                    }}
                    onPress={this.addIncomeHandler}
                  >
                    <Text style={{ color: "#fff", alignSelf: 'center', marginTop: 5 }}> Save </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
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
                  </TouchableOpacity>
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
                    // categoryData={ projects}
                    onCatPress={this.projectPressed}
                    heading={"Choose Project"}
                    userType={loggedInUser}
                    navigation={this.props.navigation}
                    // permission={"Yes"}
                    project={true}
                    screen={"AddPaymentOption"}
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
                
            <Modal
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
            </Modal>
            </>
          }
        </View>
      </SafeAreaView>
    )
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

const windowwidth = Dimensions.get("window").width;
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
    color: '#656565',
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
  boxStyle: {
    fontSize: 14,
    color: "#656565",
    marginLeft: 10,
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
})
