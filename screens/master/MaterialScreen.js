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
import { MaterialList, AddMaterial, UpdateMaterial, DeleteMaterial } from "../../services/MaterialApiService";
import { UOMList } from "../../services/UomApiServices";
import EmptyScreen from "../../components/EmptyScreen";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import AppContext from "../../context/AppContext";

export default class MaterialScreen extends React.Component {
	static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            name: "",
            uom_id: "",
            uom_name: "",
            rate: "",
            isModalOpen: false,
            refreshing: false,
            loader: false,
            uoms: [],
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }

    componentDidMount = () => {
        this.Initialize();
    }


    Initialize() {
        this.MaterialList();
        this.UOMList();
    }


    MaterialList() {
        this.setState({
            isLoading: true
        });

        MaterialList().then(res => {
            this.setState({
                isLoading: false,
                list: res.data,
                refreshing: false,
            });

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }

    UOMList() {
        this.setState({
            isLoading: true
        });

        UOMList().then(res => {
            this.setState({
                isLoading: false,
                uoms: res.data
            });

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }


    DeleteMaterial = (id) => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this materialL?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        DeleteMaterial({ id: id }).then(res => {
                            if (res.is_success) {
                                this.MaterialList();
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


    AddMaterial() {
        let model = {
            name: this.state.name,
            uom_id: this.state.uom_id,
            rate: this.state.rate,
        }
        this.setState({
            isLoading: true,
            loader: true
        });

        AddMaterial(model).then(res => {
            this.setState({
                isLoading: false,
            });
            this.setState({
                isLoading: false
            });
            if (res.is_success) {
                this.MaterialList();
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message,
                    loader: false
                })
            } else {
                this.setState({
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: res.message,
                    loader: false
                })
            }



        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }


    UpdateMaterial() {
        let model = {
            id: this.state.id,
            name: this.state.name,
            uom_id: this.state.uom_id,
            rate: this.state.rate,
        }
        this.setState({
            isLoading: true,
            loader: true
        });

        UpdateMaterial(model).then(res => {
            this.setState({
                isLoading: false
            });
            if (res.is_success) {
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message,
                    loader: false
                });
                this.MaterialList();
            } else {
                this.setState({
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: res.message,
                    loader: false
                })
            }
        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }

    ControlSubmit = () => {
        if (this.state.id) {
            this.UpdateMaterial();
            return;
        }
        this.AddMaterial();
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
            rate: item.rate,
            uom_id: item.uom_id,
            uom_name: item.uom_name,
            isModalOpen: true,
        });
    }

    toggleModal = () =>
        this.setState({
            id: "",
            name: "",
            rate: "",
            uom_id: "",
            uom_name: "",
            isModalOpen: !this.state.isModalOpen,
        });

    onRefresh = () => {
        this.setState({ refreshing: true }, () => { this.Initialize() })
    }

    SetUomId = (v) => {
        this.setState({
            uom_id: v.id,
            uom_name: v.name,
        });
    };



    renderEmptyContainer = () => {
        return (
            <EmptyScreen />
        )
    }


    lsitItem = ({ item }) => (
        <View key={item.id.toString()} style={styles.card}>

            <View style={{ paddingLeft: 10, width: "90%" }}>
                <Text style={styles.subText}>{"Name: " + item.name}</Text>
                <Text style={styles.subText}>{"UOM: " + item.uom_name}</Text>
                <Text style={styles.subText}>{"Rate: " + item.rate}</Text>
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
                    <MaterialIcons name="delete" size={22} color={Colors.danger} onPress={this.DeleteMaterial.bind(this, item.id)} />
                </TouchableOpacity>
                :null}
            </View>
        </View>
    );


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="Material List" addAction={this.toggleModal} />

                {this.state.isLoading ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={this.state.list}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.lsitItem}
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
                                        {this.state.id ? "Update" : "Add"}  Item
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.itemModalBody}>
                                <View style={styles.form}>
                                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLable}> Name:</Text>
                                            <TextInput
                                                value={this.state.name}
                                                autoCompleteType="off"
                                                style={styles.textInput}
                                                onChangeText={(name) => this.setState({ name })}
                                            />
                                        </View>


                                        <View style={styles.inputContainer}>
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={styles.inputLable}>{"UOM: "}</Text>
                                                <TouchableOpacity onPress={() => { this.props.navigation.navigate("UomScreen", { isModalOpen: true }); this.setState({ isModalOpen: false }) }}>
                                                    <Ionicons name="add-circle" color={Colors.primary} size={22} />
                                                </TouchableOpacity>
                                            </View>
                                            <Dropdown
                                                value={this.state.uom_name}
                                                data={this.state.uoms}
                                                onChange={this.SetUomId}
                                                style={styles.textInput}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
                                                search
                                                labelField="name"
                                                valueField="name"
                                                placeholder={!this.state.uom_name ? 'Select UOM' : '...'}
                                                searchPlaceholder="Search..."
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLable}>Rate:</Text>
                                            <TextInput
                                                value={this.state.rate}
                                                autoCompleteType="off"
                                                keyboardType="number-pad"
                                                style={styles.textInput}
                                                onChangeText={(rate) => this.setState({ rate })}
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
                                    </KeyboardAwareScrollView>
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
        padding: 9,
        fontSize: 14,
        width: "100%",
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
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