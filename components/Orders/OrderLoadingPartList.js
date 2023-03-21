import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    Dimensions,
    Image,
    SafeAreaView
} from "react-native";
import {
    Ionicons
} from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import AwesomeAlert from 'react-native-awesome-alerts';
import Colors from "../../config/colors";
import { AddGamePartsForOrder, GetAllSingleGameParts } from "../../services/OrderService";
import OverlayLoader from "../OverlayLoader";
import EmptyScreen from "../EmptyScreen";
import emitter from "../../helper/CommonEmitter";
import PressableButton from "../PressableButton";
import { throwIfAudioIsDisabled } from "expo-av/build/Audio/AudioAvailability";

export default class OrderLoadingPartList extends Component {
    constructor(props) {
        super(props);
        this._emmiter = emitter;
        this.state = {
            isLoading: false,
            game_parts: [],
            game_id: null,
            game_name: '',
            quantity: '',
            isModalOpen: false,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            selected:this.props.item.is_loading_parts_proof_done,
        }
    }

    handleOnChange = (item) => {
        this.setState({
            isLoading: true,
            game_parts: [],
            game_id: item?.game_id,
            game_name: item?.name,
            quantity: item?.quantity,
            isModalOpen: !this.state.isModalOpen
        });
        GetAllSingleGameParts({ game_id: item.game_id, order_id: this.props.orderData.id })
            .then((result) => {
                let parts = result.data;
                if (parts.length > 0) {
                    parts.map((item) => item.is_tic = (item.part_load_completed == 0) ? false : true);
                }
                this.setState({
                    game_parts: parts,
                    isLoading: false,
                });
            })
            .catch(err =>  this.setState({
                isLoading: false,
            }))
            .finally(() => {
                this.setState({
                    isLoading: false,
                });
            });
    }

