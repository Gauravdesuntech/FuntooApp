import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  UIManager,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Configs from "../../config/Configs";
import Colors from "../../config/colors";
import { ChangeOrderStatus, GetOrder } from "../../services/OrderService";
import OverlayLoader from "../../components/OverlayLoader";
import { showDayAsClientWant, showTimeAsClientWant } from "../../utils/Util";
import OrderAndGenerateBill from "../../components/Orders/OrderAndGenerateBill";
import PressableButton from "../../components/PressableButton";
import AppContext from "../../context/AppContext";
import getDirections from "react-native-google-maps-directions";
import { Ionicons } from "@expo/vector-icons";
import {
  Getemployee,
  OrderIncharge,
  update_track_log,
} from "../../services/APIServices";
import { Dropdown } from "react-native-element-dropdown";
import AwesomeAlert from "react-native-awesome-alerts";

export default class EventDetails extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    // console.log("............props.orderData...............", props.orderData);
    this.state = {
      showLoader: false,
      orderData: props.orderData,
      eventDetails: null,
      expanded: false,
      employee: [],
      empl_name:
        props.orderData?.order_incharge_name != null
          ? props.orderData?.order_incharge_name
          : "",
      empl_number:
        props.orderData?.customer_mobile != null
          ? props.orderData?.customer_mobile
          : "",

      empl_id:
        props.orderData?.order_incharge_id != null
          ? props.orderData?.order_incharge_id
          : "",
      showAlertModal: false,
      alertMessage: "",
      alertType: "",
    };

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    // console.log(
    //   ".......this.state.orderData.id............",
    //   this.state.orderData.id
    // );
    if (this.props.currentTab.toString() == "0") {
      this.fetchData();
      this.getEmployee();
    }
  }

  fetchData = () => {
    this.setState({ showLoader: true });
    GetOrder({ id: this.state.orderData.id })
      .then((result) => {
        if (result.is_success) {
          this.setState({
            eventDetails: result.data,
          });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        this.setState({ showLoader: false });
      });
  };
  getEmployee = () => {
    Getemployee()
      .then((response) => {
        // console.log("response..........Getemployee..........", response)
        let Data = response.map((item) => {
          // console.log("......start............");
          // console.log("......mmmm............", item);
          // console.log("......end............");
          return {
            id: item.id,
            name: item.name,
            phone: item.phone,
          };
        });
        // console.log("response..........Data..........", Data)
        this.setState({ employee: Data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleGetDirections = () => {
    // console.log(".............navigating....................")

    const data = {
      source: {
        latitude: Configs.ofcLat_Lng.lat,
        longitude: Configs.ofcLat_Lng.lng,
      },
      destination: {
        latitude: JSON.parse(this.state.orderData?.userLat_Lng).lat,
        longitude: JSON.parse(this.state.orderData?.userLat_Lng).lng,
      },
      params: [
        {
          key: "travelmode",
          value: "driving",
        },
        {
          key: "dir_action",
          value: "navigate",
        },
      ],
    };
    // console.log("..........direction.......",data)

    getDirections(data);
  };

  saveOrderIncharge = () => {
    let data = {
      order_id: this.state.orderData.order_id,
      employee_name: this.state.empl_name,
      employee_id: this.state.empl_id,
      employee_number: this.state.empl_number,
    };
    let value = {
      order_id: this.state.orderData.id,
      reviewer_id: this.context.userData.cust_code,
      reviewer_name: this.context.userData.name,
      type: this.context.userData.type,
      //track_comment: `${this.state.empl_name}is appointed as an order manager`,
      track_comment: `${this.state.empl_name}(${this.state.empl_number})is appointed as an order manager`,
    };
    console.log("........................end.........................");
    console.log("....saveOrderIncharge..11111.", value);

    this.setState({ showLoader: true });
    update_track_log(value)
      .then((res) => {
        console.log("..........res..........", res);
      })
      .catch((err) => {});
    OrderIncharge(data)
      .then((res) => {
        console.log(".....OrderIncharge...res.....", res);
        alert(res.message);
      })
      .catch((err) => console.log(".....OrderIncharge.....err......", err))
      .finally(() => this.setState({ showLoader: false }));
  };

  /*
   *
   *close order
   *
   *created by -Rahul Saha
   *
   *created on -10.12.22
   *
   */

  CloseOrder = () => {
    let data = {
      id: this.state.orderData.id,
      status: "closed",
      contact_number: this.state.orderData.customer_mobile,
      uni_order_id: this.state.orderData.order_id,
    };

    this.setState({ showLoader: true });

    ChangeOrderStatus(data)
      .then((result) => {
        if (result.is_success) {
          this.setState(
            {
              isModalOpenCancel: false,
              showAlertModal: true,
              alertType: "Success",
              alertMessage: result.message,
            },
            () => this.props.navigation.goBack()
          );
        } else {
          // console.log('err', result);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        this.setState({
          showLoader: false,
        });
      });
  };

  render = () => {
    let lineItems = this.state.eventDetails?.line_items;
    return (
      <>
        {this.state.showLoader ? (
          <OverlayLoader visible={this.state.showLoader} />
        ) : (
          <ScrollView style={styles.container}>
            {/* <ScrollView> */}
            <View style={styles.rowContainer}>
              <View style={styles.row}>
                <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                  <Text style={styles.inputLable}>Event Start:</Text>
                </View>
                <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                  <View style={{ width: "55%" }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        paddingRight: 0,
                        paddingVertical: 4,
                        paddingLeft: 10,
                        width: "100%",
                      }}
                    >
                      <Text style={styles.location}>
                        {showDayAsClientWant(
                          this.state.eventDetails?.event_data
                            ?.event_start_timestamp
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.divider}></View>
                  <View style={{ width: "45%", borderTopRightRadius: 5 }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        paddingRight: 0,
                        paddingVertical: 4,
                        paddingLeft: 10,
                        width: "100%",
                      }}
                    >
                      <Text style={styles.location}>
                        {showTimeAsClientWant(
                          this.state.eventDetails?.event_data
                            ?.event_start_timestamp
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.rowLeft]}>
                  <Text style={styles.inputLable}>Event End:</Text>
                </View>
                <View style={[styles.rowRight]}>
                  <View style={{ width: "55%" }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        paddingRight: 0,
                        paddingVertical: 4,
                        paddingLeft: 10,
                        width: "100%",
                      }}
                    >
                      <Text style={styles.location}>
                        {showDayAsClientWant(
                          this.state.eventDetails?.event_data
                            ?.event_end_timestamp
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.divider}></View>
                  <View style={{ width: "45%" }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        paddingRight: 0,
                        paddingVertical: 4,
                        paddingLeft: 10,
                        width: "100%",
                      }}
                    >
                      <Text style={styles.location}>
                        {showTimeAsClientWant(
                          this.state.eventDetails?.event_data
                            ?.event_end_timestamp
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.rowLeft]}>
                  <Text style={styles.inputLable}>Setup:</Text>
                </View>
                <View style={[styles.rowRight]}>
                  <View style={{ width: "55%" }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        paddingRight: 0,
                        paddingVertical: 4,
                        paddingLeft: 10,
                        width: "100%",
                      }}
                    >
                      <Text style={styles.location}>
                        {showDayAsClientWant(
                          this.state.eventDetails?.event_data?.setup_timestamp
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.divider}></View>
                  <View style={{ width: "45%" }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        paddingRight: 0,
                        paddingVertical: 4,
                        paddingLeft: 10,
                        width: "100%",
                      }}
                    >
                      <Text style={styles.location}>
                        {showTimeAsClientWant(
                          this.state.eventDetails?.event_data?.setup_timestamp
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.inputLable}>Playtime:</Text>
                </View>
                <View style={styles.rowRight}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      paddingRight: 0,
                      paddingVertical: 4,
                      paddingLeft: 10,
                      width: "100%",
                    }}
                  >
                    <Text style={styles.location}>
                      {this.state.eventDetails?.event_data?.play_time}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.inputLable}># of Guests:</Text>
                </View>
                <View style={styles.rowRight}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      paddingRight: 0,
                      paddingVertical: 4,
                      paddingLeft: 10,
                      width: "100%",
                    }}
                  >
                    <Text style={styles.location}>
                      {this.state.eventDetails?.event_data?.num_of_guest}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.rowTop}>
                <View style={styles.rowLeft}>
                  <Text style={styles.inputLable}>Event Type:</Text>
                </View>
                <View style={styles.rowRight}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      paddingRight: 0,
                      paddingVertical: 4,
                      paddingLeft: 10,
                      width: "100%",
                    }}
                  >
                    <Text style={styles.location}>
                      {this.state.eventDetails?.event_data?.event_type_name}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={[styles.rowContainer, { marginBottom: 0 }]}>
              {/* <View style={{ marginBottom: 10 }}>
										<Text style={{ fontSize: 16 }}>Alt Details</Text>
									</View> */}

              {/* <View style={styles.row}>
                <View style={[styles.rowLeft]}>
                  <Text style={styles.inputLable}>Alt name:</Text>
                </View>
                <View style={styles.rowRight}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      paddingRight: 0,
                      paddingVertical: 10,
                      paddingLeft: 10,
                      width: "100%",
                    }}
                  >
                    <Text style={styles.location}>
                      {this.state.eventDetails?.alt_name}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.row}>
                <View style={[styles.rowLeft]}>
                  <Text style={styles.inputLable}>Alt mobile:</Text>
                </View>
                <View style={styles.rowRight}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      paddingRight: 0,
                      paddingVertical: 10,
                      paddingLeft: 10,
                      width: "100%",
                    }}
                  >
                    <Text style={styles.location}>
                      {this.state.eventDetails?.alt_mobile}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View> */}
              {this.state.eventDetails?.special_instructions.length > 0 ? (
                <View
                  style={{
                    marginTop: 0,
                    flexDirection: "row",
                    // borderTopWidth: 0.1,
                    // borderTopColor: "#cfcfcf",
                    alignItems: "center",
                  }}
                >
                  <View style={[styles.rowLeft]}>
                    <Text style={[styles.inputLable, { marginBottom: 0 }]}>
                      Special instructions:
                    </Text>
                  </View>
                  <View style={[styles.rowRight]}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        paddingRight: 0,
                        paddingVertical: 10,
                        paddingLeft: 10,
                        width: "100%",
                      }}
                    >
                      <Text style={styles.location}>
                        {this.state.eventDetails?.special_instructions}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.row, { alignItems: "center" }]}>
                <View style={styles.rowLeft}>
                  <Text style={styles.inputLable}>Venue:</Text>
                </View>
                <View style={styles.rowRight}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      paddingRight: 0,
                      paddingVertical: 4,
                      paddingLeft: 10,
                      width: "100%",
                    }}
                  >
                    <Text style={styles.location}>
                      {this.state.eventDetails?.event_data?.venue}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* <View style={styles.row}>
										<View style={styles.rowLeft}>
											<Text style={styles.inputLable}>Address:</Text>
										</View>
										<View style={styles.rowRight}>
											<TouchableOpacity
												activeOpacity={1}
												style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
												<Text style={styles.location}>{this.state.eventDetails?.event_data?.address}</Text>
											</TouchableOpacity>
										</View>
									</View> */}

              <View
                style={[
                  styles.rowTop,
                  { alignItems: "center", height: "auto" },
                ]}
              >
                <View style={styles.rowLeft}>
                  <Text style={styles.inputLable}>Google Location:</Text>
                </View>
                <View style={[styles.rowRight, { height: "auto" }]}>
                  <View
                    activeOpacity={1}
                    style={{
                      paddingRight: 0,
                      paddingVertical: 4,
                      paddingLeft: 10,
                      width: "100%",
                      height: "auto",
                    }}
                  >
                    <Text style={[styles.location, { height: "auto" }]}>
                      {this.state.eventDetails?.event_data?.google_location}
                    </Text>
                    <View style={{ flexDirection: "row", paddingVertical: 8 }}>
                      <View style={{ width: "75%" }}></View>
                      <PressableButton
                        btnTextStyle={{ fontSize: 13 }}
                        btnStyle={{
                          height: 30,
                          width: "25%",
                          alignItems: "center",
                        }}
                        text={
                          <Ionicons
                            name="ios-navigate-sharp"
                            size={15}
                            color={Colors.white}
                          />
                        }
                        onPress={() => this.handleGetDirections()}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* {this.state.orderDetails?.event_data?.google_location ? (
										null
									) : (
										<View style={styles.row}>
											<View style={styles.rowLeft}>
												<Text style={styles.inputLable}>Landmark:</Text>
											</View>
											<View style={styles.rowRight}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{this.state.eventDetails?.event_data?.landmark ?? 'N/A'}</Text>
												</TouchableOpacity>
											</View>
										</View>
									)} */}
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.rowTop, { alignItems: "center" }]}>
                <View style={styles.rowLeft}>
                  <Text style={styles.inputLable}>Order Manager:</Text>
                </View>
                <View style={styles.rowRight}>
                  <Dropdown
                    value={this.state.empl_name}
                    data={this.state.employee}
                    onChange={(empl) => {
                      this.setState({
                        empl_name: empl.name,
                        empl_id: empl.id,
                        empl_number: empl.phone,
                      });
                    }}
                    style={[styles.textInput]}
                    inputSearchStyle={styles.Dropdown_textInput}
                    placeholderStyle={styles.Dropdown_textInput}
                    selectedTextStyle={styles.Dropdown_textInput}
                    labelField="name"
                    valueField="id"
                    placeholder={
                      !this.state.empl_name
                        ? "Select Incharge"
                        : this.state.empl_name
                    }
                  />
                </View>
              </View>
            </View>

            {/* <View style={[styles.rowContainer]}>

									<View style={{ marginBottom: 10 }}>
										<Text style={{ fontSize: 16 }}>Games</Text>
									</View>

									{
										lineItems?.map(item => {
											return (
												<View key={item.game.id} style={[styles.listRow]}>
													<View style={{ flexDirection: 'row' }}>
														<View style={{ width: "20%", borderWidth: 1, borderColor: '#dfdfdf' }}>
															<ProgressiveImage
																source={{ uri: item.game.image_url }}
																style={{ height: 57, width: "100%" }}
																resizeMode="cover"
															/>
														</View>
														<View style={{ width: "50%", paddingLeft: 10, justifyContent: 'center' }}>

															<Text style={[styles.titleText]} numberOfLines={1} ellipsizeMode="tail">
																{item.game.name}
															</Text>
															<View style={{ flexDirection: 'row', }}>
																<Text style={{ color: Colors.black, opacity: 0.6 }}>{`${item.quantity > 1 ? item.quantity + " * " : ''}`}</Text>
																<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
																<Text style={{ color: Colors.black, opacity: 0.6 }}>{`${Math.floor(item.price)}`}</Text>
																<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
															</View>
														</View>
														<View style={{ width: '30%', flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 7 }}>
															<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
															<Text style={{ color: Colors.black, opacity: 0.6 }}>{item.total_amount}</Text>
															<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
														</View>
													</View>
												</View>
											)
										})
									}

								</View> */}

            {/* <View style={[styles.cardFooter, { flexDirection: "column" }]}>
									<View style={styles.pricingItemContainer}>
										<Text style={styles.pricingText}>Sub Total</Text>
										<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: 0.6 }}>{'₹'}</Text>
											<Text style={{ color: Colors.black, opacity: 0.6 }}>{this.state.eventDetails?.subtotal}</Text>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text>
										</View>
									</View>


									{
										this.state.transport_price > 0 ?
											null :
											<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
												<Text style={styles.pricingText}>Transport Charges</Text>
												<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
													<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: Colors.opacity6 }}>{'₹'}</Text>
													<Text style={{ color: Colors.black, opacity: Colors.opacity6 }}>{this.state.eventDetails?.transport}</Text>
													<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: Colors.opacity6 }}>{"00"}</Text>
												</View>
											</View>
									}


									{
										this.state.discount == 0 ?
											null :
											<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
												<Text style={styles.pricingText}>Discount</Text>
												<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
													<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: Colors.opacity6 }}>{'₹'}</Text>
													<Text style={{ color: Colors.black, opacity: Colors.opacity6 }}>{this.state.eventDetails?.discount}</Text>
													<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: Colors.opacity6 }}>{"00"}</Text>
												</View>
											</View>
									}

									<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
										<Text style={styles.pricingText}>GST 18%</Text>
										<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: Colors.opacity6 }}>{'₹'}</Text>
											<Text style={{ color: Colors.black, opacity: Colors.opacity6 }}>{this.state.eventDetails?.total_tax}</Text>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: Colors.opacity6 }}>{"00"}</Text>
										</View>
									</View>

									<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
										<Text style={[styles.pricingText, { fontWeight: "bold" }]}>
											Total Amount
										</Text>
										<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1.1 : 2.2, color: Colors.black, opacity: Colors.opacity6 }}>{'₹'}</Text>
											<Text style={{ color: Colors.black, opacity: Colors.opacity6 }}>{this.state.eventDetails?.grand_total}</Text>
											<Text style={{ fontSize: 9, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: Colors.opacity6 }}>{"00"}</Text>
										</View>
									</View>
								</View> */}
            {/* </ScrollView> */}
            {/* {this.context.userData.action_types.indexOf('Edit') >= 0 ?
							<OrderAndGenerateBill orderData={this.props.orderData} />
							:null}

							<View style={{ marginHorizontal: 15 ,marginBottom:10}}>
								{this.context.userData.action_types.indexOf('Edit') >= 0 ?
								<PressableButton text={'Update Games'} onPress={ () => {
									this.props.navigation.navigate('EditOrderedGames', {
										orderDetails: this.state.eventDetails
									})
								} } />
								:null }
							</View> */}
            <View
              style={{
                marginBottom: 10,
                flexDirection: "row",
                width: windowWidth,
                justifyContent: "space-around",
              }}
            >
              {this.context.userData.action_types.indexOf("Delete") >= 0 ? (
                <PressableButton
                  text={"Completed"}
                  onPress={this.CloseOrder}
                  btnStyle={{ width: "45%" }}
                />
              ) : null}
              {this.context.userData.action_types.indexOf("Edit") >= 0 ? (
                <PressableButton
                  text={"Save"}
                  onPress={this.saveOrderIncharge}
                  btnStyle={{ width: "45%" }}
                />
              ) : null}
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
              confirmButtonColor={Colors.primary}
              onCancelPressed={() => {
                this.hideAlert();
              }}
              onConfirmPressed={() => {
                this.hideAlert();
              }}
            />
          </ScrollView>
        )}
      </>
    );
  };
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    backgroundColor: "#f5f5f5",
  },

  rowContainer: {
    padding: 5,
    paddingHorizontal: 9,
    backgroundColor: Colors.white,
    // backgroundColor:colors.grey,
    borderRadius: 4,
    // elevation: 2,
    margin: 10,
    marginTop: 7,
    // shadowColor: Colors.grey,
    // shadowOffset: { width: 2, height: 4 },
    // shadowOpacity: 7,
    // shadowRadius: 7,
    // opacity:Colors.opacity6
  },
  rowContainerGames: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 4,
    elevation: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  row: {
    height: 52,
    padding: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 0,
    borderBottomWidth: 0.6,
    borderBottomColor: "#cfcfcf",
    alignItems: "center",

    marginVertical: 0,
    // marginTop: 0,
    // flexDirection: 'row',
    // marginBottom: 0,
    // borderBottomWidth: 1.5,
    // borderBottomColor: '#cfcfcf'
  },

  rowTop: {
    height: 52,
    padding: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 0,

    alignItems: "center",

    marginVertical: 0,
  },
  rowLeft: {
    width: "47%",
    backgroundColor: "#fff",
    paddingLeft: 0,
    paddingVertical: 10,
    justifyContent: "center",
    marginTop: 0,
    // paddingTop:1,
    // paddingBottom:1,
  },

  rowRight: {
    flexDirection: "row",
    width: "53%",
    marginLeft: 0,
    backgroundColor: "#fff",
    marginTop: 0,
    justifyContent: "space-evenly",
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  activeText: {
    fontWeight: "bold",
    color: "white",
  },
  inActiveText: {
    color: "silver",
    // opacity: Colors.opacity8,
  },
  form: {
    flex: 1,
    padding: 8,
  },
  topBtnContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 30,
  },
  topBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.textInputBorder,
    backgroundColor: Colors.textInputBg,
    marginRight: 15,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },

  inputLable: {
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 0,
    // opacity: Colors.opacity6,
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
  submitBtn: {
    marginTop: 15,
    height: 45,
    width: "100%",
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  desc: {
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 3,
    fontWeight: "normal",
    // opacity: Colors.opacity8,
  },

  listRow: {
    borderBottomColor: "#eee",
    borderBottomWidth: 0.6,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  cardFooter: {
    borderRadius: 4,
    marginLeft: 10,
    width: "94%",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    elevation: 10,
    marginBottom: 10,
  },

  pricingItemContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pricingText: {
    fontSize: 14,
    color: Colors.textColor,
  },

  location: {
    color: Colors.textColor,
    fontSize: 14,
    // opacity: Colors.opacity8,
  },
  divider: {
    width: "2%",
    borderLeftWidth: 0.3,
    alignSelf: "center",
    height: 20,
    borderLeftColor: "#444",
    // opacity: Colors.opacity4,
  },
  Dropdown_textInput: {
    color:Colors.black,
    fontSize: 14,
    opacity:1
  },
});
