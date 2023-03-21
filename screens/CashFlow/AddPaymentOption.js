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

class AddPaymentOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      methodName: "",
      userAccount: [],
      visible: false,
      spinner: false,
    };
  }

  componentDidMount() {
    this.getLoggedinUser();
  }

  async getLoggedinUser() {
    let result = await AuthService.getAccount();
    this.setState({ userAccount: result });
  }

  addPayMethod = async () => {
    let result = await AuthService.createPayMethod(
      this.state.methodName,
      this.state.userAccount.user_code
    );
    if (result.status == 1) {
      Toast.show({
        text: "Payment Method Created Successfully",
        textStyle: { fontSize: 14 },
        duration: 3000,
        position: "bottom",
        type: "success",
      });
    } else {
      Toast.show({
        text: "Failed to add payment method",
        textStyle: { fontSize: 14 },
        duration: 3000,
        position: "bottom",
        type: "danger",
      });
    }
  };

  refreshState() {
    this.setState({
      methodName: " ",
      visible: false,
      spinner: false,
    });
  }

  render() {
    const { visible, spinner } = this.state;

    return (
      <SafeAreaView style={[styles.container]}>
          <Header title={"Add Payment"} />
        
        {visible ? (
          <Loader visibility={false} />
        ) : (
          <View style={{ margin: 15 }}>
              <View stackedLabel style={{ margin: 0, padding: 0 }}>
                <Text>Payment Method Name</Text>
                <TextInput
                  placeholder="Ex: Cash,Online"
                  onChangeText={(val) => {
                    this.setState({ methodName: val });
                  }}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={this.addPayMethod}>
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
    margin: 15,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#00B386",
    padding: 10,
    marginTop: 30,
    justifyContent: "center",
    width: '100%',
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AddPaymentOption;
