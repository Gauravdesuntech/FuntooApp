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
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header } from "../../components";
import ProgressiveImage from "../../components/ProgressiveImage";
import { DateAndTimePicker, Dropdown } from "../../components";
import AwesomeAlert from 'react-native-awesome-alerts';
import { AddVehicle, UpdateVehicle } from "../../services/VehicleApiService";
import AppContext from "../../context/AppContext";
import { getFormattedDate } from "../../utils/Util";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';


import * as SMS from 'expo-sms';
import OverlayLoader from "../../components/OverlayLoader";

import { VenderList } from "../../services/VenderApiService";
import moment from "moment";

export default class VehicleAddUpdateScreen extends React.Component {

    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.route.params?.data,
            id: "",
            vender_id: "",
            event_id: "",
            vender_name: "",
            type: "",
            booking_done_by: "",
            booking_date: null,
            booking_time: null,
            reporting_time: null,
            vehicle_arrival_time: "",
            vehicle_arived_time: "",
            load_end_time: "",
            journey_start_time: "",
            venue_reach_time: "",
            journey_time: "",
            from_address: "",
            to_address: "",
            start_km: "",
            end_km: "",
            total_km: "",
            isModalOpen: false,
            isVenderModalOpen: false,
            mobile: "",
            vehicle_arrival_date: "",
            amount: "",

            schedule_date: "",
            schedule_time: "",


