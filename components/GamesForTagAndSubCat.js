import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator
} from "react-native";
import Carousel from "react-native-x2-carousel";
import Loader from "./Loader";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import CustomImage from "./CustomImage";
import { useNavigation } from "@react-navigation/native";
import { GameListByTagId } from "../services/TagApiServices";
import { SliderBox } from "react-native-image-slider-box";
import CachedImage from 'expo-cached-image';

class GamesForTagAndSubCat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      games: [],
      gamesImg: [],
      isLoading: false,
    };
  }

  componentDidUpdate(prevProp) {
    if (this.props.id != prevProp.id || this.props.sort_type != prevProp.sort_type) {
      this.fetchData();
    }
  }

  componentDidMount() {
    this.fetchData();
  }


  fetchData = () => {
    if (this.props.type == "for_tags") {
      this.setState({
        isLoading: true,
      });
      GameListByTagId(this.props.id)
        .then((result) => {
          // console.log('.....GamesForTagAndSubCat ....result..........',result)
          let allData= [];
          if(this.props.sort_type == 'Dcen rent'){
            let value = result.data.sort((a, b) => parseFloat(b.rent) - parseFloat(a.rent));
            allData=value
                    }
          else if(this.props.sort_type == 'Acen rent'){
            let value = result.data.sort((a, b) => parseFloat(b.rent) - parseFloat(a.rent));
            let data = value.reverse()
            allData=data
                    }
          else if(this.props.sort_type == 'Clear'){
            allData=result.data;
            this.props.clearData();
          }else{
            allData=result.data;
          }
          let urlData = allData.map((item) => {
            return {
              id: item.id,
              image:  item.image,
            };
          });
          this.setState({
            games: allData,
            gamesImg: urlData,
          });
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this.setState({
            isLoading: false,
          });
        });
    } else {
    }
  };

  gotoGameDetailsProps = (item) => {
    // console.log("........data.........",item)
    this.props.navigation.navigate("GameDetails", {
      game_id: item,
    });
  };
  gotoGameDetails = (item) => {
    // console.log("........data.........",item.id)
    this.props.navigation.navigate("GameDetails", {
      game_id: item.id,
    });
  };

  renderItem = (data) => {
    let image_url =  data.image;
    // console.log(".........data...........",data.image)
    return (
      <TouchableOpacity onPress={() => this.gotoGameDetails(data)} >
        <View key={data.image.split("game")[1]} style={styles.item}>
          <CachedImage
            style={{ height: "100%", width: "100%" }}
            source={{ uri: image_url }}
            resizeMode="cover"
            cacheKey={data.image.split("game")[1]} 
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
        </View>
      </TouchableOpacity>
    );
  };

  renderGalleryItem = ({ item }) => { };

  render() {
    return (
      // <>
      //     {this.state.isLoading ?? <Loader />}

      //     {
      //         this.state.games.length > 0 ? (
      //             <>
      //                 <View style={{ width: '100%', height: 300 }}>
      //                     <Carousel
      //                         pagination={Pagination}
      //                         renderItem={this.renderCarouselItem}
      //                         data={this.state.games}
      //                     />
      //                 </View>

      //                 <View style={styles.box} >
      //                     <Text style={styles.title}>Games</Text>
      //                     <View style={styles.galleryContainer}>
      //                         {this.state.games.length > 0
      //                             && this.state.games.map((item, index) => {
      //                                 let image_url = Configs.NEW_COLLECTION_URL + item.image;
      //                                 return (
      //                                     <TouchableOpacity
      //                                         key={item.id.toString()}
      //                                         style={styles.galleryGrid}
      //                                         onPress={() => this.gotoGameDetails(item)}
      //                                     >
      //                                         <CustomImage
      //                                             source={{ uri: image_url }}
      //                                             style={styles.galleryImg}
      //                                             resizeMode="contain"
      //                                         />
      //                                     </TouchableOpacity>
      //                                 );
      //                             })
      //                         }
      //                     </View>
      //                 </View>

      //             </>
      //         ) :
      //         <EmptyScreen />
      //     }
      // </>

      <>
        <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
          {this.state.isLoading ? (
            <View style={{ width: "100%", height: windowheight }}>
              <Loader />
            </View>
          ) : (
            <>
              {this.state.games.length > 0 ? (
                <>
                  <View style={{ width: "100%", height: 300 }}>
                    <Carousel
                      loop={true}
                      autoplay={true}
                      autoplayInterval={3000}
                      renderItem={this.renderItem}
                      data={this.state.games}
                    />

                    {/* <SliderBox
                      images={this.state.gamesImg}
                      firstItem={1}
                      sliderBoxHeight={300}
                      goTo={this.gotoGameDetailsProps}
                      // mainData={this.gotoGameDetails(this.state.games)}
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
                  </View>

                  <View style={styles.box}>
                    <View style={styles.galleryContainer}>
                      {this.state.games.length > 0 &&
                        this.state.games.map((item, index) => {
                          let image_url =
                             item.image;
                          return (
                            <>
                              <TouchableOpacity
                                key={item.id.toString()}
                                style={[
                                  styles.galleryGrid,
                                  {
                                    margin: 2,
                                    borderWidth: 0.6,
                                    borderColor: "rgba(223,223,223,0.6)",
                                  },
                                ]}
                                onPress={() => this.gotoGameDetails(item)}
                              >
                                {/* {Platform.OS == 'ios' ? (
                                                                            <Image
                                                                                source={{ uri: image_url }}
                                                                                style={styles.galleryImg}
                                                                                resizeMode="contain"
                                                                            />
                                                                        ) : (
                                                                            <CustomImage
                                                                                source={{ uri: image_url }}
                                                                                style={styles.galleryImg}
                                                                                resizeMode="contain"
                                                                            />)} */}
                                <CachedImage
                                  source={{ uri: image_url }}
                                  style={styles.galleryImg}
                                  resizeMode="contain"
                                  cacheKey={item.image.split("game")[1]} 
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
                                <View
                                  style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "99%",
                                    alignSelf: "center",
                                  }}
                                >
                                  <Text
                                    style={styles.titleText}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                  >
                                    {item.name}
                                  </Text>
                                  <View style={[styles.price]}>
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {/* <Text style={{ color: Colors.black, opacity: 0.6, fontSize: 12 }}>{'('}</Text> */}
                                        <Text
                                          style={{
                                            fontSize: 7,
                                            paddingTop:
                                              Platform.OS == "ios" ? 1.1 : 2.2,
                                            color: Colors.textColor,
                                            fontStyle: "italic",
                                          }}
                                        >
                                          {"₹"}
                                        </Text>
                                        <Text
                                          style={{
                                            color: Colors.textColor,
                                            fontStyle: "italic",
                                            fontSize: 10,
                                          }}
                                        >
                                          {Math.trunc(item.rent)}
                                        </Text>
                                        {/* <Text style={{ fontSize: 7, paddingTop: Platform.OS == 'ios' ? 1 : 1.8, color: Colors.black, opacity: 0.6 }}>{"00"}</Text> */}
                                        {/* <Text style={{color: Colors.black, opacity: 0.6, fontSize: 12}}>{')'}</Text> */}
                                      </View>
                                    </View>
                                  </View>
                                  {/* <Ionicons
						                                                        onPress={() => this.handleDelete(this.context.userData.id, item.game_id, item.rent * item.qty, 0)}
						                                                        name="trash-outline" size={15} color={Colors.grey} style={styles.trash} /> */}
                                </View>
                              </TouchableOpacity>
                            </>
                          );
                        })}
                    </View>
                  </View>
                </>
              ) : null}
            </>
          )}
        </ScrollView>
      </>
    );
  }
}

