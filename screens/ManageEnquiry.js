import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	SectionList,
	RefreshControl,
	Alert,
	Modal,
	TextInput,
	Dimensions,
	ScrollView,
	Linking,
	Platform,
	SafeAreaView
} from "react-native";
import {
	Ionicons,
	MaterialIcons,
	Entypo
} from "@expo/vector-icons";
import moment from "moment";
import Colors from "../config/colors";
import Header from "../components/Header";
import AwesomeAlert from 'react-native-awesome-alerts';
import EmptyScreen from "../components/EmptyScreen";
import { GetOrders, ChangeOrderStatus } from "../services/OrderService";
import OverlayLoader from "../components/OverlayLoader";
import { SendOrderBillingInfoUpdatePush } from "../services/APIServices";
import { showDateAsClientWant } from "../utils/Util";

const firstOrderStatustoFetch = '';
const order_status = [
	{
		label: 'All',
		value: ''
	},
	{
		label: 'Pending',
		value: 'pending'
	},
	{
		label: 'Confirmed',
		value: 'confirmed'
	},
	{
		label: 'Declined',
		value: 'declined'
	},
	{
		label: 'Ongoing',
		value: 'ongoing'
	},
	{
		label: 'Completed',
		value: 'completed'
	},
	{
		label: 'Review',
		value: 'review'
	},
	{
		label: 'Request Confirmation',
		value: 'request_confirmation'
	},
	{
		label: 'Closed',
		value: 'closed'
	}
];

