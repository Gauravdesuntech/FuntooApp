import React from "react";
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Modal,
    Dimensions,
    TouchableOpacity,
    Alert,
    ScrollView,
    TextInput,
    RefreshControl,
    SafeAreaView,
    ActivityIndicator
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header } from "../../components";
import Loader from "../../components/Loader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { PriorityList, CreatePriority, UpdatePriority, DeletePriority } from "../../services/PriorityService";
import EmptyScreen from "../../components/EmptyScreen";
import Checkbox from "expo-checkbox";
import AppContext from "../../context/AppContext";

export default class PriorityScreen extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            name: "",
            ordering: "",
            isModalOpen: false,
            refreshing: false,
            primary: false,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            loader: false
        };
    }

    componentDidMount = () => {
        this.PriorityList();
    }


    PriorityList() {
        this.setState({
            isLoading: true
        });

        PriorityList().then(res => {
            this.setState({
                isLoading: false,
                list: res.data,
                refreshing: false,
            });

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }


    AddPriority() {
      if(this.context.userData.action_types.indexOf('Add') >= 0) { let model = {
            name: this.state.name,
            primary: Number(this.state.primary),
            ordering: this.state.ordering,
        }
        CreatePriority(model).then(res => {
            this.setState({
                isLoading: false,
                loader: true,
            });

            if (res.is_success) {
                this.PriorityList();
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message,
                    loader: false,
                })
            } else {
                this.setState({
                    loader: false
                })
                Alert.alert("Error", res.message);
            }



        }).catch((error) => {
            this.setState({
                loader: false
            })
            Alert.alert("Server Error", error.message);
        })}
    }


    UpdatePriority() {
      if(this.context.userData.action_types.indexOf('Edit') >= 0) { let model = {
            id: this.state.id,
            name: this.state.name,
            primary: Number(this.state.primary),
            ordering: this.state.ordering,
        }
        // this.setState({
        //     isLoading: true
        // });
        this.setState({
            loader: true
        })
        UpdatePriority(model).then(res => {
            this.setState({
                isLoading: false
            });
            if (res.is_success) {
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message,
                    loader: true
                });
                this.PriorityList();
            } else {
                this.setState({
                    loader: false
                })
                Alert.alert("Error", res.message);
            }
        }).catch((error) => {
            this.setState({
                loader: false
            })
            Alert.alert("Server Error", error.message);
        })}
    }
    handlePrimary = (data) => {
        this.setState({
            primary: !this.state.primary
        }, () => {
            console.log(Number(this.state.primary), Boolean(this.state.primary));
        })

    }

    DeletePriority = (id) => {
      if(this.context.userData.action_types.indexOf('Delete') >= 0){ Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this Priority?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        DeletePriority({ id: id }).then(res => {
                            if (res.is_success) {
                                this.PriorityList();
                            }

                            else {
                                this.setState({
                                    showAlertModal: true,
                                    alertType: "Error",
                                    alertMessage: res.message
                                })
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
        )};
    }

    ControlSubmit = () => {
        if (this.state.id) {
            this.UpdatePriority();
            return;
        } else { this.AddPriority(); }
    }


    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };

    editPart = (item) => {
        this.setState({
            id: item.id,
            name: item.name,
            primary: Boolean(item.primary),
            ordering: item.ordering,
            isModalOpen: true,
        });
    }

    toggleModal = () =>
        this.setState({
            id: "",
            name: "",
            ordering: "",
            isModalOpen: !this.state.isModalOpen,
        });

    onRefresh = () => {
        this.setState({ refreshing: true }, () => { this.PriorityList() })
    }


    renderEmptyContainer = () => {
        return (
            <EmptyScreen />
        )
    }


    listItem = ({ item }) => (
        <View key={item.id.toString()} style={styles.card}>

            <View style={{ paddingLeft: 10, width: "90%" }}>
                <Text style={styles.subText}>{item.name}</Text>
                {/* <Text style={styles.subText}>Ordering : {item.ordering}</Text> */}
            </View>
            <View style={styles.qtyContainer}>
                {this.context.userData.action_types.indexOf('Edit') >= 0 ?
                <TouchableOpacity
                    style={{ padding: 3 }}
                    onPress={this.editPart.bind(this, item)}
                >
                    <MaterialIcons name="create" size={22} color={Colors.success} />
                </TouchableOpacity>
                :null}
                {this.context.userData.action_types.indexOf('Delete') >= 0 ?
                <TouchableOpacity style={{ padding: 3 }}>
                    <MaterialIcons name="delete" size={22} color={Colors.danger} onPress={this.DeletePriority.bind(this, item.id)} />
                </TouchableOpacity>
                :null}
            </View>
        </View>
    );


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="Priority List" addAction={this.toggleModal} />

                {this.state.isLoading ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={this.state.list}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.listItem}
                        initialNumToRender={this.state.list.length}
                        contentContainerStyle={styles.lsitContainer}
                        ListEmptyComponent={this.renderEmptyContainer()}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />
                        }
                    />
                )}

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isModalOpen}
                    onRequestClose={this.toggleModal}
                >


                    <SafeAreaView style={styles.modalOverlay}>
                        <View style={styles.itemModalContainer}>
                            <View style={styles.itemModalHeader}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.headerBackBtnContainer}
                                    onPress={this.toggleModal}
                                >
                                    <Ionicons name="arrow-back" size={26} color={Colors.white} />
                                </TouchableOpacity>
                                <View style={styles.headerTitleContainer}>
                                    <Text style={{ fontSize: 20, color: Colors.white }}>
                                        {this.state.id ? "Update" : "Add"}  Priority
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.itemModalBody}>
                                <View style={styles.form}>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLable}> Name:</Text>
                                            <TextInput
                                                value={this.state.name}
                                                autoCompleteType="off"
                                                style={styles.textInput}
                                                onChangeText={(name) => this.setState({ name })}
                                            />
                                        </View>

                                        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                                            <View>
                                                <Checkbox color={"orange"} value={this.state.primary} onValueChange={(v) => this.handlePrimary(v)} />
                                            </View>
                                            <View style={{ justifyContent: 'center', marginLeft: 8 }}>
                                                <Text style={styles.inputLable}>Primary</Text>
                                            </View>
                                        </View>


                                        <TouchableOpacity
                                            style={styles.submitBtn}
                                            onPress={!this.state.loader ? this.ControlSubmit : () => { }}
                                        >
                                            {this.state.loader ? (
                                                <ActivityIndicator color={'#fff'} />
                                            ) : (
                                                <Text style={{ fontSize: 18, color: Colors.white }}>
                                                    {this.state.id ? "Update" : "Save"}
                                                </Text>
                                            )}

                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>

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
            </SafeAreaView>
        )
    }

}



const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    lsitContainer: {
        flex: 1,
    },
    card: {
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderColor: Colors.textInputBorder,
    },
    qtyContainer: {
        width: "10%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",

    },
    titleText: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.textColor,
        marginBottom: 2,
    },
    subText: {
        fontSize: 13,
        color: Colors.textColor,
        marginBottom: 2,
    },
    modalOverlay: {
        justifyContent: "center",
        alignItems: "center",
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.white,
    },
    itemModalContainer: {
        flex: 1,
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.white,
    },
    itemModalHeader: {
        height: 55,
        flexDirection: "row",
        width: "100%",
        backgroundColor: Colors.primary,
        elevation: 1,
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
        flex: 1,
        height: windowHeight - 55,
    },
    form: {
        flex: 1,
        padding: 8,
    },
    iconPickerContainer: {
        flexDirection: "row",
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "space-between",
    },
    imageContainer: {
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 3,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    image: {
        height: 50,
        width: 50,
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