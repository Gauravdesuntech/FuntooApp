import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import AppContext from "../../context/AppContext";
import { writeUserData } from "../../utils/Util";
import { addUserLoginSetting, getUserLoginSetting } from "../../services/APIServices";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dropdown } from "react-native-element-dropdown";

export default class UserLoginSetting extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);

        this.state = {
            onlyWhatsAppLogin: false,
            id: null,
            isLoading: false,

            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }

    componentDidMount() {

        this.GetUserLoginSetting()
        this.focusListner = this.props.navigation.addListener("focus", () => {
            this.GetUserLoginSetting()
        })
    }

    componentWillUnmount() {
        this.focusListner();
    }
    GetUserLoginSetting = () => {
        getUserLoginSetting().then((res) => {
            // console.log('..........res...............', JSON.parse(res[0].value).onlyWhatsAppLogin)
            if(JSON.parse(res[0].value).onlyWhatsAppLogin != null){
                this.setState({
                    onlyWhatsAppLogin: JSON.parse(res[0].value).onlyWhatsAppLogin,
                })
            }
            
        }).catch(err => { })
    }

    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };
    onConfirm = () => {
        this.setState({
            showAlertModal: false
        }, () => this.props.navigation.navigate("Home"));
    };

    submitData = () => {
        const { navigation, route } = this.props;
        this.setState(
            {
                isLoading: true
            },
            () => {

                let obj = {
                    onlyWhatsAppLogin: this.state.onlyWhatsAppLogin,
                };
                addUserLoginSetting(obj)
                    .then((response) => {
                        // console.log('........addUserLoginSetting........', JSON.parse(response.data))
                        if (response) {
                            this.context.setFileSetting(JSON.parse(response.data));
                            this.setState({
                                isLoading: false,
                                // id: response.data.id,
                                showAlertModal: true,
                                alertType: 'Success',
                                alertMessage: response.message
                            })
                        } else {
                            this.setState({
                                isLoading: false,
                                showAlertModal: true,
                                alertType: 'Failed',
                                alertMessage: 'Failed to update file setting'
                            })
                        }

                    })
                    .catch((error) => console.log(error));
            }
        );
    };

    render = () => {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="User Login Setting" />
                {this.state.isLoading && <OverlayLoader />}
                <View style={styles.form}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* <Text style={styles.heading}>{`Hi ${this.state.name} welcome back !`}</Text> */}

                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLable, { width: '50%' }]}>Only WhatsApp Login Available?</Text>
                            <Dropdown
                                value={this.state.onlyWhatsAppLogin}
                                data={[
                                    { id: "0", name: "true" },
                                    { id: "1", name: "false" },
                                ]}
                                onChange={(onlyWhatsAppLogin) => this.setState({ onlyWhatsAppLogin: onlyWhatsAppLogin.name })}
                                style={[styles.textInput,]}
                                //   inputSearchStyle={[styles.inputSearchStyle]}
                                placeholderStyle={{ color: Colors.textColor }}
                                selectedTextStyle={styles.textInput}
                                labelField="name"
                                valueField="id"
                                placeholder={!this.state.onlyWhatsAppLogin ? "Select option " : this.state.onlyWhatsAppLogin}
                            />
                        </View>


                        <TouchableOpacity onPress={this.submitData} style={styles.submitBtn}>
                            <Text style={{ fontSize: 18, color: Colors.white }}>SUBMIT</Text>
                        </TouchableOpacity>

                    </ScrollView>
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
                            this.onConfirm();
                        }}
                    />
                </View>
            </SafeAreaView>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    form: {
        flex: 1,
        padding: 8,
    },
    heading: {
        fontSize: 16,
        color: Colors.textColor,
        fontWeight: "bold",
        marginVertical: 30,
        alignSelf: "center",
    },
    inputContainer: {
        width: "100%",
        marginBottom: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    inputLable: {
        fontSize: 16,
        color: Colors.textColor,
        // marginBottom: 10,
        // opacity: 0.8,
    },
    textInput: {
        borderWidth: 1,
        padding: 9,
        fontSize: 14,
        width: "50%",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
        alignItems: 'center'
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
