import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  SafeAreaView,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import Colors from "../config/colors";
import Header from "../components/Header";
import Configs from "../config/Configs";
import { Gamedetail } from "../services/GameApiService";
import Loader from "../components/Loader";
import colors from "../config/colors";
import CustomImage from "../components/CustomImage";
import ImageView from "react-native-image-viewing";
import YoutubePlayer from "react-native-youtube-iframe";
import CachedImage from 'expo-cached-image';
import { Video, AVPlaybackStatus } from 'expo-av';
import moment from "moment";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";


/*
*
*share pdf 
*created by - Rahul Saha
*created on - 08.12.22
*
*/

const htmlRender = (item, gameData) => {
  let GameBanner = Configs.NEW_COLLECTION_URL + item.image;
  let html = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Wrangler Bull Html Page</title>
      <style>
          @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
  
          * {
              margin: 0;
              padding: 0;
          }
      </style>
  </head>
  
  <body style="background: white;">
      <main style="font-family: 'Roboto', sans-serif">
          <img src="${GameBanner}" style="width:300; height:300;margin:0 auto;display:block;">
          <div style="text-align: center;margin-top: 20px;">
              <h3><strong>${item.name}</strong></h3>
              <small>(Product ID: G000${item.id})</small>
          </div>`
  if (item.description != "") {
    html += `<div style="font-size: 12px;padding:0 5px;margin-top:25px;">
              <p>${item.description} </p>
              
          </div>`}

  html += `<div style="padding:0 5px;display: flex;flex-wrap: wrap;">`
   item?.images?.forEach(element => {
    if (element.image != null) {
      let gameImageurl = Configs.GAME_GALLERY_IMAGE_URL + element.image
    html += `<div style="border:1px solid lightgray;padding: 5px; width:120px;margin:10px 6px 0 0;font-size: 12px;">
    <img src="${gameImageurl}" style="width: 100%;height: auto;">
    </div> `
    }
  });
  html += ` </div>
  
          <div style="display:flex;font-size:12px;padding:5px;margin-top:5px;align-items: center;">
              <p style="margin-right:5px;">Rent: ₹${Math.trunc(item.rent)}</p> 
          </div>
          <div style="display:flex;font-size:12px;padding:5px;margin-top:5px;align-items: center;">
              <p style="margin-right:5px;">Size: ${item.size}</p> 
          </div>

          <div style="display:flex;font-size:12px;padding:5px;margin-top:5px;align-items: center;">
              <p style="margin-right:5px;">Tags:</p>`
            item?.tags?.forEach(element => {
              
              html += ` <div style="border:1px solid lightgray;padding:2px;font-size:10px;margin-right:5px;border-radius:2px;">
                     ${element.name}
                     </div> `
            });
                   
            html +=  ` </div>
  
  
  
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

export default class GameDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      data: [],
      isLoading: true,
      game_id: this.props.route.params.game_id,
      game_ids: null,
      qty: 1,
      refreshing: false,

      activeTabKey: "A",
      selectedGalleryImageIndex: 0,
      isGalleryImageViewerOpen: false,
      isPlaybackModalOpen: false,
      playbackURI: undefined,
      videoLoading: false,
      videoid: "",
      splitUrl: "",
      videoUrl: '',
      galleryVideomodal: false,
      GamesData: "",
      enquiryData: {}
    };
    this.scrollViewRef = React.createRef();
  }
  componentDidMount = () => {
    this.loadGameDetails();
    this.focusListner = this.props.navigation.addListener("focus", () => {
      this.setState({ isPlaybackModalOpen: false })
      this.loadGameDetails();
    });
    this._blurListener = this.props.navigation.addListener('blur',()=>{
			this.setState({playbackURI: undefined})
		})
  };

  scrollToScrollViewTop = () =>
    this.scrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });

  loadVideo = () => {
    // console.log("**********Started***********")
    this.setState({ videoLoading: true })
  }

  // videoIdRtrive = () => {
  //   //  let splitUrl = this.state.GameDetails.game[0].video_file
  //   this.setState(
  //     {
  //       splitUrl: this.state.data.video_file,
  //     },
  //     () => {
  //       let urlsplit = this.state.splitUrl.split("=");
  //       this.setState(
  //         {
  //           videoid: urlsplit[1],
  //         },
  //         () => {
  //           // console.log('video code ' ,  this.state.videoid)
  //         }
  //       );
  //       // console.log('spilt url ' , this.state.splitUrl)
  //     }
  //   );
  // };

  componentWillUnmount() {
    this.focusListner();
    this._blurListener();
  }

  toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

  gotoPartsList = () => {
    this.toggleModal();
    this.props.navigation.navigate("PartsList", {
      game_id: this.state.game_id,
    });
  };

  gotoProductListingDetails = () => {
    this.toggleModal();
    let detail = this.state.data.game_list_detail ?? {};
    let game = { game_id: this.state.game_id };
    //console.log(Object.assign(detail,game));
    this.props.navigation.navigate("ProductListingDetails", {
      data: Object.assign(detail, game),
      game_rent_to_customer: this.state.data.rent,
    });
  };

  gotoProductLaunchDetails = () => {
    this.toggleModal();

    let detail = this.state.data.game_launch_detail ?? {};
    let game = { game_id: this.state.game_id };
    this.props.navigation.navigate("ProductLaunchDetails", {
      data: Object.assign(detail, game),
    });
  };

  gotoGameImage = () => {
    this.toggleModal();
    this.props.navigation.navigate("GameImageScreen", {
      game_id: this.state.game_id,
    });
  };

  gotoGameTag = () => {
    this.toggleModal();
    this.props.navigation.navigate("GameTagScreen", {
      game_id: this.state.game_id,
    });
  };

  loadGameDetails = () => {
    Gamedetail(this.state.game_id)
      .then((response) => {
        // console.log("......................................Game Data>>>>>>>>>>????",response.data);

        this.setState(
          {
            data: response.data,
            isLoading: false,
            refreshing: false,
            videoUrl: Configs.NEW_COLLECTION_URL + response.data.video_file
          },
          // () => {
          //   this.videoIdRtrive();
          // }
        );
      })
      .catch((err) => { });
  };

  openPlaybackModal = (uri) => {
    // console.log("URl>>>>",uri)
    this.setState({
      isPlaybackModalOpen: true,
      playbackURI: uri,
    });
    this.scrollToScrollViewTop()
  };

  closePlaybackModal = () =>
    this.setState({
      isPlaybackModalOpen: false,
      playbackURI: undefined,
    });

  GoToGamesByTag = (data) => {
    this.props.navigation.navigate("GamesByTag", { data: data });
  };

  setActiveTab = (key) =>
    this.setState({
      activeTabKey: key,
    });

  getGalleryImages = () => {
    let { images } = this.state.data;
    let data = (images || []).map((item) => {
      return {
        id: item.id,
        uri: Configs.GAME_GALLERY_IMAGE_URL + item.image,
      };
    });
    return data;
  };

  getGalleryVideo = () => {
    let { video } = this.state.data;
    let data = (video || []).map((item) => {
      return {
        id: item.id,
        uri: Configs.GAME_GALLERY_IMAGE_URL + item.video,
      };
    });
    return data;
  };

  openGalleryImageViewer = (id) => {
    let galleryImages = this.getGalleryImages();
    let index = galleryImages.findIndex((item) => item.id === id);

    this.setState({
      selectedGalleryImageIndex: index > -1 ? index : 0,
      isGalleryImageViewerOpen: true,
    });
  };

  closeGalleryImageViewer = () =>
    this.setState({
      selectedGalleryImageIndex: 0,
      isGalleryImageViewerOpen: false,
    });

  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.loadGameDetails();
      }
    );
  };

  handlePrevNext = (game_id, name) => {
    this.props.navigation.push("GameDetails", {
      game_id: game_id,
      name: name,
    });
  };

  render = () => {
    let url = "";

    if (this.state.data.hasOwnProperty("game")) {
      url =
        "https://ehostingguru.com/stage/funtoo/public/uploads/game/funtoo-6194cc0a0f0bd.jpg";
    }

    if (this.state.data.hasOwnProperty("image")) {
    }
    if (this.state.data.hasOwnProperty("tag")) {
    }

    let image_url = Configs.NEW_COLLECTION_URL + this.state.data.image;
    let data = this.state.data;
    let list_detail = data?.game_list_detail;
    let launch_detail = data?.game_launch_detail;

    let total_cost = 0;
    launch_detail?.materials?.map((item) => {
      total_cost = total_cost + Number(item?.amount);
    });

    console.log("..........this.state.data.........",this.state.data)
    // console.log("..........video url.........",Configs.NEW_COLLECTION_URL + this.state.data.video_file)
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title={this.state.data.name}
          addAction={this.toggleModal}
          editAction={() =>
            this.props.navigation.navigate("EditGame", {
              id: this.state.game_id,
            })
          }
          gameDetailsIcon={true}
          previous_game={this.state.data.previous_game}
          next_game={this.state.data.next_game}
          previous_game_function={() =>
            this.handlePrevNext(
              this.state.data.previous_game.id,
              this.state.data.previous_game.name
            )
          }
          next_game_function={() =>
            this.handlePrevNext(
              this.state.data.next_game.id,
              this.state.data.next_game.name
            )
          }

          export="true"
          // exportGamedata={this.state.GamesData}
          exportData={htmlRender}
          exportItems={this.state.data}
        />

        {this.state.isLoading ? (
          <Loader />
        ) : (
          <>
            <View style={styles.gameDetails}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                ref={this.scrollViewRef}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                }
              >
                {/* <View style={styles.gameBannerContainer}>
									<ProgressiveImage
										source={{ uri: image_url }}
										resizeMode="cover"
										style={styles.gameBanner}
									/>
								</View> */}

                <View style={[styles.gameBannerContainer]}>
                  {this.state.isPlaybackModalOpen ?
                    <View style={{ flexDirection: 'row', backgroundColor: '#000' }}>
                      {this.state.videoLoading ?
                        <ActivityIndicator
                          color={Colors.primary}
                          size="small"
                          style={styles.video}
                        /> : null}
                      <Video
                        useNativeControls={true}
                        resizeMode="contain"
                        isLooping={false}
                        source={{
                          // uri: `http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4`,
                          uri: `${this.state.playbackURI}`,
                        }}
                        style={styles.video}
                        shouldPlay={true}
                        onLoadStart={() => this.loadVideo()}
                        onLoad={() => this.setState({ videoLoading: false })}
                        progressUpdateIntervalMillis={50}
                      />
                      <TouchableOpacity
                        style={[styles.closeButton, { top: Platform.OS == 'ios' ? 50 : 20, right: 20 }]}
                        onPress={this.closePlaybackModal}
                      >
                        <Ionicons name="close-outline" style={styles.closeButtonText} />
                      </TouchableOpacity>
                    </View>
                    :
                    <>
                      {
                        Platform.OS == "ios" ?
                          <Image
                            style={styles.gameBanner}
                            source={{
                              uri: image_url
                            }}
                            resizeMode={'contain'}
                          />
                          :
                          <CachedImage
                            source={{ uri: image_url }}
                            resizeMode="contain"
                            style={styles.gameBanner}
                            cacheKey={`${this.state.data.image}+${this.state.data.name}`}
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
                      }
                    </>
                  }
                </View>

                {/* <Text style={styles.gameTitle}> {this.state.data.name}</Text>

								<Text style={styles.gameDesc}>
									{this.state.data.description}
								</Text>

								<View style={styles.galleryContainer}>
									{this.state.data.images.length > 0
										? this.state.data.images.map((item, index) => {
											let url = Configs.GAME_GALLERY_IMAGE_URL + item.image;
											return (
												// {GAME_GALLERY.map((item, index) => (
												<TouchableOpacity
													key={item.id.toString()}
													style={styles.galleryGrid}
												>
													<ProgressiveImage
														// source={item.src} //item.image+base_url
														source={{ uri: url }}
														style={styles.galleryImg}
														resizeMode="contain"
													/>
												</TouchableOpacity>
											);
										})
										: null}
								</View> */}

                <View style={styles.gameDetails}>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text style={styles.gameTitle}>{this.state.data.name}</Text>
                    <Text
                      style={styles.productId}
                    >{`(Product ID: G000${this.state.data.id})`}</Text>
                  </View>
                  {this.state.data.description.length > 0 ?
                    <View style={{ height: 100, marginTop: 10, padding: 8 }}>
                      <ScrollView
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                      >
                        <Text style={styles.gameDesc}>
                          {this.state.data.description}
                        </Text>
                      </ScrollView>
                    </View>
                    : null}
                </View>
                {this.state.data.video_file != null || this.state.data.images.length > 0 ?
                  <>
                    <View style={styles.galleryContainer}>
                      {this.state.data.images.length > 0
                        ? this.state.data.images.map((item, index) => {
                          let url = Configs.GAME_GALLERY_IMAGE_URL + item.image;
                          let thumb_url = Configs.GAME_GALLERY_IMAGE_URL + item.thumbnail;
                          let Video_url = Configs.GAME_GALLERY_IMAGE_URL + item.video;
                          // console.log(".......game datails...item....url.....",url)
                          return (
                            <>
                              {item.image == null ?
                                null :
                                <TouchableOpacity
                                  activeOpacity={1}
                                  key={item.id.toString()}
                                  style={[
                                    styles.galleryGrid,
                                    {
                                      marginHorizontal: Platform.OS == "ios" ? 2 : 3,
                                      backgroundColor: "#fff",
                                      height: Platform.OS == "ios" ? 95 : 95,
                                      marginBottom: 5,
                                      borderWidth: 0.6,
                                      borderColor: "#dfdfdf",
                                      padding: 2,
                                    },
                                  ]}
                                  onPress={this.openGalleryImageViewer.bind(
                                    this,
                                    item.id
                                  )}
                                >
                                  {Platform.OS == "ios" ? (
                                    <Image
                                      source={{ uri: url }}
                                      style={styles.galleryImg}
                                      resizeMode="contain"
                                    />
                                  ) : (
                                    <CustomImage
                                      source={{ uri: url }}
                                      style={styles.galleryImg}
                                      resizeMode="contain"
                                    />
                                  )}
                                </TouchableOpacity>
                              }
                              {item.video == null ?
                                null :
                                <TouchableOpacity
                                  activeOpacity={0.7}
                                  style={[
                                    styles.galleryGrid,
                                    { backgroundColor: "white" },
                                  ]}
                                  onPress={this.openPlaybackModal.bind(
                                    this,
                                    Video_url
                                  )}
                                >
                                  {item.thumbnail == null ?
                                    <Ionicons
                                      name="play-circle-outline"
                                      size={60}
                                      color={Colors.primary}
                                    />
                                    :
                                    <>
                                      {Platform.OS == "ios" ? (
                                        <>
                                          <Image
                                            source={{ uri: thumb_url }}
                                            style={styles.galleryImg}
                                            resizeMode="contain"
                                          />
                                          <View style={{ position: 'absolute', top: '35%', }}>
                                            <Ionicons name="play-circle-outline" size={24} color={Colors.white} />
                                          </View>
                                        </>
                                      ) : (
                                        <>
                                          <CustomImage
                                            source={{ uri: thumb_url }}
                                            style={styles.galleryImg}
                                            resizeMode="contain"
                                          />
                                          <View style={{ position: 'absolute', top: '35%', }}>
                                            <Ionicons name="play-circle-outline" size={24} color={Colors.white} />
                                          </View>
                                        </>
                                      )}
                                    </>
                                  }
                                </TouchableOpacity>
                              }
                            </>
                          );
                        })
                        : null}
                      {this.state.data.video_file != null ? (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={[
                            styles.galleryGrid,
                            { backgroundColor: "#d1d1d1" },
                          ]}
                          onPress={this.openPlaybackModal.bind(
                            this,
                            Configs.NEW_COLLECTION_URL+this.state.data.video_file
                            // this.state.videoUrl
                          )}
                        >
                       {this.state.data.video_thumbnail == null ?
												<Ionicons
													name="play-circle-outline"
													size={60}
													color={Colors.primary}
												/>
												:
												<>
													{Platform.OS == "ios" ? (
														<>
															<Image
																source={{ uri: Configs.GAME_GALLERY_IMAGE_URL + this.state.data.video_thumbnail }}
																style={styles.galleryImg}
																resizeMode="contain"
															/>
															<View style={{ position: 'absolute', top: '35%', }}>
																<Ionicons name="play-circle-outline" size={24} color={Colors.white} />
															</View>
														</>
													) : (
														<>
															<CustomImage
																source={{ uri: Configs.GAME_GALLERY_IMAGE_URL + this.state.data.video_thumbnail }}
																style={styles.galleryImg}
																resizeMode="contain"
															/>
															<View style={{ position: 'absolute', top: '35%', }}>
																<Ionicons name="play-circle-outline" size={24} color={Colors.white} />
															</View>
														</>
													)}
												</>
											}
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </>
                  : null}


                <View style={{ marginTop: 20, padding: 8 }}>
                  <View style={{ marginBottom: 5, flexDirection: "row" }}>
                    <Text style={[styles.gameDataText]}>{"Rent: "}</Text>
                    <Text
                      style={{
                        fontSize: 9,
                        paddingTop: Platform.OS == "ios" ? 1 : 1.8,
                        color: Colors.textColor,
                      }}
                    >
                      {"₹"}
                    </Text>
                    <Text style={[styles.gameDataText]}>
                      {Math.trunc(this.state.data.rent)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 9,
                        paddingTop: Platform.OS == "ios" ? 1 : 1.8,
                        color: Colors.textColor,
                      }}
                    >

                    </Text>
                  </View>

                  <View style={{ marginBottom: 5 }}>
                    <Text style={styles.gameDataText}>
                      Size: {this.state.data.size}
                    </Text>
                  </View>

                  <>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.gameDataText}>{"Tags: "}</Text>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      >
                        {this.state.data.tags.length > 0
                          ? this.state.data.tags.map((item, index) => {
                            return (
                              <View
                                style={{
                                  borderWidth: 1,
                                  padding: 5,
                                  marginRight: 2,
                                  borderRadius: 3,
                                  borderColor: "#cfcfcf",
                                }}
                                key={item.id.toString()}
                              >
                                <Text
                                  style={[
                                    styles.gameDataText,
                                    { fontSize: 10 },
                                  ]}
                                >
                                  {item.name}
                                </Text>
                              </View>
                            );
                          })
                          : null}
                      </ScrollView>
                    </View>
                  </>
                </View>

                {/* <View style={{ marginTop: 20 }}>
									<Text style={styles.gameDataText}>Rent : {this.state.data.rent}</Text>
									<Text style={styles.gameDataText}>Size : {this.state.data.size}</Text>
									<Text style={styles.gameDataText}>
										Tags : {" "}
										{this.state.data.tags.length > 0
											? this.state.data.tags.map((item, index) => {
												if (index != this.state.data.tags.length - 1) {
													return (

														<Text onPress={() => this.GoToGamesByTag(item)}
															key={item.id.toString()}>
															{item.name}/
														</Text>

													);
												} else {
													return (

														<Text key={Math.random().toString()} onPress={() => this.GoToGamesByTag(item)}>
															{item.name}
														</Text>

													);
												}
											})
											: null}
									</Text>
								</View> */}

                <View style={styles.tabRow}>
                  <TouchableOpacity
                    onPress={this.setActiveTab.bind(this, "A")}
                    style={[
                      styles.tab,
                      this.state.activeTabKey === "A" ? styles.activeTab : null,
                    ]}
                  >
                    <Text
                      style={
                        this.state.activeTabKey === "A"
                          ? styles.activeText
                          : styles.inActiveText
                      }
                    >
                      Parts List
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.setActiveTab.bind(this, "B")}
                    style={[
                      styles.tab,
                      this.state.activeTabKey === "B" ? styles.activeTab : null,
                    ]}
                  >
                    <Text
                      style={
                        this.state.activeTabKey === "B"
                          ? styles.activeText
                          : styles.inActiveText
                      }
                    >
                      Listing Details
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this.setActiveTab.bind(this, "C")}
                    style={[
                      styles.tab,
                      this.state.activeTabKey === "C" ? styles.activeTab : null,
                    ]}
                  >
                    <Text
                      style={
                        this.state.activeTabKey === "C"
                          ? styles.activeText
                          : styles.inActiveText
                      }
                    >
                      Launch Details
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.tabContainer}>
                  {this.state.activeTabKey === "A" && (
                    <View>
                      {data.game_parts?.length > 0 ? (
                        <View>
                          {data?.game_parts.map((item) => {
                            return (
                              <View
                                key={item.id.toString()}
                                style={styles.card}
                              >
                                <View style={{ width: "80%" }}>
                                  <Text
                                    style={{
                                      color: Colors.textColor,
                                    }}
                                  >{`${item.part_name} - ${item.quantity} Nos`}</Text>
                                  <Text
                                    style={{
                                      fontStyle: "italic",
                                      color: Colors.textColor,
                                    }}
                                  >{`(${item.storage_name})`}</Text>
                                </View>
                                <View style={{ width: "20%" }}>
                                  <Image
                                    source={{ uri: item.image_thumb_url }}
                                    style={{
                                      height: 57,
                                      width: "100%",
                                      borderWidth: 0.6,
                                      borderColor: "#dfdfdf",
                                      borderRadius: 3,
                                    }}
                                    resizeMode="cover"
                                  />
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      ) : (
                        <Text style={styles.noData}>Parts list no records</Text>
                      )}
                    </View>
                  )}
                  {this.state.activeTabKey === "B" && (
                    <View>
                      {list_detail != null ? (
                        <View>
                          <View
                            style={[styles.newRow, { flexDirection: "row" }]}
                          >
                            <Text
                              style={[
                                styles.rowLebal,
                                {
                                  fontSize: 14,
                                  color: Colors.textColor,
                                  marginRight: 5,
                                },
                              ]}
                            >
                              Type :{" "}
                            </Text>
                            <Text
                              style={[
                                styles.rowValue,
                                { color: Colors.textColor },
                              ]}
                            >
                              {list_detail?.type == 1
                                ? "Third Party"
                                : "In House"}
                            </Text>
                          </View>

                          {list_detail.type == 1 && (
                            <View
                              style={[styles.newRow, { flexDirection: "row" }]}
                            >
                              <Text
                                style={[
                                  styles.rowLebal,
                                  {
                                    fontSize: 14,
                                    color: Colors.textColor,
                                    marginRight: 5,
                                  },
                                ]}
                              >
                                Vender Name :{" "}
                              </Text>
                              <Text
                                style={[
                                  styles.rowValue,
                                  { color: Colors.textColor, },
                                ]}
                              >
                                {list_detail?.vender_name}
                              </Text>
                            </View>
                          )}

                          <View
                            style={[styles.newRow, { flexDirection: "row" }]}
                          >
                            <Text
                              style={[
                                styles.rowLebal,
                                {
                                  fontSize: 14,
                                  color: Colors.textColor,
                                  marginRight: 5,
                                },
                              ]}
                            >
                              Item Name :{" "}
                            </Text>
                            <Text
                              style={[
                                styles.rowValue,
                                { color: Colors.textColor, },
                              ]}
                            >
                              {list_detail?.item_name}
                            </Text>
                          </View>
                          <View
                            style={[styles.newRow, { flexDirection: "row" }]}
                          >
                            <Text
                              style={[
                                styles.rowLebal,
                                {
                                  fontSize: 14,
                                  color: Colors.textColor,
                                  marginRight: 5,
                                },
                              ]}
                            >
                              Min Qty :{" "}
                            </Text>
                            <Text
                              style={[
                                styles.rowValue,
                                { color: Colors.textColor, },
                              ]}
                            >
                              {list_detail?.minimum_quantity}
                            </Text>
                          </View>
                          <View
                            style={[styles.newRow, { flexDirection: "row" }]}
                          >
                            <Text
                              style={[
                                styles.rowLebal,
                                {
                                  fontSize: 14,
                                  color: Colors.textColor,
                                  marginRight: 5,
                                },
                              ]}
                            >
                              Max Qty :{" "}
                            </Text>
                            <Text
                              style={[
                                styles.rowValue,
                                { color: Colors.textColor, },
                              ]}
                            >
                              {list_detail?.maximum_quantity}
                            </Text>
                          </View>
                          <View
                            style={[styles.newRow, { flexDirection: "row" }]}
                          >
                            <Text
                              style={[
                                styles.rowLebal,
                                {
                                  fontSize: 14,
                                  color: Colors.textColor,
                                  marginRight: 5,
                                },
                              ]}
                            >
                              Rate Per Unit :{" "}
                            </Text>
                            <Text
                              style={[
                                styles.rowValue,
                                { color: Colors.textColor, },
                              ]}
                            >
                              {list_detail?.rate_per_unit}
                            </Text>
                          </View>
                          <View
                            style={[styles.newRow, { flexDirection: "row" }]}
                          >
                            <Text
                              style={[
                                styles.rowLebal,
                                {
                                  fontSize: 14,
                                  color: Colors.textColor,
                                  marginRight: 5,
                                },
                              ]}
                            >
                              Margin (%) :{" "}
                            </Text>
                            <Text
                              style={[
                                styles.rowValue,
                                { color: Colors.textColor, },
                              ]}
                            >
                              {list_detail?.margin}
                            </Text>
                          </View>
                          <View
                            style={[styles.newRow, { flexDirection: "row" }]}
                          >
                            <Text
                              style={[
                                styles.rowLebal,
                                {
                                  fontSize: 14,
                                  color: Colors.textColor,
                                  marginRight: 5,
                                },
                              ]}
                            >
                              Rent to Customer :{" "}
                            </Text>
                            <Text
                              style={[
                                styles.rowValue,
                                { color: Colors.textColor, },
                              ]}
                            >
                              {list_detail?.rent}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <Text style={styles.noData}>
                          List details not records
                        </Text>
                      )}
                    </View>
                  )}
                  {this.state.activeTabKey === "C" && (
                    <View>
                      {launch_detail != null ? (
                        <View>
                          <View
                            style={[styles.newRow, { flexDirection: "row" }]}
                          >
                            <Text
                              style={[
                                styles.rowLebal,
                                {
                                  fontSize: 14,
                                  color: Colors.textColor,
                                  marginRight: 5,
                                },
                              ]}
                            >
                              Vender Name :{" "}
                            </Text>
                            <Text
                              style={[
                                styles.rowValue,
                                { color: Colors.textColor, },
                              ]}
                            >
                              {launch_detail?.vender_name}
                            </Text>
                          </View>

                          <View
                            style={[styles.newRow, { flexDirection: "row" }]}
                          >
                            <Text
                              style={[
                                styles.rowLebal,
                                {
                                  fontSize: 14,
                                  color: Colors.textColor,
                                  marginRight: 5,
                                },
                              ]}
                            >
                              Pur / Mfg Date :{" "}
                            </Text>
                            <Text
                              style={[
                                styles.rowValue,
                                { color: Colors.textColor, },
                              ]}
                            >
                              {launch_detail?.mfg_date}
                            </Text>
                          </View>

                          <View>
                            <Text>Material</Text>
                          </View>

                          {launch_detail?.materials?.length > 0 && (
                            <>
                              {launch_detail?.materials?.map((item) => (
                                <View key={Math.random()}>
                                  <View
                                    style={[
                                      styles.newRow,
                                      { flexDirection: "row" },
                                    ]}
                                  >
                                    <Text
                                      style={[
                                        styles.rowLebal,
                                        {
                                          fontSize: 14,
                                          color: Colors.textColor,
                                          marginRight: 5,
                                        },
                                      ]}
                                    >
                                      {item.name}
                                    </Text>
                                    <Text
                                      style={[
                                        styles.rowValue,
                                        { color: Colors.textColor, },
                                      ]}
                                    >
                                      {item.amount}
                                    </Text>
                                  </View>
                                </View>
                              ))}
                            </>
                          )}

                          <View
                            style={[styles.newRow, { flexDirection: "row" }]}
                          >
                            <Text
                              style={[
                                styles.inputLable,
                                { marginBottom: 0, fontWeight: "bold" },
                              ]}
                            >
                              Total
                            </Text>
                            <Text
                              style={[
                                styles.inputLable,
                                { marginBottom: 0, fontWeight: "bold" },
                              ]}
                            >
                              {total_cost}
                            </Text>
                          </View>

                          <View style={styles.galleryContainer}>
                            {launch_detail?.mfg_photos.length > 0 &&
                              launch_detail.mfg_photos.map((item, index) => {
                                return (
                                  // {GAME_GALLERY.map((item, index) => (
                                  <TouchableOpacity
                                    key={Math.random()}
                                    style={styles.galleryGrid}
                                  >
                                    <Image
                                      // source={item.src} //item.image+base_url
                                      source={{
                                        uri: Configs.NEW_COLLECTION_URL + item,
                                      }}
                                      style={styles.galleryImg}
                                      resizeMode="contain"
                                    />
                                  </TouchableOpacity>
                                );
                              })}
                          </View>

                          <View style={styles.newRow}>
                            <Text style={styles.rowLebal}>Comments </Text>
                            <Text style={styles.rowValue}>
                              {launch_detail?.comments}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <Text style={styles.noData}>
                          Launch details not records
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          </>
        )}

        <ImageView
          visible={this.state.isGalleryImageViewerOpen}
          images={this.getGalleryImages()}
          imageIndex={this.state.selectedGalleryImageIndex}
          onRequestClose={this.closeGalleryImageViewer}
        />

        <Modal
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          visible={this.state.isModalOpen}
          onRequestClose={this.toggleModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBody}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.modalBtn}
                onPress={this.gotoPartsList}
              >
                <Text style={styles.modalBtnText}>Loading / Part List</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.modalBtn}
                onPress={this.gotoProductListingDetails}
              >
                <Text style={styles.modalBtnText}>Product Listing Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.modalBtn, styles.modalBtn]}
                onPress={this.gotoProductLaunchDetails}
              >
                <Text style={styles.modalBtnText}>Product Launch Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={this.toggleModal}
              >
                <Ionicons name="close-outline" style={styles.closeButtonText} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.modalBtn, styles.modalBtn]}
                onPress={this.gotoGameImage}
              >
                <Text style={styles.modalBtnText}>Game Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.modalBtn, styles.mb0]}
                onPress={this.gotoGameTag}
              >
                <Text style={styles.modalBtnText}>Game Tag</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={this.toggleModal}
              >
                <Ionicons name="close-outline" style={styles.closeButtonText} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/*Video Playback Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          // visible={this.state.isPlaybackModalOpen}
          visible={false}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
            <View style={[styles.modalContainer, { backgroundColor: "#000" }]}>
              <View style={styles.playbackModalBody}>
                <Video
                  useNativeControls={true}
                  resizeMode="contain"
                  isLooping={false}
                  source={{
                    // uri: `http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4`,
                    uri: `${this.state.videoUrl}`,
                  }}
                  style={styles.video}
                  shouldPlay={true}
                  // onLoadStart={() => console.log("Started***********")}
                  // onLoad={() => console.log("Loaded***********")}
                  progressUpdateIntervalMillis={50}
                />

                {/* youtube video play */}
                {/* <View>
                  <YoutubePlayer
                    height={300}
                    width={windowWidth}
                    play={true}
                    videoId={this.state.videoid}
                  />
                </View> */}
                <TouchableOpacity
                  style={[styles.closeButton, { top: 50, right: 20 }]}
                  onPress={this.closePlaybackModal}
                >
                  <Ionicons
                    name="close-outline"
                    style={styles.closeButtonText}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  };
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const tabHeight = 50;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  gameDetails: {
    flex: 1,
    padding: 0,
  },
  gameBannerContainer: {
    width: "100%",
    height: 320,
  },
  gameBanner: {
    height: 310,
    width: "100%",
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textColor,
    alignSelf: "center",
    marginTop: 2,
  },
  gameDesc: {
    fontSize: 14,
    color: Colors.textColor,
    textAlign: "justify",
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
        ? Math.floor((windowWidth - 10) / 3.1)
        : Math.floor((windowWidth - 10) / 3),
    height: 95,
    alignItems: "center",
    justifyContent: "center",
    // marginHorizontal: 1,
    margin: 2,
    // borderRadius: 5
    // borderTopLeftRadius:
  },
  galleryImg: {
    width:
      Platform.OS === "android"
        ? Math.floor((windowWidth - 10) / 3.2)
        : Math.floor((windowWidth - 10) / 3.1),
    height: "100%",
  },
  gameDataText: {
    fontSize: 14,
    color: Colors.textColor,
  },
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
  modalBtn: {
    flexDirection: "row",
    width: 200,
    height: 35,
    marginBottom: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderRadius: 5,
  },
  playbackModalBody: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#000",
    width: windowWidth,
    height: windowHeight,
    padding: 15,
    borderRadius: 5,
    elevation: 5,
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: 310,
    // height: Math.floor(windowHeight / 4),
  },

  modalBtnText: {
    fontSize: 16,
    color: Colors.white,
  },
  mb0: {
    marginBottom: 0,
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

  heading: {
    color: Colors.textColor,
    fontSize: 18,
  },
  newRow: {
    marginTop: 10,
    borderBottomColor: "silver",
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  rowLebal: {
    fontSize: 16,
    marginBottom: 5,
  },
  rowValue: {
    //fontSize: 18,
    color: Colors.textColor,
  },

  //Table

  thead: {
    flexDirection: "row",
    height: 45,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.textInputBorder,
    borderBottomColor: Colors.textInputBorder,
    backgroundColor: Colors.textInputBg,
  },

  tbody: {
    flexDirection: "row",
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textInputBorder,
  },

  tdLeft: {
    flex: 1.3,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: Colors.textInputBorder,
    borderRightColor: Colors.textInputBorder,
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  tdRight: {
    flex: 0.7,
    alignItems: "flex-end",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: Colors.textInputBorder,
    paddingHorizontal: 6,
  },

  ///Tab

  tabRow: {
    width: "100%",
    height: tabHeight,
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: Colors.lightGrey,
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 15,
  },

  activeTab: {
    height: tabHeight,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  activeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  inActiveText: {
    fontSize: 16,
    color: "silver",
    opacity: 0.8,
  },

  tabContainer: {
    flex: 1,
    padding: 8,
    //height: windowHeight - tabHeight,
  },

  noData: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    //fontSize:18,
    color: "red",
  },
  btn: {
    flexDirection: "row",
    width: 150,
    height: 45,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    width: 150,
    height: 45,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 1,
  },

  productId: {
    fontSize: 12,
    fontStyle: "italic",
  },
});
