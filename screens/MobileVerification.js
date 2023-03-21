import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	Image,
	TouchableOpacity,
	SafeAreaView
} from "react-native";
import Constants from "expo-constants";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import { isMobile } from "../utils/Util";
import firebase from "../config/firebase";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import OverlayLoader from "../components/OverlayLoader";
import ProgressiveImage from "../components/ProgressiveImage";

import AwesomeAlert from 'react-native-awesome-alerts';

import { FindUser } from "../services/UserApiService";


export default class MobileVerification extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			phoneNumber: "",
			phoneNumberValidationFailed: false,
			showLoader: false,

			showAlertModal: false,
			alertMessage: "",
			alertType: '',
		};
		this.recapthaVerifier = React.createRef();
	}

	onChangePhone = (number) =>
		this.setState({
			phoneNumber: number,
		});


		FindUser = () => {
			let model = { phone: this.state.phoneNumber };
			this.setState({
				isLoading: true
			});
			FindUser(model).then(res => {
				this.setState({
					isLoading: false
				});
				if (res.is_success) {
					// this.setState({
					// 	showAlertModal: true,
					// 	alertType: "Success",
					// 	alertMessage: res.message
					// });
					this.sendOpt();
				} else {
					this.setState({
						showAlertModal: true,
						alertType: "Error",
						alertMessage: res.message
					})
				}
	
			}).catch((error) => {
				Alert.alert("Server Error", error.message);
			})
		}

	sendOpt = () => {
		this.setState(
			{
				phoneNumberValidationFailed: false,
			},
			() => {
				let { phoneNumber } = this.state;
				if (isMobile(phoneNumber)) {
					this.setState({ showLoader: true });
					const phoneProvider = new firebase.auth.PhoneAuthProvider();
					phoneProvider
						.verifyPhoneNumber(
							Configs.PHONE_NUMBER_COUNTRY_CODE + phoneNumber,
							this.recapthaVerifier.current

						)
						.then((token) => {
							this.setState(
								{
									showLoader: false,
								},
								() => {
									this.props.navigation.navigate("OtpVerification", {
										phoneNumber: this.state.phoneNumber,
										verification_token: token,

									})
								}
							);

						})
						.catch((error) => console.log(error));

				} else {
					this.setState({ phoneNumberValidationFailed: true });
					return false;
				}
			}
		);
	};

	hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
	};

	render = () => {
		return (
			<SafeAreaView style={styles.container}>
				<FirebaseRecaptchaVerifierModal
					ref={this.recapthaVerifier}
					firebaseConfig={firebase.app().options}
					attemptInvisibleVerification={true}
				/>
				<View style={styles.logoContainer}>
					<ProgressiveImage
						source={require("../assets/logo.png")}
						resizeMode={"cover"}
						style={styles.logoImg}
					/>
				</View>

				<View style={{ marginTop: 20 }}>
					<Text style={styles.tiltleText}>What is your phone number?</Text>
					<Text style={styles.subText}>
						We'll text a code to verify your number
					</Text>
				</View>
				<View
					style={[
						styles.inputContainer,
						this.state.phoneNumberValidationFailed ? styles.inputError : null,
					]}
				>
					<Image
						source={require("../assets/indian-flag.jpg")}
						style={styles.flagImageStyle}
					/>
					<Text style={{ fontSize: 17 }}>
						{Configs.PHONE_NUMBER_COUNTRY_CODE}
					</Text>

					<TextInput
						placeholder="Phone Number"
						keyboardType="numeric"
						autoCompleteType="off"
						maxLength={10}
						style={styles.textInput}
						value={this.state.phoneNumber}
						onChangeText={this.onChangePhone}
					/>
				</View>
				<TouchableOpacity
					activeOpacity={0.7}
					style={[styles.button, { elevation: 1 }]}
					onPress={this.FindUser}
				>
					<Text style={styles.buttonText}>CONTINUE</Text>
				</TouchableOpacity>
				<OverlayLoader visible={this.state.showLoader} />

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
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
		paddingTop: Constants.statusBarHeight,
		paddingHorizontal: 15,
	},
	logoContainer: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 30,
	},
	logoImg: {
		height: 150,
		width: 150,
	},
	tiltleText: {
		fontSize: 18,
		fontWeight: "bold",
		color: Colors.textColor,
		marginBottom: 8,
	},
	subText: {
		fontSize: 12,
		color: Colors.textColor,
		marginBottom: 10,
	},
	inputContainer: {
		overflow: "hidden",
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 5,
		paddingHorizontal: 5,
		borderWidth: 1,
		borderColor: "#e5e5e5",
		marginVertical: 10,
		paddingVertical: 5,
		width: "100%",
	},
	flagImageStyle: {
		marginHorizontal: 5,
		height: 25,
		width: 25,
		resizeMode: "cover",
		alignItems: "center",
	},
	textInput: {
borderWidth:1,
		borderLeftWidth: 1,
		borderColor: Colors.textInputBorder,
		marginLeft: 10,
		paddingVertical: 5,
		paddingHorizontal: 10,
		fontSize: 17,
		width: "78%",
	},
	button: {
		marginTop: 30,
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: Colors.primary,
		borderRadius: 5,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	buttonText: {
		fontSize: 18,
		textAlign: "center",
		color: Colors.white,
	},
	inputError: {
		borderWidth: 1,
		borderColor: Colors.danger,
	},
});
