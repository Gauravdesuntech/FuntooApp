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
import {addFileSetting } from "../../services/APIServices";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dropdown } from "react-native-element-dropdown";

export default class FileSetting extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);

        this.state = {
            google_location: "",
            image_height: "",
            image_width: "",
            image_size: "",
            video_size: "",
            id: null,
            isLoading: false,

            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }

    componentDidMount() {
        this.setState({
            google_location: this.context.fileSetting.google_location,
            image_height: this.context.fileSetting.image_height,
            image_width: this.context.fileSetting.image_width,
            image_size: this.context.fileSetting.image_size,
            video_size: this.context.fileSetting.video_size,
        })
    }



    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };
    onConfirm = () => {
        this.setState({
            showAlertModal: false
        },()=>this.props.navigation.navigate("Home"));
    };

    submitData = () => {
        const { navigation, route } = this.props;
        this.setState(
            {
                isLoading: true
            },
            () => {

                let obj = {
                    google_location: this.state.google_location,
                    image_height: this.state.image_height,
                    image_width: this.state.image_width,
                    image_size: this.state.image_size,
                    video_size: this.state.video_size,
                };
                addFileSetting(obj)
                    .then((response) => {
                        // console.log('........addFileSetting........', JSON.parse(response.data))
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
            <Header title="File Setting" />
            {this.state.isLoading && <OverlayLoader />}
            <View style={styles.form}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* <Text style={styles.heading}>{`Hi ${this.state.name} welcome back !`}</Text> */}

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLable}>Required Google location?</Text>
                        {/* <TextInput
							value={this.state.google_location}
							autoCompleteType="off"
							autoCapitalize="words"
							style={styles.textInput}
							onChangeText={(google_location) => this.setState({ google_location })}
						/> */}
                        <Dropdown
                            value={this.state.google_location}
                            data={[
                                { id: "0", name: "true" },
                                { id: "1", name: "false" },
                            ]}
                            onChange={(google_location) => this.setState({ google_location: google_location.name })}
                            style={[styles.textInput,]}
                            //   inputSearchStyle={[styles.inputSearchStyle]}
                            placeholderStyle={{ color: Colors.textColor }}
                            selectedTextStyle={styles.textInput}
                            labelField="name"
                            valueField="id"
                            placeholder={!this.state.google_location ? "Select option " : this.state.google_location}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLable}>Image height :</Text>
                        <TextInput
                            value={this.state.image_height}
                            autoCompleteType="off"
                            autoCapitalize="none"
                            keyboardType="number-pad"
                            style={styles.textInput}
                            onChangeText={(image_height) => this.setState({ image_height })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLable}>Image width :</Text>
                        <TextInput
                            value={this.state.image_width}
                            autoCompleteType="off"
                            autoCapitalize="none"
                            keyboardType="number-pad"
                            style={styles.textInput}
                            onChangeText={(image_width) => this.setState({ image_width })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLable}>Image size (kb):</Text>
                        <TextInput
                            value={this.state.image_size}
                            autoCompleteType="off"
                            autoCapitalize="nonr"
                            keyboardType="number-pad"
                            style={styles.textInput}
                            onChangeText={(image_size) => this.setState({ image_size })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLable}>Video size (mb):</Text>
                        <TextInput
                            value={this.state.video_size}
                            autoCompleteType="off"
                            autoCapitalize="nonr"
                            keyboardType="number-pad"
                            style={styles.textInput}
                            onChangeText={(video_size) => this.setState({ video_size })}
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
