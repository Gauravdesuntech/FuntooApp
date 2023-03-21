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
  Linking,
  Platform,
  Dimensions
} from "react-native";
import Colors from "../config/colors";
import Header from "../components/Header";
import { GetCustomers, GetSortCustomers, GetSortCompany, getSortCustomersByDate, getSortCompany_by_date } from "../services/OrderService";
import Loader from "../components/Loader";
import EmptyScreen from "../components/EmptyScreen";
import { Ionicons, Feather ,AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { showDateAsClientWant } from "../utils/Util";

export default class Address_Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: [],
      orderData_by_name: [],
      orderData_by_date: [],
      isLoading: false,
      refreshing: false,
      showSearch: false,
      searchValue: '',
      allUserData: [],
      allUserData_by_name: [],
      allUserData_by_date: [],
      companyData: [],
      allcompanyData: [],
      companyData_by_name: [],
      allcompanyData_by_name: [],
      companyData_by_date: [],
      allcompanyData_by_date: [],
      currentTab: 'User',
      menuItems: [
        "Name",
        "Date"],
    };
  }

  componentDidMount() {
    this.loadOrderDetails();
    this.focusListner = this.props.navigation.addListener("focus", () => { this.loadOrderDetails() })
  };

  componentWillUnmount() {
    this.focusListner();
  }
  gotodetails = (item) => {
    this.props.navigation.navigate("Address_detailsBook", { data: item })
  }
  gotoCompany_details = (item) => {
    this.props.navigation.navigate("Address_Company_detailsBook", { data: item })
  }
  loadOrderDetails = () => {
    this.setState({ isLoading: true });
    GetSortCustomers()
      .then((result) => {
        // console.log('................GetSortCustomers................', result);
        this.setState({
          orderData_by_name: result,
          allUserData_by_name: result,
        });

      })
      .catch((err) => console.log(err))
    getSortCustomersByDate()
      .then((result) => {
        // console.log('................getSortCustomersByDate................', result);
        this.setState({
          orderData_by_date: result,
          allUserData_by_date: result,
          orderData: result,
          allUserData: result,
        });

      })
      .catch((err) => console.log(err))

    GetSortCompany().then((result) => {
      // console.log('................................', result);
      this.setState({
        companyData_by_name: result,
        allcompanyData_by_name: result,
        companyData: result,
        allcompanyData: result,
      });

    })
      .catch((err) => console.log(err))

    getSortCompany_by_date().then((result) => {
      // console.log('................................', result);
      this.setState({
        companyData_by_date: result,
        allcompanyData_by_date: result,
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


  /**
   * sort all customer  ( by date or name )
   *
   * created by - Rahul Saha
   * 
   * created at - 25.11.22
   * 
   */


  userData = (data) => {
    if (data == 'Name') {
      this.setState({
        orderData: this.state.orderData_by_name,
        allUserData: this.state.allUserData_by_name,
      })
    } else {
      this.setState({
        orderData: this.state.orderData_by_date,
        allUserData: this.state.allUserData_by_date,
      })
    }
  }

   /**
   * sort all company  ( by date or name )
   *
   * created by - Rahul Saha
   * 
   * created at - 25.11.22
   * 
   */
  companyData = (data) => {
    if (data == 'Name') {
      this.setState({
        companyData: this.state.companyData_by_name,
        allcompanyData: this.state.allcompanyData_by_name,
      })
    } else {
      this.setState({
        companyData: this.state.companyData_by_date,
        allcompanyData: this.state.allcompanyData_by_date,
      })
    }
  }

  onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.loadOrderDetails();
    });
  };

  dialCall = (number) => {
    let phoneNumber = '';
    if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
    else { phoneNumber = `teleprompt:${number}`; }
    Linking.openURL(phoneNumber);
  }
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
    console.log('.............', value)
    if (value != "") {
      if (this.state.currentTab == "Company") {
        let data = this.state.allcompanyData.filter((item) =>
          item.company_name.toLowerCase().includes(value.toLowerCase())
        )
        this.setState({ companyData: data })
      }
      if (this.state.currentTab == "User") {
        let data = this.state.allUserData.filter((item) =>
          item.name.toLowerCase().includes(value.toLowerCase())
        )
        this.setState({ orderData: data })
      }
    } else {
      if (this.state.currentTab == "Company") {
        this.setState({ companyData: this.state.allcompanyData })
      }
      if (this.state.currentTab == "User") {
        this.setState({ orderData: this.state.allUserData })
      }
    }
    // console.log("...............................",data)
  }

  Companylist = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ borderBottomWidth: 1, borderBottomColor: "lightgray", }}
        onPress={() => this.gotoCompany_details(item)}
      >
        <View style={{ margin: 10, }}>

          {item.company_name != null ?
            <View
              style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}
            >

              <MaterialCommunityIcons name="office-building" size={20} color={Colors.primary} />

              <Text style={{ color: Colors.textColor, marginLeft: 5 }}>
                {item.company_name}
              </Text>
            </View>
            : null}
        </View>
      </TouchableOpacity>
    );
  };
  listItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ borderBottomWidth: 1, borderBottomColor: "lightgray", }}
        onPress={() => this.gotodetails(item)}
      >
        <View style={{ margin: 10, }}>

          {item.company_name !== null ?
            <View
              style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}
            >

              <MaterialCommunityIcons name="office-building" size={20} color={Colors.primary} />

              <Text style={{ color: Colors.textColor, marginLeft: 5 }}>
                {item.company_name}
              </Text>
            </View>
            : null}

          <View
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}
          >
            <Ionicons name="ios-person-outline" size={20} color={Colors.primary} />
            <Text style={{ color: Colors.textColor, marginLeft: 5 }}>
              {item.name !== null ? item.name : ""}
            </Text>
          </View>
          {item.mobile !== null ?
            <View
              style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}
              // onPress={()=> {this.dialCall(item.mobile)}}
              activeOpacity={1}
            >
              <Ionicons name="ios-call-outline" size={20} color={Colors.primary} />
              <Text style={{ color: Colors.textColor, marginLeft: 5 }}>
                {item.mobile}
              </Text>
            </View>
            : null}
          {item.email !== null ?
            <View
              style={{ flexDirection: "row", alignItems: "center",marginBottom: 3 }}
              // onPress={()=> Linking.openURL('mailto:'+ item.email)}
              activeOpacity={1}
            >
              <Ionicons name="ios-mail-outline" size={20} color={Colors.primary} />
              <Text style={{ color: Colors.textColor, marginLeft: 5 }}>
                {item.email}
              </Text>
            </View>
            : null}
          {item.created_on !== null ?
            <View
              style={{ flexDirection: "row", alignItems: "center",marginBottom: 3 }}
              activeOpacity={1}
            >
              <Feather name="users" size={20} color={Colors.primary} />
              <Text style={{ color: Colors.textColor, marginLeft: 5 }}>
              First login : {showDateAsClientWant(item.created_on)}
              </Text>
            </View>
            : null}
          {item.lastLogin !== null ?
            <View
              style={{ flexDirection: "row", alignItems: "center",marginBottom: 3 }}
              activeOpacity={1}
            >
              <AntDesign name="login" size={20} color={Colors.primary} />
              <Text style={{ color: Colors.textColor, marginLeft: 5 }}>
              last login : {showDateAsClientWant(item.lastLogin?.date)}
              </Text>
            </View>
            :  
            <View
            style={{ flexDirection: "row", alignItems: "center",marginBottom: 3 }}
            activeOpacity={1}
          >
            <AntDesign name="login" size={20} color={Colors.primary} />
            <Text style={{ color: Colors.textColor, marginLeft: 5 }}>
            last login : {showDateAsClientWant(item.created_on)}
            </Text>
          </View>}
        </View>
      </TouchableOpacity>
    );
  };
  render = () => {
    return (

      <SafeAreaView style={styles.container}>
        <Header
          title="Address Book"
          searchIcon={true}
          wishListIcon={true}
          cartIcon={true}
          search={true}
          gotoSearch={this.gotoSearch}
          filterdata={true}
          menuItems={this.state.menuItems}
          onMenuItemChange={this.state.currentTab == "User" ? this.userData : this.companyData}
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
            <View style={styles.tabContainer}>
            {this.state.currentTab == "User" ?
                <View style={[styles.tab, styles.activeTab, { flexDirection: 'row', alignItems: 'center' }]}>
                  <Text style={styles.activeText}>
                    User
                  </Text>

                </View>
                : <TouchableOpacity
                  onPress={() => this.setState({ currentTab: 'User' })}
                  style={styles.tab}
                >
                  <Text
                    style={styles.inActiveText}
                  >
                    User
                  </Text>
                </TouchableOpacity>
              }
              {this.state.currentTab == "Company" ?
                <View style={[styles.tab, styles.activeTab, { flexDirection: 'row', alignItems: 'center' }]}>
                  <Text style={styles.activeText}>
                    Company
                  </Text>

                </View>
                : <TouchableOpacity
                  onPress={() => this.setState({ currentTab: 'Company' })}
                  style={styles.tab}
                >
                  <Text
                    style={styles.inActiveText}
                  >
                    Company
                  </Text>
                </TouchableOpacity>
              }

            </View>
            {this.state.currentTab == "User" ?

              < FlatList
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
              : null}
            {this.state.currentTab == "Company" ?

              < FlatList
                data={this.state.companyData}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={this.Companylist}
                initialNumToRender={this.state.companyData?.length}
                ListEmptyComponent={<EmptyScreen />}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                }
              />
              : null}
          </>
        )
        }
      </SafeAreaView>
    );
  };
}

const tabHeight = 50;
const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("window").width;
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
  tabContainer: {
    width: "100%",
    height: tabHeight,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d1d1",
    borderTopWidth: 0,
    borderTopColor: "#d1d1d1",
    backgroundColor: Colors.white,
    // elevation: 1,
    // marginTop: 10
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: tabHeight,
  },
  underlineStyle: {
    backgroundColor: Colors.primary,
    height: 3,
  },
  activeTab: {
    height: tabHeight - 1,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  activeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primary,
  },
  inActiveText: {
    fontSize: 14,
    color: Colors.grey,
    // opacity: 0.8,
  },
});
