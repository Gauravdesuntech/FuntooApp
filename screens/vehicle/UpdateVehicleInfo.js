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
import { DateAndTimePicker } from "../../components";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import AwesomeAlert from 'react-native-awesome-alerts';
import AppContext from "../../context/AppContext";
import { getFormattedDate } from "../../utils/Util";

import { GetSingleVehicleInfo, UpdateVehicleInfo as UpdateVehicleInfoApiService } from "../../services/VehicleInfoApiService";

import * as SMS from 'expo-sms';
import OverlayLoader from "../../components/OverlayLoader";

import { VenderList } from "../../services/VenderApiService";
import moment from "moment";
import * as Location from 'expo-location';

export default class UpdateVehicleInfo extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            event_id: this.props.route.params?.event_id,
            isPaymentTypeFixed: true,

            id: this.props.route.params?.id,
            vehicle_payment_info_id: null,
            vehicles_info_id: null,
            vender_name: '',
            vender_id: null,
            venders: [],
            phone: '',
            type: '',
            journey_type: '',
            schedule_date: '',
            schedule_time: '',
            booking_done_by: '',
            booking_date: '',
            booking_time: '',
            from_address: '',
            to_address: '',
            amount: '',
            payment_type: '',
            km_rate: null,
            waiting_type: null,
            waiting_charge: null,
            other_charge: null,
            toll_charge: null,
            lat:'',
            long:'',
            location:null
        }
    }

    componentDidMount() {
        this.Bind();
        this.getLocation()
    }

    getLocation = async () => {
      
        let{ status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        let data = {
            'lat':location.coords.latitude,
            'long':location.coords.longitude
        }
        console.log('//...........location..........',data);
        this.setState({
            lat:location.coords.latitude,
            long:location.coords.longitude,
            location:data
        })
    }

    Bind() {
       this.setDropDownVendorList();
       this.getCurrentData();
    }

    getCurrentData() {
        this.setState({isLoading: true})
        GetSingleVehicleInfo(this.state.id).then( (response) => {
            this.setState({isLoading: false});
            
            let data = response.data;
            let currentData = {
                id: data.id,
                vehicle_payment_info_id: data.vehicle_payment_info_id,
                vehicles_info_id: data.vehicles_info_id,
                vender_name: data.vendor_name,
                vender_id: data.vender_id,
                phone: data.phone,
                type: data.type,
                journey_type: data.journey_type,
                schedule_date: new Date(data.schedule_date),
                schedule_time: data.schedule_time,
                booking_done_by: data.booking_done_by,
                booking_date: new Date(data.booking_date),
                booking_time: data.booking_time,
                from_address: data.from_address,
                to_address: data.to_address,
                amount: data.amount,
                km_rate: ( data.km_rate == '0.00' || data.km_rate == null ) ? null : data.km_rate,
                waiting_type: ( data.waiting_type == '0.00' || data.waiting_type == null ) ? null : data.waiting_type,
                waiting_charge: ( data.waiting_charge == '0.00' || data.waiting_charge == null ) ? null : data.waiting_charge,
                other_charge: ( data.other_charge == '0.00' || data.other_charge == null ) ? null : data.other_charge,
                toll_charge: ( data.toll_charge == '0.00' || data.toll_charge == null ) ? null : data.toll_charge
            };
            this.setState(currentData);
            this.togglePaymentTypeOption(data.payment_type);
        })
    }

    setDropDownVendorList() {
        VenderList().then(res => {
            this.setState({
                venders: res.data
            });

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        });
    }

    togglePaymentTypeOption = (type) => {
        if(type == 'Fixed') {
            this.setState({
                payment_type: type,
                isPaymentTypeFixed: true
            });
        } else {
            this.setState({
                payment_type: type,
                isPaymentTypeFixed: false
            });
        }
    }

    Edit = () => {
        this.setState({
            isLoading: true
        });

        const data = {
            id: this.state.id,
            vehicle_payment_info_id: this.state.vehicle_payment_info_id,
            vender_id: this.state.vender_id,
            event_id: this.state.event_id,
            type: this.state.type,
            phone: this.state.phone,
            journey_type: this.state.journey_type,
            schedule_date: getFormattedDate(this.state.schedule_date),
            schedule_time: this.state.schedule_time,
            from_address: this.state.from_address,
            to_address: this.state.to_address,
            booking_done_by: this.state.booking_done_by,
            booking_date: getFormattedDate(this.state.booking_date),
            booking_time: this.state.booking_time,
            payment_type: this.state.payment_type,
            amount: this.state.amount,
            km_rate: (this.state.payment_type == 'Fixed') ? null : this.state.km_rate,
            waiting_type: (this.state.payment_type == 'Fixed') ? null : this.state.waiting_type,
            waiting_charge: (this.state.payment_type == 'Fixed') ? null : this.state.waiting_charge,
            other_charge: (this.state.payment_type == 'Fixed') ? null : this.state.other_charge,
            toll_charge: (this.state.payment_type == 'Fixed') ? null : this.state.toll_charge,
        }

        UpdateVehicleInfoApiService(data).then( (response) => {
            this.setState({
                isLoading: false
            });

            if(response.is_success) {
                this.props.navigation.goBack();
            }
        });
    }


    render() {
        return (
            <SafeAreaView>
                { this.state.isLoading && <OverlayLoader /> }
                <View style={styles.container}>
                    <Header title={"Update Vehicle"} />
                        <View style={styles.form}>
                            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

                                <Text style={styles.boxHead}>
                                    Vendor Details :-
                                </Text>

                                <View style={styles.box}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>Vendor:</Text>
                                        <Dropdown
                                            value={this.state.vender_name}
                                            data={this.state.venders}
                                            onChange={ (vendorData) => { this.setState({vender_id: vendorData.id, vender_name: vendorData.name, phone: vendorData.mobile}) } }
                                            style={styles.textInput}
                                            inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
                                            search
                                            labelField="name"
                                            valueField="name"
                                            placeholder={!this.state.vender_name ? 'Select Vender Name' : '...'}
                                            searchPlaceholder="Search..."
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>Contact Number:</Text>
                                        <TextInput
                                            value={this.state.phone}
                                            autoCompleteType="off"
                                            keyboardType="number-pad"
                                            autoCapitalize="words"
                                            style={styles.textInput}
                                            onChangeText={(phone) => { this.setState({ phone: phone}) }}

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
                                                this.setState({ type: type })
                                            }
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>Journey type:</Text>
                                        <Dropdown
                                            value={this.state.journey_type}
                                            data={[ {id: 'Onward', name: 'Onward'}, {id: 'Return', name: 'Return'}, {id: 'Both', name: 'Both'} ]}
                                            onChange={ ( data ) => { this.setState({journey_type: data.id  }) } }
                                            style={styles.textInput}
                                            inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
                                            search
                                            labelField="name"
                                            valueField="name"
                                            placeholder={!this.state.journey_type ? 'Select Journey Type' : '...'}
                                            searchPlaceholder="Search..."
                                        />
                                    </View>


                                </View>



                                <Text style={styles.boxHead}>
                                    Schedule Details :-
                                </Text>
                                <View style={styles.box}>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>From Address:</Text>
                                        <TextInput
                                            value={this.state.from_address}
                                            autoCompleteType="off"
                                            autoCapitalize="words"
                                            style={styles.textInput}
                                            onChangeText={(address) => this.setState({ from_address: address })}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>To Address:</Text>
                                        <TextInput
                                            value={this.state.to_address}
                                            autoCompleteType="off"
                                            autoCapitalize="words"
                                            style={styles.textInput}
                                            onChangeText={(address) => this.setState({ to_address: address })}
                                        />
                                    </View>

                                    <DateAndTimePicker
                                        mode={"date"}
                                        label={"Schedule Date:"}
                                        value={this.state.schedule_date}
                                        onChange={ ( date ) => { this.setState({schedule_date: date}) } }
                                    />

                                    <DateAndTimePicker
                                        mode={"time"}
                                        label={"Schedule Time:"}
                                        value={this.state.schedule_time}
                                        onChange={ (time) => { this.setState({schedule_time: time}) } }
                                    />

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
                                        onChange={(date) => { this.setState({ booking_date: date }) }}
                                    />

                                    <DateAndTimePicker
                                        mode={"time"}
                                        label={"Booking Time:"}
                                        value={this.state.booking_time}
                                        onChange={ (time) => { this.setState({booking_time: time}) } }
                                    />

                                </View>

                                <Text style={styles.boxHead}>
                                Payment Details :-
                                </Text>

                                <View style={styles.box}>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>Payment type:</Text>
                                        <Dropdown
                                            value={this.state.payment_type}
                                            data={[ {id: 'Fixed', name: 'Fixed'}, {id: 'Variable', name: 'Variable'} ]}
                                            onChange={ ( type ) => { this.togglePaymentTypeOption(type.id) } }
                                            style={styles.textInput}
                                            inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
                                            search
                                            labelField="name"
                                            valueField="name"
                                            placeholder={!this.state.payment_type ? 'Select Payment Type' : '...'}
                                            searchPlaceholder="Search..."
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLable}>Amount:</Text>
                                        <TextInput
                                            value={this.state.amount}
                                            keyboardType='numeric'
                                            style={styles.textInput}
                                            onChangeText={(amount) =>
                                                this.setState({ amount: amount })
                                            }
                                        />
                                    </View>

                                    {
                                        this.state.isPaymentTypeFixed == false ? (
                                               <>
                                                    <View style={styles.inputContainer}>
                                                        <Text style={styles.inputLable}>KM Rate:</Text>
                                                        <TextInput
                                                            value={this.state.km_rate}
                                                            autoCompleteType="off"
                                                            autoCapitalize="words"
                                                            keyboardType='numeric'
                                                            style={styles.textInput}
                                                            onChangeText={(km_rate) =>
                                                                this.setState({ km_rate: km_rate })
                                                            }
                                                        />
                                                    </View>

                                                    <View style={styles.inputContainer}>
                                                        <Text style={styles.inputLable}>Waiting type:</Text>
                                                        <Dropdown
                                                            value={this.state.waiting_type}
                                                            data={[ {id: 'Hourly', name: 'Hourly'}, {id: 'Fixed', name: 'Fixed'} ]}
                                                            onChange={ ( waiting_type ) => { this.setState({waiting_type: waiting_type.id}) } }
                                                            style={styles.textInput}
                                                            inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
                                                            search
                                                            labelField="name"
                                                            valueField="name"
                                                            placeholder={!this.state.waiting_type ? 'Select Waiting Type' : '...'}
                                                            searchPlaceholder="Search..."
                                                        />
                                                    </View>

                                                    <View style={styles.inputContainer}>
                                                        <Text style={styles.inputLable}>Waiting charge:</Text>
                                                        <TextInput
                                                            value={this.state.waiting_charge}
                                                            autoCompleteType="off"
                                                            autoCapitalize="words"
                                                            keyboardType='numeric'
                                                            style={styles.textInput}
                                                            onChangeText={(waiting_charge) =>
                                                                this.setState({ waiting_charge: waiting_charge })
                                                            }
                                                        />
                                                    </View>

                                                    <View style={styles.inputContainer}>
                                                        <Text style={styles.inputLable}>Other charge:</Text>
                                                        <TextInput
                                                            value={this.state.other_charge}
                                                            autoCompleteType="off"
                                                            autoCapitalize="words"
                                                            keyboardType='numeric'
                                                            style={styles.textInput}
                                                            onChangeText={(other_charge) =>
                                                                this.setState({ other_charge: other_charge })
                                                            }
                                                        />
                                                    </View>

                                                    <View style={styles.inputContainer}>
                                                        <Text style={styles.inputLable}>Toll charge:</Text>
                                                        <TextInput
                                                            value={this.state.toll_charge}
                                                            autoCompleteType="off"
                                                            autoCapitalize="words"
                                                            keyboardType='numeric'
                                                            style={styles.textInput}
                                                            onChangeText={(toll_charge) =>
                                                                this.setState({ toll_charge: toll_charge })
                                                            }
                                                        />
                                                    </View>
                                               </> 
                                        ) : null
                                    }
                                        
                                </View>



                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={this.Edit}
                                >
                                    <Text style={{ fontSize: 18, color: Colors.white }}>
                                        {"Save"}
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
        );
    }
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        // flex: 1,
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
        color:Colors.textColor,
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
        color: Colors.textColor,
        marginBottom: 10,
        // opacity: 0.8,
    },
    textInput: {
borderWidth:1,
        padding: 9,
        fontSize: 14,
        width: "100%",
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
    inputSearchStyle: {
		height: 40,
		fontSize: 16,
	  },
});