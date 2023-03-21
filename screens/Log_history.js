import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	SectionList,
	RefreshControl,
	SafeAreaView,
	Dimensions,
} from "react-native";
import moment from "moment";
import Colors from "../config/colors";
import { Header } from "../components";
import Loader from "../components/Loader";
import EmptyScreen from "../components/EmptyScreen";
import { GetLogHistory, GetLogHistoryDetail } from "../services/APIServices";
import AccordianChild from "./AccordianChild";

export default class Log_history extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			logData: [],
			isLoading: false,
			refreshing: false,
			logHistory: [],
		};
	}

	componentDidMount = () => {
		this.focusListner = this.props.navigation.addListener("focus", () => {
			this.loadLogHistory();
		});
		this.loadLogHistory_User();
	};

	componentWillUnmount() {
		this.focusListner();
	}

	loadLogHistory = () => {
		this.setState({ isLoading: true });
		GetLogHistory()
			.then((result) => {
				if (result.is_success) {
					// console.log("..................user's-log-history-result.........",result.data)
					this.setState({
						logData: result.data,
					});
				}
			})
			.catch((err) => console.log(err))
			.finally(() => {
				this.setState({
					isLoading: false,
					refreshing: false,
				});
			});
	};

	// function call for getting data for dropDown by sharad--->>>>

	loadLogHistory_User = () => {
		this.setState({
			isLoading: false,
		});
		GetLogHistoryDetail()
			.then((result) => {
				if (result.is_success) {
					// console.log("..................user's-log-history-result.........",result.data)
					this.setState({
						logHistory: result.data,
					});
				}
			})
			.catch((err) => console.log(err))
			.finally(() => {
				this.setState({
					isLoading: false,
				});
			});
	};

	onRefresh = () => {
		this.setState({ refreshing: true }, () => {
			this.loadLogHistory();
		});
	};

	renderEmptyContainer = () => {
		return (
			<View style={{ height: windowHeight }}>
				<EmptyScreen />
			</View>
		);
	};

	onRefresh = () => {
		this.setState({ refreshing: true }, () => {});
	};

	renderEmptyContainer = () => {
		return (
			<View style={{ height: windowHeight }}>
				<EmptyScreen />
			</View>
		);
	};

	listItem = ({ item }) => {
		// console.log("..........item-data-on log-history............", item);

		// let time = moment(item.date).format("h:mm a");
		// return (
		// 	<View style={[styles.card]}>
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
				<AccordianChild item={item} />
			</View>
		);
	};

	render = () => {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				{/* <Accordian /> */}
				<View style={styles.container}>
					<Header title="Log History" />
					{this.state.isLoading ? (
						<Loader />
					) : (
						<SectionList
							sections={this.state.logHistory}
							keyExtractor={(item, index) => index}
							renderItem={this.listItem}
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
												{moment(title, "YYYY-MM-DD").format("DD")}
											</Text>
										</View>
										<View style={styles.sectionHeaderRight}>
											<Text
												style={{
													fontSize: 16,
													color: Colors.white,
												}}
											>
												{moment(title, "YYYY-MM-DD").format("dddd")}
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
					)}
				</View>
			</SafeAreaView>
		);
	};
}

const windowwidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: Colors.white,
	},
	listItem: {
		borderBottomColor: Colors.textInputBorder,
		borderBottomWidth: 1,
		padding: 10,
	},
	left: {
		width: "20%",
		justifyContent: "center",
	},
	middle: {
		justifyContent: "center",
		flex: 1,
		paddingLeft: 10,
	},
	right: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	name: {
		fontSize: 18,
		color: Colors.textColor,
	},
	qtyContainer: {
		height: 25,
		width: 25,
		borderRadius: 100,
		backgroundColor: Colors.primary,
		justifyContent: "center",
		alignItems: "center",
		padding: 3,
	},
	image: {
		width: "100%",
		height: 40,
	},
	qty: {
		fontSize: 14,
		color: Colors.white,
		textAlign: "center",
	},
	moreMenu: {
		alignSelf: "center",
		fontSize: 11,
		marginVertical: 2,
		marginLeft: 1,
		padding: 10,
		backgroundColor: Colors.primary,
		color: Colors.white,
		borderWidth: 0.7,
		borderColor: "#dfdfdf",
		borderRadius: 5,
	},
	Menu: {
		borderRadius: 5,
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
		marginBottom: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	desc: {
		fontSize: 14,
		color: Colors.textColor,
		marginBottom: 3,
		fontWeight: "normal",
		// opacity: 0.9,
	},
});
