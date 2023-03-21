import React from "react";
import {
	View,
	StyleSheet,
	Text,
	Image,
	FlatList,
	Modal,
	Dimensions,
	TouchableOpacity,
	Alert,
	ScrollView,
	TextInput,
	RefreshControl,
	SafeAreaView
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../config/colors";
import { Header,  } from "../../components";
import { Dropdown } from 'react-native-element-dropdown';
import Configs from "../../config/Configs";
import { GetGamePartListByGameId, DeleteGamePart, AddGamePart, UpdateGamePart } from "../../services/GameApiService";
import { PartList } from "../../services/PartApiService";
import { getFileData } from "../../utils/Util";
import Loader from "../../components/Loader";
import ProgressiveImage from "../../components/ProgressiveImage";
import AwesomeAlert from 'react-native-awesome-alerts';
import EmptyScreen from "../../components/EmptyScreen";


export default class PartsList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			imageURI: undefined,
			imageData: undefined,
			id: "",
			parts_id: "",
			part_name: "",
			storage: "",
			quantity: "",
			isModalOpen: false,
			list: [],
			parts: [],
			game_id: this.props.route.params.game_id,
			refreshing: false,
			showAlert: false,
			check: "Error",
			message: "Failed"
		};
	}


	componentDidMount = () => {
		this.focusListner = this.props.navigation.addListener("focus", () => { this.Bind() })
	}

	Bind() {
		this.GetGamePartListByGameId();
		this.PartList();
	}

	componentWillUnmount() {
		this.focusListner();
	}


	GetGamePartListByGameId() {
		this.setState({
			isLoading: true
		}, () => { this.getGamePartData() });
	}

	getGamePartData = () => {
		GetGamePartListByGameId(this.state.game_id).then(res => {
			console.log(res.data);
			this.setState({
				isLoading: false,
				refreshing: false,
				list: res.data
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	PartList() {
		this.setState({
			isLoading: true
		});

		PartList().then(res => {
			console.log(res);
			this.setState({
				isLoading: false,
				parts: res.data
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	onRefresh = () => {
		this.setState({ refreshing: true }, () => { this.getGamePartData() })
	}

	hideAlert = () => {
		this.setState({
			showAlert: false,
			isModalOpen: false
		});
	};

	DeleteGamePart = (id) => {
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to remove this part?",
			[
				{
					text: "Yes",
					onPress: () => {
						DeleteGamePart({ id: id }).then(res => {
							if (res.is_success) {
								this.GetGamePartListByGameId();
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

	SetPartId = (v) => {
		this.setState({
			parts_id: v.id,
			part_name: v.name,
		});
	};

	AddGamePart() {
		let model = {
			game_id: this.state.game_id,
			parts_id: this.state.parts_id,
			quantity: this.state.quantity,
		}
		this.setState({
			isLoading: true
		});

		AddGamePart(model).then(res => {
			this.setState({
				isLoading: false,
			});

			if (res.data) {
				Alert.alert(
					res.message,
					"Do you want to modify the part?",
					[
						{
							text: "Yes",
							onPress: () => {
								this.setState({
									//part_name: res.data.part_name,
									//parts_id:res.data.parts_id,
									id: res.data.id,
									imageURI: Configs.IMAGE_URL + res.data.image,
									Image: null,
									//quantity: res.data.quantity
								});
							},
						},
						{
							text: "No",
							onPress: () => {
								this.setState({
									isModalOpen: false,
								});
							}

						},
					]
				);
			}
			if (res.is_success) {
				this.setState({
					showAlert: true,
					check: "Success",
					message: "Game Part added successfully"
				}, () => { this.GetGamePartListByGameId() });
			}
		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	UpdateGamePart() {
		let model = {
			game_id: this.state.game_id,
			parts_id: this.state.parts_id,
			quantity: this.state.quantity,
			image: this.state.imageData,
			id: this.state.id

		}
		this.setState({
			isLoading: true
		});

		UpdateGamePart(model).then(res => {
			this.setState({
				isLoading: false
			});

			if (res.is_success) {
				this.setState({
					showAlert: true,
					check: "Success",
					message: "Game Part edited successfully"
				}, () => { this.GetGamePartListByGameId() });
			} else {
				this.setState({
					showAlert: true,
					check: "Error",
					message: res.message
				})
			}
		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	ControlSubmit = () => {
		if (this.state.id) {
			this.UpdateGamePart();
			return;
		}
		this.AddGamePart();
	}

	toggleModal = () =>
		this.setState({
			part_name: "",
			id: null,
			imageURI: null,
			Image: "",
			quantity: "",
			isModalOpen: !this.state.isModalOpen,
	});

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

	editPart = (item) => {
		this.setState({
			part_name: item.part_name,
			parts_id: item.parts_id,
			id: item.id,
			imageURI: Configs.IMAGE_URL + item.image,
			Image: null,
			quantity: item.quantity,
			isModalOpen: true,
		});
	}

	renderEmptyContainer = () => {
		return (
			<EmptyScreen />
		)
	}

	listItem = ({ item }) => (
		<View key={item.id.toString()} style={styles.card}>
			<View style={{ width: "20%" }}>
				<ProgressiveImage
					source={{ uri: item.thumb_image_url }}
					style={{ height: 57, width: "100%" }}
					resizeMode="cover"
				/>
			</View>
			<View style={{ width: "70%", paddingLeft: 10 }}>
				<Text style={styles.subText}>{"Parts Name: " + item.part_name}</Text>
				<Text style={styles.subText}>{"Storage: " + item.storage_name}</Text>
				<Text style={styles.subText}>{"Quantity: " + item.quantity}</Text>
			</View>
			<View style={styles.qtyContainer}>
				<TouchableOpacity
					style={{ padding: 3 }}
					onPress={this.editPart.bind(this, item)}
				>
					<MaterialIcons name="create" size={22} color={Colors.success} />
				</TouchableOpacity>
				<TouchableOpacity style={{ padding: 3 }}>
					<MaterialIcons name="delete" size={22} color={Colors.danger} onPress={this.DeleteGamePart.bind(this, item.id)} />
				</TouchableOpacity>
			</View>
		</View>
	);

	render = () => (
		<SafeAreaView style={styles.container}>
			<Header title="Loading / Part List" addAction={this.toggleModal} />

			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
					data={this.state.list}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={this.listItem}
					initialNumToRender={this.state.list.length}
					contentContainerStyle={styles.listContainer}
					ListEmptyComponent={this.renderEmptyContainer()}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh}
						/>
					}
				/>
			)}

			<Modal
				animationType="fade"
				transparent={true}
				visible={this.state.isModalOpen}
				onRequestClose={this.toggleModal}
			>
				<SafeAreaView style={styles.modalOverlay}>
					<View style={styles.itemModalContainer}>
						<View style={styles.itemModalHeader}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.headerBackBtnContainer}
								onPress={this.toggleModal}
							>
								<Ionicons name="arrow-back" size={26} color={Colors.white} />
							</TouchableOpacity>
							<View style={styles.headerTitleContainer}>
								<Text style={{ fontSize: 20, color: Colors.white }}>
									{this.state.id ? "Update" : "Add"}  Part
								</Text>
							</View>
						</View>

						<View style={styles.itemModalBody}>
							<View style={styles.form}>
								<ScrollView showsVerticalScrollIndicator={false}>
									{/* <View style={styles.iconPickerContainer}>
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
												<Ionicons
													name="image"
													color={Colors.lightGrey}
													size={40}
												/>
											)}
										</TouchableOpacity>
									</View> */}

									<View style={styles.inputContainer}>
										<View style={{ flexDirection: "row" }}>
											<Text style={styles.inputLable}>{"Parts: "}</Text>
											{/* <TouchableOpacity onPress={()=>this.props.navigation.navigate("PartScreen")}>
								<Ionicons name="add-circle" color={Colors.primary} size={22} />
							</TouchableOpacity> */}
										</View>
										<Dropdown
											onChange={this.SetPartId}
											value={this.state.part_name}
											data={this.state.parts}
											style={styles.textInput}
											
											inputSearchStyle={styles.inputSearchStyle}
											search
											labelField="name"
											valueField="name"
											placeholder={!this.state.part_name ? 'Select Part Name' : '...'}
											searchPlaceholder="Search..."
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
										/>
									</View>

									<TouchableOpacity
										style={styles.submitBtn}
										onPress={this.ControlSubmit}
									>
										<Text style={{ fontSize: 18, color: Colors.white }}>
											{this.state.id ? "Update" : "Save"}
										</Text>
									</TouchableOpacity>
								</ScrollView>
							</View>
						</View>
					</View>
				</SafeAreaView>
			</Modal>


			<AwesomeAlert
				show={this.state.showAlert}
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
		</SafeAreaView>
	);
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	listContainer: {
		flex: 1,
	},
	card: {
		flexDirection: "row",
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
	},
	qtyContainer: {
		width: "10%",
		alignItems: "center",
		justifyContent: "center",
	},
	titleText: {
		fontSize: 14,
		fontWeight: "bold",
		color: Colors.textColor,
		marginBottom: 2,
	},
	subText: {
		fontSize: 13,
		color: Colors.textColor,
		marginBottom: 2,
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
		borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
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
});