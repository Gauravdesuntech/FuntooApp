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
	Alert,
	FlatList,
	RefreshControl,
	TouchableHighlight,
	Image,
	SafeAreaView
} from "react-native";
import {
	Ionicons
} from "@expo/vector-icons";
import Colors from "../../config/colors";
import { SubmitPartLoad } from "../../services/EventApiService";
import AwesomeAlert from 'react-native-awesome-alerts';
import Checkbox from 'expo-checkbox';
import OverlayLoader from "../../components/OverlayLoader";
import { GetAllOrderGameParts, GetAllSingleGameParts } from "../../services/OrderService";

export default class LoadingList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			event_id: 1,
			orderData: this.props.orderData,

			list: [],
			game_parts: [],
			loadingList: [],

			id: "",
			game_name: "",
			quantity: "",

			isLoading: true,
			isModalOpen: false,
			showAlertModal: false,
			alertMessage: "",
			alertType: '',
		};
	}

	componentDidMount = () => {
		this.loadGamePartsDetails();
	};

	SetTic = (value, index) => {
		this.state.game_parts[index].is_tic = value;
		this.setState({
			game_parts: this.state.game_parts,
		});
	}
	
	SubmitPartLoad = () => {

		let model = { id: this.state.id, parts: JSON.stringify(this.state.game_parts) };
		SubmitPartLoad(model).then(res => {
			this.setState({
				isLoading: false,
			});
			if (res.is_success) {
				this.loadGamePartsDetails();
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

	loadGamePartsDetails() {
		this.setState({ isLoading: true });
		GetAllOrderGameParts({ order_id: this.state.orderData.id })
			.then((result) => {
				if (result.is_success) {
					this.setState({
						loadingList: result.data
					});
				}
			})
			.catch(err => console.log(err))
			.finally(() => {
				this.setState({ isLoading: false });
			});
	}

	OrderLoadingPartList = (item) => {
		this.setState({
			isLoading: true,
			game_parts: [],
			id: item?.id,
			game_name: item?.game_name,
			quantity: item?.quantity,
			isModalOpen: !this.state.isModalOpen
		});

		GetAllSingleGameParts({ game_id: item.game_id })
			.then((result) => {
				this.setState({
					game_parts: result.data
				});
			})
			.catch(err => console.log(err))
			.finally(() => {
				this.setState({
					isLoading: false,
				});
			});
	}

	hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
	};

	renderGamePartsItem = ({ item }) => (
		<TouchableHighlight underlayColor={"#eee"}>
			<View style={styles.listRow}>
				<View style={styles.leftPart}>
					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity onPress={() => this.OrderLoadingPartList(item)}>
							<Text style={styles.title}>{item.game_name}  </Text>
						</TouchableOpacity>
						{item.quantity > 1 && <Text style={styles.title_qnt}>-{item.quantity}</Text>}
					</View>
					<Text style={styles.subText}>
						{"Parts: " + item.total_parts}
					</Text>
				</View>
				<View style={[styles.rightPart, { alignItems: 'flex-end' }]}>
					<Checkbox value={(item.total_parts == item.total_parts_loaded) ? true : false}
						onValueChange={() => this.OrderLoadingPartList(item)} />
				</View>
			</View>
		</TouchableHighlight>
	);

	render = () => (
		<>
			{this.state.isLoading && <OverlayLoader visible={this.state.isLoading} />}

			<View style={styles.container}>
				<View style={styles.form}>
					<FlatList
						data={this.state.loadingList}
						keyExtractor={(item, index) => item.id.toString()}
						renderItem={this.renderGamePartsItem}
						initialNumToRender={this.state.loadingList.length}
						contentContainerStyle={styles.listContainer}
						refreshControl={
							<RefreshControl
								refreshing={false}
								onRefresh={this.onRefresh}
							/>
						}
					/>
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
										{this.state.game_name}
									</Text>
								</View>
							</View>

							<View style={styles.itemModalBody}>
								{
									(this.state.isLoading == true) ? (
										<OverlayLoader visible={this.state.isLoading} />
									) : (
										<View style={styles.form}>
											{this.state.game_parts?.map((item, index) =>
												<View key={item.id}>
													<View style={styles.listRow}>
														<View style={styles.leftPart}>
															<View style={{ flexDirection: 'row' }}>
																<View>
																	<Image
																		style={{ width: 56, height: 56 }}
																		resizeMode={'contain'}
																		source={{ uri: item.thumb_image_url }}
																	/>
																</View>
																<View style={{justifyContent: 'center', alignItems: "center",  paddingLeft: 13 }}>
																	<Text style={styles.title}>{item.name}  </Text>
																	{(item.quantity) && (
																		<>
																			<Text style={styles.title_qnt}>- {item.quantity}</Text>
																		</>
																	)}
																	<Text style={styles.subText}>{item.storage_area}</Text>
																</View>
															</View>

														</View>
														<View style={[styles.rightPart, { alignItems: 'flex-end' }]}>
															<View >
																<Checkbox
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
									)
								}
							</View>
						</View>
					</SafeAreaView>
				</Modal>

			</View>

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
		</>
	);
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
	tableRow: {
        backgroundColor: Colors.lightGrey,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginRight: 5,
        color: Colors.grey
    },
    tableRow2: {
        backgroundColor: Colors.lightGrey,
        marginRight: 5,
        color: Colors.grey,
        width: 50
    },
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},

	listContainer: {
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
});
