import React, {Component} from "react";
import { View, Text, StyleSheet, TouchableOpacity,Linking, SafeAreaView } from "react-native";
import Colors from "../../config/colors";
import { EventTracking } from "../../services/EventApiService";
import OverlayLoader from "../../components/OverlayLoader";
import { ScrollView } from "react-native-gesture-handler";
import {
	MaterialIcons
} from "@expo/vector-icons";
import { showDateAsClientWant, showTimeAsClientWant } from "../../utils/Util";

export default class Tracking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            model: {},
            isLoading: true,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }

    componentDidMount = () => {
        EventTracking(this.props.orderData.id).then(res => {
            if (res.is_success) {
                this.setState({
                    model: res.data,
                    isLoading: false
                });
            }
        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        });
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
                            {this.state.model.loading_start_date != '' && <Text style={styles.titleValue}>{showDateAsClientWant(model.loading_start_date)}</Text> }
                        </View>
                        <View style={styles.cardRow}>
                            <Text style={styles.title}>Time</Text>
                            { this.state.model.loading_start_time != '' && <Text style={styles.titleValue}>{showTimeAsClientWant(model.loading_start_time)}</Text> }
                        </View>
                        <Text style={styles.heading}>Loading End</Text>
                        <View style={styles.cardRow}>
                            <Text style={styles.title}>Date</Text>
                            { this.state.model.loading_end_date != '' && <Text style={styles.titleValue}>{showDateAsClientWant(model.loading_end_date)}</Text> }
                        </View>
                        <View style={styles.cardRow}>
                            <Text style={styles.title}>Time</Text>
                            { this.state.model.loading_end_time != '' && <Text style={styles.titleValue}>{showTimeAsClientWant(model.loading_end_time)}</Text> }
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
                                            onPress={this.dialCall.bind(this, vehicle.phone)}
                                        >
                                            <MaterialIcons name="call" style={{ color: Colors.white, fontSize: 19 }} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.listRow}>
                                        <Text style={styles.title}>Vehcile Type</Text>
                                        <Text style={styles.titleValue}>{vehicle.type}</Text>
                                    </View>

                                    <View style={styles.listRow}>
                                        <Text style={styles.title}>From</Text>
                                        <Text style={styles.titleValue}>{vehicle.from_address}</Text>
                                    </View>

                                    <View style={styles.listRow}>
                                        <Text style={styles.title}>To</Text>
                                        <Text style={styles.titleValue}>{vehicle.to_address}</Text>
                                    </View>

                                    <View style={styles.listRow}>
                                        <Text style={styles.title}>Journey Type</Text>
                                        <Text style={styles.titleValue}>{vehicle.journey_type}</Text>
                                    </View>

                                    <View style={styles.listRow}>
                                        <Text style={styles.title}>Boking Date</Text>
                                        <Text style={styles.titleValue}>{ showDateAsClientWant(vehicle.booking_date) }</Text>
                                    </View>

                                    <View style={styles.listRow}>
                                        <Text style={styles.title}>Boking Time</Text>
                                        <Text style={styles.titleValue}>{ showTimeAsClientWant(vehicle.booking_date) }</Text>
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
                            <Text style={styles.title}> Loading Vehcile</Text>
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
                            <Text style={styles.titleValue}>{model.setup_photo_poof_percentage}/100(%)</Text>
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
        backgroundColor: "#F5F5F5",
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
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderBottomColor: 'silver'
    },

    listRow: {
        flexDirection: 'row', justifyContent: 'space-between'
    },

    title: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 3,
        fontWeight: "normal",
        opacity: 0.9,
    },
    titleValue: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 3,
        fontWeight: "normal",
        opacity: 0.9,
    },

    heading: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 16,
        color: Colors.primary
    }
});