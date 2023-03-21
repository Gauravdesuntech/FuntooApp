import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Alert,
    Linking,
    Platform,
    KeyboardAvoidingView
} from "react-native";
import {
    FontAwesome,
    Ionicons,
    MaterialIcons,
    Feather,
} from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system';
import * as mime from "react-native-mime-types";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../config/colors";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AwesomeAlert from 'react-native-awesome-alerts';
import { getFileData } from "../../utils/Util";
import { AddRecord, UpdateRecord } from "../../services/EventCallSmsRecordApiService";
import { DateAndTimePicker, Dropdown } from "../../components";
import { getFormattedDate } from "../../utils/Util";
import { TemplateList } from "../../services/TemplateApiService";
import AppContext from "../../context/AppContext";
import { Header } from "../../components";
import * as SMS from 'expo-sms';
import Configs from "../../config/Configs";
import moment from "moment";
import OverlayLoader from "../../components/OverlayLoader";
import Loader from "../../components/Loader";

export default class CallSmsRecordAddUpdateScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            data: this.props?.route?.params?.data,
            id: "",
            event_id: "",
            category: "",
            cust_id: "",
            name: "",
            mobile: "",
            user_id: "",
            record_by: "",
            comments: "",
            attachment: "",
            date: new Date(),
            time: null,

            fileName: "",
            template_name: "",
            file: null,
            isLoading: true,
            list: [],
            smsTemplates: [],
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }


    componentDidMount = () => {
        this.focusListner = this.props?.navigation?.addListener("focus", () => {
            this.Bind();
        });
        this.Bind();
        let data = this.state.data;
        let date = new Date();
        if (data.date) {
            date = new Date(data.date);
        }
        this.setState({
            id: data.id,
            event_id: data.event_id,
            category: data.category,
            cust_id: data.cust_id,
            name: data.name,
            mobile: data.mobile,
            user_id: data.user_id,
            record_by: data.record_by,
            comments: data.comments,
            date: date,
            time: data.time,

        }, () => this.toggleAddRecord());
    };


    componentWillUnmount() {
        this.focusListner();
    }

    Bind() {
        this.TemplateList();
    }
    toggleAddRecord = () => {
        let state = this.state;
        if (state.category == 0 && !state.id) {
        	this.dialCall(this.state.mobile);
            this.AddRecord()
        }
    }

    TemplateList() {
        this.setState({
            isLoading: true
        });

        TemplateList().then(res => {
            this.setState({
                isLoading: false,
                smsTemplates: res.data,
                refreshing: false,
            });

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true }, () => { this.Bind() })
    }

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
                    fileName: result.name,
                    file: fileBase64
                });
            }
        } catch (e) {
            Alert.alert("Warning", "Please grant the permission to access the media library.");
        }
    }



    renderDate = (date) => {
        return moment(date, "YYYY-MM-DD").format("D/MM/YY");;
    }

    renderTime = (v_time) => {
        let time = moment(v_time, "HH:mm").format("hh:mm A");
        return `${time}`;
    }

    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };



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

    ControlRecordSubmit = () => {
        if (this.state.id) {
            this.UpdateRecord();
            return;
        }
        if (this.state.category == 1) {
            this.SendSms(this.state.mobile, this.state.comments);
        } else {
            this.dialCall(this.state.mobile);
        }
        this.AddRecord();
    }

    GetModel() {
        let state = this.state;
        let model = {
            id: state.id,
            event_id:state.event_id,
            category: state.category,
            cust_id: state.cust_id,
            name: state.name,
            mobile: state.mobile,
            user_id: this.context.userData?.id,
            record_by: this.context.userData?.name,
            comments: state.comments,
            file: state.file,
            date: getFormattedDate(this.state.date),
            time: state.time,
        }
        return model;
    }

    AddRecord = () => {
        let model = this.GetModel();
        this.setState({
            isLoading: true
        });
        AddRecord(model).then(res => {
            this.setState({
                isLoading: false
            });
            if (res.is_success) {
                this.setState({
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
        })
    }


    UpdateRecord = () => {
        let model = this.GetModel();
        this.setState({
            isLoading: true
        });
        UpdateRecord(model).then(res => {
            this.setState({
                isLoading: false
            });
            if (res.is_success) {
                this.setState({
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
        })
    }

    gotoBack = () => this.props.navigation.goBack();

    onDateChange = (value) =>
        this.setState({ date: value });

    setMobile = (number) => {
        if (number?.length <= 10) {
            this.setState({ mobile: number });
        }
    }

    setSMSTemplate = (v) => {
        this.setState({
            comments: v.template,
            template_name: v.name
        });
    };



    render = () => (
        <>
            {this.state.isLoading &&
                <OverlayLoader />}
            <View style={styles.container}>
                <Header title={this.state.id ? "Update Record" : "Add Record"} />
                
                    <View style={styles.form}>
                        <KeyboardAwareScrollView>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}> Customer Name:</Text>
                                <TextInput
                                    value={this.state.name}
                                    autoCompleteType="off"
                                    style={styles.textInput}
                                    onChangeText={(name) => this.setState({ name })}
                                />
                            </View>

                            <DateAndTimePicker
                                mode={"date"}
                                label={this.state.category == 1 ? "SMS Date" : "Call Date"}
                                value={this.state.date}
                                onChange={this.onDateChange}
                            />

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

                            {this.state.category == 1 &&
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLable}>Select Template:</Text>
                                    <Dropdown
                                        placeholder="Select SMS Template"
                                        value={this.state.template_name}
                                        items={this.state.smsTemplates}
                                        onChange={this.setSMSTemplate}
                                        style={styles.textInput}
                                    />
                                </View>
                            }

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}>Comments:</Text>
                                <TextInput
                                    value={this.state.comments}
                                    autoCompleteType="off"
                                    autoCapitalize="words"
                                    style={styles.textInput}
                                    multiline={true}
                                    onChangeText={(comments) => this.setState({ comments })}
                                />
                            </View>


                            {this.state.category == 0 &&
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLable}>Attach Proof:</Text>
                                    <TouchableOpacity onPress={this.browseFile}>
                                        <TextInput
                                            editable={false}
                                            value={this.state.fileName}
                                            style={styles.textInput}
                                            placeholder="Browse File"
                                        />
                                    </TouchableOpacity>
                                </View>
                            }

                            <TouchableOpacity
                                style={styles.submitBtn}
                                onPress={this.ControlRecordSubmit}
                            >
                                <Text style={{ fontSize: 18, color: Colors.white }}>
                                    {this.state.id ? "Update" : "Send"}
                                </Text>
                            </TouchableOpacity>

                        </KeyboardAwareScrollView>
                    </View>
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
        </>
    );
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        flex: 1,
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
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
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
});
