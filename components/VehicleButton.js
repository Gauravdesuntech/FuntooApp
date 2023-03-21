import React from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    Text,
    StyleSheet
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AddVehicleArrivalEntry } from "../services/VehicleInfoApiService";
import { getFileData } from "../utils/Util";
import Colors from "../config/colors";
import * as Location from 'expo-location';

export default class VehicleButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoder: false,
            vehicleInfo: this.props.vehicleInfo,
            currentStatus: this.props.currentStatus,
            orderData: this.props.orderData,
            lat:'',
            long:'',
            location:null
        }
    }

    componentDidMount() { this.getLocation()}

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

    setButtonTitle = () => {
        if (this.state.vehicleInfo.journey_type == 'Onward') {
            if (this.state.currentStatus == 'v-basic-info-recorded') {
                return 'Vehicle Photo';
            } else if (this.state.currentStatus == 'v-arrival-entry') {
                return 'Onward Journey Start';
            } else if (this.state.currentStatus == 'v-up-start') {
                return 'Onward Journey End';
            } else if (this.state.currentStatus == 'v-up-end') {
                return 'Payment Info';
            } else if (this.state.currentStatus == 'v-payment-info-added') {
                return 'Raise Invoice';
            } else {
                return 'Invoice Raised';
            }
        } else if (this.state.vehicleInfo.journey_type == 'Return') {
            if (this.state.currentStatus == 'v-basic-info-recorded') {
                return 'Vehicle Photo';
            } else if (this.state.currentStatus == 'v-arrival-entry') {
                return 'Return Journey Start';
            } else if (this.state.currentStatus == 'v-down-start') {
                return 'Return Journey End';
            } else if (this.state.currentStatus == 'v-down-end') {
                return 'Payment Info';
            } else if (this.state.currentStatus == 'v-payment-info-added') {
                return 'Raise Invoice';
            } else {
                return 'Invoice Raised';
            }
        } else {
            if (this.state.currentStatus == 'v-basic-info-recorded') {
                return 'Vehicle Photo';
            } else if (this.state.currentStatus == 'v-arrival-entry') {
                return 'Onward Journey Start';
            } else if (this.state.currentStatus == 'v-up-start') {
                return 'Onward Journey End';
            } else if (this.state.currentStatus == 'v-up-end') {
                return 'Return Journey Start';
            } else if (this.state.currentStatus == 'v-down-start') {
                return 'Return Journey End';
            } else if (this.state.currentStatus == 'v-down-end') {
                return 'Payment Info';
            } else if (this.state.currentStatus == 'v-payment-info-added') {
                return 'Raise Invoice';
            } else {
                return 'Invoice Raised';
            }
        }
    }

    pickImageAndUploadArrivalEntry = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });
      
        if (!result.cancelled) {
            let data = {
                vehicles_info_id: this.state.vehicleInfo.vehicles_info_id,
                photo: getFileData(result),
                location:this.state.location
            }
            this.setState({ showLoder: true });
            console.log('.....data......',data)
            AddVehicleArrivalEntry(data).then((res) => {
                console.log('.....res......',res)
                this.setState({ currentStatus: 'v-arrival-entry' });
                this.props.callBack()
            }).catch(err => {
                this.props.callBack()
                Alert.alert("Server Error", "Please try agian")
            })
                .finally(() => {
                    this.setState({ showLoder: false });
                });
        }
    }

    handleOnePress = () => {
        if (this.state.vehicleInfo.journey_type == 'Onward') {
            if (this.state.currentStatus == 'v-basic-info-recorded') {
                this.pickImageAndUploadArrivalEntry();
            } else if (this.state.currentStatus == 'v-arrival-entry') {
                this.props.navigation.navigate("VehicleUpWordJourneyStartAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if (this.state.currentStatus == 'v-up-start') {
                this.props.navigation.navigate("VehicleUpWordJourneyEndAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if (this.state.currentStatus == 'v-up-end') {
                this.props.navigation.navigate("VehiclePaymentInfoAdd", { vehicleInfo: this.props.vehicleInfo, orderData: this.props.orderData });
            } else if (this.state.currentStatus == 'v-payment-info-added') {
                this.props.navigation.navigate("VehicleBilling", { vehicleInfo: this.props.vehicleInfo });
            }
        } else if (this.state.vehicleInfo.journey_type == 'Return') {
            if (this.state.currentStatus == 'v-basic-info-recorded') {
                this.pickImageAndUploadArrivalEntry();
            } else if (this.state.currentStatus == 'v-arrival-entry') {
                this.props.navigation.navigate("VehicleDownWordJourneyStartAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if (this.state.currentStatus == 'v-down-start') {
                this.props.navigation.navigate("VehicleDownWordJourneyEndAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if (this.state.currentStatus == 'v-down-end') {
                this.props.navigation.navigate("VehiclePaymentInfoAdd", { vehicleInfo: this.props.vehicleInfo, orderData: this.props.orderData });
            } else if (this.state.currentStatus == 'v-payment-info-added') {
                this.props.navigation.navigate("VehicleBilling", { vehicleInfo: this.props.vehicleInfo });
            }
        } else {
            if (this.state.currentStatus == 'v-basic-info-recorded') {
                this.pickImageAndUploadArrivalEntry();
            } else if (this.state.currentStatus == 'v-arrival-entry') {
                this.props.navigation.navigate("VehicleUpWordJourneyStartAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if (this.state.currentStatus == 'v-up-start') {
                this.props.navigation.navigate("VehicleUpWordJourneyEndAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if (this.state.currentStatus == 'v-up-end') {
                this.props.navigation.navigate("VehicleDownWordJourneyStartAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if (this.state.currentStatus == 'v-down-start') {
                this.props.navigation.navigate("VehicleDownWordJourneyEndAdd", { vehicleInfo: this.props.vehicleInfo, callBack: this.props.callBack });
            } else if (this.state.currentStatus == 'v-down-end') {
                this.props.navigation.navigate("VehiclePaymentInfoAdd", { vehicleInfo: this.props.vehicleInfo, orderData: this.props.orderData });
            } else if (this.state.currentStatus == 'v-payment-info-added') {
                this.props.navigation.navigate("VehicleBilling", { vehicleInfo: this.props.vehicleInfo });
            }
        }
    }

    render() {
        return (
            <>
                {this.state.showLoder ? (
                    <ActivityIndicator
                        animating={this.state.showLoder}
                        size="small"
                        color={Colors.primary}
                    />
                ) : (
                    <Pressable
                        onPress={this.handleOnePress}
                        style={styles.btnBackground}
                    >
                        <Text style={styles.btnText}>{this.setButtonTitle()}</Text>
                    </Pressable>
                )}
            </>
        )
    }
}

const styles = StyleSheet.create({
    btnBackground: {
        padding: 10,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        borderRadius: 6
    },

    btnText: {
        color: Colors.white,
        fontSize: 12
    }
})