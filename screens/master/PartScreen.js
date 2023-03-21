import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
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
import Configs from "../../config/Configs";
import { getFileData } from "../../utils/Util";
import Loader from "../../components/Loader";
import ProgressiveImage from "../../components/ProgressiveImage";
import AwesomeAlert from 'react-native-awesome-alerts';
import { PartList, AddPart, UpdatePart, DeletePart } from "../../services/PartApiService";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import { StorageAreaList } from "../../services/StorageAreaApiService";
import * as ImagePicker from "expo-image-picker";
import EmptyScreen from "../../components/EmptyScreen";
import AppContext from "../../context/AppContext";

export default class PartScreen extends React.Component {
	static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            storage_areas: [],
            storage_area_id: "",
            storage_area_name: "",
            name: "",
            stock_quantity: "",
            imageURI: "",
            imageData: undefined,
            isModalOpen: false,
            refreshing: false,
            loader: false,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }

    componentDidMount = () => {
        this.PartList();
        this.StorageAreaList();
    }


    PartList() {

        PartList().then(res => {
            this.setState({
                list: res.data,
                refreshing: false,
            });

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }

    StorageAreaList() {
        this.setState({
            isLoading: true
        });

        StorageAreaList().then(res => {
            this.setState({
                isLoading: false,
                storage_areas: res.data
            });
        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }


    AddPart() {
      if(  this.context.userData.action_types.indexOf('Add') >= 0 ){
         let model = {
            storage_area_id: this.state.storage_area_id,
            name: this.state.name,
            stock_quantity: this.state.stock_quantity,
            image: this.state.imageData
        }
        this.setState({
            loader: true
        });

        AddPart(model).then(res => {

            if (res.is_success) {
                this.PartList();
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
    }


    UpdatePart() {
        if(  this.context.userData.action_types.indexOf('Edit') >= 0 ){
        let model = {
            id: this.state.id,
            storage_area_id: this.state.storage_area_id,
            name: this.state.name,
            stock_quantity: this.state.stock_quantity,
            image: this.state.imageData ?? null
        }
        this.setState({
            loader: true
        });

        UpdatePart(model).then(res => {
            if (res.is_success) {
                this.PartList();
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message,
                    loader: false
                })
            } else {
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: res.message,
                    loader: false
                })
            }
        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })}
    }

    ControlSubmit = () => {
        if (this.state.id) {
            this.UpdatePart();
            return;
        }
        this.AddPart();
    }


    chooseIcon = () => {
        ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
            if (status.granted) {
                this.setState({
                    imageURI: undefined,
                    imageData: undefined,
                });

                let optins = {
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                };

                ImagePicker.launchImageLibraryAsync(optins).then((result) => {
                    if (!result.cancelled) {
                        this.setState({
                            imageURI: result.uri,
                            imageData: getFileData(result),
                        });
                    }
                });
            } else {
                Alert.alert("Warning", "Please allow permission to choose an icon");
            }
        });
    };


    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };

    SetStorageAreaId = (v) => {
        this.setState({
            storage_area_id: v.id,
            storage_area_name: v.name,
        });
    };


    editPart = (item) => {
        this.setState({
            name: item.name,
            id: item.id,
            imageURI: Configs.GAME_PARTS_URL + item.image,
            Image: null,
            stock_quantity: item.stock_quantity,
            storage_area_id: item.storage_area_id,
            storage_area_name: item.storage_area_name,
            isModalOpen: true,
        });
    }


    DeletePart = (id) => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this part?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        DeletePart({ id: id }).then(res => {
                            if (res.is_success) {
                                this.PartList();
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

    lsitItem = ({ item }) => (
        <View key={item.id.toString()} style={styles.card}>
            <View style={{ width: "20%" }}>
                <ProgressiveImage
                    source={{ uri: Configs.GAME_PARTS_URL + item.image }}
                    style={{ height: 57, width: "100%" }}
                    resizeMode="cover"
                />
            </View>
            <View style={{ width: "70%", paddingLeft: 10 }}>
                <Text style={styles.subText}>{"Parts Name: " + item.name}</Text>
                {item.storage_area_name != null?
                <Text style={styles.subText}>{"Storage: " + item.storage_area_name}</Text>
                :null}
                <Text style={styles.subText}>{"Quantity: " + item.stock_quantity}</Text>
            </View>
            <View style={styles.qtyContainer}>
                {this.context.userData.action_types.indexOf('Edit') >= 0 ?
                <TouchableOpacity
                    style={{ padding: 3 }}
                    onPress={this.editPart.bind(this, item)}
                >
                    <MaterialIcons name="create" size={22} color={Colors.success} />
                </TouchableOpacity>
                : null}
                {this.context.userData.action_types.indexOf('Delete') >= 0 ?
                <TouchableOpacity style={{ padding: 3 }}>
                    <MaterialIcons name="delete" size={22} color={Colors.danger} onPress={this.DeletePart.bind(this, item.id)} />
                </TouchableOpacity>
                :null}
            </View>
        </View>
    );


    toggleModal = () =>
        this.setState({
            name: "",
            id: null,
            storage_area_id: "",
            storage_area_name: "",
            stock_quantity: '',
            imageURI: null,
            isModalOpen: !this.state.isModalOpen,
        });

    onRefresh = () => {
        this.setState({ refreshing: true }, () => { this.PartList() })
    }

    renderEmptyContainer = () => {
        return (
            <EmptyScreen />
        )
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="Part List" addAction={this.toggleModal} />

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
                                        {this.state.id ? "Update" : "Add"}  Part
                                    </Text>
                                </View>
                            </View>



                            <View style={styles.itemModalBody}>
                                <View style={styles.form}>
                                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

                                        <View style={styles.iconPickerContainer}>
                                            <Text style={styles.inputLable}>Choose Icon</Text>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={styles.imageContainer}
                                                onPress={this.chooseIcon}
                                            >
                                                {typeof this.state.imageURI !== "undefined" ? (
                                                    <Image
                                                        style={styles.image}
                                                        source={{ uri: this.state.imageURI }}
                                                    />
                                                ) : (
                                                    <Ionicons name="image" color={Colors.textColor} size={40} />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLable}> Name:</Text>
                                            <TextInput
                                                value={this.state.name}
                                                autoCompleteType="off"
                                                autoCapitalize="words"
                                                style={styles.textInput}
                                                onChangeText={(name) => this.setState({ name })}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLable}>Storage Name</Text>
                                            <Dropdown
                                                value={this.state.storage_area_name}
                                                data={this.state.storage_areas}
                                                onChange={this.SetStorageAreaId}
                                                style={styles.textInput}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
                                                search
                                                labelField="name"
                                                valueField="name"
                                                placeholder={!this.state.storage_area_name ? 'Select Part Name' : '...'}
                                                searchPlaceholder="Search..."
                                            />
                                        </View>


                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLable}>Quantity:</Text>
                                            <TextInput
                                                value={this.state.stock_quantity}
                                                autoCompleteType="off"
                                                keyboardType="number-pad"
                                                style={styles.textInput}
                                                onChangeText={(stock_quantity) => this.setState({ stock_quantity })}
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
                                                    SUBMIT
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
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

