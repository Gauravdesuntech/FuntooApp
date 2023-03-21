import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	Dimensions,
	SectionList,
	RefreshControl
} from "react-native";
import Colors from "../config/colors";
import Header from "../components/Header";
import { isEmail, showDateAsClientWant } from "../utils/Util";
import AppContext from "../context/AppContext";
import { writeUserData } from "../utils/Util";
import { update_admin_details,GetLogHistory_by_user,GetLogHistoryDetail_by_user } from "../services/APIServices";
import OverlayLoader from "../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { GetCustomerOrder } from "../services/OrderService";
import EmptyScreen from "../components/EmptyScreen";
import moment from "moment";
import {
	Ionicons,
	MaterialIcons
} from "@expo/vector-icons";
import AccordianChild from "./AccordianChild";

export default class Address_detailsBook extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			email: "",
			mobile: "",
			gst: "",
			address: "",
			company_name: "",
			id: null,
			isLoading: false,
			currentTab: "Profile",
			showAlertModal: false,
			alertMessage: "",
			alertType: "",
			allOrders: [],
			refreshing: false,
		};
	}

	componentDidMount() {
		// console.log(".........this.props.route.params.data...........",this.props.route.params.data)
		this.focusListner = this.props.navigation.addListener("focus", () => {
			this.getOrderData();
			this.getLogData();
		});
		this.setState({
			name: this.props.route.params.data.name,
			email: this.props.route.params.data.email,
			mobile: this.props.route.params.data.mobile,
			address: this.props.route.params.data.billing_address,
			gst: this.props.route.params.data.gstin,
			company_name: this.props.route.params.data.company_name,
		});
	}

	componentWillUnmount() {
		this.focusListner();
	}

	onRefresh = () => {
		this.setState({ refreshing: true }, () => {
			this.getOrderData();
		});
	};

	hideAlert = () => {
		this.setState({
			showAlertModal: false,
		});
	};

	getOrderData = () => {
		this.setState({ isLoading: true });
		GetCustomerOrder(this.props.route.params.data.id)
			.then((res) => {
				this.setState({
					isLoading: false,
					allOrders: res.data,
					refreshing: false,
				});
			})
			.catch((err) => {
				this.setState({ isLoading: false });
			});
	};

	getOrderStatus = (current_status) => {
		if (current_status == "pending") {
			return (
				<Text style={styles.desc}>
					Status: <Text style={{ color: "red" }}>Pending</Text>
				</Text>
			);
		}
		if (current_status == "review") {
			return (
				<Text style={styles.desc}>
					Status: <Text style={{ color: "red" }}>Review</Text>
				</Text>
			);
		}
		if (current_status == "request_confirmation") {
			return (
				<Text style={styles.desc}>
					Status:{" "}
					<Text style={{ color: "red" }}>Request Confirmation</Text>
				</Text>
			);
		}

		if (current_status == "confirmed") {
			return (
				<Text style={styles.desc}>
					Status: <Text style={{ color: "green" }}>Confirmed</Text>
				</Text>
			);
		}

		if (current_status == "declined") {
			return (
				<Text style={styles.desc}>
					Status: <Text style={{ color: "red" }}>Declined</Text>
				</Text>
			);
		}

		if (current_status == "ongoing") {
			return (
				<Text style={styles.desc}>
					Status: <Text>Ongoing</Text>
				</Text>
			);
		}

		if (current_status == "completed") {
			return (
				<Text style={styles.desc}>
					Status: <Text style={{ color: Colors.primary }}>Completed</Text>
				</Text>
			);
		}
	};

	getEventStartTime = (eventStartTimeStamp) => {
		let m = moment(eventStartTimeStamp);
		return m.format("h:mm A");
	};

	getEventEndTime = (eventEndTimeStamp) => {
		let m = moment(eventEndTimeStamp);
		return m.format("h:mm A");
	};

	renderEmptyContainer = () => {
		return <EmptyScreen />;
	};
	dialCall = (mobile) => {
		let phoneNumber = "";
		if (Platform.OS === "android") {
			phoneNumber = `tel:${mobile}`;
		} else {
			phoneNumber = `telprompt:${mobile}`;
		}

		Linking.openURL(phoneNumber);
	};

	renderItem = ({ item }) => {
		return (
			<View style={styles.card}>
				<View>
					<TouchableOpacity
						key={item.id.toString()}
						onPress={() =>
							this.props.navigation.navigate("EventEnquiryDetail", {
								data: item,
							})
						}
					>
						<Text style={styles.desc}>
							ENQ#: {item.order_id.toString().replace("O", "E")}
						</Text>
						<Text style={styles.desc}>
							{"Event Date: "}
							{showDateAsClientWant(item.event_start_timestamp)}
						</Text>
						<Text style={styles.desc}>{"Venue: " + item.venue}</Text>
						<Text style={styles.desc}>
							Setup by: {showDateAsClientWant(item.event_end_timestamp)}
						</Text>
						<Text style={styles.desc}>
							Event Time:{" "}
							{this.getEventStartTime(item.event_start_timestamp)} -{" "}
							{this.getEventEndTime(item.event_end_timestamp)}
						</Text>

						<Text style={styles.desc}>
							{"Client Name: " +
								(item.customer_name !== null ? item.customer_name : "")}
						</Text>

						{this.getOrderStatus(item.order_status)}
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					style={{
						zIndex: 11,
						top: 5,
						right: 5,
						padding: 10,
						backgroundColor: Colors.primary,
						position: "absolute",
					}}
					onPress={this.dialCall.bind(this, item.customer_mobile)}
				>
					<MaterialIcons
						name="call"
						style={{ color: Colors.white, fontSize: 19 }}
					/>
				</TouchableOpacity>
			</View>
		);
	};

	/*
	 *
	 *log history data
	 *created by - Rahul Saha
	 *created Data - 07.12.22
	 *
	 */

	getLogData = () => {
		this.setState({ isLoading: true });
		GetLogHistoryDetail_by_user(this.props.route.params.data.id)
			.then((res) => {
				this.setState({
					isLoading: false,
					allLog_History: res.data,
					refreshing: false,
				});
				console.log("all-Log_History-data---->>>",allLog_History);
			})
			.catch((err) => {
				this.setState({ isLoading: false });
			});
	};

	onLogRefresh = () => {
		this.setState({ refreshing: true }, () => {
			this.getLogData();
		});
	};

	renderLogItem = ({ item }) => {
		// console.log("..........item-log-history-detail-22-->............", item);
		// let time = moment(item.date).format("h:mm a");
		// return (
		// 	<View style={[styles.Log_card]}>
		// 		<View style={{ flexDirection: "row", alignItems: "center" }}>
		// 			<Text>{item.user_name}</Text>
		// 			<Text style={{ fontSize: 12, color: "green" }}>
		// 				( {item.status} )
		// 			</Text>
		// 		</View>
		// 		<Text>{time}</Text>
		// 	</View>
		// );
		return (
			<View>
				<AccordianChild item={item} details={item.details} />
			</View>
		);
	};

	render = () => {
		return (
			<SafeAreaView style={styles.container}>
				<Header title="Address Details" />
				{this.state.isLoading && <OverlayLoader />}
				<>
					<View style={styles.tabContainer}>
						{this.state.currentTab == "Profile" ? (
							<View
								style={[
									styles.tab,
									styles.activeTab,
									{ flexDirection: "row", alignItems: "center" },
								]}
							>
								<Text style={styles.activeText}>Profile</Text>
							</View>
						) : (
							<TouchableOpacity
								onPress={() => this.setState({ currentTab: "Profile" })}
								style={styles.tab}
							>
								<Text style={styles.inActiveText}>Profile</Text>
							</TouchableOpacity>
						)}
						{this.state.currentTab == "Company" ? (
							<View
								style={[
									styles.tab,
									styles.activeTab,
									{ flexDirection: "row", alignItems: "center" },
								]}
							>
								<Text style={styles.activeText}>Company</Text>
							</View>
						) : (
							<TouchableOpacity
								onPress={() => this.setState({ currentTab: "Company" })}
								style={styles.tab}
							>
								<Text style={styles.inActiveText}>Company</Text>
							</TouchableOpacity>
						)}

						{this.state.currentTab == "History" ? (
							<View
								style={[
									styles.tab,
									styles.activeTab,
									{ flexDirection: "row", alignItems: "center" },
								]}
							>
								<Text style={styles.activeText}>Order History</Text>
							</View>
						) : (
							<TouchableOpacity
								onPress={() => this.setState({ currentTab: "History" })}
								style={styles.tab}
							>
								<Text style={styles.inActiveText}>Order History</Text>
							</TouchableOpacity>
						)}
						{this.state.currentTab == "Log History" ? (
							<View
								style={[
									styles.tab,
									styles.activeTab,
									{ flexDirection: "row", alignItems: "center" },
								]}
							>
								<Text style={styles.activeText}>Log History</Text>
							</View>
						) : (
							<TouchableOpacity
								onPress={() =>
									this.setState({ currentTab: "Log History" })
								}
								style={styles.tab}
							>
								<Text style={styles.inActiveText}>Log History</Text>
							</TouchableOpacity>
						)}
					</View>

					{this.state.currentTab == "Profile" ? (
						<View style={styles.form}>
							<ScrollView showsVerticalScrollIndicator={false}>
								{/* <Text style={styles.heading}>{`Hi ${this.state.name} welcome back !`}</Text> */}

								<View style={styles.inputContainer}>
									<Text style={styles.inputLable}>Name:</Text>
									<Text style={styles.textInput}>
										{this.state.name}
									</Text>
								</View>

								<View style={styles.inputContainer}>
									<Text style={styles.inputLable}>Email ID:</Text>
									<Text style={styles.textInput}>
										{this.state.email}
									</Text>
								</View>

								<View style={styles.inputContainer}>
									<Text style={styles.inputLable}>Mobile:</Text>
									<Text style={styles.textInput}>
										{this.state.mobile}
									</Text>
								</View>
								{/* <View style={styles.inputContainer}>
						<Text style={styles.inputLable}>GST:</Text>
						<Text style={styles.textInput}>{this.state.gst}</Text>
					</View> */}
								<View style={styles.inputContainer}>
									<Text style={styles.inputLable}>
										Billing Address:
									</Text>
									<Text style={styles.textInput}>
										{this.state.address}
									</Text>
								</View>

								<Text style={styles.footer}>
									Customer Since{" "}
									{showDateAsClientWant(
										this.props.route.params.data.created_on
									)}
								</Text>
							</ScrollView>
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
					) : null}

					{this.state.currentTab == "Company" ? (
						<View style={styles.form}>
							<ScrollView showsVerticalScrollIndicator={false}>
								<View style={styles.inputContainer}>
									<Text style={styles.inputLable}>GST:</Text>
									<Text style={styles.textInput}>
										{this.state.gst}
									</Text>
								</View>
								<View style={styles.inputContainer}>
									<Text style={styles.inputLable}>Company:</Text>
									<Text style={styles.textInput}>
										{this.state.company_name}
									</Text>
								</View>
								<View style={styles.inputContainer}>
									<Text style={styles.inputLable}>
										Billing Address:
									</Text>
									<Text style={styles.textInput}>
										{this.state.address}
									</Text>
								</View>

								{/* <Text style={styles.footer}>Customer Since {showDateAsClientWant(this.props.route.params.data.created_on)}</Text> */}
							</ScrollView>

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
					) : null}

					{this.state.currentTab == "History" ? (
						<View style={{ marginBottom: "25%" }}>
							<SectionList
								sections={this.state.allOrders}
								keyExtractor={(item, index) => item.id.toString()}
								renderItem={this.renderItem}
								contentContainerStyle={styles.listContainer}
								ListEmptyComponent={this.renderEmptyContainer()}
								renderSectionHeader={({ section: { title } }) => {
									return (
										<View style={styles.sectionHeader}>
											<View style={styles.sectionHeaderLeft}>
												<Text
													style={{
														fontSize: 26,
														color: Colors.white,
													}}
												>
													{moment(title, "YYYY-MM-DD").format(
														"DD"
													)}
												</Text>
											</View>
											<View style={styles.sectionHeaderRight}>
												<Text
													style={{
														fontSize: 16,
														color: Colors.white,
													}}
												>
													{moment(title, "YYYY-MM-DD").format(
														"dddd"
													)}
												</Text>
												<Text
													style={{
														fontSize: 14,
														color: Colors.white,
													}}
												>
													{moment(title, "YYYY-MM-DD").format(
														"MMMM YYYY"
													)}
												</Text>
											</View>
										</View>
									);
								}}
								refreshControl={
									<RefreshControl
										refreshing={this.state.refreshing}
										onRefresh={this.onRefresh}
									/>
								}
							/>
						</View>
					) : null}

					{this.state.currentTab == "Log History" ? (
						<View style={{ marginBottom: "22%" }}>
							<SectionList
								sections={this.state.allLog_History}
								keyExtractor={(item, index) => item.id.toString()}
								renderItem={this.renderLogItem}
								contentContainerStyle={styles.listContainer}
								ListEmptyComponent={this.renderEmptyContainer()}
								renderSectionHeader={({ section: { title } }) => {
									return (
										<View style={styles.sectionHeader}>
											<View style={styles.sectionHeaderLeft}>
												<Text
													style={{
														fontSize: 26,
														color: Colors.white,
													}}
												>
													{moment(title, "YYYY-MM-DD").format(
														"DD"
													)}
												</Text>
											</View>
											<View style={styles.sectionHeaderRight}>
												<Text
													style={{
														fontSize: 16,
														color: Colors.white,
													}}
												>
													{moment(title, "YYYY-MM-DD").format(
														"dddd"
													)}
												</Text>
												<Text
													style={{
														fontSize: 14,
														color: Colors.white,
													}}
												>
													{moment(title, "YYYY-MM-DD").format(
														"MMMM YYYY"
													)}
												</Text>
											</View>
										</View>
									);
								}}
								refreshControl={
									<RefreshControl
										refreshing={this.state.refreshing}
										onRefresh={this.onLogRefresh}
									/>
								}
							/>
						</View>
					) : null}
				</>
			</SafeAreaView>
		);
	};
}

