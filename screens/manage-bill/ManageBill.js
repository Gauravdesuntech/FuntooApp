import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	SectionList,
	RefreshControl,
	Dimensions,
	SafeAreaView
} from "react-native";
import moment from "moment";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import EmptyScreen from "../../components/EmptyScreen";
import OverlayLoader from "../../components/OverlayLoader";
import { GetAllInvoice } from "../../services/OrderService";
import { showDateAsClientWant, showTimeAsClientWant } from "../../utils/Util";

export default class ManageBill extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			invoiceList: [],
			isLoading:true,
		}
	}

	componentDidMount() {
		this.focusListner = this.props.navigation.addListener("focus", () => {
			this.loadOrderDetails();
		});
	}

	componentWillUnmount() {
		this.focusListner()
	}

	loadOrderDetails = () => {
		GetAllInvoice()
		.then( (result) => {
			if(result.is_success) {
				this.setState({
					invoiceList: result.data
				});
			}
		})
		.catch( err => console.log(err))
		.finally( () => {
			this.setState({
				isLoading: false,
				refreshing: false
			});
		});
	}

	onRefresh=()=>{
		this.loadOrderDetails();
	}

	renderEmptyContainer=()=> {
		return(
			<EmptyScreen/>
		)
	}

	listItem = ({ item }) => {
		console.log(item);
		return (
			<TouchableOpacity
				key={item.id.toString()}
				activeOpacity={0.8}
				style={styles.card}
				onPress={
						() => this.props.navigation.navigate("OrderInvoice", {
						id: item.id
					})
				}
			>
				<Text style={styles.desc}>{"Invoice Number#: " + item.invoice_number}</Text>
				{/* <Text style={styles.desc}>{"Event Name: " + item.event_name}</Text> */}
				<Text style={styles.desc}>Event Date: {showDateAsClientWant(item.event_start_timestamp)}</Text>
				<Text style={styles.desc}>{"Venue: " + item.venue}</Text>
				<Text style={styles.desc}>
					Setup by: {showDateAsClientWant(item.setup_timestamp)} - {showTimeAsClientWant(item.setup_timestamp)}
				</Text>
				<Text style={styles.desc}>
					Event Time: {showTimeAsClientWant(item.event_start_timestamp)}  -  {showTimeAsClientWant(item.event_end_timestamp)}
				</Text>

				<Text style={styles.desc}>
					{"Client Name: " + (item.client_name !== null ? item.client_name : "")}
				</Text>

				<Text style={styles.desc}>
					{"Client Mobile: " + (item.client_mobile !== null ? item.client_mobile : "")}
				</Text>
			</TouchableOpacity>
		)
	};

	render = () => (
		<SafeAreaView style={styles.container}>
			<Header title="Manage Bills" />
			{this.state.isLoading ? (
				<OverlayLoader visible={this.state.isLoading} />
			) : (
				<SectionList
					sections={this.state.invoiceList}
					keyExtractor={(item, index) => item.id}
					renderItem={this.listItem}
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

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

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
	card: {
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		elevation: 10,
		marginBottom: 10,
	},
	desc: {
		fontSize: 14,
		color: Colors.textColor,
		marginBottom: 3,
		fontWeight: "normal",
		// opacity: 0.9,
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
		elevation: 1,
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
borderWidth:1,
		padding: 9,
		fontSize: 14,
		width: "100%",
		borderWidth: 1,
		borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		color: Colors.textColor,
	},
});
