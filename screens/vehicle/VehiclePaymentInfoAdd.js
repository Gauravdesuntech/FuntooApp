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
    Alert,
    Image,
    SafeAreaView
} from "react-native";
import Colors from "../../config/colors";
import { Header } from "../../components";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import AppContext from "../../context/AppContext";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import { AddVehiclePayment } from "../../services/VehicleInfoApiService";


export default class VehiclePaymentInfoAdd extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            vehicleInfo: this.props.route.params.vehicleInfo,
            orderData: this.props.route.params.orderData,
            isLoading: false,
            showAlertModal: false,
            alertType: '',
            alertMessage: '',
            isPaymentTypeFixed: true,

            otherChargeModalVisible: false,
            last_other_charge_index: 0,
            single_other_charge_id: null,
            single_other_charge_amount: '',
            single_other_charge_comment: '',
            other_charges: [],

            tollChargePhotoUrl: null,
            tollChargeModalVisible: false,
            single_toll_charge_id: null,
            single_toll_charge_amount: '',
            single_toll_charge_photo_data: null,
            last_toll_charge_index: 0,
            toll_charges: [],

            agreed_amount: '',
            km_charges: '',
            payment_type: 'Fixed',
            waiting_charge: null,
            permit_charge: null,
            paymentModal: false,
            payment_option: [
                { id: 1, name: 'Paid by company', value: 'Paid by company' },
                { id: 2, name: 'Paid by cash', value: 'Paid by cash' },
                { id: 3, name: 'Paid by wallet', value: 'Paid by wallet' }
            ],
            select_payment: '',
            ref_id: '',
        }
    }

    componentDidMount() {
        this.setState({
            orderData: this.props.route.params.orderData
        })
    }

    chooseTollChargePhoto = () => {
        ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
            if (status.granted) {
                let optins = {
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                    base64: true
                };

                ImagePicker.launchImageLibraryAsync(optins).then((result) => {
                    if (!result.cancelled) {
                        this.setState({
                            tollChargePhotoUrl: result.uri,
                            single_toll_charge_photo_data: result.base64,
                        });
                    }
                });
            } else {
                Alert.alert("Warning", "Please allow permission to choose an icon");
            }
        });
    };

    handleTollChargeModalBackDropPress = () => {
        this.setState({
            tollChargeModalVisible: false,
            single_toll_charge_amount: '',
            single_toll_charge_photo: null,
        });
    }

    editTollCharge = (id) => {
        let item = this.state.toll_charges.find(charges => charges.id == id);
        if (item !== undefined) {
            this.setState({
                single_toll_charge_id: id,
                tollChargeModalVisible: true,
                single_toll_charge_amount: item.amount,
                tollChargePhotoUrl: item.photo.uri,
            });
        }
    }

    removeTollCharge = (id) => {
        let index = this.state.toll_charges.findIndex(charges => charges.id == id);
        this.state.toll_charges.splice(index, 1);
        this.setState({
            toll_charges: this.state.toll_charges
        });
    }

    setTollCharge = () => {
        let lastItems = this.state.toll_charges;
        let newIndex = this.state.last_toll_charge_index + 1;

        if (this.state.single_toll_charge_amount == '') {
            Alert.alert("Error", "Please add an amount");
            return;
        }

        if (parseFloat(this.state.single_toll_charge_amount) == 0) {
            Alert.alert("Error", "Please add an amount grater than zero");
            return;
        }

        if (this.state.single_toll_charge_photo_data == null) {
            Alert.alert("Error", "Please add photo");
            return;
        }

        if (this.state.single_toll_charge_id !== null) {
            // update item
            let index = this.state.toll_charges.findIndex(charges => charges.id == this.state.single_toll_charge_id);
            if (index != -1) {
                this.state.toll_charges[index].amount = this.state.single_toll_charge_amount;
                if (this.state.single_toll_charge_photo_data !== null) {
                    this.state.toll_charges[index].photo = this.state.single_toll_charge_photo_data;
                    this.state.toll_charges[index].photoUrl = this.state.tollChargePhotoUrl;
                }
            }
        } else {
            lastItems.push({
                id: newIndex,
                type: 'toll',
                amount: this.state.single_toll_charge_amount,
                photo: this.state.single_toll_charge_photo_data,
                photoUrl: this.state.tollChargePhotoUrl
            });
        }

        this.setState({
            toll_charges: lastItems,
            last_toll_charge_index: newIndex,
            tollChargePhotoUrl: null,
            tollChargeModalVisible: false,
            single_toll_charge_id: null,
            single_toll_charge_amount: '',
            single_toll_charge_photo_data: null
        });
    }

    handleOtherChargeModalBackDropPress = () => {
        this.setOtherChargeModalVisible(false);
        this.setState({
            single_other_charge_amount: '',
            single_other_charge_comment: ''
        });
    }

    removeOtherCharge = (id) => {
        let index = this.state.other_charges.findIndex(charges => charges.id == id);
        this.state.other_charges.splice(index, 1);
        this.setState({
            other_charges: this.state.other_charges
        });
    }

    editOtherCharge = (id) => {
        let item = this.state.other_charges.find(charges => charges.id == id);
        if (item !== undefined) {
            this.setState({
                single_other_charge_id: id,
                otherChargeModalVisible: true,
                single_other_charge_amount: item.amount,
                single_other_charge_comment: item.comment,
            });
        }
    }

    setOtherCharges = () => {
        let beforeOtherCharges = this.state.other_charges;
        let id = this.state.last_other_charge_index + 1;

        if (this.state.single_other_charge_amount == '') {
            Alert.alert("Error", "Please add an amount");
            return;
        }

        if (parseFloat(this.state.single_other_charge_amount) == 0) {
            Alert.alert("Error", "Please add an amount grater than zero");
            return;
        }

        if (this.state.single_other_charge_id !== null) {
            // update item
            let index = this.state.other_charges.findIndex(charges => charges.id == this.state.single_other_charge_id);
            if (index != -1) {
                this.state.other_charges[index].amount = this.state.single_other_charge_amount,
                    this.state.other_charges[index].comment = this.state.single_other_charge_comment
            }
        } else {
            // insert item
            beforeOtherCharges.push({
                id: id,
                type: 'others',
                amount: this.state.single_other_charge_amount,
                comment: this.state.single_other_charge_comment
            });
        }

        this.setState({
            last_other_charge_index: id,
            other_charges: beforeOtherCharges,
            single_other_charge_amount: '',
            single_other_charge_comment: '',
            otherChargeModalVisible: false,
            single_other_charge_id: null
        });
    }

    setOtherChargeModalVisible = (visible) => {
        this.setState({ otherChargeModalVisible: visible });
    }

    validateData = () => {

        if (this.state.payment_type == 'Fixed') {
            if (this.state.agreed_amount == '') {
                Alert.alert("Error", "Please enter a agreed amount");
                return false;
            }
        } else if (this.state.payment_type == 'Variable') {
            if (this.state.km_charges == '') {
                Alert.alert("Error", "Please enter km charges");

                return false;
            }
        }

        return true;
    }

    addTollCharges = () => {
        this.setState({
            tollChargeModalVisible: true
        });
    }

    addOtherCharges = () => {
        this.setOtherChargeModalVisible(true);
    }

    Add = () => {
        if (!this.validateData()) {
            return;
        }


        let data = {};
        let payment_meta_charges = [];
        data.vehicles_info_id = this.state.vehicleInfo.vehicles_info_id;
        data.type = this.state.payment_type;
        data.amount = (this.state.payment_type == 'Fixed') ? this.state.agreed_amount : this.state.km_charges;
        data.payment = this.state.select_payment;
        data.ref_id = this.state.ref_id != '' ? this.state.ref_id :null ;

        // check other charges
        if (this.state.other_charges.length > 0) {
            for (let i = 0; i < this.state.other_charges.length; i++) {
                payment_meta_charges.push({
                    charge_type: 'other',
                    amount: this.state.other_charges[i].amount,
                    description: this.state.other_charges[i].comment,
                    photo_proof: null
                });
            }
        }

        // check toll charges
        if (this.state.toll_charges.length > 0) {
            for (let i = 0; i < this.state.toll_charges.length; i++) {
                payment_meta_charges.push({
                    charge_type: 'toll',
                    amount: this.state.toll_charges[i].amount,
                    description: null,
                    photo_proof: this.state.toll_charges[i].photo
                });
            }
        }

        // check for permit and other charges
        if (this.state.payment_type == 'Variable') {

            if (this.state.waiting_charge !== null) {
                payment_meta_charges.push({
                    charge_type: 'waiting',
                    amount: this.state.waiting_charge,
                    description: null,
                    photo_proof: null
                });
            }

            if (this.state.permit_charge !== null) {
                payment_meta_charges.push({
                    charge_type: 'permit',
                    amount: this.state.permit_charge,
                    description: null,
                    photo_proof: null
                });
            }
        }

        data.payment_meta_charges = JSON.stringify(payment_meta_charges);

        if (this.state.select_payment == 'Paid by cash') {
            this.props.navigation.navigate("VehicleCash", { orderData: this.props.route.params.orderData, data: data })
        }
        else if (this.state.select_payment == 'Paid by wallet') {
            this.props.navigation.navigate("VehicleWallet", { orderData: this.props.route.params.orderData, data: data })
        }
        else {
            this.setState({ isLoading: true });
            AddVehiclePayment(data).then((response) => {
                if (response.is_success) {
                    // show alert here
                    this.setState({
                        isLoading: false,
                        showAlertModal: true,
                        alertType: "Success",
                        alertMessage: "Payment Recorded Successfully"
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        showAlertModal: true,
                        alertType: "Success",
                        alertMessage: response.message
                    });
                }
            }).catch((err) => {
                console.log(err);
                this.setState({
                    isLoading: false,
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: "Server Error"
                });
            });
        }
    }

    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
        // this.props.route.params.callBack();
        this.props.navigation.goBack();
    }

    togglePaymentTypeOption = (type) => {
        if (type.id == 'Fixed') {
            this.setState({
                payment_type: type.id,
                isPaymentTypeFixed: true,
                km_rate: '',
                waiting_charge: null,
                permit_charge: null,
                toll_charges: []
            });
        } else {
            this.setState({
                payment_type: type.id,
                isPaymentTypeFixed: false
            });
        }
    }
    OpenModal = () => {
        this.setState({ paymentModal: !this.state.paymentModal })
    }
    // selectPayment = (value, i) => {
    //     let data = this.state.payment_option.filter((e, index) => {
    //         if (index != i) {
    //             e.selected = false
    //             return e
    //         } else {
    //             e.selected = true
    //             return e
    //         }
    //     })
    //     if (value.name == 'Paid by cash') {
    //         this.props.navigation.navigate("VehicleCash")
    //     }
    //     if (value.name == 'Paid by wallet') {
    //         this.props.navigation.navigate("VehicleWallet")
    //     }
    //     this.setState({
    //         payment_option: data,
    //         paymentModal: !this.state.paymentModal,
    //         select_payment: value.name
    //     })
    // }
    selectPayment = (type) => {
        this.setState({
            select_payment: type.name
        })
        let data = {};
        let payment_meta_charges = [];
        data.vehicles_info_id = this.state.vehicleInfo.vehicles_info_id;
        data.type = this.state.payment_type;
        data.amount = (this.state.payment_type == 'Fixed') ? this.state.agreed_amount : this.state.km_charges;
        data.payment = type.name;
        data.ref_id = this.state.ref_id != '' ? this.state.ref_id :null ;

        // check other charges
        if (this.state.other_charges.length > 0) {
            for (let i = 0; i < this.state.other_charges.length; i++) {
                payment_meta_charges.push({
                    charge_type: 'other',
                    amount: this.state.other_charges[i].amount,
                    description: this.state.other_charges[i].comment,
                    photo_proof: null
                });
            }
        }

        // check toll charges
        if (this.state.toll_charges.length > 0) {
            for (let i = 0; i < this.state.toll_charges.length; i++) {
                payment_meta_charges.push({
                    charge_type: 'toll',
                    amount: this.state.toll_charges[i].amount,
                    description: null,
                    photo_proof: this.state.toll_charges[i].photo
                });
            }
        }

        // check for permit and other charges
        if (this.state.payment_type == 'Variable') {

            if (this.state.waiting_charge !== null) {
                payment_meta_charges.push({
                    charge_type: 'waiting',
                    amount: this.state.waiting_charge,
                    description: null,
                    photo_proof: null
                });
            }

            if (this.state.permit_charge !== null) {
                payment_meta_charges.push({
                    charge_type: 'permit',
                    amount: this.state.permit_charge,
                    description: null,
                    photo_proof: null
                });
            }
        }

        data.payment_meta_charges = JSON.stringify(payment_meta_charges);
        if (this.state.payment_type == '') {
            alert('Payment type is required')
        }
        else if (this.state.agreed_amount == '') {
            alert('Amount is required')
        }
        else {
            if (type.name == 'Paid by cash') {
                this.props.navigation.navigate("VehicleCash", { orderData: this.props.route.params.orderData, data: data })
            }
            if (type.name == 'Paid by wallet') {
                this.props.navigation.navigate("VehicleWallet", { orderData: this.props.route.params.orderData, data: data })
            }
           
        }
    }

    render() {

        return (
            <SafeAreaView>
                {this.state.isLoading && <OverlayLoader />}
                <View style={styles.container}>
                    <Header title={"Payment Info"} />

                    <View style={styles.form}>
                        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

                            <Text style={styles.boxHead}>
                                Payment Details :-
                            </Text>

                            <View style={styles.box}>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLable}>Payment type:</Text>
                                    <Dropdown
                                        value={this.state.payment_type}
                                        data={[{ id: 'Fixed', name: 'Fixed' }, { id: 'Variable', name: 'Variable' }]}
                                        onChange={(type) => { this.togglePaymentTypeOption(type) }}
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

                                {
                                    this.state.isPaymentTypeFixed == false ? (
                                        <>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.inputLable}>KM Charges:</Text>
                                                <TextInput
                                                    value={this.state.km_charges}
                                                    autoCompleteType="off"
                                                    autoCapitalize="words"
                                                    keyboardType='numeric'
                                                    style={styles.textInput}
                                                    onChangeText={(km_charges) =>
                                                        this.setState({ km_charges: km_charges })
                                                    }
                                                />
                                            </View>


                                            <View style={styles.inputContainer}>
                                                <Text style={styles.inputLable}>Toll charge:</Text>
                                                <TouchableOpacity style={{
                                                    position: "absolute",
                                                    padding: 8,
                                                    bottom: 5,
                                                    right: 0,
                                                }}
                                                    onPress={() => this.addTollCharges()}
                                                >
                                                    <MaterialIcons
                                                        name="add"
                                                        color={Colors.primary}
                                                        size={24}
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                            {
                                                (this.state.toll_charges.length > 0) ? (
                                                    <>
                                                        {
                                                            this.state.toll_charges.map((charge) => {
                                                                return (
                                                                    <View key={`${charge.id}`} style={{
                                                                        flex: 1,
                                                                        flexDirection: 'row',
                                                                        margin: 10,
                                                                        paddingTop: 8,
                                                                        paddingBottom: 8,
                                                                        borderBottomWidth: 1,
                                                                        borderBottomColor: '#D4D3D3'
                                                                    }}>

                                                                        <View style={{ width: '40%' }}>
                                                                            <TouchableOpacity
                                                                                onPress={() => this.editTollCharge(charge.id)}
                                                                            >
                                                                                <Text> {`${charge.amount}`}</Text>
                                                                            </TouchableOpacity>
                                                                        </View>

                                                                        <View style={{ width: '40%' }}>
                                                                            <Image
                                                                                style={{ height: 45, width: 45 }}
                                                                                source={{ uri: charge.photoUrl }}
                                                                            />
                                                                        </View>

                                                                        <View style={{ width: '20%' }}>
                                                                            <TouchableOpacity
                                                                                onPress={() => this.removeTollCharge(charge.id)}>
                                                                                <Text>Remove</Text>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </>
                                                ) : null
                                            }

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
                                                <Text style={styles.inputLable}>Permit Charges:</Text>
                                                <TextInput
                                                    value={this.state.permit_charge}
                                                    autoCompleteType="off"
                                                    autoCapitalize="words"
                                                    keyboardType='numeric'
                                                    style={styles.textInput}
                                                    onChangeText={(permit_charge) =>
                                                        this.setState({ permit_charge: permit_charge })
                                                    }
                                                />
                                            </View>

                                        </>
                                    ) : (
                                        <>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.inputLable}>Agreed Amount:</Text>
                                                <TextInput
                                                    value={this.state.agreed_amount}
                                                    keyboardType='numeric'
                                                    style={styles.textInput}
                                                    onChangeText={(agreed_amount) =>
                                                        this.setState({ agreed_amount: agreed_amount })
                                                    }
                                                />
                                            </View>
                                        </>
                                    )
                                }

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLable}>Other Charges:</Text>
                                    <TouchableOpacity style={{
                                        position: "absolute",
                                        padding: 8,
                                        bottom: 5,
                                        right: 0,
                                    }}
                                        onPress={this.addOtherCharges}
                                    >
                                        <MaterialIcons
                                            name="add"
                                            color={Colors.primary}
                                            size={24}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {
                                    (this.state.other_charges.length > 0) ? (
                                        <>
                                            {
                                                this.state.other_charges.map((charge) => {
                                                    return (
                                                        <View key={`${charge.id}`} style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                            margin: 10,
                                                            paddingTop: 8,
                                                            paddingBottom: 8,
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: '#D4D3D3'
                                                        }}>

                                                            <View style={{ width: '50%' }}>
                                                                <TouchableOpacity
                                                                    onPress={() => this.editOtherCharge(charge.id)}
                                                                >
                                                                    <Text> {`${charge.amount}`}</Text>
                                                                </TouchableOpacity>
                                                            </View>

                                                            <View style={{ width: '50%' }}>
                                                                <TouchableOpacity
                                                                    onPress={() => this.removeOtherCharge(charge.id)}>
                                                                    <Text>Remove</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </>
                                    ) : null
                                }

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLable}>Payment :</Text>
                                    <Dropdown
                                        value={this.state.payment}
                                        data={this.state.payment_option}
                                        onChange={(type) => { this.selectPayment(type) }}
                                        style={styles.textInput}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        // placeholderStyle={styles.textInput}
                                        // selectedTextStyle={styles.textInput}
                                        search
                                        labelField="name"
                                        valueField="name"
                                        placeholder={!this.state.payment ? 'Select Payment ' : this.state.payment}
                                        searchPlaceholder="Search..."
                                    />
                                </View>

                                <View>
                                    {this.state.select_payment == 'Paid by company' ?
                                        <>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.inputLable}>Ref id:</Text>
                                                <TextInput
                                                    value={this.state.ref_id}
                                                    //   keyboardType='numeric'
                                                    style={styles.textInput}
                                                    onChangeText={(ref_id) =>
                                                        this.setState({ ref_id: ref_id })
                                                    }
                                                />
                                            </View>
                                        </>
                                        : null
                                    }
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.submitBtn}
                                onPress={this.Add}
                            // onPress={() => this.OpenModal()}
                            >
                                <Text style={{ fontSize: 18, color: Colors.white }}>
                                    {/* {"Save"} */}
                                    {"Pay"}
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

                {/* other charges modal */}
                <Modal
                    isVisible={this.state.otherChargeModalVisible}
                    onBackdropPress={this.handleOtherChargeModalBackDropPress}
                >
                    <View style={{
                        backgroundColor: '#fff',
                        padding: 25,
                    }}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLable}>Amount:</Text>
                            <TextInput
                                value={this.state.single_other_charge_amount}
                                autoCompleteType="off"
                                autoCapitalize="words"
                                keyboardType='numeric'
                                style={styles.textInput}
                                onChangeText={(single_other_charge_amount) =>
                                    this.setState({ single_other_charge_amount: single_other_charge_amount })
                                }
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLable}>Comment:</Text>
                            <TextInput
                                value={this.state.single_other_charge_comment}
                                autoCompleteType="off"
                                autoCapitalize="words"
                                style={styles.textInput}
                                onChangeText={(single_other_charge_comment) =>
                                    this.setState({ single_other_charge_comment: single_other_charge_comment })
                                }
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={this.setOtherCharges}
                        >
                            <Text style={{ fontSize: 18, color: Colors.white }}>
                                {this.state.single_other_charge_id !== null ? 'Update' : 'Add'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                {/* toll charges modal */}
                <Modal
                    isVisible={this.state.tollChargeModalVisible}
                    onBackdropPress={() => this.handleTollChargeModalBackDropPress()}
                >
                    <View style={{
                        backgroundColor: '#fff',
                        padding: 25,
                    }}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLable}>Amount:</Text>
                            <TextInput
                                value={this.state.single_toll_charge_amount}
                                autoCompleteType="off"
                                autoCapitalize="words"
                                keyboardType='numeric'
                                style={styles.textInput}
                                onChangeText={(single_toll_charge_amount) =>
                                    this.setState({ single_toll_charge_amount: single_toll_charge_amount })
                                }
                            />
                        </View>

                        <Text style={styles.inputLable}>Photo:</Text>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.chooseTollChargePhoto()}
                        >
                            {this.state.tollChargePhotoUrl !== null ? (
                                <Image
                                    style={styles.image}
                                    source={{ uri: this.state.tollChargePhotoUrl }}
                                />
                            ) : (
                                <Ionicons name="image" color={Colors.textColor} size={40} />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={() => this.setTollCharge()}
                        >
                            <Text style={{ fontSize: 18, color: Colors.white }}>
                                {this.state.single_toll_charge_id !== null ? 'Update' : 'Add'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                {    /**
             * @author Rahul Saha
             * date 03.03.23
                 */}
                {/* payment modal*/}
                <Modal
                    isVisible={this.state.paymentModal}
                    onBackdropPress={this.OpenModal}
                >
                    <View style={{
                        backgroundColor: '#fff',
                        padding: 25,
                    }}>
                        <Text style={{ alignSelf: 'center', fontSize: 16, marginBottom: 20 }}>Select Payment Type</Text>
                        {this.state.payment_option.map((item, index) => {
                            return (
                                <View style={{ flexDirection: 'row' }}>
                                    {item.selected ?
                                        <TouchableOpacity onPress={() => { this.selectPayment(item, index) }} style={{ marginHorizontal: 10 }}>
                                            <MaterialIcons name="check-box" size={24} color={Colors.primary} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => { this.selectPayment(item, index) }} style={{ marginHorizontal: 10 }}>
                                            <MaterialIcons name="check-box-outline-blank" size={24} color={Colors.primary} />
                                        </TouchableOpacity>
                                    }
                                    <Text style={styles.inputLable}>{item.name}</Text>
                                </View>
                            )
                        })
                        }
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({

    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        textAlign: "center"
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },

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
        height: 80,
        width: 80,
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