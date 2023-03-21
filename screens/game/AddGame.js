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
import { Ionicons, EvilIcons,Octicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../config/colors";
import { Header,  } from "../../components";
import { getFileData } from "../../utils/Util";
import AwesomeAlert from 'react-native-awesome-alerts';
import { add_game, CheckGamePriorityOrderForAdd } from "../../services/GameApiService";
import { getCategory, getSubCategory } from "../../services/APIServices";
import { PriorityList } from "../../services/PriorityService";
import OverlayLoader from "../../components/OverlayLoader";
import LottieView from 'lottie-react-native';
import { TagList } from "../../services/TagApiServices";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import AppContext from "../../context/AppContext";

export default class AddGame extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		
		this.state = {
			imageURI: undefined,
			imageData: undefined,
			videoURI: undefined,
			videoData: undefined,
			categoryID: this.props.route.params?.category_id?? undefined,
			// categoryName: this.props.route.params?.cat.name ?? undefined,
			subCategoryID: this.props.route.params?.sub_cat?.id ?? undefined,
			subCategoryName: this.props.route.params?.sub_cat?.name ?? undefined,
			categoryName: '',
			// subCategoryID: '',
			// subCategoryName: '',
			tagId: this.props.route.params?.tagId ?? undefined,
			// priority_id:"",
			// priority_name:"",
			gameTitle: "",
			price: "",
			description: "",
			instruction: "",
			size: "",
			power_points: "",
			KW: "",
			quantity:"",
			number_of_staff:"",
			ordering:"",
			status:"",

			isLoading: false,
			tagList: [],
			tags: [],
			categories: [],
			subCategories: [],
			prioritys:[],
			showAlertModal: false,
			alertMessage: "Please Wait.....",
			alertType: 'Error',
			isGameOrderPriorityAlertVisible: false,
			gameOrderPriorityUpdateErrorMessage: '',
			matchedAlreadyExistGame: null,
			formErrors: {},
		};
	}

	componentDidMount = () => {
		this.setState({isLoading: true});
		Promise.all([
			getCategory(),
			getSubCategory(this.state.categoryID),
			PriorityList(),
			TagList()
		])
		.then( (result) => {
			const tagsdata= result[3].data.filter( (tag) => tag.id == this.state.tagId)
			const tagListdata = result[3].data.filter( (tag) => tag.id != tagsdata[0].id)
			const catData = result[0].data.filter((data)=> data.id == this.state.categoryID)
			this.setState({
				categories: result[0].data,
				subCategories: result[1].data,
				prioritys: result[2].data,
				tagList: tagsdata.length > 0 ? tagListdata : result[3].data ,
				tags : tagsdata,
				categoryName:catData[0].name
			});
		})
		.catch(err => console.log(err))
		.finally( () => {
			this.setState({isLoading: false});
		});
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

	renderEmptyTagScreen = () => {
		return (
			<View style={{ alignItems: 'center'}}>
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

	chooseIcon = () => {
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				this.setState({
					imageURI: undefined,
					imageData: undefined,
				});

				let optins = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					// allowsEditing: false,
					// aspect: [750, 563],
					quality: 1,
					// maxHeight: 563,
					// maxWidth: 750,
					base64: true,
				
			
				};

				ImagePicker.launchImageLibraryAsync(optins).then((result) => {
					// console.log("...............result.height..................",result.height)
					// console.log("...............result.width..................",result.width)
					// alert('height',result.height)
					// alert('width',result.width)
					// const fileSize = result.base64.length * (3 / 4) - 2;
					// console.log("...............fileSize..................",fileSize)
					
				// const new_fileSize = Math.trunc(fileSize/1024)
				// Alert.alert(`Image size is more then 200kb`,
				// 	`Selected image size is ${new_fileSize} kb`)
					// if( fileSize < 250000){
					// if(result.height <= this.context.fileSetting.image_height && result.width <= this.context.fileSetting.image_width){
					
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
			// }
		});
	}})
	};
	chooseVideo = () => {
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				this.setState({
					videoURI: undefined,
					videoData: undefined,
				});

				let optins = {
					mediaTypes:'Videos',
				};

				ImagePicker.launchImageLibraryAsync(optins).then((result) => {
					console.log(".............video..result..................",getFileData(result))
					
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

	getSubCategorys(id) {
		this.setState({
			isLoading:true
		})
		getSubCategory(id).then(res => {
			this.setState({
				subCategories:res.data,
				isLoading:false
			},()=>{
				// console.log("...........subCategories.........",this.state.subCategories);
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
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

	// setPriority = (v) => {
	// 	// console.log(".....priority_id....",v.id)
	// 	this.setState({
	// 		priority_id: v.id,
	// 		priority_name: v.name,
	// 	});
	// };

	setOrdering = (v) => {
		// console.log(".....setOrdering....",v)
		this.setState({ ordering :v })
	};

	validateData = () => {
		let errors = {}

		if(this.state.gameTitle == '') {
			errors.gameTitle = "Game title is required";
		}

		if(!this.state.categoryID) {
			errors.categoryID = "Category is required";
		}

		if(this.state.price == '') {
			errors.price = "Price is required";
		}
		
		if(this.state.quantity == '') {
			errors.quantity = "Quantity is required";
		}

		if(this.state.number_of_staff == '') {
			errors.number_of_staff = "Number of stuff is required"
		}

		this.setState({
			formErrors: {}
		});

		if(Object.keys(errors).length != 0) {
			this.setState({
				formErrors: errors
			});

			return false;
		}

		return true;
	}

	createGame = () => {

		if( this.validateData() === false ) {
			return;
		}

		let data = {
			name: this.state.gameTitle,
			game_slug: this.state.gameTitle,
			status: this.state.status,
			description: this.state.description,
			instruction: this.state.instruction,
			rent: this.state.price,
			size: this.state.size,
			power_points: this.state.power_points,
			KW: this.state.KW,
			video_link: "",
			// image: this.state.imageData,
			media_files: this.state.imageData,
			// priority_id:this.state.priority_id,
			priority_id:'',
			quantity:this.state.quantity,
			number_of_staff:this.state.number_of_staff,
			ordering:this.state.ordering,
			tags: JSON.stringify(this.state.tags)
		}
		
		if(this.state.categoryID && this.state.categoryID != '') {
			data.parent_cat_id = this.state.categoryID
		}

		if(this.state.subCategoryID && this.state.subCategoryID != '') {
			data.child_cat_id = this.state.subCategoryID
		}

		this.setState({
			isLoading: true
		});

		// all set create the game
		add_game(data,this.state.imageData).then(res => {
			this.setState({
				isLoading: false
			});
			if(res.is_success){
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
					status:'',
					video_link: "",
					parent_cat_id: '',
					child_cat_id: '',
					imageURI: undefined,
					imageData: undefined,
					videoURI: undefined,
					videoData: undefined,
				});
			}else{
				this.setState({
					isLoading: false,
					showAlertModal: true,
					alertType: 'Error',
					alertMessage: res.message
				});
			}
		}).catch((error) => {
			this.setState({
				isLoading: false
			});
			Alert.alert("Server Error", error.message);
		});
	}

	gotoBack = () => this.props.navigation.goBack();

	render = () => {
		// console.log('...this.context.fileSetting.image_height......',this.context.fileSetting.image_height);
		// alert(this.context.fileSetting.image_width)
		const { isLoading } = this.state;
		if (isLoading) {
			return (
				<OverlayLoader />
			)
		}
		return (
			<SafeAreaView style={styles.container}>
				<Header title="Create New Game" />
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
									<Image
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
								style={styles.videoContainer}
								onPress={this.chooseVideo}
							>
								{typeof this.state.videoURI !== "undefined" ? (
									<Text style={{fontSize:12}}>{this.state.videoData.name}</Text>
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
								onChange={this.setCategory}
								style={styles.textInput}
								inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
								search
								labelField="name"
								valueField="name"
								placeholder={!this.state.categoryName ? 'Select Category Name' : '...'}
								searchPlaceholder="Search..."
							/>
							{ this.state.formErrors.categoryID && <Text style={{ color: Colors.danger }}>{this.state.formErrors.categoryID}</Text>}
							
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
												this.state.tags.map( (item,index) => {
													return (
														<View style={styles.tagBtnContainer} key={item.id}>
															<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
																<Text style={styles.tagText}>{item.name}</Text>
																<EvilIcons name="close-o" size={20} color={Colors.danger} onPress={ () => {
																	let prevItems = this.state.tagList;
																	prevItems.push(item);
																	this.setState({
																		tags: this.state.tags.filter( (tag) => tag.name != item.name),
																		tagList:prevItems
																	})
																} } />
															</View>
														</View>
													)
												} )
											}
										</View>
									) : this.renderEmptyTagScreen()
								}
								
							</View>

							<View style={{ marginVertical: 10}}>
								<Text style={styles.inputLable}>Available Tags:</Text>
								{
									this.state.tagList.length > 0 ? (
										<View style={styles.tagContainer}>
										{
											this.state.tagList.map( (item) => {
												return (
													<Pressable style={styles.tagBtnContainer} key={item.id} 
														onPress={ () => {
															const checkItem = this.state.tags.find( tag => tag.name == item.name );
															const newtagItem = this.state.tagList.filter( tag => tag.name != item.name );
															if( typeof checkItem == 'undefined' ) {
																let prevItems = this.state.tags;
																prevItems.push(item);
																this.setState({
																	tags: prevItems,
																	tagList:newtagItem
																});
															}
														} }  
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
								// onChangeText={(ordering) => this.setState({ ordering })}
								onChangeText={(v)=>this.setOrdering(v)}
							/>
						</View> */}

						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Game Title:</Text>
							<TextInput
								value={this.state.gameTitle}
								autoCompleteType="off"
								autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(gameTitle) => this.setState({ gameTitle })}
							/>
							{ this.state.formErrors.gameTitle && <Text style={{ color: Colors.danger }}>{this.state.formErrors.gameTitle}</Text>}
						</View>

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
							{ this.state.formErrors.quantity && <Text style={{ color: Colors.danger }}>{this.state.formErrors.quantity}</Text>}
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
							{ this.state.formErrors.number_of_staff && <Text style={{ color: Colors.danger }}>{this.state.formErrors.number_of_staff}</Text>}
						</View>


						<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Price:</Text>
							<TextInput
								value={this.state.price}
								autoCompleteType="off"
								keyboardType="numeric"
								//autoCapitalize="words"
								style={styles.textInput}
								onChangeText={(price) => this.setState({ price })}
							/>
							{ this.state.formErrors.price && <Text style={{ color: Colors.danger }}>{this.state.formErrors.price}</Text>}
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

						<TouchableOpacity style={styles.submitBtn} onPress={this.createGame}>
							<Text style={{ fontSize: 18, color: Colors.white, fontSize: 10 }}>SUBMIT</Text>
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
							this.hideAlert();
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
						onCancelPressed={() => { this.setState({
							isGameOrderPriorityAlertVisible: !this.state.isGameOrderPriorityAlertVisible,
							matchedAlreadyExistGame: null
							})
						}}
						onConfirmPressed={() => {
							this.setState({
								isGameOrderPriorityAlertVisible: !this.state.isGameOrderPriorityAlertVisible,
							}, () => {
								this.props.navigation.push("EditGame",
								{
									cat: { 
										id: this.state.matchedAlreadyExistGame.parent_category.id, 
										name: this.state.matchedAlreadyExistGame.parent_category.name 
									},
									sub_cat: { 
										id: this.state.matchedAlreadyExistGame.child_category.id,
										name: this.state.matchedAlreadyExistGame.child_category.name
									},
									game:  this.state.matchedAlreadyExistGame.game
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
	videoContainer: {
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
	},
	dropdown: {
		height: 50,
		borderColor: 'gray',
		borderWidth: 0.5,
		borderRadius: 8,
		paddingHorizontal: 8,
	  },
	  icon: {
		marginRight: 5,
	  },
	  label: {
		position: 'absolute',
		backgroundColor: 'white',
		left: 22,
		top: 8,
		zIndex: 999,
		paddingHorizontal: 8,
		fontSize: 14,
	  },
	  placeholderStyle: {
		fontSize: 16,
	  },
	  selectedTextStyle: {
		fontSize: 16,
	  },
	  iconStyle: {
		width: 20,
		height: 20,
	  },
	  inputSearchStyle: {
		height: 40,
		fontSize: 16,
	  },
});
