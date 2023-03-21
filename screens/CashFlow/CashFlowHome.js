/*
*
* cashflow tab home page 
* created by - Rahul Saha
* created on - 29.11.22
*
*/

import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native'
import { Header } from '../../components'
import Colors from '../../config/colors';
import Configs from '../../config/Configs'
import AppContext from '../../context/AppContext';
import { SimpleLineIcons, MaterialCommunityIcons, } from "@expo/vector-icons";
import Income from './Income';
import Expense from './Expense';
import Wallet from './Wallet';
import Transfer from './AddTransfer';
import moment from "moment";
import AuthService from "../../services/CashFlow/Auth";
import { get_new_category } from '../../services/APIServices';

export default class CashFlowHome extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            activeTabIndex: 1,
            workingDate: new Date(),
            walletAmount: 0,
            payMethod: this.props.route.params.payMethod,
            subprojects: this.props.route.params.subprojects,
            projects: this.props.route.params.projects,
            catContent: this.props.route.params.catContent,
            userList: this.props.route.params.userList,
            //project id = 2 for event
            selectedProject_id: 2,
        }
    }
    setTabIndex = (index) => this.setState({ activeTabIndex: index });
    gotoIncome = (value) => {
        this.setState({ activeTabIndex: 0 });
    };
    gotoExpense = (value) => {
        this.setState({ activeTabIndex: 1 });
    };
    gotoTransfer = (value) => {
        this.setState({ activeTabIndex: 2 });
    };
    componentDidMount = () => {
        this.focusListner = this.props.navigation.addListener("focus", () => {
            this.updateAccount();
            // this.getCategory();
            // this.getPayMethod();
            // this.getProjectDetails();
            // this.getSubProjectList(this.state.selectedProject_id);
            // this.getUserList();
        });
    };
    componentWillUnmount() {
        this.focusListner();
    }
    async updateAccount() {
        // let userAcc = await AuthService.getAccount();
        let userAcc = this.context.userData;
        let acdata = await AuthService.retriveAccount(
            userAcc.cust_code,
            userAcc.id
        );
        // console.log(acdata.account);
        this.setState({ walletAmount: acdata.account.amount })
    }
    // getCategory = async () => {
    //     // let contentt = await AuthService.getCat();
    //     let contentt = await AuthService.getCatnew();
    //     if (contentt != "Failed") {
    //         this.setState({
    //             catContent: contentt,
    //         });
    //     } else {
    //         //   this.setState({
    //         //     serverError: true,
    //         //   });
    //     }
    // };
    getCategory = async () =>{
        get_new_category().then((res)=>{
          console.log('.........res..........',res);
          this.setState({
                  catContent: res,
                  serverError: false,
                });
        }).catch(()=>{})
      }
    getPayMethod = async () => {
        const payMethod = await AuthService.getPayMethod();
        this.setState({ payMethod: payMethod });
    };
    getProjectDetails = async () => {
        let projects = await AuthService.getProject();
        this.setState({ projects: projects });
    };
    getSubProjectList = async (value) => {
        let result = await AuthService.getNewSubProjectList(value);
        // console.log("Resultr-------------------->", result);
        this.setState({
            subprojects: result,
        });
    };
    getUserList = async () => {
        let userAcc = this.context.userData;
        let result = await AuthService.getUserList(userAcc.cust_code);
        // console.log('..............userList...............',result);
        this.setState({ userList: result })
    };
    renderTabComponent = () => {
        let { activeTabIndex } = this.state;
        let component;
        switch (activeTabIndex) {
            case 0:
                component = (
                    <Income
                        payMethod={this.state.payMethod}
                        subprojects={this.state.subprojects}
                        projects={this.state.projects}
                        catContent={this.state.catContent}
                        userList={this.state.userList}
                        navigation={this.props.navigation}
                        subproject_name={this.props.route.params.subproject_name}
                        subproject_id={this.props.route.params.subproject_id}
                        Order_CashFlow={this.props.route.params.Order_CashFlow}
                    />
                );
                break;
            case 1:
                component = (
                    <Expense
                        payMethod={this.state.payMethod}
                        subprojects={this.state.subprojects}
                        projects={this.state.projects}
                        catContent={this.state.catContent}
                        userList={this.state.userList}
                        navigation={this.props.navigation}
                        subproject_name={this.props.route.params.subproject_name}
                        subproject_id={this.props.route.params.subproject_id}
                        Order_CashFlow={this.props.route.params.Order_CashFlow}
                    />
                );
                break;
            case 2:
                component = (
                    <Transfer
                        payMethod={this.state.payMethod}
                        subprojects={this.state.subprojects}
                        projects={this.state.projects}
                        catContent={this.state.catContent}
                        userList={this.state.userList}
                        navigation={this.props.navigation}
                        subproject_name={this.props.route.params.subproject_name}
                        subproject_id={this.props.route.params.subproject_id}
                        Order_CashFlow={this.props.route.params.Order_CashFlow}
                    />
                );
                break;
                // case 3:
                // component = (
                //     <Wallet
                //         payMethod={this.state.payMethod}
                //         subprojects={this.state.subprojects}
                //         projects={this.state.projects}
                //         catContent={this.state.catContent}
                //         userList={this.state.userList}
                //         navigation={this.props.navigation}
                //         subproject_name={this.props.route.params.subproject_name}
                //         subproject_id={this.props.route.params.subproject_id}
                //         Order_CashFlow={this.props.route.params.Order_CashFlow}
                //     />
                // );
                // break;
        }

        return component;
    };

    gotoBankDetails = () =>{
        this.props.navigation.navigate("BankPayment")
    }

    render() {
        // console.log('......cashflowHome.....props................',this.props.route.params)
        return (
            <SafeAreaView style={styles.container}>
                <Header
                    // title={"Income"}
                    title={`${this.context.userData.name}`}
                    search={false}
                    walletAmount={`${this.state.walletAmount}`}
                    date={`${moment(this.state.workingDate).format("DD/MM/YY")}`}
                    // date={`${moment(this.state.workingDate).format('Do MMM yy ')}`}
                    // drowerIcon={true}
                    // onPress_drowerIcon={this.selectdrowerIcon}
                    addAction={()=>this.gotoBankDetails()}
                />

                <View style={{ flexDirection: 'row', margin: 5 }}>
                    {Configs.CashFlowTab.map((value, index) => {
                        return (
                            <TouchableOpacity
                                key={index.toString()}
                                activeOpacity={
                                    this.state.activeTabIndex === index ? 1 : 0.2
                                }
                                onPress={
                                    this.state.activeTabIndex === index
                                        ? undefined
                                        : this.setTabIndex.bind(this, index)
                                }
                                style={[
                                    styles.listItem,
                                    {
                                        backgroundColor: this.state.activeTabIndex === index
                                            ? Colors.primary
                                            : Colors.white,
                                    }
                                ]}
                            >
                                <Text
                                    style={[styles.name, {
                                        color: this.state.activeTabIndex === index
                                            ? Colors.white
                                            : Colors.primary,
                                    }]}
                                >
                                    {value.name}
                                </Text>
                            </TouchableOpacity>
                        )
                    })
                    }
                </View>
                {this.renderTabComponent()}

            </SafeAreaView>
        )
    }
}

