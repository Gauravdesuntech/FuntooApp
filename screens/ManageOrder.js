import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import { Header } from "../components";
import VehicleDetails from "./manage-order/VehicleDetails";
import StaffAssignment from "./manage-order/StaffAssignment";
import Tracking from "./manage-order/Tracking";
import Accounting from "./manage-order/Accounting";
import Communications from "./manage-order/Communications";
import OrderDeliveryProofs from "./order/OrderDeliveryProofs";
import EventDetails from "./order/EventDetails";
import VendorVolunteers from "./order/VendorVolunteers";
import AppContext from "../context/AppContext";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import CustomerCommunications from "./manage-order/CustomerCommunications";
import EventExpenses from "./order/EventExpenses";
import OtherExpenses from "./order/OtherExpenses";
import Loader from "../components/Loader";
import { GetOrder } from "../services/OrderService";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import moment from "moment";
import {AntDesign,} from "@expo/vector-icons";

const renderImage = (data) => {
	// console.log("........data..........", data)
	const images = data.map((item) => {
		return (`
      <div style="display:flex;align-items:center;padding: 5px 5px; border-bottom: 1px solid gray;">
      <div style="width: 12%; text-align: left;">
          <img src="${item.game.image_url}" style="width: 130%; height: 85%;">
      </div>
      <div style="width: 37%; text-align: left;font-size: 28px;margin-left: 30px">${item.game.name}<br>${item.quantity} * ₹${Math.floor(item.price)}
      </div>
      <div style="width: 50%; text-align: left;font-size: 28px;">₹${Math.round(item.total_amount)}</div>
  </div>`
		);
	})
	return images;
}

