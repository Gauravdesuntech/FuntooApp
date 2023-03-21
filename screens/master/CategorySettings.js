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
  Dimensions,
  Switch
} from "react-native";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import AppContext from "../../context/AppContext";
import { writeUserData } from "../../utils/Util";
import { delete_category, delete_wallet_permission, get_all_category, get_new_category, get_wallet_permissions } from "../../services/APIServices";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dropdown } from "react-native-element-dropdown";
import EmptyScreen from "../../components/EmptyScreen";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default class CategorySettings extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      allData: [],
      refreshing: false,
      isEnabled: false,
      deleteIcon: false
    };
  }

  componentDidMount() {
    this.focusListner = this.props.navigation.addListener("focus", () => {
      this.Get_Categorys()
    })
  }

  toggleSwitch = () => {
    this.setState({
      isEnabled: !this.state.isEnabled
    })
  };

  Get_Categorys = () => {
    this.setState({ isLoading: true })
    get_new_category().then(res => {
      // console.log('.......res.......', res);
      this.setState({
        allData: res
      })
    }).catch(err => {
      console.log('.......err.......', err);
    }).finally(() => {
      this.setState({ isLoading: false })
    })
  }

  Delete_Category = (id) => {
    Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this category?",
      [
        {
          text: "Yes",
          onPress: () => {
            delete_category({ id: id }).then(res => {

              if (res.is_success) {
                this.Get_Categorys()
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
      this.Get_Categorys();
    });
  };

  showDelete = (i) => {
    let data = this.state.allData;
    data[i].deleteIcon = !this.state.deleteIcon;

    // console.log('............data.....',data)
    this.setState({
      allData: data,
      deleteIcon: !this.state.deleteIcon
    })
  }

  listItem = ({ item, index }) => {
    // console.log('............item.....',item)
    return (
      <View style={[styles.card, { flexDirection: 'row', paddingHorizontal: 10, alignItems: "center" }]}>
        {item.deleteIcon ?
          <TouchableOpacity onPress={() => this.showDelete(index)} style={{ alignSelf: 'center', }} >
            <AntDesign name="minuscircle" size={20} color={Colors.primary} style={{ transform: [{ rotate: '90deg' }], }} />
          </TouchableOpacity>
          :
          <TouchableOpacity onPress={() => this.showDelete(index)}>
            <AntDesign name="minuscircle" size={20} color={Colors.primary} />
          </TouchableOpacity>
        }
        <View style={{ width: '85%' }}>
          <TouchableOpacity
            // style={[styles.card, {}]}
            // onLongPress={() => this.Delete_Category(item.id)}
            onPress={() => this.state.isEnabled ? this.props.navigation.navigate("SubCategorySettings", { data: item, editedState: 1 }) : this.props.navigation.navigate("AddCategorySettings", { data: item, editedState: 1 })}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}
            >
              {/* <Text style={[styles.textdata, { width: '40%' }]}>Category Name : </Text> */}
              <Text style={[styles.textdata, { width: '85%' }]}> {item.category_name}</Text>
            </View>

            {this.state.isEnabled && item.subcategory.length > 0 ?
              <View style={{ width: '85%', marginLeft: '2%', flexDirection: 'row' }}>
                {item.subcategory.map((i, index) => {
                  return (
                    <View style={{flexDirection: 'row' }}>
                      <Text style={[styles.textdata, { fontSize: 12, opacity: 0.6 }]}>
                        {i.val}
                      </Text>
                      {item.subcategory.length != index + 1 ?
                        <Text style={[styles.textdata, { fontSize: 12, opacity: 0.6 }]}>,</Text>
                        : null}
                    </View>
                  )
                })}
              </View>
              : null}
          </TouchableOpacity>
        </View>
        <View style={{ width: '10%' }}>
          {item.deleteIcon ?
            <TouchableOpacity onPress={() => this.Delete_Category(item.category_id)}>
              <MaterialIcons name="delete" size={20} color={Colors.primary} />
            </TouchableOpacity>
            : <TouchableOpacity onPress={() => this.state.isEnabled ? this.props.navigation.navigate("SubCategorySettings", { data: item, editedState: 1 }) : this.props.navigation.navigate("AddCategorySettings", { data: item, editedState: 1 })}>
              <MaterialIcons name="edit" size={20} color={Colors.primary} />
            </TouchableOpacity>
          }
        </View>
      </View>
    );
  };

  render = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Category Settings" addAction={() => this.props.navigation.navigate("AddCategorySettings", { editedState: 0 })} search={false} />
        {this.state.isLoading && <OverlayLoader />}
        <View style={styles.form}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>
              SubCategory
            </Text>
            <Switch
              trackColor={{ false: '#767577', true: Colors.primary }}
              thumbColor={'#fff'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={this.toggleSwitch}
              value={this.state.isEnabled}
            />
          </View>
          < FlatList
            data={this.state.allData}
            keyExtractor={(item, index) => index}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
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
    minHeight: 40
  },
});
