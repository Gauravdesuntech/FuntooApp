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
import { Toast } from "native-base";
import AuthService from "../../services/CashFlow/Auth"
import Loader from "../../components/CashFlow/component/loader";
import { Header } from "../../components";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from '@expo/vector-icons';

class AddCategory_Cashflow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentCatId: 0,
      catType: 1,
      isParent: 1,
      catName: "",
      parentCats: [],
      userAccount: [],
      visible: true,
      spinner: false,

      CategoryType: [
        { label: "Income", value: "1" },
        { label: "Expense", value: "4" },
        { label: "Transfer", value: "5" }
      ],
      SubCategory: [
        { label: "No", value: "0" },
        { label: "Yes", value: "1" }
      ],
    };
  }

  componentDidMount() {
    this.getParentCategory();
    this.getLoggedinUser();
  }

  async getParentCategory() {
    let result = await AuthService.getParentCat();
    if (result.status == "1") {
      this.setState({ visible: false, parentCats: result.parentCat });
    }
  }

  async getLoggedinUser() {
    let result = await AuthService.getAccount();
    this.setState({ userAccount: result });
  }

  onParentCatIdChange(value) {
    this.setState({
      parentCatId: value,
    });
  }
  onCatTypeChange(value) {
    this.setState({
      catType: value,
    });
  }
  onIsParentChange(value) {
    this.setState({
      isParent: value,
    });
  }

  addCat = async () => {
    if (this.state.catName == "") {
      Toast.show({
        text: "Category name required",
        textStyle: { fontSize: 14 },
        duration: 700,
        position: "bottom",
        type: "danger",
      });
    } else {
      let result = await AuthService.createCat(
        this.state.catName,
        this.state.catType,
        this.state.isParent,
        this.state.parentCatId,
        this.state.userAccount.user_code
      );
      if (result.status == 1) {
        Toast.show({
          text: "Category Created Successfully",
          textStyle: { fontSize: 14 },
          duration: 3000,
          position: "bottom",
          type: "success",
        });
      } else if (result.status == 1) {
        Toast.show({
          text: "Category with same name already exhists",
          textStyle: { fontSize: 14 },
          duration: 3000,
          position: "bottom",
          type: "success",
        });
      } else {
        Toast.show({
          text: "Failed to create category",
          textStyle: { fontSize: 14 },
          duration: 3000,
          position: "bottom",
          type: "success",
        });
      }
    }
  };

  refreshState() {
    this.setState({
      parentCatId: 0,
      catType: 1,
      isParent: 1,
      catName: "",
      parentCats: [],
      visible: true,
      spinner: false,
    });
    this.getParentCategory();
  }

  render() {
    const { visible, parentCats, spinner } = this.state;

    return (
      <SafeAreaView style={[styles.container]}>
        <Header title={"Add Category"} />
        {visible ? (
          <Loader visibility={true} />
        ) : (
          <View style={{ margin: 15 }}>
            <View style={{ margin: 0, padding: 0 }}>
              <Text>Category Name</Text>
              <TextInput
                placeholder="Ex: Event Expense"
                onChangeText={(val) => {
                  this.setState({ catName: val });
                }}
              />
            </View>
            <View >
              <Text>Category Type</Text>
              <Dropdown
                style={{ width: "100%" }}
                placeholder="Category Type"
                placeholderStyle={{ color: "#bfc6ea" }}
                iconStyle={{ color: "#007aff" }}
                date={[
                  { label: "Income", value: "1" },
                  { label: "Expense", value: "4" },
                  { label: "Transfer", value: "5" }
                ]}
                labelField="label"
                valueField="value"
                value={this.state.catType}
                onChange={this.onCatTypeChange.bind(this)}
              />
            </View>
            <View >
              <Text>Sub Category?</Text>
              <Dropdown
                style={{ width: "100%" }}
                placeholder="Sub Category?"
                placeholderStyle={{ color: "#bfc6ea" }}
                iconStyle={{ color: "#007aff" }}
                date={this.state.SubCategory}
                value={this.state.isParent}
                onChange={this.onIsParentChange.bind(this)}
              />
            </View>
            {this.state.isParent == "0" ? (
              <View >
                <Text>Select Main Category</Text>
                <Dropdown
                  style={{ width: "100%" }}
                  placeholder="Select Category"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  value={this.state.parentCatId}
                  date={this.state.SubCategory}
                  onChange={this.onParentCatIdChange.bind(this)}
                />
                {/* {parentCats.map((item, i) => {
                    return (
                      <Picker.View
                        label={`${item.cat_name}`}
                        key={`${item.id}`}
                        value={`${item.id}`}
                      />
                    );
                  })} */}
              </View>
            ) : null}
            <TouchableOpacity style={styles.button} onPress={this.addCat}>
              {spinner ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.buttonText}> Submit </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#00B386",
    padding: 10,
    marginTop: 10,
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AddCategory_Cashflow;
