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
import { delete_subcategory, delete_wallet_permission, get_subcategory_by_id, get_wallet_permissions } from "../../services/APIServices";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dropdown } from "react-native-element-dropdown";
import EmptyScreen from "../../components/EmptyScreen";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default class SubCategorySettings extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      allData: [],
      refreshing: false,
      deleteIcon: false
    };
  }

  componentDidMount() {
    // console.log('.....this.props.route.params.data......',this.props.route.params.data)
    // this.setState({allData:this.props.route.params.data})
    this.focusListner = this.props.navigation.addListener("focus", () => {
      this.Get_Allsubcategory(this.props.route.params.data.category_id)
    })
  }

  Get_Allsubcategory = (id) => {
    this.setState({ isLoading: true })
    get_subcategory_by_id(id).then(res => {
      // console.log('.......res.......', res[0]);
      this.setState({
        allData: res[0]
      })
    }).catch(err => {
      console.log('.......err.......', err);
    }).finally(() => {
      this.setState({ isLoading: false })
    })
  }

	deleteSub_Category = (id) => {
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to remove this subcategory?",
			[
				{
					text: "Yes",
					onPress: () => {
						delete_subcategory({ id: id }).then(res => {

							// console.log(res);
							if (res.is_success) {
                this.Get_Allsubcategory(this.props.route.params.data.category_id)
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
      this.Get_Allsubcategory();
    });
  };
  showDelete = (i) => {
    let data = this.state.allData;
    data.subcategory[i].deleteIcon = !this.state.deleteIcon;

    // console.log('............data.....',data)
    this.setState({
      allData: data,
      deleteIcon: !this.state.deleteIcon
    })
  }

  listItem = ({ item ,index}) => {
    // console.log('............item.....',item)
    return (
      <View style={[styles.card, { flexDirection: 'row', paddingHorizontal: 10 ,alignItems: "center"}]}>
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
        // onLongPress={() => this.deleteSub_Category(item.id)}
      onPress={()=>this.props.navigation.navigate("AddsubCategorySettings",{data:item,editedState:1,allData:this.state.allData})}
      >
        {/* <View
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}
        > */}
          {/* <Text style={[styles.textdata, { width: '40%' }]}>SubCategory Name : </Text>  */}
          <Text style={[styles.textdata, { width: '85%' }]}> {item.val}</Text>
        {/* </View> */}
      
      </TouchableOpacity>
      </View>
      <View style={{ width: '10%' }}>
          {item.deleteIcon ?
            <TouchableOpacity onPress={() => this.deleteSub_Category(item.id)}>
              <MaterialIcons name="delete" size={20} color={Colors.primary} />
            </TouchableOpacity>
            : <TouchableOpacity onPress={() => this.props.navigation.navigate("AddsubCategorySettings", { data: item, editedState: 1 ,allData:this.state.allData})}>
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
        {/* <Header title="SubCategory Settings" addAction={() => this.props.navigation.navigate("AddsubCategorySettings", { editedState: 0 })} search={false} /> */}
        <Header title={this.state.allData.category_name} addAction={() => this.props.navigation.navigate("AddsubCategorySettings", { allData:this.state.allData,editedState: 0 })} search={false} />
        {this.state.isLoading && <OverlayLoader />}
        <View style={styles.form}>
          < FlatList
            data={this.state.allData.subcategory}
            keyExtractor={(item, index) => index}
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
    minHeight:40
  },
});
