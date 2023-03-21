import React from "react";
import {
  StyleSheet,
  View,
  Modal,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
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
  Toast,
} from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import Category from "../category/index";
import Project from "../project/index";
import UserList from "../UserList";
import * as ImagePicker from "expo-image-picker";
import AuthService from "../../app/Service/Auth";

export default class Transfer extends React.Component {
  constructor(props) {
    super(props);
    //console.log("Transfer Props-------->", props.loggedInUser)
    this.state = {
      isModalVisible: false,
      selected2: "",
      catName: null,
      localUri: null,
      inputDate: new Date().toDateString(),
      mode: "date",
      show: false,
      catContent: [],
      amount: null,
      memo: null,
      visible: false,
      startDate: new Date(),
      userList: props.navigation.getParam("userList", null),
      isUserModalVisible: false,
      userName: null,
      userID: null,
      isCatVisible: true,
      minDateValue: new Date(),
      projects: [],
      project_name: "",
      project_id:  props.navigation.getParam("account").project_id,
      subprojects: [],
      subproject_name: props.navigation.getParam("account").project_name,
      subproject_id: props.navigation.getParam("account").project_id,
      selectedItem: undefined,
      selectedSubProject: undefined,
      payMethod: [],
      paymethod_name: "Cash",
      paymethod_id: "",
      loggedInUser: props.navigation.getParam("account"),
      workingDate: new Date(),
      serverError: false,
      networkAvailable: true,
    };
  }

  async componentDidMount() {
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
    this.focusListener.remove();
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

  toggleUserModal = () => {
    //console.log('isModalVisible', this.state.isModalVisible)
    this.setState({ isUserModalVisible: !this.state.isUserModalVisible });
  };

  onValueChange2 = (value) => {
    //console.log("value ", value);
    this.setState({
      selected2: value,
    });
    // console.log(this.state.selected2);
  };

  // filterPayMethodByType = (type) => {
  //   return this.state.payMethod.filter((results) => {
  //     return results.category_type == type;
  //   });
  // };

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
    this.setState({
      paymethod_name: item.val,
      paymethod_id: item.id,
      isPayMethodVisible: !this.state.isPayMethodVisible,
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
    setTimeout(() => {
      this.setState({ isUserModalVisible: !this.state.isUserModalVisible });
    }, 100);
  };

  subprojectPressed = (item) => {
    this.setState({
      project_id: item.id,
      subproject_name: item.val,
      subproject_id: item.id,
      isSubProjectVisible: !this.state.isSubProjectVisible,
    });
    // setTimeout(() => {
    //   this.amountRef._root.focus();
    // }, 100);
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
      isPayMethodVisible: false,
      isSubProjectVisible: false,
    });
    Keyboard.dismiss();
  };

  toggleSubProjectVisible = () => {
    this.setState({
      isSubProjectVisible: !this.state.isSubProjectVisible,
      isCatVisible: false,
      isProjectVisible: false,
      isPayMethodVisible: false,
    });
    Keyboard.dismiss();
  };