            venders: [],
            isModalOpen: false,
            refreshing: false,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };

    }

    currentTime = () => {
        let time = moment(new Date()).format("HH:mm");
        return time;
    }


    timeAddSubtract = (time, minutes, type) => {
        if (!time || !minutes || !type) {
            return null;
        }
        let stringDate = moment(new Date()).format("YYYY-MM-DD") + "T" + time;
        let date = new Date(stringDate);
        let res = null;
        switch (type) {
            case '+':
                let addTime = moment(date).add(minutes, 'minutes').toDate();
                res = `${addTime.getUTCHours()}:${addTime.getUTCMinutes()}`;
                break;
            case '-':
                let subTime = moment(date).subtract(minutes, 'minutes').toDate();
                res = `${subTime.getUTCHours()}:${subTime.getUTCMinutes()}`;
                break;
        }
        return res;
    }

    componentDidMount = () => {
        let data = this.state.data;
        let booking_date = new Date();
        let vehicle_arrival_date = new Date();
        let schedule_date = null;
        if (data.booking_date) {
            booking_date = new Date(data.booking_date);
        }

        if (data.vehicle_arrival_date) {
            vehicle_arrival_date = new Date(data.vehicle_arrival_date);
        } else {
            vehicle_arrival_date = new Date(data.setup_date);
        }

        if (data.schedule_date) {
            schedule_date = new Date(data.schedule_date);
        }else
        {
            schedule_date = new Date(data.setup_date);
        }

        this.setState({
            id: data.id,
            vender_id: data.vender_id,
            event_id: data.event_id,
            vender_name: data.vender_name,
            type: data.type,
            booking_done_by: data.booking_done_by ?? this.context.userData?.name,
            booking_date: booking_date,
            booking_time: data.booking_time ?? this.currentTime(),
            vehicle_arrival_time: data.vehicle_arrival_time ?? this.timeAddSubtract(data.setup_start_time, 300, "-"),
            vehicle_arived_time: data.vehicle_arived_time,
            load_end_time: data.load_end_time,
            journey_start_time: data.journey_start_time,
            venue_reach_time: data.venue_reach_time,
            journey_time: data.journey_time,
            from_address: data.from_address,
            to_address: data.to_address,
            start_km: data.start_km,
            end_km: data.end_km,
            total_km: data.total_km,
            mobile: data.mobile,
            vehicle_arrival_date: vehicle_arrival_date,
            amount: data.amount,
            schedule_date: schedule_date,
            schedule_time: data.schedule_time??this.timeAddSubtract(data.setup_start_time, 300, "-"),
        }, () => this.Bind());

    }


    Bind() {
        this.VenderList();
    }


    VenderList() {

        VenderList().then(res => {
            this.setState({
                isLoading: false,
                venders: res.data,
                refreshing: false,
            });

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }


    SendSms = async (mobile, msg) => {
        const result = await SMS.sendSMSAsync(
            [this.context.userData?.phone, mobile],
            msg
        );
    }


    onBookingDateChange = (selectedDate) =>
        this.setState({ booking_date: selectedDate });

    onBookingTimeChange = (selectedTime) =>
        this.setState({ booking_time: selectedTime });

    onArrivalTimeChange = (selectedTime) =>
        this.setState({ vehicle_arrival_time: selectedTime });

    onArrivedTimeChange = (selectedTime) =>
        this.setState({ vehicle_arived_time: selectedTime });

    onLoadTimeChange = (selectedTime) =>
        this.setState({ load_end_time: selectedTime });

    onJourneyStartTimeChange = (selectedTime) =>
        this.setState({ journey_start_time: selectedTime });

    onVenueReachTimeChange = (selectedTime) =>
        this.setState({ venue_reach_time: selectedTime });

    onVehicleArrivalDateChange = (value) =>
        this.setState({ vehicle_arrival_date: value });

    onScheduleDateChange = (value) =>
        this.setState({ schedule_date: value });

    onScheduleTime = (value) =>
        this.setState({ schedule_time: value });

    SetVenderId = (v) => {
        this.setState({
            vender_id: v.id,
            vender_name: v.name,
            mobile: v.mobile
        });
    };

    GetModel() {
        let state = this.state;
        let model = {
            id: state.id,
            event_id: state.event_id,
            vender_id: state.vender_id,
            type: state.type,
            booking_done_by: state.booking_done_by,
            booking_date: getFormattedDate(state.booking_date),
            booking_time: state.booking_time,
            vehicle_arrival_time: state.vehicle_arrival_time,
            vehicle_arived_time: state.vehicle_arived_time,
            load_end_time: state.load_end_time,
            journey_start_time: state.journey_start_time,
            venue_reach_time: state.venue_reach_time,
            journey_time: state.journey_time,
            from_address: state.from_address,
            to_address: state.to_address,
            start_km: state.start_km,
            end_km: state.end_km,
            total_km: state.total_km,
            mobile: state.mobile,
            vehicle_arrival_date: getFormattedDate(state.vehicle_arrival_date),
            schedule_date: getFormattedDate(state.schedule_date),
            schedule_time: state.schedule_time,
            amount: state.amount,
        }
        return model;
    }


    AddVehicle() {
        let model = this.GetModel();
        //this.SendSms(this.state.mobile, "hello");
        this.setState({
            isLoading: true
        });

        AddVehicle(model).then(res => {
            this.setState({
                isLoading: false
            });
            if (res.is_success) {
                this.gotoBack();
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message
                })
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

    UpdateVehicle() {
        let model = this.GetModel();
        this.setState({
            isLoading: true
        });

        UpdateVehicle(model).then(res => {
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
        })
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

    ControlSubmit = () => {
        if (this.state.id) {
            this.UpdateVehicle();
            return;
        }
        this.AddVehicle();
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

    gotoBack = () => this.props.navigation.goBack();

    UpdateTotalKm = () => {
        let start_km = Number(this.state.start_km);
        let end_km = Number(this.state.end_km);
        let total = end_km - start_km;
        this.setState({ total_km: total.toString() });
    }


    setMobile = (number) => {
        if (number?.length <= 10) {
            this.setState({ mobile: number });
        }
    }


    render() {
        return (
            <>
                {this.state.isLoading &&
                    <OverlayLoader />}
                <SafeAreaView style={styles.container}>
                    <Header title={this.state.id ? "Update Vehicle" : "Add Vehicle"} />
                        <View style={styles.form}>
                            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

                                <Text style={styles.boxHead}>
                                    Vendor Details :-
                                </Text>

                                <View style={styles.box}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>Vendor:</Text>
                                        <Dropdown
                                            placeholder="Select Vender"
                                            value={this.state.vender_name}
                                            items={this.state.venders}
                                            onChange={this.SetVenderId}
                                            style={styles.textInput}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>Contact Number:</Text>
                                        <TextInput
                                            value={this.state.mobile}
                                            autoCompleteType="off"
                                            keyboardType="number-pad"
                                            autoCapitalize="words"
                                            style={styles.textInput}
                                            onChangeText={(mobile) =>
                                                this.setMobile(mobile)
                                            }

                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>Type:</Text>
                                        <TextInput
                                            value={this.state.type}
                                            autoCompleteType="off"
                                            autoCapitalize="words"
                                            style={styles.textInput}
                                            onChangeText={(type) =>
                                                this.setState({ type })
                                            }
                                        />
                                    </View>
                                </View>


                                <Text style={styles.boxHead}>
                                    Schedule Details :-
                                </Text>
                                <View style={styles.box}>

                                    <DateAndTimePicker
                                        mode={"date"}
                                        label={"Schedule Date:"}
                                        value={this.state.schedule_date}
                                        onChange={this.onScheduleDateChange}
                                    />

                                    <DateAndTimePicker
                                        mode={"time"}
                                        label={"Schedule Time:"}
                                        value={this.state.schedule_time}
                                        onChange={this.onScheduleTime}
                                    />

                                </View>

                                <Text style={styles.boxHead}>
                                    Arrival Details :-
                                </Text>

                                <View style={styles.box}>
                                    <DateAndTimePicker
                                        mode={"date"}
                                        label={"Vehicle Arrival Date:"}
                                        value={this.state.vehicle_arrival_date}
                                        onChange={this.onVehicleArrivalDateChange}
                                    />

                                    <DateAndTimePicker
                                        mode={"time"}
                                        label={"Vehicle Arrival Time:"}
                                        value={this.state.vehicle_arrival_time}
                                        onChange={this.onArrivalTimeChange}
                                    />

                                    {/* <DateAndTimePicker
                                        mode={"time"}
                                        label={"Vehicle Arrived Time:"}
                                        value={this.state.vehicle_arived_time}
                                        onChange={this.onArrivedTimeChange}
                                    /> */}

                                    <DateAndTimePicker
                                        mode={"time"}
                                        label={"Load End Time:"}
                                        value={this.state.load_end_time}
                                        onChange={this.onLoadTimeChange}
                                    />
                                </View>


                                <Text style={styles.boxHead}>
                                    Journey  Details :-
                                </Text>

                                <View style={styles.box}>
                                    <DateAndTimePicker
                                        mode={"time"}
                                        label={"Journey Start Time:"}
                                        value={this.state.journey_start_time}
                                        onChange={this.onJourneyStartTimeChange}
                                    />

                                    <DateAndTimePicker
                                        mode={"time"}
                                        label={"Venue Reach Time:"}
                                        value={this.state.venue_reach_time}
                                        onChange={this.onVenueReachTimeChange}
                                    />

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>Journy Time:</Text>
                                        <TextInput
                                            value={this.state.journey_time}
                                            autoCompleteType="off"
                                            keyboardType="number-pad"
                                            style={styles.textInput}
                                            onChangeText={(journey_time) =>
                                                this.setState({ journey_time })
                                            }
                                        />
                                    </View>
                                </View>

                                <Text style={styles.boxHead}>
                                    Billing    Details :-
                                </Text>
                                <View style={styles.box}>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>From Address:</Text>
                                        <TextInput
                                            value={this.state.from_address}
                                            autoCompleteType="off"
                                            autoCapitalize="words"
                                            style={styles.textInput}
                                            onChangeText={(from_address) =>
                                                this.setState({ from_address })
                                            }
                                        />
                                    </View>


                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>To Address</Text>
                                        <TextInput
                                            value={this.state.to_address}
                                            autoCompleteType="off"
                                            autoCapitalize="words"
                                            style={styles.textInput}
                                            onChangeText={(to_address) =>
                                                this.setState({ to_address })
                                            }
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>Start KM:</Text>
                                        <TextInput
                                            value={this.state.start_km}
                                            autoCompleteType="off"
                                            keyboardType="number-pad"
                                            style={styles.textInput}
                                            onChangeText={(start_km) => this.setState({ start_km })}
                                            onBlur={this.UpdateTotalKm}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>End KM:</Text>
                                        <TextInput
                                            value={this.state.end_km}
                                            autoCompleteType="off"
                                            keyboardType="numeric"
                                            style={styles.textInput}
                                            onChangeText={(end_km) => this.setState({ end_km })}
                                            onBlur={this.UpdateTotalKm}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>Total KMS:</Text>
                                        <TextInput
                                            value={this.state.total_km}
                                            autoCompleteType="off"
                                            keyboardType="numeric"
                                            style={styles.textInput}
                                            editable={false}
                                            onChangeText={(total_km) => this.setState({ total_km })}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>Amount:</Text>
                                        <TextInput
                                            value={this.state.amount}
                                            autoCompleteType="off"
                                            keyboardType="number-pad"
                                            autoCapitalize="words"
                                            style={styles.textInput}
                                            onChangeText={(amount) =>
                                                this.setState({ amount })
                                            }

                                        />
                                    </View>

                                </View>

                                <Text style={styles.boxHead}>
                                    Booking Details :-
                                </Text>

                                <View style={styles.box}>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>Booking Done By:</Text>
                                        <TextInput
                                            value={this.state.booking_done_by}
                                            autoCompleteType="off"
                                            autoCapitalize="words"
                                            style={styles.textInput}
                                            onChangeText={(booking_done_by) =>
                                                this.setState({ booking_done_by })
                                            }
                                        />
                                    </View>

                                    <DateAndTimePicker
                                        mode={"date"}
                                        label={"Booking Date:"}
                                        value={this.state.booking_date}
                                        onChange={this.onBookingDateChange}
                                    />

                                    <DateAndTimePicker
                                        mode={"time"}
                                        label={"Booking Time:"}
                                        value={this.state.booking_time}
                                        onChange={this.onBookingTimeChange}
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
                </SafeAreaView>
            </>
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

    box: {
        borderColor: "#eee",
        borderWidth: 1,
        padding: 10,
        margin: 2,
    },

    boxHead: {
        fontFamily: 'serif',
        fontSize: 16,
        margin: 5,
        color: Colors.grey,
        fontWeight: 'bold'
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
        //backgroundColor: Colors.textInputBg,
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