const tabHeight = 50;
const windowHeight = Dimensions.get("screen").height;
const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: Colors.white,
	},
	form: {
		flex: 1,
		padding: 8,
	},
	heading: {
		fontSize: 16,
		color: Colors.textColor,
		fontWeight: "bold",
		marginVertical: 30,
		alignSelf: "center",
	},
	footer: {
		fontSize: 16,
		color: Colors.textColor,
		marginVertical: 30,
		alignSelf: "center",
	},
	inputContainer: {
		width: "100%",
		marginBottom: 25,
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
	tabContainer: {
		width: "100%",
		height: tabHeight,
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#d1d1d1",
		borderTopWidth: 0,
		borderTopColor: "#d1d1d1",
		backgroundColor: Colors.white,
		// elevation: 1,
		// marginTop: 10
	},
	tab: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		height: tabHeight,
	},
	underlineStyle: {
		backgroundColor: Colors.primary,
		height: 3,
	},
	activeTab: {
		height: tabHeight - 1,
		borderBottomWidth: 2,
		borderBottomColor: Colors.primary,
	},
	activeText: {
		fontSize: 14,
		fontWeight: "bold",
		color: Colors.primary,
	},
	inActiveText: {
		fontSize: 14,
		color: Colors.grey,
		// opacity: 0.8,
	},

	listContainer: {
		// flex: 1,
		// margin: 5,
		padding: 8,
	},
	card: {
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
		// elevation: 2,
	},
	Log_card: {
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		marginBottom: 10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
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
	desc: {
		fontSize: 14,
		color: Colors.textColor,
		marginBottom: 3,
		fontWeight: "normal",
		// opacity: 0.6,
	},
});
