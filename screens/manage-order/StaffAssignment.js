import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    Dimensions,
    Alert,
    FlatList,
    RefreshControl,
    ScrollView,
    SafeAreaView,
} from "react-native";
import { FontAwesome, Ionicons, } from "@expo/vector-icons";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import AwesomeAlert from 'react-native-awesome-alerts';
import AppContext from "../../context/AppContext";
import Loader from "../../components/Loader";
import { Dropdown } from "react-native-element-dropdown";
import { Getemployee, OrderTeamLeader, OrderTeamMember, update_track_log } from '../../services/APIServices';
import PressableButton from "../../components/PressableButton";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";

export default class StaffAssignment extends React.Component {

    static contextType = AppContext;
    constructor(props) {
        super(props);
        console.log('.this.props.orderData.team_members........', this.props.orderData);
        this.state = {
            data: [],
            event_id: 1,
            orderData: this.props.orderData,
            tab: 'List',
            isLoading: false,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',

            assignModal: false,
            employModal: false,
            employee: [],
            empl_name: this.props.orderData.team_leader != null ? JSON.parse(this.props.orderData.team_leader).name : null,
            teamLeader: this.props.orderData.team_leader != null ? JSON.parse(this.props.orderData.team_leader) : null,
            selectedModulePermissions: this.props.orderData.team_members != null ? JSON.parse(this.props.orderData.team_members) : [],
        };
    }

    componentDidMount() {
        this.getEmployee();
        this.focusListner = this.props.navigation.addListener("focus", () => {
            this.getEmployee();
        });
    };
    componentWillUnmount() {
        this.focusListner();
    }


    setSelectedModulePermissions = (item) => {
        this.setState({ selectedModulePermissions: item });
        console.log(item);
    };