    SubmitPartLoad = () => {
        let data = {
            order_id: this.props.orderData.id,
            game_id: this.props.item.game_id,
            parts: JSON.stringify(this.state.game_parts)
        };

        this.setState({ isLoading: true });
        AddGamePartsForOrder(data).then(res => {
            this.setState({
                isLoading: false,
            })
            if (res.is_success) {
                if (res.data.is_loading_parts_proof_done == 1) {
                    this.state.selected = true;
                } else {
                    this.state.selected = false;
                }
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message
                }, () => {
                    this._emmiter.emit('LoadingPartsUpdatedFromCommonParts');
                });

            } else {
                this.setState({
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: res.message
                })
            }
        })
            .catch(e => this.setState({
                isLoading: false,
            }))
    }

    toggleAddItemModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    SetTic = (value, index) => {
        this.state.game_parts[index].is_tic = value;
        this.setState({
            game_parts: this.state.game_parts,
        });
    }

    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };

    confirmModal=()=>{
        this.setState({
            // selected:1,
            isModalOpen:false
        })
        let data = {
            order_id: this.props.orderData.id,
            game_id: this.props.item.game_id,
            parts: JSON.stringify(this.state.game_parts)
        };

        this.setState({ isLoading: true });
        AddGamePartsForOrder(data).then(res => {
            this.setState({
                isLoading: false,
            })
            if (res.is_success) {
                if (res.data.is_loading_parts_proof_done == 1) {
                    this.state.selected = true;
                } else {
                    this.state.selected = false;
                }
                this.setState({
                    isLoading: false,
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message
                }, () => {
                    this._emmiter.emit('LoadingPartsUpdatedFromCommonParts');
                });

            } else {
                this.setState({
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: res.message
                })
            }
        })
            .catch(e => this.setState({
                isLoading: false,
            }))
    }

    render() {
        return (
            <>
                {
                    (this.state.isLoading == true) ? (
                        <OverlayLoader visible={this.state.isLoading} />
                    ) : (
                        <>
                            <View style={[styles.tableRow2, { height: 60, alignItems: 'center', justifyContent: 'center' }]}>
                                <Checkbox
                                    value={(this.state.selected == 1) ? true : false}
                                    onValueChange={() => { this.handleOnChange(this.props.item) }}
                                    style={{ borderColor: '#dfdfdf', borderRadius: 5 }}
                                />
                            </View>
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={this.state.isModalOpen}
                                onRequestClose={this.toggleAddItemModal}
                            >
                                <SafeAreaView style={styles.modalOverlay}>
                                    <View style={styles.itemModalContainer}>
                                        <View style={styles.itemModalHeader}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={styles.headerBackBtnContainer}
                                                onPress={this.toggleAddItemModal}
                                            >
                                                <Ionicons name="arrow-back" size={26} color={Colors.white} />
                                            </TouchableOpacity>
                                            <View style={styles.headerTitleContainer}>
                                                <Text style={{ fontSize: 20, color: Colors.white }}>
                                                    {this.state.game_name}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.itemModalBody}>
                                            {
                                                this.state.game_parts.length > 0 ? (
                                                    <View style={styles.form}>
                                                        {this.state.game_parts?.map((item, index) =>
                                                            <View key={item.id}>
                                                                <View style={styles.listRow}>
                                                                    <View style={styles.leftPart}>
                                                                        <View style={{ flexDirection: 'row' }}>
                                                                            <View>
                                                                                <Image
                                                                                    style={{ width: 56, height: 56 }}
                                                                                    resizeMode={'contain'}
                                                                                    source={{ uri: item.thumb_image_url }}
                                                                                />
                                                                            </View>
                                                                            <View style={{ justifyContent: 'center', alignItems: "center", paddingLeft: 13 }}>
                                                                                <Text style={styles.title}>{item.name} <Text style={{ fontSize: 15 }}>x</Text>  {item.quantity}</Text>
                                                                                <Text style={styles.subText}>{item.storage_area}</Text>
                                                                            </View>
                                                                        </View>

                                                                    </View>
                                                                    <View style={[styles.rightPart, { alignItems: 'flex-end' }]}>
                                                                        <View >
                                                                            <Checkbox
                                                                                value={item.is_tic}
                                                                                onValueChange={(v) => this.SetTic(v, index)}
                                                                                style={styles.checkbox}
                                                                            />
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )}

                                                        <TouchableOpacity
                                                            style={styles.submitBtn}
                                                            onPress={this.SubmitPartLoad}
                                                        >
                                                            <Text style={{ fontSize: 18, color: Colors.white }}>
                                                                SUBMIT
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : (
                                                    <>
                                                    <View style={{height:'60%'}}>
                                                    <EmptyScreen
                                                        header={' '}
                                                        message={'No parts are found for this game.'}
                                                    />
                                                    </View>
                                                    <View style={{justifyContent:'center',alignItems:'center'}}>
                                                        {/* <Text> </Text> */}
                                                        <Text> Please press confiem to continue. </Text>
                                                      
                                                            <PressableButton
                                                                btnTextStyle={{ fontSize: 15 }}
                                                                btnStyle={{ height: 40, width: "50%", margin: 10 }}
                                                                text={"Confirm"}
                                                                onPress={()=>this.confirmModal()}
                                                            />
                                                    </View>
                                                    </>
                                                )
                                            }
                                        </View>
                                    </View>
                                </SafeAreaView>
                            </Modal>
                        </>
                    )
                }

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
            </>
        )
    }
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
    tableRow2: {
        // backgroundColor: Colors.lightGrey,
        // marginRight: 5,
        color: Colors.textColor,
        width: 50
    },
    row: {
        marginTop: 5,
        flexDirection: 'row',
    },
    rowItem: {
        //width: '33.33%',
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    rowLebel: {
        fontWeight: 'bold',
        //color: 'silver',
        fontSize: 16

    },
    rowValue: {
        color: Colors.textColor,
    },
    form: {
        flex: 1,
        padding: 8,
    },
    topBtnContainer: {
        width: "100%",
        flexDirection: "row",
        // justifyContent: "space-evenly",
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
        fontSize: 16,
        color: Colors.textColor,
        marginBottom: 10,
        // opacity: 0.8,
    },
    textInput: {
        borderWidth: 1,
        padding: 9,
        fontSize: 14,
        width: "100%",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
    },
    thead: {
        flexDirection: "row",
        height: 45,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: Colors.textInputBorder,
        borderBottomColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
    },
    tbody: {
        flexDirection: "row",
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: Colors.textInputBorder,
    },
    tdLarge: {
        width: "49%",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: Colors.textInputBorder,
        borderRightColor: Colors.textInputBorder,
        justifyContent: "center",
        paddingHorizontal: 6,
    },
    tdSmall: {
        width: "17%",
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        borderRightColor: Colors.textInputBorder,
        paddingHorizontal: 6,
    },
    tdLabel: {
        fontSize: 16,
        color: Colors.textColor,
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
    listRow: {
        flexDirection: "row",
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    leftPart: {
        width: "80%",
        justifyContent: "center",
    },
    rightPart: {
        width: "20%",
        justifyContent: "center",
    },

    title: {
        fontSize: 16,
        color: Colors.textColor,
        fontWeight: "bold",
        lineHeight: 24,
    },

    title_qnt: {
        fontSize: 16,
        color: Colors.textColor,
        lineHeight: 24,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    subText: {
        color: Colors.textColor,
        fontSize: 14,
        lineHeight: 22,
    }
});