import React, { useRef, useState, useEffect,useContext } from "react";
import {
  AppState,
  View,
  StyleSheet,
  BackHandler,
  Alert,
  Image,
  ToastAndroid,
} from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import AuthService from "../../services/CashFlow/Auth";
import MainHeader from "../../components/CashFlow/component/MainHeader";
import Daily from "../../components/CashFlow/component/Daily/index";
import Loader from "../../components/CashFlow/component/loader";
import Colors from '../../config/colors';
import Income from "./Income";
import Expense from "./Expense";
import AccountDetailsScreen from "./AccountDetailsScreen";
import { Header } from "../../components";
import AppContext from "../../context/AppContext";

const Tab = createMaterialBottomTabNavigator();

let backHandlerClickCount = 0;
const HomeScreen = ({ navigation }) => {

  const context = useContext(AppContext)
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [timePassed, setTimePassed] = useState(false);
  const [account, setAccount] = useState(null);
  const [dailyTrans, setDailyTrans] = useState([]);
  const [incomeSum, setincomeSum] = useState(0.0);
  const [expenseSum, setExpenseSum] = useState(0.0);
  const [transferSum, setTransferSum] = useState(0.0);
  const [total, setTotal] = useState(0);
  const [ob, setOb] = useState(0);
  const [visible, setVisible] = useState(true);
  const [category, setCategory] = useState(null);
  const [payMethod, setPayMethod] = useState("Cash");
  const [userList, setUserList] = useState(null);
  const [balanceAcc, setBalanceAcc] = useState("");
  const [deletedTrans, setDeletedTrans] = useState("");
  const [deleteTransCount, setDeleteTransCount] = useState("0");
  const [isDeleteDatatAvailable, setIsDeleteDatatAvailable] = useState(false);
  const [projects, setProjects] = useState(null);
  const [subprojects, setSubProjects] = useState(null);
  const [workingDate, setWorkingDate] = useState(new Date());
  //useEffect
  useEffect(() => {
    setVisible(false);
    // userAc();
    // getCategory();
    // getPayMethod();
  }, []);
  // useEffect(() => {
  //   // AppState.addEventListener("change", _handleAppStateChange);
  //   // return () => {
  //   //   AppState.removeEventListener("change", _handleAppStateChange);
  //   // };
  // }, []);

  //useEffect
  useEffect(() => {
    navigation.addListener("didFocus", () => {
      setVisible(true);
      userAc();
      getCategory();
      getPayMethod();
      setWorkingDate(new Date());
    });
    //  console.log("Calling Back here-------->", navigation.isFirstRouteInParent())
  }, [navigation]);

  useEffect(() => {
    getUserList();
  }, []);

  useEffect(() => {
    getProjectDetails();
  }, []);

  useEffect(() => {
    onDateChange();
  }, [workingDate]);

  useEffect(() => {
    // back handle exit app
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, []);

  const backButtonHandler = () => {
    const shortToast = (message) => {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    };
    if (navigation.isFocused()) {
      backHandlerClickCount += 1;
      if (backHandlerClickCount < 2) {
        shortToast("Press again to quit the application");
      } else {
        BackHandler.exitApp();
      }

      // timeout for fade and exit
      setTimeout(() => {
        backHandlerClickCount = 0;
      }, 1000);

      return true;
    }
  };

  const workingDateHandler = (value) => {
    setWorkingDate(value);
  };

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!------------>", timePassed);
    } else {
      AuthService.logout();
      // navigation.navigate("Auth");

      console.log("App has gone to the backeground!");
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };
  const onDateChange = async () => {
      // let userAcc = await AuthService.getAccount();
    let userAcc = context.userData;
    transDetail(userAcc);
    getDeletedTransDetails(userAcc);
  };

  const userAc = async () => {
      // let userAcc = await AuthService.getAccount();
    let userAcc = context.userData;
    if (userAcc == null) {
      setVisible(false);
      await AuthService.logout();
      navigation.push("Forgot");
    } else {
      setAccount(userAcc);
      let updatedAcc = await AuthService.retriveAccount(
        userAcc.user_code,
        userAcc.id
      );

      if (updatedAcc != null) {
        global.account = updatedAcc.account;
        setAccount(updatedAcc.account);
        await AuthService.setAccount(updatedAcc.account);
      }
      getBalanceAcc(userAcc);
      getSubProjectDetails(userAcc);
      transDetail(userAcc);
      getDeletedTransDetails(userAcc);
      setVisible(false);
    }
  };
  const getDeletedTransDetails = async (user) => {
    let result = await AuthService.deletedTransDetails(user.user_code);
    if (result.status == "1") {
      setDeletedTrans(result.details);
      setDeleteTransCount(result.count);
      setIsDeleteDatatAvailable(result.isDeleteDataPresent);
    }
  };
  const getBalanceAcc = async (user) => {
    let acdata = await AuthService.fetchDetailsAccounts(
      user.user_type,
      user.user_code
    );
    if (acdata.status != 0) {
      global.balanceAcc = acdata.account;
      setBalanceAcc(acdata.account);
    }
  };
  const transDetail = async (userAcc) => {
    const date = workingDate;
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const result = await AuthService.getDayDetails(
      userAcc.user_code,
      day,
      month,
      year
    );
    if (result.data != null) {
      result.data.map((item) => {
        const sumIncome = item.totalIncome;
        const sumExpense = item.totalExpense;
        const totalOb = item.totalOB;
        const total = item.totalCB;
        const totalTransfer = item.totalTransfer;
        setincomeSum(sumIncome);
        setExpenseSum(sumExpense);
        setTotal(total);
        setTransferSum(totalTransfer);
        setOb(totalOb);
      });

      setDailyTrans(result.data);
      setVisible(false);
    } else {
      setVisible(false);
    }
  };

  const getCategory = async () => {
    // let contentt = await AuthService.getCat();
    let contentt = await AuthService.getCatnew();
    if (contentt != "Failed") {
      global.category = contentt;
      setCategory(contentt);
    } else {
      Alert.alert(
        "Failed to load category !!",
        "Sorry we are faceing some server issue !!",
        [
          {
            text: "Try again",
            onPress: () => {
              getCategory();
            },
            style: "cancel",
          },
          { text: "Cancel", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    }

    //console.log("Content",this.state.content);
  };
  const getProjectDetails = async () => {
    let projects = await AuthService.getProject();
    global.projects = projects;
    //console.log("Projects", projects);
    setProjects(projects);
  };
  const getSubProjectDetails = async (user) => {
    let subprojects = await AuthService.getSubProject(user.user_code);
    // console.log("Sub Projects-------->", subprojects);
    global.subprojects = subprojects;
    setSubProjects(subprojects);
  };

  const getUserList = async () => {
      // let userAcc = await AuthService.getAccount();
    let userAcc = context.userData;
    let result = await AuthService.getUserList(userAcc.user_code);
    setUserList(result);
    global.userList = result;
  };

  const getPayMethod = async () => {
    const payMethod = await AuthService.getPayMethod();
    //console.log("payMethod---------->", payMethod);
    global.payMethod = payMethod;
    setPayMethod(payMethod);
  };

  return (
    <View style={styles.container}>
      {visible ? (
        <Loader visibility={visible} />
      ) : (
        <>

          <Header
            title={"CashFlow Home"}
             />
          <MainHeader
            style={styles}
            navigation={navigation}
            account={account}
            balanceAcc={balanceAcc}
            workingDate={workingDate}
            setWorkingDate={workingDateHandler}
          />

          <Daily
            style={styles}
            data={dailyTrans}
            totalIncome={incomeSum}
            totalExpense={expenseSum}
            totalTransfer={transferSum}
            total={total}
            ob={ob}
            catData={category}
            navigation={navigation}
            userList={userList}
            loggedinUser={account}
            loggedinUserBalance={balanceAcc}
            deleteTransData={deletedTrans}
            deleteTransCount={deleteTransCount}
            isDeleteDatatAvailable={isDeleteDatatAvailable}
            projects={projects}
            subprojects={subprojects}
            payMethod={payMethod}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight
  },
  mainHeader: {
    backgroundColor: Colors.primary,
    borderBottomColor: Colors.primary,
  },
  whiteColor: {
    color: Colors.secondary,
  },
  headerButton: {
    flexDirection: "row",
    flex: 1,
  },
  headerCalenderText: {
    alignSelf: "center",
    color: Colors.secondary,
  },
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.secondary,
  },
  scene: {
    flex: 1,
  },
  indicatorStyle: {
    backgroundColor: Colors.secondary,
    height: 4,
  },
  tabBarText: {
    color: Colors.secondary,
    fontSize: 12,
    margin: 8,
    fontWeight: "700",
  },
  tabBarBackground: {
    backgroundColor: Colors.primary,
  },
  moneySectionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    paddingHorizontal: 10,
  },
  moneySectionTopText: {
    alignSelf: "center",
    fontSize: 12,
    color: "#7f7f7f",
  },
  moneyDataSection: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

const _handlePress = (navigation, index, route = null) => {
  console.log(typeof route, route);
  navigation.navigate(route, {
    today: new Date(),
    userList: global.userList,
    account: global.account,
    index: index,
  });
};

const TabNavigation = (props) => {
  //console.log("-->", props);
  return (
    <Tab.Navigator
      shifting={false}
      activeColor={Colors.primary}
      barStyle={{ backgroundColor: "#fff" }}
      labeled={false}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              resizeMode={"cover"}
              resizeMethod={"scale"}
              style={{ alignSelf: "center", width: 40, height: 40 }}
              source={require("../../assets/home.gif")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="IN"
        component={Income}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              resizeMode={"cover"}
              resizeMethod={"scale"}
              style={{ alignSelf: "center", width: 40, height: 40 }}
              source={require("../../assets/income.gif")}
            />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            _handlePress(navigation, 0, "Income");
          },
        })}
      />
      <Tab.Screen
        name="OUT"
        component={Expense}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              resizeMode={"cover"}
              resizeMethod={"scale"}
              style={{ alignSelf: "center", width: 60, height: 50 }}
              source={require("../../assets/expense_sub.gif")}
            />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            _handlePress(navigation, 1, "Expense");
          },
        })}
      />
      <Tab.Screen
        name="TR"
        component={AccountDetailsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              resizeMode={"cover"}
              resizeMethod={"scale"}
              style={{ alignSelf: "center", width: 70, height: 40 }}
              source={require("../../assets/transfer.gif")}
            />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            _handlePress(navigation, 2, "AccountDetailsScreen");
          },
        })}
      />
    </Tab.Navigator>
  );
};

// const TabNavigator = createMaterialBottomTabNavigator(
//   {
//     initialRouteName: "Home",
//     shifting: false,
//     activeColor: Colors.primary,
//     inactiveColor: Colors.chocolateColor,
//     barStyle: { backgroundColor: Colors.secondary },
//     tabBarOptions: { style: { height: 80 } },
//     labeled: false,
//   }
// );

export default TabNavigation;
//export default HomeScreen;
