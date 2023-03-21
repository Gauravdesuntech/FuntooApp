
/*
*
*order cashflow home 
*updated by - Rahul Saha
*updated on - 10.01.23
*
*/

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
    TouchableOpacity
} from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import AuthService from "../../services/CashFlow/Auth";
import OrderDaily from "../../components/CashFlow/component/OrderDaily/index";
import Loader from "../../components/CashFlow/component/loader";
import Colors from '../../config/colors';
import Income from "../CashFlow/Income";
import Expense from "../CashFlow/Expense";
import AccountDetailsScreen from "../CashFlow/AccountDetailsScreen";
import { Header } from "../../components";
import AppContext from "../../context/AppContext";
import moment from "moment";
import Transfer from "../CashFlow/AddTransfer";
import { Ionicons } from '@expo/vector-icons';
import OverlayLoader from "../../components/OverlayLoader";

const Tab = createMaterialBottomTabNavigator();

let backHandlerClickCount = 0;
const Order_CashFlow = ({ navigation, daily_Trans, subproject_name, subproject_id ,order_id }) => {

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
    const [subproject_Name, setSubProject_Name] = useState([]);
    const [subproject_Id, setSubProject_Id] = useState([]);
    const [userList, setUserList] = useState([]);
    const [subcategory, setSubCategory] = useState([]);
    const [workingDate, setWorkingDate] = useState(new Date());
    //project id = 2 for event
    const [selectedProject_id, setSelectedProject_id] = useState(2);
    const [walletAmount, setWalletAmount] = useState(0);
    const [count, setCount] = useState(15);
    //useEffect
    useEffect(() => {
        setVisible(false);
        userAc();
        getCategory();
        getSubCategory();
        getPayMethod();
    }, []);
    useEffect(() => {
        console.log('......Order_CashFlow.....daily_Trans............', daily_Trans)
        setSubProject_Name(subproject_name)
        setSubProject_Id(subproject_id)
        if(daily_Trans != null){
        setincomeSum(daily_Trans?.data?.totalIncome);
        setExpenseSum(daily_Trans?.data?.totalExpense);
        setOb(daily_Trans?.data?.totalOB);
        setTotal(daily_Trans?.data?.totalCB);
        setTransferSum(daily_Trans?.data?.totalTransfer);
        setDailyTrans(daily_Trans?.value);
    }

        // const subscription = AppState.addEventListener("change", _handleAppStateChange);
        // return () => {
        //   AppState.removeEventListener("change", _handleAppStateChange);
        // };
        // return () => {
        //     subscription.remove()
        // }
    }, []);

    //useEffect
    useEffect(() => {
    //    console.log( '................order Cashflow..............',)
    //    console.log( '................order Cashflow..daily_Trans............',daily_Trans)
        navigation.addListener("focus", () => {
            let userAcc = context.userData;
            // first 15 row 
            setCount(15)
            AlltransDetail(userAcc, workingDate, order_id);
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

    }, []);

    useEffect(() => {
        getUserList();
        getProjectDetails();
    if (context.userData.wallet != null) {
                setWalletAmount(parseInt(context.userData.wallet.amount))
            }
    }, []);

    useEffect(() => {
        onDateChange();
    }, [workingDate]);


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
        // transDetailByDate(userAcc, value);
    };

    const _handleAppStateChange = (nextAppState) => {

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    };
    const onDateChange = async () => {
        let userAcc = context.userData;
        getDeletedTransDetails(userAcc);
    };

    const userAc = async () => {
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
        // console.log('.........user........',user);
        let acdata = await AuthService.fetchDetailsAccounts(
            user.type,
            user.cust_code
        );
        if (acdata != "failed") {
            if (acdata.status != 0) {
                setBalanceAcc(acdata.account)
            }
        }
    };
    const updateAccount = async () => {
        let userAcc = context.userData;
        let acdata = await AuthService.retriveAccount(
            userAcc.cust_code,
            userAcc.id
        );
        setWalletAmount(acdata.account.amount)
    }
    const AlltransDetail = async (userAcc, workingDate, order_id) => {
        const date = workingDate;
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const result = await AuthService.getTransferDetailsByOrder(
            userAcc.cust_code,
            day,
            month,
            year,
            order_id
        );
        console.log('.....order..AlltransDetail..result...........',result)
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
    const getSubProjectDetails = async (value) => {
        let userAcc = context.userData;
        let subprojects = await AuthService.getNewSubProjectList(value);
        setSubProjects(subprojects);
    };


    const getUserList = async () => {
        let userAcc = context.userData;
        let result = await AuthService.getUserList(userAcc.cust_code);
        setUserList(result);
        global.userList = result;
    };

    const getPayMethod = async () => {
        const payMethod = await AuthService.getPayMethod();
        setPayMethod(payMethod);
    };

    const selectdrowerIcon = () => {
        navigation.navigate('ChangePayMethod')
    }

    return (

        <View style={styles.container}>
            {visible && dailyTrans == null? (
                <OverlayLoader />
            ) : (
                <>
                    <Header
                        title={`${context.userData.name}`}
                        walletAmount={`${walletAmount}`}
                        date={`${moment(workingDate).format('Do MMM yy ')}`}
                        setWorkingDate={workingDateHandler}
                        datePicker={true}
                        // onPress_title={selectdrowerIcon}
                        hideArrowBack={true}
                        showHome={false}
                    />
                    <OrderDaily
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
                        // transferdebounce={(userAcc, workingDate, count) => {
                        //     AlltransDetail(userAcc, workingDate, count);
                        //     setCount(count)
                        // }}
                        count={count}
                        workingDate={workingDate}
                        userAcc={context.userData}
                        Order_CashFlow={true}
                    />
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CashFlowHome', {
                            payMethod: payMethod,
                            subprojects: subprojects,
                            projects: projects,
                            catContent: subcategory,
                            userList: userList,
                            subproject_name: subproject_Name,
                            subproject_id: subproject_Id,
                            Order_CashFlow: true,
                        })}
                        style={styles.button_style}
                    >
                        <Ionicons name="add-outline" size={35} color={Colors.white} style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                </>
            )}
        </View>
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
        top: windowHeight / 1.25,
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
        paddingHorizontal: 20,
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
    navigation.navigate(route, {
        today: new Date(),
        userList: global.userList,
        account: global.account,
        index: index,
    });
};

export default Order_CashFlow;
