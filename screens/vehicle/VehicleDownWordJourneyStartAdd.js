import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
    SafeAreaView
} from "react-native";
import Colors from "../../config/colors";
import { Header } from "../../components";
import { getFileData } from "../../utils/Util";
import { AddVehicleDownwardsJourneyStart } from "../../services/VehicleInfoApiService";
import OverlayLoader from "../../components/OverlayLoader";
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import AppContext from "../../context/AppContext";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Location from 'expo-location';

export default class VehicleDownWordJourneyStartAdd extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            vehicleInfo: this.props.route.params.vehicleInfo,
            isLoading: false,
            showAlertModal: false,
            alertType: '',
            alertMessage: '',

            vehiclePhotoUrl: null,
            vehicle_photo: null,
            meterPhotoUrl: null,
            meter_photo: null,
            start_km: '',
            lat:'',
            long:'',
            location:null
        }
    }

componentDidMount(){
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

    pickMeterPhoto = () => {
        this.pickImage().then( (result) => {
            this.setState({
                meterPhotoUrl: result.uri,
                meter_photo: getFileData(result)
            });
        });
    }

    pickVehiclePhoto = () => {
        this.pickImage().then( (result) => {
            this.setState({
                vehiclePhotoUrl: result.uri,
                vehicle_photo: getFileData(result)
            });
        })
    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        return result;
    }

    validateData = () => {
        if(this.state.start_km.trim() == '') {
            Alert.alert("Start Km can't be empty");
            return false;
        }

        return true;
    }

    Add = () => {
        
        if(!this.validateData()) {
            return;
        }

        let data = {
            vehicles_info_id: this.state.vehicleInfo.vehicles_info_id,
            start_km: this.state.start_km,
            vehicle_photo: this.state.vehicle_photo,
            meter_photo: this.state.meter_photo,
            location:this.state.location
        }

        this.setState({isLoading: true});
        AddVehicleDownwardsJourneyStart(data).then( (response) => {
            if(response.is_success) {
                // show alert here
                this.setState({
                    isLoading: false,
                    showAlertModal: true,
					alertType: "Success",
					alertMessage: "Info Recorded Successfully"
                });
            } else {
                this.setState({
                    isLoading: false,
                    showAlertModal: true,
					alertType: "Success",
					alertMessage: response.message
                });
            }
        }).catch( (err) => {
            this.setState({
                isLoading: false,
                showAlertModal: true,
                alertType: "Error",
                alertMessage: "Server Error"
            });
        });
    }

    hideAlert = () => {
        this.setState({
            showAlertModal: false  
        });
        this.props.route.params.callBack();
        this.props.navigation.goBack();
    }

    renderChoosenImage = (type) => {
        let url;
        if(type == 'vehiclePhoto') {
            url = this.state.vehiclePhotoUrl;
        } else {
            url = this.state.meterPhotoUrl;
        }

        return (
            <SafeAreaView style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ width: '30%' }}>
                    <Text style={ { marginTop: 10, marginBottom: 10 } }>{ type == 'vehiclePhoto' ? 'Vehicle Photo' : 'Meter Photo' }</Text>
                </View>
                <View style={{ width: '70%', justifyContent: 'center' }}>
                    { url == null ? (
                        <Ionicons
                            name="image"
                            color={Colors.textColor}
                            size={40}
                            style={{ alignSelf: 'center' }}
                        />
                    ) : (
                        <Image source={{uri: url}} style={{ width: 80, height: 80, alignSelf: 'center' }} />
                    ) }
                </View>
            </SafeAreaView>
        );
    }

    render() {
        return (
            <SafeAreaView>
                { this.state.isLoading && <OverlayLoader /> }
                <View style={styles.container}>
                    <Header title={"Return Journey Start"} />
                        <View style={styles.form}>
                            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

                                <View style={styles.box}>

                                    <TouchableOpacity
                                        onPress={this.pickVehiclePhoto}    
                                    >
                                        {this.renderChoosenImage('vehiclePhoto')}
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.box}>

                                    <TouchableOpacity
                                        onPress={this.pickMeterPhoto}    
                                    >
                                        {this.renderChoosenImage('meterPhoto')}
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLable}>Start KM:</Text>
                                    <TextInput
                                        autoCompleteType="off"
                                        keyboardType="number-pad"
                                        autoCapitalize="words"
                                        style={styles.textInput}
                                        onChangeText={(start_km) => { this.setState({ start_km: start_km}) }}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={this.Add}
                                >
                                    <Text style={{ fontSize: 18, color: Colors.white }}>
                                        {"Save"}
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
        color: Colors.textColor,
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