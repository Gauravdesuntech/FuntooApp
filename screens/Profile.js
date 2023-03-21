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
import Colors from "../config/colors";
import Header from "../components/Header";
import { isEmail } from "../utils/Util";
import AppContext from "../context/AppContext";
import { writeUserData } from "../utils/Util";
import { update_admin_details } from "../services/APIServices";
import OverlayLoader from "../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';

export default class Profile extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			email: "",
			mobile: "",
			address: "",
			id: null,
			isLoading: false,

			showAlertModal: false,
			alertMessage: "",
			alertType: '',
		};
	}

	componentDidMount(){
		this.setState({
			name: this.context.userData.name,
			email: this.context.userData.email,
			mobile: this.context.userData.phone,
		})
	}



	  hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
	  };

	submitData = () => {
		const {navigation,route}=this.props;
		this.setState(
			{
				nameValidationFailed: false,
				emailValidationFailed: false,
				isLoading: true
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
									showAlertModal: true,
									alertType: 'Success',
									alertMessage: 'Profile Updated Successfully'
								})
								
								// navigation.navigate("Home",
								// {
								// 	cust_code: response.data.cust_code,
								// 	id: response.data.id
								// });
							}else{
								this.setState({
									isLoading:false,
									showAlertModal: true,
									alertType: 'Failed',
									alertMessage: 'Failed to update profile'
								})
							}
							
						})
						.catch((error) => console.log(error));
				}
			}
		);
	};

	sendmai=()=>{
		
	}

	render = () => {
		return(
		<SafeAreaView style={styles.container}>
			<Header title="My Account" />
			{this.state.isLoading && <OverlayLoader />}
			<View style={styles.form}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Text style={styles.heading}>{`Hi ${this.state.name} welcome back !`}</Text>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Name:</Text>
						<TextInput
							value={this.state.name}
							autoCompleteType="off"
							autoCapitalize="words"
							style={styles.textInput}
							onChangeText={(name) => this.setState({ name })}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Email ID:</Text>
						<TextInput
							value={this.state.email}
							autoCompleteType="off"
							autoCapitalize="none"
							keyboardType="email-address"
							style={styles.textInput}
							onChangeText={(email) => this.setState({ email })}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Mobile:</Text>
						<TextInput
							value={this.state.mobile}
							autoCompleteType="off"
							autoCapitalize="characters"
							style={styles.textInput}
							onChangeText={(mobile) => this.setState({ mobile })}
						/>
					</View>

					<TouchableOpacity onPress={this.submitData} style={styles.submitBtn}>
						<Text style={{ fontSize: 18, color: Colors.white }}>SUBMIT</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.sendmail} style={styles.submitBtn}>
						<Text style={{ fontSize: 18, color: Colors.white }}>Send Mail</Text>
					</TouchableOpacity>

					<TouchableOpacity style={{alignItems:'flex-end',marginTop:10}}
					onPress={()=>this.props.navigation.navigate("UserChangePassword")}>
						<Text style={{ fontSize: 16, color: Colors.primary }}>Change Password</Text>
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
						this.hideAlert();
					}}
				/>
			</View>
		</SafeAreaView>
	)};
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
