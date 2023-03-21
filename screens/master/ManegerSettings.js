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
  Alert
} from "react-native";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import AppContext from "../../context/AppContext";
import { writeUserData } from "../../utils/Util";
import { addPaymentTerm, delete_PaymentTerm, get_PaymentTerm } from "../../services/APIServices";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dropdown } from "react-native-element-dropdown";
import EmptyScreen from "../../components/EmptyScreen";

export default class ManegerSettings extends React.Component {
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
    this.getPayment();
    this.focusListner = this.props.navigation.addListener("focus", () => {
      this.getPayment();
    })
  }

  getPayment = () => {
    this.setState({ isLoading: true });
    get_PaymentTerm().then(res => {
      this.setState({ allData: res.data })
    })
      .catch(err => { })
      .finally(() => this.setState({ isLoading: false }))
  }

  onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.getPayment();
    });
  };

  deleteManeger_Type = (item) => {
    Alert.alert(
      "Alert",
      "Are you sure you want to remove this Payment type?",
      [
        {
          text: "Yes",
          onPress: () => {
            let data = {
              id: item.id
            }
            this.setState({ isLoading: true })
            delete_PaymentTerm(data).then(res => {
              this.getPayment();
              this.setState({ isLoading: false })
            }).catch(err => { this.setState({ isLoading: false }) })
          },
        },
        {
          text: "No",
          onPress: () => {
            // console.log('current item', item);
          }
        },
      ]
    );
  }

  listItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ borderBottomWidth: 1, borderBottomColor: "lightgray", }}
        onLongPress={() => this.deleteManeger_Type(item)}
        onPress={() => this.props.navigation.navigate("AddDefaultManeger", { data: item, editedState: 1 })}
      >
        <View >

          {item.maneger !== null ?
            <View
              style={{ flexDirection: "row", alignItems: "center", marginBottom: 3,minHeight:40 }}
            >

              <Text style={{ color: Colors.textColor, marginLeft: 5 }}>
              maneger name :
              </Text>

              <Text style={{ color: Colors.textColor, marginLeft: 5 }}>
                {item.maneger}
              </Text>
            </View>
            : null}
        </View>
      </TouchableOpacity >
    );
  };

  render = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Maneger Settings" addAction={() => this.props.navigation.navigate("AddDefaultManeger", { editedState: 0 })} search={false} />
        {this.state.isLoading && <OverlayLoader />}
        <View style={styles.form}>
          < FlatList
            data={this.state.allData}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={this.listItem}
            initialNumToRender={this.state.allData?.length}
            ListEmptyComponent={<EmptyScreen />}
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
    backgroundColor: Colors.white,
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
});
