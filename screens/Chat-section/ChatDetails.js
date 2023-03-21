import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import { GiftedChat, Bubble, Actions, ActionsProps } from 'react-native-gifted-chat';
import firebase from "../../config/firebase";
import Header from "../../components/Header";
import AppContext from "../../context/AppContext";
import Colors from "../../config/colors";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { showDateAsClientWant, showTimeAsClientWant } from "../../utils/Util";
import Loader from "../../components/Loader";
import { message_and_notify } from "../../services/ChatService";
import { get_unread_message, update_admin_unread_message,get_individual_unread_message } from "../../services/ChatService";
import { SearchAllType } from "../../services/GameApiService";
import Configs from "../../config/Configs";
import CachedImage from 'expo-cached-image';
import * as ImagePicker from "expo-image-picker";
import { getFileData } from "../../utils/Util";
import RBSheet from "react-native-raw-bottom-sheet";
import { add_image } from "../../services/GameApiService";
import ProgressBarAnimated from 'react-native-progress-bar-animated';

export default class ChatDetails extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.route.params.orderItem,
      // orderData:this.props.route.params.orderItem,
      messages: [],
      lastID: 0,
      nextID: 0,
      firstChat: false,
      showModal: false,
      isLoading: true,
      is_image_loading: false,
      searchValue: '',
      list: [],
      link: [],
      cust_id: null,
      imageURI: undefined,
      imageData: undefined,
      sendimageURI: undefined,
      sendimageData: undefined,
      uploadProgress: 0,
      res_abort: false,
      loadDataCount:30
    };
  }
  componentDidMount() {
    this.loadData();
    let data = {
      sender_id: this.state.data.cust_code
    }
    update_admin_unread_message(data).then(res => {
    });
    let receiver_id = {
      receiver_id: this.context.userData.cust_code
    }
    get_unread_message(receiver_id).then(res => {
      this.context.setTotalUnreadChatQuantity(res.count)
    });
  }
 
  chooseImage = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        this.setState({
          imageURI: undefined,
          imageData: undefined,
        });

        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: true,
          // aspect: [1, 1],
          // quality: 1,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            // console.log('...image url.....',result.uri);
            this.setState({
              imageURI: result.uri,
              imageData: getFileData(result),
            });
            //   let link = [{
            //   image:result.uri
            // }]
            //   this.onSend(link)

          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an icon");
      }
    });
  };

  loadData = () => {
    this.setState({ isLoading: true })
    firebase
      .database()
      .ref(
        // "message/" +
        // `U00001` +
        // `/${this.state.data.cust_code}`+
        // `/${this.state.orderData.id}`
        "message/" +
        `U00001` +
        `/${this.state.data.cust_code}`
      ).limitToLast(this.state.loadDataCount)
      .on("value", (value) => {

        if ((value.val()) != null) {
          let arrayOfObj = Object.entries(value.val()).map((e) => e[1]);
          let lastObject = arrayOfObj.slice(-1);
          this.setState({
            messages: arrayOfObj.reverse(),
            lastID: parseInt(lastObject[0]._id),
            nextID: parseInt(lastObject[0]._id) + 1,
            firstChat: false,
            isLoading: false,
          })
        } else {
          this.setState({
            nextID: 1,
            firstChat: true,
            isLoading: false,
          })
        }
      });
  }

  onSend = (messages = []) => {
    // console.log('............sens..........sms...........', messages[0])
    // console.log('............sens..........id...........', this.state.nextID)
    // console.log('............sens..........messages[0]?.image...........', messages[0]?.image)
    // console.log('............this.state.messages...........', this.state.messages)
    // return
    this.setState({
      messages: (previousMessages => GiftedChat.append(previousMessages, this.state.messages))
    })
    let date = new Date().getTime();
    let Newdate = new Date();
    if (messages[0]?.image) {
      firebase
        .database()
        .ref(
          // "message/" +
          // `U00001` +
          // `/${this.state.data.cust_code}`+
          // `/${this.state.orderData.id}`
          "message/" +
          `U00001` +
          `/${this.state.data.cust_code}`
        )
        .push()
        .set(
          {
            _id: this.state.nextID,
            createdAt: date,
            text: messages[0]?.text,
            user: {
              _id: 2,
              name: this.context.userData.name,
              // avatar: 'https://placeimg.com/140/140/any',
            },
            image: messages[0]?.image,
          })
        .catch(alert);
    } else {
      firebase
        .database()
        .ref(
          // "message/" +
          // `U00001` +
          // `/${this.state.data.cust_code}`+
          // `/${this.state.orderData.id}`
          "message/" +
          `U00001` +
          `/${this.state.data.cust_code}`
        )
        .push()
        .set(
          {
            _id: this.state.nextID,
            createdAt: date,
            text: messages[0]?.text,
            user: {
              _id: 2,
              name: this.context.userData.name,
              // avatar: 'https://placeimg.com/140/140/any',
            },
          })
        .catch(alert);
    }


    let data = {
      sender_id: "U00001",
      receiver_id: this.state.data.cust_code,
      title: "New message",
      content: messages[0].text,
      type: "user",
      // time:Newdate
    }
    console.log('........New message........',data);
    message_and_notify(data).then((res) => {
    }).catch(err => {
    })
  }

  sendLink = (data) => {
    let link = [{ text: `funtoo://data/` + data.search_type + `/` + data.id, image: Configs.NEW_COLLECTION_URL + data.image }]
    // let image = Configs.NEW_COLLECTION_URL + data.image;
    this.setState({
      showModal: false,
    })
    this.RBSheetprofile.close();
    this.onSend(link)
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: Colors.primary,
            marginVertical: 2,
            padding: 2
          },
          left: {
            marginVertical: 2,
            padding: 2
          }
        }}
      />
    )
  }
  liveSearch = (value) => {
    this.setState({ query: value })
    SearchAllType(value).then(res => {
      if (res.is_success) {
        this.setState({ list: res.data, isSearching: false })
      } else {
        this.setState({ list: [], isSearching: false })
      }

    }).catch((error) => {
      this.setState({ list: [], isSearching: false })
      Alert.alert("Server Error", error.message);
    })
  }
  renderSearchItem = ({ item }) => {
    let url = item.search_type == "game" ? Configs.NEW_COLLECTION_URL + item.image : Configs.CATEGORY_IMAGE_URL + item.image;
    if (item.search_type == "tag") {
      url = Configs.UPLOAD_PATH + item.image;
    }
    return (
      <TouchableHighlight
        onPress={() => this.sendLink(item)}
        underlayColor={Colors.textInputBg}
      >
        <View style={styles.listItem}>
          <View style={styles.left}>
            <CachedImage
              style={styles.image}
              source={{ uri: url }}
              resizeMode="contain"
              cacheKey={`${item.image}+${item.name}`}
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
          <View style={styles.middle}>
            <Text style={{ fontFamily: 'serif' }}>
              {item.name} ({item.search_type.toString().replace("_", " ")})
            </Text>
          </View>
          <View style={styles.right}>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textInputBorder}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
  showGames = () => {
    this.setState({ showModal: true })
  }
  closeModal = () => {
    this.setState({ showModal: false })
    this.RBSheetprofile.close();
  }

  actionBtn = () => {
    return (<>
      <TouchableOpacity style={{ margin: 8 }}
        //  onPress={this.showGames}
        onPress={() => this.RBSheetprofile.open()}
      >
        <Ionicons name="attach" size={24} color="black" />
      </TouchableOpacity>
      {/* <TouchableOpacity style={{margin:8}} onPress={this.chooseImage}>
        <Ionicons name="camera" size={24} color="black" />
      </TouchableOpacity> */}
    </>

      //  <Actions 
      //  containerStyle={{margin:5,color:'black',position:'absolute',right:'15%',bottom:'1%'}}
      //  icon ={()=>{<Ionicons name="attach" size={24} color="black" />}}
      //  iconTextStyle={{color:"black"}}
      //  onPressActionButton={this.showGames}
      // />

    )
  }
  handelProgress = (event) => {
    if (event.lengthComputable) {
      this.setState({ uploadProgress: (Math.round((event.loaded * 100) / event.total)) });
      // console.log('.....................',(Math.round((event.loaded * 100)/event.total)))
    }
  }
  onImage_upload = (result) => {
    // console.log('.......this.state.res_abort...........', this.state.res_abort);
    return new Promise((resolve, reject) => {
      let res_data = null
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append("send_from", "U00001")
      formData.append("send_to", this.state.data.cust_code)
      formData.append("image", getFileData(result))

      xhr.upload.addEventListener('progress', this.handelProgress)
      xhr.upload.addEventListener('loadend', () => {
        this.setState({ uploadProgress: 100 })
      })
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          () => (xhr.response);
          // console.log('..........response...2.......',JSON.parse(xhr.response))
          res_data = JSON.parse(xhr.response);
          if (this.state.res_abort == false){
          if (res_data.is_success) {
            let link = [{ text: ``, image: res_data.data }]
            // console.log('......link...........', link);
            this.setState({ is_image_loading: false })
            this.onSend(link)

          }
          else {
            alert(res_data.message)
            this.setState({ is_image_loading: false ,})
          }}else{
            this.setState({ is_image_loading: false ,res_abort:false})
          }
        }
      }
      xhr.open('POST', Configs.BASE_URL + "admin/game/add_image")
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(formData)
      if (this.state.res_abort) {
        xhr.abort();
        this.setState({ is_image_loading: false ,res_abort:false})
      }
    })
  }

  chooseSendImage = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: true,
          // aspect: [1, 1],
          // quality: 1,
        };

        ImagePicker.launchImageLibraryAsync(optins).then((result) => {
          if (!result.cancelled) {
            // console.log('........getFileData(result).........',getFileData(result));
            this.setState({
              sendimageURI: result.uri,
              sendimageData: getFileData(result),
            });
            let data = {
              send_to: this.state.data.cust_code,
              send_from: "U00001",
              image: getFileData(result),
            }
            this.setState({ is_image_loading: true })
            // add_image(data)
            this.onImage_upload(result)
            // .then((res) => {
              // console.log('......res...........', res);
            // if (res.is_success) {
            //   let link = [{ text: ``, image: res.data }]
            //   console.log('......link...........', link);
            //   this.setState({ is_image_loading:false})
            //   this.onSend(link)

            // }
            // else {
            //   alert(res.message)
            //   this.setState({ is_image_loading:false })
            // }

            // }).catch(err => { this.setState({ is_image_loading:false}) })
            this.RBSheetprofile.close();
          }
          // console.log(result.uri);
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  };
  openSendCamera = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
      if (status.granted) {
        let optins = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          // allowsEditing: true,
          // aspect: [1, 1],
          // quality: 1,
        };

        ImagePicker.launchCameraAsync().then((result) => {
          if (!result.cancelled) {
            this.setState({
              sendimageURI: result.uri,
              sendimageData: getFileData(result),
            });

            let data = {
              send_to: this.state.data.cust_code,
              send_from: "U00001",
              image: getFileData(result),
            }
            this.setState({ is_image_loading: true })
            this.onImage_upload(result)
            // add_image(data).then((res) => {
            //   // console.log('......res...........', res);
            //   if (res.is_success) {
            //     let link = [{ text: ``, image: res.data }]
            //     this.onSend(link)
            //     this.setState({is_image_loading:false})
            //   }
            //   else {
            //     alert(res.message)
            //     this.setState({is_image_loading:false})
            //   }

            // }).catch(err => { this.setState({ is_image_loading:false}) })

            this.RBSheetprofile.close();
          }
        });
      } else {
        Alert.alert("Warning", "Please allow permission to choose an Image");
      }
    });
  };

  onPressCustomUrl = (text) => {
    this.props.navigation.navigate("GameDetails", {
      game_id: text.split('/')[4],
      cust_code: this.context.userData.cust_code,
      cust_id: this.state.cust_id,
    });
  }

  // onPressPhoneNumber = (number) => {
  //   console.log(number)
  // }

  isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 50;
    return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title={this.state.data.name}
        // searchIcon={true}
        // wishListIcon={true}
        // cartIcon={true}
        />
        {this.state.isLoading ?
          <View style={{ flex: 1 }}>
            <Loader />
          </View>
          :
          <>
            {this.state.is_image_loading ?
              <View style={[styles.uploadingCon]}>
                <Text style={{ alignSelf: 'center', margin: 10, }}>Uploading...</Text>
                <View
                  style={{
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                >
                  <ProgressBarAnimated
                    width={300}
                    value={this.state.uploadProgress}
                    backgroundColorOnComplete={Colors.primary}
                    backgroundColor={Colors.primary}

                  />
                </View>
                <Text style={{ alignSelf: 'center', margin: 10, marginBottom: 30 }}>{this.state.uploadProgress} %</Text>
                <TouchableOpacity
                  style={{ width: 100, height: 40, backgroundColor: Colors.primary, alignItems: 'center' ,justifyContent:'center',marginLeft:'25%',borderRadius:3}}
                  onPress={() => {
                    this.setState({ res_abort: true, is_image_loading: false })
                  }}>
                  <Text style={{ color: Colors.white,}}>Cancel</Text>
                </TouchableOpacity>
              </View>
              :
              <>
                {/* {this.state.firstChat ?
                      <>
                      <View  style={styles.card}>
                      <Text style={styles.desc}>{"Order#: " + this.state.orderData.order_id}</Text>
            <Text style={styles.desc}>{"Event Date: "} {showDateAsClientWant(this.state.orderData.event_start_timestamp)}</Text>
            <Text style={styles.desc}>{"Venue: " + this.state.orderData.venue}</Text>
            <Text style={styles.desc}>Setup by: {showTimeAsClientWant(this.state.orderData.setup_timestamp)}</Text>
            <Text style={styles.desc}>Event Time: {showTimeAsClientWant(this.state.orderData.event_start_timestamp)} - {showTimeAsClientWant(this.state.orderData.event_end_timestamp)}</Text>
            <Text style={styles.desc}>
                {"Client Name: " + (this.state.orderData.customer_name !== null ? this.state.orderData.customer_name : "")}
            </Text>
                      </View>
               <GiftedChat
              messages={this.state.messages}
              onSend={messages =>this.onSend(messages)}
              user={{
                _id: 2,
              }}
              renderBubble={this.renderBubble}
            />
            </>
            : */}

                {/* 11.10.22 */}
                {/* <GiftedChat
              messages={this.state.messages}
              onSend={messages =>this.onSend(messages)}
              user={{
                _id: 2,
              }}
              renderBubble={this.renderBubble}
            /> */}

                <GiftedChat
                  parsePatterns={(linkStyle) => [
                    // { type: 'phone', style: {color: 'white',textDecorationLine: 'underline'}, onPress: this.onPressPhoneNumber },
                    { pattern: /([a-zA-Z]{2,20}):\/\/([\w_-]+(?:(?:\.[\w_-]+)?))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/, style: { textDecorationLine: 'underline' }, onPress: this.onPressCustomUrl },
                  ]}
                  messages={this.state.messages}
                  onSend={messages => this.onSend(messages)}
                  user={{
                    _id: 2,
                  }}
                  renderBubble={this.renderBubble}
                  // alwaysShowSend={true}
                  isLoadingEarlier={true}
                  renderActions={this.actionBtn}
                // onPressActionButton={this.showGames}

                listViewProps={{
                  scrollEventThrottle: 400,
                  onScroll: ({ nativeEvent }) => {
                    if (this.isCloseToTop(nativeEvent)) {
                      let nextData = Number(this.state.loadDataCount) + 30
                      this.setState({
                        loadDataCount: nextData,
                      });
                      this.loadData()
                    }
                  }
                }}

                />

                <RBSheet
                  ref={(ref) => {
                    this.RBSheetprofile = ref;
                  }}
                  height={140}
                  openDuration={250}
                  customStyles={{
                    container: {
                      // justifyContent: "center",
                      // alignItems: "center"
                      padding: 15,
                    },
                  }}
                >
                  <View>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 5,
                      }}
                      onPress={this.openSendCamera}
                    >
                      <Ionicons
                        name="camera-outline"
                        size={24}
                        color={Colors.textColor}
                      />
                      <Text style={{ marginLeft: 20, color: Colors.textColor }}>
                        Take Photo
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 5,
                      }}
                      onPress={this.chooseSendImage}
                    >
                      <Ionicons
                        name="image-outline"
                        size={24}
                        color={Colors.textColor}
                      />
                      <Text style={{ marginLeft: 20, color: Colors.textColor, }}>
                        Choose Image
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 5,
                      }}
                      onPress={this.showGames}
                    >
                      <Ionicons
                        name="browsers-outline"
                        size={24}
                        color={Colors.textColor}
                      />
                      <Text style={{ marginLeft: 20, color: Colors.textColor }}>
                        browse game
                      </Text>
                    </TouchableOpacity>
                  </View>
                </RBSheet>

                {/* } */}
              </>

            }
          </>
        }

        {/* {this.state.is_image_loading ?
 <Modal
visible={true}
> 
 <View style={styles.modalLoadingContainer}> 
   <View style={styles.modalLoadingBody}> 
  <ActivityIndicator
                  color={Colors.primary}
                  size="small"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                />
<Text>Loading...</Text>
    <TouchableOpacity
      onPress={() => this.setState({is_image_loading:false})}
      style={[styles.submitLoadingBtn, { height: 45,marginTop:10 }]}
    >
      <Text style={{ fontSize: 18, color: Colors.white }}>
       Cancel
      </Text>
    </TouchableOpacity>
  </View> 
 </View> 
 </Modal> 
  :null}   */}


        {this.state.showModal ?
          <Modal
            animationType="none"
            transparent={true}
            statusBarTranslucent={true}
            visible={true}
          >
            <SafeAreaView style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.closeBtn}
                    onPress={this.closeModal}
                  >
                    <Ionicons name="close" size={26} color={Colors.textColor} />
                  </TouchableOpacity>
                  <View style={styles.searchContainer}>
                    <Ionicons name="search" size={18} color="#ddd" />
                    <TextInput
                      ref={this.searchInput}
                      value={this.state.searchValue}
                      onChangeText={(searchValue) =>
                        this.setState(
                          {
                            searchValue: searchValue,
                            isSearching: true,
                          }, () => { this.liveSearch(searchValue) }
                        )
                      }
                      autoCompleteType="off"
                      autoCapitalize="none"
                      placeholder={"Search"}
                      style={styles.searchField}
                    />

                  </View>
                </View>

                <View style={styles.modalBody}>
                  {this.state.searchValue.trim().length > 0 ? (
                    this.state.isSearching ? (
                      <Text style={styles.searchingText}>Searching...</Text>
                    ) : (
                      <FlatList
                        data={this.state.list}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.renderSearchItem}
                        initialNumToRender={this.state.list.length}
                        keyboardShouldPersistTaps="handled"
                        ListEmptyComponent={() => (
                          <Text style={styles.searchingText}>No Result Found</Text>
                        )}
                      />
                    )
                  ) : null}
                </View>
              </View>
            </SafeAreaView>
          </Modal>
          : null}

      </SafeAreaView>
    )
  }
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("screen").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  uploadingCon: {
    marginTop: windowHeight / 3,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: 40,
  },
  card: {
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 4,
    // elevation: 10,
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 3,
    fontWeight: "normal",
    // opacity: 0.9,
  },
  modalOverlay: {
    height: windowHeight,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    height: Math.floor(windowHeight * 0.8),
    elevation: 20,
  },
  modalHeader: {
    height: 50,
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ccc",
    elevation: 0.4,
    alignItems: "center",
  },
  closeBtn: {
    width: "10%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    flex: 1,
    paddingVertical: 8,
  },
  searchContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
  },
  searchField: {
    width: "80%",
    paddingVertical: 4,
    color: Colors.textColor,
    fontSize: 15,
  },
  searchingText: {
    fontSize: 12,
    color: Colors.textColor,
    opacity: 0.8,
    alignSelf: "center",
    marginTop: 20,
  },
  listItem: {
    flexDirection: "row",
    borderBottomColor: Colors.textInputBorder,
    borderBottomWidth: 1,
    padding: 10,
  },
  left: {
    width: "20%",
    justifyContent: "center",
  },
  middle: {
    justifyContent: "center",
    flex: 1,
  },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
  },
  submitLoadingBtn: {
    height: 40,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    padding: 8,
    marginBottom: 5,
  },
  modalLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalLoadingBody: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    width: windowWidth - 30,
    minHeight: Math.floor(windowHeight / 4),
    // borderRadius: 5,
    elevation: 5,
    padding: 20,
  },
});