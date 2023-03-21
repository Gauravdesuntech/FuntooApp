import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
    SafeAreaView
} from "react-native";
import Constants from "expo-constants";
import { FontAwesome, Feather } from "@expo/vector-icons";
import Colors from "../../config/colors";
import ProgressiveImage from "../../components/ProgressiveImage";
// import { ScrollView } from "react-native-gesture-handler";
import * as Animatable from 'react-native-animatable';
import AwesomeAlert from 'react-native-awesome-alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { UserLogin } from "../../services/UserApiService";
import OverlayLoader from "../../components/OverlayLoader";
import AppContext from "../../context/AppContext";
import { writeUserData, readUserData } from "../../utils/Util";
import firebase from "../../config/firebase";
import { getDeviceToken } from "../../utils/Util";
import { updateTokenData } from "../../services/CustomerApiService";
import { authenticateAdmin, getFileSetting } from "../../services/APIServices";

export default class UserLoginScreen extends React.Component {

    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: '',
            isShowPassword: true,

            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            verificationToken: '',
        }
    }

    componentDidMount() {
        // readUserData().then((data) => {
        //     console.log("...............readuserData...........",data)
        // })
    }
    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };

    // tokenData = () => {
    //     // readUserData().then((data) => {
    //     //     if (data !== null) {
    //     getDeviceToken()
    //       .then((token) => {
    //         // let persistObj = null;
    //         if (token.data !== null) {
    //             data.device_token=token.data;
    //             writeUserData(data);
    //           this.context.setTokenData(token.data);
    //           // console.log("..........persistObj.......home.....",data)
    //         }
    //         let obj = {
    //           cust_code: this.context.userData.cust_code,
    //           device_token: token.data,
    //         };
    //         if (this.context.tokenData != token.data) {
    //           updateTokenData(obj).then((response) => {
    //             console.log("******updateTokenData******", response);        
    //           });
    //         }
    //       })
    //       .catch((err) => {
    //         console.log("..........token catch.........", err);
    //       });
    //     }})
    //   };


    UserLogin = () => {
        let model = {
            phone: this.state.phone,
            password: this.state.password
        };
        this.setState({
            isLoading: true
        });
        console.log("*************model*******************", model)


        UserLogin(model).then(res => {
            console.log("login data.....................", res.data)
            if (res.is_success) {
                getFileSetting()
                    .then((res) => {
                        // console.log('...........res/.............',JSON.parse(res[0].value))
                        this.context.setFileSetting(JSON.parse(res[0].value));
                    })
                    .catch(err => { })
                getDeviceToken()
                    .then((token) => {
                        // console.log("token...................",token)
                        if (token.data !== null) {
                            let userData = res.data;
                            userData.device_token = token.data;
                            writeUserData(userData);
                            this.context.setUserData(userData);
                            this.context.setTokenData(token.data);
                        }
                        let obj = {
                            cust_code: res.data.cust_code,
                            device_token: token.data,
                        };
                        updateTokenData(obj).then((response) => {
                            console.log("******updateTokenData******", response);
                        });
                    })
            } else {
                this.setState({
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: res.message
                })
            }
        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        }).finally(() => {
            this.setState({
                isLoading: false
            });
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.state.isLoading && <OverlayLoader />}
                <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
                <Animatable.View style={{ alignItems: 'center', paddingVertical: 40, }}
                    animation="shake"
                >
                    <View style={styles.logoContainer}>
                        <ProgressiveImage
                            source={require("../../assets/logo.png")}
                            resizeMode={"cover"}
                            style={styles.logoImg}
                        />
                    </View>
                </Animatable.View>
                <Animatable.View
                    animation="fadeInUpBig"
                    style={styles.footer}
                >
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false} ref='scroll' contentContainerStyle={{ flexGrow: 1 }}>

                        <View style={styles.body}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 30 }}>
                                <Text style={{ fontSize: 35 }}>Login</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.rowText}>Mobile Number</Text>
                                <View style={styles.action}>
                                    <FontAwesome
                                        name="phone"
                                        color={Colors.textColor}
                                        size={20}
                                    />
                                    <TextInput
                                        placeholder="Mobile Number"
                                        placeholderTextColor="#666666"
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        keyboardType="numeric"
                                        onChangeText={(phone) => this.setState({ phone })}
                                    />
                                </View>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.rowText}>Password</Text>
                                <View style={styles.action}>
                                    <FontAwesome
                                        name="lock"
                                        color={Colors.textColor}
                                        size={20}
                                    />
                                    <TextInput
                                        placeholder="Password"
                                        placeholderTextColor="#666666"
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        secureTextEntry={this.state.isShowPassword}
                                        onChangeText={(password) => this.setState({ password })}
                                    />

                                    <TouchableOpacity
                                        onPress={() => this.setState({
                                            isShowPassword: !this.state.isShowPassword
                                        })}
                                    >
                                        {this.state.isShowPassword ?
                                            <Feather
                                                name="eye-off"
                                                color={Colors.textColor}
                                                size={20}
                                            />
                                            :
                                            <Feather
                                                name="eye"
                                                color={Colors.textColor}
                                                size={20}
                                            />
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={[styles.signIn, {
                                        borderColor: '#009387',
                                        marginTop: 10,
                                        backgroundColor: Colors.primary
                                    }]}
                                    onPress={this.UserLogin}
                                >
                                    <Text style={[styles.textSign, {
                                        color: Colors.white
                                    }]}>Sign In</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => this.props.navigation.navigate("MobileVerification")}
                                >
                                    <Text style={[styles.textSign, {
                                        color: Colors.primary, fontSize: 16
                                    }]}>Forgot Password</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* <View style={[styles.row,{ borderTopWidth: 1, borderTopColor: 'gray',justifyContent:'center',alignItems:'center' }]}>
                            <TouchableOpacity 
                              style={[styles.signIn, {
                                borderColor: Colors.primary,
                                marginTop: 10,
                                // backgroundColor: Colors.primary,
                                flexDirection:'row',
                                borderWidth:1,
                            }]}
                            >
                                <FontAwesome name="whatsapp" size={30} color="green" />
                                <Text style={[styles.textSign, {
                                        color: Colors.primary ,
                                        marginLeft:20
                                    }]}>Login with WhatsApp</Text>
                            </TouchableOpacity>
                        </View> */}
                    </KeyboardAwareScrollView>
                </Animatable.View>
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
        backgroundColor: Colors.primary,
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },

    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    body: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },

    logoContainer: {
        width: 150,
        height: 150,
        borderRadius: 30,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: Colors.white,
    },
    logoImg: {
        width: 150,
        height: 150,
    },

    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },

    row: {
        flex: 3,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        // paddingHorizontal: 20,
        // paddingVertical: 20
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    rowText: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});