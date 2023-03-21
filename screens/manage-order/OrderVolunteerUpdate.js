import React, {Component} from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Alert,
    Platform,
    KeyboardAvoidingView,
    Modal,
    Image,
    SafeAreaView
} from "react-native";
import {
    Ionicons
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../config/colors";
import AwesomeAlert from 'react-native-awesome-alerts';
import { getFileData } from "../../utils/Util";
import { Dropdown } from 'react-native-element-dropdown';
import AppContext from "../../context/AppContext";
import { Header } from "../../components";
import OverlayLoader from "../../components/OverlayLoader";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { GetOrderVenderLists, UpdateOrderVenderVolunteer } from "../../services/OrderService";

export default class OrderVolunteerUpdate extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            order_id: this.props.route.params.item.order_id,
            game_id: this.props.route.params.item.game_id,
            vender_id: "",
            vender_name: "",
            name: "",
            mobile: "",
            photo: undefined,
            file: null,

            isPickerModelOpen: false,
            pic_type: "",

            fileName: "",
            template_name: "",
            isLoading: false,
            list: [],
            venders: [],
            showAlertModal: false,
            alertMessage: "",
            alertType: ''
        }
    }

    componentDidMount = () => {
        this.focusListner = this.props.navigation.addListener("focus", () => this.Bind());
    };

    componentWillUnmount() {
        this.focusListner();
    }

    Bind() {
        this.VenderList();
        let item = this.props.route.params.item;
        this.setState({
            vender_id: item.vender_id,
            vender_name: item.vender_name,
            name: item.name,
            mobile: item.mobile,
            photo: item?.thumb_url
        });
    }

    VenderList() {
        this.setState({
            isLoading: true
        });

        GetOrderVenderLists({order_id: this.state.order_id})
        .then(res => {
            if(res.is_success) {
                this.setState({
                    venders: res.data
                });
            }
        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
        .finally( () => {
            this.setState({
                isLoading: false,
                refreshing: false
            });
        } )
    }

    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });

        this.gotoBack();
    };

    UpdateItem = () => {
        let state = this.state;
        let data = {
            id: this.props.route.params.item.id,
            vender_id: state.vender_id,
            mobile: state.mobile,
            name:state.name,
            image: state.file
        }

        this.setState({ isLoading: true });
        UpdateOrderVenderVolunteer(data)
        .then( (result) => {
            if(result.is_success) {
                this.setState({
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: result.message
                });
            }
        } )
        .catch( err => console.log(err) )
        .finally( () => {
            this.setState({ isLoading: false });
        });
    }

    gotoBack = () => this.props.navigation.goBack();

    setMobile = (number) => {
        if (number?.length <= 10) {
            this.setState({ mobile: number });
        }
    }

    setVender = (v) => {
        this.setState({
            vender_id: v.id,
            vender_name: v.name
        });
    };
    
	togglePickerModal = () => {
		this.setState({
			isPickerModelOpen: !this.state.isPickerModelOpen,
			pic_type: null,
		});
	}

    openPickerModal = (type) => {
        this.setState({
            isPickerModelOpen: true,
            pic_type: type
        });
    }

    browseIcon = (type) => {
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				let optins = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [1, 1],
					quality: 1,
				};

				ImagePicker.launchImageLibraryAsync(optins).then((result) => {
					if (!result.cancelled) {
						if (type === "volunteer") {
							this.setState({
								photo: result.uri,
								file: getFileData(result),
							});
						} 

						this.setState({
							isPickerModelOpen: false,
							pic_type: null,
						});
					}
				});
			} else {
				Alert.alert("Warning", "Please allow permission to choose an icon");
			}
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

			if (type === "volunteer") {
				this.setState({
					photo: result.uri,
					file: getFileData(result),
				});
			}

			this.setState({
				isPickerModelOpen: false,
				pic_type: null,
			})
		}

	};

    render() {
        return (
            <SafeAreaView>
                {this.state.isLoading &&
                    <OverlayLoader /> }
                <View style={styles.container}>
                    <Header title={"Update Volunteer"} />
                        <View style={styles.form}>
                            <KeyboardAwareScrollView>
    
                                <View style={styles.iconPickerContainer}>
                                    <Text style={styles.inputLable}>Volunteer Photo</Text>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.imageContainer}
                                        onPress={this.openPickerModal.bind(this, "volunteer")}
                                    >
                                        {typeof this.state.photo !== "undefined" ? (
                                            <Image
                                                style={styles.image}
                                                source={{ uri: this.state.photo }}
                                            />
                                        ) : (
                                            <Ionicons
                                                name="image"
                                                color={Colors.lightGrey}
                                                size={40}
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
    
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLable}>Name:</Text>
                                    <TextInput
                                        value={this.state.name}
                                        autoCompleteType="off"
                                        style={styles.textInput}
                                        onChangeText={(name) => this.setState({ name })}
                                    />
                                </View>
    
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLable}>Mobile:</Text>
                                    <TextInput
                                        value={this.state.mobile}
                                        autoCompleteType="off"
                                        autoCapitalize="words"
                                        keyboardType="numeric"
                                        style={styles.textInput}
                                        onChangeText={(mobile) => this.setMobile(mobile)}
                                    />
                                </View>
    
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLable}>Select Vendor:</Text>
                                    <Dropdown
                                        value={this.state.vender_name}
                                        data={this.state.venders}
                                        onChange={this.setVender}
                                        style={styles.textInput}
                                        inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
                                        search
                                        maxHeight={300}
                                        labelField="name"
                                        valueField="name"
                                        placeholder={!this.state.vender_name ? 'Select Vendor' : '...'}
                                        searchPlaceholder="Search..."
                                    />
                                </View>
    
    
                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={this.UpdateItem}
                                >
                                    <Text style={{ fontSize: 18, color: Colors.white }}>Update</Text>
                                </TouchableOpacity>
    
                            </KeyboardAwareScrollView>
                        </View>
                </View>
    
                                                
    
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
                                    onPress={() => this.browseIcon(this.state.pic_type)}
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
            </SafeAreaView>
        );
    }
}

const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        height: windowHeight,
        backgroundColor: Colors.white,
    },

    lsitContainer: {
        flex: 1,
    },
    listRow: {
        flexDirection: "row",
        borderColor: "#eee",
        borderWidth: 1,
        padding: 20,
        margin: 10,
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
        //fontSize: 16,
        color: Colors.grey,
        fontWeight: "bold",
        lineHeight: 24,
    },

    subText: {
        color: Colors.grey,
        opacity: 0.8,
        fontSize: 14,
        lineHeight: 22,
    },

    form: {
        // flex: 1,
        height: windowHeight,
        top:50,
        padding: 8,
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
borderWidth:1,
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
        marginBottom: 15,
        height: 45,
        width: "100%",
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
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
	},
});