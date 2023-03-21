import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	Image,
	TouchableOpacity,
	ScrollView,
	Modal,
	Dimensions,
	Alert,
	FlatList,
	RefreshControl,
	CheckBox,
	SafeAreaView
} from "react-native";
import { FontAwesome, Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../config/colors";
import { getFileData } from "../../utils/Util";
import Configs from "../../config/Configs";
import { ProofList, EventVolunteerList, DeleteEventVolunteer, AddUpdateProofSetUp, ChangeOrderConfirm } from "../../services/EventApiService";
import { VenderList } from "../../services/VenderApiService";
import { EventLoadingList, SubmitPartLoad, EventLoadingPartList } from "../../services/EventApiService";
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dropdown } from "../../components";
import Loader from "../../components/Loader";
import EmptyScreen from "../../components/EmptyScreen";

export default class ProofsAndLoadingList extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			data: this.props?.props.route?.params?.data,
			event_id: this.props?.props.route?.params?.data?.id,
			game_id: "",
			isVolunteerModalOpen: false,
			isSetupModalOpen: false,
			isPickerModelOpen: false,
			is_order_confirm: "",
            loading_list: [],
			list: [],
			venders: [],
			volunteer_name: "",
			volunteer_number: "",
			volunteer_vender_id: "",
			volunteer_vender_name: "",
			volunteer_photo: undefined,
			volunteerImageData: undefined,

			setup_front_view: undefined,
			frontImageData: undefined,
			setup_close_up_view: undefined,
			closeUpImageData: undefined,
			setup_left_view: undefined,
			leftImageData: undefined,
			setup_right_view: undefined,
			rightImageData: undefined,
			pic_type: null,

			volunteers: [],
			showAlertModal: false,
			alertMessage: "",
			alertType: '',


            game_parts: [],
			isModalOpen: false,
			game_name:"",
			id: "",
			isLoading: true,
			quantity:"",
		};
	}

    componentDidMount = () => {
		this.focusListner = this.props.props?.navigation?.addListener("focus", () => {
			this.ProofList();

		});
		this.setState({ is_order_confirm: this.state.data?.is_order_confirm })
		this.ProofList();
		this.VenderList();
        this.EventLoadingList();
	};
	componentWillUnmount() {
		this.focusListner();
	  }

	VenderList() {
		this.setState({
			isLoading: true
		});

		VenderList().then(res => {
			this.setState({
				isLoading: false,
				venders: res.data,
				refreshing: false,
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

    SetTic = (value, index) => {
		this.state.game_parts[index].is_tic = value;
		this.setState({
			game_parts: this.state.game_parts,
		});
	}

	ProofList() {
		ProofList(this.state.event_id).then(res => {
			this.setState({
				isLoading: false,
				list: res.data,
				refreshing: false,
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	ChangeOrderConfirm = () => {
		let model = {
			id: this.state.event_id,
			is_order_confirm: 1,
		}
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to confrim",
			[
				{
					text: "Yes",
					onPress: () => {
						ChangeOrderConfirm(model).then(res => {
							this.setState({
								isLoading: false
							});
							if (res.is_success) {
								this.setState({
									isVolunteerModalOpen: false,
									is_order_confirm: 1,
									showAlertModal: true,
									alertType: "Success",
									alertMessage: res.message
								});

								this.props.props.navigation.navigate("EventBillDetail", { data: this.state.data })

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
					},
				},
				{
					text: "No",
				},
			]
		);
	}

	AddUpdateProofSetUp = () => {
		let model = {
			id: this.state.id,
			front: this.state.frontImageData,
			close_up: this.state.closeUpImageData,
			right: this.state.rightImageData,
			left: this.state.leftImageData
		}
		this.setState({
			isLoading: true
		});

		AddUpdateProofSetUp(model).then(res => {
			this.setState({
				isLoading: false,
			});
			this.setState({
				isLoading: false
			});
			if (res.is_success) {
				this.ProofList();
				this.setState({
					isVolunteerModalOpen: false,
					isSetupModalOpen: false,
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

	hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
	};

	openVolunteerModal = (item) => {
		this.setState({
			id: item.id,
			game_id: item.game_id,
			volunteer_photo: Configs.UPLOAD_PATH + item.volunteer_photo,
			volunteer_name: item.volunteer_name,
			volunteer_number: item.volunteer_number,
			volunteer_vender_id: item.volunteer_vender_id,
			volunteer_vender_name: item.volunteer_vender_name,
			isVolunteerModalOpen: !this.state.isVolunteerModalOpen
		});

		this.props.props.navigation.navigate("EventVolunteerListScreen", {
			data: {
				game_id: item.game_id,
				event_id: this.state.event_id
			}
		})
	}

	closeVolunteerModal = () =>
		this.setState({
			id: "",
			game_id: "",
			volunteer_photo: null,
			volunteer_name: "",
			volunteer_number: "",
			volunteer_vender_id: "",
			volunteer_vender_name: "",
			isVolunteerModalOpen: false
		});

	openSetupModal = (item) =>
		this.setState({
			id: item.id,
			// setup_front_view: Configs.UPLOAD_PATH + item.setup_front_view,
			// setup_close_up_view: Configs.UPLOAD_PATH + item.setup_close_up_view,
			// setup_left_view: Configs.UPLOAD_PATH + item.setup_left_view,
			// setup_right_view: Configs.UPLOAD_PATH + item.setup_right_view,
			isSetupModalOpen: !this.state.isSetupModalOpen
		});

	closeSetupModal = (item) =>
		this.setState({
			id: "",
			setup_front_view: null,
			setup_close_up_view: null,
			setup_left_view: null,
			setup_right_view: null,
			isSetupModalOpen: false
		});

	openPickerModal = (type) => {
		this.setState({
			isPickerModelOpen: true,
			pic_type: type
		});
	}

	togglePickerModal = () => {
		this.setState({
			isPickerModelOpen: !this.state.isPickerModelOpen,
			pic_type: null,
		});
	}

	browseIcon = (type) => {
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
						switch (type) {
							case "volunteer":
								this.setState({
									volunteer_photo: result.uri,
									volunteerImageData: getFileData(result),
								});
								break;
							case "front":
								this.setState({
									setup_front_view: result.uri,
									frontImageData: getFileData(result),
								});
								break;
							case "closeup":
								this.setState({
									setup_close_up_view: result.uri,
									closeUpImageData: getFileData(result),
								});
								break;

							case "left":
								this.setState({
									setup_left_view: result.uri,
									leftImageData: getFileData(result),
								});
								break
							case "right":
								this.setState({
									setup_right_view: result.uri,
									rightImageData: getFileData(result),
								});
								break;
						}

						this.setState({
							isPickerModelOpen: false,
							pic_type: null,
						})
					}
				});
			} else {
				Alert.alert("Warning", "Please allow permission to choose an icon");
			}
		});
	};

	openCamera = async (type) => {
		const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
		if (permissionResult.granted === false) {
			Alert.alert("Warring", "You've refused to allow this appp to access your camera!");
			return;
		}
		const result = await ImagePicker.launchCameraAsync();
		if (!result.cancelled) {

			switch (type) {
				case "volunteer":
					this.setState({
						volunteer_photo: result.uri,
						volunteerImageData: getFileData(result),
					});
					break;
				case "front":
					this.setState({
						setup_front_view: result.uri,
						frontImageData: getFileData(result),
					});
					break;
				case "closeup":
					this.setState({
						setup_close_up_view: result.uri,
						closeUpImageData: getFileData(result),
					});
					break;

				case "left":
					this.setState({
						setup_left_view: result.uri,
						leftImageData: getFileData(result),
					});

					console.log(result);
					break
				case "right":
					this.setState({
						setup_right_view: result.uri,
						rightImageData: getFileData(result),
					});
					break;
			}

			this.setState({
				isPickerModelOpen: false,
				pic_type: null,
			})
		}

	};

	SetVenderId = (v) => {
		this.setState({
			volunteer_vender_id: v.id,
			volunteer_vender_name: v.name,
		});
	};

	renderEmptyContainer = () => {
		return (
			<EmptyScreen />
		)
	}

    EventLoadingList() {
		EventLoadingList(this.state.event_id).then(res => {
			this.setState({
				isLoading: false,
				loading_list: res.data,
				refreshing: false,
			});
		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

    SubmitPartLoad = () => {

		let model = { id: this.state.id, parts: JSON.stringify(this.state.game_parts) };
		SubmitPartLoad(model).then(res => {
			this.setState({
				isLoading: false,
			});
			this.setState({
				isLoading: false
			});
			if (res.is_success) {
				this.EventLoadingList();
				this.setState({
					isModalOpen: false,
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

    toggleAddItemModal = () => {
		this.setState({
			id: "",
			isModalOpen: !this.state.isModalOpen
		});
	}

    EventLoadingPartList = (data) => {
		this.setState({
			isLoading: true,
			game_parts: [],
			id: data?.id,
			game_name:data?.game_name,
			quantity:data?.quantity,
			isModalOpen: !this.state.isModalOpen
		});

		EventLoadingPartList(this.state.event_id, data?.game_id)
		.then(res => {
			this.setState({
				isLoading: false,
				game_parts: res.data
		});
		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

    renderItems = ({item, index}) => {

        return (
            <SafeAreaView key={item.id}>
                <View style={styles.tableRow}>
                    <View style={[styles.rowItem, { width: '40%' }]}>
                        <Text style={[styles.subText, { fontWeight: 'bold' }]}>{item.game_name}</Text>
                    </View>
                    <View style={[styles.rowItem, { width: '20%', alignItems: 'flex-start' }]}>
                        <CheckBox value={item.is_tic ?? false}
                            onValueChange={() => this.EventLoadingPartList(item)} />
                    </View>
                    <View style={[styles.rowItem, {  width: '20%' }]}>
                        <CheckBox value={item.volunteer_status}
                            onChange={() => this.openVolunteerModal(item)} />
                    </View>
                    <View style={[styles.rowItem, {  width: '20%' }]}>
                        <CheckBox value={item.setup_status == 1 ? true : false}
                            onChange={() => this.openSetupModal(item)} />
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    render = () => (
		<>
			{this.state.isLoading ?
				<Loader /> :
				<View style={styles.container}>
					<View style={styles.table}>
						<View style={styles.tableRow}>
                            <View style={[styles.rowItem, { width: '40%' }]}>
								<Text style={{ fontWeight: 'bold' }}>Item Name</Text>
							</View>
							<View style={[styles.rowItem, { width: '20%' }]}>
								<Text style={{ fontWeight: 'bold' }}>Loading</Text>
							</View>
							<View style={[styles.rowItem, { width: '20%' }]}>
								<Text style={{ fontWeight: 'bold' }}>Volunteer</Text>
							</View>
							<View style={[styles.rowItem, {  width: '20%' }]}>
								<Text style={{ fontWeight: 'bold' }}>Photo</Text>
							</View>
						</View>

                        <FlatList
                            data={this.state.list}
                            keyExtractor={(item, index) => item.id.toString()}
                            renderItem={this.renderItems}
                            initialNumToRender={this.state.list?.length}
                            contentContainerStyle={styles.lsitContainer}
                            refreshControl={
                                <RefreshControl
                                    refreshing={false}
                                    onRefresh={this.onRefresh}
                                />
                            }
                        />


					</View>
					<View style={{
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 50
					}}>
						{/* <Text style={{
							fontWeight: 'bold',
							color: Colors.primary

						}}>Check to  order  will be completed</Text>
						<CheckBox value={this.state.is_order_confirm == 1 ? true : false}
							onChange={this.ChangeOrderConfirm} /> */}

						{/* <TouchableOpacity onPress={this.ChangeOrderConfirm}
							style={{
								elevation: 4, backgroundColor: Colors.primary, padding: 10,
								borderRadius: 10
							}}>
							<Text style={{ color: Colors.white }}>
							  Complete {'&'} Generate Bill</Text>
						</TouchableOpacity> */}
					</View>

					{/* Setup Modal */}
					<Modal
						animationType="fade"
						transparent={true}
						visible={this.state.isSetupModalOpen}
						onRequestClose={this.closeSetupModal}
					>
						<SafeAreaView style={styles.modalOverlay}>
							<View style={styles.itemModalContainer}>
								<View style={styles.itemModalHeader}>
									<TouchableOpacity
										activeOpacity={1}
										style={styles.headerBackBtnContainer}
										onPress={this.closeSetupModal}
									>
										<Ionicons name="arrow-back" size={26} color={Colors.white} />
									</TouchableOpacity>
									<View style={styles.headerTitleContainer}>
										<Text style={{ fontSize: 20, color: Colors.white }}>
											{"Setup Photos"}
										</Text>
									</View>
								</View>

								<View style={styles.itemModalBody}>
									<View style={styles.form}>
										<ScrollView showsVerticalScrollIndicator={false}>
											<View style={styles.iconPickerContainer}>
												<Text style={styles.inputLable}>Front View</Text>
												<TouchableOpacity
													activeOpacity={1}
													style={styles.imageContainer}
													onPress={this.openPickerModal.bind(this, "front")}
												>
													{typeof this.state.setup_front_view !== "undefined" ? (
														<Image
															style={styles.image}
															source={{ uri: this.state.setup_front_view }}
														/>
													) : (
														<Ionicons
															name="image"
															color={Colors.lightGrey}
															size={40}
														/>
													)}
												</TouchableOpacity>
											</View>

											<View style={styles.iconPickerContainer}>
												<Text style={styles.inputLable}>Close Up</Text>
												<TouchableOpacity
													activeOpacity={1}
													style={styles.imageContainer}
													onPress={this.openPickerModal.bind(this, "closeup")}
												>
													{typeof this.state.setup_close_up_view !== "undefined" ? (
														<Image
															style={styles.image}
															source={{ uri: this.state.setup_close_up_view }}
														/>
													) : (
														<Ionicons
															name="image"
															color={Colors.lightGrey}
															size={40}
														/>
													)}
												</TouchableOpacity>
											</View>

											<View style={styles.iconPickerContainer}>
												<Text style={styles.inputLable}>Left View</Text>
												<TouchableOpacity
													activeOpacity={1}
													style={styles.imageContainer}
													onPress={this.openPickerModal.bind(this, "left")}
												>
													{typeof this.state.setup_left_view !== "undefined" ? (
														<Image
															style={styles.image}
															source={{ uri: this.state.setup_left_view }}
														/>
													) : (
														<Ionicons
															name="image"
															color={Colors.lightGrey}
															size={40}
														/>
													)}
												</TouchableOpacity>
											</View>

											<View style={styles.iconPickerContainer}>
												<Text style={styles.inputLable}>Right View</Text>
												<TouchableOpacity
													activeOpacity={1}
													style={styles.imageContainer}
													onPress={this.openPickerModal.bind(this, "right")}
												>
													{typeof this.state.setup_right_view !== "undefined" ? (
														<Image
															style={styles.image}
															source={{ uri: this.state.setup_right_view }}
														/>
													) : (
														<Ionicons
															name="image"
															color={Colors.lightGrey}
															size={40}
														/>
													)}
												</TouchableOpacity>
											</View>

											<TouchableOpacity
												style={styles.submitBtn}
												onPress={this.AddUpdateProofSetUp}
											>
												<Text style={{ fontSize: 18, color: Colors.white }}>
													SUBMIT
												</Text>
											</TouchableOpacity>
										</ScrollView>
									</View>
								</View>
							</View>
						</SafeAreaView>
					</Modal>

                    {/* Part list modal */}
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
                                            {this.state.game_name}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.itemModalBody}>
                                    <View style={styles.form}>
                                        {this.state.game_parts?.map((item, index) =>
                                            <View key={item.id}>
                                                <View style={styles.listRow}>
                                                    <View style={styles.leftPart}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={styles.title}>{item.part_name}  </Text>
                                                            <Text style={styles.title_qnt}>-{item.quantity*this.state.quantity}</Text>
                                                        </View>
                                                        <Text style={styles.subText}>
                                                            {/* {"Storage: " + item.storage_name} */}
                                                            {item.storage_name}
                                                        </Text>
                                                    </View>
                                                    <View style={[styles.rightPart, { alignItems: 'flex-end' }]}>
                                                        <View >
                                                            <CheckBox
                                                                value={item.is_tic}
                                                                onValueChange={(v) => this.SetTic(v, index)}
                                                                style={styles.checkbox}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>

                                        )}

                                        <TouchableOpacity
                                            style={styles.submitBtn}
                                            onPress={this.SubmitPartLoad}
                                        >
                                            <Text style={{ fontSize: 18, color: Colors.white }}>
                                                SUBMIT
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </SafeAreaView>
                    </Modal>


					<Modal
						animationType="none"
						transparent={true}
						statusBarTranslucent={true}
						visible={this.state.isPickerModelOpen}
						onPress={this.togglePickerModal}

					>
						<View style={styles.btnModalOverlay}>
							<View style={styles.btnModalContainer}>
								<View style={styles.btnModalHeader}>
									<TouchableOpacity
										activeOpacity={1}
										style={styles.btnModalCloseBtn}
										onPress={this.togglePickerModal}
									>
										<Ionicons name="close" size={26} color={Colors.textColor} />
									</TouchableOpacity>
								</View>

								<View style={styles.btnModalBody}>
									<TouchableOpacity
										activeOpacity={0.9}
										style={styles.btnChoosemodalBtn}
										onPress={() => this.openCamera(this.state.pic_type)}
									>
										<Text style={styles.btnModalText}>Open Camera</Text>
									</TouchableOpacity>
									<TouchableOpacity
										activeOpacity={0.9}
										style={styles.btnChoosemodalBtn}
										onPress={() => this.browseIcon(this.state.pic_type)}
									>
										<Text style={styles.btnModalText}>Browse Gallery</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
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

				</View>
			}

		</>
	);
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	lsitContainer: {
		flex: 1,
	},
	card: {
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
		//elevation: 2
	},
	row: {
		marginTop: 5,
		flexDirection: 'row',
	},
	rowItem: {
		//width: '33.33%',
		width: '25%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	rowLebel: {
		fontWeight: 'bold',
		//color: 'silver',
		fontSize: 16

	},
	rowValue: {
		color: 'gray'
	},
	form: {
		flex: 1,
		padding: 8,
	},
	topBtnContainer: {
		width: "100%",
		flexDirection: "row",
		// justifyContent: "space-evenly",
		marginBottom: 30,
	},
	topBtn: {
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		marginRight: 15,
	},
	inputContainer: {
		width: "100%",
		marginBottom: 20,
	},
	inputLable: {
		fontSize: 16,
		color: Colors.grey,
		marginBottom: 10,
		opacity: 0.8,
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
    table: {
		borderColor: "#eee",
		borderWidth: 1,
		paddingHorizontal: 1,
		paddingVertical: 5,
	},

	tableRow: {
		flexDirection: "row",
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
	tdLarge: {
		width: "49%",
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderLeftColor: Colors.textInputBorder,
		borderRightColor: Colors.textInputBorder,
		justifyContent: "center",
		paddingHorizontal: 6,
	},
	tdSmall: {
		width: "17%",
		alignItems: "center",
		justifyContent: "center",
		borderRightWidth: 1,
		borderRightColor: Colors.textInputBorder,
		paddingHorizontal: 6,
	},
	tdLabel: {
		fontSize: 16,
		color: Colors.grey,
		opacity: 0.8,
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
	listRow: {
		flexDirection: "row",
		borderBottomColor: "#eee",
		borderBottomWidth: 1,
		paddingHorizontal: 5,
		paddingVertical: 5,
	},
    image: {
		height: 50,
		width: 50,
	},
	leftPart: {
		width: "80%",
		justifyContent: "center",
	},
	rightPart: {
		width: "20%",
		justifyContent: "center",
	},
	title: {
		fontSize: 16,
		color: Colors.grey,
		fontWeight: "bold",
		lineHeight: 24,
	},
	title_qnt: {
		fontSize: 16,
		color: Colors.grey,
		lineHeight: 24,
		alignSelf: 'center',
		fontWeight: 'bold'
	},
	subText: {
		color: Colors.grey,
		opacity: 0.8,
		fontSize: 14,
		lineHeight: 22,
	},
	btnModalOverlay: {
		height: windowHeight,
		backgroundColor: "rgba(0,0,0,0.2)",
		justifyContent: "flex-end",
	},

	btnModalContainer: {
		backgroundColor: "#fff",
		height: Math.floor(400 * 0.5),
		elevation: 20,
	},
	btnModalBody: {
		flex: 1,
		paddingVertical: 8,
		alignItems: "center",
		justifyContent: "center",
	},

	btnModalHeader: {
		height: 50,
		flexDirection: "row",
		borderTopWidth: StyleSheet.hairlineWidth,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: "#ccc",
		elevation: 0.4,
		alignItems: "center",
		justifyContent: 'flex-end'
	},
	btnModalCloseBtn: {
		width: "10%",
		height: "100%",
		justifyContent: 'center',
		alignItems: 'center'

	},
	btnChoosemodalBtn: {
		flexDirection: "row",
		width: '60%',
		height: 40,
		marginBottom: 20,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
		borderColor: Colors.primary,
		borderRadius: 5,
	},
	btnModalText: {
		fontSize: 16,
		color: Colors.white,
	}
});