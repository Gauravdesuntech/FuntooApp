import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView
} from "react-native";

import Colors from "../../config/colors";
import OverlayLoader from "../../components/OverlayLoader";
import AppContext from "../../context/AppContext";
import { showDateAsClientWant, showTimeAsClientWant } from "../../utils/Util";
import { GetVenderOrderDetails } from "../../services/VenderApiService";
import { Header } from "../../components";
import ProgressiveImage from "../../components/ProgressiveImage";
import Modal from "react-native-modal";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import AwesomeAlert from 'react-native-awesome-alerts';
import VendorHeader from "../../components/VendorHeader";

export default class VenderOrderDetails extends Component {

    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            order_id: this.props.route.params.order_id,
            orderData: null,
            title: '',
            gameListModalVisible: false,
            games: [],
            game_name: '',
            game_id: '',

            showAlert: false,
            alertTitle: '',
            alertMessage: ''
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        GetVenderOrderDetails({
            vender_id: this.context.userData.vender_details.id,
            order_id: this.state.order_id
        }).then((result) => {
            if (result.is_success) {
                this.setState({
                    title: '#Order ' + result.data.uni_order_id,
                    orderData: result.data
                });

                let lineItems = result.data.line_items;
                let games = [];
                lineItems.forEach( (item) => {
                    games.push({
                        id: item.game.id,
                        name: item.game.name,
                        value: item.game.name
                    });
                });

                this.setState({
                    games: games
                });
            }
        })
        .catch(e => console.log(e))
        .finally(() => {
            this.setState({ isLoading: false });
        });
    }

    showAlert = () => {
        this.setState({
            gameListModalVisible: true
        });
    }

    hideAwsomeAlert = () => {
        this.setState({
            showAlert: false
        });
    }

    handleHeaderBtnClick = () => {
        this.setState({
            gameListModalVisible: true
        });
    }

    validateData = () => {
        if(this.state.game_id == '') {
            this.setState({
                showAlert: true,
                alertTitle: 'Error',
                alertMessage: 'Please select a game'
            });
            return false;
        }

        return true;
    }

    addVolunteer = () => {
        if(this.validateData()) {

            this.setState({
                gameListModalVisible: false
            });

            this.props.navigation.navigate('OrderVolunteerListScreen', {
                order_id: this.state.order_id,
                game_id: this.state.game_id
            });
        }
    }

    render() {
        let lineItems = this.state.orderData?.line_items;

        return (

            <>
                <SafeAreaView style={styles.container}>
                    <VendorHeader title={this.state.title} addAction={this.handleHeaderBtnClick} />

                    {this.state.isLoading ? (
                        <OverlayLoader visible={this.state.isLoading} />
                    ) : (
                        <View style={styles.container}>
                            <KeyboardAwareScrollView>
                                <View style={styles.rowContainer}>
                                    <View style={styles.row}>
                                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                            <Text style={styles.inputLable}>Event Start:</Text>
                                        </View>
                                        <View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
                                            <View style={{ width: "55%" }}>
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                    <Text style={styles.location}>{showDateAsClientWant(this.state.orderData?.event_data.event_start_timestamp)}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.divider}></View>
                                            <View style={{ width: "45%", borderTopRightRadius: 5, }}>
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                    <Text style={styles.location}>{showTimeAsClientWant(this.state.orderData?.event_data?.event_start_timestamp)}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={[styles.rowLeft]}>
                                            <Text style={styles.inputLable}>Event End:</Text>
                                        </View>
                                        <View style={[styles.rowRight]}>
                                            <View style={{ width: "55%" }}>
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                    <Text style={styles.location}>{showDateAsClientWant(this.state.orderData?.event_data?.event_end_timestamp)}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.divider}></View>
                                            <View style={{ width: "45%" }}>
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                    <Text style={styles.location}>{showTimeAsClientWant(this.state.orderData?.event_data?.event_end_timestamp)}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={[styles.rowLeft]}>
                                            <Text style={styles.inputLable}>Setup:</Text>
                                        </View>
                                        <View style={[styles.rowRight]}>
                                            <View style={{ width: "55%" }}>
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                    <Text style={styles.location}>{showDateAsClientWant(this.state.orderData?.event_data?.setup_timestamp)}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.divider}></View>
                                            <View style={{ width: "45%" }}>
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                    <Text style={styles.location}>{showTimeAsClientWant(this.state.orderData?.event_data?.setup_timestamp)}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Playtime:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{this.state.orderData?.event_data?.play_time}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}># of Guests:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{this.state.orderData?.event_data?.num_of_guest}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Event Type:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{this.state.orderData?.event_data?.event_type_name}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.rowContainer}>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Venue:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{this.state.orderData?.event_data?.venue}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Address:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{this.state.orderData?.event_data?.address}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Google Location:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{this.state.orderData?.event_data?.google_location}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.rowContainer}>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Booking Date:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{ showDateAsClientWant(this.state.orderData?.order_volunteer_info?.booking_date) }</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Booking Time:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{ showTimeAsClientWant(this.state.orderData?.order_volunteer_info?.booking_time) }</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Booking Done By:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{ this.state.orderData?.order_volunteer_info?.booking_done_by }</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Closing Date:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{ showDateAsClientWant(this.state.orderData?.order_volunteer_info?.closing_date) }</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Closing Time:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{ showTimeAsClientWant(this.state.orderData?.order_volunteer_info?.closing_time) }</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Number of Hours:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{ this.state.orderData?.order_volunteer_info?.num_of_hours }</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Number of Vol Required:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{ this.state.orderData?.order_volunteer_info?.num_of_staff_required }</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Rate Per Hour:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{ this.state.orderData?.order_volunteer_info?.rate_per_hour }</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Amount:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{this.state.orderData?.order_volunteer_info?.amount}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Reporting Date:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{ showDateAsClientWant(this.state.orderData?.order_volunteer_info?.reporting_date) }</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.row}>
                                        <View style={styles.rowLeft}>
                                            <Text style={styles.inputLable}>Reporting Time:</Text>
                                        </View>
                                        <View style={styles.rowRight}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
                                                <Text style={styles.location}>{ showTimeAsClientWant(this.state.orderData?.order_volunteer_info?.reporting_time) }</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                <View style={[styles.rowContainer]}>
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={{ fontSize: 16 }}>Games</Text>
                                        </View>
                                        {
                                            lineItems?.map(item => {
                                                return (
                                                    <View key={item.game.id} style={[styles.listRow]}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View style={{ width: "20%", borderWidth: 1, borderColor: '#dfdfdf' }}>
                                                                <ProgressiveImage
                                                                    source={{ uri: item.game.image_url }}
                                                                    style={{ height: 57, width: "100%" }}
                                                                    resizeMode="cover"
                                                                />
                                                            </View>
                                                            <View style={{ width: "50%", paddingLeft: 10, justifyContent: 'center' }}>
                                                                <Text style={[styles.titleText]} numberOfLines={1} ellipsizeMode="tail">
                                                                    {item.game.name}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                            </KeyboardAwareScrollView>
                        </View>
                    )}
                </SafeAreaView>

                <Modal 
                isVisible={this.state.gameListModalVisible}
                onBackdropPress={ () => this.setState({
                    gameListModalVisible: false
                }) }
                >
                    <View style={{ 
                        backgroundColor: '#fff',
                        padding: 25,
                        }}>
                        
                        <View style={{ marginVertical: 10, justifyContent: 'center' }}>
                            <Text style={[styles.inputLable, { alignSelf: 'center' }]}>Select a Game</Text>
                        </View>

                        <View>
                            <Dropdown
                                value={this.state.game_name}
                                data={this.state.games}
                                onChange={ (item) => { this.setState({
                                    game_id: item.id,
                                    game_name: item.value
                                }) } }
                                style={styles.textInput}
								inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
								search
								labelField="name"
								valueField="name"
								placeholder={!this.state.game_name ? 'Select Game Name' : '...'}
								searchPlaceholder="Search..."
                            />
                        </View>

                        <TouchableOpacity
                                style={styles.submitBtn}
                                onPress={this.addVolunteer}
                            >
                            <Text style={{ fontSize: 18, color: Colors.white }}>Add Volunteer</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <AwesomeAlert
					show={this.state.showAlert}
					showProgress={false}
					title={this.state.alertTitle}
					message={this.state.alertMessage}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showConfirmButton={true}
					confirmText={'OK'}
					confirmButtonColor={Colors.primary}
					onCancelPressed={this.hideAwsomeAlert}
					onConfirmPressed={this.hideAwsomeAlert}
				/>
            </>


        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    rowContainer: {
        paddingHorizontal: 6,
        backgroundColor: Colors.white,
        borderRadius: 4,
        elevation: 10,
        margin: 10,
    },
    rowContainerGames: {
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderRadius: 4,
        elevation: 10,
        marginLeft: 10,
        marginRight: 10
    },
    row: {
        marginTop: 0,
        flexDirection: 'row',
        marginBottom: 0,
        borderBottomWidth: 0.6,
        borderBottomColor: '#cfcfcf'
    },
    rowLeft: {
        width: '47%',
        backgroundColor: '#fff',
        paddingLeft: 0,
        paddingVertical: 10,
        justifyContent: 'center',
        marginTop: 0,
        // paddingTop:1,
        // paddingBottom:1,
    },

    rowRight: {
        flexDirection: "row",
        width: '53%',
        marginLeft: 0,
        backgroundColor: '#fff',
        marginTop: 0,
        justifyContent: 'space-evenly',
    },
    activeTab: {
        backgroundColor: Colors.primary,
    },
    activeText: {
        fontWeight: "bold",
        color: 'white',
    },
    inActiveText: {
        color: "silver",
        opacity: 0.8,
    },
    form: {
        flex: 1,
        padding: 8,
    },
    topBtnContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 30,
    },
    topBtn: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
        marginRight: 15,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    inputLable: {
        fontSize: 14,
        color: Colors.textColor,
        marginBottom: 0,
        // opacity: 0.8,
    },
    textInput: {
borderWidth:1,
        padding: 9,
        fontSize: 14,
        width: "100%",
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
    },
    inputSearchStyle: {
		height: 40,
		fontSize: 16,
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
    desc: {
        fontSize: 14,
        color: Colors.textColor,
        marginBottom: 3,
        fontWeight: "normal",
        // opacity: 0.9,
    },

    listRow: {
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    cardFooter: {
        borderRadius: 4,
        marginLeft: 10,
        width: "94%",
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        elevation: 10,
        marginBottom: 10,
    },

    pricingItemContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    pricingText: {
        fontSize: 14,
        color: Colors.textColor,
    },

    location: {
        color: Colors.textColor,
        fontSize: 14,
        // opacity: 0.8
    },
    divider: {
        width: "2%",
        borderLeftWidth: 0.3,
        alignSelf: 'center',
        height: 20,
        borderLeftColor: '#444',
        opacity: 0.4
    }
});