import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	ScrollView,
	TouchableOpacity,
	Alert,
	SafeAreaView,
} from "react-native";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import { isEmail } from "../../utils/Util";
import AppContext from "../../context/AppContext";
import { UserChangePassword } from "../../services/UserApiService";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';

export default class UserChangePasswordScreen extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			old_password: "",
			password: "",
			confirm_password: "",
			isLoading: false,
			showAlertModal: false,
			alertMessage: "",
			alertType: '',
		};
	}

	componentDidMount() {
	}


	hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
	};

	ChangePassword = () => {
		let model = {
			id: this.context.userData.id,
			old_password: this.state.old_password,
			password: this.state.password,
			confirm_password: this.state.confirm_password
		};
		this.setState({
			isLoading: true
		});
		UserChangePassword(model).then(res => {
			this.setState({
				isLoading: false
			});
			if (res.is_success) {
				this.setState({
					showAlertModal: true,
					alertType: "Success",
					alertMessage: res.message
				});
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

	render = () => {

		return (
			<SafeAreaView style={styles.container}>
				<Header title="Change Password" />
				{this.state.isLoading && <OverlayLoader />}

				<View style={styles.form}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<Text style={styles.heading}>Change Password</Text>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Old Password:</Text>
							<TextInput
								value={this.state.old_password}
								autoCompleteType="off"
								autoCapitalize="words"
								style={styles.textInput}
								secureTextEntry={true}
								onChangeText={(old_password) => this.setState({ old_password })}
							/>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>New Password:</Text>
							<TextInput
								value={this.state.password}
								autoCompleteType="off"
								autoCapitalize="none"
								style={styles.textInput}
								secureTextEntry={true}
								onChangeText={(password) => this.setState({ password })}
							/>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Confirm Password:</Text>
							<TextInput
								value={this.state.confirm_password}
								autoCompleteType="off"
								autoCapitalize="characters"
								style={styles.textInput}
								secureTextEntry={true}
								onChangeText={(confirm_password) => this.setState({ confirm_password })}
							/>
						</View>

						<TouchableOpacity onPress={this.ChangePassword} style={styles.submitBtn}>
							<Text style={{ fontSize: 18, color: Colors.white }}>Change</Text>
						</TouchableOpacity>

					</ScrollView>
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
		backgroundColor: Colors.white,
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
