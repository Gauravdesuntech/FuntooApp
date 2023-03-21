import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SectionList,
  Linking
} from "react-native";
import Carousel, { PaginationLight } from "react-native-x2-carousel";
import Colors from "../config/colors";
import Header from "../components/Header";
import Configs from "../config/Configs";
import {
  getNewArrivalsDetails,
  getSlider,
  getFileSetting,
} from "../services/APIServices";
import AppContext from "../context/AppContext";
import Loader from "../components/Loader";
import CustomImage from "../components/CustomImage";
import { GetCategorys } from "../services/CategoryService";
import CarouselItem from "react-native-snap-carousel";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SliderBox } from "react-native-image-slider-box";
import { updateTokenData } from "../services/CustomerApiService";
import { getDeviceToken, writeUserData, readUserData } from "../utils/Util";
import {
  get_unread_message,
  get_individual_unread_message,
} from "../services/ChatService";
import CachedImage from "expo-cached-image";
import EmptyScreen from "../components/EmptyScreen";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import moment from "moment";
import AwesomeAlert from "react-native-awesome-alerts";
import { GetOrders, ChangeOrderStatus } from "../services/OrderService";
import OverlayLoader from "../components/OverlayLoader";
import { SendOrderBillingInfoUpdatePush } from "../services/APIServices";
import { showDateAsClientWant, showTimeAsClientWant } from "../utils/Util";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(18);
const itemHorizontalMargin = wp(0.5);

export const sliderWidth = viewportWidth - 20;
export const itemWidth = slideWidth + itemHorizontalMargin * 1;

