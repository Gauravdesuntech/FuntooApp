{/* 
*
*move and modify from cashflow app
*created by - Rahul Saha
*Crreated on - 28.11.22
*
*
*/}

import React, { Component } from "react";
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
  ActivityIndicator
} from "react-native";
import {
  Toast,
} from "native-base";
import AuthService from "../../services/CashFlow/Auth"
import Loader from "../component/loader";
import { Header } from "../../components";
import { Dropdown } from "react-native-element-dropdown";

class AddDepartment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentDepartmentId: "",
      departmentType: "0",
      isParent: 1,
      departmentStatus: "1",
      departmentName: null,
      parentDepartment: [],
      userAccount: [],
      visible: true,
      spinner: false,
    };
  }

  componentDidMount() {
    this.getParentDepartment();
    this.getLoggedinUser();
  }

  async getParentDepartment() {
    let result = await AuthService.getAllParentDepartment();
    // console.log("Parent data-->",result[0].name);
    // return;
    this.setState({ visible: false, parentDepartment: result });
    // if (result.status == "1") {
    //   this.setState({ visible: false, parentDepartment: result });
    // }
  }

  async getLoggedinUser() {
    let result = await AuthService.getAccount();
    this.setState({ userAccount: result });
  }

  onDepartmentStatusChange(value) {
    this.setState({
      departmentStatus: value,
    });
  }

  onParentDepartmentIdChange(value) {
    this.setState({
      parentDepartmentId: value,
    });
  }

  onDepartmentTypeChange(value) {
    this.setState({
      departmentType: value,
    });
  }
  addProject = async () => {
    this.setState({
      spinner: true,
    });
    let departmentId;
    if (this.state.departmentName == "" || this.state.departmentName == null) {
      Toast.show({
        text: "Department name is required",
        textStyle: { fontSize: 14 },
        duration: 1000,
        position: "bottom",
        type: "danger",
      });
      this.setState({
        spinner: false,
      });
      return null;
    }

    if (this.state.departmentType == "1") {
      departmentId = this.state.parentDepartmentId;
    } else {
      departmentId = "";
    }

    let result = await AuthService.createDepartment(
      this.state.departmentName,
      this.state.departmentStatus,
      this.state.departmentType,
      departmentId,
      this.state.userAccount.user_code
    );
    console.log("Result dept -->",result.status);
    if (result.status == 1) {
      this.setState({
        spinner: false,
      });
      Toast.show({
        text: "Department created Successfully",
        textStyle: { fontSize: 14 },
        duration: 1000,
        position: "bottom",
        type: "success",
      });
      this.refreshState();
    } else if (result.status == 2) {
      this.setState({
        spinner: false,
      });
      Toast.show({
        text: "Department with same name already exhist",
        textStyle: { fontSize: 14 },
        duration: 1000,
        position: "bottom",
        type: "danger",
      });
    } else {
      this.setState({
        spinner: false,
      });
      Toast.show({
        text: "Failed to create department",
        textStyle: { fontSize: 14 },
        duration: 1000,
        position: "bottom",
        type: "danger",
      });
    }
  };

  refreshState() {
    this.setState({
      departmentName: null,
      departmentStatus: "1",
      departmentType: "0",
      parentDepartmentId: "",
      visible: true,
      spinner: false,
    });
    this.getParentDepartment();
  }

  render() {
    const { visible, spinner, departmentName, parentDepartment } = this.state;
    //console.log("projectStartDate------------>", projectStartDate)
    return (
      <SafeAreaView style={styles.container}>
        <Header title={"Add Projects"} />

        <View style={{ margin: 15 }}>
          <View style={{ margin: 0, padding: 0 }}>
            <View stackedLabel style={{ margin: 0, padding: 0 }}>
              <Text>Department Name</Text>
              <TextInput
                onChangeText={(val) => {
                  this.setState({ departmentName: val });
                }}
                value={departmentName ? departmentName : null}
              />
            </View>

            <View stackedLabel>
              <Text>Is it a sub-department?</Text>
              <Dropdown
                style={{ width: "100%" }}
                placeholder="Project Type"
                placeholderStyle={{ color: "#bfc6ea" }}
                date={[
                  { label: "No", value: "0" },
                  { label: "Yes", value: "1" }
                ]}
                  iconStyle={{ color: "#007aff" }}
                value={this.state.departmentType}
                onChange={this.onDepartmentTypeChange.bind(this)}
              />
            </View>
            {this.state.departmentType == "1" ? (
              <View stackedLabel>
                <Text>Select Main Department</Text>
                <Dropdown
                  style={{ width: "100%" }}
                  placeholder="Select Category"
                  placeholderStyle={{ color: "#bfc6ea" }}
                    iconStyle={{ color: "#007aff" }}
                  value={this.state.parentDepartmentId}
                  onChange={this.onParentDepartmentIdChange.bind(this)}
                />
                  {/* {parentDepartment.map((item, i) => {
                    console.log("name-->",item.name);
                    return (
                      <Picker.View
                        label={`${item.name}`}
                        key={`${item.id}`}
                        value={`${item.id}`}
                      />
                    );
                  })} */}
              </View>
            ) : null}
            <View stackedLabel>
              <Text>Status</Text>
              <Dropdown
                style={{ width: "100%" }}
                placeholder="Sub Category?"
                placeholderStyle={{ color: "#bfc6ea" }}
                date={[
                  { label: "Inactive", value: "0" },
                  { label: "Active", value: "1" }
                ]}
                  iconStyle={{ color: "#007aff" }}
                value={this.state.departmentStatus}
                onChange={this.onDepartmentStatusChange.bind(this)}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={this.addProject}>
              {spinner ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.buttonText}> Submit </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#00B386",
    padding: 10,
    marginBottom: 10,
    marginTop: 30,
    justifyContent: "center",
    width: "90%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AddDepartment;
