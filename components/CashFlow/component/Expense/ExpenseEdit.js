import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Alert,
  Keyboard
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
import * as ImagePicker from "expo-image-picker";
import AuthService from "../../app/Service/Auth";

export default class ExpenseEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCatVisible: false,
      selected2: "Cash",
      expense_id: props.expense_id,
      transaction_id: props.transaction_id,
      catName: props.categoryName,
      catVal: props.catVal,
      localUri: props.imageUri,
      inputDate: props.date,
      mode: "date",
      show: false,
      catContent: props.catData,
      amount: props.amountValue,
      memo: props.memoValue,
      event: props.eventValue,
      visible: false,
      startDate: props.datePickerStartDate,
      isUserModalVisible: false,
      userName: null,
      userID: null,
      style: props.style,
      minDateValue: props.minDate,
      saveBtnVisibility: false,
      editBtnVisibility: true,
      deleteBtnVisibility: true,
      editable: false,
      projects: props.projects,
      project_name: props.project_name,
      project_id: "",
      subprojects: props.subprojects,
      subproject_name: props.sub_project_name,
      subproject_id: "",
      payMethod: props.payMethod,
      paymethod_name: props.pay_method_name,
      paymethod_id: "",
      vendorList: null,
      selectedVendor: props.vendor_id,
      vendorName: props.vendor_name,
      loggedinUser: props.loggedinUser
    };
  }

  async componentDidMount() {
    await this.getVendors(this.state.catVal)
    // this.getSubProjectList(this.state.project_id);
  }

  UNSAFE_componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  UNSAFE_componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidHide () {
    console.log('Keyboard hidee');
  } 
  
  _keyboardDidShow () {
    //console.log("Keyboard Showed")
   // console.log("Keyboard Dismiss---------->",Keyboard.dismiss)
     this.setState({
      isSubProjectVisible: false,
      isCatVisible: false,
      isProjectVisible: false,
      isVendorVisible: false,
      isPayMethodVisible: false,
     })
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
  toggleVendorVisible = () => {
    this.setState({
      isVendorVisible: !this.state.isVendorVisible,
      isCatVisible: false,
      isSubProjectVisible: false,
      isPayMethodVisible: false,
    });
    Keyboard.dismiss();
  };
  onValueChange2 = (value: string) => {
    this.setState({
      selected2: value,
    });
  };
  //Option Pressed Section

  projectPressed = (item) => {
    this.setState({
      project_name: item.val,
      project_id: item.id,
      isProjectVisible: !this.state.isProjectVisible,
    });
  };
  subprojectPressed = (item) => {
    this.setState({
      project_id: item.id,
      subproject_name: item.val,
      subproject_id: item.id,
      isSubProjectVisible: !this.state.isSubProjectVisible,
    });
  };
  payMethodPressed = (item) => {
    this.setState({
      paymethod_name: item.val,
      paymethod_id: item.id,
      isPayMethodVisible: !this.state.isPayMethodVisible,
    });
  };
  vendorPressed = (item) => {
    this.setState({
      vendorName: item.val,
      vendorId: item.id,
      isVendorVisible: !this.state.isVendorVisible,
    });
  };
  catPressed = (item) => {
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
  getVendors = async (cat_id) => {
    let vendorResult = await AuthService.getVendorList(cat_id);
    this.setState({ vendorList: vendorResult });
  };
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
  //Filter By Type
  filterProjectsByType = (type) => {
    return this.state.projects.filter((results) => {
      return results.category_type == type;
    });
  };
  filterSubProjectsByType = (type) => {
    return this.state.subprojects.filter((results) => {
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

  componentWillUnmount() {}

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
    let result = await AuthService.removeExpense(transaction_id);
    if (result.status == "1") {
      Toast.show({
        text: "Transaction deleted successfully",
        textStyle: { fontSize: 14 },
        duration: 1000,
        position: "bottom",
        type: "success",
      });
      navigation.navigate("TabNavigator");
    } else {
      Toast.show({
        text: "Failed to delete transaction",
        textStyle: { fontSize: 14 },
        duration: 1000,
        position: "bottom",
        type: "danger",
      });
      navigation.navigate("TabNavigator");
    }
  };

  addExpenseHandler = async () => {
    this.setState({
      visible: true,
    });

    const str = this.state.inputDate;
    const newDate = str.replace(/ /g, "-");

    const userAcc = await AuthService.getAccount();
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
        
        let result = await AuthService.expenseUpdate(
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
          this.state.imgName,
          this.state.expense_id,
          userAcc.user_code
        );
        // console.log("Expense Update Handler Result------->", result);
        if (result == "Failed") {
          Toast.show({
            text: "We are faceing some server issues",
            textStyle: { fontSize: 14 },
            duration: 3000,
            position: "bottom",
            type: "danger",
          });
          this.props.navigation.push("TabNavigator");
          this.setState({
            visible: false,
          });
        } else {
          if (result.status == "2") {
            Toast.show({
              text: "We are faceing some issues",
              textStyle: { fontSize: 14 },
              duration: 3000,
              position: "bottom",
              type: "danger",
            });
            this.setState({
              visible: false,
            });
          } else if (result.status == "0") {
            Toast.show({
              text: "We are faceing some issues",
              textStyle: { fontSize: 14 },
              duration: 3000,
              position: "bottom",
              type: "danger",
            });
            this.setState({
              visible: false,
            });
          } else {
            if (result.status == "1") {
              Toast.show({
                text: "Expense updated successfully",
                textStyle: { fontSize: 14 },
                duration: 3000,
                position: "bottom",
                type: "success",
              });
              this.props.navigation.push("TabNavigator");
              this.setState({
                visible: false,
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

  onValueChange(value: string) {
    this.setState({
      project_id: value,
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

  onPickerProjectValueChange(value: string) {
    this.setState({
      selectedSubProject: value,
    });
  }

  onPickerVendorValueChange(value: string) {
    this.setState({
      selectedVendor: value,
    });
  }
  onPickerPayMethodValueChange(value: string) {
    this.setState({
      selectedPayMethod: value,
    });
  }
  render() {
    const {
      isCatVisible,
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
      editable,
      saveBtnVisibility,
      editBtnVisibility,
      deleteBtnVisibility,
      subproject_name,
      paymethod_name,
      isSubProjectVisible,
      isPayMethodVisible,
      isProjectVisible,
      vendorName,
      isVendorVisible,
      loggedinUser,
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
              <TouchableOpacity
                style={{
                  flex: 1,
                }}
                onPress={this.showDatepicker}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Icon
                    active
                    name="calendar"
                    style={[style.iconStyle, { alignSelf: "center" }]}
                  />
                  <Input
                    placeholder="Date"
                    style={style.inputStyle}
                    value={inputDate}
                    onTouchStart={this.showDatepicker}
                    editable={false}
                  />
                </View>
              </TouchableOpacity>
            </Item>
          
            <Item>
              <Icon active name="payment" type="MaterialIcons" style={style.iconStyle} />
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
              <Icon active name="project" type="Octicons" style={style.iconStyle} />
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
              <Icon active name="category" type="MaterialIcons" style={style.iconStyle} />
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
              <Icon
                active
                name="currency-inr"
                style={style.iconStyle}
                type={"MaterialCommunityIcons"}
              />
              <Input
                placeholder="Amount"
                ref={(ref) => (this.amountRef = ref)}
                keyboardType={"number-pad"}
                onChangeText={this.amountSet}
                style={style.inputStyle}
                value={amount}
                editable={editable}
               // onSubmitEditing={() => this.eventRef._root.focus()}
              />
            </Item>
            {subproject_name == 'Events' ? 
            
            <Item>
              <Icon
                active
                name="event-note"
                style={style.iconStyle}
                type={"MaterialIcons"}
              />
              <Input
                placeholder="Event"
                ref={(ref) => (this.eventRef = ref)}
                keyboardType={"default"}
                style={style.inputStyle}
                onChangeText={this.eventSet}
                value={event == "null" ? "" : event}
                onSubmitEditing={() => this.memoRef._root.focus()}
                editable={editable}
              />
            </Item>
            : null}
            <Item>
              <Input
                placeholder="Memo"
                ref={(ref) => (this.memoRef = ref)}
                keyboardType={"default"}
                style={style.inputStyle}
                onChangeText={this.memoSet}
                value={memo == "null" ? "" : memo}
                editable={editable}
              />
              <TouchableOpacity onPress={openImagePickerAsync}>
                <Icon active name="camera" style={style.iconStyle} />
              </TouchableOpacity>
            </Item>
            <Item>
              <Icon active name="isv" type="AntDesign" style={style.iconStyle} />
              <TouchableWithoutFeedback onPress={this.toggleVendorVisible}>
                <View style={{ flex: 1, height: 40 }}>
                  <Input
                    placeholder="Choose Vendor"
                    style={style.inputStyle}
                    editable={false}
                    defaultValue={vendorName != null ? vendorName : null}
                  />
                </View>
              </TouchableWithoutFeedback>
            </Item>
          </View>
          {saveBtnVisibility ? (
            <View
              style={{ marginHorizontal: 25, marginTop: 10, marginBottom: 10 }}
            >
              <Button
                primary
                block
                style={{
                  backgroundColor: "#00B386",
                  height: 40,
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
                onPress={this.addExpenseHandler}
              >
                <Text style={{ color: "#fff" }}> Save </Text>
              </Button>
            </View>
          ) : null}

          <View
            style={{
              marginTop: 10,
              marginBottom: 10,
              flex: 1,
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
                <Button
                  block
                  onPress={this.deleteHandler}
                  style={{
                    backgroundColor: "#F32013",
                  }}
                >
                  <Text style={{ color: "#fff" }}> Delete </Text>
                </Button>
              </View>
            ) : null}

            {editBtnVisibility ? (
              <View
                style={{
                  width: "40%",
                }}
              >
                <Button
                  primary
                  block
                  onPress={this.editHandler}
                  style={{
                    backgroundColor: "#00B386",
                  }}
                >
                  <Text style={{ color: "#fff" }}> eeeeeee </Text>
                </Button>
              </View>
            ) : null}
          </View>
        </Content>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={new Date()}
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
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Project
              categoryData={this.filterProjectsByType("1")}
              onCatPress={this.projectPressed}
              heading={"Choose Project"}
              userType={loggedinUser}
              navigation={this.props.navigation}
              permission={"No"}
              screen={'AddPaymentOption'}
            />
          </View>
        ) : null}
        {isSubProjectVisible ? (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Project
              categoryData={this.filterSubProjectsByType("1")}
              onCatPress={this.subprojectPressed}
              heading={"Choose Sub Project"}
              userType={loggedinUser}
              navigation={this.props.navigation}
              permission={"Yes"}
              screen={'AddProjects'}
            />
          </View>
        ) : null}
        {isPayMethodVisible ? (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Project
              categoryData={this.filterPayMethodByType("1")}
              onCatPress={this.payMethodPressed}
              heading={"Choose Pay Method"}
              userType={loggedinUser}
              navigation={this.props.navigation}
              permission={"Yes"}
              screen={'AddPaymentOption'}
            />
          </View>
        ) : null}
        {isCatVisible ? (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Category
              // categoryData={this.filterResultsByType("4")}
              onCatPress={this.catPressed}
              heading={"Choose Category"}
              userType={loggedinUser}
              navigation={this.props.navigation}
              permission={"Yes"}
            />
          </View>
        ) : null}
        {isVendorVisible ? (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <Project
              categoryData={this.filterVendorByType("1")}
              onCatPress={this.vendorPressed}
              heading={"Choose Vendor"}
              userType={loggedinUser}
              navigation={this.props.navigation}
              permission={"Yes"}
              screen={'AddVendor'}
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
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 5,
  },
  iconStyle: {
    fontSize: 15,
  },
});
