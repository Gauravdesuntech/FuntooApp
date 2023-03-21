import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	Image,
	SafeAreaView,
	ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import { getFileData } from "../../utils/Util";
import { AddStorageArea } from "../../services/StorageAreaApiService";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';

export default class AddStorageMaster extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			areaName: "",
			areaNameValidationFailedValidationFailed: false,
			isLoading: false,
			showAlert: false,
			loader: false,
			check: '',
			message: '',
		};
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
		this.props.navigation.goBack()
	  };


	gotoBack = () => this.props.navigation.goBack();


	submit = () => {
		const {areaName, areaNameValidationFailedValidationFailed} = this.state;
		if(areaName == undefined || areaName.length == 0){
			this.setState({
				areaNameValidationFailedValidationFailed: true
			})
			return;
		}
		this.setState({
			isLoading: true,
			loader: true
		},()=>{
			let obj = {
				name: areaName, 
			 };
			 AddStorageArea(obj)
						.then((response) => {
                            console.log(response)
							this.setState({
								isLoading: false,
								showAlert: true,
								loader: false,
								check: 'Success',
								message: 'Area Added Successfully',
								areaName: '',
							})
						})
			.catch((error) => this.setState({ loader: false }));
		})
	}

	render = () => {
		const {showAlert, isLoading} = this.state;
		// if(isLoading){
		// 	return (
		// 		<OverlayLoader />
		// 	)
		// }
		return(
		<SafeAreaView style={styles.container}>
			<Header title="Add Storage Area" />
			<View style={styles.form}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Area Name:</Text>
						<TextInput
							value={this.state.areaName}
							autoCompleteType="off"
							autoCapitalize="words"
							style={[
								styles.textInput,
								this.state.areaNameValidationFailedValidationFailed ? styles.inputError : null,
							]}
							onChangeText={(areaName) => this.setState({ areaName })}
						/>
					</View>

					<TouchableOpacity style={styles.submitBtn} onPress={!this.state.loader ? this.submit : ()=>{}}>
						{this.state.loader ? (
							<ActivityIndicator color={'#fff'} />
						) : (<Text style={{ fontSize: 18, color: Colors.white }}>SUBMIT</Text>)}
					</TouchableOpacity>
				</ScrollView>
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
		height: 50,
		width: "100%",
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
	},
	inputError: {
		borderWidth: 1,
		borderColor: Colors.danger,
	}
});
