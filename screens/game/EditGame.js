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
	Pressable,
	SafeAreaView,
	KeyboardAvoidingView
} from "react-native";
import { Ionicons, EvilIcons, Octicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../config/colors";
import { Header } from "../../components";
import { Dropdown } from 'react-native-element-dropdown';
import { getFileData } from "../../utils/Util";
import AwesomeAlert from 'react-native-awesome-alerts';
import { edit_game, CheckGamePriorityOrderForEdit, Gamedetail } from "../../services/GameApiService";
import { getCategory, getSubCategory } from "../../services/APIServices";
import { PriorityList } from "../../services/PriorityService";
import Configs from "../../config/Configs";
import ProgressiveImage from "../../components/ProgressiveImage";
import OverlayLoader from "../../components/OverlayLoader";
import { TagList } from "../../services/TagApiServices";
import LottieView from 'lottie-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppContext from "../../context/AppContext";

export default class EditGame extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		// console.log("..........props...........", this.props)
		this.state = {
			id: this.props.route.params.id,
			gameData: null,

			imageURI: undefined,
			imageData: undefined,
			videoURI: undefined,
			videoData: undefined,
			categoryID: undefined,
			categoryName: undefined,
			subCategoryID: undefined,
			subCategoryName: undefined,
			status: "",
			// priority_id: "",
			// priority_name: "",
			gameTitle: "",
			price: "",
			description: "",
			instruction: "",
			size: "",
			power_points: "",
			KW: "",
			quantity: "",
			number_of_staff: "",
			ordering: "",

			isLoading: false,
			tagList: [],
			tags: [],
			categories: [],
			subCategories: [],
			prioritys: [],
			showAlertModal: false,
			alertMessage: "Please Wait.....",
			alertType: 'Error',
			isGameOrderPriorityAlertVisible: false,
			gameOrderPriorityUpdateErrorMessage: '',
			matchedAlreadyExistGame: null,
			formErrors: {}
		};
	}

	componentDidMount = () => {
		this.setState({ isLoading: true });
		Promise.all([
			Gamedetail(this.state.id),
			getCategory(),
			getSubCategory(this.state.categoryID),
			PriorityList(),
			TagList()
		])
			.then((result) => {
				this.setState({
					gameData: result[0].data,
					categories: result[1].data,
					subCategories: result[2].data,
					prioritys: result[3].data,
					tagList: result[4].data,
				}, () => this.init());
			})
			.catch(err => ()=>{})
			.finally(() => {
				this.setState({ isLoading: false });
			});
	}

	init = () => {

		let game = this.state.gameData;

		let currentTags = game.tags.map((item) => {
			return {
				id: item.tag_id,
				name: item.name
			}
		})


		this.setState({
			imageURI: Configs.NEW_COLLECTION_URL + game.image,
			videoURI:game.video_file,
			videoData:{name:game.video_file},
			categoryID: game.parent_cat_id,
			categoryName: game.parent_cat_name,
			subCategoryID: game.child_cat_id,
			subCategoryName: game.child_cat_name,
			// priority_id: game.priority_id,
			// priority_name: game.priority,
			gameTitle: game.name,
			price: game.rent,
			description: game.description,
			instruction: game.instruction,
			size: game.size,
			power_points: game?.power_points,
			KW: game?.KW,
			status: game.status,
			quantity: game.quantity,
			number_of_staff: game.number_of_staff,
			ordering: game.ordering,
			tags: currentTags
		});
	}

	getSubCategorys(id) {
		this.setState({
			isLoading: true
		})
		getSubCategory(id).then(res => {
			this.setState({
				subCategories: res.data,
				isLoading: false
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	showAlert = () => {
		this.setState({
			showAlertModal: true
		});
	};

	hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
		this.gotoBack();
	};

	chooseIcon = () => {
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				this.setState({
					imageURI: undefined,
					imageData: undefined,
				});

				let optins = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					// allowsEditing: true,
					// aspect: [1, 1],
					
					quality: 1,
					// maxHeight: 563,
					// maxWidth: 750,
					base64: true,
				};

				ImagePicker.launchImageLibraryAsync(optins).then((result) => {
				// 	const fileSize = result.base64.length * (3 / 4) - 2;

				// 	const new_fileSize = Math.trunc(fileSize/1024)
				// // Alert.alert(`Image size is more then 200kb`,
				// // 	`Selected image size is ${new_fileSize} kb`)
				// 	if( fileSize < 250000){
				// 		if(result.height <= this.context.fileSetting.image_height && result.width <= this.context.fileSetting.image_width){

					if (!result.cancelled) {
						this.setState({
							imageURI: result.uri,
							imageData: getFileData(result),
						});
					}
			// 	}else{
			// 		Alert.alert(`Select image dimention should be less then ${this.context.fileSetting.image_height}x${this.context.fileSetting.image_width}`)
			// 	}
			// }else{
			// 		// Alert.alert("image size is more then 200kb")
			// 		Alert.alert(`Image size is more then ${this.context.fileSetting.image_size} kb`,
			// 		`Selected image size is ${new_fileSize} kb`)
			// 	}
			// 	});
			// } else {
			// 	Alert.alert("Warning", "Please allow permission to choose an icon");
			
		});
	}
		});
	};

	chooseVideo = () => {
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				this.setState({
					videoURI: undefined,
					videoData: undefined,
				});

				let optins = {
					mediaTypes: 'Videos',
				};

				ImagePicker.launchImageLibraryAsync(optins).then((result) => {
					// console.log(".............video..result..................", getFileData(result))

					if (!result.cancelled) {
						this.setState({
							videoURI: result.uri,
							videoData: getFileData(result),
						});
					}

				});
			} else {
				Alert.alert("Warning", "Please allow permission to choose an video");
			}
		});
	};


	renderEmptyTagScreen = () => {
		return (
			<View style={{ alignItems: 'center' }}>
				<LottieView
					ref={animation => {
						this.animation = animation;
						this.animation?.play();
					}}
					style={{
						width: 50,
						height: 50
					}}
					source={require('../../assets/lottie/no-result-found.json')}
				/>
				<Text style={{ fontSize: 13, color: 'red' }}>
					No tag found
				</Text>
			</View>
		)
	}

	setCategory = (v) => {
		this.setState({
			categoryID: v.id,
			categoryName: v.name,
			subCategoryID: '',
			subCategoryName: '',
		});
		this.getSubCategorys(v.id)
	};

	setSubCategory = (v) => {
		this.setState({
			subCategoryID: v.id,
			subCategoryName: v.name,
		});
	};

	validateData = () => {
		let errors = {}

		if (this.state.gameTitle == '') {
			errors.gameTitle = "Game title is required";
		}

		if (!this.state.categoryID) {
			errors.categoryID = "Category is required";
		}

		if (this.state.price == '') {
			errors.price = "Price is required";
		}

		if (this.state.quantity == '') {
			errors.quantity = "Quantity is required";
		}

		if (this.state.number_of_staff == '') {
			errors.number_of_staff = "Number of stuff is required"
		}

		this.setState({
			formErrors: {}
		});

		if (Object.keys(errors).length != 0) {
			this.setState({
				formErrors: errors
			});

			return false;
		}

		return true;
	}

	editGame = () => {

		if (this.validateData() === false) {
			return;
		}

		let data = {
			id: this.state.id,
			name: this.state.gameTitle,
			game_slug: this.state.gameTitle,
			description: this.state.description,
			instruction: this.state.instruction,
			rent: this.state.price,
			size: this.state.size,
			power_points: this.state.power_points,
			KW: this.state.KW,
			status: this.state.status,
			video_link: this.state.video_link,
			// image: this.state.imageData,
			media_files: this.state.imageData,
			priority_id: '',
			// priority_id: this.state.priority_id,
			quantity: this.state.quantity,
			number_of_staff: this.state.number_of_staff,
			ordering: this.state.ordering,
			tags: JSON.stringify(this.state.tags)
		}

		if (this.state.categoryID && this.state.categoryID != '') {
			data.parent_cat_id = this.state.categoryID
		}

		if (this.state.subCategoryID && this.state.subCategoryID != '') {
			data.child_cat_id = this.state.subCategoryID
		}

		this.setState({
			isLoading: true
		});
		edit_game(data).then(res => {
			this.setState({ isLoading: false });
			console.log('.........edit game...res............',res);
			if (res.is_success) {
				this.setState({
					showAlertModal: true,
					alertType: 'Success',
					alertMessage: res.message,
					gameTitle: '',
					description: '',
					instruction: '',
					price: '',
					size: '',
					power_points: '',
			KW: '',
					status: '',
					video_link: "",
					parent_cat_id: '',
					child_cat_id: '',
					imageURI: undefined,
					imageData: undefined,
					videoURI: undefined,
					videoData: undefined,
				});
			} else {
				this.setState({
					showAlertModal: true,
					alertType: 'Error',
					alertMessage: res.message,
					isLoading: false
				});
			}
		}).catch((error) => {
				this.setState({
					isLoading: false
				})
				// alert("Error")
			// Alert.alert("Server Error", error.message);
		});
	}

	gotoBack = () => this.props.navigation.goBack();

	// setPriority = (v) => {
	// 	this.setState({
	// 		priority_id: v.id,
	// 		priority_name: v.name,
	// 	});
	// };

	render = () => {
		console.log('.........',this.context.fileSetting);
		return (
			<SafeAreaView style={styles.container}>
				<Header title={"Edit Game"} />
				{this.state.isLoading && <OverlayLoader />}
				<View style={styles.form}>
					<KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
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

						{/* <View style={styles.iconPickerContainer}>
							<Text style={styles.inputLable}>Choose Video</Text>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.imageContainer}
								onPress={this.chooseVideo}
							>
								{typeof this.state.videoURI !== "undefined" ? (
									<Text style={{ fontSize: 12 }}>{this.state.videoData.name}</Text>
								) : (
									// <Ionicons name="ios-videocam" color={Colors.textColor} size={40} />
									<Octicons name="video" color={Colors.textColor} size={40} />
								)}
							</TouchableOpacity>
						</View> */}


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
							{this.state.formErrors.categoryID && <Text style={{ color: Colors.danger }}>{this.state.formErrors.categoryID}</Text>}
						</View>

						{/* <View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Sub Category:</Text>
							<Dropdown
								onChange={this.setSubCategory}
								value={this.state.subCategoryName}
								data={this.state.subCategories}
								style={styles.textInput}
								inputSearchStyle={styles.inputSearchStyle}
								// placeholderStyle={styles.textInput}
								// selectedTextStyle={styles.textInput}
								search
								labelField="name"
								valueField="name"
								placeholder={!this.state.subCategoryName ? 'Select Sub Category Name' : '...'}
								searchPlaceholder="Search..."
							/>
						</View> */}

						<View style={styles.inputContainer}>
							<View style={{ marginVertical: 10 }}>
								<View>
									<Text style={styles.inputLable}>Current Tags:</Text>
								</View>

								{
									this.state.tags.length > 0 ? (
										<View style={styles.tagContainer}>
											{
												this.state.tags.map((item) => {
													return (
														<View style={styles.tagBtnContainer} key={item.id}>
															<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
																<Text style={styles.tagText}>{item.name}</Text>
																<EvilIcons name="close-o" size={20} color={Colors.danger} onPress={() => {
																	this.setState({
																		tags: this.state.tags.filter((tag) => tag.name != item.name)
																	})
																}} />
															</View>
														</View>
													)
												})
											}
										</View>
									) : this.renderEmptyTagScreen()
								}

							</View>

							<View style={{ marginVertical: 10 }}>
								<Text style={styles.inputLable}>Available Tags:</Text>
								{
									this.state.tagList.length > 0 ? (
										<View style={styles.tagContainer}>
											{
												this.state.tagList.map((item) => {
													return (
														<Pressable style={styles.tagBtnContainer} key={item.id}
															onPress={() => {
																const checkItem = this.state.tags.find(tag => tag.name == item.name);
																if (typeof checkItem == 'undefined') {
																	let prevItems = this.state.tags;
																	prevItems.push(item);
																	this.setState({
																		tags: prevItems
																	});
																}
															}}
														>
															<Text style={styles.tagText}>{item.name}</Text>
														</Pressable>
													)
												})
											}
										</View>
									) : this.renderEmptyTagScreen()
								}
							</View>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Game Title:</Text>
							<TextInput
								value={this.state.gameTitle}
								autoCompleteType="off"
								autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(gameTitle) => this.setState({ gameTitle })}
							/>
							{this.state.formErrors.gameTitle && <Text style={{ color: Colors.danger }}>{this.state.formErrors.gameTitle}</Text>}
						</View>

						{/* <View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Priority:</Text>
							<Dropdown
								onChange={this.setPriority}
								value={this.state.priority_name}
								data={this.state.prioritys}
								style={styles.textInput}
								inputSearchStyle={styles.inputSearchStyle}
								// placeholderStyle={styles.textInput}
								// selectedTextStyle={styles.textInput}
								search
								labelField="name"
								valueField="name"
								placeholder={!this.state.priority_name ? 'Priority' : '...'}
								searchPlaceholder="Search..."
							/>
						</View> */}

						{/* <View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Ordering:</Text>
							<TextInput
								value={this.state.ordering}
								autoCompleteType="off"
								keyboardType="numeric"
								//autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(ordering) => this.setState({ ordering })}
							/>
						</View> */}

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Quantity:</Text>
							<TextInput
								value={this.state.quantity}
								autoCompleteType="off"
								keyboardType="numeric"
								//autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(quantity) => this.setState({ quantity })}
							/>
							{this.state.formErrors.quantity && <Text style={{ color: Colors.danger }}>{this.state.formErrors.quantity}</Text>}
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Number Of Staff:</Text>
							<TextInput
								value={this.state.number_of_staff}
								keyboardType="numeric"
								autoCompleteType="off"
								//autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(number_of_staff) => this.setState({ number_of_staff })}
							/>
							{this.state.formErrors.number_of_staff && <Text style={{ color: Colors.danger }}>{this.state.formErrors.number_of_staff}</Text>}
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Price:</Text>
							<TextInput
								value={this.state.price}
								keyboardType="numeric"
								autoCompleteType="off"
								//autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(price) => this.setState({ price })}
							/>
							{this.state.formErrors.price && <Text style={{ color: Colors.danger }}>{this.state.formErrors.price}</Text>}
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Size:</Text>
							<TextInput
								value={this.state.size}
								autoCompleteType="off"
								autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(size) => this.setState({ size })}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Power Points:</Text>
							<TextInput
								value={this.state.power_points}
								autoCompleteType="off"
								autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(power_points) => this.setState({ power_points })}
							/>
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>KW:</Text>
							<TextInput
								value={this.state.KW}
								autoCompleteType="off"
								autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(KW) => this.setState({ KW })}
							/>
						</View>

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Status:</Text>
							<Dropdown
								value={this.state.status}
								data={[{ id: "1", name: "Active" }, { id: "0", name: "Inactive" }]}
								onChange={(status) => this.setState({ status: status.id })}
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
						<View style={[styles.inputContainer, { marginTop: 10 }]}>
							<Text style={styles.inputLable}>Description:</Text>
							<TextInput
								multiline={true}
								numberOfLines={5}
								autoCompleteType="off"
								autoCapitalize="words"
								style={[styles.textInput, { textAlignVertical: "top" }]}
								value={this.state.description}
								onChangeText={(description) => this.setState({ description })}
							/>
						</View>

						<View style={[styles.inputContainer, { marginTop: 10 }]}>
							<Text style={styles.inputLable}>Instruction:</Text>
							<TextInput
								multiline={true}
								numberOfLines={2}
								autoCompleteType="off"
								autoCapitalize="words"
								style={[styles.textInput, { textAlignVertical: "top" }]}
								value={this.state.instruction}
								onChangeText={(instruction) => this.setState({ instruction })}
							/>
						</View>

						<TouchableOpacity style={styles.submitBtn} onPress={this.editGame}>
							<Text style={{ fontSize: 18, color: Colors.white }}>Save</Text>
						</TouchableOpacity>
					</KeyboardAwareScrollView>

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
							// this.hideAlert();
							this.props.navigation.goBack();
						}}
					/>


					<AwesomeAlert
						show={this.state.isGameOrderPriorityAlertVisible}
						showProgress={false}
						title={this.state.alertType}
						message={this.state.gameOrderPriorityUpdateErrorMessage}
						closeOnTouchOutside={true}
						closeOnHardwareBackPress={false}
						showCancelButton={true}
						showConfirmButton={true}
						cancelText="cancel"
						confirmText="Yes! Edit the Game"
						confirmButtonColor="#DD6B55"
						onCancelPressed={() => {
							this.setState({
								isGameOrderPriorityAlertVisible: !this.state.isGameOrderPriorityAlertVisible,
								matchedAlreadyExistGame: null
							})
						}}
						onConfirmPressed={() => {
							this.setState({
								isGameOrderPriorityAlertVisible: !this.state.isGameOrderPriorityAlertVisible,
							}, () => {
								console.log(".......this.state.matchedAlreadyExistGame........", this.state.matchedAlreadyExistGame)
								this.props.navigation.push("EditGame",
									{
										cat: {
											id: this.state.matchedAlreadyExistGame.parent_category.id,
											name: this.state.matchedAlreadyExistGame.parent_category.name
										},
										sub_cat: {
											// id: this.state.matchedAlreadyExistGame?.child_category.id,
											// name: this.state.matchedAlreadyExistGame?.child_category.name
										},
										game: this.state.matchedAlreadyExistGame.game
									});
							});
						}}
					/>
				</View>
			</SafeAreaView>
		);
	}
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
	defaultImgIcon: {
		fontSize: 50,
		color: "#adadad",
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
		color: Colors.textColor,
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
	tagContainer: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		backgroundColor: Colors.lightGrey,
		padding: 2
	},
	tagBtnContainer: {
		backgroundColor: Colors.primary,
		padding: 10,
		borderRadius: 10,
		margin: 5
	},

	tagText: {
		color: Colors.white,
		fontSize: 13
	}
});
