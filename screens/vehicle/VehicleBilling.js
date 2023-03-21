import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import Colors from "../../config/colors";
import { Header } from "../../components";
import {
  AddVehicleBilling,
  GetVehicleBillingInfo,
} from "../../services/VehicleInfoApiService";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from "react-native-awesome-alerts";
import AppContext from "../../context/AppContext";
 

export default class VehicleBilling extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      vehicleInfo: this.props.route.params.vehicleInfo,
      isLoading: false,
      showAlertModal: false,
      alertType: "",
      alertMessage: "",
      journey_type: "",

      vehicle_info_id: null,
      upwords_start_km: "",
      upwords_end_km: "",
      total_km_on_up: "",
      downwords_start_km: "",
      downwords_end_km: "",
      total_km_on_return: "",
      total_km: "",
      amount: "",
      toll_charges: "",
      permit_charge: "",
      other_charges: "",
      waiting_charge: "",
      total: "",
      discount: "0",
      grand_total: "",
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    GetVehicleBillingInfo(this.state.vehicleInfo.vehicles_info_id).then(
      (response) => {
        this.setState({ isLoading: false });

        if (response.data.journey_type == "Onward") {
          this.setState({
            journey_type: response.data.journey_type,
            upwords_start_km: response.data.upwords_start_km.toString(),
            upwords_end_km: response.data.upwords_end_km.toString(),
            total_km_on_up: response.data.total_km_on_up.toString(),
            total_km: response.data.total_km.toString(),
            amount: response.data.amount.toString(),
            toll_charges: response.data.toll_charges.toString(),
            waiting_charge: response.data.waiting_charge.toString(),
            permit_charge: response.data.permit_charge.toString(),
            other_charges: response.data.other_charges.toString(),
            total: response.data.total.toString(),
            grand_total: response.data.total.toString(),
          });
        } else if (response.data.journey_type == "Return") {
          this.setState({
            journey_type: response.data.journey_type,
            downwords_start_km: response.data.downwords_start_km.toString(),
            downwords_end_km: response.data.downwords_end_km.toString(),
            total_km_on_return: response.data.total_km_on_return.toString(),
            total_km: response.data.total_km.toString(),
            amount: response.data.amount.toString(),
            toll_charges: response.data.toll_charges.toString(),
            waiting_charge: response.data.waiting_charge.toString(),
            permit_charge: response.data.permit_charge.toString(),
            other_charges: response.data.other_charges.toString(),
            total: response.data.total.toString(),
            grand_total: response.data.total.toString(),
          });
        } else {
          this.setState({
            journey_type: response.data.journey_type,
            upwords_start_km: response.data.upwords_start_km.toString(),
            upwords_end_km: response.data.upwords_end_km.toString(),
            total_km_on_up: response.data.total_km_on_up.toString(),
            downwords_start_km: response.data.downwords_start_km.toString(),
            downwords_end_km: response.data.downwords_end_km.toString(),
            total_km_on_return: response.data.total_km_on_return.toString(),
            total_km: response.data.total_km.toString(),
            amount: response.data.amount.toString(),
            toll_charges: response.data.toll_charges.toString(),
            waiting_charge: response.data.waiting_charge.toString(),
            permit_charge: response.data.permit_charge.toString(),
            other_charges: response.data.other_charges.toString(),
            total: response.data.total.toString(),
            grand_total: response.data.total.toString(),
          });
        }
      }
    );
  }

  handleDiscount = () => {
    if (this.state.discount != "") {
      let disCount = parseFloat(this.state.discount);
      let grandTotal = parseFloat(this.state.total) - disCount;
      this.setState({
        discount: disCount.toString(),
        grand_total: grandTotal.toString(),
      });
    }
  };

  Add = () => {
    this.setState({ isLoading: true });
    let data = null;
    if (this.state.journey_type == "Onward") {
      data = {
        vehicles_info_id: this.state.vehicleInfo.vehicles_info_id,
        upwords_start_km: this.state.upwords_start_km,
        upwords_end_km: this.state.upwords_end_km,
        total_km_on_up: this.state.total_km_on_up,
        total_km: this.state.total_km,
        amount: this.state.amount,
        waiting_charge: this.state.waiting_charge,
        permit_charge: this.state.permit_charge,
        other_charges: this.state.other_charges,
        toll_charges: this.state.toll_charges,
        total: this.state.total,
        discount: this.state.discount,
        grand_total: this.state.grand_total,
      };
    } else if (this.state.journey_type == "Return") {
      data = {
        vehicles_info_id: this.state.vehicleInfo.vehicles_info_id,
        downwords_start_km: this.state.downwords_start_km,
        downwords_end_km: this.state.downwords_end_km,
        total_km_on_return: this.state.total_km_on_return,
        total_km: this.state.total_km,
        amount: this.state.amount,
        waiting_charge: this.state.waiting_charge,
        permit_charge: this.state.permit_charge,
        other_charges: this.state.other_charges,
        toll_charges: this.state.toll_charges,
        total: this.state.total,
        discount: this.state.discount,
        grand_total: this.state.grand_total,
      };
    } else {
      data = {
        vehicles_info_id: this.state.vehicleInfo.vehicles_info_id,
        upwords_start_km: this.state.upwords_start_km,
        upwords_end_km: this.state.upwords_end_km,
        total_km_on_up: this.state.total_km_on_up,
        downwords_start_km: this.state.downwords_start_km,
        downwords_end_km: this.state.downwords_end_km,
        total_km_on_return: this.state.total_km_on_return,
        total_km: this.state.total_km,
        amount: this.state.amount,
        waiting_charge: this.state.waiting_charge,
        permit_charge: this.state.permit_charge,
        other_charges: this.state.other_charges,
        toll_charges: this.state.toll_charges,
        total: this.state.total,
        discount: this.state.discount,
        grand_total: this.state.grand_total,
      };
    }

    AddVehicleBilling(data)
      .then((response) => {
        this.setState({ isLoading: false });
        if (response.is_success) {
          // show alert here
          this.setState({
            showAlertModal: true,
            alertType: "Success",
            alertMessage: "Info Recorded Successfully",
          });
        } else {
          this.setState({
            showAlertModal: true,
            alertType: "Success",
            alertMessage: response.message,
          });
        }
      })
      .catch((err) => {
        console.log("errror", err);
        this.setState({
          showAlertModal: true,
          alertType: "Error",
          alertMessage: "Server Error",
        });
      });
  };

  hideAlert = () => {
    this.setState({
      showAlertModal: false,
    });
    this.props.navigation.goBack();
  };

  render() {
    return (
      <SafeAreaView>
        {this.state.isLoading && <OverlayLoader />}
        <View style={styles.container}>
          <Header title={"Billing"} />
          <ScrollView style={{ marginBottom: "30%" }}>
            <View style={styles.form}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                 
                  {this.state.journey_type == "Onward" ||
                  this.state.journey_type == "Both" ? (
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLable}>Upwords Start KM:</Text>
                      <TextInput
                        autoCompleteType="off"
                        keyboardType="number-pad"
                        autoCapitalize="words"
                        style={styles.textInput}
                        value={this.state.upwords_start_km}
                        editable={false}
                        onChangeText={(upwords_start_km) => {
                          this.setState({
                            upwords_start_km: upwords_start_km,
                          });
                        }}
                      />
                    </View>
                  ) : null}

                  {this.state.journey_type == "Onward" ||
                  this.state.journey_type == "Both" ? (
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLable}>Upwords End KM:</Text>
                      <TextInput
                        autoCompleteType="off"
                        keyboardType="number-pad"
                        autoCapitalize="words"
                        style={styles.textInput}
                        value={this.state.upwords_end_km}
                        editable={false}
                        onChangeText={(upwords_end_km) => {
                          this.setState({ upwords_end_km: upwords_end_km });
                        }}
                      />
                    </View>
                  ) : null}

                  {this.state.journey_type == "Onward" ||
                  this.state.journey_type == "Both" ? (
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLable}>Total KM on Up:</Text>
                      <TextInput
                        autoCompleteType="off"
                        keyboardType="number-pad"
                        autoCapitalize="words"
                        style={styles.textInput}
                        value={this.state.total_km_on_up}
                        editable={false}
                        onChangeText={(total_km_on_up) => {
                          this.setState({ total_km_on_up: total_km_on_up });
                        }}
                      />
                    </View>
                  ) : null}

                  {this.state.journey_type == "Return" ||
                  this.state.journey_type == "Both" ? (
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLable}>Downwords Start KM:</Text>
                      <TextInput
                        autoCompleteType="off"
                        keyboardType="number-pad"
                        autoCapitalize="words"
                        style={styles.textInput}
                        value={this.state.downwords_start_km}
                        editable={false}
                        onChangeText={(downwords_start_km) => {
                          this.setState({
                            downwords_start_km: downwords_start_km,
                          });
                        }}
                      />
                    </View>
                  ) : null}

                  {this.state.journey_type == "Return" ||
                  this.state.journey_type == "Both" ? (
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLable}>Downwords End KM:</Text>
                      <TextInput
                        autoCompleteType="off"
                        keyboardType="number-pad"
                        autoCapitalize="words"
                        style={styles.textInput}
                        value={this.state.downwords_end_km}
                        editable={false}
                        onChangeText={(downwords_end_km) => {
                          this.setState({
                            downwords_end_km: downwords_end_km,
                          });
                        }}
                      />
                    </View>
                  ) : null}

                  {this.state.journey_type == "Return" ||
                  this.state.journey_type == "Both" ? (
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLable}>Total KM on Return:</Text>
                      <TextInput
                        autoCompleteType="off"
                        keyboardType="number-pad"
                        autoCapitalize="words"
                        style={styles.textInput}
                        value={this.state.total_km_on_return}
                        editable={false}
                        onChangeText={(total_km_on_return) => {
                          this.setState({
                            total_km_on_return: total_km_on_return,
                          });
                        }}
                      />
                    </View>
                  ) : null}

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLable}>Total KM:</Text>
                    <TextInput
                      autoCompleteType="off"
                      keyboardType="number-pad"
                      autoCapitalize="words"
                      style={styles.textInput}
                      value={this.state.total_km}
                      editable={false}
                      onChangeText={(total_km) => {
                        this.setState({ total_km: total_km });
                      }}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLable}>Amount:</Text>
                    <TextInput
                      autoCompleteType="off"
                      keyboardType="number-pad"
                      autoCapitalize="words"
                      style={styles.textInput}
                      value={this.state.amount}
                      editable={false}
                      onChangeText={(amount) => {
                        this.setState({ total_km: amount });
                      }}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLable}>Toll Charges:</Text>
                    <TextInput
                      autoCompleteType="off"
                      keyboardType="number-pad"
                      autoCapitalize="words"
                      style={styles.textInput}
                      editable={false}
                      value={this.state.toll_charges}
                      onChangeText={(toll_charges) => {
                        this.setState({ toll_charges: toll_charges });
                      }}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLable}>Permit Charges:</Text>
                    <TextInput
                      autoCompleteType="off"
                      keyboardType="number-pad"
                      autoCapitalize="words"
                      style={styles.textInput}
                      editable={false}
                      value={this.state.permit_charge}
                      onChangeText={(permit_charge) => {
                        this.setState({ permit_charge: permit_charge });
                      }}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLable}>Waiting Charge:</Text>
                    <TextInput
                      autoCompleteType="off"
                      keyboardType="number-pad"
                      autoCapitalize="words"
                      style={styles.textInput}
                      editable={false}
                      value={this.state.waiting_charge}
                      onChangeText={(waiting_charge) => {
                        this.setState({ waiting_charge: waiting_charge });
                      }}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLable}>Other Charges:</Text>
                    <TextInput
                      autoCompleteType="off"
                      keyboardType="number-pad"
                      autoCapitalize="words"
                      style={styles.textInput}
                      editable={false}
                      value={this.state.other_charges}
                      onChangeText={(other_charges) => {
                        this.setState({ other_charges: other_charges });
                      }}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLable}>Total:</Text>
                    <TextInput
                      autoCompleteType="off"
                      keyboardType="number-pad"
                      autoCapitalize="words"
                      style={styles.textInput}
                      value={this.state.total}
                      onChangeText={(total) => {
                        this.setState({ total: total });
                      }}
                      editable={false}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLable}>Discount:</Text>
                    <TextInput
                      autoCompleteType="off"
                      keyboardType="number-pad"
                      autoCapitalize="words"
                      style={styles.textInput}
                      value={this.state.discount}
                      onChangeText={(discount) => {
                        this.setState({ discount: discount });
                      }}
                      onEndEditing={() => {
                        this.handleDiscount();
                      }}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLable}>Grand Total:</Text>
                    <TextInput
                      autoCompleteType="off"
                      keyboardType="number-pad"
                      autoCapitalize="words"
                      style={styles.textInput}
                      value={this.state.grand_total}
                      editable={false}
                    />
                  </View>

                  <TouchableOpacity style={styles.submitBtn} onPress={this.Add}>
                    <Text style={{ fontSize: 18, color: Colors.white }}>
                      {"Save"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>

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
  },

  box: {
    borderColor: "#eee",
    borderWidth: 1,
    padding: 10,
    margin: 2,
  },

  boxHead: {
    fontFamily: "serif",
    fontSize: 16,
    margin: 5,
    color: Colors.textColor,
    fontWeight: "bold",
  },
  lsitContainer: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.textInputBorder,
  },
  qtyContainer: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textColor,
    marginBottom: 2,
  },
  subText: {
    fontSize: 13,
    color: Colors.textColor,
    marginBottom: 2,
  },
  modalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth,
    height: windowHeight,
    backgroundColor: Colors.white,
  },
  itemModalContainer: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: Colors.white,
  },
  itemModalHeader: {
    height: 55,
    flexDirection: "row",
    width: "100%",
    backgroundColor: Colors.primary,
    elevation: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerBackBtnContainer: {
    width: "15%",
    height: 55,
    paddingLeft: 5,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitleContainer: {
    width: "70%",
    paddingLeft: 20,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  itemModalBody: {
    flex: 1,
    height: windowHeight - 55,
  },
  form: {
    // flex: 1,
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
    flexDirection: "row",

    width: "100%",
    marginBottom: 20,
  },
  inputLable: {
    width: "50%",
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 10,
    // opacity: 0.8,
  },
  textInput: {
    borderWidth: 1,
    padding: 9,
    fontSize: 14,
    width: "50%",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.textInputBorder,
    //backgroundColor: Colors.textInputBg,
  },
  submitBtn: {
    marginTop: 15,
    height: 45,
    width: "100%",
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
});