    getEmployee = () => {
        Getemployee()
            .then((response) => {
                let Data = response.map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                    };
                });
                this.setState({ employee: Data });
            })
            .catch((error) => {
                console.log(error);
            });
    }


    toggleAssignModal = () => this.setState({ assignModal: !this.state.assignModal });

    OrderTeamLeader = () => {
        let data = {
            order_id: this.state.orderData.order_id,
            teamLeader: JSON.stringify(this.state.teamLeader),
        }
        // console.log('........data.....', data)
        // return
        let value = {
            order_id: this.state.orderData.id,
            reviewer_id: this.context.userData.cust_code,
            reviewer_name: this.context.userData.name,
            type: this.context.userData.type,
            track_comment: `${this.state.teamLeader.name} is assigned as Team Leader`,
        }

        this.setState({ isLoading: true })
        update_track_log(value).then((res) => { console.log('..........res..........', res); }).catch(err => { })
        OrderTeamLeader(data)
            .then((res) => {
                alert(res.message)
                this.setState({ assignModal: false, tab: "Enquiry" })
            })
            .catch(err => console.log('..........err......', err))
            .finally(() => this.setState({ isLoading: false }))
    }
    OrderTeamMember = () => {
        let data = {
            order_id: this.state.orderData.order_id,
            teamMember: JSON.stringify(this.state.selectedModulePermissions),
        }
        // console.log('........data.....', data)
        let value = {
            order_id: this.state.orderData.id,
            reviewer_id: this.context.userData.cust_code,
            reviewer_name: this.context.userData.name,
            type: this.context.userData.type,
            track_comment: `Team member is assigned for this order`,
        }
        // return
        this.setState({ isLoading: true })
        update_track_log(value).then((res) => { console.log('..........res..........', res); }).catch(err => { })
        OrderTeamMember(data)
            .then((res) => {
                console.log('........res.....', res)
                alert(res.message)
                this.setState({ employModal: false })
            })
            .catch(err => console.log('..........err......', err))
            .finally(() => this.setState({ isLoading: false }))
    }

    toggleEmployModal = () => this.setState({ employModal: !this.state.employModal });

    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };

    // rightSwipeActions = () => {
    // 	return (
    // 		<View
    // 			style={{
    // 			backgroundColor: Colors.primary,
    // 			justifyContent: 'center',
    // 			alignItems: 'flex-end',
    // 			}}
    // 		>
    // 			<Text
    // 			style={{
    // 				color: '#fff',
    // 				paddingHorizontal: 10,
    // 				fontWeight: "bold",
    // 				paddingHorizontal: 20,
    // 				paddingVertical: 10,
    // 			}}
    // 			>
    // 			Vehicle Tracking
    // 			</Text>
    // 		</View>
    // 	)
    // }


    render() {
        return (
            <>
                {this.state.isLoading ?
                    <Loader /> :
                    <View style={styles.container}>

                        <View 
                        style={{flexDirection:'row',marginVertical:5}}
                        >
                            {this.state.tab === "List" ?
                                <View 
                                // style={[styles.tab, styles.activeTab, { flexDirection: 'row', alignItems: 'center' }]}
                                style={[
                                    styles.listItem,
                                    {
                                      backgroundColor:
                                      this.state.tab === "List"
                                          ? Colors.primary
                                          : Colors.white,
                                    },
                                  ]}
                                >
                                    <Text 
                                    // style={styles.activeText}
                                    style={[
                                        styles.tagName,
                                        {
                                          color:
                                          this.state.tab === "List" 
                                              ? Colors.white
                                              : Colors.primary,
                                        },
                                      ]}
                                    >
                                        Assign Event Incharge
                                    </Text>
                                    {this.context.userData.action_types.indexOf('Add') >= 0 ?
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ assignModal: true })
                                            }}
                                        >
                                            <FontAwesome
                                                name="plus"
                                                size={15}
                                                color={Colors.white}
                                                style={{ marginLeft: 10 }}
                                            />

                                        </TouchableOpacity>
                                        : null}
                                </View>
                                : <TouchableOpacity
                                    onPress={() => this.setState({ tab: 'List' })}
                                    style={[
                                        styles.listItem,
                                        {
                                          backgroundColor:
                                          this.state.tab === "List"
                                              ? Colors.primary
                                              : Colors.white,
                                        },
                                      ]}
                                >
                                    <Text
                                        style={[
                                            styles.tagName,
                                            {
                                              color:
                                              this.state.tab === "List" 
                                                  ? Colors.white
                                                  : Colors.primary,
                                            },
                                          ]}
                                    >
                                        Event Incharge
                                    </Text>
                                </TouchableOpacity>
                            }


                            {this.state.tab === "Enquiry" ? 
                            <View 
                            style={[
                                styles.listItem,
                                {
                                  backgroundColor:
                                  this.state.tab === "Enquiry"
                                      ? Colors.primary
                                      : Colors.white,
                                },
                              ]}
                            >
                                <Text 
                               style={[
                                styles.tagName,
                                {
                                  color:
                                  this.state.tab === "Enquiry" 
                                      ? Colors.white
                                      : Colors.primary,
                                },
                              ]}
                                >
                                    Assign Staff
                                </Text>
                                {this.context.userData.action_types.indexOf('Add') >= 0 ?
                                    <TouchableOpacity
                                        onPress={() => this.setState({ employModal: true })}
                                    >
                                        <FontAwesome
                                            name="plus"
                                            size={15}
                                            color={Colors.white}
                                            style={{ marginLeft: 10 }}
                                        />

                                    </TouchableOpacity>
                                    : null}
                            </View>
                                : <TouchableOpacity
                                    onPress={() => this.setState({ tab: 'Enquiry' })}
                                    style={[
                                        styles.listItem,
                                        {
                                          backgroundColor:
                                          this.state.tab === "Enquiry"
                                              ? Colors.primary
                                              : Colors.white,
                                        },
                                      ]}
                                >
                                    <Text
                                       style={[
                                        styles.tagName,
                                        {
                                          color:
                                          this.state.tab === "Enquiry" 
                                              ? Colors.white
                                              : Colors.primary,
                                        },
                                      ]}
                                    >
                                        Staff
                                    </Text>
                                </TouchableOpacity>
                            }

                        </View>
                        {/* {this.props.orderData.team_members == null && this.props.orderData.team_leader == null ? null : */}
                        <ScrollView>
                            {/* <View style={styles.Card}> */}
                            {this.state.empl_name != null ?
                            <View style={[styles.Card, {flexDirection: 'row' }]}>
                                {/* <View style={[styles.capsule]} >
                                    <Text  style={styles.capsuleText}>{this.state.empl_name}</Text>
                                </View> */}
                                <View style={[styles.CardContainer, { flexDirection: 'row', padding: 10 }]}>
                                    <Text style={styles.inputLable}>Incharge : </Text>
                                    <Text style={styles.inputLable}> {this.state.empl_name}</Text>
                                </View>
                                {/* <View style={[styles.capsuleContainer, { padding: 10, flexDirection: 'row' }]}>
                                    {this.state.selectedModulePermissions.map((value, index) => {
                                        return (
                                            <View style={[styles.capsule]} >
                                                <Text key={index} style={styles.capsuleText}>{value.name}</Text>
                                            </View>
                                        )
                                    })
                                    }
                                </View> */}
                            </View>
                            :null}
                            {/* {this.state.empl_name != null ?
                                <View style={[styles.tab, styles.activeTab, { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary }]}>
                                    <Text style={styles.activeText}>
                                        Assign Staff
                                    </Text>
                                    {this.context.userData.action_types.indexOf('Add') >= 0 ?
                                        <TouchableOpacity
                                            onPress={() => this.setState({ employModal: true })}
                                        >
                                            <FontAwesome
                                                name="plus"
                                                size={15}
                                                color={Colors.white}
                                                style={{ marginLeft: 10 }}
                                            />

                                        </TouchableOpacity>
                                        : null}
                                </View>
                                : null
                            } */}
{this.state.empl_name != null ?
                            <View>
                                <Text style={{margin:5}}>Assigned Staff :</Text>
                                <View style={[styles.capsule]} >
                                {this.state.selectedModulePermissions.map((value, index) => {
                                    return (                                 
                                            <Text key={index} style={styles.inputLable}>{value.name} , </Text>
                                    )
                                })
                                }
                            </View>
                            </View>
                            :null}

                        </ScrollView>
                        {/* } */}

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.assignModal}
                            onRequestClose={this.toggleAssignModal}
                        >
                            <SafeAreaView style={styles.modalOverlay}>
                                <View style={styles.itemModalContainer}>
                                    <View style={styles.itemModalHeader}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={styles.headerBackBtnContainer}
                                            onPress={this.toggleAssignModal}
                                        >
                                            <Ionicons name="arrow-back" size={26} color={Colors.white} />
                                        </TouchableOpacity>
                                        <View style={styles.headerTitleContainer}>
                                            <Text style={{ fontSize: 20, color: Colors.white }}>
                                                Assign Event Incharge
                                            </Text>
                                        </View>
                                    </View>
                                    <ScrollView style={styles.rowContainer}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Event Incharge:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <Dropdown
                                                value={this.state.empl_name}
                                                data={this.state.employee}
                                                onChange={(empl) =>
                                                    this.setState({ empl_name: empl.name, teamLeader: empl })
                                                }
                                                style={[
                                                    styles.textInput,

                                                ]}
                                                inputSearchStyle={[styles.inputSearchStyle]}
                                                placeholderStyle={{ color: Colors.textColor }}
                                                selectedTextStyle={styles.textInput}
                                                labelField="name"
                                                valueField="id"
                                                placeholder={
                                                    !this.state.empl_name ? "Select Event Incharge" : this.state.empl_name
                                                }
                                            />
                                        </View>
                                    </ScrollView>
                                    <View style={{ marginHorizontal: 15, marginBottom: 10 }}>
                                        {this.context.userData.action_types.indexOf('Edit') >= 0 ?
                                            <PressableButton
                                                text={'Save'}
                                                onPress={() => this.OrderTeamLeader()}
                                            />
                                            : null}
                                    </View>
                                </View>
                            </SafeAreaView>
                        </Modal>

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.employModal}
                            onRequestClose={this.toggleEmployModal}
                        >
                            <SafeAreaView style={styles.modalOverlay}>
                                <View style={styles.itemModalContainer}>
                                    <View style={styles.itemModalHeader}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={styles.headerBackBtnContainer}
                                            onPress={this.toggleEmployModal}
                                        >
                                            <Ionicons name="arrow-back" size={26} color={Colors.white} />
                                        </TouchableOpacity>
                                        <View style={styles.headerTitleContainer}>
                                            <Text style={{ fontSize: 20, color: Colors.white }}>
                                                Assign Staff
                                            </Text>
                                        </View>
                                    </View>
                                    <ScrollView style={[styles.rowContainer,]}>
                                        <MultiSelectDropdown
                                            label={"Select Staff:"}
                                            items={this.state.employee}
                                            selectedItems={this.state.selectedModulePermissions}
                                            labelStyle={styles.name}
                                            placeHolderContainer={[styles.textInput]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedItemsContainer={[styles.selectedItemsContainer, { backgroundColor: Colors.background, borderRadius: 3 }]}
                                            onSave={this.setSelectedModulePermissions}
                                        />
                                    </ScrollView>
                                    <View style={{ marginHorizontal: 15, marginBottom: 10 }}>
                                        {this.context.userData.action_types.indexOf('Edit') >= 0 ?
                                            <PressableButton
                                                text={'Save'}
                                                onPress={() => this.OrderTeamMember()}
                                            />
                                            : null}
                                    </View>
                                </View>
                            </SafeAreaView>
                        </Modal>
                    </View>
                }

                <AwesomeAlert
                    show={this.state.showAlertModal}
                    showProgress={false}
                    title={this.state.alertType}
                    message={this.state.alertMessage}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    cancelText="cancel"
                    confirmText="Ok"
                    confirmButtonColor="#DD6B55"
                    onCancelPressed={() => {
                        this.hideAlert();
                    }}
                    onConfirmPressed={() => {
                        this.hideAlert();
                    }}
                />
            </>
        );
    }
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    tabContainer: {
        width: "100%",
        height: tabHeight,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#d1d1d1",
        borderTopWidth: 0,
        borderTopColor: "#d1d1d1",
        backgroundColor: Colors.primary
        // elevation: 1,
        // marginTop: 10
    },
    CardContainer: {
        width: "100%",
        height: tabHeight,
        flexDirection: "row",
        alignItems:'center',
        // backgroundColor: Colors.primary,
        // borderRadius: 3,
    },
    Card: {
        margin: 5,
        borderRadius: 3,
        backgroundColor: Colors.white,

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
        borderBottomColor: Colors.white,
    },
    activeText: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.white,
    },
    inActiveText: {
        fontSize: 14,
        color: Colors.white,
        opacity: 0.8,
    },
    card: {
        width: "100%",
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderColor: Colors.textInputBorder,
        // elevation: 2
    },

    row: {
        marginTop: 5,
        flexDirection: 'row',
    },
    rowItem: {
        width: '33.33%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    rowLebel: {
        fontWeight: 'bold',
        //color: 'silver',
        fontSize: 16

    },
    rowValue: {
        color: 'gray'
    },
    subText: {
        fontSize: 13,
        color: Colors.textColor,
        opacity: 0.9,
        marginBottom: 2,
    },
    btn_touch: {
        width: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    form: {
        flex: 1,
        padding: 8,
    },
    topBtnContainer: {
        width: "100%",
        flexDirection: "row",
        marginBottom: 30,
    },
    topBtn: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
        marginRight: 15,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    inputLable: {
        fontSize: 14,
    color: Colors.textColor,
    marginBottom: 0,
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
    capsuleContainer: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    capsule: {
        height: 30,
        paddingHorizontal: 10,
        paddingBottom: 2,
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 3,
        backgroundColor: Colors.white,
        flexDirection:'row',
        alignItems:'center',
    },
    capsuleText: {
        fontSize: 14,
        color: Colors.black,
    },
    tbody: {
        flexDirection: "row",
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: Colors.textInputBorder,
    },
    tdLarge: {
        flex: 0.5,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: Colors.textInputBorder,
        borderRightColor: Colors.textInputBorder,
        justifyContent: "center",
        paddingHorizontal: 6,
    },
    tdSmall: {
        flex: 0.2,
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        borderRightColor: Colors.textInputBorder,
        paddingHorizontal: 6,
    },
    tdLabel: {
        fontSize: 14,
        color: Colors.textColor,
        opacity: 0.8,
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
    modalOverlay: {
        justifyContent: "center",
        alignItems: "center",
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.background,
    },
    itemModalContainer: {
        flex: 1,
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.background,
    },
    itemModalHeader: {
        height: 55,
        flexDirection: "row",
        width: "100%",
        backgroundColor: Colors.primary,
        // elevation: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    headerBackBtnContainer: {
        width: "15%",
        height: 55,
        paddingLeft: 5,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    headerTitleContainer: {
        width: "70%",
        paddingLeft: 20,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
    },
    itemModalBody: {
        // flex: 1,
        // height: windowHeight - 55,
        // height: 52,
        // padding: 1,
        // flexDirection: "row",
        // justifyContent: "flex-end",
        // marginBottom: 0,

        // alignItems: "center",

        // marginVertical: 0,
    },


    listRow: {
        // flexDirection: "row",
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderRadius: 4,
        // elevation: 10,
        marginBottom: 10,
        margin: 10,
    },

    leftPart: {
        width: "70%",
        justifyContent: "center",
    },
    rightPart: {
        width: "30%",
        justifyContent: "center",
    },

    title: {
        fontSize: 16,
        color: Colors.textColor,
        fontWeight: "bold",
        lineHeight: 24,
    },

    subText: {
        color: Colors.textColor,
        opacity: 0.8,
        fontSize: 14,
        lineHeight: 22,
    },
    rowLeft: {
        width: "47%",
        backgroundColor: "#fff",
        paddingLeft: 0,
        paddingVertical: 10,
        justifyContent: "center",
        marginTop: 0,
        // paddingTop:1,
        // paddingBottom:1,
    },

    rowRight: {
        flexDirection: "row",
        // width: "53%",
        marginLeft: 0,
        backgroundColor: "#fff",
        marginTop: 0,
        justifyContent: "space-evenly",
    },
    rowContainer: {
        padding: 5,
        paddingHorizontal: 9,
        backgroundColor: Colors.white,
        borderRadius: 4,
        margin: 10,
        marginTop: 7,

    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderWidth: 0.6,
        borderRadius: 3,
        borderColor: Colors.primary,
        marginRight: 5,
        alignItems:'center',
      },
      tagName:{
        fontSize: 14,
        color: Colors.white,
      }
});