export default class ManageEnquiry extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			enquiryData: [],
			refreshing: false,
			status: firstOrderStatustoFetch,
			reason_of_cancel: "",
			id: "",
			isModalOpen: false,
			modal_type: "edt",

			showAlertModal: false,
			alertMessage: "",
			alertType: '',

			isFilterModalOpen: false,
			isLoderVisible: false
		}

	}

	componentDidMount() {
		this.loadOrderDetails();
		this.focusListner = this.props.navigation.addListener("focus", () => { this.loadOrderDetails() })
	};

	componentWillUnmount() {
		this.focusListner();
	}

	setFilterBy = (value) => {
		this.setState({
			status: value,
			isFilterModalOpen: false,
		}, () => this.loadOrderDetails());
	}

	loadOrderDetails = () => {
		this.setState({ isLoderVisible: true });

		GetOrders(this.state.status)
			.then((result) => {
				if (result.is_success) {
					this.setState({
						enquiryData: result.data,
						refreshing: false
					});
				}
			})
			.catch(err => console.log(err))
			.finally(() => this.setState({ isLoderVisible: false }));
	}

	dialCall = (mobile) => {
		let phoneNumber = '';
		if (Platform.OS === 'android') {
			phoneNumber = `tel:${mobile}`;
		}
		else {
			phoneNumber = `telprompt:${mobile}`;
		}

		Linking.openURL(phoneNumber);
	};

	CancelOrder = () => {
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to cancel this order?",
			[
				{
					text: "Yes",
					onPress: () => {
						this.setState({
							status: 'declined',
						});
						this.UpdateOrderStatus();
					},
				},
				{
					text: "No",
				},
			]
		);
	}

	ConfirmedOrder = (item) => {
		console.log("...........item..................", item)
		Alert.alert(
			"Alert",
			"Are you sure you want to confirmed this order?",
			[
				{
					text: "Yes",
					onPress: () => {
						this.setState({
							id: item.id,
							status: 'confirmed'
						});
						this.UpdateOrderStatus();
						SendOrderBillingInfoUpdatePush({
							order_id: item.id,
							title: 'Update Order',
							body: 'Please update your GST for the order number ' + item.order_id
						});
					},
				},
				{
					text: "No",
					onPress: () => {
						console.log('current item', item);
					}
				},
			]
		);
	}

	gotoManageOrder = () => this.props.navigation.navigate("ManageOrder");

	onRefresh = () => {
		this.setState({ refreshing: true }, () => { this.loadOrderDetails() })
	}

	hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
	};

	UpdateOrderStatus() {
		let data = {
			id: this.state.id,
			status: this.state.status,
		}
		if (this.state.reason_of_cancel) {
			data.reason_of_cancel = this.state.reason_of_cancel
		}

		this.setState({ isLoderVisible: true });
		ChangeOrderStatus(data)
			.then((result) => {
				if (result.is_success) {
					this.setState({
						isModalOpen: false,
						showAlertModal: true,
						alertType: "Success",
						alertMessage: result.message
					}, () => this.loadOrderDetails());
				} else {
					console.log('err', result);
				}
			})
			.catch(err => console.log(err))
			.finally(() => {
				this.setState({
					isLoderVisible: false,
					reason_of_cancel: '',
				});
			});
	}

	toggleOpenModal = (item, type) => {
		this.setState({
			isModalOpen: !this.state.isModalOpen,
			id: item?.id,
			reason_of_cancel: item?.reason_of_cancel,
			modal_type: type ?? "edt"
		});
	}

	toggleFilterModal = () => {
		this.setState({ isFilterModalOpen: !this.state.isFilterModalOpen });
	}

	renderEmptyContainer = () => {
		return (
			<EmptyScreen />
		)
	}

	getOrderStatus = (current_status) => {
		if (current_status == 'pending') {
			return (
				<Text style={styles.desc}>
					Status:  <Text style={{ color: 'red' }}>Pending</Text>
				</Text>
			)
		}
		if (current_status == 'review') {
			return (
				<Text style={styles.desc}>
					Status:  <Text style={{ color: 'red' }}>Review</Text>
				</Text>
			)
		}
		if (current_status == 'request_confirmation') {
			return (
				<Text style={styles.desc}>
					Status:  <Text style={{ color: 'red' }}>Request Confirmation</Text>
				</Text>
			)
		}

		if (current_status == 'confirmed') {
			return (
				<Text style={styles.desc}>
					Status:  <Text style={{ color: 'green' }}>Confirmed</Text>
				</Text>
			)
		}

		if (current_status == 'declined') {
			return (
				<Text style={styles.desc}>
					Status:  <Text style={{ color: 'red' }}>Declined</Text>
				</Text>
			)
		}
		if (current_status == 'closed') {
			return (
				<Text style={styles.desc}>
					Status:  <Text style={{ color: 'red' }}>Closed</Text>
				</Text>
			)
		}


		if (current_status == 'ongoing') {
			return (
				<Text style={styles.desc}>
					Status:  <Text>Ongoing</Text>
				</Text>
			)
		}

		if (current_status == 'completed') {
			return (
				<Text style={styles.desc}>
					Status:  <Text style={{ color: Colors.primary }}>Completed</Text>
				</Text>
			)
		}
	}

	getEventStartTime = (eventStartTimeStamp) => {
		let m = moment(eventStartTimeStamp);
		return m.format('h:mm A');
	}

	getEventEndTime = (eventEndTimeStamp) => {
		let m = moment(eventEndTimeStamp);
		return m.format('h:mm A');
	}

	renderItem = ({ item }) => {
		// console.log('..........renderItem................',item);
		let EventDate = moment(item.event_start_timestamp).format('D-MM-YYYY')
		let setupDate = moment(item.setup_timestamp).format('D-MM-YYYY')
		return (
			<View style={styles.card}>
				<View>
					<TouchableOpacity
						key={item.id.toString()}
						onPress={() => {
							this.props.navigation.navigate("EventEnquiryDetail", { data: item })
							console.log('..........item.................', item);
						}}
					>
						<Text style={styles.desc}>ENQ#: {item.order_id.toString().replace('O', 'E')}</Text>
						{/* <Text style={styles.desc}>{"Event Date: "}{showDateAsClientWant(item.event_start_timestamp)}</Text> */}
						<Text style={styles.desc}>{"Venue: " + item.venue}</Text>
						{EventDate != setupDate ?
							<Text style={styles.desc}>
								Setup by: {showDateAsClientWant(item.setup_timestamp)}
							</Text>
							: null}
						<Text style={styles.desc}>Event Time: {this.getEventStartTime(item.event_start_timestamp)} - {this.getEventEndTime(item.event_end_timestamp)}</Text>

						<Text style={styles.desc}>
							{"Client Name: " + (item.customer_name !== null ? item.customer_name : "")}
						</Text>

						{this.getOrderStatus(item.order_status)}

						{/* {item.order_status == 'pending' &&
							<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
								<TouchableOpacity style={styles.submitBtn}
									onPress={() => this.ConfirmedOrder(item)}>
									<Text style={{ color: Colors.white }}>Confirm</Text>
								</TouchableOpacity>
								<TouchableOpacity style={[styles.submitBtn, {
									marginLeft: 5
									, backgroundColor: Colors.danger
								}]}
									onPress={() => this.toggleOpenModal(item, "edt")}>
									<Text style={{ color: Colors.white }}>Decline</Text>
								</TouchableOpacity>
							</View>} */}
					</TouchableOpacity>
				</View>


				<TouchableOpacity style={{
					zIndex: 11,
					top: 5,
					right: 5,
					padding: 10,
					backgroundColor: Colors.primary,
					position: 'absolute'
				}}
					onPress={this.dialCall.bind(this, item.customer_mobile)}
				>
					<MaterialIcons name="call" style={{ color: Colors.white, fontSize: 19 }} />
				</TouchableOpacity>
				<TouchableOpacity style={{
					zIndex: 11,
					bottom: 5,
					right: 5,
					padding: 10,
					backgroundColor: Colors.primary,
					position: 'absolute'
				}}
					onPress={() => {
						this.props.navigation.navigate("TrackOrder", {
							order_id: item.id
						})
					}}
				>
					<Entypo name="flow-line" style={{ color: Colors.white, fontSize: 19 }} />
				</TouchableOpacity>

			</View>
		)
	};

	render = () => (

		<View style={[styles.container, { marginBottom: 40 }]}>
			<SafeAreaView>
				<Header title="Manage Enquiry" sortAction={this.toggleFilterModal} />

				{(this.state.isLoderVisible) ? (
					<OverlayLoader visible={this.state.isLoderVisible} />
				) : (
					<SectionList
						sections={this.state.enquiryData}
						keyExtractor={(item, index) => item.id.toString()}
						renderItem={this.renderItem}
						contentContainerStyle={styles.listContainer}
						ListEmptyComponent={this.renderEmptyContainer()}
						renderSectionHeader={({ section: { title } }) => {
							return (
								<View style={styles.sectionHeader}>
									<View style={styles.sectionHeaderLeft}>
										<Text style={{ fontSize: 26, color: Colors.white }}>
											{moment(title, "YYYY-MM-DD").format("DD")}
										</Text>
									</View>
									<View style={styles.sectionHeaderRight}>
										<Text style={{ fontSize: 16, color: Colors.white }}>
											{moment(title, "YYYY-MM-DD").format("dddd")}
										</Text>
										<Text style={{ fontSize: 14, color: Colors.white }}>
											{moment(title, "YYYY-MM-DD").format("MMMM YYYY")}
										</Text>
									</View>
								</View>
							)
						}}
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
					onRequestClose={this.toggleOpenModal}
				>
					<SafeAreaView style={styles.modalOverlay}>
						<View style={styles.itemModalContainer}>
							<View style={styles.itemModalHeader}>
								<TouchableOpacity
									activeOpacity={1}
									style={styles.headerBackBtnContainer}
									onPress={this.toggleOpenModal}
								>
									<Ionicons name="arrow-back" size={26} color={Colors.white} />
								</TouchableOpacity>
								<View style={styles.headerTitleContainer}>
									<Text style={{ fontSize: 20, color: Colors.white }}>
										Reason of cancel
									</Text>
								</View>
							</View>

							<View style={styles.itemModalBody}>
								<View style={styles.form}>
									<ScrollView showsVerticalScrollIndicator={false}>
										<View style={styles.inputContainer}>
											<Text style={[styles.inputLable, { fontWeight: 'bold' }]}>Give Reason Of Cancel:</Text>
											{this.state.modal_type == "edt" &&
												<TextInput
													value={this.state.reason_of_cancel}
													autoCompleteType="off"
													autoCapitalize="words"
													style={styles.textInput}
													onChangeText={(reason_of_cancel) =>
														this.setState({ reason_of_cancel })
													}
													multiline={true}

												/>}

											{this.state.modal_type == "det" &&

												<Text style={styles.textInput}>
													{this.state.reason_of_cancel}
												</Text>
											}
										</View>

										{this.state.modal_type == "edt" &&
											<TouchableOpacity
												style={[styles.submitBtn, { backgroundColor: Colors.danger }]}
												onPress={() => this.CancelOrder()}
											>
												<Text style={{ fontSize: 18, color: Colors.white }}>
													Cancel
												</Text>
											</TouchableOpacity>}

									</ScrollView>
								</View>
							</View>
						</View>
					</SafeAreaView>
				</Modal>

				<Modal
					animationType="none"
					transparent={true}
					statusBarTranslucent={true}
					visible={this.state.isFilterModalOpen}
				>
					<View style={styles.filterModalOverlay}>
						<View style={styles.filterModalContainer}>
							<View style={styles.filterModalHeader}>
								<Text style={{ fontSize: 16, color: Colors.textColor, }}>
									FILTER BY
								</Text>
								<TouchableOpacity
									style={styles.filterCloseButton}
									onPress={this.toggleFilterModal}
								>
									<Ionicons name="close-outline" style={styles.filterCloseButtonText} />
								</TouchableOpacity>
							</View>
							<ScrollView style={styles.filterModalBody}>
								{
									order_status.map((item) => {
										return (
											<TouchableOpacity
												style={styles.radioItem}
												onPress={this.setFilterBy.bind(this, item.value)}
												key={item.label.toString()}
											>
												<Text>{item.label}</Text>
												<Ionicons
													name={
														this.state.status === item.value
															? "radio-button-on"
															: "radio-button-off"
													}
													color={Colors.primary}
													size={20}
												/>
											</TouchableOpacity>
										)
									})
								}
							</ScrollView>
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
					confirmButtonColor={Colors.primary}
					onCancelPressed={() => {
						this.hideAlert();
					}}
					onConfirmPressed={() => {
						this.hideAlert();
					}}
				/>
			</SafeAreaView>
		</View>
	);
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: '#dfdfdf',
	},
	listContainer: {
		padding: 8,
	},
	sectionHeader: {
		width: "100%",
		height: 50,
		flexDirection: "row",
		backgroundColor: Colors.primary,
		marginBottom: 10,
		borderRadius: 3,
	},
	sectionHeaderLeft: {
		width: "14%",
		alignItems: "flex-end",
		justifyContent: "center",
		borderRightWidth: 1,
		borderRightColor: Colors.white,
		paddingRight: 10,
	},
	sectionHeaderRight: {
		alignItems: "flex-start",
		justifyContent: "center",
		paddingLeft: 10,
	},
	card: {
		//width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		// elevation: 1,
		marginBottom: 10,
	},
	desc: {
		fontSize: 14,
		color: Colors.textColor,
		marginBottom: 3,
		fontWeight: "normal",
		// opacity: 0.6,
	},


	submitBtn: {
		height: 40,
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
		paddingLeft: 5,
		paddingRight: 5
	},

	itemModalBody: {
		flex: 1,
		height: windowHeight - 55,
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
		// elevation: 1,
		alignItems: "center",
		justifyContent: "flex-start",
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
		// opacity: 0.8,
	},

	textInput: {
		borderWidth: 1,
		padding: 9,
		fontSize: 14,
		width: "100%",
		borderWidth: 1,
		borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		color: Colors.textColor,
	},


	//Filter model

	filterModalOverlay: {
		height: windowHeight + 50,
		backgroundColor: "rgba(0,0,0,0.2)",
		justifyContent: "flex-end",
	},

	filterModalContainer: {
		backgroundColor: Colors.white,
		minHeight: Math.floor(windowHeight * 0.39),
		// elevation: 5,
	},

	filterModalHeader: {
		height: 50,
		flexDirection: "row",
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.white,
		// elevation: 1,
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 10,
	},

	filterCloseButton: {
		backgroundColor: "#ddd",
		width: 25,
		height: 25,
		borderRadius: 40 / 2,
		alignItems: "center",
		justifyContent: "center",
		// elevation: 0,
	},
	filterCloseButtonText: {
		color: Colors.textColor,
		fontSize: 22,
	},

	filterModalBody: {
		flex: 1,
		paddingHorizontal: 10,
		paddingVertical: 5,
		marginBottom: 10
	},

	radioItem: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 5,
	},
});