export default class Home extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      gameData: [],
      isLoading: false,
      cust_id: null,
      slider: [],
      categoryList: [],
      carouselAllImg: [],
      loading: [],
      currentTab: "Enquiry",
      // currentTab: "",
      // subTab: "Live Enquiry",
      subTab: "",
      limit: 3,
      /*
       *
       *manage enquiry
       *created by - Rahul Saha
       *created on - 07.12.22
       *
       */

      enquiryData: [],
      refreshing: false,
      status: "default",
      reason_of_cancel: "",
      id: "",
      isModalOpen: false,
      modal_type: "edt",

      showAlertModal: false,
      alertMessage: "",
      alertType: "",

      isFilterModalOpen: false,

      /*
       *
       *manage order
       *created by - Rahul Saha
       *created on - 07.12.22
       *
       */

      orderData: [],
      isLoading: false,
      refreshing: false,
      showEnquiry: false,
      showOrder: false,
      event_expenses: null,
    };
  }

  componentDidMount = () => {
    // if (this.context.tokenData.length == 0) {
    //   this.tokenData();
    // }
    // console.log(this.context?.userData?.menu_permission.length)
    this.setState({ status: "default", })
    if (this.context?.userData?.menu_permission.length > 0) {

      {
        Configs.Home_TAB.filter((element) =>
          (this.context.userData.menu_permission || []).includes(element.id)
        ).map((data) => {
          // return
          if (data.id == "Orders") {
            this.setState({
              currentTab: "Order",
              subTab: "Live Order",
              showOrder: true,
              status: "default"
            })
          } else if (data.id == "ManageEnquiry") {
            this.setState({
              currentTab: "Enquiry",
              subTab: "Live Enquiry",
              showEnquiry: true,
              status: "default"
            })
          }
        })
      }
    } else {
      this.setState({
        currentTab: "Enquiry",
        subTab: "Live Enquiry",
        showEnquiry: true,
        showOrder: true
      })
    }
    this.loadEnquiryDetails();
    this.loadOrderDetails();
    this.focusListner = this.props.navigation.addListener("focus", () => {


      this.loadData();
      this.loadEnquiryDetails();
      this.loadOrderDetails();
      getFileSetting()
        .then((res) => {
          // console.log('...........res/......ManageEnquiry.......',JSON.parse(res[0].value))
          this.context.setFileSetting(JSON.parse(res[0].value));
        })
        .catch((err) => { });
    });
  };

  // tokenData = () => {
  //   readUserData().then((data) => {
  //   	if (data !== null) {
  //   getDeviceToken()
  //     .then((token) => {
  //       // let persistObj = null;
  //       if (token.data !== null) {
  //       	data.device_token=token.data;
  //       	writeUserData(data);
  //         this.context.setTokenData(token.data);
  //         // console.log("..........persistObj.......home.....",data)
  //       }
  //       let obj = {
  //         cust_code: this.context.userData.cust_code,
  //         device_token: token.data,
  //       };
  //       if (this.context.tokenData != token.data) {
  //         updateTokenData(obj).then((response) => {
  //           console.log("******updateTokenData******", response);
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("..........token catch.........", err);
  //     });
  //   }})
  // };

  componentWillUnmount() {
    this.focusListner();
  }

  loadData = () => {
    // console.log("............this.context.fileSetting.............",this.context.fileSetting);
    this.loadAll();
    let data = {
      receiver_id: this.context.userData.cust_code,
    };
    get_unread_message(data).then((res) => {
      this.context.setTotalUnreadChatQuantity(res.count);
    });
  };

  loadAll = () => {
    this.setState({ isLoading: true });
    Promise.all([getNewArrivalsDetails(), getSlider(), GetCategorys()])
      .then((response) => {
        this.setState({
          gameData: response[0].data,
          slider: response[1].data,
          categoryList: response[2].data,
        });

        let ImgData = response[1].data.map((item) => {
          return {
            id: item.id,
            image: Configs.SLIDER_URL + item.image,
          };
        });
        this.setState({
          carouselAllImg: ImgData,
        });
        //   let catalogImgData = [];
        // for (i = 0; i < response[2].data.length; i++) {
        //   console.log(
        //     "images...................",
        //     Configs.SLIDER_URL + response[2].data[i].image
        //   );
        //   catalogImgData.push(Configs.SLIDER_URL + response[2].data[i].image);
        // }
        // this.setState({
        // 	categoryList: catalogImgData,
        // });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  gotoGameDetails = (item) => {
    this.props.navigation.navigate("GameDetails", {
      game_id: item.id,
      cust_code: this.context.userData.cust_code,
      cust_id: this.state.cust_id,
    });
  };

  renderCarouselItem = (item) => {
    let image_url = Configs.SLIDER_URL + item.image;
    // console.log("image_url", image_url);
    return (
      <SafeAreaView
        key={item.id.toString()}
        style={{
          width: windowwidth,
          height: 300,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CachedImage
          style={{ height: "100%", width: "100%" }}
          source={{ uri: image_url }}
          resizeMode="contain"
          cacheKey={`${item.id}+${item.name}`}
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
      </SafeAreaView>
    );
  };

  renderSliderlItem = (item) => {
    let image_url = Configs.CATEGORY_IMAGE_URL + item.item.image;

    return (
      <View key={item.item.id.toString()} style={styles.latestCollections}>
        <>
          <TouchableOpacity
            key={item.item.id.toString()}
            style={[
              styles.galleryGrid,
              {
                width: 70,
                height: 70,
                overflow: "hidden",
              },
            ]}
            onPress={this.gotoSubCategory.bind(this, item.item)}
          >
            <Image
              style={[
                styles.latestCollectionItemImg,
                { width: 50, height: 50, borderColor: "#dfdfdf" },
              ]}
              source={{ uri: image_url }}
              resizeMode="contain"
              // onLoadEnd={() => {
              //   let t = this.state.loading;
              //   t[image_url] = true;
              //   this.setState({ loading: t });
              // }}
              cacheKey={`${item.item.id}+${item.item.name}`}
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
            <Text style={{ fontSize: 10, color: Colors.textColor }}>
              {item.item.name}
            </Text>
          </TouchableOpacity>
          {!this.state.loading && (
            <ActivityIndicator
              size="small"
              color={Colors.primary}
              style={[
                styles.latestCollectionItemImg,
                { width: 50, height: 50, borderColor: "#dfdfdf" },
              ]}
            />
          )}
        </>
      </View>
    );
  };

  gotoSubCategory = (item) => {
    if (item.is_tag_open == 1) {
      this.props.navigation.navigate("Tag", {
        category_id: item.id,
        tagList: item.tags,
      });
    } else {
      this.props.navigation.navigate("SubCategory", {
        category_id: item.id,
        name: item.name,
      });
    }
  };

  goToTag = (item) =>
    this.props.navigation.navigate("Tag", {
      category_id: item.id,
      tagList: item.tags,
    });

  handleOnPressCategoryList = (item) => {
    if (item.after_click_open == "tags") {
      this.goToTag(item);
    } else {
      this.gotoSubCategory(item);
    }
  };
  // listItem = (data) => {
  //   // console.log('................data.........',data.item)
  //   return (
  //     <View style={styles.listItem}>
  //       <TouchableOpacity
  //         style={{ display: "flex", flexDirection: "row" }}
  //         onPress={() => this.props.navigation.navigate(data.item.component)}
  //       >
  //         <View style={styles.left}>
  //           {data.item.iconTag == "fontAwesome" ? (
  //             <FontAwesome
  //               name={data.item.iconName}
  //               size={26}
  //               color={Colors.black}
  //             />
  //           ) : (
  //             <>
  //               {data.iconTag == "ionicons" ? (
  //                 <Ionicons
  //                   name={data.item.iconName}
  //                   size={26}
  //                   color={Colors.black}
  //                 />
  //               ) : (
  //                 <MaterialCommunityIcons
  //                   name={data.item.iconName}
  //                   size={26}
  //                   color={Colors.black}
  //                 />
  //               )}
  //             </>
  //           )}
  //         </View>
  //         <View style={styles.middle}>
  //           <Text style={styles.name}>{data.item.name}</Text>
  //         </View>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  /*
   * manage enqiry
   * created by - Rahul Saha
   *created on - 07.12.22
   *
   */
  loadEnquiryDetails = () => {
    this.setState({ isLoading: true });
    let order_confirmed = 0;
    if (this.state.status == 'completed') {
      // GetOrders(this.state.status, order_confirmed, this.state.limit)
      GetOrders(this.state.status)
        .then((result) => {
          // console.log('.............result.........',result);
          if (result.is_success) {
            this.setState({
              enquiryData: result.data,
              refreshing: false,
            });
          }
        })
        .catch((err) => console.log(err))
        .finally(() => this.setState({ isLoading: false }));
    } else {
      // GetOrders(this.state.status, order_confirmed)
      GetOrders('open', order_confirmed)
        .then((result) => {
          if (result.is_success) {
            this.setState({
              enquiryData: result.data,
              refreshing: false,
            });
          }
        })
        .catch((err) => console.log(err))
        .finally(() => this.setState({ isLoading: false }));
    }
  };
  dialCall = (mobile) => {
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = `tel:${mobile}`;
    } else {
      phoneNumber = `telprompt:${mobile}`;
    }

    Linking.openURL(phoneNumber);
  };

  onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.loadEnquiryDetails();
      this.loadOrderDetails();
    });
  };

  renderEmptyContainer = () => {
    return (
      <View style={{ height: windowHeight }}>
        <EmptyScreen
          noBackground={true}
        />
      </View>
    );
  };

  getOrderStatus = (current_status) => {
    if (current_status == "pending") {
      return (
        <Text style={styles.desc}>
          Status: <Text style={{ color: "red" }}>Pending</Text>
        </Text>
      );
    }
    if (current_status == "review") {
      return (
        <Text style={styles.desc}>
          Status: <Text style={{ color: "red" }}>Review</Text>
        </Text>
      );
    }
    if (current_status == "request_confirmation") {
      return (
        <Text style={styles.desc}>
          Status: <Text style={{ color: "red" }}>Request Confirmation</Text>
        </Text>
      );
    }

    if (current_status == "confirmed") {
      return (
        <Text style={styles.desc}>
          Status: <Text style={{ color: "green" }}>Confirmed</Text>
        </Text>
      );
    }

    if (current_status == "declined") {
      return (
        <Text style={styles.desc}>
          Status: <Text style={{ color: "red" }}>Declined</Text>
        </Text>
      );
    }
    if (current_status == "closed") {
      return (
        <Text style={styles.desc}>
          Status: <Text style={{ color: "red" }}>Closed</Text>
        </Text>
      );
    }

    if (current_status == "ongoing") {
      return (
        <Text style={styles.desc}>
          Status: <Text>Ongoing</Text>
        </Text>
      );
    }

    if (current_status == "completed") {
      return (
        <Text style={styles.desc}>
          Status: <Text style={{ color: Colors.primary }}>Completed</Text>
        </Text>
      );
    }
  };

  getEventStartTime = (eventStartTimeStamp) => {
    let m = moment(eventStartTimeStamp);
    return m.format("h:mm A");
  };

  getEventEndTime = (eventEndTimeStamp) => {
    let m = moment(eventEndTimeStamp);
    return m.format("h:mm A");
  };

  renderItem = ({ item }) => {
    let EventDate = moment(item.event_start_timestamp).format('D-MM-YYYY')
    let setupDate = moment(item.setup_timestamp).format('D-MM-YYYY')
    // console.log('..........renderItem................',item.event_expenses);
    return (
      <View style={styles.card}>
        <View>
          <TouchableOpacity
            key={item.id.toString()}
            onPress={() => {
              this.props.navigation.navigate("EventEnquiryDetail", {
                data: item,
              })
              // console.log('..........renderItem................',item);
            }
            }
          >
            <Text style={styles.desc}>
              ENQ#: {item.order_id.toString().replace("O", "E")}
            </Text>
            {/* <Text style={styles.desc}>
              {"Event Date: "}
              {showDateAsClientWant(item.event_start_timestamp)}
            </Text> */}
            <Text style={styles.desc}>{"Venue: " + item.venue}</Text>
            {EventDate != setupDate ?
              <Text style={styles.desc}>
                Setup by: {showDateAsClientWant(item.setup_timestamp)}
              </Text>
              : null}
            <Text style={styles.desc}>
              Event Time: {this.getEventStartTime(item.event_start_timestamp)} -{" "}
              {this.getEventEndTime(item.event_end_timestamp)}
            </Text>

            <Text style={styles.desc}>
              {"Client Name: " +
                (item.customer_name !== null ? item.customer_name : "")}
            </Text>

            {this.getOrderStatus(item.order_status)}
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            bottom: 5,
            right: 5,
          }}
        >
          <TouchableOpacity
            style={{
              zIndex: 11,
              // top: 5,
              // right: 5,
              padding: 10,
              backgroundColor: Colors.primary,
              // position: 'absolute',
              marginRight: 5,
              borderRadius: 6,
            }}
            onPress={this.dialCall.bind(this, item.customer_mobile)}
          >
            <MaterialIcons
              name="call"
              style={{ color: Colors.white, fontSize: 19 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              zIndex: 11,
              // bottom: 5,
              // right: 5,
              padding: 10,
              backgroundColor: Colors.primary,
              // position: 'absolute',
              borderRadius: 6,
            }}
            onPress={() => {
              this.props.navigation.navigate("TrackOrder", {
                order_id: item.id,
              });
            }}
          >
            <Entypo
              name="flow-line"
              style={{ color: Colors.white, fontSize: 19 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /*
   * manage order
   * created by - Rahul Saha
   *created on - 07.12.22
   *
   */

  loadOrderDetails = () => {
    this.setState({ isLoading: true });
    let order_confirmed = 1;
    if (this.state.status == 'closed') {
      GetOrders(this.state.status, order_confirmed, this.state.limit)
        .then((result) => {
          if (result.is_success) {
            // console.log("....................................result.....................",result.data)
            this.setState({
              orderData: result.data,
            });
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this.setState({
            isLoading: false,
            refreshing: false,
          });
        });
    } else {
      GetOrders(this.state.status, order_confirmed)
        .then((result) => {
          if (result.is_success) {
            // console.log("....................................result.....................",result.data)
            this.setState({
              orderData: result.data,
            });
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this.setState({
            isLoading: false,
            refreshing: false,
          });
        });
    }
  };

  gotoManageOrder = (item) => {
    this.props.navigation.navigate("ManageOrder", { orderItem: item });
  };

  listItem = ({ item }) => {
    let EventDate = moment(item.event_start_timestamp).format('D-MM-YYYY')
    let setupDate = moment(item.setup_timestamp).format('D-MM-YYYY')
    console.log('.....item....', item)
    return (
      <TouchableOpacity
        key={item.id.toString()}
        activeOpacity={0.8}
        style={[styles.card, { flexDirection: "row" }]}
        onPress={() => {
          item.is_order_confirmed == 0 ? this.props.navigation.navigate("EventEnquiryDetail", {
            data: item,
          }) : this.gotoManageOrder(item)
        }}
      >
        <View style={{ width: "75%" }}>
          {item.is_order_confirmed == 1 ?
            <Text style={styles.desc}>{"Order#: " + item.order_id}</Text>
            :
            <Text style={styles.desc}>
              ENQ#: {item.order_id.toString().replace("O", "E")}
            </Text>
          }
          {/* <Text style={styles.desc}>
            {"Event Date: "} {showDateAsClientWant(item.event_start_timestamp)}
          </Text> */}
          <Text style={styles.desc}>{"Venue: " + item.venue}</Text>
          {EventDate != setupDate ?
            <Text style={styles.desc}>
              Setup by: {showTimeAsClientWant(item.setup_timestamp)}
            </Text>
            : null}
          <Text style={styles.desc}>
            Event Time: {showTimeAsClientWant(item.event_start_timestamp)} -{" "}
            {showTimeAsClientWant(item.event_end_timestamp)}
          </Text>
          <Text style={styles.desc}>
            {"Client Name: " +
              (item.customer_name !== null ? item.customer_name : "")}
          </Text>
          {item.order_incharge_name != null ?
            <Text style={styles.desc}>
              {"Order Incharge: " +
                (item.order_incharge_name)}
            </Text>
            : null}
          {item?.event_expenses?.event_expenses ?
            <Text style={styles.desc}>
              {"Event Expenses: ₹" +
                (item.event_expenses.event_expenses)}
            </Text>
            : null}
          {this.getOrderStatus(item.order_status)}
        </View>

        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            bottom: 5,
            right: 5,
          }}
        >
          {item.order_incharge_phone != null ?
            <TouchableOpacity
              style={{
                zIndex: 11,
                // top: 5,
                // right: 5,
                padding: 10,
                backgroundColor: Colors.primary,
                // position: 'absolute',
                marginRight: 5,
                borderRadius: 6,
              }}
              onPress={this.dialCall.bind(this, item.order_incharge_phone)}
            >
              <MaterialIcons
                name="call"
                style={{ color: Colors.white, fontSize: 19 }}
              />
            </TouchableOpacity>
            : null}
          <TouchableOpacity
            style={{
              zIndex: 11,
              // top: 5,
              // right: 5,
              padding: 10,
              backgroundColor: Colors.primary,
              // position: 'absolute',
              marginRight: 5,
              borderRadius: 6,
            }}
          >
            <MaterialIcons
              name="payment"
              style={{ color: Colors.white, fontSize: 19 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              zIndex: 11,
              // bottom: 5,
              // right: 5,
              padding: 10,
              backgroundColor: Colors.primary,
              // position: 'absolute',
              borderRadius: 6,
            }}
            onPress={() => {
              this.props.navigation.navigate("TrackOrder", {
                order_id: item.id,
              });
            }}
          >
            <Entypo
              name="flow-line"
              style={{ color: Colors.white, fontSize: 19 }}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };


  render = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Welcome"
          searchIcon={true}
          wishListIcon={true}
          cartIcon={true}
          navigation={this.props.navigation}
        />
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <>
            {/* <KeyboardAwareScrollView showsVerticalScrollIndicator={false}> */}
            {/* <View style={{ width: "100%", height: 295 }}>
                <Carousel
                  loop={true}
                  autoplay={true}
                  autoplayInterval={3000}
                  // pagination={PaginationLight}
                  renderItem={this.renderCarouselItem}
                  data={this.state.slider}

                /> */}

            {/* <SliderBox
                  images={this.state.carouselAllImg}
                  firstItem={1}
                  sliderBoxHeight={290}
                  goTo={null}
                  //   onCurrentImagePressed={(index) =>
                  //     console.warn(`image ${index} pressed`)
                  //   }
                  autoplay
                    circleLoop
                  resizeMethod={"resize"}
                  resizeMode={"cover"}
                  paginationBoxStyle={{
                    position: "absolute",
                    bottom: 0,
                    padding: 0,
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    paddingVertical: 10,
                  }}
                  ImageComponentStyle={{
                    borderRadius: 2,
                    width: "99%",
                    marginTop: 1,
                  }}
                  dotStyle={{
                    width: 0,
                    height: 0,
                  }}
                  imageLoadingColor={Colors.primary}
                /> */}
            {/* </View> */}

            {/* <View style={styles.carouselContainer}>
                <CarouselItem
                  data={this.state.categoryList}
                  renderItem={this.renderSliderlItem}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  autoplay={true}
                  loop={true}
                  loopClonesPerSide={this.state.categoryList.length}
                  activeSlideAlignment="start"
                  inactiveSlideOpacity={1}
                  inactiveSlideScale={1}
                  useScrollView={true}
                />
                {/* <SliderBox
                  images={this.state.categoryList}
                  firstItem={1}
                  sliderBoxHeight={80}
                //   onCurrentImagePressed={(index) =>
                //     console.warn(`image ${index} pressed`)
                //   }
                  autoplay
                  circleLoop
                  resizeMethod={"resize"}
                  resizeMode={"cover"}
                  paginationBoxStyle={{
                    position: "absolute",
                    bottom: 0,
                    padding: 0,
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    paddingVertical: 10,
                  }}
                  ImageComponentStyle={{
                    borderRadius: 2,
                    width: "99%",
                    marginTop: 1,
                  }}
				  dotStyle={{
					width: 0,
					height: 0,
				  }}
                  imageLoadingColor={Colors.primary}
                /> */}
            {/* </View> */}

            {/* <View style={styles.latestCollections}>
							<KeyboardAwareScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
								{this.state.categoryList.length > 0
									? this.state.categoryList.map((item, index) => {
										let image_url = Configs.CATEGORY_IMAGE_URL + item.image;
										return (
											<TouchableOpacity
												key={item.id.toString()}
												style={[styles.galleryGrid, { 
													width: Math.floor((windowwidth - 10) / 4),
													height: Math.floor((windowwidth - 10) / 4) 
												}  ]}
												onPress={ () => this.handleOnPressCategoryList(item) }
											>
												<Image 
													style={styles.latestCollectionItemImg}
													source={{ uri: image_url }}
													resizeMode="cover"
												/>
												<Text style={styles.text} numberOfLines={1}>{item.name}</Text>
											</TouchableOpacity>
										)
									})
									: null}
							</KeyboardAwareScrollView>
						</View> */}

            {/* <View style={{ marginTop: 0 }}>
                <View
                  style={{ flex: 1, justifyContent: "center", paddingLeft: 5 }}
                >
                  <View>
                    <Text
                      style={[
                        styles.title,
                        {
                          marginBottom: 0,
                          marginLeft: 0,
                          color: Colors.textColor,
                          fontWeight: "normal",
                          fontSize: 12,
                        },
                      ]}
                    >
                      {" "}
                      New Arrivals
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      backgroundColor: "white",
                      height: 2,
                      marginVertical: 3,
                    }}
                  ></View>
                </View>
                <View style={styles.galleryContainer}>
                  {this.state.gameData.length > 0 &&
                    this.state.gameData.map((item, index) => {
                      let image_url = Configs.NEW_COLLECTION_URL + item.image;
                      return (
                        <TouchableOpacity
                          key={item.id.toString()}
                          style={[
                            styles.galleryGrid,
                            {
                              marginHorizontal: Platform.OS == "ios" ? 2 : 3,
                              backgroundColor: "#fff",
                              height: Platform.OS == "ios" ? 110 : 95,
                              marginBottom: 5,
                              borderWidth: 0.6,
                              borderColor: "rgba(223,223,223,0.6)",
                              padding: 2,
                            },
                          ]}
                          onPress={this.gotoGameDetails.bind(this, item)}
                        >
                          {Platform.OS == "ios" ? (
                            <CachedImage
                              source={{ uri: image_url }}
                              style={styles.galleryImg}
                              resizeMode="contain"
                              cacheKey={`${item.image.split(".")[0]}+${item.name}`} 
                              placeholderContent={( 
                                <ActivityIndicator 
                                  color={Colors.primary}
                                  size="small"
                                  style={{
                                    flex: 1,
                                    justifyContent: "center",
                                  }}
                                />
                              )}
                            />
                          ) : (
                            <CachedImage
                              source={{ uri: image_url }}
                              style={styles.galleryImg}
                              resizeMode="contain"
                              cacheKey={`${item.image.split(".")[0]}+${item.name}`} 
                              placeholderContent={( 
                                <ActivityIndicator 
                                  color={Colors.primary}
                                  size="small"
                                  style={{
                                    flex: 1,
                                    justifyContent: "center",
                                  }}
                                />
                               )}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </View> */}
            <View>
              {/* <FlatList
          data={Configs.HOME_SCREEN_MENUES}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={this.listItem}
          initialNumToRender={Configs.HOME_SCREEN_MENUES?.length}
          ListEmptyComponent={ <EmptyScreen /> }
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh}
						/>
					}
				/> */}

              {/*
               *
               * enquiry and oredr tab for home
               *updated by - Rahul Saha
               *updated on - 14.01.23
               *
               *
               */}

              {/* <View style={[styles.tabContainer, { borderBottomWidth: 1 }]}>
                {this.state.showEnquiry == true ?
                  <>
                    {this.state.currentTab == "Enquiry" ? (
                      <View
                        style={[
                          styles.tab,
                          styles.activeTab,
                          {
                            flexDirection: "row",
                            alignItems: "center",
                            borderBottomColor: Colors.primary,
                            borderBottomWidth: 2,
                          },
                        ]}
                      >
                        <Text style={styles.activeText}>Enquiry</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          this.setState(
                            {
                              currentTab: "Enquiry",
                              subTab: "Live Enquiry",
                              status: "default",
                            },
                            () => this.loadEnquiryDetails()
                          )
                        }
                        style={styles.tab}
                      >
                        <Text style={styles.inActiveText}>Enquiry</Text>
                      </TouchableOpacity>
                    )}
                  </>
                  : null}
                {this.state.showOrder == true ?
                  <>
                    {this.state.currentTab == "Order" ? (
                      <View
                        style={[
                          styles.tab,
                          styles.activeTab,
                          {
                            flexDirection: "row",
                            alignItems: "center",
                            borderBottomColor: Colors.primary,
                            borderBottomWidth: 2,
                          },
                        ]}
                      >
                        <Text style={styles.activeText}>Order</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          this.setState(
                            {
                              currentTab: "Order",
                              subTab: "Live Order",
                              status: "confirmed",
                            },
                            () => this.loadOrderDetails()
                          )
                        }
                        style={styles.tab}
                      >
                        <Text style={styles.inActiveText}>Order</Text>
                      </TouchableOpacity>
                    )}
                  </>
                  : null}
              </View> */}
              {/* {this.state.currentTab == "Enquiry" ? ( */}
              <View
                style={[
                  styles.NewTabContainer,
                  // {
                  //   top: 5,
                  //   marginBottom: 6,
                  // },
                ]}
              >
                {this.state.showEnquiry ?
                  <>
                    <>
                      {this.state.subTab == "Live Enquiry" ? (
                        <View
                          // style={{
                          //   flexDirection: "row",
                          //   justifyContent: "space-between",
                          //   paddingVertical: 5,
                          //   paddingHorizontal: 8,
                          //   borderWidth: 0.6,
                          //   borderRadius: 3,
                          //   backgroundColor: Colors.primary,
                          //   borderColor: Colors.primary,
                          //   marginRight: 5,
                          //   left: 9,
                          //   marginRight: 50,
                          // }}
                          style={styles.NewSelectedTab}
                        >
                          {/* <Text
                            style={[
                              styles.activeText,
                              { color: Colors.white },
                            ]}
                          >
                            Live 
                          </Text> */}
                          <Text
                            style={[
                              styles.activeText,
                              { color: Colors.white },
                            ]}
                          >
                            Enquiry
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.setState(
                              { subTab: "Live Enquiry", status: "default" },
                              () => this.loadEnquiryDetails()
                            )
                          }
                          // style={{
                          //   flexDirection: "row",
                          //   justifyContent: "space-between",
                          //   paddingVertical: 5,
                          //   paddingHorizontal: 8,
                          //   borderWidth: 0.6,
                          //   borderRadius: 3,
                          //   borderColor: Colors.primary,

                          //   left: 9,
                          // }}
                          style={styles.NewTab}
                        >
                          {/* <Text
                            style={[
                              styles.inActiveText,
                              { color: Colors.primary },
                            ]}
                          >
                            Live 
                          </Text> */}
                          <Text
                            style={[
                              styles.inActiveText,
                              { color: Colors.primary },
                            ]}
                          >
                            Enquiry
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                    {/* <>
                      {this.state.subTab == "Close Enquiry" ? (
                        <View
                          // style={{
                          //   flexDirection: "row",
                          //   justifyContent: "space-between",
                          //   paddingVertical: 5,
                          //   paddingHorizontal: 8,
                          //   borderWidth: 0.6,
                          //   borderRadius: 3,
                          //   backgroundColor: Colors.primary,
                          //   borderColor: Colors.primary,
                          //   marginRight: 5,
                          //   left: 9,
                          //   marginLeft: 20,
                          // }}
                          style={styles.NewSelectedTab}
                        >
                          <Text
                            style={[
                              styles.activeText,
                              { color: Colors.white },
                            ]}
                          >
                            Closed Enquiry
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.setState(
                              { subTab: "Close Enquiry", status: "closed" },
                              () => this.loadEnquiryDetails()
                            )
                          }
                          // style={{
                          //   flexDirection: "row",
                          //   justifyContent: "space-between",
                          //   paddingVertical: 5,
                          //   paddingHorizontal: 8,
                          //   borderWidth: 0.6,
                          //   borderRadius: 3,
                          //   borderColor: Colors.primary,
                          //   marginRight: 5,
                          //   right: 20,
                          // }}
                          style={styles.NewTab}
                        >
                          <Text
                            style={[
                              styles.activeText,
                              { color: Colors.primary },
                            ]}
                          >
                            Closed Enquiry
                          </Text>
                        </TouchableOpacity>
                      )}
                    </> */}
                  </>
                  : null
                }
                {this.state.showOrder ?
                  <>
                    <>
                      {this.state.subTab == "Live Order" ? (
                        <View
                          // style={{
                          //   flexDirection: "row",
                          //   justifyContent: "space-between",
                          //   paddingVertical: 5,
                          //   paddingHorizontal: 8,
                          //   borderWidth: 0.6,
                          //   borderRadius: 3,
                          //   backgroundColor: Colors.primary,
                          //   borderColor: Colors.primary,
                          //   marginRight: 5,
                          //   left: 9,
                          //   marginRight: 50,
                          // }}
                          style={styles.NewSelectedTab}
                        >
                          {/* <Text
                          style={[
                            styles.activeText,
                            { color: Colors.white },
                          ]}
                        >
                          Live
                        </Text> */}
                          <Text
                            style={[
                              styles.activeText,
                              { color: Colors.white },
                            ]}
                          >
                            Order
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.setState(
                              { subTab: "Live Order", status: "confirmed" },
                              () => this.loadOrderDetails()
                            )
                          }
                          // style={{
                          //   flexDirection: "row",
                          //   justifyContent: "space-between",
                          //   paddingVertical: 5,
                          //   paddingHorizontal: 8,
                          //   borderWidth: 0.6,
                          //   borderRadius: 3,
                          //   borderColor: Colors.primary,
                          //   left: 9,
                          // }}
                          style={styles.NewTab}
                        >
                          {/* <Text
                          style={[
                            styles.inActiveText,
                            { color: Colors.primary },
                          ]}
                        >
                          Live
                        </Text> */}
                          <Text
                            style={[
                              styles.inActiveText,
                              { color: Colors.primary },
                            ]}
                          >
                            Order
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                    {/* <>
                    {this.state.subTab == "Close Order" ? (
                      <View
                        // style={{
                        //   flexDirection: "row",
                        //   justifyContent: "space-between",
                        //   paddingVertical: 5,
                        //   paddingHorizontal: 8,
                        //   borderWidth: 0.6,
                        //   borderRadius: 3,
                        //   backgroundColor: Colors.primary,
                        //   borderColor: Colors.primary,
                        //   marginRight: 5,
                        //   left: 9,
                        //   marginLeft: 20,
                        // }}
                        style={styles.NewSelectedTab}
                      >
                        <Text
                          style={[
                            styles.activeText,
                            { color: Colors.white },
                          ]}
                        >
                          Close Order
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          this.setState(
                            { subTab: "Close Order", status: "closed" },
                            () => this.loadOrderDetails()
                          )
                        }
                        // style={{
                        //   flexDirection: "row",
                        //   justifyContent: "space-between",
                        //   paddingVertical: 5,
                        //   paddingHorizontal: 8,
                        //   borderWidth: 0.6,
                        //   borderRadius: 3,
                        //   borderColor: Colors.primary,
                        //   marginRight: 5,
                        //   right: 20,
                        // }}
                        style={styles.NewTab}
                      >
                        <Text
                          style={[
                            styles.activeText,
                            { color: Colors.primary },
                          ]}
                        >
                          Close Order
                        </Text>
                      </TouchableOpacity>
                    )}
                  </> */}
                  </>
                  : null}
                {this.state.showEnquiry ?
                  <>
                    <>
                      {this.state.subTab == "Close Enquiry" ? (
                        <View
                          // style={{
                          //   flexDirection: "row",
                          //   justifyContent: "space-between",
                          //   paddingVertical: 5,
                          //   paddingHorizontal: 8,
                          //   borderWidth: 0.6,
                          //   borderRadius: 3,
                          //   backgroundColor: Colors.primary,
                          //   borderColor: Colors.primary,
                          //   marginRight: 5,
                          //   left: 9,
                          //   marginLeft: 20,
                          // }}
                          style={styles.NewSelectedTab}
                        >
                          {/* <Text
                            style={[
                              styles.activeText,
                              { color: Colors.white },
                            ]}
                          >
                            Closed 
                          </Text> */}
                          <Text
                            style={[
                              styles.activeText,
                              { color: Colors.white },
                            ]}
                          >
                            complete
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.setState(
                              { subTab: "Close Enquiry", status: "completed" },
                              () => this.loadEnquiryDetails()
                            )
                          }
                          // style={{
                          //   flexDirection: "row",
                          //   justifyContent: "space-between",
                          //   paddingVertical: 5,
                          //   paddingHorizontal: 8,
                          //   borderWidth: 0.6,
                          //   borderRadius: 3,
                          //   borderColor: Colors.primary,
                          //   marginRight: 5,
                          //   right: 20,
                          // }}
                          style={styles.NewTab}
                        >
                          {/* <Text
                            style={[
                              styles.activeText,
                              { color: Colors.primary },
                            ]}
                          >
                            Closed 
                          </Text> */}
                          <Text
                            style={[
                              styles.activeText,
                              { color: Colors.primary },
                            ]}
                          >
                            complete
                          </Text>
                        </TouchableOpacity>
                      )}
                    </>
                  </>
                  : null
                }
                {/* </View> */}

                {/* ) : ( */}
                {/* <View
                  style={[styles.NewTabContainer, 
                    // { top: 5, marginBottom: 6 }
                  ]}
                > */}

                {this.state.showOrder ?
                  <>
                    <>
                      {this.state.subTab == "Close Order" ? (
                        <View
                          // style={{
                          //   flexDirection: "row",
                          //   justifyContent: "space-between",
                          //   paddingVertical: 5,
                          //   paddingHorizontal: 8,
                          //   borderWidth: 0.6,
                          //   borderRadius: 3,
                          //   backgroundColor: Colors.primary,
                          //   borderColor: Colors.primary,
                          //   marginRight: 5,
                          //   left: 9,
                          //   marginLeft: 20,
                          // }}
                          style={styles.NewSelectedTab}
                        >
                          <Text
                            style={[
                              styles.activeText,
                              { color: Colors.white },
                            ]}
                          >
                            Canceled
                          </Text>
                          {/* <Text
                          style={[
                            styles.activeText,
                            { color: Colors.white },
                          ]}
                        >
                          Order 
                        </Text> */}
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.setState(
                              { subTab: "Close Order", status: "closed" },
                              () => this.loadOrderDetails()
                            )
                          }
                          // style={{
                          //   flexDirection: "row",
                          //   justifyContent: "space-between",
                          //   paddingVertical: 5,
                          //   paddingHorizontal: 8,
                          //   borderWidth: 0.6,
                          //   borderRadius: 3,
                          //   borderColor: Colors.primary,
                          //   marginRight: 5,
                          //   right: 20,
                          // }}
                          style={styles.NewTab}
                        >
                          <Text
                            style={[
                              styles.activeText,
                              { color: Colors.primary },
                            ]}
                          >
                            Canceled
                          </Text>
                          {/* <Text
                          style={[
                            styles.activeText,
                            { color: Colors.primary },
                          ]}
                        >
                           Order
                        </Text> */}
                        </TouchableOpacity>
                      )}
                    </>
                  </>
                  : null}
              </View>
              {/* )} */}

              {this.state.subTab == "Live Enquiry" ? (
                <View style={{ marginBottom: "30%" }}>
                  <SectionList
                    sections={this.state.enquiryData}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.renderItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={this.renderEmptyContainer()}
                    renderSectionHeader={({ section: { title } }) => {
                      return (
                        <View style={styles.sectionHeader}>
                          <View style={styles.sectionHeaderLeft}>
                            <Text style={{ fontSize: 26, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("DD")}
                            </Text>
                          </View>
                          <View style={styles.sectionHeaderRight}>
                            <Text style={{ fontSize: 16, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("dddd")}
                            </Text>
                            <Text style={{ fontSize: 14, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("MMMM YYYY")}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                      />
                    }
                  />
                </View>
              ) : null}
              {this.state.subTab == "Close Enquiry" ? (
                <View style={{ marginBottom: "30%" }}>
                  <SectionList
                    sections={this.state.enquiryData}
                    keyExtractor={(item, index) => item.id.toString()} 
                    renderItem={this.listItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={this.renderEmptyContainer()}
                    renderSectionHeader={({ section: { title } }) => {
                      return (
                        <View style={styles.sectionHeader}>
                          <View style={styles.sectionHeaderLeft}>
                            <Text style={{ fontSize: 26, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("DD")}
                            </Text>
                          </View>
                          <View style={styles.sectionHeaderRight}>
                            <Text style={{ fontSize: 16, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("dddd")}
                            </Text>
                            <Text style={{ fontSize: 14, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("MMMM YYYY")}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                      />
                    }
                  />
                </View>
              ) : null}
              {this.state.subTab == "Live Order" ? (
                <View style={{ marginBottom: "30%" }}>
                  <SectionList
                    sections={this.state.orderData}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.listItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={this.renderEmptyContainer()}
                    renderSectionHeader={({ section: { title } }) => {
                      return (
                        <View style={styles.sectionHeader}>
                          <View style={styles.sectionHeaderLeft}>
                            <Text style={{ fontSize: 26, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("DD")}
                            </Text>
                          </View>
                          <View style={styles.sectionHeaderRight}>
                            <Text style={{ fontSize: 16, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("dddd")}
                            </Text>
                            <Text style={{ fontSize: 14, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("MMMM YYYY")}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                      />
                    }
                  />
                </View>
              ) : null}
              {this.state.subTab == "Close Order" ? (
                <View style={{ marginBottom: "30%" }}>
                  <SectionList
                    sections={this.state.orderData}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.listItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={this.renderEmptyContainer()}
                    renderSectionHeader={({ section: { title } }) => {
                      return (
                        <View style={styles.sectionHeader}>
                          <View style={styles.sectionHeaderLeft}>
                            <Text style={{ fontSize: 26, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("DD")}
                            </Text>
                          </View>
                          <View style={styles.sectionHeaderRight}>
                            <Text style={{ fontSize: 16, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("dddd")}
                            </Text>
                            <Text style={{ fontSize: 14, color: Colors.white }}>
                              {moment(title, "YYYY-MM-DD").format("MMMM YYYY")}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                      />
                    }
                  />
                </View>
              ) : null}
            </View>
            {/* </KeyboardAwareScrollView> */}
          </>
        )}
      </SafeAreaView>
    );
  };
}
const tabHeight = 40;
const windowwidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.white,
  },
  listItem: {
    borderBottomColor: Colors.textInputBorder,
    borderBottomWidth: 1,
    padding: 10,
  },
  carouselContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 80,
  },

  carousel: {
    height: 270,
    width: windowwidth,
    marginHorizontal: 0,
    borderRadius: 3,
  },
  carouselImg: {
    height: 270,
    width: windowwidth,
    borderRadius: 0,
  },

  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textColor,
    marginBottom: 10,
    marginLeft: 5,
  },
  latestCollections: {
    marginTop: 0,
    marginLeft: 0,
  },

  latestCollectionItem: {
    width: Math.floor((windowwidth - 40) / 4),
    height: 70,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  latestCollectionItemImg: {
    width:
      Platform.OS === "android"
        ? Math.floor((windowwidth - 30) / 3)
        : Math.floor((windowwidth - 30) / 3),
    height: Platform.OS === "android" ? 80 : 100,
    borderRadius: 0,
  },

  galleryContainer: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  galleryGrid: {
    width:
      Platform.OS === "android"
        ? Math.floor((windowwidth - 10) / 3.1)
        : Math.floor((windowwidth - 10) / 3),
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 1,
    // borderRadius: 5
    // borderTopLeftRadius:
  },
  galleryImg: {
    width:
      Platform.OS === "android"
        ? Math.floor((windowwidth - 10) / 3.2)
        : Math.floor((windowwidth - 10) / 3.1),
    height: "98%",
  },
  newsConatiner: {
    marginTop: 40,
    width: windowwidth - 10,
    height: 70,
    marginHorizontal: 5,
    backgroundColor: "#e0ffff",
    borderWidth: 1,
    borderColor: Colors.textInputBorder,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  newsText: {
    fontSize: 14,
    color: Colors.textColor,
    // opacity: 0.9,
  },
  name: {
    fontSize: 18,
    color: Colors.textColor,
  },
  left: {
    width: "15%",
    justifyContent: "center",
  },
  middle: {
    justifyContent: "center",
    flex: 1,
    // paddingLeft: 10
  },
  tabContainer: {
    width: "100%",
    height: tabHeight,
    flexDirection: "row",
    //borderBottomWidth: 1,
    borderBottomColor: "#d1d1d1",
    borderTopWidth: 0,
    borderTopColor: "#d1d1d1",

    // backgroundColor: Colors.white,
    // elevation: 1,
    // marginTop: 10
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: tabHeight,
  },
  tab1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 31,
  },
  underlineStyle: {
    backgroundColor: Colors.primary,
    height: 3,
  },
  activeTab: {
    height: tabHeight - 1,
    //borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  activeText: {
    fontSize: 15,
    // fontWeight: "bold",
    color: Colors.primary,
    alignSelf: 'center',
  },
  inActiveText: {
    fontSize: 15,
    color: Colors.grey,
    alignSelf: 'center',
    // opacity: 0.8,
  },
  openEnduiry: {
    borderWidth: 2,
    borderColor: Colors.primary,
    height: "95%",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    width: "99%",
  },
  listContainer: {
    padding: 8,
  },
  sectionHeader: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    backgroundColor: Colors.primary,
    marginBottom: 10,
    borderRadius: 3,
  },
  sectionHeaderLeft: {
    width: "14%",
    alignItems: "flex-end",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: Colors.white,
    paddingRight: 10,
  },
  sectionHeaderRight: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 10,
  },
  card: {
    //width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 4,
    // elevation: 1,
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 3,
    fontWeight: "normal",
    // opacity: 0.6,
  },
  NewTabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    // // width: 300,
    height: 50,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 5,
    paddingHorizontal: 5
  },
  NewSelectedTab: {
    width: '23%',
    backgroundColor: Colors.primary,
    color: Colors.white,
    height: 40,
    borderRadius: 4,
    alineItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    paddingHorizontal: 2,
  },
  NewTab: {
    width: '23%',
    color: Colors.primary,
    alineItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginHorizontal: 2,
    paddingHorizontal: 2,
  }
});
