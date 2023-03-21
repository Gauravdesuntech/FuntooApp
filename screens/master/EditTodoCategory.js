import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	Dimensions,
	SafeAreaView
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import { getFileData } from "../../utils/Util";
import { editCategory, getCategory } from "../../services/APIServices";
import { DeleteCategoryTag, CategoryTagList } from "../../services/CategoryService";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import Configs from "../../config/Configs";
import ProgressiveImage from "../../components/ProgressiveImage";
import Checkbox from 'expo-checkbox';
import { Dropdown } from 'react-native-element-dropdown';



export default class EditTodoCategory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categoryName: "",
			status:"",
			imageURI: undefined,
			imageData: undefined,
			categoryNameValidationFailed: false,
			isLoading: false,
			showAlert: false,
			check: '',
			message: '',
			cat_id: this.props.route.params.category_id,
			is_tag_open: false,
			isModalOpen: false,

			tags: [],

			after_click_open: '',
			after_click_open_subcategory: false,
			after_click_open_tag: false
		};
	}

	checkIfSetOpenSubcategoryOrTag(data) {
		if(data != null) {
			if(data == 'tags') {
				this.setState({after_click_open_tag: true});
			} else if(data == 'sub-cats') {
				this.setState({after_click_open_subcategory: true});
			}
		}
	}

	componentDidMount() {
		this.focusListner = this.props.navigation.addListener("focus", () => { this.initData() })
	}
	componentWillUnmount() {
		this.focusListner();
	  }

	initData() {
		this.setState({ isLoading: true });
		Promise.all([getCategory(this.state.cat_id), CategoryTagList(this.state.cat_id, "cat")]).then( (result) => {
			let catData = result[0];
			// console.log("Category Data>>>>>>>",result)
			this.setState({
				isLoading: false,
				imageURI: Configs.CATEGORY_IMAGE_URL + catData.data[0].image,
				categoryName: catData.data[0].name,
				status: catData.data[0].status
			});
			this.checkIfSetOpenSubcategoryOrTag(catData.data[0].after_click_open);
		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		});
	}

	toggleModal = () => this.setState({ isModalOpen: !this.state.isModalOpen });

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

		CategoryTagList(this.state.cat_id, "cat").then(res => {
			this.setState({
				isLoading: false,
				tags: res.data,
				refreshing: false,
			});
		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	gotoCategoryAddTag = () => {
		let data = {

			cat_id: this.state.cat_id,
			tag_for: "cat"
		};
		this.props.navigation.navigate("CategoryTagAddScreen", { data: data });
	};

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
		this.setState({categoryNameValidationFailed: false});
		if (this.state.categoryName == undefined || this.state.categoryName.length == 0) {
			this.setState({
				categoryNameValidationFailed: true
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
		const { imageData, categoryName, status} = this.state;
		this.setState({
			isLoading: true
		}, () => {
			let obj = {
				id: this.state.cat_id,
				name: categoryName,
				status : status,
				image: imageData,
				after_click_open: (this.state.after_click_open_subcategory == true) ? 'sub-cats' : 'tags'
			};
			editCategory(obj)
			.then((response) => {
				this.setState({
					isLoading: false,
					showAlert: true,
					check: response.type,
					message: response.msg,
				})
			})
			.catch((error) => console.log("error", error));
		})
	}

	renderTags = () => {
		if(this.state.tags.length > 0) {
			return (
				<>
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
				</>
			)
		}
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
				<Header title="" addAction={this.gotoCategoryAddTag} />
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
							<View style={{ marginLeft: 5 }}>
								<Text style={styles.inputLable}>After click open sub-category</Text>
							</View>
						</View>

						<View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
							<View>
								<Checkbox value={this.state.after_click_open_tag} onValueChange={(v) => this.handleAfterClickCheckBoxesToggle(v, 'tags') } />
							</View>
							<View style={{ marginLeft: 5 }}>
								<Text style={styles.inputLable}>After click open tags</Text>
							</View>
						</View>

						<View>{this.renderTags()}</View>

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
		color:Colors.textColor,
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
		justifyContent:'space-between',
		borderColor: Colors.textInputBorder,
		marginBottom:10
	},

	subText: {
		fontSize: 13,
		color: Colors.textColor,
		// opacity: 0.9,
		marginBottom: 2,
	},
});
