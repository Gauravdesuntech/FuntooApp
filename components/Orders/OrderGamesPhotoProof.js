import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    Dimensions,
    Alert,
    SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";
import AwesomeAlert from 'react-native-awesome-alerts';

import Colors from "../../config/colors";
import OverlayLoader from "../OverlayLoader";
import { getFileData } from "../../utils/Util";
import { SaveOrderGamePhotoProof, GetOrderGamePhotoProof } from "../../services/OrderService";

export default class OrderGamesPhotoProof extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isSetupModalOpen: false,
            isPickerModelOpen: false,

            setup_front_view: undefined,
            frontImageData: undefined,
            setup_close_up_view: undefined,
            closeUpImageData: undefined,
            setup_left_view: undefined,
            leftImageData: undefined,
            setup_right_view: undefined,
            rightImageData: undefined,
            pic_type: null
        }
    }

    openSetupModal = () => {

        // this.setState({	isLoading: true});
        GetOrderGamePhotoProof({ 
            order_id: this.props.orderData.id,
            game_id: this.props.item.game_id
        })
        .then( (result) => {
            if(result.is_success) {
                this.setState({
                    setup_front_view: result.data?.setup_front_view?.thumb_image_url,
                    setup_close_up_view: result.data?.setup_close_up_view?.thumb_image_url,
                    setup_left_view: result.data?.setup_left_view?.thumb_image_url,
                    setup_right_view: result.data?.setup_right_view?.thumb_image_url
                });
            }
        } )
        .catch( err => console.log(err) )
        .finally( () => {
            this.setState({
                isLoading: false,
                isSetupModalOpen: true
            });
        });
    }

    closeSetupModal = () => {
        this.setState({
            isSetupModalOpen: false,
            setup_front_view: undefined,
            setup_close_up_view: undefined,
            setup_left_view: undefined,
            setup_right_view: undefined
        });
    }

    openPickerModal = (type) => {
        this.setState({
            isPickerModelOpen: true,
            pic_type: type
        });
    }

    togglePickerModal = () => {
        this.setState({
            isPickerModelOpen: !this.state.isPickerModelOpen,
            pic_type: null,
        });
    }

    browseGallery = (type) => {
        ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
            if (status.granted) {
                let options = {
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                };

                ImagePicker.launchImageLibraryAsync(options).then((result) => {
                    if (!result.cancelled) {
                        switch (type) {
                            case "front":
                                this.setState({
                                    setup_front_view: result.uri,
                                    frontImageData: getFileData(result),
                                });
                                break;
                            case "closeup":
                                this.setState({
                                    setup_close_up_view: result.uri,
                                    closeUpImageData: getFileData(result),
                                });
                                break;

                            case "left":
                                this.setState({
                                    setup_left_view: result.uri,
                                    leftImageData: getFileData(result),
                                });
                                break
                            case "right":
                                this.setState({
                                    setup_right_view: result.uri,
                                    rightImageData: getFileData(result),
                                });
                                break;
                        }

                        this.setState({
                            isPickerModelOpen: false,
                            pic_type: null,
                        })
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

    openCamera = async (type) => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Warring", "You've refused to allow this appp to access your camera!");
            return;
        }
        const result = await ImagePicker.launchCameraAsync();
        if (!result.cancelled) {
            switch (type) {
                case "front":
                    this.setState({
                        setup_front_view: result.uri,
                        frontImageData: getFileData(result),
                    });
                    break;
                case "closeup":
                    this.setState({
                        setup_close_up_view: result.uri,
                        closeUpImageData: getFileData(result),
                    });
                    break;

                case "left":
                    this.setState({
                        setup_left_view: result.uri,
                        leftImageData: getFileData(result),
                    });

                    console.log(result);
                    break
                case "right":
                    this.setState({
                        setup_right_view: result.uri,
                        rightImageData: getFileData(result),
                    });
                    break;
            }

            this.setState({
                isPickerModelOpen: false,
                pic_type: null,
            });
        }

    };

    savePhotoProof = () => {
        let data = {
            order_id: this.props.orderData.id,
            game_id: this.props.item.game_id,
			front: this.state.frontImageData,
			close_up: this.state.closeUpImageData,
			right: this.state.rightImageData,
			left: this.state.leftImageData
		}

        // console.log('photo proof data-->', data);

        // return

        this.closeSetupModal();
		this.setState({	isLoading: true});
        SaveOrderGamePhotoProof(data)
        .then( (result) => {
            if(result.is_success) {
                if(result.data.is_game_setup_photo_proof_done == 1) {
                    this.props.item.is_game_setup_photo_proof_done = 1;
                } else {
                    this.props.item.is_game_setup_photo_proof_done = 0;
                }
                this.setState({
                    showAlertModal: true,
                    alertType: 'Success',
                    alertMessage: result.message
                });
            }
        } )
        .catch( err => console.log(err) )
        .finally( () => {
            this.setState({	isLoading: false});
        } );

    }

    render = () => (
        <>
            {
                (this.state.isLoading == true) ? (
                    <OverlayLoader visible={this.state.isLoading} />
                ) : (
                    <View style={[styles.tableRow2, { height: 60, alignItems: 'center', justifyContent: 'center' }]}>
                        <Checkbox
                            value={(this.props.item.is_game_setup_photo_proof_done == 1) ? true : false}
                            onValueChange={() => { this.openSetupModal() }}
                            style={{borderColor: '#dfdfdf', borderRadius: 5}}
                        />
                    </View>
                )
            }

            {/* Game Setup photo proof Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.isSetupModalOpen}
                onRequestClose={this.closeSetupModal}
            >
                <SafeAreaView style={styles.modalOverlay}>
                    <View style={styles.itemModalContainer}>
                        <View style={styles.itemModalHeader}>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.headerBackBtnContainer}
                                onPress={this.closeSetupModal}
                            >
                                <Ionicons name="arrow-back" size={26} color={Colors.white} />
                            </TouchableOpacity>
                            <View style={styles.headerTitleContainer}>
                                <Text style={{ fontSize: 20, color: Colors.white }}>
                                    {"Setup Photos"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.itemModalBody}>
                            <View style={styles.form}>

                                <View style={styles.iconPickerContainer}>
                                    
                                    <View style={styles.leftPart}>
                                        <Text style={styles.inputLable}>Front View</Text>
                                    </View>

                                    <View style={styles.rightPart}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={styles.imageContainer}
                                            onPress={this.openPickerModal.bind(this, "front")}
                                        >
                                            {typeof this.state.setup_front_view !== "undefined" ? (
                                                <Image
                                                    style={styles.image}
                                                    source={{ uri: this.state.setup_front_view }}
                                                />
                                            ) : (
                                                <Ionicons
                                                    name="image"
                                                    color={Colors.textColor}
                                                    size={40}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.iconPickerContainer}>

                                    <View style={styles.leftPart}>
                                        <Text style={styles.inputLable}>Close Up</Text>
                                    </View>
                                    
                                    <View style={styles.rightPart}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={styles.imageContainer}
                                            onPress={this.openPickerModal.bind(this, "closeup")}
                                        >
                                            {typeof this.state.setup_close_up_view !== "undefined" ? (
                                                <Image
                                                    style={styles.image}
                                                    source={{ uri: this.state.setup_close_up_view }}
                                                />
                                            ) : (
                                                <Ionicons
                                                    name="image"
                                                    color={Colors.textColor}
                                                    size={40}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                   
                                </View>

                                <View style={styles.iconPickerContainer}>

                                    <View style={styles.leftPart}>
                                        <Text style={styles.inputLable}>Left View</Text>
                                    </View>

                                    <View style={styles.rightPart}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={styles.imageContainer}
                                            onPress={this.openPickerModal.bind(this, "left")}
                                        >
                                            {typeof this.state.setup_left_view !== "undefined" ? (
                                                <Image
                                                    style={styles.image}
                                                    source={{ uri: this.state.setup_left_view }}
                                                />
                                            ) : (
                                                <Ionicons
                                                    name="image"
                                                    color={Colors.textColor}
                                                    size={40}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.iconPickerContainer}>
                                    
                                    <View style={styles.leftPart}>
                                        <Text style={styles.inputLable}>Right View</Text>
                                    </View>
                                    <View style={styles.rightPart}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={styles.imageContainer}
                                            onPress={this.openPickerModal.bind(this, "right")}
                                        >
                                            {typeof this.state.setup_right_view !== "undefined" ? (
                                                <Image
                                                    style={styles.image}
                                                    source={{ uri: this.state.setup_right_view }}
                                                />
                                            ) : (
                                                <Ionicons
                                                    name="image"
                                                    color={Colors.textColor}
                                                    size={40}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={this.savePhotoProof}
                                >
                                    <Text style={{ fontSize: 18, color: Colors.white }}>
                                        SUBMIT
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>

            {/* Photo picker modal */}
            <Modal
                animationType="none"
                transparent={true}
                statusBarTranslucent={true}
                visible={this.state.isPickerModelOpen}
                onPress={this.togglePickerModal}

            >
                <View style={styles.btnModalOverlay}>
                    <View style={styles.btnModalContainer}>
                        <View style={styles.btnModalHeader}>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.btnModalCloseBtn}
                                onPress={this.togglePickerModal}
                            >
                                <Ionicons name="close" size={26} color={Colors.textColor} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.btnModalBody}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={styles.btnChoosemodalBtn}
                                onPress={() => this.openCamera(this.state.pic_type)}
                            >
                                <Text style={styles.btnModalText}>Open Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={styles.btnChoosemodalBtn}
                                onPress={() => this.browseGallery(this.state.pic_type)}
                            >
                                <Text style={styles.btnModalText}>Browse Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
        </>
    )
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
    tableRow2: {
        // backgroundColor: Colors.lightGrey,
        marginRight: 5,
        color: Colors.textColor,
        width: 50
    },
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    lsitContainer: {
        flex: 1,
    },
    card: {
        width: "100%",
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderColor: Colors.textInputBorder,
        //elevation: 2
    },
    row: {
        marginTop: 5,
        flexDirection: 'row',
    },
    rowItem: {
        //width: '33.33%',
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowLebel: {
        fontWeight: 'bold',
        //color: 'silver',
        fontSize: 16

    },
    rowValue: {
        color: Colors.textColor,
    },
    form: {
        flex: 1,
        padding: 8,
    },
    topBtnContainer: {
        width: "100%",
        flexDirection: "row",
        // justifyContent: "space-evenly",
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
        fontSize: 16,
        color: Colors.textColor,
        marginBottom: 10,
        // opacity: 0.8,
    },
    textInput: {
borderWidth:1,
        padding: 9,
        fontSize: 14,
        width: "100%",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
    },
    table: {
        borderColor: "#eee",
        borderWidth: 1,
        paddingHorizontal: 1,
        paddingVertical: 5,
    },

    tableRow: {
        flexDirection: "row",
    },
    thead: {
        flexDirection: "row",
        height: 45,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: Colors.textInputBorder,
        borderBottomColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
    },
    tbody: {
        flexDirection: "row",
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: Colors.textInputBorder,
    },
    tdLarge: {
        width: "49%",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: Colors.textInputBorder,
        borderRightColor: Colors.textInputBorder,
        justifyContent: "center",
        paddingHorizontal: 6,
    },
    tdSmall: {
        width: "17%",
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        borderRightColor: Colors.textInputBorder,
        paddingHorizontal: 6,
    },
    tdLabel: {
        fontSize: 16,
        color: Colors.textColor,
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
    iconPickerContainer: {
        flexDirection: 'row',
        padding: 13
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
    listRow: {
        flexDirection: "row",
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    image: {
        height: 50,
        width: 50,
    },
    leftPart: {
        width: "80%",
        justifyContent: "center",
    },
    rightPart: {
        width: "20%",
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        color: Colors.textColor,
        fontWeight: "bold",
        lineHeight: 24,
    },
    title_qnt: {
        fontSize: 16,
        color: Colors.textColor,
        lineHeight: 24,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    subText: {
        color: Colors.textColor,
        fontSize: 14,
        lineHeight: 22,
    },
    btnModalOverlay: {
        height: windowHeight,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "flex-end",
    },

    btnModalContainer: {
        backgroundColor: "#fff",
        height: Math.floor(400 * 0.5),
        elevation: 20,
    },
    btnModalBody: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    btnModalHeader: {
        height: 50,
        flexDirection: "row",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#ccc",
        elevation: 0.4,
        alignItems: "center",
        justifyContent: 'flex-end'
    },
    btnModalCloseBtn: {
        width: "10%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center'

    },
    btnChoosemodalBtn: {
        flexDirection: "row",
        width: '60%',
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        borderRadius: 5,
    },
    btnModalText: {
        fontSize: 16,
        color: Colors.white,
    }
}
)