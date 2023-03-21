import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
    Dimensions,
    FlatList,
    Modal,
    RefreshControl,
    SafeAreaView,
    ActivityIndicator
} from "react-native";
import EmptyScreen from "../../components/EmptyScreen"
import { Header } from "../../components";
import Loader from "../../components/Loader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { AddEvent, GetAllEvent, UpdateEvent, DeleteEvent } from '../../services/WareHouseService';
import AppContext from "../../context/AppContext";

export default class EventScreen extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);

        this.state = {
            Event: [],
            isModalOpen: false,
            isLoading: false,
            refreshing: false,
            showAlertModal: false,
            alertType: '',
            alertMessage: '',
            updateName: '',
            id: null,
            name: '',
            loader: false,
        }
    }

    componentDidMount() {
        // get all warehouse item
        this.GetAllEvent();
    }

    GetAllEvent() {

        this.setState({
            isLoading: true
        });
        GetAllEvent().then((result) => {
            this.setState({
                isLoading: false,
                Event: result.data,
                refreshing: false,
            });
        })
    }

    Edit = () => {
       if(this.context.userData.action_types.indexOf('Edit') >= 0) 
       {let data = {
            id: this.state.id,
            name: this.state.name,
        };
        if (data.name == this.state.updateName ) {
            Alert.alert("Error", "Can not update same credentials !!");
        } else {
            this.setState({
                loader: true
            })
            UpdateEvent(data).then((result) => {
                this.setState({
                    isLoading: false,
                    loader: true
                });

                if (result.is_success) {
                    this.setState({
                        isModalOpen: false,
                        showAlertModal: true,
                        alertType: "Success",
                        alertMessage: "Event updated successfully",
                        loader: false
                    }, () => {
                        this.GetAllEvent();
                    })
                } else {
                    this.setState({
                        loader: false
                    })
                    Alert.alert("Error", res.message);
                }

            }).catch((err) => {
                this.setState({
                    isLoading: false,
                    loader: false
                });

                Alert.alert("Error", err.message);
            });
        }}

    }

    Add = () => {
      if(this.context.userData.action_types.indexOf('Add') >= 0) 
      { let data = {
            name: this.state.name,
        }
        if (data.name == '') {
            Alert.alert("Error", "Enter Event Name");
        } else {
            this.setState({
                loader: true
            })
            AddEvent(data).then((response) => {
                console.log(response);
                this.setState({ isLoading: false, loader: true });
                if (response.is_success) {
                    this.setState({
                        isModalOpen: false,
                        showAlertModal: true,
                        alertType: "Success",
                        alertMessage: "Event added successfully",
                        loader: false
                    }, () => {
                        this.GetAllEvent();
                    })
                } else {
                    this.setState({
                        loader: false
                    })
                    Alert.alert("Error", response.message);
                }
            }).catch((err) => {
                this.setState({
                    loader: false
                })
                Alert.alert("Error", err.message);
            })}
        }



    }

    ControlSubmit = () => {
        if (this.state.id !== null) {
            this.Edit();
        } else {
            this.Add();
        }
    }

    editPart = (item) => {
        this.setState({
            id: item.id,
            name: item.name,
            updateName: item.name,
            isModalOpen: true,
        });
    }

    Delete = (id) => {
      if(this.context.userData.action_types.indexOf('Delete') >= 0) 
      { Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this warehouse?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        DeleteEvent({ id: id }).then((result) => {
                            if (result.is_success) {
                                this.GetAllEvent();
                            }
                        }).catch((err) => {
                            Alert.alert("Sever Error", "Please try again leter")
                        });
                    }
                },
                {
                    text: "No",
                },
            ]
        )};
    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            id: null,
            name: ''
        })
    }

    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };

    listItem = ({ item }) => (
        <View key={item.id.toString()} style={styles.card}>

            <View style={{ paddingLeft: 10, width: "90%" }}>
                <Text style={styles.subText}>{item.name}</Text>
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
                    <MaterialIcons name="delete" size={22} color={Colors.danger} onPress={this.Delete.bind(this, item.id)} />
                </TouchableOpacity>
                :null}
            </View>
        </View>
    )

    onRefresh() {
        this.setState({ refreshing: true }, () => { this.GetAllEvent() })
    }

    render() {
        return (
            <SafeAreaView>
                <Header title="Events" addAction={(e) => { this.toggleModal() }} />
                {this.state.isLoading ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={this.state.Event}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.listItem}
                        initialNumToRender={this.state.Event.length}
                        contentContainerStyle={styles.lsitContainer}
                        ListEmptyComponent={<EmptyScreen />}
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
                                        {this.state.id ? "Update" : "Add"}  Event
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
        // flex: 1,
        marginVertical: 10,
        marginHorizontal: 8,
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
        color:Colors.textColor,
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