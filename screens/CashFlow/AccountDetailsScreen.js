/*
*
*
* move and modify from cashflow app
* updated by - Rahul Saha
* updated on - 25.11.22
*
*/

import React, { Component } from "react";
import {
  LayoutAnimation,
  StyleSheet,
  View,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Alert,
  SafeAreaView,
  TextInput,
  Text,
  RefreshControl
} from "react-native";
import AuthService from "../../services/CashFlow/Auth";
import ExpandableItemComponent from "../../components/CashFlow/component/accountDetails/ExpandableItemComponent";
import Loader from "../../components/CashFlow/component/loader";
import Colors from "../../config/colors";
import AppContext from '../../context/AppContext';
import { Header } from "../../components";
import moment from "moment";

export default class AccountDetailsScreen extends Component {
  static contextType = AppContext;
  constructor(props) {
    // console.log("Props on Account Details Screen", props);
    super(props);
    this.state = {
      listDataSource: [],
      data: this.props.route.params.data,
      isVisible: true,
      projects: [],
      subprojects: [],
      payMethod: [],
      catContent: [],
      loggedInUser: [],
      userList: [],
      walletAmount:0,
      workingDate: new Date(),
    };
  }

  async UNSAFE_componentWillMount() {
    console.log('.........this.props........',this.props.route.params);
    // await this.updateAccount();
    await this.getCategory();
    await this.getPayMethod();
    await this.getProjectDetails();
    await this.getSubProjectDetails();
    await this.getUserList();
    await this.getDetails();
    // if (this.context.userData.wallet != null) {
    //   this.setState({walletAmount:parseInt(this.context.userData.wallet.amount)})
    //   }
  }

   _refresh = () => {
    this.setState({ listDataSource: [], isVisible: true });
    this.getDetails();
  }

  getProjectDetails = async () => {
    let projects = await AuthService.getProject();

    //console.log("Projects", projects);
    this.setState({ projects: projects });
  };
  getSubProjectDetails = async () => {
    let userAcc = this.state.data;
    let subprojects = await AuthService.getSubProject(userAcc.cust_code);
    //console.log("Sub Projects-------->", subprojects);
    this.setState({ subprojects: subprojects });
  };

  getSubProjectList = async (value) => {
    let result = await AuthService.getSubProjectList(value);
    // console.log("Resultr-------------------->", result);
    this.setState({
      subprojects: result,
    });
  };

  getPayMethod = async () => {
    const payMethod = await AuthService.getPayMethod();
    //console.log("payMethod---------->", payMethod);
    this.setState({ payMethod: payMethod });
  };

  getCategory = async () => {
    //console.log("Calling------------------------------------------->")
    // let contentt = await AuthService.getCat();
    let contentt = await AuthService.getCatnew();
    if (contentt != "Failed") {
      this.setState({
        catContent: contentt,
        serverError: false,
      });
    } else {
      this.setState({
        serverError: true,
      });
    }
    //console.log("Content",this.state.content);
  };
  // async updateAccount() {
  //   let userAcc = this.context.userData;
  //   console.log(userAcc);
  //   let acdata = await AuthService.retriveAccount(
  //     userAcc.cust_code,
  //     userAcc.id
  //   );
  //   this.setState({walletAmount:acdata.account.amount})
  //  // console.log("loggedInUser------->", acdata)
  //   if (acdata.status != 0) {
  //     this.setState({ loggedInUser: acdata.account, serverError: false });
  //     await AuthService.setAccount(acdata.account);
  //   } else if (acdata == "failed") {
  //     this.setState({
  //       serverError: true,
  //     });
  //   }
  // }

  getUserList = async () => {
    let userAcc = this.state.data;
    let result = await AuthService.getUserList(userAcc.cust_code);
    this.setState({ userList: result });
  };

  getDetails = async () => {
    let contentt = await AuthService.fetchAccountAllDetails(
      this.state.data.type,
      this.state.data.cust_code,
      this.state.data.cust_code
    );
  //  console.log("Contentt...................", contentt);
    if (contentt.status != "0") {
      this.setState({ listDataSource: contentt.data, isVisible: false });
    } else {
      this.setState({ listDataSource: [], isVisible: false });
    }

    //console.log("Content",this.state.content);
  };

  catPressed = (item) => {
    //console.log(item)
    this.setState({
      catName: item.val,
      catVal: item.id,
    });
  };

  updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.listDataSource];
    //For Single Expand at a time
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]["isExpanded"] = !array[placeindex]["isExpanded"])
        : (array[placeindex]["isExpanded"] = false)
    );

    //For Multiple Expand at a time
    //array[index]['isExpanded'] = !array[index]['isExpanded'];
    this.setState(() => {
      return {
        listDataSource: array,
      };
    });
  };

  render() {
    const {
      listDataSource,
      isVisible,
      projects,
      subprojects,
      payMethod,
      catContent,
      loggedInUser,
      userList,
    } = this.state;

    if (isVisible) {
      return <Loader visibility={true} />;
    }

    console.log("listDataSource=============>",typeof this.state.listDataSource);
    return (
      <SafeAreaView style={styles.container}>
        <Header 
        // title={'History'} 
        title={`${this.state.data.name}`}
        walletAmount={`${this.state.data.amount}`}
        date={`${moment(this.state.workingDate).format('Do MMM yy ')}`}
        search={false}/>
          {/* <Left>
            <View style={{ alignSelf: "flex-start" }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Icon name="ios-arrow-back" style={{ color: "#fff" }} />
              </TouchableOpacity>
            </View>
          </Left>
          <Body
            style={{
              justifyContent: "center",
              alignContent: "center",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <Text
              style={{ color: "#fff", alignSelf: "flex-start" }}
            >{`${this.props.route.name}`}</Text>
          </Body> */}
        {typeof listDataSource != undefined  && listDataSource != undefined && listDataSource != '' ? (
          <View style={styles.containers}>
            <ScrollView refreshControl={
            <RefreshControl
                    refreshing={isVisible}
                    onRefresh={this._refresh}
                  />
                  }>
              {this.state.listDataSource.map((item, key) => {
                return (
                  <ExpandableItemComponent
                    title={item.title}
                    totalExpense={item.totalExpense}
                    totalIncome={item.totalIncome}
                    totalTransfer={item.totalTransfer}
                    onClickFunction={this.updateLayout.bind(this, key)}
                    item={item}
                    navigation={this.props.navigation}
                    projects={projects}
                    subprojects={subprojects}
                    payMethod={payMethod}
                    catContent={catContent}
                    loggedInUser={loggedInUser}
                    userList={userList}
                  />
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>{"No Data Found"}</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainHeader: {
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight
  },
  containers: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
});
