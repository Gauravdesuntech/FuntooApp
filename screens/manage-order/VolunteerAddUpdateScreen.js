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
    Linking
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header } from "../../components";
import ProgressiveImage from "../../components/ProgressiveImage";
import { DateAndTimePicker, Dropdown } from "../../components";
import AwesomeAlert from 'react-native-awesome-alerts';
import { AddVolunteer, UpdateVolunteer, GetTotalVolunteerRequiredForEvent } from "../../services/VolunteerApiService";
import AppContext from "../../context/AppContext";
import { getFormattedDate } from "../../utils/Util";
import { GetOrder } from "../../services/OrderService";
import * as SMS from 'expo-sms';
import OverlayLoader from "../../components/OverlayLoader";

import { VenderList } from "../../services/VenderApiService";
import moment from "moment";

export default class VolunteerAddUpdateScreen extends React.Component {

    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.route.params?.data,
            orderData: this.props.route.params.orderData,
            orderDetails: null,
            venders: [],
            isModalOpen: false,
            refreshing: false,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            totalVolunteerRequired: null,
            isLoading: false,

            id: "",
            vender_id: "",
            event_id: "",
            vender_name: "",
            booking_done_by: "",
            booking_date: "",
            booking_time: '',
            reporting_time: null,
            number_of_staff: "",
            number_of_hours: "",
            rate_per_hour: "",
            amount: "",
            mobile: "",
            reporting_date: "",
            closing_time: ""
        };
    }

    componentDidMount = () => {

        this.setState({isLoading: true});

        Promise.all([ VenderList(), GetOrder({id: 8}) ])
        .then( (result) => {


            this.setState({
                venders: result[0].data,
                orderDetails: result[1].data,

                vender_id: data.vender_id,
                event_id: data.event_id,
                vender_name: data.vender_name,
                booking_done_by: data.booking_done_by ?? this.context.userData?.name,
                booking_date: data.booking_date ?? moment().format('YYYY-MM-DD'),
                booking_time: data.booking_time ?? this.currentTime(),
                number_of_staff: data.number_of_staff,
                number_of_hours: data.number_of_hours,
                rate_per_hour: data.rate_per_hour,
                amount: data.amount,
                mobile: data.mobile,
                reporting_date: reporting_date,
                reporting_time: data.reporting_time ?? this.timeAddSubtract(data.event_start_time, 90, "-"),
                closing_time: data.closing_time ?? this.timeAddSubtract(data.setup_end_time, 60, "+")
            });
        } )
        .catch( err => console.log(err) )
        .finally( () => {
            this.setState({
                isLoading: false
            });
        });

        let data = this.state.data;
        
        let event_date = new Date();
        if (data.event_date) {
            event_date = new Date(data.event_date);
        }
       
        let reporting_date = null;
        if (data.reporting_date) {
            reporting_date = new Date(data.reporting_date);
        } else {
            reporting_date = event_date;
        }
        
        this.setState({
            id: data.id,
            vender_id: data.vender_id,
            event_id: data.event_id,
            vender_name: data.vender_name,
            booking_done_by: data.booking_done_by ?? this.context.userData?.name,
            booking_date: data.booking_date ?? moment().format('YYYY-MM-DD'),
            booking_time: data.booking_time ?? this.currentTime(),
            number_of_staff: data.number_of_staff,
            number_of_hours: data.number_of_hours,
            rate_per_hour: data.rate_per_hour,
            amount: data.amount,
            mobile: data.mobile,
            reporting_date: reporting_date,
            reporting_time: data.reporting_time ?? this.timeAddSubtract(data.event_start_time, 90, "-"),
            closing_time: data.closing_time ?? this.timeAddSubtract(data.setup_end_time, 60, "+"),
        },()=>this.UpdateHumberOfHours());

    
        this.Bind();

        GetTotalVolunteerRequiredForEvent(this.state.data.event_id).then( (result) => {
            this.setState({
                totalVolunteerRequired: result.data.total_volunteers,
                number_of_staff: result.data.total_volunteers
            })
        });
    }

    currentTime = () => {
        return moment(new Date()).format("HH:mm");
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

    getDiffHour = (from, to) => {

        if(!from || !to){
            return null;
        }

        let stringDate = moment(new Date()).format("YYYY-MM-DD");
        let formDate = new Date(stringDate + "T" + from);
        let toDate = new Date(stringDate + "T" + to);
        var diff = formDate.getTime() - toDate.getTime();
        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        if(mm>30){
            hh=hh+1;
        }

        return hh;
    }

    UpdateHumberOfHours=()=>{
        let hours = this.getDiffHour(this.state.closing_time,this.state.reporting_time);
        hours = Math.abs(hours);
        this.setState({number_of_hours:hours.toString()});
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


    VendorMessage = () => {
        let message = `Hi, ${this.state.vender_name} you have an booking on ${getFormattedDate(state.booking_date)}
         from  ${this.context.userData?.name}. Booking is made for  ${this.state.number_of_staff}`;
        return message;
    }

    AdminMessage = () => {
        let message = `Hi, ${this.context.userData?.name} you have booked  ${this.state.number_of_staff} from ${this.state.data.event_name} for {event name}`;
        return message;
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

    onChangeReportingDate = (value) =>
        this.setState({ reporting_date: value });

    onReportingTimeChange = (selectedTime) =>{
        this.setState({ reporting_time: selectedTime },()=>this.UpdateHumberOfHours());
    };

    onClosingTimeChange = (value) =>{
        this.setState({ closing_time: value },()=>this.UpdateHumberOfHours());
    };

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
            vender_name: state.vender_name,
            booking_done_by: state.booking_done_by,
            booking_date: getFormattedDate(state.booking_date),
            booking_time: state.booking_time,
            reporting_time: state.reporting_time,
            number_of_staff: state.number_of_staff,
            number_of_hours: state.number_of_hours,
            rate_per_hour: state.rate_per_hour,
            amount: state.amount,
            mobile: state.mobile,
            reporting_date: getFormattedDate(state.reporting_date),
            closing_time: state.closing_time,
        }
        return model;
    }

    AddVolunteer() {
        let model = this.GetModel();
       
        //this.SendSms(this.state.mobile, "hello");
        this.setState({
            isLoading: true
        });

        AddVolunteer(model).then(res => {
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

    UpdateVolunteer() {
        let model = this.GetModel();
        this.setState({
            isLoading: true
        });

        UpdateVolunteer(model).then(res => {
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

    ControlSubmit = () => {
        if (this.state.id) {
            this.UpdateVolunteer();
            return;
        }
        this.AddVolunteer();
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
            this.UpdateVolunteer();
            return;
        }
        this.AddVolunteer();
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


    gotoBack = () => this.props.navigation.goBack();

    UpdateAmount = () => {
        let number_of_hours = Number(this.state.number_of_hours);
        let rate_per_hour = Number(this.state.rate_per_hour);
        let number_of_staff = Number(this.state.number_of_staff);
        let total = number_of_hours * rate_per_hour * number_of_staff;
        this.setState({ amount: total.toString() });
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
                <View style={styles.container}>
                    <Header title={this.state.id ? "Update Volunteer" : "Add Volunteer"} />

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
            </>
        )
    }

}



const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({

    cardBody: {
        marginTop: 10, 
        marginBottom: 10
    },
    cardHeader: {
        fontSize: 25, 
        marginBottom: 15 
    },

    container: {
        flex: 1, 
        backgroundColor: '#c7c7c745',
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
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
        
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