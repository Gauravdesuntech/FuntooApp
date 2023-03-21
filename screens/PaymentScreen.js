import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	SectionList,
	RefreshControl,
	Linking,
	SafeAreaView
} from "react-native";
import moment from "moment";
import Colors from "../config/colors";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { GetEventsBills } from '../services/EventApiService';
import EmptyScreen from "../components/EmptyScreen";
import Configs from "../config/Configs";
import { FontAwesome } from "@expo/vector-icons";


export default class PaymentScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			orderData: [],
			isLoading: false,
			refreshing: false,
		}

	}


	componentDidMount() {
		this.loadOrderDetails();
	}

	loadOrderDetails = () => {
		GetEventsBills()
			.then((response) => {
				this.setState({
					orderData: response.data,
					isLoading: false,
					refreshing: false
				})
			})
			.catch((error) => { console.log(error) })
	}

	gotoManageOrder = (item) => {
		this.props.navigation.navigate("ManageOrder", { data: item })
	};

	onRefresh = () => {
		this.setState({ refreshing: true }, () => { this.loadOrderDetails() })
	}

	renderEmptyContainer = () => {
		return (
			<EmptyScreen />
		)
	}


	download = async (id) => {
		this.setState({ isLoading: true });
		let url = Configs.BASE_URL + "download/print_bill?id=" + id;
		Linking.openURL(url);
		this.setState({ isLoading: false });

	}

	renderDate = (date) => {
		let ab = "th";
		let day = moment(date, "YYYY-MM-DD").format("D");
		if (day == 1) {
			ab = "st";
		}
		if (day == 2) {
			ad = "nd";
		}
		let month = moment(date, "YYYY-MM-DD").format("MMM");
		let year = moment(date, "YYYY-MM-DD").format("YY");
		let day_name = moment(date, "YYYY-MM-DD").format("dddd");
		return `${day}${ab} - ${month} - ${year} (${day_name})`;
	}


	lsitItem = ({ item }) => {
		return (
			<View
				key={item.id.toString()}
				activeOpacity={0.8}
				style={styles.listRow}
			>
				<View style={styles.leftPart}>
					<Text style={[styles.desc, { fontSize: 16 }]}>
						{(item.customer_name !== null ? item.customer_name : "")}
					</Text>
					<Text style={styles.desc}>{"Order#: " + item.odid}</Text>
					<Text style={styles.desc}>Order Date: {this.renderDate(item.create_date)}</Text>

					{item.invoice_date && <View>
						<Text style={styles.desc}>{"Invoice#: " + item.invoice_number}</Text>
						<Text style={styles.desc}>Invoice Date: {this.renderDate(item.invoice_date)}</Text>
					</View>
					}
					<Text style={styles.desc}>GST: {item.gst}</Text>
					<Text style={styles.desc}>Total Amount: {item.total_amount}</Text>
					<Text style={styles.desc}>Paid Amount: {item.paid_amount}</Text>
					<Text style={styles.desc}>Paid Status:
						{!item.paid_status || item.paid_status == 0 && <Text style={{ color: Colors.danger }}> UnPaid</Text>}
						{item.paid_status == 1 && <Text style={{ color: Colors.primary }}> Paid</Text>}

					</Text>
				</View>

				<TouchableOpacity style={[styles.rightPart, { alignItems: 'flex-end' }]}
					onPress={() => this.download(item.id)}>
					<FontAwesome
						name="download"
						color={Colors.primary}
						size={24}

					/>
				</TouchableOpacity>
			</View>
		)
	};

	render = () => (
		<SafeAreaView style={styles.container}>
			<Header title="Payments" />
			{this.state.isLoading ? (
				<Loader />
			) : (
				<SectionList
					sections={this.state.orderData}
					keyExtractor={(item, index) => item.odid}
					renderItem={this.lsitItem}
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

		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
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
	listRow: {
		flexDirection: "row",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		elevation: 10,
		marginBottom: 10,
		//margin: 5,
	},

	leftPart: {
		width: "80%",
		justifyContent: "center",
	},
	rightPart: {
		width: "20%",
		justifyContent: "center",
	},
	desc: {
		fontSize: 14,
		color: Colors.textColor,
		marginBottom: 3,
		fontWeight: "normal",
		// opacity: 0.9,
	},
});
