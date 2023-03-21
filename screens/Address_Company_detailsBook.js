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
	RefreshControl,
	FlatList
} from "react-native";
import Colors from "../config/colors";
import Header from "../components/Header";
import { isEmail, showDateAsClientWant } from "../utils/Util";
import AppContext from "../context/AppContext";
import { writeUserData } from "../utils/Util";
import { update_admin_details } from "../services/APIServices";
import OverlayLoader from "../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { GetCustomerOrder, Get_ordersByCompany, GetCompany_Customers } from "../services/OrderService";
import EmptyScreen from "../components/EmptyScreen";
import moment from "moment";
import {
	Ionicons,
	MaterialIcons,
	MaterialCommunityIcons
} from "@expo/vector-icons";

export default class Address_Company_detailsBook extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			mobile: "",
			gst: "",
			address: "",
			id: null,
			isLoading: false,
			currentTab: 'Order',
			showAlertModal: false,
			alertMessage: "",
			alertType: '',
			allOrders: [],
			allHistoryOrders: [],
			userData: [],
			refreshing: false,
		};
	}

	componentDidMount() {
		// console.log(".........this.props.route.params.data...........", this.props.route.params.data)
		this.focusListner = this.props.navigation.addListener("focus", () => {
			this.getOrderData();
			this.getCompanyUserData();
			this.getOrderHistoryData()
		})
		this.setState({
			name: this.props.route.params.data.name,
			email: this.props.route.params.data.email,
			mobile: this.props.route.params.data.mobile,
			address: this.props.route.params.data.billing_address,
			gst: this.props.route.params.data.gstin,
		})
	}

	componentWillUnmount() {
		this.focusListner();
	}

	onRefresh = () => {
		this.setState({ refreshing: true }, () => {
			this.getOrderData();
			this.getOrderHistoryData()
		})
	}

	hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
	};

	getCompanyUserData = () => {
		this.setState({ isLoading: true })
		let data = {
			id: this.props.route.params.data.id
		}
		// console.log(data);
		GetCompany_Customers(data).then((res) => {
			this.setState({ userData: res })
			// console.log('........................res...................',res);
		}).catch(err => { })
	}

	getOrderData = () => {
		this.setState({ isLoading: true })
		let status = ''
		Get_ordersByCompany(this.props.route.params.data.id, status).then((res) => {
			// console.log(res);
			this.setState({
				isLoading: false,
				allOrders: res.data,
				refreshing: false
			})
		}).catch(err => { this.setState({ isLoading: false }) });
	}
	getOrderHistoryData = () => {
		this.setState({ isLoading: true })
		let status = 'completed'
		Get_ordersByCompany(this.props.route.params.data.id, status).then((res) => {
			// console.log(res);
			this.setState({
				isLoading: false,
				allHistoryOrders: res.data,
				refreshing: false
			})
		}).catch(err => { this.setState({ isLoading: false }) });
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

	renderEmptyContainer = () => {
		return (
			<EmptyScreen />
		)
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

	renderOrderItem = ({ item }) => {
		return (
			<View style={styles.card}>
				<View>
					<TouchableOpacity
						key={item.id.toString()}
					// onPress={() => this.props.navigation.navigate("EventEnquiryDetail", { data: item })}
					>
						<Text style={styles.desc}>ENQ#: {item.order_id.toString().replace('O', 'E')}</Text>
						<Text style={styles.desc}>{"Event Date: "}{showDateAsClientWant(item.event_start_timestamp)}</Text>
						<Text style={styles.desc}>{"Venue: " + item.venue}</Text>
						<Text style={styles.desc}>Setup by: {showDateAsClientWant(item.event_end_timestamp)}</Text>
						<Text style={styles.desc}>Event Time: {this.getEventStartTime(item.event_start_timestamp)} - {this.getEventEndTime(item.event_end_timestamp)}</Text>

						<Text style={styles.desc}>
							{"Client Name: " + (item.customer_name !== null ? item.customer_name : "")}
						</Text>

						{this.getOrderStatus(item.order_status)}

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

			</View>
		)
	};
	renderItem = ({ item }) => {
		return (
			<View style={styles.card}>
				<View>
					<TouchableOpacity
						key={item.id.toString()}
					// onPress={() => this.props.navigation.navigate("EventEnquiryDetail", { data: item })}
					>
						<Text style={styles.desc}>ENQ#: {item.order_id.toString().replace('O', 'E')}</Text>
						<Text style={styles.desc}>{"Event Date: "}{showDateAsClientWant(item.event_start_timestamp)}</Text>
						<Text style={styles.desc}>{"Venue: " + item.venue}</Text>
						<Text style={styles.desc}>Setup by: {showDateAsClientWant(item.event_end_timestamp)}</Text>
						<Text style={styles.desc}>Event Time: {this.getEventStartTime(item.event_start_timestamp)} - {this.getEventEndTime(item.event_end_timestamp)}</Text>

						<Text style={styles.desc}>
							{"Client Name: " + (item.customer_name !== null ? item.customer_name : "")}
						</Text>

						{this.getOrderStatus(item.order_status)}

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

			</View>
		)
	};

	listItem = ({ item }) => {
		return (
			<TouchableOpacity
				style={{ borderBottomWidth: 1, borderBottomColor: "lightgray", }}
			// onPress={() => this.gotodetails(item)}
			>
				<View style={{ margin: 10, }}>

					<View
						style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}
					>
						<Ionicons name="ios-person-outline" size={20} color={Colors.primary} />
						<Text style={{ color: Colors.textColor, marginLeft: 5 }}>
							{item.name !== null ? item.name : ""}
						</Text>
					</View>
					{item.mobile !== null ?
						<View
							style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}
							// onPress={()=> {this.dialCall(item.mobile)}}
							activeOpacity={1}
						>
							<Ionicons name="ios-call-outline" size={20} color={Colors.primary} />
							<Text style={{ color: Colors.textColor, marginLeft: 5 }}>
								{item.mobile}
							</Text>
						</View>
						: null}
					{item.email !== null ?
						<View
							style={{ flexDirection: "row", alignItems: "center", }}
							// onPress={()=> Linking.openURL('mailto:'+ item.email)}
							activeOpacity={1}
						>
							<Ionicons name="ios-mail-outline" size={20} color={Colors.primary} />
							<Text style={{ color: Colors.textColor, marginLeft: 5 }}>
								{item.email}
							</Text>
						</View>
						: null}
				</View>
			</TouchableOpacity>
		);
	};

	render = () => {
		return (
			<SafeAreaView style={styles.container}>
				<Header title={this.props.route.params.data.company_name} search={false} />
				{this.state.isLoading && <OverlayLoader />}
				<>
					<View style={styles.tabContainer}>

						{this.state.currentTab == "Order" ?
							<View style={[styles.tab, styles.activeTab, { flexDirection: 'row', alignItems: 'center' }]}>
								<Text style={styles.activeText}>
									Order
								</Text>

							</View>
							: <TouchableOpacity
								onPress={() => this.setState({ currentTab: 'Order' })}
								style={styles.tab}
							>
								<Text
									style={styles.inActiveText}
								>
									Order
								</Text>
							</TouchableOpacity>
						}

						{this.state.currentTab == "User" ?
							<View style={[styles.tab, styles.activeTab, { flexDirection: 'row', alignItems: 'center' }]}>
								<Text style={styles.activeText}>
									User
								</Text>

							</View>
							: <TouchableOpacity
								onPress={() => this.setState({ currentTab: 'User' })}
								style={styles.tab}
							>
								<Text
									style={styles.inActiveText}
								>
									User
								</Text>
							</TouchableOpacity>
						}

						{this.state.currentTab == "History" ?
							<View style={[styles.tab, styles.activeTab, { flexDirection: 'row', alignItems: 'center' }]}>
								<Text style={styles.activeText}>
									History
								</Text>

							</View>
							: <TouchableOpacity
								onPress={() => this.setState({ currentTab: 'History' })}
								style={styles.tab}
							>
								<Text
									style={styles.inActiveText}
								>
									History
								</Text>
							</TouchableOpacity>
						}

					</View>



					{this.state.currentTab == "Order" ?
						<View>
							<SectionList
								sections={this.state.allOrders}
								keyExtractor={(item, index) => item.id.toString()}
								renderItem={this.renderOrderItem}
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
						</View>
						: null}

					{this.state.currentTab == "User" ?
						< FlatList
							data={this.state.userData}
							keyExtractor={(item, index) => item.id.toString()}
							renderItem={this.listItem}
							initialNumToRender={this.state.userData?.length}
							ListEmptyComponent={<EmptyScreen />}
							refreshControl={
								<RefreshControl
									refreshing={this.state.refreshing}
									onRefresh={this.onRefresh}
								/>
							}
						/>
						: null}

					{this.state.currentTab == "History" ?
						<View>
							<SectionList
								sections={this.state.allHistoryOrders}
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
						</View>
						: null}
				</>
			</SafeAreaView>
		)
	};
}

const tabHeight = 50;
const windowHeight = Dimensions.get("screen").height;
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
