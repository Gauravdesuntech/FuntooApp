import React, { useRef, useState, useEffect, useContext } from "react";
import {
  AppState,
  View,
  StyleSheet,
  BackHandler,
  Alert,
  Image,
  ToastAndroid,
  Dimensions,
  TouchableOpacity,
  Text,
  TextInput
} from "react-native";
import Modal from "react-native-modal";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import AuthService from "../../services/CashFlow/Auth";
import Daily from "../../components/CashFlow/component/Daily/index";
import Loader from "../../components/CashFlow/component/loader";
import Colors from '../../config/colors';
import { Header } from "../../components";
import AppContext from "../../context/AppContext";
import moment from "moment";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native";

const Tab = createMaterialBottomTabNavigator();

/*
*
* Wallet CashFlow  
* created by - Rahul Saha
* created on -20.02.23
*
*/

let backHandlerClickCount = 0;
const WalletCashFlow = ({ navigation }) => {

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
  const [balanceAcc, setBalanceAcc] = useState("");
  const [deletedTrans, setDeletedTrans] = useState("");
  const [deleteTransCount, setDeleteTransCount] = useState("0");
  const [isDeleteDatatAvailable, setIsDeleteDatatAvailable] = useState(false);
  const [payMethod, setPayMethod] = useState([]);
  const [category, setCategory] = useState([]);
  const [projects, setProjects] = useState([]);
  const [subprojects, setSubProjects] = useState([]);
  const [userList, setUserList] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [workingDate, setWorkingDate] = useState(new Date());
  //project id = 2 for event
  const [selectedProject_id, setSelectedProject_id] = useState(2);
  const [walletAmount, setWalletAmount] = useState(0);
  const [count, setCount] = useState(15);
  const [openModal, setOpenModal] = useState(false);
  const [money, setMoney] = useState('');
  //useEffect
  useEffect(() => {
    setVisible(false);
    userAc();
    getCategory();
    getSubCategory();
    getPayMethod();
  }, []);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", _handleAppStateChange);
    // return () => {
    //   AppState.removeEventListener("change", _handleAppStateChange);
    // };
    return () => {
      subscription.remove()
    }
  }, []);

  //useEffect
  useEffect(() => {
    navigation.addListener("focus", () => {
      // setWalletAmount(parseInt(context.userData.wallet.amount))
      let userAcc = context.userData;
      setCount(15)
      // first 15 row 
      AlltransDetail(userAcc, workingDate, 15);
      updateAccount();
      setVisible(true);
      userAc();
      getCategory();
      getSubCategory();
      getPayMethod();
      getSubProjectDetails(selectedProject_id);
      getUserList();
      getProjectDetails();
      setWorkingDate(new Date());
    });

  }, [navigation]);

  useEffect(() => {
    getUserList();
  }, []);
  useEffect(() => {
    if (context.userData.wallet != null) {
      setWalletAmount(parseInt(context.userData.wallet.amount))
    }
  }, []);

  useEffect(() => {
    getProjectDetails();
  }, []);

  useEffect(() => {
    onDateChange();
  }, [workingDate]);

  // useEffect(() => {
  //   // back handle exit app
  //   BackHandler.addEventListener("hardwareBackPress", backButtonHandler);
  //   return () => {
  //     BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
  //   };
  // }, []);

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
    let userAcc = context.userData;
    transDetailByDate(userAcc, value);
  };

  const _handleAppStateChange = (nextAppState) => {
    // if (
    //   appState.current.match(/inactive|background/) &&
    //   nextAppState === "active"
    // ) {
    // } else {
    //   AuthService.logout();
    //   // navigation.navigate("Auth");

    // }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };
  const onDateChange = async () => {
    // let userAcc = await AuthService.getAccount();
    let userAcc = context.userData;
    // transDetail(userAcc,workingDate);
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
        userAcc.cust_code,
        userAcc.id
      );

      if (updatedAcc != null) {
        global.account = updatedAcc.account;
        setAccount(updatedAcc.account);
        await AuthService.setAccount(updatedAcc.account);
      }
      getBalanceAcc(userAcc);
      getSubProjectDetails(selectedProject_id);
      getDeletedTransDetails(userAcc);
      setVisible(false);
    }
  };
  const getDeletedTransDetails = async (user) => {
    let result = await AuthService.deletedTransDetails(user.cust_code);
    if (result.status == "1") {
      setDeletedTrans(result.details);
      setDeleteTransCount(result.count);
      setIsDeleteDatatAvailable(result.isDeleteDataPresent);
    }
  };
  const getBalanceAcc = async (user) => {
    // let acdata = await AuthService.fetchDetailsAccounts(
    //   user.account.type,
    //   user.account.cust_code
    // );
    // if (acdata != "failed") {
    //   if (acdata.status != 0) {
    //     setBalanceAcc(acdata.account)
    //   }
    // }
  };
  const updateAccount = async () => {
    // let userAcc = await AuthService.getAccount();
    let userAcc = context.userData;
    let acdata = await AuthService.retriveAccount(
      userAcc.cust_code,
      userAcc.id
    );
    setWalletAmount(acdata.account.amount)
  }

  // const transDetail = async (userAcc,workingDate) => {
  //   const date = workingDate;
  //   const day = date.getDate();
  //   const month = date.getMonth();
  //   const year = date.getFullYear();
  //   const result = await AuthService.getDayDetails(
  //     userAcc.cust_code,
  //     day,
  //     month,
  //     year
  //   );
  //   // console.log('..............result.data............',result.data);
  //   if (result.data != null) {
  //     result.data.map((item) => {
  //       const sumIncome = item.totalIncome;
  //       const sumExpense = item.totalExpense;
  //       const totalOb = item.totalOB;
  //       const total = item.totalCB;
  //       const totalTransfer = item.totalTransfer;
  //       setincomeSum(sumIncome);
  //       setExpenseSum(sumExpense);
  //       setTotal(total);
  //       setTransferSum(totalTransfer);
  //       setOb(totalOb);
  //     });

  //     setDailyTrans(result.data);
  //     setVisible(false);
  //   } else {
  //     setincomeSum(0.0);
  //       setExpenseSum(0.0);
  //       setTotal(0);
  //       setTransferSum(0.0);
  //       setOb(0);
  //       setDailyTrans([]);
  //     setVisible(false);
  //   }
  // };
  const AlltransDetail = async (userAcc, workingDate, count) => {
    const date = workingDate;
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const result = await AuthService.getTransferDetails(
      userAcc.cust_code,
      day,
      month,
      year,
      count
    );
    if (result.data != null) {
      const sumIncome = result.data.totalIncome;
      const sumExpense = result.data.totalExpense;
      const totalOb = result.data.totalOB;
      const total = result.data.totalCB;
      const totalTransfer = result.data.totalTransfer;
      setincomeSum(sumIncome);
      setExpenseSum(sumExpense);
      setTotal(total);
      setTransferSum(totalTransfer);
      setOb(totalOb);
      setDailyTrans(result.value);
      setVisible(false);
    } else {
      setincomeSum(0.0);
      setExpenseSum(0.0);
      setTotal(0);
      setTransferSum(0.0);
      setOb(0);
      setDailyTrans([]);
      setVisible(false);
    }
  };
  const transDetailByDate = async (userAcc, workingDate) => {
    const date = workingDate;
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const result = await AuthService.getTransferDetailsByDate(
      userAcc.cust_code,
      day,
      month,
      year
    );
    if (result.data != null) {
      const sumIncome = result.data.totalIncome;
      const sumExpense = result.data.totalExpense;
      const totalOb = result.data.totalOB;
      const total = result.data.totalCB;
      const totalTransfer = result.data.totalTransfer;
      setincomeSum(sumIncome);
      setExpenseSum(sumExpense);
      setTotal(total);
      setTransferSum(totalTransfer);
      setOb(totalOb);
      setDailyTrans(result.value);
      setVisible(false);
    } else {
      setincomeSum(0.0);
      setExpenseSum(0.0);
      setTotal(0);
      setTransferSum(0.0);
      setOb(0);
      setDailyTrans([]);
      setVisible(false);
    }
  };

  const getSubCategory = async () => {
    // let contentt = await AuthService.getSubCat();
    let contentt = await AuthService.getCatnew();
    if (contentt != "Failed") {
      // global.category = contentt;
      setSubCategory(contentt);
    } else {
      Alert.alert(
        "Failed to load category !!",
        "Sorry we are faceing some server issue !!",
        [
          {
            text: "Try again",
            onPress: () => {
              getSubCategory();
            },
            style: "cancel",
          },
          { text: "Cancel", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    }

  };
  const getCategory = async () => {
    // let contentt = await AuthService.getCat();
    let contentt = await AuthService.getCatnew();
    if (contentt != "Failed") {
      // global.category = contentt;
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

  };
  const getProjectDetails = async () => {
    let projects = await AuthService.getProject();
    global.projects = projects;
    setProjects(projects);
  };
  // const getSubProjectDetails = async (user) => {
  //   let userAcc = context.userData;
  //   let subprojects = await AuthService.getSubProject(userAcc.cust_code);
  //   setSubProjects(subprojects);
  // };
  const getSubProjectDetails = async (value) => {
    let userAcc = context.userData;
    let subprojects = await AuthService.getNewSubProjectList(value);
    setSubProjects(subprojects);
  };


  const getUserList = async () => {
    // let userAcc = await AuthService.getAccount();
    let userAcc = context.userData;
    let result = await AuthService.getUserList(userAcc.cust_code);
    setUserList(result);
    global.userList = result;
  };

  const getPayMethod = async () => {
    const payMethod = await AuthService.getPayMethod();
    // global.payMethod = payMethod;
    setPayMethod(payMethod);
  };

  const selectdrowerIcon = () => {
    // navigation.navigate('AccountDetailsScreen')
    navigation.navigate('ChangePayMethod')
  }
  const requestMoney = () => {
    setOpenModal(true)
  }
  const send_request = () => {
    setOpenModal(false)
    alert(money)
  }

  return (

    <SafeAreaView style={styles.container}>
      {visible ? (
        <Loader visibility={visible} />
      ) : (
        <>
          <Header
            title={`${context.userData.name}`}
            walletAmount={`${walletAmount}`}
            // date={`${moment(workingDate).format('Do MMM yy ')}`}
            date={`${moment(workingDate).format("DD/MM/YY")}`}
            setWorkingDate={workingDateHandler}
            datePicker={true}
            // drowerIcon={true}
            // onPress_drowerIcon={selectdrowerIcon}
            onPress_title={selectdrowerIcon}
            addAction={() => requestMoney()}
          />
          {/* <MainHeader
            style={styles}
            navigation={navigation}
            account={account}
            balanceAcc={balanceAcc}
            workingDate={workingDate}
            setWorkingDate={workingDateHandler}
          /> */}

          <Daily
            style={styles}
            data={dailyTrans}
            totalIncome={incomeSum}
            totalExpense={expenseSum}
            totalTransfer={transferSum}
            total={total}
            ob={ob}
            catData={subcategory}
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
            transferdebounce={(userAcc, workingDate, count) => {
              AlltransDetail(userAcc, workingDate, count);
              setCount(count)
            }}
            count={count}
            workingDate={workingDate}
            userAcc={context.userData}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('WalletCashFlowHome', {
              payMethod: payMethod,
              subprojects: subprojects,
              projects: projects,
              catContent: subcategory,
              userList: userList,
              Order_CashFlow: false,
              subproject_name: '',
              subproject_id: '',
            })}
            style={styles.button_style}
          >
            <Ionicons name="add-outline" size={35} color={Colors.white} style={{ alignSelf: 'center' }} />
          </TouchableOpacity>
        </>
      )}

      <Modal
        isVisible={openModal}
        onBackdropPress={() => { setOpenModal(false) }}
      >
        <SafeAreaView 
              style={{
                backgroundColor: "#fff",
                padding: 25,
              }}
            >
              <View style={styles.inputContainer}>
                <Text style={styles.inputLable}>Request Amount:</Text>
                <TextInput
                  value={money}
                  autoCompleteType="off"
                  autoCapitalize="words"
                  placeholder="Amount"
                  keyboardType='numeric'
                  style={styles.textInput}
                  onChangeText={(text) =>
                  setMoney(text)
                  }
                />
              </View>
              <View style={{justifyContent:'center',alignItems:'center',}}>
              <TouchableOpacity 
              style={styles.btn}
              onPress={()=>send_request()}
              >
                <Text style={{color:Colors.white}}>Send</Text>
              </TouchableOpacity>
              </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
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
  button_style: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignContent: 'center'
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
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputLable: {
    fontSize: 16,
    color: Colors.grey,
    marginBottom: 10,
    opacity: 0.8,
  },
  textInput: {
    borderWidth: 1,
    padding: 9,
    fontSize: 14,
    width: "100%",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.textInputBorder,
    backgroundColor: Colors.textInputBg,
  },
  btn:{
    width:"40%",
    backgroundColor:Colors.primary,
    justifyContent:'center',
    alignItems:'center',
    height:45,
    borderRadius:6
  }
});

const _handlePress = (navigation, index, route = null) => {
  navigation.navigate(route, {
    today: new Date(),
    userList: global.userList,
    account: global.account,
    index: index,
  });
};


export default WalletCashFlow;
