import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Colors from "../../config/colors";
import OverlayLoader from "../../components/OverlayLoader";
import { GetOrderPoofDetails } from "../../services/OrderService";
import OrderLoadingPartList from "../../components/Orders/OrderLoadingPartList";
import OrderGamesPhotoProof from "../../components/Orders/OrderGamesPhotoProof";
import OrderVolunteerProof from "../../components/Orders/OrderVolunteerProof";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import OrderCommonParts from "../../components/Orders/OrderCommonParts";
import emitter from "../../helper/CommonEmitter";
import AppContext from "../../context/AppContext";
import CachedImage from "expo-cached-image";
import { update_track_log } from "../../services/APIServices";
// import OrderVendorVolunteersAdd from "./OrderVendorVolunteersAdd";

export default class OrderDeliveryProofs extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this._emitter = emitter;

    this.state = {
      orderData: props.orderData,
      isLoading: false,
      proofDetails: [],
      LoadingDone: "false",
    };
  }

  componentDidMount() {
    this.getOrderProofDetails();
    this._emitter.on(
      "LoadingPartsUpdatedFromCommonParts",
      this.loadDataOnLoadingPartsChanged.bind(this)
    );
  }

  componentWillUnmount() {
    this._emitter.removeListener(
      "LoadingPartsUpdatedFromCommonParts",
      this.loadDataOnLoadingPartsChanged.bind(this)
    );
  }

  componentDidUpdate() {
    if (Object.keys(this._emitter._events).length == 0) {
      this._emitter.on(
        "LoadingPartsUpdatedFromCommonParts",
        this.loadDataOnLoadingPartsChanged.bind(this)
      );
    }
  }

  getOrderProofDetails = () => {
    this.setState({ isLoading: true });
    GetOrderPoofDetails({ order_id: this.props.orderData.id })
      .then((result) => {
        console.log(
          "...................ttTTtt......................",
          this.props.orderData.id
        );
        console.log(" result.data...........", result.data);
        if (result.is_success) {
          this.setState({
            proofDetails: result.data,
            isLoading: false,
          });
          this.setState({ LoadingDone: "false" });
          result.data.map((data) => {
            if (
              data.is_game_setup_photo_proof_done == 1 &&
              data.is_loading_parts_proof_done == 1 &&
              data.is_volunteer_proof_done == 1
            ) {
              this.setState({ LoadingDone: "true" });

              console.log(".............called...............");
              let value = {
                order_id: this.props.orderData.id,
                reviewer_id: this.context.userData.cust_code,
                reviewer_name: this.context.userData.name,
                type: this.context.userData.type,
                track_comment: "Loading Complete",
              };
              update_track_log(value)
                .then((res) => {
                  console.log("..........res..........", res);
                  this.setState({ isLoading: false })
                })
                .catch((err) => {this.setState({ isLoading: false })});
            } else {
              console.log(".......else......called...............");
            }
          });
        }
      })
      .catch((err) => this.setState({ isLoading: false }))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  loadDataOnLoadingPartsChanged = () => {
    this.getOrderProofDetails();
  };

  render() {
    return (
      <>
        {/* {(this.state.isLoading == true) ? ( */}
        <OverlayLoader visible={this.state.isLoading} />
        {/* ) : ( */}
        <View style={styles.container}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "50%" }}>
              {/* <Text style={[styles.tableRow, { fontSize: 11 }]}>Item Name: </Text> */}
            </View>
            {this.context.userData.action_types.indexOf("Add") >= 0 ||
            this.context.userData.action_types.indexOf("Edit") >= 0 ? (
              <>
                <View style={{ width: "16%" }}>
                  <FontAwesome5
                    name="truck"
                    size={14}
                    style={[styles.tableRow, { alignSelf: "center" }]}
                    color="#dfdfdf"
                  />
                  {/* <Text style={[styles.tableRow, { fontSize: 11, alignSelf: 'center' }]}>LOD</Text> */}
                </View>
                <View style={{ width: "18%" }}>
                  <FontAwesome
                    name="photo"
                    size={14}
                    style={[styles.tableRow, { alignSelf: "center" }]}
                    color="#dfdfdf"
                  />
                  {/* <Text style={[styles.tableRow, { fontSize: 11, alignSelf: 'center' }]}>PHOTO</Text> */}
                </View>
                <View style={{ width: "16%" }}>
                  <FontAwesome
                    name="user-circle-o"
                    size={14}
                    style={[styles.tableRow, { alignSelf: "center" }]}
                    color="#dfdfdf"
                  />
                  {/* <Text style={[styles.tableRow, { fontSize: 11, alignSelf: 'center' }]}>VOL</Text> */}
                </View>
              </>
            ) : null}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {this.state.proofDetails.length > 0
              ? this.state.proofDetails?.map((item) => {
                  // console.log(".........item.game_image_url............",item.game_image_url)
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 5,
                        marginHorizontal: 2,
                        paddingVertical: 5,
                        borderRadius: 5,
                        backgroundColor: Colors.white,
                      }}
                      key={item.name}
                    >
                      <View style={{ width: "50%" }}>
                        <View
                          style={{
                            flexDirection: "row",
                            marginTop: 5,
                            marginBottom: 5,
                            paddingHorizontal: 5,
                          }}
                        >
                          <View style={{ width: "65%", flexDirection: "row" }}>
                            {Platform.OS == "ios" ? (
                              <Image
                                style={{
                                  height: 57,
                                  width: 65,
                                  alignSelf: "flex-start",
                                  borderWidth: 0.5,
                                  borderColor: "#dfdfdf",
                                }}
                                source={{
                                  uri: item.game_image_url,
                                }}
                                resizeMode={"contain"}
                              />
                            ) : (
                              <CachedImage
                                style={{
                                  height: 57,
                                  width: 65,
                                  alignSelf: "flex-start",
                                  borderWidth: 0.5,
                                  borderColor: "#dfdfdf",
                                }}
                                source={{ uri: item.game_image_url }}
                                resizeMode="cover"
                                cacheKey={`${item.game_image}+${item.name}`}
                                placeholderContent={
                                  <ActivityIndicator
                                    color={Colors.primary}
                                    size="small"
                                    style={{
                                      flex: 1,
                                      justifyContent: "center",
                                    }}
                                  />
                                }
                              />
                            )}
                            <View
                              style={{ paddingLeft: 10, alignSelf: "center" }}
                            >
                              <Text style={{ color: Colors.textColor }}>
                                {item.name}
                              </Text>
                              <Text style={{ color: Colors.textColor }}>{`${
                                item.quantity > 1 ? "Qty: " + item.quantity : ""
                              } `}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      {this.context.userData.action_types.indexOf("Add") >= 0 ||
                      this.context.userData.action_types.indexOf("Edit") >=
                        0 ? (
                        <>
                          <View
                            style={{
                              width: "16%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <OrderLoadingPartList
                              item={item}
                              orderData={this.props.orderData}
                            />
                          </View>

                          <View
                            style={{
                              width: "18%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <OrderGamesPhotoProof
                              item={item}
                              orderData={this.props.orderData}
                            />
                          </View>

                          <View
                            style={{
                              width: "16%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <OrderVolunteerProof
                              item={item}
                              orderData={this.props.orderData}
                            />
                          </View>
                        </>
                      ) : null}
                    </View>
                  );
                })
              : null}
            <OrderCommonParts orderData={this.props.orderData} />
            {/* 
            <OrderVendorVolunteersAdd orderData={this.props.result} /> */}
          </ScrollView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  tableRow: {
    // backgroundColor: Colors.lightGrey,
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginRight: 5,
    color: Colors.textColor,
  },
  tableRow2: {
    // backgroundColor: Colors.lightGrey,
    marginRight: 5,
    color: Colors.textColor,
    width: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
});
