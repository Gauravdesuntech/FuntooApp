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
	Modal,
	Dimensions,
	SafeAreaView
} from "react-native";
import { Ionicons ,MaterialIcons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../config/colors";
import { Header } from "../components";
import { Dropdown } from 'react-native-element-dropdown';
import { getFileData } from "../utils/Util";
import { getCategory, editSubCategory } from "../services/APIServices";
import OverlayLoader from "../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import Configs from "../config/Configs";
import ProgressiveImage from "../components/ProgressiveImage";
import { DeleteCategoryTag, CategoryTagList } from "../services/CategoryService";


export default class EditSubCategory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imageURI: Configs.CATEGORY_IMAGE_URL + this.props.route.params.sub_cat.image,
			imageData: undefined,
			categoryID: this.props.route.params.cat.id,
			categoryName: this.props.route.params.cat.name,
			subCategoryName: this.props.route.params.sub_cat.name,
			subCategoryID: this.props.route.params.sub_cat.id,
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
			isModalOpen: false,

			tags: [],
		};
	}

	componentDidMount() {
		this.getParentCategory();

		this.focusListner = this.props.navigation.addListener("focus", () => { this.CategoryTagList() })
	}
	componentWillUnmount() {
		this.focusListner();
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

	getParentCategory = () => {
		this.setState({
			isLoading: true
		}, () => {
			getCategory()
				.then((response) => {
					this.setState({
						isLoading: false,
						categories: response.data
					})
				})
				.catch((error) => { console.log(error) })
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
		const { imageData, subCategoryNameValidationFailed, subCategoryName, categoryID, subCategoryID } = this.state;
		if (subCategoryName == undefined || subCategoryName.length == 0) {
			this.setState({
				subCategoryNameValidationFailed: true
			})
			return;
		}
		this.setState({
			isLoading: true
		}, () => {
			let obj = {
				name: subCategoryName,
				image: imageData,
				parentId: categoryID,
				id: subCategoryID
			};
			editSubCategory(obj)
				.then((response) => {
					this.setState({
						showAlert: true,
						check: response.type,
						message: response.msg,
						isLoading: false,
						subCategoryNameValidationFailed: false,
					})
				})
				.catch((error) => console.log(error));
		})
	}

	gotoBack = () => this.props.navigation.goBack();


	toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });




	DeleteCategoryTag = (id) => {
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to remove this tag?",
			[
				{
					text: "Yes",
					onPress: () => {
						DeleteCategoryTag({ id: id }).then(res => {

							console.log(res);
							if (res.is_success) {
								this.CategoryTagList();
							}

						}).catch((error) => {
							Alert.alert("Server Error", error.message);
						})
					},
				},
				{
					text: "No",
				},
			]
		);
	}


	CategoryTagList() {
		this.setState({
			isLoading: true
		});

		CategoryTagList(this.state.subCategoryID, "sub_cat").then(res => {
			this.setState({
				isLoading: false,
				tags: res.data,
				refreshing: false,
			});

			//console.log(res)

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}


	gotoCategoryAddTag = () => {
		let data = {
			cat_id: this.state.subCategoryID,
			tag_for: "sub_cat"
		};
		this.props.navigation.navigate("CategoryTagAddScreen", { data: data });
	};

	render = () => {
		const { showAlert, isLoading } = this.state;
		if (isLoading) {
			return (
				<OverlayLoader />
			)
		}
		return (
			<SafeAreaView style={styles.container}>
				<Header title="Edit Sub Category" addAction={this.gotoCategoryAddTag} />
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
									<ProgressiveImage
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



						<View>
							<Text style={styles.inputLable}>Tags:</Text>
							{this.state.tags?.map(row => {
								return (
									<View key={row.id.toString()} style={styles.card}>
										<View style={{ paddingLeft: 10 }}>
											<Text style={styles.subText}>{row.tag_name}</Text>
										</View>
										<View>
											<TouchableOpacity style={{ padding: 3 }}>
												<MaterialIcons name="delete" size={22} color={Colors.danger} onPress={this.DeleteCategoryTag.bind(this, row.id)} />
											</TouchableOpacity>
										</View>
									</View>
								)
							})}
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


const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

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
		color:Colors.textColor,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
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
	},


	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalBody: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.white,
		width: windowWidth - 30,
		minHeight: Math.floor(windowHeight / 4),
		padding: 15,
		borderRadius: 5,
		elevation: 8,
	},
	closeButton: {
		position: "absolute",
		zIndex: 11,
		top: 5,
		right: 5,
		backgroundColor: "#ddd",
		width: 25,
		height: 25,
		borderRadius: 40 / 2,
		alignItems: "center",
		justifyContent: "center",
		elevation: 0,
	},
	closeButtonText: {
		color: Colors.textColor,
		fontSize: 22,
	},
	modalBtn: {
		flexDirection: "row",
		width: 200,
		height: 35,
		marginBottom: 20,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
		borderColor: Colors.primary,
		borderRadius: 5,
	},
	modalBtnText: {
		fontSize: 16,
		color: Colors.white,
	},



	card: {
		flexDirection: "row",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderBottomWidth: 1,
		justifyContent: 'space-between',
		borderColor: Colors.textInputBorder,
		marginBottom: 10
	},

	subText: {
		fontSize: 13,
		color: Colors.textColor,
		// opacity: 0.9,
		marginBottom: 2,
	},
});