export default function (props) {
  const navigation = useNavigation();

  return <GamesForTagAndSubCat {...props} navigation={navigation} />;
}

const windowheight = Dimensions.get("window").height;
const windowwidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    width: windowwidth,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  listItemTouch: {
    borderBottomColor: Colors.textInputBorder,
    padding: 2,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 0,
    marginHorizontal: 5,
  },
  listItem: {
    borderBottomColor: Colors.textInputBorder,
    width: "100%",
    //justifyContent: 'flex-start'
  },
  left: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
    borderWidth: 1,
  },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 140,
  },
  name: {
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 3,
  },

  text: {
    fontSize: 20,
  },

  price: {
    // width: "30%",
  },

  priceText: {
    fontSize: 18,
    color: Colors.textColor,
  },
  radioItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  radioLabel: {
    fontSize: 18,
    color: Colors.textColor,
    opacity: 0.9,
  },
  image: {
    height: 300,
  },
  carousel: {
    height: 280,
    width: "100%",
    marginHorizontal: 0,
    borderRadius: 3,
  },
  carouselImg: {
    height: "100%",
    width: "100%",
  },
  box: {
    marginTop: 20,
    padding: 1,
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
        : Math.floor((windowwidth - 10) / 3.2),
    // height: Math.floor((windowwidth - 10) / 3),
    marginRight: Platform.OS === "android" ? 3 : 3,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    // marginBottom: 5,
    borderWidth: 0.6,
    borderColor: "rgba(223,223,223,0.6)",
    padding: 5,
    paddingBottom: 10,
    // marginRight: 3,
  },
  galleryImg: {
    width:
      Platform.OS === "android"
        ? Math.floor((windowwidth - 10) / 3.3)
        : Math.floor((windowwidth - 10) / 3.3),
    // height: Math.floor((windowwidth - 10) / 3),
    height: "78%",
    padding: 5,
    marginTop: 10,
  },
});
