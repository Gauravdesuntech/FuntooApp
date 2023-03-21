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
} from "react-native";
import {
  Container,
  Button,
  Icon,
  Text,
  Content,
  Item,
  Input,
  Picker,
  Toast,
} from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import Category from "../category/index";
import Project from "../project/index";
import MainHeader from "../component/MainHeader";
import NetInfo from "@react-native-community/netinfo";
import ServerErrorComponent from "../component/Error/serverError";
import NetworkErrorComponent from "../component/Error/networkError";
import { theme } from "../core/theme";
import * as ImagePicker from "expo-image-picker";
import AuthService from "../../app/Service/Auth";

export default class AddExpense extends React.Component {
  constructor(props) {
    //  console.log("Props expense---------->", props.loggedInUser)
    super(props);

    this.state = {
      isModalVisible: false,
      selected2: "Cash",
      catName: null,
      localUri: null,
      inputDate: new Date().toDateString(),
      mode: "date",
      show: false,
      catContent: [],
      amount: null,
      memo: null,
      event: null,
      visible: false,
      startDate: new Date(),
      isUserModalVisible: false,
      userName: null,
      userID: null,
      isCatVisible: true,
      minDateValue: new Date(),
      projects: [],
      project_name: "",
      project_id: props.navigation.getParam("account").project_id,
      subprojects: [],
      subproject_name: props.navigation.getParam("account").project_name,
      subproject_id: props.navigation.getParam("account").project_id,
      payMethod: [],
      paymethod_name: "Cash",
      paymethod_id: "",
      selectedSubProject: undefined,
      selectedItem: undefined,
      vendorList: null,
      vendorId: "",
      vendorName: "",
      selectedVendor: null,
      isVendorVisible: false,
      loggedInUser: props.navigation.getParam("account"),
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.getminDate();
    this.focusListener = navigation.addListener("didFocus", () => {
      this.updateAccount();
      this.getCategory();
      this.getPayMethod();
      this.getProjectDetails();
      this.getSubProjectDetails();
    });
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.setState({
          networkAvailable: true,
        });
      } else {
        this.setState({
          networkAvailable: false,
        });
        Toast.show({
          text: "Back Online",
          textStyle: { fontSize: 14 },
          duration: 2000,
          position: "bottom",
          type: "danger",
        });
      }
    });
    this.workingDateHandler();
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
    let userAcc = await AuthService.getAccount();
    let acdata = await AuthService.retriveAccount(
      userAcc.user_code,
      userAcc.id
    );
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
  getSubProjectDetails = async () => {
    let userAcc = await AuthService.getAccount();
    let subprojects = await AuthService.getSubProject(userAcc.user_code);
    this.setState({ subprojects: subprojects });
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
    this.setState({ minDateValue: prevDate });
  }

  getBalanceAcc = async (user) => {
    // console.log("User----->", user.account.user_type)
    let acdata = await AuthService.fetchDetailsAccounts(
      user.account.user_type,
      user.account.user_code
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
    this.getSubProjectDetails();
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

  filterResultsByType = (type) => {
    if (
      typeof this.state.catContent !== "undefined" &&
      this.state.catContent != null
    ) {
      return this.state.catContent.filter((results) => {
        return results.category_type == type;
      });
    } else {
      return null;
    }
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

  projectPressed = (item) => {
    this.setState({
      project_name: item.val,
      project_id: item.id,
      isProjectVisible: !this.state.isProjectVisible,
    });
    // setTimeout(() => {
    //   this.amountRef._root.focus();
    // }, 100);
  };
  subprojectPressed = (item) => {
    this.setState({
      subproject_name: item.val,
      subproject_id: item.id,
      project_id: item.id,
      isSubProjectVisible: !this.state.isSubProjectVisible,
      isVendorVisible: false,
      isPayMethodVisible: false,
      isCatVisible: false,
    });
    // setTimeout(() => {
    //   this.amountRef._root.focus();
    // }, 100);
  };
  payMethodPressed = (item) => {
    this.setState({
      paymethod_name: item.val,
      paymethod_id: item.id,
      isPayMethodVisible: !this.state.isPayMethodVisible,
    });
    // setTimeout(() => {
    //   this.amountRef._root.focus();
    // }, 100);
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
  catPressed = (item) => {
    //console.log(item)
    this.setState({
      catName: item.val,
      catVal: item.id,
      isCatVisible: !this.state.isCatVisible,
    });
    this.getVendors(item.id);
    // setTimeout(() => {
    //   this.amountRef._root.focus();
    // }, 100);
  };

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
      isVendorVisible: false,
      isPayMethodVisible: false,
    });
    //alert("Key Board Pops")
  }

  _keyboardDidHide() {
    //console.log("Keyboard hidee");
  }
  //Toggle Section
  toggleProjectVisible = () => {
    this.setState({
      isProjectVisible: !this.state.isProjectVisible,
      isCatVisible: false,
    });
  };
  toggleSubProjectVisible = () => {
    this.setState({
      isSubProjectVisible: !this.state.isSubProjectVisible,
      isCatVisible: false,
      isProjectVisible: false,
      isVendorVisible: false,
      isPayMethodVisible: false,
    });
    Keyboard.dismiss();
  };
  toggleVendorVisible = () => {
    this.setState({
      isVendorVisible: !this.state.isVendorVisible,
      isCatVisible: false,
      isSubProjectVisible: false,
      isPayMethodVisible: false,
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
      isVendorVisible: false,
      isPayMethodVisible: false,
    });
    Keyboard.dismiss();
  };

  getVendors = async (cat_id) => {
    let vendorResult = await AuthService.getVendorList(cat_id);
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

  componentWillUnmount() {}

  addExpenseHandler = async () => {
    this.setState({
      visible: true,
    });
    const str = this.state.inputDate;
    const newDate = str.replace(/ /g, "-");

    // console.log("newDate", typeof(this.state.memo))
    const userAcc = await AuthService.getAccount();
    //console.log("UserAcc", userAcc);
    if (newDate == "" || newDate == null) {
      Toast.show({
        text: "Date is required",
        textStyle: { fontSize: 14 },
        duration: 3000,
        position: "bottom",
        type: "danger",
      });
    } else if (
      this.state.paymethod_name == "" ||
      this.state.paymethod_name == null
    ) {
      Toast.show({
        text: "Paymethod is required",
        textStyle: { fontSize: 14 },
        duration: 3000,
        position: "bottom",
        type: "danger",
      });
    } else if (this.state.catVal == "" || this.state.catVal == null) {
      Toast.show({
        text: "Category is required",
        textStyle: { fontSize: 14 },
        duration: 3000,
        position: "bottom",
        type: "danger",
      });
    } else if (this.state.amount == "" || this.state.amount == null) {
      Toast.show({
        text: "Amount is required",
        textStyle: { fontSize: 14 },
        duration: 3000,
        position: "bottom",
        type: "danger",
      });
    } else {
      if (userAcc != null) {
        let result = await AuthService.expenseAdd(
          newDate,
          this.state.project_id,
          this.state.subproject_name,
          this.state.paymethod_name,
          this.state.vendorId,
          this.state.catVal,
          this.state.amount,
          this.state.event,
          this.state.memo,
          this.state.localUri,
          userAcc.user_code
        );
        //console.log(result)
        if (result == "Failed") {
          //  console.log("Result Expense Manage===========>", result);
          Toast.show({
            text: "We are faceing some server issues",
            textStyle: { fontSize: 14 },
            duration: 3000,
            position: "bottom",
            type: "danger",
          });
          // this.props.navigation.push("TabNavigator");
        } else {
          if (result.status == "2") {
            Toast.show({
              text: "We are faceing some issues",
              textStyle: { fontSize: 14 },
              duration: 3000,
              position: "bottom",
              type: "danger",
            });
          } else if (result.status == "0") {
            Toast.show({
              text: "We are faceing some issues",
              textStyle: { fontSize: 14 },
              duration: 3000,
              position: "bottom",
              type: "danger",
            });
          } else {
            if (result.status == "1") {
              Toast.show({
                text: "Expense added successfully",
                textStyle: { fontSize: 14 },
                duration: 3000,
                position: "bottom",
                type: "success",
              });
              this.setState({
                visible: false,
              });
              this.props.navigation.push("TabNavigator");
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
    this.setState({
      visible: true,
    });
    const str = this.state.inputDate;
    const newDate = str.replace(/ /g, "-");

    // console.log("newDate", typeof(this.state.memo))
    const userAcc = await AuthService.getAccount();
    console.log("UserAcc", userAcc);
    if (newDate == "" || newDate == null) {
      Toast.show({
        text: "Date is required",
        textStyle: { fontSize: 14 },
        duration: 3000,
        position: "bottom",
        type: "danger",
      });
    } else if (
      this.state.paymethod_name == "" ||
      this.state.paymethod_name == null
    ) {
      Toast.show({
        text: "Paymethod is required",
        textStyle: { fontSize: 14 },
        duration: 3000,
        position: "bottom",
        type: "danger",
      });
    } else if (this.state.catVal == "" || this.state.catVal == null) {
      Toast.show({
        text: "Category is required",
        textStyle: { fontSize: 14 },
        duration: 3000,
        position: "bottom",
        type: "danger",
      });
    } else if (this.state.amount == "" || this.state.amount == null) {
      Toast.show({
        text: "Amount is required",
        textStyle: { fontSize: 14 },
        duration: 3000,
        position: "bottom",
        type: "danger",
      });
    } else {
      if (userAcc != null) {
        let result = await AuthService.expenseAdd(
          newDate,
          this.state.project_id,
          this.state.subproject_name,
          this.state.paymethod_name,
          this.state.vendorId,
          this.state.catVal,
          this.state.amount,
          this.state.event,
          this.state.memo,
          this.state.localUri,
          userAcc.user_code
        );
        //console.log(result)
        if (result == "Failed") {
          //  console.log("Result Expense Manage===========>", result);
          Toast.show({
            text: "We are faceing some server issues",
            textStyle: { fontSize: 14 },
            duration: 3000,
            position: "bottom",
            type: "danger",
          });
          // this.props.navigation.push("TabNavigator");
        } else {
          if (result.status == "2") {
            Toast.show({
              text: "We are faceing some issues",
              textStyle: { fontSize: 14 },
              duration: 3000,
              position: "bottom",
              type: "danger",
            });
          } else if (result.status == "0") {
            Toast.show({
              text: "We are faceing some issues",
              textStyle: { fontSize: 14 },
              duration: 3000,
              position: "bottom",
              type: "danger",
            });
          } else {
            if (result.status == "1") {
              Toast.show({
                text: "Expense added successfully",
                textStyle: { fontSize: 14 },
                duration: 3000,
                position: "bottom",
                type: "success",
              });
              Keyboard.dismiss();
              this.setState({
                visible: false,
                project_id: "",
                subproject_name: this.state.loggedInUser.project_name,
                subproject_id: this.state.loggedInUser.project_id,
                paymethod_name: "Cash",
                vendorId: "",
                amount: "",
                event: "",
                memo: "",
                vendorName: "",
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

  getSubProjectList = async (value) => {
    let result = await AuthService.getSubProjectList(value);
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
  render() {
    const {
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
    } = this.state;

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
      let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

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
      <Container style={styles.container}>
        <MainHeader
          style={styles}
          navigation={this.props.navigation}
          account={loggedInUser}
          balanceAcc={balanceAcc}
          workingDate={workingDate}
          setWorkingDate={this.workingDateHandler}
        />
        <Content>
          <View>
            <View style={{ marginHorizontal: 15 }}>
              <Item>
                <Icon active name="calendar" style={styles.iconStyle} />
                <TouchableOpacity
                  onPress={this.showDatepicker}
                  style={[
                    styles.inputStyle,
                    { width: "100%", justifyContent: "center" },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 14, color: "#656565" }}>
                    {inputDate}
                  </Text>
                </TouchableOpacity>
              </Item>
              {/* <Item>
                <Icon active name="ios-list-box" style={style.iconStyle} />
                <TouchableWithoutFeedback onPress={this.toggleProjectVisible}>
                  <View style={{ flex: 1, height: 42 }}>
                    <Input
                      placeholder="Project"
                      style={style.inputStyle}
                      editable={false}
                      // ref={ref => this.cateRef = ref }
                      // onFocus={this.catFocus}
                      defaultValue={project_name != null ? project_name : null}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </Item> */}

              <Item>
                <Icon
                  active
                  name="payment"
                  type="MaterialIcons"
                  style={styles.iconStyle}
                />
                <TouchableWithoutFeedback onPress={this.togglePayMethodVisible}>
                  <View style={{ flex: 1, height: 40 }}>
                    <Input
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
              </Item>
              <Item>
                <Icon
                  active
                  name="project"
                  type="Octicons"
                  style={styles.iconStyle}
                />
                <TouchableWithoutFeedback
                  onPress={this.toggleSubProjectVisible}
                >
                  <View style={{ flex: 1, height: 40 }}>
                    <Input
                      placeholder="Sub Project"
                      style={styles.inputStyle}
                      editable={false}
                      // ref={ref => this.cateRef = ref }
                      // onFocus={this.catFocus}
                      defaultValue={
                        subproject_name != null ? subproject_name : null
                      }
                    />
                  </View>
                </TouchableWithoutFeedback>
              </Item>
              <Item>
                <Icon
                  active
                  name="category"
                  type="MaterialIcons"
                  style={styles.iconStyle}
                />
                <TouchableWithoutFeedback onPress={this.toggleCatVisible}>
                  <View style={{ flex: 1, height: 40 }}>
                    <Input
                      placeholder="Category"
                      style={styles.inputStyle}
                      editable={false}
                      defaultValue={catName != null ? catName : null}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </Item>

              <Item>
                <Icon
                  active
                  name="currency-inr"
                  style={styles.iconStyle}
                  type={"MaterialCommunityIcons"}
                />
                <Input
                  placeholder="Amount"
                  ref={(ref) => (this.amountRef = ref)}
                  keyboardType={"number-pad"}
                  onChangeText={this.amountSet}
                  style={styles.inputStyle}
                  value={amount}
                  // onSubmitEditing={() => this.eventRef._root.focus()}
                />
              </Item>

              {subproject_name == "Events" ? (
                <Item>
                  <Icon
                    active
                    name="event-note"
                    style={styles.iconStyle}
                    type={"MaterialIcons"}
                  />
                  <Input
                    placeholder="Event"
                    ref={(ref) => (this.eventRef = ref)}
                    keyboardType={"default"}
                    style={styles.inputStyle}
                    onChangeText={this.eventSet}
                    value={event}
                    onSubmitEditing={() => this.memoRef._root.focus()}
                  />
                </Item>
              ) : null}

              <Item>
                <Input
                  placeholder="Memo"
                  ref={(ref) => (this.memoRef = ref)}
                  keyboardType={"default"}
                  style={styles.inputStyle}
                  onChangeText={this.memoSet}
                  value={memo}
                />
                <TouchableOpacity onPress={openImagePickerAsync}>
                  <Icon active style={styles.iconStyle} name="camera" />
                </TouchableOpacity>
              </Item>

              <Item>
                <Icon
                  active
                  name="isv"
                  type="AntDesign"
                  style={styles.iconStyle}
                />
                <TouchableWithoutFeedback onPress={this.toggleVendorVisible}>
                  <View style={{ flex: 1, height: 40 }}>
                    <Input
                      placeholder="Choose Vendor"
                      style={styles.inputStyle}
                      editable={false}
                      defaultValue={vendorName != null ? vendorName : null}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </Item>
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
              <Button
                primary
                block
                onPress={this.addExpenseHandler}
                style={{
                  backgroundColor: "#3a3535",
                  height: 40,
                  paddingTop: 4,
                  paddingBottom: 4,
                  width: 150,
                }}
              >
                <Text style={{ color: "#fff" }}> Save </Text>
              </Button>

              <Button
                primary
                block
                onPress={this.addContinueHandler}
                style={{
                  backgroundColor: "#3a3535",
                  width: 150,
                  height: 40,
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
              >
                <Text style={{ color: "#fff" }}> Continue </Text>
              </Button>
            </View>
          </View>
        </Content>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={startDate}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={this.onChange}
            minimumDate={minDateValue}
            maximumDate={new Date()}
          />
        )}
        {localUri ? (
          <Image source={{ uri: localUri }} style={styles.thumbnail} />
        ) : null}
        {isProjectVisible ? (
          <View style={{ flex: 0.8, backgroundColor: "#fff" }}>
            <Project
              categoryData={this.filterProjectsByType("1")}
              onCatPress={this.projectPressed}
              heading={"Choose Project"}
              userType={loggedInUser}
              navigation={this.props.navigation}
              permission={"No"}
              screen={"AddPaymentOption"}
            />
          </View>
        ) : null}
        {isSubProjectVisible ? (
          <View style={{ flex: 0.8, backgroundColor: "#fff" }}>
            <Project
              categoryData={this.filterSubProjectsByType("1")}
              onCatPress={this.subprojectPressed}
              heading={"Choose Sub Project"}
              userType={loggedInUser}
              navigation={this.props.navigation}
              permission={"Yes"}
              screen={"AddProjects"}
            />
          </View>
        ) : null}
        {isPayMethodVisible ? (
          <View style={{ flex: 0.8, backgroundColor: "#fff" }}>
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
        {isVendorVisible ? (
          <View style={{ flex: 0.8, backgroundColor: "#fff" }}>
            <Project
              categoryData={this.filterVendorByType("1")}
              onCatPress={this.vendorPressed}
              heading={"Choose Vendor"}
              userType={loggedInUser}
              navigation={this.props.navigation}
              permission={"Yes"}
              screen={"AddVendor"}
            />
          </View>
        ) : null}
        {isCatVisible ? (
          <View style={{ flex: 0.8, backgroundColor: "#fff" }}>
            <Category
              // categoryData={this.filterResultsByType("4")}
              onCatPress={this.catPressed}
              heading={"Choose Category"}
              userType={loggedInUser}
              navigation={this.props.navigation}
              permission={"Yes"}
              screen={"AddCategory"}
            />
          </View>
        ) : null}
      </Container>
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
    color: "#656565",
  },
  mainHeader: {
    backgroundColor: theme.colors.primary,
  },
  headerButton: {
    flexDirection: "row",
    flex: 1,
  },
  whiteColor: {
    color: theme.colors.secondary,
  },
});
