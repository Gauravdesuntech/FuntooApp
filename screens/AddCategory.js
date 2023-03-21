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
	SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../config/colors";
import Header from "../components/Header";
import { getFileData } from "../utils/Util";
import { addCategory } from "../services/APIServices";
import OverlayLoader from "../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import Checkbox from "expo-checkbox";
import { Dropdown } from 'react-native-element-dropdown';


export default class AddCategory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categoryName: "",
			status:"",
			imageURI: undefined,
			imageData: undefined,
			categoryNameValidationFailed: false,
			statusValidationFailed: false,
			isLoading: false,

			showAlert: false,
			check: '',
			message: '',

			after_click_open: '',
			after_click_open_subcategory: false,
			after_click_open_tag: false
		};
	}

	handleAfterClickCheckBoxesToggle = (value, type) => {
	
		if(type == 'sub-cats') {
			if(this.state.after_click_open_tag) {
				this.setState({after_click_open_tag: false});
			}
			this.setState({after_click_open_subcategory: value});
		} else if(type == 'tags') {
			if(this.state.after_click_open_subcategory) {
				this.setState({after_click_open_subcategory: false});
			}
			this.setState({after_click_open_tag: value});
		}
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

	chooseIcon = () => {
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				let optins = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [1, 1],
					quality: 1,
				};

				ImagePicker.launchImageLibraryAsync(optins).then((result) => {
					if (!result.cancelled) {
						this.setState({
							imageURI: result.uri,
							imageData: getFileData(result),
						});
					}
				});
			} else {
				Alert.alert("Warning", "Please allow permission to choose an icon");
			}
		});
	};

	gotoBack = () => this.props.navigation.goBack();

	validateData = () => {
		this.setState({categoryNameValidationFailed: false, statusValidationFailed: false});
		if (this.state.categoryName == undefined || this.state.categoryName.length == 0) {
			this.setState({
				categoryNameValidationFailed: true
			})
			return false;
		}
		if (this.state.status == undefined || this.state.status.length == 0) {
			this.setState({
				statusValidationFailed: true
			})
			return false;
		}

		if(this.state.after_click_open_subcategory == false && this.state.after_click_open_tag == false) {
			Alert.alert("Please tick any of one checkbox");
			return false;
		}

		return true;
	}

	submit = () => {
		if(!this.validateData()) {
			return;
		}

		const {imageData, categoryName, status} = this.state;
		this.setState({isLoading: true}, () => {
			let obj = {
				name: categoryName,
				image: imageData,
				status: status,
				after_click_open: (this.state.after_click_open_subcategory == true) ? 'sub-cats' : 'tags'
			};
			addCategory(obj)
			.then((response) => {
				this.setState({
					isLoading: false,
					showAlert: true,
					check: 'Success',
					message: 'Category Added Successfully',
					after_click_open: '',
					after_click_open_subcategory: false,
					after_click_open_tag: false,
					categoryName: '',
					status:'',
					imageURI: undefined,
					imageData: undefined,
				})
			})
			.catch((error) => console.log(error));
		});
	}

	render = () => {
		const { showAlert, isLoading } = this.state;
		if (isLoading) {
			return (
				<OverlayLoader />
			)
		}
		return (
			<SafeAreaView style={styles.container}>
				<Header title="Add Category" />
				<View style={styles.form}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={styles.iconPickerContainer}>
							<Text style={styles.inputLable}>Choose Icon</Text>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.imageContainer}
								onPress={this.chooseIcon}
							>
								{typeof this.state.imageURI !== "undefined" ? (
									<Image
										style={styles.image}
										source={{ uri: this.state.imageURI }}
									/>
								) : (
									<Ionicons name="image" color={Colors.textColor} size={40} />
								)}
							</TouchableOpacity>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Category Name:</Text>
							<TextInput
								value={this.state.categoryName}
								autoCompleteType="off"
								autoCapitalize="words"
								style={[
									styles.textInput,
									this.state.categoryNameValidationFailed ? styles.inputError : null,
								]}
								onChangeText={(categoryName) => this.setState({ categoryName })}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Status:</Text>
							<Dropdown
								value={this.state.status}
								data={[{id:"1", name:"Active"},{id:"0", name:"Inactive"}]}
								onChange={(status)=> this.setState({status:status.id})}
								style={[
									styles.textInput,
									this.state.statusValidationFailed ? styles.inputError : null,
								]}	
								inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}						
								labelField="name"
								valueField="id"
								placeholder={!this.state.status ? 'Select Status' : '...'}
							/>
						</View>

						<View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
							<View>
								<Checkbox value={this.state.after_click_open_subcategory} onValueChange={(v) => this.handleAfterClickCheckBoxesToggle(v, 'sub-cats') } />
							</View>
							<View style={{ justifyContent: 'center', marginLeft: 8 }}>
								<Text style={styles.inputLable}>After click open sub-category</Text>
							</View>
						</View>

						<View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
							<View>
								<Checkbox value={this.state.after_click_open_tag} onValueChange={(v) => this.handleAfterClickCheckBoxesToggle(v, 'tags') } />
							</View>
							<View style={{ justifyContent: 'center', marginLeft: 8 }}>
								<Text style={styles.inputLable}>After click open tags</Text>
							</View>
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
		padding: 9,
		fontSize: 14,
		width: "100%",
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
