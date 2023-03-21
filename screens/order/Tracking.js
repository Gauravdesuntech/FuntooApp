import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,Linking, SafeAreaView } from "react-native";
import Colors from "../../config/colors";
import { EventTracking } from "../../services/EventApiService";
import OverlayLoader from "../../components/OverlayLoader";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import {
	MaterialIcons
} from "@expo/vector-icons";

export default class Tracking extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props?.props.route?.params?.data,
            event_id: this.props?.props.route?.params?.data?.id,

            model: {},
            isLoading: true,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }

    componentDidMount = () => {
        this.EventTracking();
    }


    EventTracking() {
        EventTracking(this.state.event_id).then(res => {
            this.setState({
                isLoading: false,
            });
            if (res.is_success) {
                this.setState({
                    model: res.data,
                });
            }

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }

    renderDate = (date) => {
        let ab = "th";
        if (!date) {
            return "";
        }
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
        if (!v_time) {
            return "";
        }
        let time = moment(v_time, "HH:mm").format("hh:mm A");
        return `${time}`;
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

    render() {
        let model = this.state.model;
        return (
            <SafeAreaView style={styles.container}>

                {this.state.isLoading && <OverlayLoader />}
                <ScrollView>
                    <View style={styles.card}>

                        <View style={styles.cardRow}>
                            <Text style={styles.title}>Total Calls</Text>
                            <Text style={styles.titleValue}>{model.total_calls}</Text>
                        </View>
                        <View style={styles.cardRow}>
                            <Text style={styles.title}>Total SMS</Text>
                            <Text style={styles.titleValue}>{model.total_sms}</Text>
                        </View>

                    </View>


                    <View style={styles.card}>

                        <Text style={styles.heading}>Loading Start</Text>
                        <View style={styles.cardRow}>
                            <Text style={styles.title}>Date</Text>
                            <Text style={styles.titleValue}>{this.renderDate(model.loading_start_at)}</Text>
                        </View>
                        <View style={styles.cardRow}>
                            <Text style={styles.title}>Time</Text>
                            <Text style={styles.titleValue}>{this.renderTime(model.loading_start_at)}</Text>
                        </View>

                        <Text style={styles.heading}>Loading End</Text>
                        <View style={styles.cardRow}>
                            <Text style={styles.title}>Date</Text>
                            <Text style={styles.titleValue}>{this.renderDate(model.loading_end_at)}</Text>
                        </View>
                        <View style={styles.cardRow}>
                            <Text style={styles.title}>Time</Text>
                            <Text style={styles.titleValue}>{this.renderTime(model.loading_end_at)}</Text>
                        </View>

                    </View>


                    <View style={styles.card}>

                        <Text style={styles.heading}>Vichale Details</Text>

                        {model.vehicles?.map(vehicle => {
                            return (
                                <View style={styles.listItem} key={vehicle.id}>
                                    <View style={{  alignItems: 'center',flexDirection:'row',justifyContent:"flex-end" }}>
                                        <Text style={[styles.title,{fontSize:16}]}>{vehicle.vender_name}</Text>
                                        <TouchableOpacity style={{
                                            margin:5,
                                            padding: 5,
                                            backgroundColor: Colors.primary,
                                            borderRadius:10
                                        }}
                                            onPress={this.dialCall.bind(this, vehicle.mobile)}
                                        >
                                            <MaterialIcons name="call" style={{ color: Colors.white, fontSize: 19 }} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.listRow}>
                                        <Text style={styles.title}>Bokking Date</Text>
                                        <Text style={styles.titleValue}>{this.renderDate(vehicle.booking_date)}</Text>
                                    </View>
                                    <Text style={styles.heading}>Jurney Start</Text>
                                    <View style={styles.listRow}>
                                        <Text style={styles.title}>Date</Text>
                                        <Text style={styles.titleValue}>{this.renderDate(vehicle.vehicle_arrival_date)}</Text>
                                    </View>
                                    <View style={styles.listRow}>
                                        <Text style={styles.title}>Time</Text>
                                        <Text style={styles.titleValue}>{this.renderTime(vehicle.vehicle_arrival_time)}</Text>
                                    </View>

                                    <Text style={styles.heading}>Jurney Reach</Text>
                                    <View style={styles.listRow}>
                                        <Text style={styles.title}>Date</Text>
                                        <Text style={styles.titleValue}>{this.renderDate(vehicle.vehicle_arrival_date)}</Text>
                                    </View>
                                    <View style={styles.listRow}>
                                        <Text style={styles.title}>Time</Text>
                                        <Text style={styles.titleValue}>{this.renderTime(vehicle.venue_reach_time)}</Text>
                                    </View>
                                </View>
                            )
                        })}


                    </View>

                    <View style={styles.card}>

                        <Text style={styles.heading}>Event Completed</Text>
                        <View style={styles.cardRow}>
                            <Text style={styles.title}>Date</Text>
                            <Text style={styles.titleValue}></Text>
                        </View>
                        <View style={styles.cardRow}>
                            <Text style={styles.title}>Time</Text>
                            <Text style={styles.titleValue}></Text>
                        </View>

                        <View style={styles.cardRow}>
                            <Text style={styles.title}> Reached Warehouse</Text>
                            <Text style={styles.titleValue}></Text>
                        </View>
                        <View style={styles.cardRow}>
                            <Text style={styles.title}> Loading Vichale </Text>
                            <Text style={styles.titleValue}></Text>
                        </View>

                        <View style={styles.cardRow}>
                            <Text style={styles.title}> Jurney Started  </Text>
                            <Text style={styles.titleValue}></Text>
                        </View>

                        <View style={styles.cardRow}>
                            <Text style={styles.title}> Unloaded On</Text>
                            <Text style={styles.titleValue}></Text>
                        </View>

                        <View style={styles.cardRow}>
                            <Text style={styles.title}>Setup Photos</Text>
                            <Text style={styles.titleValue}>{Math.round(model.steup_done_percent_photos)}/100</Text>
                        </View>

                    </View>

                </ScrollView>
            </SafeAreaView>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#F5F5F5",
    },

    card: {
        margin: 10,
        marginBottom: 2,
        padding: 10,
        backgroundColor: Colors.white,
        elevation: 4,
        borderRadius: 10
    },
    cardRow: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderBottomColor: 'silver'
    },


    listItem: {
        margin: 10,
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderBottomColor: 'silver'
    },

    listRow: {
        flexDirection: 'row', justifyContent: 'space-between'
    },

    title: {
        fontSize: 14,
        color: Colors.textColor,
        marginBottom: 3,
        fontWeight: "normal",
        // opacity: 0.9,
    },
    titleValue: {
        fontSize: 14,
        color: Colors.textColor,
        marginBottom: 3,
        fontWeight: "normal",
        // opacity: 0.9,
    },

    heading: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 16,
        color: Colors.primary
    }
});