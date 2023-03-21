import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Dimensions,
  LogBox,
} from "react-native";
import Header from "../components/Header";
import Colors from "../config/colors";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AwesomeAlert from "react-native-awesome-alerts";
// import Checkbox from "expo-checkbox";
import { Dropdown } from "react-native-element-dropdown";
import DateTimerPicker from "../components/DateTimerPicker";
import moment from "moment";
import { getFileData, getFormattedDate } from "../utils/Util";
import RBSheet from "react-native-raw-bottom-sheet";
import Configs from "../config/Configs";
import Checkbox from "./Checkbox";
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import {
  addDesignation,
  addemployee,
  GetDesignation,
} from "../services/APIServices";
import InputDropdown from "../components/InputDropdown";
import OverlayLoader from "../components/OverlayLoader";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AppContext from "../context/AppContext";


export default class AddEmployee extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    // console.log("..............", this.props.route.params?.data);
    this.state = {
      stateID: this.props.route.params.data == null ? 0 : 1,
      headerTitle:
        this.props.route.params.data == null ? "Add Employee" : "Edit Employee",
      data: this.props.route.params.data,
      employeeName: "",
      dob_time: "",
      Address: "",
      Mobile: "",
      Email: "",
      DesignationList: [],
      profileimageURI: undefined,
      profileimageData: undefined,
      imageURI: undefined,
      imageData: undefined,
      AadhaarfrontimageURI: undefined,
      AadhaarfrontimageData: undefined,
      AadhaarbackimageURI: undefined,
      AadhaarbackimageData: undefined,
      reference: "",
      rel_name: "",
      rel_phone: "",
      all_rel: [],
      designation: "",
      formErrors: {},
      showAlertModal: false,
      alertMessage: "",
      alertType: "",
      selectedActionTypes: [],
      actionTypesValidationFailed: false,
      ModulePermissionsValidationFailed: false,
      OrderPermissionsValidationFailed: false,
      modulePermissions: [],
      orderPermissions: [],
      selectedModulePermissions: [],
      selectedOrderPermissions: [],
      isDesignationsMenuOpen: false,
      designation_id: "",
      overlay_loader: false,
      isDatePickerVisible: false,
    
    };
  }
  // getRoles=()=>{
  //   GetDesignation()
  //   .then((response) => {
  //     this.setState({ DesignationList: response ,
  //     isLoading:false});
  //   })
  //   .catch((error) => {
  //     // console.log(error);
  //   });
  // }
  componentDidMount() {
    // this.getRoles()
    GetDesignation()
      .then((response) => {
        this.setState({ DesignationList: response, isLoading: false });
        if (this.state.stateID == 1) {
          let designation_name = response.filter(
            (item) => item.id == this.state.data.designation_id
          );
          this.setState({
            designation: designation_name[0].name,
          });
        }
      })
      .catch((error) => {
        // console.log(error);
      });

    if (this.state.stateID == 1) {
      let selectedModulePermissions = Configs.HOME_SCREEN_MENUES.filter(
        (element) =>
          (this.state.data.menu_permission || []).includes(element.id)
      );
      let permissionData = this.context.userData.order_details_permission.split(',');
      let selectedOrderPermissions = Configs.MANAGE_ORDER_TABS.filter((element) =>
      (permissionData || []).includes(
        element.id
      )
      );
      this.setState({
        modulePermissions: Configs.HOME_SCREEN_MENUES,
        orderPermissions: Configs.USER_ORDER_DETAILS,
        selectedModulePermissions: selectedModulePermissions,
        selectedOrderPermissions:selectedOrderPermissions,
        selectedActionTypes: this.state.data.action_types,

        employeeName: this.state.data.name,
        dob_time: this.state.data.dob,
        Address: this.state.data.address,
        Mobile: this.state.data.phone,
        Email: this.state.data.email,
        reference: this.state.data.reference,
        all_rel: JSON.parse(this.state.data.relatives),
        profileimageURI: Configs.EMPLOYEE_DOC + this.state.data.photo,
        AadhaarfrontimageURI:
          Configs.EMPLOYEE_DOC + this.state.data.adhaar_photo_front,
        AadhaarbackimageURI:
          Configs.EMPLOYEE_DOC + this.state.data.adhaar_photo_back,
        imageURI: Configs.EMPLOYEE_DOC + this.state.data.id_card,
        designation_id: this.state.data.designation_id,
      });
    } else {
      this.setState({
        modulePermissions: Configs.HOME_SCREEN_MENUES,
        orderPermissions: Configs.USER_ORDER_DETAILS,
      });
    }
  }
  ValidateData() {
    let errors = {};
    var format = /^[1-9]{1}[0-9]{9}$/;
    var Emailformat = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

    if (!this.state.employeeName || this.state.employeeName == "") {
      errors.employeeName = "Name is required";
    }

    // if (!this.state.dob_time || this.state.dob_time == "") {
    //   errors.dob_time = "date of birth is required";
    // }
    // if (!this.state.Address || this.state.Address == "") {
    //   errors.Address = "Address is required";
    // }
    if (!this.state.Mobile) {
      errors.Mobile = "Mobile is required";
    } else if (!this.state.Mobile.match(format)) {
      errors.Mobile = "Enter valid mobile number";
    }
    if (!this.state.Email) {
      errors.Email = "Email is required";
    } else if (!this.state.Email.match(Emailformat)) {
      errors.Email = "Enter valid Email ID";
    }
    // if (!this.state.profileimageURI || this.state.profileimageURI == "") {
    //   errors.profileimageURI = "Profile Image is required";
    // }
    // if (!this.state.imageURI || this.state.imageURI == "") {
    //   errors.imageURI = "ID Card is required";
    // }
    // if (
    //   !this.state.AadhaarfrontimageURI ||
    //   this.state.AadhaarfrontimageURI == ""
    // ) {
    //   errors.AadhaarfrontimageURI = "Aadhaar card is required";
    // }
    // if (
    //   !this.state.AadhaarbackimageURI ||
    //   this.state.AadhaarbackimageURI == ""
    // ) {
    //   errors.AadhaarbackimageURI = "Aadhaar card is required";
    // }
    // if (!this.state.all_rel || this.state.all_rel.length < 2) {
    //   errors.all_rel = "Need Two relative phone number";
    // }
    // if (!this.state.designation || this.state.designation == "") {
    //   errors.designation = "designation is required";
    // }
    if (this.state.selectedActionTypes.length === 0) {
      this.setState({ actionTypesValidationFailed: true });
    }
    if (this.state.selectedModulePermissions.length === 0) {
      this.setState({ ModulePermissionsValidationFailed: true });
    }
    if (this.state.selectedOrderPermissions.length === 0) {
      this.setState({ OrderPermissionsValidationFailed: true });
    }
    this.setState({
      formErrors: {},
    });
    if (Object.keys(errors).length != 0) {
      this.setState({
        formErrors: errors,
      });

      return false;
    }

    return true;
  }

  // onChangeReportingDateChange = (date) => {
  //   if (date) {
  //     this.setState({ dob_time: getFormattedDate(date) });
  //     // // console.log(getFormattedDate(date))
  //   }
  // };
  showDatePicker = () => { 
		this.setState({ isDatePickerVisible: true, });
	  };
	  hideDatePicker = () => {
		this.setState({ isDatePickerVisible: false });
	  };
	handleSetupDateChange = (selectedDate) => {
		// console.log("A date has been picked: ", selectedDate);
		// console.log("A date has been picked: ", getFormattedDate(selectedDate));
		this.setState({ dob_time:getFormattedDate(selectedDate) });
		this.hideDatePicker();
	  };


  chooseprofileimage = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: true,
          // aspect: [1, 1],
          // quality: 1,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              profileimageURI: result.uri,
              profileimageData: getFileData(result),
            });
            this.RBSheetprofile.close();
          }
          // console.log(result.uri);
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  };
  openprofileCamera = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: true,
          // aspect: [1, 1],
          // quality: 1,
        };

        ImagePicker.launchCameraAsync().then((result) => {
          if (!result.cancelled) {
            this.setState({
              profileimageURI: result.uri,
              profileimageData: getFileData(result),
            });
            this.RBSheetprofile.close();
          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  };
  chooseIcon = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: true,
          // aspect: [1, 1],
          // quality: 1,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              imageURI: result.uri,
              imageData: getFileData(result),
            });
            this.RBSheeticon.close();
          }
          // console.log(result.uri);
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  };
  openCameraIcon = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: true,
          // aspect: [1, 1],
          // quality: 1,
        };

        ImagePicker.launchCameraAsync().then((result) => {
          if (!result.cancelled) {
            this.setState({
              imageURI: result.uri,
              imageData: getFileData(result),
            });
            this.RBSheeticon.close();
          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  };
  chooseAadhaarFront = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: true,
          // aspect: [1, 1],
          // quality: 1,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              AadhaarfrontimageURI: result.uri,
              AadhaarfrontimageData: getFileData(result),
            });
            this.RBSheetfront.close();
          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  };
  openCameraAadhaarFront = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: true,
          // aspect: [1, 1],
          // quality: 1,
        };

        ImagePicker.launchCameraAsync().then((result) => {
          if (!result.cancelled) {
            this.setState({
              AadhaarfrontimageURI: result.uri,
              AadhaarfrontimageData: getFileData(result),
            });
            this.RBSheetfront.close();
          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  };
  openCameraAadhaarBack = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: true,
          // aspect: [1, 1],
          // quality: 1,
        };

        ImagePicker.launchCameraAsync().then((result) => {
          if (!result.cancelled) {
            this.setState({
              AadhaarbackimageURI: result.uri,
              AadhaarbackimageData: getFileData(result),
            });
            this.RBSheetback.close();
          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  };
  chooseAadhaarBack = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: true,
          // aspect: [1, 1],
          // quality: 1,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            this.setState({
              AadhaarbackimageURI: result.uri,
              AadhaarbackimageData: getFileData(result),
            });
            this.RBSheetback.close();
          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  };
  addAction = () => {
    if (!this.state.rel_name) {
      this.setState({
        showAlertModal: true,
        alertType: "Error",
        alertMessage: "relation is required",
      });
      return;
    }
    if (!this.state.rel_phone) {
      this.setState({
        showAlertModal: true,
        alertType: "Error",
        alertMessage: "relative phone is required",
      });
      return;
    }
    var format = /^[1-9]{1}[0-9]{9}$/;
    if (!this.state.rel_phone.match(format)) {
      this.setState({
        showAlertModal: true,
        alertType: "Error",
        alertMessage: "Enter valid mobile number",
      });
      return;
    }
    let obj = {
      name: this.state.rel_name,
      phone: this.state.rel_phone,
    };
    this.state.all_rel.push(obj);
    // // console.log("obj", obj);
    // // console.log("this.state.all_rel", this.state.all_rel);
    this.setState({
      all_rel: this.state.all_rel,
      rel_name: "",
      rel_phone: "",
    });
  };

  hideAlert = () => {
    this.setState({
      showAlertModal: false,
    });
  };

  setActionType = (type) => {
    let { selectedActionTypes } = this.state;

    if (selectedActionTypes.includes(type)) {
      selectedActionTypes = selectedActionTypes.filter(
        (element) => element !== type
      );
    } else {
      selectedActionTypes.push(type);
    }

    this.setState({ selectedActionTypes });
    // // console.log(selectedActionTypes.join(","));
  };

  setSelectedModulePermissions = (item) => {
    this.setState({ selectedModulePermissions: item });
    // // console.log(this.state.selectedModulePermissions);
  };
  setSelectedOrderPermissions = (item) => {
    this.setState({ selectedOrderPermissions: item });
    // // console.log(this.state.selectedOrderPermissions);
  };
  toggleDesignationsMenu = () =>
    this.setState({
      isDesignationsMenuOpen: !this.state.isDesignationsMenuOpen,
    });

  setDesignationsData = (data) => {
    let selectedModulePermissions = Configs.HOME_SCREEN_MENUES.filter((element) =>
        (data.menu_permission || []).includes(element.id)
      );
      // let permissionData = this.context.userData.order_details_permission.split(',');
      let selectedOrderPermissions =Configs.MANAGE_ORDER_TABS.filter((element) =>
      (data.order_details_permission || []).includes(
        element.id
      )
      );
    // // console.log("setDesignationsData.............",data)
    console.log("selectedOrderPermissions.............",selectedOrderPermissions)
    this.setState({
      designation: data.name,
      designation_id: data.id,
      isDesignationsMenuOpen: false,
      selectedModulePermissions : selectedModulePermissions,
      selectedActionTypes :data.action_types,
      selectedOrderPermissions : selectedOrderPermissions,
    });
  };

  ControlSubmit = () => {
    if (this.ValidateData()) {
      this.setState({
        overlay_loader: true,
      });
      // console.log("submit.............................");
      let userModulePermissions = this.state.selectedModulePermissions.map(
        (v, i) => v.id
      );
      let userOrderPermissions = this.state.selectedOrderPermissions.map(
        (v, i) => v.id
      );
      if (this.state.stateID == 0) {
        var obj = {
          id: 0,
          name: this.state.employeeName,
          dob: this.state.dob_time,
          address: this.state.Address,
          mobile: this.state.Mobile,
          email: this.state.Email,
          reference: this.state.reference,
          relatives: JSON.stringify(this.state.all_rel),
          action_types: this.state.selectedActionTypes.join(","),
          menu_permission: userModulePermissions.join(","),
          order_permission: userOrderPermissions.join(","),
          photo: this.state.profileimageData,
          adhaar_photo_front: this.state.AadhaarfrontimageData,
          adhaar_photo_back: this.state.AadhaarbackimageData,
          id_card: this.state.imageData,
          designation_id: this.state.designation_id,
        };
      } else {
        var obj = {
          id: this.state.data.id,
          name: this.state.employeeName,
          dob: this.state.dob_time,
          address: this.state.Address,
          mobile: this.state.Mobile,
          email: this.state.Email,
          reference: this.state.reference,
          relatives: JSON.stringify(this.state.all_rel),
          action_types: this.state.selectedActionTypes.join(","),
          menu_permission: userModulePermissions.join(","),
          order_permission: userOrderPermissions.join(","),
          // photo:this.state.profileimageData,
          // adhaar_photo_front:this.state.AadhaarfrontimageData,
          // adhaar_photo_back:this.state.AadhaarbackimageData,
          // id_card:this.state.imageData,
          designation_id: this.state.designation_id,
        };

        if (
          this.state.profileimageData != "" &&
          this.state.profileimageData != undefined
        ) {
          obj.photo = this.state.profileimageData;
        }
        if (
          this.state.AadhaarfrontimageData != "" &&
          this.state.AadhaarfrontimageData != undefined
        ) {
          obj.adhaar_photo_front = this.state.AadhaarfrontimageData;
        }
        if (
          this.state.AadhaarbackimageData != "" &&
          this.state.AadhaarbackimageData != undefined
        ) {
          obj.adhaar_photo_back = this.state.AadhaarbackimageData;
        }
        if (this.state.imageData != "" && this.state.imageData != undefined) {
          obj.id_card = this.state.imageData;
        }
      }
      console.log("add & edit employee..................",obj)

      addemployee(obj)
        .then((response) => {
          // console.log(".................response................", response);
          this.setState({
            overlay_loader: false,
          });
          this.props.navigation.navigate("Employee");
        })
        .catch((error) => {
          // console.log(error);
          this.setState({
            overlay_loader: false,
          });
        });
    }
  };

  render() {
    return (
      <SafeAreaView>
        <Header title={this.state.headerTitle} />
        {this.state.overlay_loader ? (
          <OverlayLoader />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={styles.container}
          >
            <View>
              <Text style={styles.inputLable}>Employee Name:</Text>
              <TextInput
                value={this.state.employeeName}
                autoCompleteType="off"
                autoCapitalize="words"
                style={[styles.textInput]}
                onChangeText={(employeeName) =>
                  this.setState({ employeeName: employeeName })
                }
              />
              <View>
                {this.state.formErrors.employeeName && (
                  <Text style={{ color: "red" }}>
                    {this.state.formErrors.employeeName}
                  </Text>
                )}
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                  alignItems: "center",
                }}
              >
                <View
                  style={[{ borderTopLeftRadius: 5, alignItems: "center" }]}
                >
                  <Text style={styles.inputLable}>DOB:</Text>
                </View>
                <View style={{ marginHorizontal: 5 }}>
                  {/* <DateTimerPicker
                    pickerMode={"date"}
                    dateTime={this.state.dob_time}
                    onChange={this.onChangeReportingDateChange}
                  /> */}
				<TouchableOpacity onPress={this.showDatePicker}>
					{this.state.dob_time != "" ?
					<Text style={[styles.inputLable,{fontSize:14}]}>{this.state.dob_time}</Text>
					:
					<Text style={[styles.inputLable,{fontSize:14}]}>{"DD/MM/YYYY"}</Text>
		}
    </TouchableOpacity>
    <DateTimePickerModal
                  mode={this.state.mode}
                  onConfirm={this.handleSetupDateChange}
                  onCancel={this.hideDatePicker}
                  display={Platform.OS == "ios" ? "inline" : "default"}
                  isVisible={this.state.isDatePickerVisible}
                />
                </View>
              </View>
              <View>
                {this.state.formErrors.dob_time && (
                  <Text style={{ color: "red" }}>
                    {this.state.formErrors.dob_time}
                  </Text>
                )}
              </View>
            </View>
            <View>
              <Text style={styles.inputLable}>Address:</Text>
              <TextInput
                value={this.state.Address}
                autoCompleteType="off"
                autoCapitalize="words"
                multiline={true}
                style={[styles.textInput]}
                onChangeText={(Address) => this.setState({ Address })}
              />
              <View>
                {this.state.formErrors.Address && (
                  <Text style={{ color: "red" }}>
                    {this.state.formErrors.Address}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.rowLeft]}>
                <Text style={styles.inputLable}>Mobile:</Text>
              </View>
              <View
                style={[
                  styles.rowRight,
                  // {
                  //   justifyContent: "flex-start",
                  //   paddingLeft: 2,
                  //   paddingTop: Platform.OS === "android" ? 8 : 10,
                  // },
                ]}
              >
                <TextInput
                  value={this.state.Mobile}
                  autoCompleteType="off"
                  autoCapitalize="words"
                  style={[
                    styles.textInput,
                    // {
                    //   justifyContent: "flex-start",
                    //   paddingBottom: Platform.OS === "android" ? 6 : 15,
                    //   paddingLeft: 10,
                    //   top: 6,
                    // },
                  ]}
                  keyboardType="numeric"
                  onChangeText={(Mobile) => this.setState({ Mobile })}
                />
                <View>
                  {this.state.formErrors.Mobile && (
                    <Text style={{ color: "red" }}>
                      {this.state.formErrors.Mobile}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.rowLeft]}>
                <Text style={styles.inputLable}>Email:</Text>
              </View>
              <View
                style={[
                  styles.rowRight,
                  // {
                  //   justifyContent: "flex-start",
                  //   paddingLeft: 2,
                  //   paddingTop: Platform.OS === "android" ? 8 : 10,
                  // },
                ]}
              >
                <TextInput
                  value={this.state.Email}
                  autoCompleteType="email"
                  autoCapitalize="words"
                  style={[
                    styles.textInput,
                    // {
                    //   justifyContent: "flex-start",
                    //   paddingBottom: Platform.OS === "android" ? 6 : 15,
                    //   paddingLeft: 10,
                    //   top: 6,
                    // },
                  ]}
                  keyboardType="email-address"
                  onChangeText={(Email) => this.setState({ Email })}
                />
                <View>
                  {this.state.formErrors.Email && (
                    <Text style={{ color: "red" }}>
                      {this.state.formErrors.Email}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            
            <View>
              <View style={styles.iconPickerContainer}>
                <Text style={styles.inputLable}>Profile Image</Text>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.imageContainer}
                  // onPress={this.chooseIcon}
                  onPress={() => this.RBSheetprofile.open()}
                >
                  {typeof this.state.profileimageURI !== "undefined" ? (
                    <Image
                      style={styles.image}
                      source={{ uri: this.state.profileimageURI }}
                    />
                  ) : (
                    <Ionicons name="image" color={Colors.textColor} size={40} />
                  )}
                </TouchableOpacity>
              </View>
              <View>
                {this.state.formErrors.profileimageURI && (
                  <Text style={{ color: "red" }}>
                    {this.state.formErrors.profileimageURI}
                  </Text>
                )}
              </View>
              <RBSheet
                ref={(ref) => {
                  this.RBSheetprofile = ref;
                }}
                height={100}
                openDuration={250}
                customStyles={{
                  container: {
                    // justifyContent: "center",
                    // alignItems: "center"
                    padding: 15,
                  },
                }}
              >
                <View>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 5,
                    }}
                    onPress={this.openprofileCamera}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={24}
                      color={Colors.textColor}
                    />
                    <Text style={{ marginLeft: 20, color:Colors.textColor }}>
                      Take Photo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 5,
                    }}
                    onPress={this.chooseprofileimage}
                  >
                    <Ionicons
                      name="image-outline"
                      size={24}
                      color={Colors.textColor}
                    />
                    <Text style={{ marginLeft: 20, color: Colors.textColor, }}>
                      Choose Image
                    </Text>
                  </TouchableOpacity>
                </View>
              </RBSheet>
            </View>
            <View>
              <View style={styles.iconPickerContainer}>
                <Text style={styles.inputLable}>ID Card</Text>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.imageContainer}
                  // onPress={this.chooseIcon}
                  onPress={() => this.RBSheeticon.open()}
                >
                  {typeof this.state.imageURI !== "undefined" ? (
                    <Image
                      style={styles.image}
                      source={{ uri: this.state.imageURI }}
                    />
                  ) : (
                    <Ionicons name="image" color={Colors.textColor} size={40} />
                  )}
                </TouchableOpacity>
              </View>
              <View>
                {this.state.formErrors.imageURI && (
                  <Text style={{ color: "red" }}>
                    {this.state.formErrors.imageURI}
                  </Text>
                )}
              </View>
              <RBSheet
                ref={(ref) => {
                  this.RBSheeticon = ref;
                }}
                height={100}
                openDuration={250}
                customStyles={{
                  container: {
                    // justifyContent: "center",
                    // alignItems: "center"
                    padding: 15,
                  },
                }}
              >
                <View>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 5,
                    }}
                    onPress={this.openCameraIcon}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={24}
                      color={Colors.textColor}
                    />
                    <Text style={{ marginLeft: 20, color: Colors.textColor, }}>
                      Take Photo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 5,
                    }}
                    onPress={this.chooseIcon}
                  >
                    <Ionicons
                      name="image-outline"
                      size={24}
                      color={Colors.textColor}
                    />
                    <Text style={{ marginLeft: 20, color: Colors.textColor, }}>
                      Choose Image
                    </Text>
                  </TouchableOpacity>
                </View>
              </RBSheet>
            </View>
            <View>
              <View style={styles.iconPickerContainer}>
                <Text style={styles.inputLable}>Aadhaar Front image</Text>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.imageContainer}
                  // onPress={this.chooseAadhaarFront}
                  onPress={() => this.RBSheetfront.open()}
                >
                  {typeof this.state.AadhaarfrontimageURI !== "undefined" ? (
                    <Image
                      style={styles.image}
                      source={{ uri: this.state.AadhaarfrontimageURI }}
                    />
                  ) : (
                    <Ionicons name="image" color={Colors.textColor} size={40} />
                  )}
                </TouchableOpacity>
              </View>
              <View>
                {this.state.formErrors.AadhaarfrontimageURI && (
                  <Text style={{ color: "red" }}>
                    {this.state.formErrors.AadhaarfrontimageURI}
                  </Text>
                )}
              </View>
              <RBSheet
                ref={(ref) => {
                  this.RBSheetfront = ref;
                }}
                height={100}
                openDuration={250}
                customStyles={{
                  container: {
                    // justifyContent: "center",
                    // alignItems: "center"
                    padding: 15,
                  },
                }}
              >
                <View>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 5,
                    }}
                    onPress={this.openCameraAadhaarFront}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={24}
                      color={Colors.textColor}
                    />
                    <Text style={{ marginLeft: 20, color: Colors.textColor }}>
                      Take Photo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 5,
                    }}
                    onPress={this.chooseAadhaarFront}
                  >
                    <Ionicons
                      name="image-outline"
                      size={24}
                      color={Colors.textColor}
                    />
                    <Text style={{ marginLeft: 20, color: Colors.textColor }}>
                      Choose Image
                    </Text>
                  </TouchableOpacity>
                </View>
              </RBSheet>
            </View>
            <View>
              <View style={styles.iconPickerContainer}>
                <Text style={styles.inputLable}>Aadhaar Back image</Text>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.imageContainer}
                  // onPress={this.chooseAadhaarBack}
                  onPress={() => this.RBSheetback.open()}
                >
                  {typeof this.state.AadhaarbackimageURI !== "undefined" ? (
                    <Image
                      style={styles.image}
                      source={{ uri: this.state.AadhaarbackimageURI }}
                    />
                  ) : (
                    <Ionicons name="image" color={Colors.textColor} size={40} />
                  )}
                </TouchableOpacity>
              </View>
              <View>
                {this.state.formErrors.AadhaarbackimageURI && (
                  <Text style={{ color: "red" }}>
                    {this.state.formErrors.AadhaarbackimageURI}
                  </Text>
                )}
              </View>
              <RBSheet
                ref={(ref) => {
                  this.RBSheetback = ref;
                }}
                height={100}
                openDuration={250}
                customStyles={{
                  container: {
                    // justifyContent: "center",
                    // alignItems: "center"
                    padding: 15,
                  },
                }}
              >
                <View>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 5,
                    }}
                    onPress={this.openCameraAadhaarBack}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={24}
                      color={Colors.textColor}
                    />
                    <Text style={{ marginLeft: 20, color: Colors.textColor }}>
                      Take Photo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 5,
                    }}
                    onPress={this.chooseAadhaarBack}
                  >
                    <Ionicons
                      name="image-outline"
                      size={24}
                      color={Colors.textColor}
                    />
                    <Text style={{ marginLeft: 20, color: Colors.textColor }}>
                      Choose Image
                    </Text>
                  </TouchableOpacity>
                </View>
              </RBSheet>
            </View>

            <View>
              <Text style={styles.inputLable}>Reference</Text>
              <TextInput
                value={this.state.reference}
                autoCompleteType="off"
                autoCapitalize="words"
                style={[styles.textInput]}
                onChangeText={(reference) => this.setState({ reference })}
              />
            </View>

            <View
              style={[
                styles.inputLable,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <Text style={styles.inputLable}>Add Relative</Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.addAction}
                style={{ padding: 5 }}
              >
                <AntDesign name="pluscircleo" size={20} color={Colors.textColor} />
              </TouchableOpacity>
            </View>
            <View>
              <View>
                <Text style={styles.inputLable}>Relation:</Text>
                <Dropdown
                  value={this.state.rel_name}
                  data={[
                    { id: "0", name: "Father" },
                    { id: "1", name: "Mother" },
                    { id: "2", name: "Brother" },
                    { id: "3", name: "Sister" },
                  ]}
                  onChange={(rel_name) =>
                    this.setState({ rel_name: rel_name.name })
                  }
                  style={[
                    styles.textInput,
                    // this.state.statusValidationFailed
                    //   ? styles.inputError
                    //   : null,
                  ]}
                  inputSearchStyle={[styles.inputSearchStyle]}
                  placeholderStyle={{ color: Colors.textColor }}
                  selectedTextStyle={styles.textInput}
                  labelField="name"
                  valueField="id"
                  placeholder={
                    !this.state.rel_name ? "Select Status" : this.state.rel_name
                  }
                />
              </View>

              <View style={styles.row}>
                <Text style={styles.inputLable}>Phone:</Text>
                <View
                  style={[
                    styles.rowRight,
                    {
                      justifyContent: "flex-start",
                      // paddingLeft: 2,
                      // paddingTop: Platform.OS === "android" ? 8 : 10,
                    },
                  ]}
                >
                  <TextInput
                    value={this.state.rel_phone}
                    autoCompleteType="off"
                    autoCapitalize="words"
                    style={[
                      styles.textInput,
                      // {
                      //   justifyContent: "flex-start",
                      //   // paddingBottom: Platform.OS === "android" ? 6 : 15,
                      //   // paddingLeft: 10,
                      //   // top: 6,
                      // },
                    ]}
                    keyboardType="numeric"
                    onChangeText={(rel_phone) => this.setState({ rel_phone })}
                  />
                </View>
              </View>
            </View>
            <View>
              {this.state.all_rel.map((data, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      padding: 5,
                      marginBottom: 5,
                      borderRadius: 4,
                      borderColor: Colors.textInputBorder,
                      backgroundColor: Colors.textInputBg,
                    }}
                  >
                    <Text style={styles.inputLable}>{data.name}</Text>
                    <Text style={[styles.inputLable]}>{data.phone}</Text>
                  </View>
                );
              })}
              <View>
                {this.state.formErrors.all_rel && (
                  <Text style={{ color: "red" }}>
                    {this.state.formErrors.all_rel}
                  </Text>
                )}
              </View>
            </View>

            <View>
              <InputDropdown
                label={"Designations:"}
                value={this.state.designation}
                isOpen={this.state.isDesignationsMenuOpen}
                items={this.state.DesignationList}
                openAction={this.toggleDesignationsMenu}
                closeAction={this.toggleDesignationsMenu}
                setValue={this.setDesignationsData}
                labelStyle={styles.inputLable}
                textFieldStyle={styles.textInput}
                placeholder={this.state.designation}
              />
              <View>
                {this.state.formErrors.designation && (
                  <Text style={{ color: "red" }}>
                    {this.state.formErrors.designation}
                  </Text>
                )}
              </View>
            </View>
            <View>
              <Text style={styles.inputLable}>Action Type:</Text>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                {Configs.USER_ACTION_TYPES.map((item) => (
                  <Checkbox
                    key={item.id}
                    activeOpacity={1}
                    label={item.name}
                    checked={this.state.selectedActionTypes.includes(item.id)}
                    checkedColor={Colors.primary}
                    uncheckedColor={Colors.primary}
                    onChange={this.setActionType.bind(this, item.id)}
                    labelStyle={[
                      styles.mb0,
                      { fontSize: 16, color: Colors.textColor,  },
                    ]}
                  />
                  // <Text>{item.name}</Text>
                ))}
              </View>
              {this.state.actionTypesValidationFailed ? (
                <Text style={{ color: "red" }}>
                  Choose atleast one action type
                </Text>
              ) : null}
            </View>

            <View style={styles.inputLable}>
              <MultiSelectDropdown
                label={"Module Permissions"}
                items={this.state.modulePermissions}
                selectedItems={this.state.selectedModulePermissions}
                labelStyle={styles.name}
                placeHolderContainer={styles.textInput}
                placeholderStyle={styles.placeholderStyle}
                selectedItemsContainer={styles.selectedItemsContainer}
                onSave={this.setSelectedModulePermissions}
              />
              {this.state.ModulePermissionsValidationFailed ? (
                <Text style={{ color: "red" }}>
                  Choose atleast one Module Permissions
                </Text>
              ) : null}
            </View>
            {/* <View style={styles.inputLable}>
						<MultiSelectDropdown
							label={"Tab Permissions"}
							items={this.state.modulePermissions}
							selectedItems={this.state.selectedModulePermissions}
							labelStyle={styles.name}
							placeHolderContainer={styles.textInput}
							placeholderStyle={styles.placeholderStyle}
							selectedItemsContainer={styles.selectedItemsContainer}
							onSave={this.setSelectedModulePermissions}
						/>
					</View> */}
          <View style={styles.inputLable}>
              <MultiSelectDropdown
                label={"Order Permissions"}
                items={this.state.orderPermissions}
                selectedItems={this.state.selectedOrderPermissions}
                labelStyle={styles.name}
                placeHolderContainer={styles.textInput}
                placeholderStyle={styles.placeholderStyle}
                selectedItemsContainer={styles.selectedItemsContainer}
                onSave={this.setSelectedOrderPermissions}
              />
              {this.state.OrderPermissionsValidationFailed ? (
                <Text style={{ color: "red" }}>
                  Choose atleast one Order Permissions
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={this.ControlSubmit}
            >
              {this.state.stateID == 1 ? (
                <Text style={{ fontSize: 18, color: Colors.white }}>
                  {" "}
                  Edit{" "}
                </Text>
              ) : (
                <Text style={{ fontSize: 18, color: Colors.white }}>
                  {" "}
                  Save{" "}
                </Text>
              )}
            </TouchableOpacity>

            <AwesomeAlert
              show={this.state.showAlertModal}
              showProgress={false}
              title={this.state.alertType}
              message={this.state.alertMessage}
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
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: Colors.white,
    padding: 5,
    height: windowHeight - 130,
  },
  form: {
    flex: 1,
    padding: 8,
  },
  iconPickerContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 3,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  image: {
    height: 50,
    width: 50,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputLable: {
    fontSize: 16,
    color: Colors.textColor,
    paddingBottom: 7,
    // opacity: 0.8,
  },
  textInput: {
    padding: 9,
    fontSize: 14,
    width: "100%",
    borderRadius: 4,
    color: Colors.textColor,
    borderColor: Colors.textInputBorder,
    backgroundColor: Colors.textInputBg,
    backgroundColor: Colors.light,
    // marginVertical: 5,
  },
  submitBtn: {
    marginTop: 15,
    height: 50,
    width: "100%",
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginBottom: 10,
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  mb0: {
    marginBottom: 0,
  },
  name: {
    fontSize: 16,
    color:Colors.textColor,
  },
});
