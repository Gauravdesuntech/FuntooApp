import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import Colors from "../../config/colors";
import OverlayLoader from "../../components/OverlayLoader";
import Header from "../../components/Header";
import { GetOrder, UpdateOrderItems } from "../../services/OrderService";
import ProgressiveImage from "../../components/ProgressiveImage";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import EmptyScreen from "../../components/EmptyScreen";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";
import NumericInput from "react-native-numeric-input";
import { SearchGameForUpdateOrder } from "../../services/GameApiService";
import AwesomeAlert from "react-native-awesome-alerts";
import PressableButton from "../../components/PressableButton";
import CachedImage from 'expo-cached-image';

let debouceTimerId = null;

export default class EditOrderedGames extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      orderDetails: this.props.route.params.orderDetails,
      currentGamesList: [],
      gameAddModalVisible: false,
      searchQuery: "",
      searchLists: [],
      isSearching: false,
      isSearchedPreviously: false,
      showAlertModal: false,
      alertTitle: "",
      alertMessage: "",
      loading: false,
      modalCallBackRef: () => { },
    };
    this.debounceTimerId = null;
  }

  componentDidMount() {
    const lineItems = this.state.orderDetails.line_items;
    let currentGamesList = [];
    lineItems.forEach((item) => {
      currentGamesList.push({
        game_id: item.game_id,
        game: item.game,
        quantity: item.quantity,
      });
    });
    this.setState({
      currentGamesList: currentGamesList,
    });
  }

  goBack = () => {
    this.setState(
      {
        showAlertModal: false,
      },
      () => {
        this.props.navigation.navigate("EventEnquiryDetail", {
          itemID: 1,
        });
      }
    );
  };

  closeAlertModal = () => {
    this.setState({
      showAlertModal: false,
    });
  };

  selectSearchedGame = (item) => {
    this.setState({
      gameAddModalVisible: false,
      searchQuery: "",
      searchLists: [],
      isSearchedPreviously: false,
    });

    // find index
    let index = this.state.currentGamesList.findIndex(
      (currentItem) => currentItem.game_id == item.game_id
    );
    if (index == -1) {
      let currentItems = this.state.currentGamesList;
      currentItems.push(item);
      this.setState({
        currentGamesList: currentItems,
      });
    } else {
      // means game already exist show alert to user
      // this.setState({
      //     showAlertModal: true,
      //     alertTitle: 'Alert',
      //     alertMessage: 'Game already exist',
      //     modalCallBackRef: this.closeAlertModal
      // })
      Alert.alert("Look out!", "Game already exist!", [{ text: "OK" }]);
    }
  };

  updateOrderedGames = () => {
    let games = [];
    this.state.currentGamesList.forEach((item) => {
      games.push({
        game_id: item.game_id,
        quantity: item.quantity,
        price: Math.trunc(item.game.rent),
      });
    });
    let data = {
      order_id: this.state.orderDetails.id,
      customer_id: this.state.orderDetails.customer_id,
      games: JSON.stringify(games),
      requestedBy: "admin",
    };

    this.setState({ loading: true });
    UpdateOrderItems(data)
      .then((result) => {
        if (result.is_success) {
          this.setState({
            showAlertModal: true,
            alertTitle: "Success",
            alertMessage: "Order Updated successfully",
            modalCallBackRef: this.goBack,
            loading: false,
          });
        } else {
          this.setState({
            showAlertModal: false,
            alertTitle: "Error",
            alertMessage: result.message,
            modalCallBackRef: this.goBack,
            loading: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      })
      .finally(() => this.setState({ isLoading: false, loading: false }));
  };

  searchGames = () => {
    this.setState({
      isSearching: true,
      isSearchedPreviously: true,
    });

    SearchGameForUpdateOrder({ q: this.state.searchQuery })
      .then((result) => {
        this.setState({
          isSearching: false,
          searchLists: result.data,
        });
      })
      .catch((err) => console.log(err));
  };

  handleDelete = (item) => {
    let finalList = this.state.currentGamesList.filter(
      (gameData) => gameData.game_id !== item.game_id
    );
    this.setState({
      currentGamesList: finalList,
    });
  };

  addGame = () => {
    this.setState({
      isLoading: false,
      gameAddModalVisible: true,
    });
  };

  handleQtyChange = (value, item) => {
    let findIndex = this.state.currentGamesList.findIndex(
      (gameItem) => gameItem.game_id == item.game_id
    );
    let gameList = this.state.currentGamesList;
    if (findIndex != -1) {
      gameList[findIndex].quantity = value;
      this.setState({
        currentGamesList: gameList,
      });
    }
  };

  removeGameFromList = (item) => {
    let newItem = this.state.currentGamesList.filter(
      (currentItem) => currentItem.game_id != item.game_id
    );
    this.setState({
      currentGamesList: newItem,
    });
  };

  render() {
    // console.log(this.state.gameAddModalVisible);
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Header title="Edit Games" addAction={this.addGame} />
          <Modal
            isVisible={this.state.gameAddModalVisible}
            onBackdropPress={() => {
              this.setState({
                gameAddModalVisible: false,
                searchQuery: "",
                searchLists: [],
                isSearchedPreviously: false,
              });
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                padding: 25,
              }}
            >
              <View style={styles.inputContainer}>
                <Text style={styles.inputLable}>Find Games:</Text>
                <TextInput
                  value={this.state.searchQuery}
                  autoCompleteType="off"
                  autoCapitalize="words"
                  placeholder="Type to search..."
                  style={styles.textInput}
                  onChangeText={(text) =>
                    this.setState({ searchQuery: text }, () => {
                      if (debouceTimerId) {
                        clearTimeout(debouceTimerId);
                      }
                      debouceTimerId = setTimeout(() => {
                        this.searchGames();
                      }, 1000);
                    })
                  }
                />
              </View>

              <View>
                {this.state.isSearching ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <>
                    {this.state.isSearchedPreviously && (
                      <SearchedGameList
                        items={this.state.searchLists}
                        onSelectSearchedGame={(item) =>
                          this.selectSearchedGame(item)
                        }
                      />
                    )}
                  </>
                )}
              </View>
            </View>
          </Modal>

          <>
            {this.state.currentGamesList.length == 0 ? (
              <EmptyScreen
                header={"Oops! no games are present"}
                message={"Try to add one"}
              />
            ) : (
              <View style={styles.form}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.rowContainer}>
                    <View style={{ marginBottom: 10 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: Colors.grey,
                          opacity: 0.8,
                        }}
                      >
                        Games
                      </Text>
                    </View>

                    {this.state.currentGamesList?.map((item) => {
                      // console.log("........game.image_url...........",item.game.image_url.split('.')[1].split('/')[5])
                      return (
                        <View
                          key={item.game_id.toString()}
                          style={styles.listRow}
                        >
                          <View style={{ flexDirection: "row" ,justifyContent:'space-between' }}>
                            <View style={{ width: "20%" }}>
                              {/* <ProgressiveImage
                                source={{ uri: item.game.image_url }}
                                style={{ height: 57, width: "100%" }}
                                resizeMode="cover"
                              /> */}
                              <CachedImage
                                style={{ height: 57, width: "100%" }}
                                source={{ uri: item.game.image_url }}
                                resizeMode="cover"
                                cacheKey={`${item.game.image}+${item.name}`} 
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
                            <View
                              style={{
                                width: "40%",
                                flexWrap: "wrap",
                                paddingLeft: 10,
                              }}
                            >
                              <Text
                                style={[styles.titleText]}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {item.game.name}
                              </Text>
                              <NumericInput
                                value={parseInt(item.quantity)}
                                minValue={0}
                                maxValue={3}
                                step={1}
                                editable={false}
                                totalHeight={20}
                                totalWidth={60}
                                rounded
                                onLimitReached={(isMax, msg) => {
                                  if (isMax === false) {
                                    this.removeGameFromList(item);
                                  }
                                }}
                                textColor={Colors.black}
                                iconStyle={{ color: Colors.black }}
                                onChange={(value) => {
                                  this.handleQtyChange(value, item);
                                }}
                                inputStyle={{
                                  borderLeftWidth: 0,
                                  borderRightWidth: 0,
                                }}
                                containerStyle={{ marginTop: 5 }}
                                rightButtonBackgroundColor={"#dfdfdf"}
                                leftButtonBackgroundColor={"#dfdfdf"}
                              />
                            </View>
                            <View style={{ width: "25%", }}>
                              <Text style={styles.inputLable}>Price</Text>
                              <Text style={styles.inputLable}>
                                <FontAwesome
                                  name="rupee"
                                  size={13}
                                  color={Colors.grey}
                                />
                                {Math.trunc(item.game.rent)}
                              </Text>
                            </View>
                            {/* <View style={{ width: "15%" }}>
                              <MaterialIcons name="delete-outline" size={30} color="black" onPress={() => this.handleDelete(item)} />
                            </View> */}
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* <PressableButton text={'Save'} onPress={ this.updateOrderedGames } /> */}
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={
                      !this.state.loading ? this.updateOrderedGames : () => { }
                    }
                  >
                    {this.state.loading ? (
                      <ActivityIndicator color={"#fff"} />
                    ) : (
                      <Text style={{ fontSize: 18, color: Colors.white }}>
                        Save
                      </Text>
                    )}
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </>

          <AwesomeAlert
            show={this.state.showAlertModal}
            showProgress={false}
            title={this.state.alertTitle}
            message={this.state.alertMessage}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="OK"
            confirmButtonColor={Colors.primary}
            onConfirmPressed={() => this.state.modalCallBackRef()}
          />
        </View>
      </SafeAreaView>
    );
  }
}

function SearchEmptyScreen() {
  return (
    <>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <LottieView
          style={{
            width: 80,
            height: 80,
            //backgroundColor: '#eee',
          }}
          source={require("../../assets/lottie/no-result-found.json")}
          autoPlay
          loop
        />
      </View>

      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Text style={{ fontSize: 15, color: "red" }}>
          We've searched near and far.
        </Text>
        <Text style={{ fontSize: 10, color: "grey" }}>
          No games are found. Try another spelling or different terms.
        </Text>
      </View>
    </>
  );
}

function SearchedGameList({ items, onSelectSearchedGame }) {
  if (items.length == 0) {
    return <SearchEmptyScreen />;
  }
  return (
    <ScrollView>
      <View style={{ alignItems: "center", marginVertical: 10 }}>
        <Text style={{ fontSize: 16 }}>Matched Games</Text>
      </View>
      <ScrollView>
        {items.map((item) => {
          return (
            <View
              style={{
                borderBottomColor: Colors.lightGrey,
                borderBottomWidth: 1,
                marginVertical: 10,
              }}
              key={item.game_id}
            >
              <Pressable
                onPress={() => {
                  onSelectSearchedGame(item);
                }}
                style={{ flexDirection: "row", alignItems: 'center', paddingVertical: 3 }}
              >
                <View style={{ width: "20%" }}>
                  {/* <ProgressiveImage
                    source={{ uri: item.game.image_url }}
                    style={{ height: 40, width: "100%" }}
                    resizeMode="cover"
                  /> */}
                   <CachedImage
                                style={{ height: 57, width: "100%" }}
                                source={{ uri: item.game.image_url }}
                                resizeMode="cover"
                                cacheKey={`${item.game.image}+${item.id}`} 
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
                <View
                  style={{
                    width: "40%",
                    // flexWrap: "wrap",
                    paddingLeft: 10,
                  }}
                >
                  <Text
                    style={[styles.titleText,]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.game.name}
                  </Text>
                </View>
                <View style={{ width: "25%" }}>
                  <Text style={[styles.inputLable, { marginBottom: 0, padding: 0, fontSize: 14 }]}>Price</Text>
                  <Text style={[styles.inputLable, { marginBottom: 0, padding: 0, fontSize: 14 }]}>
                    <FontAwesome name="rupee" size={13} color={Colors.grey} />
                    {Math.trunc(item.game.rent)}
                  </Text>
                </View>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  rowContainer: {
    paddingHorizontal: 6,
    backgroundColor: Colors.white,
    borderRadius: 4,
    elevation: 10,
    margin: 10,
    shadowColor: Colors.grey,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  row: {
    marginTop: 0,
    flexDirection: "row",
    marginBottom: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: "#cfcfcf",
    // backgroundColor:'red'
  },
  rowlast: {
    marginTop: 0,
    flexDirection: "row",
    marginBottom: 0,
    // borderBottomWidth: 1.5,
    // borderBottomColor: '#cfcfcf'
  },
  rowLeft: {
    width: "47%",
    backgroundColor: "#fff",
    paddingLeft: 0,
    paddingVertical: 10,
    justifyContent: "center",
    marginTop: 0,
  },
  rowRight: {
    paddingLeft: 0,
    paddingVertical: 10,
    // flexDirection: "row",
    justifyContent: "center",
    width: "53%",
    marginLeft: 0,
    // backgroundColor: 'red',
    marginTop: 0,
    // justifyContent: 'space-evenly',
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
    opacity: 0.8,
  },
  inputLable: {
    fontSize: 14,
    color: Colors.black,
    marginBottom: 0,
    opacity: 0.8,
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
    fontSize: 16,
    color: Colors.grey,
    marginBottom: 10,
    opacity: 0.8,
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
    height: 50,
    width: "100%",
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },

  desc: {
    fontSize: 14,
    color: Colors.grey,
    marginBottom: 3,
    fontWeight: "normal",
    opacity: 0.9,
  },

  listRow: {
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },

  titleText: {
    fontSize: 14,
    color: Colors.grey,
    marginBottom: 2,
    opacity: 0.8,
  },
});
