import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    Alert,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    FlatList,
    SafeAreaView,
    Image
} from "react-native";
import Colors from "../../config/colors";
import { Header } from "../../components";
import { DateAndTimePicker, Dropdown } from "../../components";
import AwesomeAlert from 'react-native-awesome-alerts';
import { getFormattedDate } from "../../utils/Util";
import { GetVehicleArrivalEntry } from "../../services/VehicleInfoApiService";
import OverlayLoader from "../../components/OverlayLoader";
import EmptyScreen from "../../components/EmptyScreen";
import moment from "moment";
import * as Location from 'expo-location';

export default class VehicleArrivalEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.route.params?.data,
            isLoading: false,
            arrivalEntry: null,
            lat:'',
            long:'',
            location:null
        }
    }

    componentDidMount() {
        this.getLocation()
        this.setState({
            isLoading: true
        });
        GetVehicleArrivalEntry(this.state.data.vehicles_info_id).then((result) => {
            console.log(result);
            this.setState({
                isLoading: false,
                arrivalEntry: result.data
            });
        });
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

    deleteEntry(item) {
      
        Alert.alert(
            "Are you sure?",
            "Are you want to remove this entry?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        console.log('delte item');
                        console.log(item);
                    }
                },
                {
                    text: "No"
                }
            ]
        );
    }

    renderTime = (time) => {
		let formatedTime = moment(time, "HH:mm").format("hh:mm A");
		return `${formatedTime}`;
	}

    render() {
        return (
            <>
                <SafeAreaView style={styles.container}>
                    
                    { this.state.arrivalEntry === null ? (
                        <Header title="Arrival Entry" addAction={() => { this.props.navigation.navigate("AddVehicleArrivalEntry", { data: this.state.data }) }} />
                    ) : (
                        <Header title="Arrival Entry" />
                    ) }
                    
                    
                    {
                    this.state.isLoading ? 
                        ( <OverlayLoader /> ) : 
                        this.state.arrivalEntry != null ? (
                            <>
                                <View style={styles.listItem}>
                                    <TouchableOpacity style={{ flexDirection: 'row' }}
                                        onPress={() => { this.props.navigation.navigate("UpdateVehicleArrivalEntry", { item: this.state.arrivalEntry }) }}
                                        onLongPress={this.deleteEntry.bind(this, this.state.arrivalEntry.id)}>
                                        <View style={styles.left}>
                                            <Image
                                                style={styles.image}
                                                source={{
                                                    uri: this.state.arrivalEntry.photo,
                                                }}
                                            />
                                        </View>
                                        <View style={styles.right}>
                                            <View style={styles.qtyContainer}>
                                                <Text>Arrival Date: {getFormattedDate(new Date(this.state.arrivalEntry.arrival_date), "DD/MM/YYYY")}  </Text>
                                                <Text>Arrival Time: {this.renderTime(this.state.arrivalEntry.arrival_time)}</Text>
                                            </View>

                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : <EmptyScreen />
                    }
                </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    image: {
        width: "80%",
        height: "50%",
    },
    left: {
        marginTop: 20,
        width: "40%",
        justifyContent: "center",
    },
    right: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
});