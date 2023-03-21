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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from "expo-image-picker";
import Colors from "../config/colors";
import { Header} from "../components";
import { getFileData } from "../utils/Util";
import { getCategory, addSubCategory } from "../services/APIServices";
import OverlayLoader from "../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';

export default class AddSubCategory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imageURI: undefined,
			imageData: undefined,
			categoryID: this.props.route.params.cat.id,
			categoryName: this.props.route.params.cat.name,
			subCategoryName: "",
			subCategoryNameValidationFailed: false,
			categories: [
				{ id: "1", name: "Carnival Games" },
				{ id: "2", name: "Inflatables" },
				{ id: "3", name: "Fun Activities" },
				{ id: "4", name: "Carnival Canopies" },
				{ id: "5", name: "Fun Foods" },
				{ id: "6", name: "Mascot" },
			],
			showAlert: false,
			check: '',
			message: '',
		};
	}

	componentDidMount(){
		this.getParentCategory();
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

	getParentCategory = () => {
		this.setState({
			isLoading: true
		},()=>{
			getCategory()
				.then((response)=>{
					this.setState({
						isLoading: false,
						categories: response.data
					})
				})
				.catch((error)=>{console.log(error)})
		})
	}

	chooseIcon = () => {
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				this.setState({
					imageURI: undefined,
					imageData: undefined,
				});

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

	setCategory = (v) => {
		this.setState({
			categoryID: v.id,
			categoryName: v.name,
		});
	};

	submit = () => {
		const {imageData, subCategoryNameValidationFailed, subCategoryName, categoryID} = this.state;
		if(subCategoryName == undefined || subCategoryName.length == 0){
			this.setState({
				subCategoryNameValidationFailed: true
			})
			return;
		}
		this.setState({
			isLoading: true
		},()=>{
			let obj = {
				name: subCategoryName, 
				image: imageData,
				parentId: categoryID
			 };
			 addSubCategory(obj)
						.then((response) => {
							this.setState({
								showAlert: true,
								check: 'Success',
								message: 'Sub Category Added Successfully',
								isLoading: false,
								subCategoryNameValidationFailed: false,
								imageURI: undefined,
								imageData: undefined,
								categoryID: undefined,
								categoryName: undefined,
								subCategoryName: "",
							})
						})
						.catch((error) => console.log(error));
		})
	}

	gotoBack = () => this.props.navigation.goBack();

	render = () => {
		const {showAlert,isLoading} = this.state;
		if(isLoading){
			return (
				<OverlayLoader />
			)
		}
		return(
		<SafeAreaView style={styles.container}>
			<Header title="Add Sub Category" />
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
						<Text style={styles.inputLable}>Category:</Text>
						<Dropdown
							value={this.state.categoryName}
							data={this.state.categories}
							style={styles.textInput}
							
							inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
							search
							labelField="name"
							valueField="name"
							placeholder={!this.state.categoryName ? 'Select Category Name' : '...'}
							searchPlaceholder="Search..."
							onChange={this.setCategory}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Sub Category Name:</Text>
						<TextInput
							value={this.state.subCategoryName}
							autoCompleteType="off"
							autoCapitalize="words"
							style={[
								styles.textInput,
								this.state.subCategoryNameValidationFailed ? styles.inputError : null,
							]}
							onChangeText={(subCategoryName) =>
								this.setState({ subCategoryName })
							}
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
borderWidth:1,
		borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		color: Colors.textColor,
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
