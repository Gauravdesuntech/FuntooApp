import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    SafeAreaView
} from "react-native";
// import Modal from "react-native-modal";
import Colors from "../config/colors";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Configs from "../config/Configs";
import { Ionicons } from "@expo/vector-icons";

export default class GoogleAddressPickerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            alladdress: {},
            searchValue: "",
            isOpen: true,
            long_lat:'',
        }
    }

    render() {
        return (

            <SafeAreaView>
            <Modal
                isVisible={this.props.isGoogleAddressModalVisible}
                onBackdropPress={this.props.onBackdropPressGAddressModal}
                onRequestClose={this.props.onRequestCloseGAddressModal}
            >
                <View style={{ backgroundColor: Colors.white, borderTopLeftRadius: 10, borderTopRightRadius: 10,marginTop:'5%'}}>

                <View style={{ width: '100%', height: 50, backgroundColor: Colors.primary, flexDirection: 'row', padding: 5 }}>
                            <TouchableOpacity
                                style={{ alignSelf: 'center', }}
                                onPress={this.props.onTopCrossBtnPress}
                            >
                                <Ionicons name="arrow-back" size={26} color={Colors.white} />
                            </TouchableOpacity>
                            <Text style={{ alignSelf: 'center', color: Colors.white, fontSize: 20, paddingLeft: '25%' }}>Google Location</Text>
                        </View>

                    {/* <TouchableOpacity
                        activeOpacity={1}
                        style={styles.closeBtn}
                        onPress={this.props.onTopCrossBtnPress}
                    >
                        <Ionicons name="close-circle-sharp" size={26} style={{opacity: 0.6}} color={Colors.textColor} />
                    </TouchableOpacity> */}
                </View>
                <View style={{
                    backgroundColor: '#fff',
                    paddingHorizontal: 25,
                    paddingBottom: 25,
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10
                }}>

                    <View style={styles.placeInputSearch}>


                        <GooglePlacesAutocomplete
                            placeholder='Type to search....'
                            GooglePlacesDetailsQuery={{ fields: "geometry" }}
                            fetchDetails={true} 
                            onPress={(data, details = null) => {
                                console.log("details", {address:data.description,long_lat: details?.geometry?.location});
                                // console.log("..................aefafadf......",JSON.stringify(details?.geometry?.location));
                                let Newdata = {address:data.description,long_lat: details?.geometry?.location}
                                this.setState({
                                    address: data.description,
                                    alladdress: Newdata,
                                    long_lat: details?.geometry?.location
                                },() => {
                                    this.props.onChooseAddress(data.description,details?.geometry?.location,Newdata)
                                });
                            }}
                            query={{
                                key: Configs.GOOGLE_PLACE_API_KEY,
                                language: 'en',
                            }}
                            styles={{
                                textInput: {
borderWidth:1,
                                    color: '#5d5d5d',
                                    fontSize: 16,
                                    borderColor: "#dfdfdf",
                                    borderWidth: 1
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb',
                                },
                            }}
                            enablePoweredByContainer={false}
                            debounce={500}
                            minLength={2}
                        />
                    </View>


                    {/* <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={() => {
                            this.props.onChooseAddress(this.state.address,this.state.long_lat,this.state.alladdress)
                        }}
                    >
                        <Text style={{ fontSize: 18, color: Colors.white }}>
                            Select This Location
                        </Text>
                    </TouchableOpacity> */}
                </View>
            </Modal>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    submitBtn: {
        marginTop: 15,
        height: 45,
        width: "100%",
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
    },
    placeInputSearch: {
        height: 180,
        marginBottom: 20,
        marginTop:20
    },
    closeBtn: {
        width: "100%",
        alignItems: "flex-end",
        justifyContent: "center",
    },
})