import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
} from "react-native";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import { Updatetag } from "../../services/TagApiServices";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';

export default class EditStorageMaster extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tagName: this.props.route.params.tag_name,
			tagNameValidationFailed: false,
			isLoading: false,
			showAlert: false,
			check: '',
			message: '',
            tag_id: this.props.route.params.tag_id
		};
	}

    componentDidMount(){
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
        this.gotoBack();
	  };


	gotoBack = () => this.props.navigation.goBack();


	submit = () => {
		const {tagName, tagNameValidationFailed} = this.state;
		if(tagName == undefined || tagName.length == 0){
			this.setState({
				tagNameValidationFailed: true
			})
			return;
		}
		this.setState({
			isLoading: true
		},()=>{
			let obj = {
				name: tagName, 
                id: this.state.tag_id
			 };
             let type = "Success";
             let msg = "Tag updated successfully";
			 Updatetag(obj)
						.then((response) => {
                            console.log(response)
                            if(!response.is_success){
                                 type = "Error";
                                 msg  = "Failed to process";
                            }
							this.setState({
								isLoading: false,
								showAlert: true,
								check: type,
								message: msg,
							})
						})
						.catch((error) => console.log("error",error));
		})
	}

	render = () => {
		const {showAlert, isLoading} = this.state;
		if(isLoading){
			return (
				<OverlayLoader />
			)
		}
		return(
		<SafeAreaView style={styles.container}>
			<Header title="Edit tag" />
			<View style={styles.form}>
				<ScrollView showsVerticalScrollIndicator={false}>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Tag Name:</Text>
						<TextInput
							value={this.state.tagName}
							autoCompleteType="off"
							autoCapitalize="words"
							style={[
								styles.textInput,
								this.state.tagNameValidationFailed ? styles.inputError : null,
							]}
							onChangeText={(tagName) => this.setState({ tagName })}
						/>
					</View>

					<TouchableOpacity style={styles.submitBtn} onPress={this.submit}>
						<Text style={{ fontSize: 18, color: Colors.white }}>SUBMIT</Text>
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
