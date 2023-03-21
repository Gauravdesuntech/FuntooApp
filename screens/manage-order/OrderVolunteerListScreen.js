import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import EmptyScreen from "../../components/EmptyScreen";
import {
  GetOrderDeliveryVolunteerList,
  DeleteOrderVenderVolunteer,
} from "../../services/OrderService";
import emitter from "../../helper/CommonEmitter";
import { Item } from "native-base";

export default class OrderVolunteerListScreen extends Component {
  constructor(props) {
    super(props);
    this._emitter = emitter;
    this.state = {
      mobileno: [],
      list: [],
      game_id: this.props.route.params.game_id,
      order_id: this.props.route.params.order_id,
      isLoading: false,
      refreshing: false,
    };
  }

  componentDidMount = (item) => {
    this.focusListner = this.props.navigation.addListener("focus", () => {
      this.getData();
    });
  };

  componentWillUnmount() {
    this.focusListner();
  }

  getData = () => {
    this.setState({
      isLoading: true,
    });
    GetOrderDeliveryVolunteerList({
      order_id: this.state.order_id,
      game_id: this.state.game_id,
    })
      .then((response) => {
        console.log(response.data);
        if (response.is_success) {
          for (let i = 0; i < response.data.length; i++) {
            let obj = {
              name: response.data[i].name,
              mobile: response.data[i].mobile,
            };

            this.state.mobileno.push(obj);
            this.setState({
              mobileno: this.state.mobileno,
            });
            console.log("......OOO...................", this.state.mobileno);
            //console.log("......yuyuyuyuyuyuyuyuy...................", response);
          }

          this.setState({
            list: response.data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({
          isLoading: false,
          refreshing: false,
        });
      });
  };

  onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.getData();
    });
  };

  gotoAddVolunteer = () => {
    this.props.navigation.navigate("OrderVolunteerAdd", {
      order_id: this.state.order_id,
      game_id: this.state.game_id,
    });
  };

  //   handlechange = (item) => {
  //     this.state.mobileno.push(item);

  //     this.setState({
  //       mobileno: this.state.mobileno,
  //     });
  //     alert("hello");
  //     console.log("......OOO...................", this.state.mobileno);
  //   };

  DeleteVolunteer = (item) => {
    Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this volunteer?",
      [
        {
          text: "Yes",
          onPress: () => {
            this.setState(
              {
                list: this.state.list.filter(
                  (singleItem) => singleItem.id !== item.id
                ),
                isLoading: true,
              },
              () => {
                DeleteOrderVenderVolunteer(item)
                  .then((result) => {
                    if (result.is_success) {
                      const isVolRequirmentComplete =
                        parseInt(result.data.is_volunteer_proof_done) == 1
                          ? true
                          : false;
                      this._emitter.emit(
                        "volRequirmentComplete",
                        isVolRequirmentComplete
                      );
                    }
                  })
                  .catch((e) => console.log(e))
                  .finally(() => {
                    this.setState({
                      isLoading: false,
                    });
                  });
              }
            );
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  renderEmptyContainer = () => {
    return <EmptyScreen />;
  };

  renderListItem = ({ item }) => {
    return (
      <SafeAreaView
        key={item.id.toString()}
        style={[
          styles.listItem,
          { justifyContent: "space-between", flexDirection: "row" },
        ]}
      >
        <View style={{ paddingLeft: 10, width: "90%" }}>
          <Text style={[styles.subText, { fontWeight: "bold" }]}>
            {item.name}
          </Text>
          <Text style={styles.subText}>Mobile: {item.mobile}</Text>
          <Text style={styles.subText}>Vender: {item.vender_name}</Text>
        </View>
        <View>
          {/* <TouchableOpacity onPress={() => this.handlechange(item.mobile)}>
            <Text> Click</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={{ padding: 3 }}
            onPress={() =>
              this.props.navigation.navigate("OrderVolunteerUpdate", {
                item: item,
              })
            }
          >
            <MaterialIcons name="create" size={22} color={Colors.success} />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 3 }}>
            <MaterialIcons
              name="delete"
              size={22}
              color={Colors.danger}
              onPress={this.DeleteVolunteer.bind(this, item)}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  render = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Volunteer" addAction={this.gotoAddVolunteer} />
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <FlatList
            data={this.state.list}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.renderListItem}
            ListEmptyComponent={this.renderEmptyContainer()}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          />
        )}
        {/* <OrderDeliveryProofs data={this.getData} /> */}
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
    paddingLeft: 10,
  },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 40,
  },
  name: {
    fontSize: 18,
    color: Colors.grey,
  },
  qtyContainer: {
    height: 25,
    width: 25,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  qty: {
    fontSize: 14,
    color: Colors.white,
    textAlign: "center",
  },
  subText: {
    color: Colors.grey,
    opacity: 0.8,
    fontSize: 14,
    lineHeight: 22,
  },
});
