import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Alert,
  Dimensions
} from "react-native";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import AppContext from "../../context/AppContext";
import { writeUserData } from "../../utils/Util";
import { delete_wallet_permission, get_wallet_permissions } from "../../services/APIServices";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dropdown } from "react-native-element-dropdown";
import EmptyScreen from "../../components/EmptyScreen";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default class WalletSettings extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      allData: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    this.focusListner = this.props.navigation.addListener("focus", () => {
      this.getWalletPermission()
    })
  }

  getWalletPermission = () => {
    this.setState({ isLoading: true })
    get_wallet_permissions().then(res => {
      // console.log('......res......',res);
      this.setState({
        allData: res.data
      })
    }).catch(err => {
      console.log('.......err.......', err);
    }).finally(() => {
      this.setState({ isLoading: false })
    })
  }

	deleteWalletPermission = (id) => {
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to remove this tag?",
			[
				{
					text: "Yes",
					onPress: () => {
						delete_wallet_permission({ id: id }).then(res => {

							// console.log(res);
							if (res.is_success) {
                this.getWalletPermission()
							}

						}).catch((error) => {
							Alert.alert("Server Error", error.message);
						})
					},
				},
				{
					text: "No",
				},
			]
		);
	}
  onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.getWalletPermission();
    });
  };

  listItem = ({ item }) => {
    // console.log('............item.....',item)
    return (
      <TouchableOpacity
        style={[styles.card, {}]}
        onLongPress={() => this.deleteWalletPermission(item.id)}
      onPress={()=>this.props.navigation.navigate("AddWalletSettings",{data:item,editedState:1})}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}
        >
          <Text style={[styles.textdata, { width: '40%' }]}>Employe Name : </Text>
          <Text style={[styles.textdata, { width: '60%' }]}> {item.user_name}</Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}
        >
          <Text style={[styles.textdata, { width: '40%' }]}>Wallet Permissions : </Text>
          <Text style={[styles.textdata, { width: '58%' }]}>
            {item.user_permissions.map((data) => {
              return (
                <Text>{data.name},</Text>
              )
            })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Wallet Settings" addAction={() => this.props.navigation.navigate("AddWalletSettings", { editedState: 0 })} search={false} />
        {this.state.isLoading && <OverlayLoader />}
        <View style={styles.form}>
          < FlatList
            data={this.state.allData}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.listItem}
            initialNumToRender={this.state.allData?.length}
            ListEmptyComponent={<View style={{ width: windowWidth, height: windowHeight }}><EmptyScreen /></View>}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          />
        </View>
      </SafeAreaView>
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.white,
  },
  form: {
    flex: 1,
    padding: 8,
  },
  heading: {
    fontSize: 16,
    color: Colors.textColor,
    fontWeight: "bold",
    marginVertical: 30,
    alignSelf: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  inputLable: {
    fontSize: 16,
    color: Colors.textColor,
    // marginBottom: 10,
    // opacity: 0.8,
  },
  textInput: {
    borderWidth: 1,
    padding: 9,
    fontSize: 14,
    width: "50%",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.textInputBorder,
    backgroundColor: Colors.textInputBg,
    alignItems: 'center'
  },
  submitBtn: {
    marginTop: 15,
    height: 45,
    width: "100%",
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  textdata: {
    color: Colors.textColor,
    marginLeft: 5
  },
  card: {
    width: "100%",
    paddingHorizontal: 2,
    paddingVertical: 3,
    backgroundColor: Colors.white,
    borderRadius: 4,
    marginBottom: 10,
  },
});