  userPressed = (item) => {
    // console.log(item)
    this.setState({
      userName: item.full_name,
      userID: item.user_code,
      isUserModalVisible: !this.state.isUserModalVisible,
      isPayMethodVisible: false,
      isSubProjectVisible: false,
      isCatVisible: false,
    });
    Keyboard.dismiss();
    setTimeout(() => {
      this.amountRef._root.focus();
    }, 300);
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

  transferHandler = async () => {
    const str = this.state.inputDate;
    const newDate = str.replace(/ /g, "-");

    // console.log("newDate", typeof(this.state.memo))
    const userAcc = await AuthService.getAccount();
    //  console.log("UserAcc", userAcc);
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
    } else if (this.state.userID == "" || this.state.userID == null) {
      Toast.show({
        text: "You need to select a user",
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
        this.setState({
          visible: true,
        });
        let result = await AuthService.addTransfer(
          newDate,
          this.state.project_id,
          this.state.subproject_name,
          this.state.paymethod_name,
          this.state.catVal,
          this.state.amount,
          this.state.memo,
          this.state.userID,
          userAcc.user_code
        );
        //console.log(result)
        if (result == "Failed") {
          //console.log("Result===========>", result);
          Toast.show({
            text: "We are faceing some server issues",
            textStyle: { fontSize: 14 },
            duration: 3000,
            position: "bottom",
            type: "danger",
          });
          this.setState({
            visible: false,
          });
        } else {
          if (result.status == "2") {
            this.setState({
              visible: false,
            });
            Toast.show({
              text: "We are faceing some issues",
              textStyle: { fontSize: 14 },
              duration: 3000,
              position: "bottom",
              type: "danger",
            });
          } else if (result.status == "0") {
            this.setState({
              visible: false,
            });
            Toast.show({
              text: "We are faceing some issues",
              textStyle: { fontSize: 14 },
              duration: 3000,
              position: "bottom",
              type: "danger",
            });
          } else {
            if (result.status == "1") {
              this.setState({
                visible: false,
              });
              this.props.navigation.push("TabNavigator");
              Toast.show({
                text: "Transfer done successfully",
                textStyle: { fontSize: 14 },
                duration: 3000,
                position: "bottom",
                type: "success",
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
                this.props.navigation.navigate("Login");
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  };

  transferContinueHandler = async () => {
    const str = this.state.inputDate;
    const newDate = str.replace(/ /g, "-");
    Keyboard.dismiss()
    // console.log("newDate", typeof(this.state.memo))
    const userAcc = await AuthService.getAccount();
    //  console.log("UserAcc", userAcc);
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
    } else if (this.state.userID == "" || this.state.userID == null) {
      Toast.show({
        text: "You need to select a user",
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
        this.setState({
          visible: true,
        });
        let result = await AuthService.addTransfer(
          newDate,
          this.state.project_id,
          this.state.subproject_name,
          this.state.paymethod_name,
          this.state.catVal,
          this.state.amount,
          this.state.memo,
          this.state.userID,
          userAcc.user_code
        );
        //console.log(result)
        if (result == "Failed") {
          //console.log("Result===========>", result);
          Toast.show({
            text: "We are faceing some server issues",
            textStyle: { fontSize: 14 },
            duration: 3000,
            position: "bottom",
            type: "danger",
          });
          this.setState({
            visible: false,
          });
        } else {
          if (result.status == "2") {
            this.setState({
              visible: false,
            });
            Toast.show({
              text: "We are faceing some issues",
              textStyle: { fontSize: 14 },
              duration: 3000,
              position: "bottom",
              type: "danger",
            });
          } else if (result.status == "0") {
            this.setState({
              visible: false,
            });
            Toast.show({
              text: "We are faceing some issues",
              textStyle: { fontSize: 14 },
              duration: 3000,
              position: "bottom",
              type: "danger",
            });
          } else {
            if (result.status == "1") {
              
              this.setState({
                visible: false,
                paymethod_name: "Cash",
                catVal: "",
                catName: '',
                amount: "",
                memo: "",
                userID: "",
                userName: '',
                isCatVisible: true
              });

              Toast.show({
                text: "Transfer done successfully",
                textStyle: { fontSize: 14 },
                duration: 3000,
                position: "bottom",
                type: "success",
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
                this.props.navigation.navigate("Login");
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  };

  // console.log("props expense===============>", props)
  render() {
    const {
      style,
      inputDate,
      minDateValue,
      catName,
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
      catContent
    } = this.state;

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
        <Content>
          <View style={{ marginHorizontal: 15 }}>
            <Item>
              <Icon active name="calendar" style={style.iconStyle} />
              <Input
                placeholder="Date"
                style={style.inputStyle}
                value={inputDate}
                onTouchStart={this.showDatepicker}
              />
            </Item>
            <Item>
              <Icon
                active
                name="payment"
                type="MaterialIcons"
                style={style.iconStyle}
              />
              <TouchableWithoutFeedback onPress={this.togglePayMethodVisible}>
                <View style={{ flex: 1, height: 40 }}>
                  <Input
                    placeholder="Select Pay Method"
                    style={style.inputStyle}
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
                style={style.iconStyle}
              />
              <TouchableWithoutFeedback onPress={this.toggleSubProjectVisible}>
                <View style={{ flex: 1, height: 40 }}>
                  <Input
                    placeholder="Sub Project"
                    style={style.inputStyle}
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
                style={style.iconStyle}
              />
              <TouchableWithoutFeedback onPress={this.toggleCatVisible}>
                <View style={{ flex: 1, height: 40 }}>
                  <Input
                    placeholder="Category"
                    style={style.inputStyle}
                    editable={false}
                    defaultValue={catName != null ? catName : null}
                  />
                </View>
              </TouchableWithoutFeedback>
            </Item>
            <Item>
              <Icon active name="ios-person" style={style.iconStyle} />
              <TouchableWithoutFeedback onPress={this.toggleUserModal}>
                <View style={{ flex: 1, height: 40 }}>
                  <Input
                    placeholder="Select User"
                    editable={false}
                    style={style.inputStyle}
                    defaultValue={userName != null ? userName : null}
                  />
                </View>
              </TouchableWithoutFeedback>
            </Item>
            <Item>
              <Icon
                active
                name="currency-inr"
                type={"MaterialCommunityIcons"}
                style={style.iconStyle}
              />
              <Input
                placeholder="Amount"
                ref={(ref) => (this.amountRef = ref)}
                keyboardType={"number-pad"}
                style={style.inputStyle}
                onChangeText={this.amountSet}
                value={amount}
                onSubmitEditing={() => this.memoRef._root.focus()}
              />
            </Item>
            <Item>
              <Input
                placeholder="Memo"
                ref={(ref) => (this.memoRef = ref)}
                keyboardType={"default"}
                style={style.inputStyle}
                onChange={this.memoSet}
                value={memo}
              />
              <TouchableOpacity onPress={openImagePickerAsync}>
                <Icon active name="camera" style={style.iconStyle} />
              </TouchableOpacity>
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
              onPress={this.transferHandler}
              style={{
                backgroundColor: "#323edd",
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
              onPress={this.transferContinueHandler}
              style={{
                backgroundColor: "#323edd",
                width: 150,
                height: 40,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              <Text style={{ color: "#fff" }}> Continue </Text>
            </Button>
          </View>
        </Content>
        {isUserModalVisible ? (
          <Modal isVisible={isUserModalVisible}>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <UserList userData={userList} onUserPress={this.userPressed} />
              <Button
                block
                style={{ backgroundColor: "#00B386" }}
                onPress={this.toggleUserModal}
              >
                <Text style={{ color: "#fff" }}> Close </Text>
              </Button>
            </View>
          </Modal>
        ) : (
          <View></View>
        )}
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
        {isPayMethodVisible ? (
          <View style={{ flex: 0.8, backgroundColor: "#fff" }}>
            <Project
              categoryData={this.filterPayMethodByType("1", payMethod)}
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
          <View style={{ flex: 0.8, backgroundColor: "#fff" }}>
            <Category
              // categoryData={this.filterResultsByType("5", catContent)}
              onCatPress={this.catPressed}
              heading={"Choose Category"}
              // userType={loggedInUser}
              navigation={this.props.navigation}
              permission={"Yes"}
              screen={"AddCategory"}
            />
          </View>
        ) : null}
        {isSubProjectVisible ? (
          <View style={{ flex: 0.8, backgroundColor: "#fff" }}>
            <Category
              // categoryData={this.filterResultsByType("1", subprojects)}
              onCatPress={this.subprojectPressed}
              heading={"Choose Sub Project"}
              userType={loggedInUser}
              navigation={this.props.navigation}
              permission={"Yes"}
              screen={"AddProjects"}
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
});