const tabHeight = 50;
const windowWidth = Dimensions.get("window").width;
const windowwidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    left: {
        width: "15%",
        justifyContent: "center",
    },
    middle: {
        justifyContent: "center",
        flex: 1,
    },
    tabContainer: {
        marginTop: 5,
        width: "100%",
        height: tabHeight,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#d1d1d1",
        // borderTopWidth: 1,
        // borderTopColor: "#d1d1d1",
        backgroundColor: Colors.white,
        justifyContent: "center",
        // elevation: 1,
    },
    tab: {
        minWidth: 95,
        // minWidth: 120,
        paddingHorizontal: 15,
        alignItems: "center",
        justifyContent: "center",
        height: tabHeight,
        backgroundColor: Colors.white,
    },
    underlineStyle: {
        backgroundColor: Colors.primary,
        height: 3,
    },
    activeTab: {
        height: tabHeight - 2,
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
        backgroundColor: Colors.primary
    },
    activeText: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.white,
    },
    inActiveText: {
        fontSize: 14,
        color: Colors.black,
        // opacity: 0.8,
    },

    form: {
        flex: 1,
        padding: 8,
    },

    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    inputLable: {
        fontSize: 16,
        color: Colors.textColor,
        marginBottom: 10,
        // opacity: 0.8,
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
    listItem: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderWidth: 0.6,
        borderRadius: 3,
        borderColor: Colors.primary,
        marginRight: 5,
        width: '32.5%'
    },
    name: {
        fontSize: 14,
        color: Colors.white,
    },
})
