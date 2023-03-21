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
import { GetCustomers,GetChatOrder,GetOrders } from "../../services/OrderService";
import Loader from "../../components/Loader";
import EmptyScreen from "../../components/EmptyScreen";
import { showDateAsClientWant, showTimeAsClientWant } from "../../utils/Util";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';
import moment from "moment";
// import { GiftedChat } from 'react-native-gifted-chat';

export default class Chat_orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.route.params.orderItem,
      orderData: [],
      isLoading: false,
      refreshing: false,
    };
  }
//   static navigationOptions = ({ navigation }) => ({
//     title: (navigation.state.params || {}).name || 'Chat!',
//   });

  componentDidMount() {
    this.loadOrderDetails();
    this.focusListner = this.props.navigation.addListener("focus", () => { this.loadOrderDetails() })
	};

	componentWillUnmount() {
		this.focusListner();
	}
  loadOrderDetails = () => {
    // console.log("............this.state.data.id.............", this.state.data.id);
    this.setState({ isLoading: true });
    GetChatOrder(this.state.data.id)
      .then((result) => {
        // console.log(".......................data.............", result.data);
          this.setState({
            orderData: result.data,
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
      data: this.props.route.params.orderItem,
    });
  };

//   listItem = ({ item }) => {
//     // console.log("flatlist item...................>>",item)
//     return (
//       <View style={{borderBottomWidth:1,borderBottomColor:"lightgray"}}>
//       <TouchableOpacity
//         activeOpacity={0.8}
//         style={{ flexDirection: "row", alignItems: "center", margin: 15 ,}}
//         onPress={() => this.gotoChatDetails(item)}
//       >
//         <Ionicons name="ios-person-outline" size={24} color={Colors.primary} />
//         <Text style={{marginLeft:10}}>
//           {item.order_id}
//         </Text>
//         <Text style={{marginLeft:10}}>
//           {item.order_date}
//         </Text>
//         <Text style={{marginLeft:10}}>
//           {item.order_status}
//         </Text>
//       </TouchableOpacity>
//       </View>
//     );
//   };
onRefresh = () => {
    this.setState({ refreshing: true }, () => { this.loadOrderDetails() })
}

renderEmptyContainer = () => {
    return (
        <EmptyScreen />
    )
}

listItem = ({ item }) => {
    // console.log(item)
    // return
    return (
        <TouchableOpacity
            // key={item.id}
            activeOpacity={0.8}
            style={styles.card}
            onPress={() => this.gotoChatDetails(item)}
        >
            <Text style={styles.desc}>{"Order#: " + item.order_id}</Text>
            <Text style={styles.desc}>{"Event Date: "} {showDateAsClientWant(item.event_start_timestamp)}</Text>
            <Text style={styles.desc}>{"Venue: " + item.venue}</Text>
            <Text style={styles.desc}>Setup by: {showTimeAsClientWant(item.setup_timestamp)}</Text>
            <Text style={styles.desc}>Event Time: {showTimeAsClientWant(item.event_start_timestamp)} - {showTimeAsClientWant(item.event_end_timestamp)}</Text>
            <Text style={styles.desc}>
                {"Client Name: " + (item.customer_name !== null ? item.customer_name : "")}
            </Text>
        </TouchableOpacity>


    )
};

  render = () => {
    // console.log("chat order props data.............................", this.props.route.params.orderItem)
    return(
    
    <SafeAreaView style={styles.container}>
      <Header
        title="Chat-Orders"
        searchIcon={true}
        wishListIcon={true}
        cartIcon={true}
      />
      {this.state.isLoading ? (
        <Loader />
      ) : (
        <>

        {/* // <View style={{ flexDirection: "row" ,alignItems:'center',margin:10,}}> */}
          {/* <FlatList
          data={this.state.orderData}
          keyExtractor={(item, index) => item.id}
          renderItem={this.listItem}
          initialNumToRender={this.state.orderData?.length}
          ListEmptyComponent={ <EmptyScreen /> }
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh}
						/>
					}
				/> */}
                {this.state.orderData.length > 0 ?
                <SectionList
					sections={this.state.orderData}
					keyExtractor={(item, index) => item.id}
					renderItem={this.listItem}
					contentContainerStyle={styles.listContainer}
					// ListEmptyComponent={this.renderEmptyContainer()}
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
						)
					}}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh}
						/>
					}
				/>
                :
                <EmptyScreen />}
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
  moreMenu: {
    alignSelf: 'center',
    fontSize: 11,
    marginVertical: 2,
    marginLeft: 1,
    padding: 10,
    backgroundColor: Colors.primary,
    color: Colors.white,
    borderWidth: 0.7,
    borderColor: '#dfdfdf',
    borderRadius: 5
},
Menu: {
borderRadius: 5,
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
    color:Colors.textColor,
    marginBottom: 3,
    fontWeight: "normal",
    // opacity: 0.9,
}
});
