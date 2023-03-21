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
import {add_PaymentTerm, edit_PaymentTerm } from "../../services/APIServices";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dropdown } from "react-native-element-dropdown";

export default class AddPaymentTerm extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);

        this.state = {
            payment_name: "",
            no_of_hours: "",
            amount: "",
            beyond_no_of_hours: "",
            id: null,
            isLoading: false,

            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            editedState:this.props.route.params.editedState,
        };
    }

    componentDidMount() {
        if(this.props.route.params.editedState == 1){
        this.setState({
            payment_name: this.props.route.params.data.payment_name,
            no_of_hours: this.props.route.params.data.no_of_hours,
            amount: this.props.route.params.data.amount,
            beyond_no_of_hours: this.props.route.params.data.amount_beyond_hours,
        })
    }
    }



    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };
    onConfirm = () => {
        this.setState({
            showAlertModal: false
        },()=>this.props.navigation.navigate("PaymentTerm"));
    };

    AddsubmitData = () => {
        const { navigation, route } = this.props;
        this.setState(
            {
                isLoading: true
            },
            () => {

                let obj = {
                    payment_name: this.state.payment_name,
                    no_of_hours: this.state.no_of_hours,
                    amount: this.state.amount,
                    beyond_no_of_hours: this.state.beyond_no_of_hours,
                };
                add_PaymentTerm(obj)
                    .then((response) => {
                        // console.log('........addPaymentTerm........', response)
                        if (response) {
                            this.setState({
                                isLoading: false,
                                showAlertModal: true,
                                alertType: 'Success',
                                alertMessage: response.message
                            })
                        } else {
                            this.setState({
                                isLoading: false,
                                showAlertModal: true,
                                alertType: 'Failed',
                                alertMessage: 'Failed to add Payment Term'
                            })
                        }

                    })
                    .catch((error) => console.log(error));
            }
		);
};
  EditsubmitData = () => {
        const { navigation, route } = this.props;
        this.setState(
            {
                isLoading: true
            },
            () => {

                let obj = {
                    id:this.props.route.params.data.id,
                    payment_name: this.state.payment_name,
                    no_of_hours: this.state.no_of_hours,
                    amount: this.state.amount,
                    beyond_no_of_hours: this.state.beyond_no_of_hours,
                };
                edit_PaymentTerm(obj)
                    .then((response) => {
                        // console.log('........addPaymentTerm........', response)
                        if (response) {
                            this.setState({
                                isLoading: false,
                                showAlertModal: true,
                                alertType: 'Success',
                                alertMessage: response.message
                            })
                        } else {
                            this.setState({
                                isLoading: false,
                                showAlertModal: true,
                                alertType: 'Failed',
                                alertMessage: 'Failed to add Payment Term'
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
            <Header title= {this.state.editedState == 0 ?" Add Payment Term" : " Edit Payment Term"}/>
            {this.state.isLoading && <OverlayLoader />}
            <View style={styles.form}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLable}>Payment name :</Text>
                        <TextInput
                            value={this.state.payment_name}
                            autoCompleteType="off"
                            autoCapitalize="none"
                            style={styles.textInput}
                            onChangeText={(payment_name) => this.setState({ payment_name })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLable}>no of hours :</Text>
                        <TextInput
                            value={this.state.no_of_hours}
                            autoCompleteType="off"
                            autoCapitalize="none"
                            keyboardType="number-pad"
                            style={styles.textInput}
                            onChangeText={(no_of_hours) => this.setState({ no_of_hours })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLable}>amount :</Text>
                        <TextInput
                            value={this.state.amount}
                            autoCompleteType="off"
                            autoCapitalize="nonr"
                            keyboardType="number-pad"
                            style={styles.textInput}
                            onChangeText={(amount) => this.setState({ amount })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLable}>amount beyond no of hours :</Text>
                        <TextInput
                            value={this.state.beyond_no_of_hours}
                            autoCompleteType="off"
                            autoCapitalize="nonr"
                            keyboardType="number-pad"
                            style={styles.textInput}
                            onChangeText={(beyond_no_of_hours) => this.setState({ beyond_no_of_hours })}
                        />
                    </View>

                    <TouchableOpacity onPress={this.state.editedState == 0 ? this.AddsubmitData : this.EditsubmitData} style={styles.submitBtn}>
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
        width: "50%",
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
