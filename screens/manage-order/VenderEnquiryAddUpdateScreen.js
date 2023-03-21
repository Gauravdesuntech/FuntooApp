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
    KeyboardAvoidingView,
    Platform,
    Linking,
    SafeAreaView
} from "react-native";
import Colors from "../../config/colors";
import { Header } from "../../components";
import AwesomeAlert from 'react-native-awesome-alerts';
import { AddVenderEnquiry, UpdateVenderEnquiry } from "../../services/VenderEnquiryApiService";
import AppContext from "../../context/AppContext";
import { getFormattedDate } from "../../utils/Util";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import * as MediaLibrary from "expo-media-library";
import * as DocumentPicker from "expo-document-picker";
import * as mime from "react-native-mime-types";
import * as FileSystem from 'expo-file-system';

import * as SMS from 'expo-sms';
import OverlayLoader from "../../components/OverlayLoader";

const status_list = [
    { name: "Pending", id: 0 },
    { name: "Rejected", id: 1 },
    { name: "Approved", id: 2 }
]

export default class VenderEnquiryAddUpdateScreen extends React.Component {

    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.route.params?.data,
            id: "",
            order_id: "",
            vender_id: "",
            enquiry_by: "",
            date: "",
            time: "",
            name: "",
            mobile: "",
            remark: "",
            category: "",
            status: "",
            status_name: "",
            file: null,
            file_url: '',
            fileBase64: null,
            isModalOpen: false,
            refreshing: false,

            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };

    }


    componentDidMount = () => {
        let data = this.state.data;
        let status_name = null;
        if (data.status == 0) {
            status_name = "Pending";
        }
        if (data.status == 1) {
            status_name = "Rejected";
        }
        if (data.status == 2) {
            status_name = "Approved";
        }

        this.setState({
            id: data.id,
            order_id: data.order_id,
            vender_id: data.vender_id,
            mobile: data.mobile,
            category: data.category,
            status: data.status,
            status_name: status_name,
            name: data.name,
            remark: data.remark,
        });

        if (!data.id) {
            this.dialCall(data.mobile);
            this.setState({ isLoading: true }, () => this.AddVenderEnquiry());
        }
    }

    SendSms = async (mobile, msg) => {
        const result = await SMS.sendSMSAsync(
            [mobile],
            msg
        );
    }


    dialCall = (mobile) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${mobile}`;
        }
        else {
            phoneNumber = `telprompt:${mobile}`;
        }

        Linking.openURL(phoneNumber);
    };


    GetModel() {
        let state = this.state;
        let date = new Date();
        let model = {
            id: state.id,
            order_id: state.order_id,
            vender_id: state.vender_id,
            enquiry_by: this.context.userData?.name,
            date: getFormattedDate(date),
            time: `${date.getHours()}:${date.getMinutes()}`,
            name: state.name,
            mobile: state.mobile,
            remark: state.remark,
            category: state.category,
            status: state.status,
            file: state.fileBase64
        }

        return model;
    }

    AddVenderEnquiry() {
        let data = this.GetModel();
        //this.SendSms(model.mobile,"hi");
        this.setState({
            isLoading: true
        });
        AddVenderEnquiry(data)
        .then(res => {
            if (res.is_success) {
                this.gotoBack();
            } else {
                this.setState({
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: res.message
                })
            }
        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
        .finally( () => {
            this.setState({
                isLoading: false
            })
        });
    }

    UpdateVenderEnquiry() {
        let model = this.GetModel();
        this.setState({
            isLoading: true
        });

        UpdateVenderEnquiry(model).then(res => {
            this.setState({
                isLoading: false
            });
            if (res.is_success) {
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message
                });
                this.gotoBack();
            } else {
                this.setState({
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: res.message
                })
            }
        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        });
    }

    ControlSubmit = () => {
        if (this.state.id) {
            this.UpdateVenderEnquiry();
            return;
        }
        this.AddVenderEnquiry();
    }


    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };

    setStatus = (v) => {
        this.setState({
            status: v.id,
            status_name: v.name,
        });
    };

    encode = uri => {
        if (Platform.OS === 'android') return encodeURI(`file://${uri}`)
        else return uri
    }


    browseFile = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, type: '*/*' });
            if (result.type === "success") {
                let fileBase64 = await FileSystem.readAsStringAsync(this.encode(result.uri), { encoding: 'base64' });
                this.setState({
                    file_url: result.name,
                    fileBase64: fileBase64
                });
            }
        } catch (e) {
            Alert.alert("Warning", "Please grant the permission to access the media library.");
        }
    }

    gotoBack = () => this.props.navigation.goBack();

    setMobile = (number) => {
        if (number?.length <= 10) {
            this.setState({ mobile: number });
        }
    }

    render() {
        return (
            <SafeAreaView>
                {this.state.isLoading &&
                    <OverlayLoader />}
                <View style={styles.container}>
                    <Header title={this.state.id ? "Update Enquiry" : "Add Enquiry"} />
                        <View style={styles.form}>
                            <KeyboardAwareScrollView>
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
                                    <Text style={styles.inputLable}>Remark:</Text>
                                    <TextInput
                                        value={this.state.remark}
                                        autoCompleteType="off"
                                        keyboardType="default"
                                        style={styles.textInput}
                                        multiline={true}
                                        onChangeText={(remark) => this.setState({ remark })}
                                    />
                                </View>


                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLable}>Attach Proof:</Text>
                                    <TouchableOpacity onPress={this.browseFile}>
                                        <TextInput
                                            editable={false}
                                            value={this.state.file_url}
                                            style={styles.textInput}
                                            placeholder="Browse File"
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLable}>Status:</Text>
                                    <Dropdown
                                        value={this.state.status_name}
                                        data={status_list}
                                        onChange={this.setStatus}
                                        style={styles.textInput}
                                        inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
                                        search
                                        labelField="name"
                                        valueField="name"
                                        placeholder={!this.state.status_name ? 'Select Status' : '...'}
                                        searchPlaceholder="Search..."
                                    />
                                </View>
                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={this.ControlSubmit}
                                >
                                    <Text style={{ fontSize: 18, color: Colors.white }}>
                                        {this.state.id ? "Update" : "Save"}
                                    </Text>
                                </TouchableOpacity>
                            </KeyboardAwareScrollView>
                        </View>


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
                </View>
            </SafeAreaView>
        )
    }

}



const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        // flex: 1,
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
        color: Colors.grey,
        marginBottom: 2,
    },
    subText: {
        fontSize: 13,
        color: Colors.grey,
        opacity: 0.9,
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
        // flex: 1,
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
        height: 45,
        width: "100%",
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
    },
});