import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  SectionList,
  RefreshControl,
  TextInput,
} from "react-native";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import { GetCustomers ,GetCustomers_unreadChat} from "../../services/OrderService";
import Loader from "../../components/Loader";
import EmptyScreen from "../../components/EmptyScreen";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';
// import { GiftedChat } from 'react-native-gifted-chat';
import { get_individual_unread_message } from "../../services/ChatService";
import AppContext from "../../context/AppContext";

export default class Chat extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      orderData: [],
      isLoading: false,
      refreshing: false,
      individual_unread_message: [],
      showSearch: false,
      searchValue: '',
      AllData:[],
    };
  }
  //   static navigationOptions = ({ navigation }) => ({
  //     title: (navigation.state.params || {}).name || 'Chat!',
  //   });

  componentDidMount() {
    this.loadOrderDetails();
    this.focusListner = this.props.navigation.addListener("focus", () => {
      this.loadOrderDetails();
      this.get_individual_unread_message()
    })
  };

  componentWillUnmount() {
    this.focusListner();
  }

  get_individual_unread_message = () => {
    let receiver_id = {
      receiver_id: this.context.userData.cust_code
    }
    get_individual_unread_message(receiver_id).then(res => {
      console.log('.......123......', res.message);
      this.setState({ individual_unread_message: res.message })
    }).catch(err => { })
  }

  loadOrderDetails = () => {
    this.setState({ isLoading: true });
    GetCustomers_unreadChat()
      .then((result) => {
        // console.log("data.............", result);
        this.setState({
          orderData: result,
          AllData: result,
        });

      })
      .catch((err) => console.log(err))
      .finally(() => {
        this.setState({
          isLoading: false,
          refreshing: false,
        });
      });
  };
  onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.loadOrderDetails();
    });
  };

  gotoChatDetails = (item) => {
    this.props.navigation.navigate("ChatDetails", {
      orderItem: item,
    });
  };

  gotoSearch = (value) => {
    console.log("............called...............")
    if (this.state.showSearch) {
      this.setState({ showSearch: false })
    }
    else {
      this.setState({ showSearch: true })
    }
  }

  searchData = (value) => {
    // console.log('.............', value)
    if (value != "") {{
        let data = this.state.orderData.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        )
        this.setState({ orderData: data })
      }
    } else {
        this.setState({ orderData: this.state.AllData })
    }
  }

  listItem = ({ item }) => {
    // console.log("flatlist item...................>>",item.cust_code)
    // let chat_value = this.state.individual_unread_message.filter((data)=>{
    //   if( data.sender_id == item.cust_code)
    //  { console.log("data.sender_id...................>>",data.total_msg)}

    //   })

    let userName= item.name.charAt(0).toUpperCase()+
    item.name.slice(1).toLowerCase();

    return (
      <View style={{ borderBottomWidth: 1, borderBottomColor: "lightgray" }}>
        <TouchableOpacity
          key={item.id.toString()}
          activeOpacity={0.8}
          style={{ flexDirection: "row", alignItems: "center", margin: 15, }}
          onPress={() => this.gotoChatDetails(item)}
        >
          <Ionicons name="ios-person-outline" size={24} color={Colors.primary} />
          <Text style={{ marginLeft: 10 }}>
            {item.name !== null ? userName: ""}
          </Text>
          <View style={{position:'absolute',right:5}}>
            {this.state.individual_unread_message.map((data) => { 
              if (data.sender_id == item.cust_code) {
                return (
                  <View style={{ backgroundColor: Colors.primary, width: 25 , height: 25,borderRadius:20,justifyContent:'center',alignItems:'center'}}>
                  <Text style={{ alignSelf:'center',color:Colors.white}}>
                    {data.total_msg}
                  </Text>
          </View>
                )
              }
            })
            }
            </View>
        </TouchableOpacity>
      </View>
    );
  };
  render = () => {
    return (

      <SafeAreaView style={styles.container}>
        <Header
          title="Chat"
          searchIcon={true}
          wishListIcon={true}
          cartIcon={true}
          search={true}
          gotoSearch={this.gotoSearch}
        />
           {this.state.showSearch ?
          <View style={{ backgroundColor: Colors.primary, width: '100%' }}>
            <View style={[styles.searchContainer]}>
              <TextInput
                // ref={this.inputRef}
                value={this.state.searchValue}
                onChangeText={(searchValue) =>
                  this.setState({ searchValue }, () => {
                    this.searchData(searchValue);
                  })
                }
                // autoCompleteType="off"
                placeholder=" Search here..."
                style={styles.searchField}
              />
            </View>
          </View>
          : null
        }
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <>

            {/* // <View style={{ flexDirection: "row" ,alignItems:'center',margin:10,}}> */}
            <FlatList
              data={this.state.orderData}
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={this.listItem}
              initialNumToRender={this.state.orderData?.length}
              ListEmptyComponent={<EmptyScreen />}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
            />
            {/* <TextInput
            style={{ width: "90%", borderWidth: 1, borderColor: "black",height:35}}
            onChangeText={this.onChangeText}
          />
          <TouchableOpacity onPress={this.gotoChatDetails}>
		  <Feather name="send" size={20} color="black" />
          </TouchableOpacity> */}
            {/* // </View> */}
          </>
        )}
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchField: {
    width: "70%",
    marginLeft: 20,
    color: Colors.textColor,
    fontSize: 16,
    // backgroundColor:Colors.white
  },
  searchContainer: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    borderRadius: 3,
    padding: 5,
    marginTop: -5,
    marginBottom: 5,
    marginHorizontal: 10,
  },
});
