import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	Dimensions,
	SafeAreaView,
} from "react-native";
import Constants from "expo-constants";
import Colors from "../config/colors";
import { isEmail } from "../utils/Util";
import AppContext from "../context/AppContext";
import { writeUserData } from "../utils/Util";
import { update_admin_details } from "../services/APIServices";
import OverlayLoader from "../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';

export default class UpdateAccount extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			name: "",
			email: "",
			mobile:"",
			nameValidationFailed: false,
			emailValidationFailed: false,
			isLoading: false,
			showAlert: false,
			check: '',
			message: '',
			cust_code: null,
			id: null,
		};
	}

	componentDidMount(){
		this.setState({
			name: this.context.userData.name,
			email: this.context.userData.email,
			cust_code: this.context.userData.cust_code,
			id: this.context.userData.id,
			mobile: this.context.userData.phone
		});
	}

	showAlert = () => {
		this.setState({
		  showAlert: true
		});
	  };

	  hideAlert = () => {
		this.setState({
		  showAlert: false
		});
	  };

	  navigate = () => {
		const { navigation }=this.props;
		navigation.navigate("Home",
		{
			cust_code: this.state.cust_code,
			id: this.state.id
		});
	  }

	submitData = () => {
		const { route }=this.props;

		this.setState(
			{
				nameValidationFailed: false,
				emailValidationFailed: false,
				cust_code:this.state.cust_code,
			},
			() => {
				let { name, email, mobile } = this.state;
				if (name.trim().length === 0) {
					this.setState({ nameValidationFailed: true });
					return false;
				} else if (email.trim().length === 0 || !isEmail(email)) {
					this.setState({ emailValidationFailed: true });
					return false;
				} else {
					let obj = {
						name: name, 
						email: email,
						mobile: mobile,
					 };
					 update_admin_details(obj)
						.then((response) => {
							if(response.check == 'success'){
								writeUserData(response.data);
								this.context.setUserData(response.data);
								this.setState({
									isLoading:false,
									id: response.data.id,
									showAlert: true,
									check: 'Success',
									message: 'Profile Updated Successfully'
								})
							}else{
								this.setState({
									isLoading:false,
									showAlert: true,
									check: 'Failed',
									message: 'Failed to update profile'
								})
							}
						})
						.catch((error) => console.log(error));
				}
			}
		);
	};

	render = () => {
		const {showAlert, isLoading} = this.state;
		if(isLoading){
			return (
				<OverlayLoader />
			)
		}
		return (
			<>
			<SafeAreaView style={styles.container}>
				<View style={styles.titleContainer}>
					<Text style={styles.tiltleText}>
						Please update your contact details
					</Text>
				</View>
				<View style={styles.inputContainer}>
					<Text style={styles.inputLable}>Name:</Text>
					<TextInput
						value={this.state.name}
						placeholder="Enter Your Name"
						autoCompleteType="off"
						autoCapitalize="words"
						style={[
							styles.textInput,
							this.state.nameValidationFailed ? styles.inputError : null,
						]}
						onChangeText={(name) => this.setState({ name })}
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.inputLable}>Email ID:</Text>
					<TextInput
						value={this.state.email}
						placeholder="Enter Your Email"
						autoCompleteType="off"
						autoCapitalize="none"
						keyboardType="email-address"
						style={[
							styles.textInput,
							this.state.emailValidationFailed ? styles.inputError : null,
						]}
						onChangeText={(email) => this.setState({ email })}
					/>
				</View>

				<TouchableOpacity
					activeOpacity={0.7}
					style={[styles.button, { elevation: 1 }]}
					onPress={this.submitData}
				>
					<Text style={styles.buttonText}>SUBMIT</Text>
				</TouchableOpacity>
			</SafeAreaView>
			<AwesomeAlert
				show={showAlert}
				showProgress={false}
				title={this.state.check}
				message={this.state.message}
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
		);
	};
}

const windowheight = Dimensions.get("screen").height;
const windowwidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	container: {
		height: windowheight,
		backgroundColor: Colors.white,
		paddingHorizontal: 15,
		paddingTop: Constants.statusBarHeight,
	},
	titleContainer: {
		flex: 0.3,
		alignItems: "center",
		justifyContent: "center",
		// borderWidth: 1,
	},
	tiltleText: {
		fontSize: 18,
		fontWeight: "bold",
		color: Colors.textColor,
		letterSpacing: 0.5,
		// opacity: 0.9,
	},
	subText: {
		fontSize: 12,
		color: Colors.textColor,
		marginBottom: 10,
	},
	inputContainer: {
		width: "100%",
		marginBottom: 30,
	},
	inputLable: {
		fontSize: 16,
		color: Colors.textColor,
		marginBottom: 10,
		// opacity: 0.8,
	},
	textInput: {
borderWidth:1,
		padding: 9,
		fontSize: 14,
		width: "100%",
		borderWidth: 1,
		borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
	},
	button: {
		width: "100%",
		marginTop: 10,
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