const htmlRender = (item, gameData) => {
	let html = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Funtoo App Html</title>
      <style>
          @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
      </style>
  </head>
  
  <body style="background: whitesmoke;font-family: 'Roboto',sans-serif;">
      <main>
          <div style="background: white;padding: 10px;margin-bottom: 10px;">
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;">
                  <div style="text-align: left;width: 40%;font-size:28px">Event Start</div>
                  <div style="text-align: center;font-size:28px">  ${moment(item.event_data?.event_start_timestamp).format("Do MMM YY (ddd)")}</div>
                  <div style="text-align: center; border-left: 1px solid lightgray;padding-left: 10px;font-size:28px"> ${moment(item.event_data?.event_start_timestamp).format("hh:mm A")}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 40%;font-size:28px">Event End:</div>
                  <div style="text-align: center;font-size:28px"> ${moment(item.event_data?.event_end_timestamp).format("Do MMM YY (ddd)")}</div>
                  <div style="text-align: center; border-left: 1px solid lightgray;padding-left: 10px;font-size:28px">${moment(item.event_data?.event_end_timestamp).format("hh:mm A")}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 40%;font-size:28px">Setup:</div>
                  <div style="text-align: center;font-size:28px">${moment(item.event_data?.setup_timestamp).format("Do MMM YY (ddd)")}</div>
                  <div style="text-align: center; border-left: 1px solid lightgray;padding-left: 10px;font-size:28px">${moment(item.event_data?.setup_timestamp).format("hh:mm A")}</div>
              </div>
  
          </div>
  
          <div style="background: white;padding: 10px;margin-bottom: 10px;">
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Venue:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.event_data?.venue}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Which Floor is the setup?</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.event_data?.floor_name}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Google Location:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.event_data?.google_location}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Landmark:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.event_data?.landmark}</div>
              </div>
          </div>
  
          <div style="background: white;padding: 10px;margin-bottom: 10px;">
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 40%;font-size:28px">Special Instructions:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item?.special_instructions}</div>
              </div>
          </div>`
	if (gameData) {
		html += `   <div style="background: white;padding: 10px;margin-bottom: 10px;">
              <h4 style="font-size:28px;">Games</h4>
              ${renderImage(gameData)}
          </div>
          `
	}

  
    html +=   ` <div style="background: white;padding: 10px;margin-bottom: 10px;">
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 85%;font-size:28px">Sub Total:</div>
                  <div style="text-align: right;width: 65%;font-size:28px">₹${Math.round(item.subtotal)}</div>
              </div>`
	if (item.ref_data != null) {
		html += ` <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 85%;font-size:28px">Discount:</div>
                  <div style="text-align: right;width: 65%;font-size:28px">₹${parseInt(
			JSON.parse(item.ref_data).TotalDiscount
		)}</div>
              </div>`
	}

	html += ` <div
              style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
              <div style="text-align: left;width: 85%;font-size:28px">Transport Charges:</div>
              <div style="text-align: right;width: 65%;font-size:28px">₹${Math.round(item.transport)}</div>
          </div>`
	html += `
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 85%;font-size:28px">GST amount:</div>
                  <div style="text-align: right;width: 65%;font-size:28px">₹${Math.round(item.total_gst)}</div>
              </div>`

	if (item.ref_data != null && JSON.parse(item.ref_data).charge != null) {
		html += ` 
                        <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 85%;font-size:28px">Extra Charge:</div>
                  <div style="text-align: right;width: 65%;font-size:28px">₹${JSON.parse(item.ref_data).charge}</div>
              </div>
                        `}
	if (item.ref_data != null && JSON.parse(item.ref_data).comment != null) {
		html += ` 
                        <div
                        style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                        <div style="text-align: left;width: 85%;font-size:28px">Comment:</div>
                        <div style="text-align: right;width: 65%;font-size:28px">${JSON.parse(item.ref_data).comment}</div>
                    </div>
                        `}

	if (item.payment != null) {
		html += `<div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 85%;font-size:28px">Payment Method:</div>
                  <div style="text-align: right;width: 65%;font-size:28px">${item.payment}</div>
              </div>`}

	if (item.ref_data != null && JSON.parse(item.ref_data).showGST) {
		html += ` <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 85%;font-weight: 700;font-size:28px">Net Amount</div>
                  <div style="text-align: right;width: 65%;font-weight: 700;font-size:28px ">₹${parseInt(JSON.parse(item.ref_data).TotalSubtotal) + parseInt(item.total_gst) + parseInt(JSON.parse(item.ref_data)
			.TotalTransportCharge) + parseInt(JSON.parse(item.ref_data).charge)}</div>
              </div>
          </div>`
	} else {
		html += `<div
              style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
              <div style="text-align: left;width: 85%;font-weight: 700;font-size:28px">Net Amount</div>
              <div style="text-align: right;width: 65%;font-weight: 700;font-size:28px ">₹${Math.round(parseInt(item.subtotal) + parseInt(item.total_gst) + parseInt(item.transport))}</div>
          </div>
      </div>`
	}

	if (item.gst_available) {
		html += `
		<div style="background: white;padding: 10px;margin-bottom: 10px;">
            <div
            style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
            <div style="text-align: left;width: 50%;font-size:28px">Company Name:</div>
            <div style="text-align: left;width: 50%;font-size:28px">${item.company_name}</div>
        </div>
            <div
            style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
            <div style="text-align: left;width: 50%;font-size:28px">GST:</div>
            <div style="text-align: left;width: 50%;font-size:28px">${item.gst_number}</div>
        </div>
            `
	}
	else {
		html += `
            <div
            style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
            <div style="text-align: left;width: 50%;font-size:28px">Billing Name:</div>
            <div style="text-align: left;width: 50%;font-size:28px">${item.billing_name}</div>
        </div>
            `
	}
	html += `
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Distance:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.distance}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Contact number:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.contact_number}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Email:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.email}</div>
              </div>
          </div>

	  </main>
  </body>
  
  </html>`;

	const export_data = async () => {
		const { uri } = await Print.printToFileAsync({
			html,
		});
		await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
	};

	return (
		<TouchableOpacity
			activeOpacity={0.5}
			onPress={export_data}
			style={{ padding: 5 }}
		>
			<AntDesign name="export" size={22} color={Colors.white} />
		</TouchableOpacity>
	);
};

export default class ManageOrder extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      activeTabIndex: this.props.route.params.activeTabIndex
        ? this.props.route.params.activeTabIndex
        : 0,
      data: this.props.route.params.orderItem,
      orderDetails: [],
      isLoading: false
    };
  }

  setTabIndex = (index) => this.setState({ activeTabIndex: index });
  gotoCommunications = (value) => {
    // console.log("........gotoCommunications......called..........");
    // this.props.navigation.navigate('Communications',{orderData:this.props.route.params.orderItem})
    this.setState({ activeTabIndex: 6 });
  };
  gotoEvent = (value) => {
    // console.log(".........gotoEvent.....called..........");
    this.setState({ activeTabIndex: 7 });
  };
  gotoParts = (value) => {
    // console.log("........gotoParts......called..........");
    this.setState({ activeTabIndex: 8 });
  };

  componentDidMount = () => {
    this.focusListner = this.props.navigation.addListener("focus", () => {
      this.setState({ isModalOpen: false });
      this.fetchData()
      // console.log('..........this.props.route.params.orderItem.........', this.props.route.params.orderItem);
    });
  };
  fetchData = () => {
    this.setState({
      isLoading: true,
    });
    GetOrder({ id: this.props.route.params.orderItem.id })
      .then((result) => {
        this.setState({
          orderDetails: result.data,
        })
      })
      .catch((err) => console.log(err))
      .finally(() => {
        this.setState({
          isLoading: false,
        });
      });
  };
  componentWillUnmount() {
    this.focusListner();
  }

  renderTabComponent = () => {
    let { activeTabIndex } = this.state;
    // console.log('.........activeTabIndex...............',activeTabIndex)
    let component;
    switch (activeTabIndex) {
      case 0:
        component = (
          <EventDetails
            orderData={this.props.route.params.orderItem}
            navigation={this.props.navigation}
            currentTab={this.state.activeTabIndex}
          />
        );
        break;
      case 1:
        component = (
          <StaffAssignment
            orderData={this.props.route.params.orderItem}
            navigation={this.props.navigation}
          />
        );
        break;
      case 2:
        component = (
          <VendorVolunteers
            orderData={this.props.route.params.orderItem}
            navigation={this.props.navigation}
          />
        );
        break;
      case 3:
        component = (
          <VehicleDetails
            orderData={this.props.route.params.orderItem}
            navigation={this.props.navigation}
          />
        );
        break;

      case 4:
        component = (
          <Accounting
            orderData={this.props.route.params.orderItem}
            navigation={this.props.navigation}
          />
        );
        break;
        case 5:
          component = (
            <CustomerCommunications
              orderData={this.props.route.params.orderItem}
              navigation={this.props.navigation}
            />
          );
          break;
       
        case 6:
          component = (
            <OrderDeliveryProofs
              orderData={this.props.route.params.orderItem}
              navigation={this.props.navigation}
            />
          );
          break;
      case 7:
        component = <OtherExpenses
          orderData={this.props.route.params.orderItem}
          navigation={this.props.navigation}
        />
        break;
      case 8:
        component = <EventExpenses
          orderData={this.props.route.params.orderItem}
          navigation={this.props.navigation}
        />
        break;
    
    }

    return component;
  };

  render = () => {
    if (this.context.userData.order_details_permission != null) {
      var permissionData =
        this.context.userData?.order_details_permission?.split(",");
    }
    // let alldata = Configs.MANAGE_ORDER_TABS.filter((element) =>
    // 		(permissionData || []).includes(
    // 		  element.id
    // 		)
    // 	  )
    // 	console.log("...........context.userData..............",permissionData);
    // console.log("...........context.userData..alldata............",alldata);

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.container]}>
          <Header
            title="Order Details"
            // Communications="Communications"
            // gotoCommunications={this.gotoCommunications}
            // Event="Event"
            // gotoEvent={this.gotoEvent}
            // Parts="Parts"
            // gotoParts={this.gotoParts}
            search={false}
            showHome={false}
            exportGamedata={this.state.orderDetails.line_items}
					exportData={htmlRender}
					exportItems={this.state.orderDetails}
          />

<View style={{height:windowHeight/1.125}}>
          {this.state.isLoading ?
            <Loader />
            :
            <>
              {this.renderTabComponent()}
            </>
          }
</View>
          
          <View style={[styles.tabContainer]}>
            {this.context.userData.order_details_permission.length > 0 ? (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {Configs.MANAGE_ORDER_TABS.filter((element) =>
                  (permissionData || []).includes(element.id)
                ).map((value, index) => (
                  <TouchableOpacity
                    key={index.toString()}
                    activeOpacity={
                      this.state.activeTabIndex === index ? 1 : 0.2
                    }
                    onPress={
                      this.state.activeTabIndex === index
                        ? undefined
                        : this.setTabIndex.bind(this, index)
                    }
                    style={[
                      styles.tab,
                      this.state.activeTabIndex === index
                        ? styles.activeTab
                        : null,
                    ]}
                  >
                    {/* <Text
										style={
											this.state.activeTabIndex === index
												? styles.activeText
												: styles.inActiveText
										}
									>
										{value.name}
									</Text> */}
                    {value.iconTag == "FontAwesome" ? (
                      <FontAwesome
                        name={value.icon_name}
                        size={20}
                        color={
                          this.state.activeTabIndex === index
                            ? Colors.primary
                            : Colors.grey
                        }
                      />
                    ) : (
                      <>
                        {value.iconTag == "Ionicons" ? (
                          <Ionicons
                            name={value.icon_name}
                            size={20}
                            color={
                              this.state.activeTabIndex === index
                                ? Colors.primary
                                : Colors.grey
                            }
                          />
                        ) : (
                          <>
                            {value.iconTag == "MaterialCommunityIcons" ? (
                              <MaterialCommunityIcons
                                name={value.icon_name}
                                size={32}
                                color={
                                  this.state.activeTabIndex === index
                                    ? Colors.primary
                                    : Colors.grey
                                }
                              />
                            ) : (
                              <MaterialIcons
                                name={value.icon_name}
                                size={20}
                                color={
                                  this.state.activeTabIndex === index
                                    ? Colors.primary
                                    : Colors.grey
                                }
                              />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    );
  };
}

const tabHeight = 50;
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  tabContainer: {
    marginBottom: 5,
    width: "100%",
    height: tabHeight,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#d1d1d1",
    // borderTopWidth: 1,
    // borderTopColor: "#d1d1d1",
    backgroundColor: Colors.white,
    justifyContent: "center",
    // elevation: 1,
  },
  tab: {
    minWidth: 95,
    // minWidth: 120,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    height: tabHeight,
    backgroundColor: Colors.white,
  },
  underlineStyle: {
    backgroundColor: Colors.primary,
    height: 3,
  },
  activeTab: {
    height: tabHeight - 2,
    borderTopWidth: 2,
    borderTopColor: Colors.primary,
  },
  activeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.white,
  },
  inActiveText: {
    fontSize: 14,
    color: Colors.white,
    // opacity: 0.8,
  },

  form: {
    flex: 1,
    padding: 8,
  },

  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputLable: {
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 10,
    // opacity: 0.8,
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

  callBtn: {
    position: "absolute",
    padding: 8,
    bottom: 5,
    right: 0,
  },

  submitBtn: {
    marginTop: 15,
    marginBottom: 15,
    height: 45,
    width: "100%",
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  //Model

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalBody: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    width: windowWidth - 30,
    minHeight: Math.floor(windowHeight / 4),
    padding: 15,
    borderRadius: 5,
    elevation: 8,
  },

  closeButton: {
    position: "absolute",
    zIndex: 11,
    top: 5,
    right: 5,
    backgroundColor: "#ddd",
    width: 25,
    height: 25,
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 0,
  },
  closeButtonText: {
    color: Colors.textColor,
    fontSize: 22,
  },
});
