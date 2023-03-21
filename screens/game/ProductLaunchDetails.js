import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Modal,
	Dimensions,
	Image,
	Alert,
	SafeAreaView,
} from "react-native";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../config/colors";
import { Header, DateAndTimePicker,  } from "../../components";
import { Dropdown } from 'react-native-element-dropdown';
import { getFileData, getFormattedDate, } from "../../utils/Util";
import AwesomeAlert from 'react-native-awesome-alerts';
import { VenderList } from "../../services/VenderApiService";
import { MaterialList } from "../../services/MaterialApiService";

import { AddGameLaunchDetail, UpdateGameLaunchDetail } from "../../services/GameApiService";
import ProgressiveImage from "../../components/ProgressiveImage";

import Configs from "../../config/Configs";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { ToFormData } from "../../config/Configs";

export default class ProductLaunchDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.route.params.data,
			id: "",
			vender_name: "",
			vender_id: "",
			materials: [],

			material_id: "",
			mfg_date: null,
			mfg_photos: [],
			comments: "",

			venders: [],
			materials_list: [],

			index_of_material:"",
			material_name: "",
			
			quantity: null,
			rate: "",
			amount: null,
			comment: '',
			isModalOpen: false,

			galleryImages: [],
			galleryImageData: [],

			showAlertModal: false,
			alertMessage: "",
			alertType: '',
			isDatePickerVisible: false
		};
	}

	componentDidMount = () => {
		this.focusListner = this.props.navigation.addListener("focus", () => { this.Initialize() })
		let d = this.state.data;

		let mfg_date = null;
		if (d.mfg_date) {
			mfg_date = new Date(d.mfg_date);
		}

		this.setState({
			id: d.id,
			game_id: d.game_id,
			vender_name: d.vender_name,
			vender_id: d.vender_id,
			mfg_date: mfg_date,
			materials: d.materials ?? [],
			comments: d.comments,
			mfg_photos: d.mfg_photos
		});
	}

	componentWillUnmount() {
		this.focusListner();
	}

	Initialize() {
		this.setState({
			isLoading: true
		});
		Promise.all([ VenderList(), MaterialList() ]).then( (result) => {
			this.setState({
				venders: result[0].data,
				materials_list: result[1].data,
				isLoading: false
			});

		} ).catch( (err) => {
			console.log(err);
		})
	}

	showDatePicker = () => {
		this.setState({ isDatePickerVisible: true, });
	  };
	  hideDatePicker = () => {
		this.setState({ isDatePickerVisible: false, });
	  };
	handleSetupDateChange = (selectedDate) => {
		console.log("A date has been picked: ", selectedDate);
		console.log("A date has been picked: ", getFormattedDate(selectedDate));
		this.setState({ mfg_date: (selectedDate) });
		this.hideDatePicker();
	  };
	// onManufacturingDateChange = (selectedDate) => this.setState({ mfg_date: selectedDate });

	toggleAddItemModal = () =>
		this.setState({
			material_id: "",
			material_name: "",
			// uom_id: "",
			// uom_name: "",
			rate: "",
			quantity: "",
			amount: "",
			index_of_material:"",
			comment: '',
			isModalOpen: !this.state.isModalOpen
		});


	editModal = (item,index) => {
		this.setState({
			index_of_material:index,
			material_id: item.id,
			material_name: item.name,
			// uom_id: item.uom_id,
			// uom_name: item.uom_name,
			rate: item.rate,
			quantity: item.quantity,
			amount: item.amount,
			comment: item?.comment,
			isModalOpen: true,
		});
	}

	addGalleryImage = () => {
		let { galleryImages, galleryImageData } = this.state;
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
						galleryImages.push({ uri: result.uri });
						galleryImageData.push(getFileData(result));

						this.setState({
							galleryImages: galleryImages,
							galleryImageData: galleryImageData,
						});
					}
				});
			} else {
				Alert.alert("Warning", "Please allow permission to choose an icon");
			}
		});
	};

	gotoBack = () => this.props.navigation.goBack();

	SetVenderId = (v) => {
		this.setState({
			vender_id: v.id,
			vender_name: v.name,
		});
	};

	SetMaterialId = (v) => {
		console.log(v);
		this.setState({
			material_id: v.id,
			material_name: v.name,
			rate: v.rate,
			quantity: "1",
			amount: v.rate,
			comment: v?.comment
		});
	};

	AddMaterial = () => {
		if (this.state.materials.find(i => i.id == this.state.material_id)) {
			this.setState({
				showAlertModal: true,
				alertType: "Error",
				alertMessage: "Material all ready added"
			})
			return;
		}
		let material = {
			id: this.state.material_id,
			name: this.state.material_name,
			// uom_id: this.state.uom_id,
			// uom_name: this.state.uom_name,
			rate: this.state.rate,
			quantity: this.state.quantity,
			amount: this.state.amount,
			comment: this.state.comment
		}
		this.state.materials.push(material);
		this.setState({
			rate: "",
			material_name: "",
			material_id: "",
			// uom_id: "",
			// uom_name: "",
			quantity: "",
			amount: "",
			materials: this.state.materials,
			isModalOpen: false
		});
	}

	UpdateMaterial = () => {
		let material = {
			id: this.state.material_id,
			name: this.state.material_name,
			// uom_id: this.state.uom_id,
			// uom_name: this.state.uom_name,
			rate: this.state.rate,
			quantity: this.state.quantity,
			amount: this.state.amount,
			comment: this.state.comment
		}
		this.state.materials[this.state.index_of_material]=material;
		this.setState({
			rate: "",
			material_name: "",
			material_id: "",
			// uom_id: "",
			// uom_name: "",
			quantity: "",
			amount: "",
			materials: this.state.materials,
			comment: '',
			index_of_material:"",
			isModalOpen: false
		});
	}

	DeleteMaterial = (index) => {
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to remove this material?",
			[
				{
					text: "Yes",
					onPress: () => {
						this.state.materials.splice(index, 1);
						this.setState({ materials: this.state.materials });
					},
				},
				{
					text: "No",
				},
			]
		);
	}

	hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
	};

	AddGameLaunchDetail() {
		let model = {
			game_id: this.state.game_id,
			vender_id: this.state.vender_id,
			mfg_date: getFormattedDate(this.state.mfg_date),
			materials: JSON.stringify(this.state.materials),
			comments: this.state.comments
		}
		this.setState({
			isLoading: true
		});

		let formData = ToFormData(model);
		formData = this.AppendImage(formData);
		AddGameLaunchDetail(formData).then(res => {
			this.setState({
				isLoading: false
			});
			if (res.is_success) {
				this.setState({
					showAlertModal: true,
					alertType: "Success",
					alertMessage: res.message
				})
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

	UpdateDetail() {
		let model = {
			id: this.state.id,
			game_id: this.state.game_id,
			vender_id: this.state.vender_id,
			mfg_date: getFormattedDate(this.state.mfg_date),
			materials: JSON.stringify(this.state.materials),
			comments: this.state.comments
		}
		this.setState({
			isLoading: true
		});

		let forData = ToFormData(model);
		forData = this.AppendImage(forData);
		UpdateGameLaunchDetail(forData).then(res => {
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

	ControlSubmit = () => {
		if (this.state.id) {
			this.UpdateDetail();
			return;
		}
		this.AddGameLaunchDetail();
	}

	ControlMaterial = () => {
		if (this.state.index_of_material !=="") {
			this.UpdateMaterial();
			return;
		}
		this.AddMaterial();
	}

	AppendImage(fd) {
		let files = this.state.galleryImageData;
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			fd.append('images[]', file);
		}
		return fd;
	}

	UpdateAmount = () => {
		let rate = Number(this.state.rate);
		let quan = Number(this.state.quantity);
		let total = rate * quan;
		this.setState({ amount: total.toString() });
	}

	render = () => {
		let total_price = 0;
		this.state.materials?.map(item => {
			total_price = total_price + Number(item?.amount);
		})

		return (
			<SafeAreaView style={styles.container}>
				<Header title="Product Launch Details" />
				<View style={styles.form}>
					<KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

						<View style={styles.inputContainer}>
							<View style={{ flexDirection: "row" }}>
								<Text style={styles.inputLable}>{"Vender: "}</Text>
								{/* <TouchableOpacity onPress={() => this.props.navigation.navigate("VenderScreen")}>
									<Ionicons name="add-circle" color={Colors.primary} size={22} />
								</TouchableOpacity> */}
							</View>
							<Dropdown
								value={this.state.vender_name}
								data={this.state.venders}
								onChange={this.SetVenderId}
								style={styles.textInput}
								inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
								search
								labelField="name"
								valueField="name"
								placeholder={!this.state.vender_name ? 'Select Vender' : '...'}
								searchPlaceholder="Search..."
							/>
						</View>

						{/* <DateAndTimePicker
							mode={"date"}
							label={"Pur / Mfg Date:"}
							value={this.state.mfg_date}
							onChange={this.onManufacturingDateChange}
			
			/> */}
			<View style={{flexDirection:'row',justifyContent: "space-between"}}>
			<Text style={styles.inputLable}> {"Pur / Mfg Date :"}</Text>
				<TouchableOpacity onPress={this.showDatePicker}>
					{this.state.mfg_date != null ?
					<Text style={[styles.inputLable,{fontSize:14}]}>{getFormattedDate(this.state.mfg_date)}</Text>
					:
					<Text style={[styles.inputLable,{fontSize:14}]}>{"DD/MM/YYYY"}</Text>
		}
		{/* <Text style={[styles.inputLable,{fontSize:14}]}>{"DD/MM/YYYY"}</Text> */}
				</TouchableOpacity>
			</View>
						  <DateTimePickerModal
                  mode={this.state.mode}
                  onConfirm={this.handleSetupDateChange}
                  onCancel={this.hideDatePicker}
                  display={Platform.OS == "ios" ? "inline" : "default"}
                  isVisible={this.state.isDatePickerVisible}
                />

						<View style={{ flexDirection: "row" }}>
							<Text style={styles.inputLable}>{"Breakup cost: "}</Text>
							<TouchableOpacity onPress={this.toggleAddItemModal}>
								<Ionicons name="add-circle" color={Colors.primary} size={22} />
							</TouchableOpacity>
						</View>

						{this.state.materials.length > 0 && (
							<>
								{this.state.materials.map((item, index) => (
									<TouchableOpacity key={item.id.toString()}
										style={styles.tbody}
										onLongPress={() => this.DeleteMaterial(index)}
										onPress={() => this.editModal(item,index)}>
										
										<View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
											<View >
												<Text style={{ color: Colors.textColor }}>{item.name}</Text>
											</View>

											<View>
												<Text style={{ color: Colors.textColor }}>{item.amount}</Text>
											</View>
										</View>

									</TouchableOpacity>
								))}

								<View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
									<Text style={[styles.inputLable, { marginBottom: 0 ,fontWeight:'bold'}]}>Total</Text>
									<Text style={[styles.inputLable, { marginBottom: 0,fontWeight:'bold' }]}>{total_price}</Text>
								</View>
							</>
						)}

						<Text style={[styles.inputLable, { marginTop: 20 }]}>
							Mfg Photos:
						</Text>
						<View style={styles.galleryContainer}>
							{this.state.galleryImages.map((value, index) => (
								<TouchableOpacity
									key={index.toString()}
									activeOpacity={1}
									style={styles.galleryGrid}
								// onPress={this.openImageView.bind(this, index)}
								// onLongPress={this.openItemRemoveDialog.bind(this, value.id)}
								>
									<Image
										source={{ uri: value.uri }}
										resizeMode="contain"
										style={styles.galleryImg}
									/>
								</TouchableOpacity>
							))}
							<TouchableOpacity
								activeOpacity={1}
								style={styles.galleryAddBtn}
								onPress={this.addGalleryImage}
							>
								<Ionicons name="add" size={40} color={Colors.primary} />
							</TouchableOpacity>
						</View>


						<View style={styles.galleryContainer}>
							{this.state?.mfg_photos?.length > 0
								&& this.state?.mfg_photos.map((item, index) => {
									return (
										<TouchableOpacity
											key={Math.random()}
											style={styles.galleryGrid}
										>
											<ProgressiveImage
												source={{ uri: Configs.NEW_COLLECTION_URL + item }}
												style={styles.galleryImg}
												resizeMode="contain"
											/>
										</TouchableOpacity>
									);
								})
							}
						</View>

						<View style={[styles.inputContainer, { marginTop: 10 }]}>
							<Text style={styles.inputLable}>Comments Observation:</Text>
							<TextInput
								multiline={true}
								numberOfLines={5}
								autoCompleteType="off"
								autoCapitalize="words"
								style={[styles.textInput, { textAlignVertical: "top" }]}
								value={this.state.comments}
								onChangeText={(comments) => this.setState({ comments })}
							/>
						</View>

						<TouchableOpacity style={styles.submitBtn} onPress={this.ControlSubmit}>
							<Text style={{ fontSize: 18, color: Colors.white }}>{this.state.id ? "Update" : "Save"}</Text>
						</TouchableOpacity>
					</KeyboardAwareScrollView>
				</View>

				<Modal
					animationType="fade"
					transparent={true}
					visible={this.state.isModalOpen}
					onRequestClose={this.toggleAddItemModal}
				>
					<SafeAreaView style={styles.modalOverlay}>
						<View style={styles.itemModalContainer}>
							<View style={styles.itemModalHeader}>
								<TouchableOpacity
									activeOpacity={1}
									style={styles.headerBackBtnContainer}
									onPress={this.toggleAddItemModal}
								>
									<Ionicons name="arrow-back" size={26} color={Colors.white} />
								</TouchableOpacity>
								<View style={styles.headerTitleContainer}>
									<Text style={{ fontSize: 20, color: Colors.white }}>
										{this.state.index_of_material!==""?"Update":"Add"} Material
									</Text>
								</View>
							</View>

							<View style={styles.itemModalBody}>
								<View style={styles.form}>
									<KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

										<View style={styles.inputContainer}>
											<View style={{ flexDirection: "row" }}>
												<Text style={styles.inputLable}>{"Material: "}</Text>
												{/* <TouchableOpacity onPress={() => this.props.navigation.navigate("MaterialScreen")}>
													<Ionicons name="add-circle" color={Colors.primary} size={22} />
												</TouchableOpacity> */}
											</View>
											<Dropdown
												value={this.state.material_name}
												data={this.state.materials_list}
												onChange={this.SetMaterialId}
												style={styles.textInput}
												inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
												search
												labelField="name"
												valueField="name"
												placeholder={!this.state.material_name ? 'Select Material' : '...'}
												searchPlaceholder="Search..."
											/>
										</View>


										<View style={styles.inputContainer}>
											<Text style={styles.inputLable}>Rate:</Text>
											<TextInput
												value={this.state.rate}
												autoCompleteType="off"
												keyboardType="number-pad"
												style={styles.textInput}
												onChangeText={(rate) => this.setState({ rate })}
												onBlur={this.UpdateAmount}
											/>
										</View>

										<View style={styles.inputContainer}>
											<Text style={styles.inputLable}>Quantity:</Text>
											<TextInput
												value={this.state.quantity}
												autoCompleteType="off"
												keyboardType="number-pad"
												style={styles.textInput}
												onChangeText={(quantity) => this.setState({ quantity })}
												onBlur={this.UpdateAmount}
											/>
										</View>


										<View style={styles.inputContainer}>
											<Text style={styles.inputLable}>Amount:</Text>
											<TextInput
												value={this.state.amount}
												autoCompleteType="off"
												keyboardType="default"
												style={styles.textInput}
												onChangeText={(amount) => this.setState({ amount })}
												editable={false}
											/>
										</View>

										<View style={styles.inputContainer}>
											<Text style={styles.inputLable}>Comment:</Text>
											<TextInput
												value={this.state.comment}
												autoCompleteType="off"
												keyboardType="default"
												style={styles.textInput}
												onChangeText={(comment) => this.setState({ comment: comment })}
											/>
										</View>

										<TouchableOpacity
											style={styles.submitBtn}
											onPress={this.ControlMaterial}
										>
											<Text style={{ fontSize: 18, color: Colors.white }}>
												{this.state.index_of_material!==""?"Update":"Add"}
											</Text>
										</TouchableOpacity>
									</KeyboardAwareScrollView>
								</View>
							</View>
						</View>
					</SafeAreaView>
				</Modal>

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

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const galleryGridWidth = Math.floor((windowWidth - 20) / 4);
const galleryGridHeight = Math.floor((windowWidth - 20) / 4);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	form: {
		flex: 1,
		padding: 8,
	},
	inputContainer: {
		width: "100%",
		marginBottom: 20,
	},
	inputLable: {
		fontSize: 16,
		color: Colors.textColor,
		marginBottom: 10,
		
	},
	textInput: {
borderWidth:1,
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
	thead: {
		flexDirection: "row",
		height: 45,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderTopColor: Colors.textInputBorder,
		borderBottomColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
	},
	tbody: {
		flexDirection: "row",
		height: 45,
		borderBottomWidth: 1,
		borderBottomColor: Colors.textInputBorder,
	},
	tdLeft: {
		flex: 1.3,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderLeftColor: Colors.textInputBorder,
		borderRightColor: Colors.textInputBorder,
		justifyContent: "center",
		paddingHorizontal: 6,
	},
	tdRight: {
		flex: 0.7,
		alignItems: "flex-end",
		justifyContent: "center",
		borderRightWidth: 1,
		borderRightColor: Colors.textInputBorder,
		paddingHorizontal: 6,
	},
	galleryContainer: {
		// flex: 1,
		flexDirection: "row",
		alignItems: "flex-start",
		flexWrap: "wrap",
		// paddingHorizontal: 10,
		marginVertical: 10,
	},
	galleryGrid: {
		width: galleryGridWidth,
		height: galleryGridHeight,
		alignItems: "center",
		justifyContent: "center",
	},
	galleryImg: {
		width: galleryGridWidth,
		height: galleryGridHeight,
		borderWidth: 1,
		borderColor: Colors.white,
	},
	galleryAddBtn: {
		width: galleryGridWidth,
		height: galleryGridHeight - 2,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderStyle: "dashed",
		borderRadius: 1,
		borderColor: Colors.primary,
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
	modalOverlay: {
		justifyContent: "center",
		alignItems: "center",
		width: windowWidth,
		height: windowHeight,
		backgroundColor: Colors.white,
	},
	itemModalContainer: {
		flex: 1,
		width: windowWidth,
		height: windowHeight,
		backgroundColor: Colors.white,
	},
	itemModalHeader: {
		height: 55,
		flexDirection: "row",
		width: "100%",
		backgroundColor: Colors.primary,
		elevation: 1,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	headerBackBtnContainer: {
		width: "15%",
		height: 55,
		paddingLeft: 5,
		alignItems: "flex-start",
		justifyContent: "center",
	},
	headerTitleContainer: {
		width: "70%",
		paddingLeft: 20,
		height: 55,
		alignItems: "center",
		justifyContent: "center",
	},
	itemModalBody: {
		flex: 1,
		height: windowHeight - 55,
	},
});
