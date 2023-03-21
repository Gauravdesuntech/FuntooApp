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
    Platform,
    SafeAreaView
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header } from "../../components";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import AwesomeAlert from 'react-native-awesome-alerts';
import { AddVender, UpdateVender } from "../../services/VenderApiService";
import { VenderTypeList } from "../../services/VenderTypeService";



export default class VenderAddUpdateScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.route.params?.data,
            screen:this.props.route.params?.screen,
            id: "",
            vender_type_id: "",
            vender_type_name: "",
            name: "",
            shop_name: "",
            propty_name: "",
            mobile: "",
            tmp_mobile: '',
            mobiles: [],
            emails: [],
            email: '',
            tmp_email: '',
            gst: "",
            state: "",
            vender_types: [],

            isModalOpen: false,
            refreshing: false,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            formErrors: {},
            payment_id: "",
            payment_name: "",
            payment_types: [
             {
                  "id": "1",
                  "name": "Cash",
                },
                {
                  "id": "2",
                  "name": "UPI",
                },
                {
                  "id": "3",
                  "name": "Bank",
                },
              ],
        };
    }

    componentDidMount = () => {
        let data = this.state.data;
        this.setState({
            id: (data?.id) ? data.id : null,
            name: (data?.name) ? data.name : null,
            shop_name: (data?.shop_name) ? data.shop_name : null,
            propty_name: (data?.propty_name) ? data.propty_name : null,
            mobile: (data?.mobile) ? data.mobile : null,
            gst: (data?.gst) ? data.gst : null,
            state: (data?.state) ? data.state : null,
            email: (data?.email) ? data.email : null,
            emails: (data?.emails) ?? [],
            mobiles: data?.mobiles ?? [],
            isModalOpen: true,
            vender_type_id: (data?.vender_type_id) ? data.vender_type_id : null,
            vender_type_name: (data?.vender_type_name) ? data?.vender_type_name : null, 
            payment_name: (data?.payment_name) ? data?.payment_name : null, 
        }, () => {
            this.VenderTypeList()
        });
    }

    VenderTypeList() {
        this.setState({
            isLoading: true
        });
        VenderTypeList().then(res => {
            this.setState({
                isLoading: false,
                vender_types: res.data,
                refreshing: false,
            });

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        });

    }

    /**
     * 
     * Valdiate form data
     * 
     * @returns bool
     */
    ValidateData() {
        let errors = {};
        if(!this.state.name || this.state.name == '') {
            errors.name = "Name is required";
        }

        if(!this.state.mobile || this.state.mobile == '') {
            errors.mobile = "Mobile is required";
        }

        this.setState({
            formErrors: {}
        });

        if( Object.keys(errors).length != 0 ) {
            this.setState({
                formErrors: errors
            });

            return false;
        }

        return true;
    }

    AddVender() {
        let model = {
            name: this.state.name,
            shop_name: this.state.shop_name,
            propty_name: this.state.propty_name,
            mobile: this.state.mobile,
            gst: this.state.gst,
            state: this.state.state,
            email: this.state.email,
            emails: this.state.email,
            mobiles: this.state.mobiles,
            vender_type_id: this.state.vender_type_id,
            payment_name: this.state.payment_name
        }

        if (model.emails) {
            model.emails = JSON.stringify(this.state.emails);
        }
        if (model.mobiles) {
            model.mobiles = JSON.stringify(this.state.mobiles);
        }

        this.setState({isLoading: true});
        AddVender(model).then(res => {
            // console.log('............res............',res)
            if(typeof this.state.screen !== undefined && this.state.screen == "AddVehicleInfo")
            {
                if (res.is_success) {
                    this.setState({
                        isModalOpen: false,
                        showAlertModal: true,
                        alertType: "Success",
                        alertMessage: res.message
                    });
                    this.props.navigation.navigate("AddVehicleInfo",)
                } else {
                    Alert.alert("Error", res.message);
                }
            }
            else if(typeof this.state.screen !== undefined && this.state.screen == "OrderVendorVolunteersAdd")
            {
                if (res.is_success) {
                    this.setState({
                        isModalOpen: false,
                        showAlertModal: true,
                        alertType: "Success",
                        alertMessage: res.message
                    });
                    this.props.navigation.navigate("OrderVendorVolunteersAdd",)
                } else {
                    Alert.alert("Error", res.message);
                }
            }
            else{
            if (res.is_success) {
                this.gotoBack();
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message
                });
            } else {
                Alert.alert("Error", res.message);
            }}
        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        }).finally( () => {
            this.setState({ isLoading: false });
        });
    }

    UpdateVender() {
        let model = {
            id: this.state.id,
            name: this.state.name,
            shop_name: this.state.shop_name,
            propty_name: this.state.propty_name,
            mobile: this.state.mobile,
            gst: this.state.gst,
            state: this.state.state,
            email: this.state.email,
            emails: this.state.emails,
            mobiles: this.state.mobiles,
            vender_type_id: this.state.vender_type_id,
            payment_name: this.state.payment_name
        }

        if (model.emails) {
            model.emails = JSON.stringify(this.state.emails);
        }
        if (model.mobiles) {
            model.mobiles = JSON.stringify(this.state.mobiles);
        }
        this.setState({
            isLoading: true
        });

        UpdateVender(model).then(res => {
            if (res.is_success) {
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message
                });
            } else {
                Alert.alert("Error", res.message);
            }
        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        }).finally( () => {
            this.setState({
                isLoading: false
            });
        });
    }

    ControlSubmit = () => {
        if(this.ValidateData()) {
            if(this.state.id) {
                this.UpdateVender()
            } else {
                this.AddVender();
            }
        }
    }

    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
        this.gotoBack()
    };

    SetGST(value) {
        this.setState({ gst: value.toUpperCase() })
    }

    AddEmail = () => {
        let tmp_email = this.state.tmp_email;
        if (!tmp_email) {
            this.setState({
                showAlertModal: true,
                alertType: "Error",
                alertMessage: "Email is required"
            })
            return;
        }

        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!tmp_email.match(mailformat)) {
            this.setState({
                showAlertModal: true,
                alertType: "Error",
                alertMessage: "Invalid email format"
            })
            return;
        }

        if (this.state.emails.includes(tmp_email)) {
            this.setState({
                showAlertModal: true,
                alertType: "Error",
                alertMessage: "This email already added"
            })
            return;
        }

        this.state.emails.push(tmp_email);
        this.setState({
            tmp_email: "",
            emails: this.state.emails
        });
    }

    DeleteEmail = (index) => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this email?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        this.state.emails.splice(index, 1);
                        this.setState({ emails: this.state.emails });
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    }

    AddMobile = () => {
        let tmp_mobile = this.state.tmp_mobile;
        if (!tmp_mobile) {
            this.setState({
                showAlertModal: true,
                alertType: "Error",
                alertMessage: "Mobile is required"
            })
            return;

        }

        var format = /^[1-9]{1}[0-9]{9}$/
        if (!tmp_mobile.match(format)) {
            this.setState({
                showAlertModal: true,
                alertType: "Error",
                alertMessage: "Enter valid mobile number"
            })
            return;
        }

        if (this.state.mobiles.includes(tmp_mobile)) {
            this.setState({
                showAlertModal: true,
                alertType: "Error",
                alertMessage: "This mobile number already added"
            })
            return;
        }

        this.state.mobiles.push(tmp_mobile);
        this.setState({
            tmp_mobile: "",
            mobiles: this.state.mobiles
        });
    }

    DeleteMobile = (index) => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this mobile number?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        this.state.mobiles.splice(index, 1);
                        this.setState({ mobiles: this.state.mobiles });
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    }

    gotoBack = () => this.props.navigation.goBack();

    SetVenderTypeId = (v) => {
        this.setState({
            vender_type_id: v.id,
            vender_type_name: v.name,
        });
    };
    SetPaymentTypeId = (p) => {
        this.setState({
            payment_id: p.id,
            payment_name: p.name,
        });
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header title={this.state.id ? "Update Vendor" : "Add Vendor"} addAction={this.toggleModal} />
                    <View style={styles.form}>
                        <KeyboardAwareScrollView>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}>Type</Text>
                                <Dropdown
                                    value={this.state.vender_type_name}
                                    data={this.state.vender_types}
                                    onChange={this.SetVenderTypeId}
                                    style={styles.textInput}
                                    inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
                                    search
                                    labelField="name"
                                    valueField="name"
                                    placeholder={!this.state.vender_type_name ? 'Select Type' : '...'}
                                    searchPlaceholder="Search..."
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}> Name:</Text>
                                <TextInput
                                    value={this.state.name}
                                    autoCompleteType="off"
                                    style={styles.textInput}
                                    onChangeText={(name) => this.setState({ name })}
                                />

                                <View>
                                    { this.state.formErrors.name && 
                                        <Text style={{ color: 'red' }}>{this.state.formErrors.name}</Text> 
                                    }
                                </View>
                                
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}>Shop Name:</Text>
                                <TextInput
                                    value={this.state.shop_name}
                                    autoCompleteType="off"
                                    keyboardType="default"
                                    style={styles.textInput}
                                    onChangeText={(shop_name) => this.setState({ shop_name })}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}>PROP. Name:</Text>
                                <TextInput
                                    value={this.state.propty_name}
                                    autoCompleteType="off"
                                    keyboardType="default"
                                    style={styles.textInput}
                                    onChangeText={(propty_name) => this.setState({ propty_name })}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}>Mobile:</Text>
                                <TextInput
                                    value={this.state.mobile}
                                    autoCompleteType="off"
                                    keyboardType="numeric"
                                    style={styles.textInput}
                                    onChangeText={(mobile) => this.setState({ mobile })}
                                />

                                <View>
                                    { this.state.formErrors.mobile && 
                                        <Text style={{ color: 'red' }}>{this.state.formErrors.mobile}</Text> 
                                    }
                                </View>

                            </View>


                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}>Add Mobile Number:</Text>
                                <TextInput
                                    value={this.state.tmp_mobile}
                                    autoCompleteType="off"
                                    keyboardType="numeric"
                                    style={styles.textInput}
                                    onChangeText={(tmp_mobile) => this.setState({ tmp_mobile })}
                                />
                                <TouchableOpacity style={{
                                    position: "absolute",
                                    padding: 8,
                                    bottom: 5,
                                    right: 0,
                                }}
                                    onPress={this.AddMobile}
                                >

                                    <MaterialIcons
                                        name="add"
                                        color={Colors.primary}
                                        size={24}
                                    />

                                </TouchableOpacity>
                            </View>

                            <View>
                                {this.state.mobiles?.map((item, index) => {
                                    return (
                                        <View style={styles.inputContainer} key={Math.random()}>
                                            <Text style={styles.textInput}>{item}  </Text>
                                            <TouchableOpacity style={styles.iconLeft}
                                                onPress={() => this.DeleteMobile(index)}
                                            >
                                                <MaterialIcons
                                                    name="delete"
                                                    color={Colors.danger}
                                                    size={24}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}

                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}>Email:</Text>
                                <TextInput
                                    value={this.state.email}
                                    autoCompleteType="off"
                                    keyboardType="default"
                                    style={styles.textInput}
                                    onChangeText={(email) => this.setState({ email })}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}>Add Email:</Text>
                                <TextInput
                                    value={this.state.tmp_email}
                                    autoCompleteType="off"
                                    keyboardType="default"
                                    style={styles.textInput}
                                    onChangeText={(tmp_email) => this.setState({ tmp_email })}
                                />
                                <TouchableOpacity style={styles.iconLeft}
                                    onPress={this.AddEmail}
                                >
                                    <MaterialIcons
                                        name="add"
                                        color={Colors.primary}
                                        size={24}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View>
                                {this.state.emails?.map((item, index) => {
                                    return (
                                        <View style={styles.inputContainer} key={Math.random()}>
                                            <Text style={styles.textInput}>{item}  </Text>
                                            <TouchableOpacity style={styles.iconLeft}
                                                onPress={() => this.DeleteEmail(index)}
                                            >
                                                <MaterialIcons
                                                    name="delete"
                                                    color={Colors.danger}
                                                    size={24}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                    )
                                })}

                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}>GST:</Text>
                                <TextInput
                                    value={this.state.gst}
                                    autoCompleteType="off"
                                    autoCapitalize="characters"
                                    keyboardType="default"
                                    style={styles.textInput}
                                    onChangeText={(gst) => this.setState({gst})}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}>State:</Text>
                                <TextInput
                                    value={this.state.state}
                                    autoCompleteType="off"
                                    keyboardType="default"
                                    style={styles.textInput}
                                    onChangeText={(state) => this.setState({ state })}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLable}>Payment</Text>
                                <Dropdown
                                    value={this.state.payment_name}
                                    data={this.state.payment_types}
                                    onChange={this.SetPaymentTypeId}
                                    style={styles.textInput}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    search
                                    labelField="name"
                                    valueField="name"
                                    placeholder={!this.state.payment_name ? 'Select Type' : '...'}
                                    searchPlaceholder="Search..."
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.submitBtn}
                                onPress={this.ControlSubmit}
                            >
                                <Text style={{ fontSize: 18, color: Colors.white }}>
                                    {this.state.id ? "Update" : "Save"}
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
            </SafeAreaView>
        )
    }

}



const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
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
        color:Colors.textColor,
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
        flex: 1,
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
        color:Colors.textColor,
        marginBottom: 10,
        // opacity: 0.8,
    },
    textInput: {
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

    iconLeft: {
        position: "absolute",
        padding: 8,
        bottom: 5,
        right: 0,
    }
});