import React from "react";
import {
    View,
    StyleSheet,
    Text,
    labelBox,
    TouchableOpacity,
    ScrollView,
    Modal,
    Dimensions,
    Alert,
    FlatList,
    RefreshControl,
    Linking,
    Platform
} from "react-native";
import {
    FontAwesome,
    Ionicons,
    MaterialIcons,
    Feather,
} from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as DocumentPicker from "expo-document-picker";
import * as mime from "react-native-mime-types";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../config/colors";
import AwesomeAlert from 'react-native-awesome-alerts';
import { getFileData } from "../../utils/Util";
import { RecordList, DeleteRecord } from "../../services/EventCallSmsRecordApiService";
import { DateAndTimePicker, Dropdown } from "../../components";
import { getFormattedDate } from "../../utils/Util";
import { TemplateList } from "../../services/TemplateApiService";
import AppContext from "../../context/AppContext";
import * as FileSystem from 'expo-file-system';

//import {SMS} from "expo";
import * as SMS from 'expo-sms';
import Configs from "../../config/Configs";
import moment from "moment";
import OverlayLoader from "../../components/OverlayLoader";
import Loader from "../../components/Loader";

export default class CallRecord extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            data: this.props?.props.route?.params?.data,
            event_id: this.props?.props.route?.params?.data?.id,
            tab_name: 'call',

            isLoading: true,
            list: [],
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }

    componentDidMount = () => {
        this.focusListner = this.props.props?.navigation?.addListener("focus", () => {
            this.Bind();
        });
        this.Bind();
    };
    componentWillUnmount() {
        this.focusListner();
    }

    Bind() {
        this.RecordList();
    }

    onRefresh = () => {
        this.setState({ refreshing: true }, () => { this.Bind() })
    }

    RecordList() {

        RecordList(this.state.event_id, 0).then(res => {
            this.setState({
                isLoading: false,
                refreshing: false,
            });
            if (res.is_success) {
                this.setState({
                    list: res.data,
                });
            }

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }


    DeleteRecord = (id) => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        DeleteRecord({ id: id }).then(res => {
                            if (res.is_success) {
                                this.setState({
                                    showAlertModal: true,
                                    alertType: "Success",
                                    alertMessage: res.message
                                });
                                this.RecordList();
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

    renderDate = (date) => {
        let ab = "th";
        let day = moment(date, "YYYY-MM-DD").format("D");
        if (day == 1) {
            ab = "st";
        }
        if (day == 2) {
            ad = "nd";
        }
        let month = moment(date, "YYYY-MM-DD").format("MMM");
        let year = moment(date, "YYYY-MM-DD").format("YY");
        let day_name = moment(date, "YYYY-MM-DD").format("dddd");
        return `${day}${ab} - ${month} - ${year} (${day_name})`;
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

    goToRocord = (item) => {
        this.props.props.navigation.navigate("CallSmsRecordAddUpdate", { data: item });
    }

    addRecord = (mobile, name) => {
        let data = { mobile: mobile, name: name, event_id: this.state.event_id };
        data.category = 0;
        this.props.props.navigation.navigate("CallSmsRecordAddUpdate", { data: data });
    }

    listItem = ({ item }) => (
        <TouchableOpacity key={item.id}
            onLongPress={this.DeleteRecord.bind(this, item.id)}
            onPress={() => this.goToRocord(item)}
            style={styles.listRow}

        >
            <View style={styles.leftPart}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.title}>{item.name} - {item.mobile}</Text>
                </View>
                <Text style={styles.subText}>
                    Date :  {this.renderDate(item.date)}
                </Text>
                <Text style={styles.subText}>
                    Time : {this.renderTime(item.time)}
                </Text>
                <Text style={styles.subText}>
                    {"Called By: " + item.record_by}
                </Text>
                <Text style={styles.subText}>Comments :</Text>
                <Text style={styles.subText}>{item.comments}</Text>
            </View>
            <View style={[styles.rightPart, { alignItems: 'flex-end' }]}>
                <MaterialIcons
                    name="preview"
                    color={Colors.primary}
                    size={24}
                    onPress={() => this.props.props.navigation.navigate("Preview", { url: Configs.UPLOAD_PATH + item.attachment })}
                />

            </View>
        </TouchableOpacity>
    );


    render = () => (
        <View style={styles.container}>
            {this.state.isLoading ?
                <Loader /> :
                <View>
                    <View style={styles.headerRow}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.labelBox}>
                                {this.state.data?.customer_name} - {this.state.data?.customer_mobile}
                            </Text>
                            <TouchableOpacity style={styles.iconAbsolute}>
                                {this.state.tab_name === "call" ? (
                                    <Feather name="phone-call" color={Colors.primary} size={20}
                                        onPress={() => this.addRecord(this.state.data?.customer_mobile, this.state.data?.customer_name)} />
                                ) : (
                                    <MaterialIcons
                                        name="message"
                                        color={Colors.primary}
                                        size={24}
                                        onPress={() => this.addRecord(this.state.data?.customer_mobile, this.state.data?.customer_name)}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>

                        {this.state.data?.alt_mobile &&
                            <View style={styles.inputContainer}>
                                <Text style={styles.labelBox}>
                                    {this.state.data?.alt_name} - {this.state.data?.alt_mobile}
                                </Text>
                                <TouchableOpacity style={styles.iconAbsolute}>
                                    {this.state.tab_name === "call" ? (
                                        <Feather name="phone-call" color={Colors.primary} size={20}
                                            onPress={() => this.addRecord(this.state.data?.alt_mobile, this.state.data?.alt_name)} />
                                    ) : (
                                        <MaterialIcons
                                            name="message"
                                            color={Colors.primary}
                                            size={24}
                                            onPress={() => this.addRecord(this.state.data?.alt_mobile, this.state.data?.alt_name)}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>}
                    </View>

                    <Text style={{
                        marginLeft: 10,
                        fontSize: 16,
                        fontWeight: 'bold',
                        fontFamily: 'serif',
                        color: Colors.grey,
                        margin: 10
                    }}>History :-</Text>
                    <FlatList
                        data={this.state.list}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.listItem}
                        initialNumToRender={this.state.list?.length}
                        contentContainerStyle={styles.lsitContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={this.onRefresh}
                            />
                        }
                    />
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
        </View>
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
        margin:5,
        backgroundColor: Colors.white,
    },


    listRow: {
        flexDirection: "row",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		elevation: 10,
		marginBottom: 10,
        margin: 5,
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
    labelBox: {
        //padding: 9,
        fontSize: 14,
        // width: "100%",
        //borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        // backgroundColor: Colors.labelBoxBg,
    },

    iconAbsolute: {
        position: "absolute",
        padding: 8,
        right: 0,
    },


    headerRow: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        padding: 5,
        //flexDirection: "row",
        borderColor: "#eee",
        borderWidth: 1,
        // padding: 20,
        // margin: 10,
    },
});
