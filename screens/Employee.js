import React, { Component } from 'react'
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
	SafeAreaView,
	FlatList
} from 'react-native';
import Colors from "../config/colors";
import Header from '../components/Header';
import EmptyScreen from '../components/EmptyScreen';
import { Getemployee } from '../services/APIServices';
import Loader from '../components/Loader';
import AppContext from '../context/AppContext';

export default class Employee extends Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			isLoading: true,
			refreshing: false,
		}
	}
	getEmployee = () => {
		Getemployee()
			.then((response) => {
				//   console.log("response....................", response);
				this.setState({
					data: response,
					isLoading: false
				});
			})
			.catch((error) => {
				console.log(error);
			});
	}
	onRefresh = () => {
		this.setState({ refreshing: true }, () => { this.getEmployee() });
	};
	componentDidMount() {
		this.focusListner = this.props.navigation.addListener("focus", () => { this.getEmployee() })
	}
	componentWillUnmount() {
		this.focusListner();
	}
	gotoAddDesignation = () => {
		if (this.context.userData.action_types.indexOf('Add') >= 0) {
			this.props.navigation.navigate("AddEmployee", {
				data: null,
			})
		}
	};

	renderEmptyContainer = () => {
		return (
			<EmptyScreen />
		)
	}
	listItem = ({ item }) => {
		let relatives_data = JSON.parse(item.relatives);
		return (
			<TouchableOpacity
				key={item.id.toString()}
				activeOpacity={0.8}
				style={styles.card}
				onPress={() => this.editRole(item)}
			>
				<Text style={styles.desc}>
					{"Employee Name: "}
					{item.name}
				</Text>
				{item.address == null ? null :
					<Text style={styles.desc}>
						{"Address: "}
						{item.address}
					</Text>
				}
				<Text style={styles.desc}>
					{"Mobile: "}
					{item.phone}
				</Text>
				<Text style={styles.desc}>
					{"Email: "}
					{item.email}
				</Text>
				{relatives_data.map((data) => {
					console.log(data)
					return (

						<>
							<Text style={styles.desc}>
								{"Relation: "}
								{data.name}
							</Text>
							<Text style={styles.desc}>
								{"Mobile: "}
								{data.phone}
							</Text>
						</>
					)
				})}

			</TouchableOpacity>


		)
	};
	editRole = (item) => {
		if (this.context.userData.action_types.indexOf('Edit') >= 0) {
			this.props.navigation.navigate("AddEmployee", {
				data: item,
			})
		};
	}
	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Header title="Employee"
					addAction={this.gotoAddDesignation}
				/>
				{this.state.isLoading ?
					<Loader />
					:
					<FlatList
						data={this.state.data}
						keyExtractor={(item, index) => item.id.toString()}
						renderItem={this.listItem}
						contentContainerStyle={styles.listContainer}
						ListEmptyComponent={this.renderEmptyContainer()}
						refreshControl={
							<RefreshControl
								refreshing={this.state.refreshing}
								onRefresh={this.onRefresh}
							/>
						}
					/>
				}
			</SafeAreaView>
		)
	}
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
		minHeight: Math.floor(windowHeight * 0.32),
		elevation: 5,
	},

	filterModalHeader: {
		height: 50,
		flexDirection: "row",
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.white,
		elevation: 1,
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
		elevation: 0,
	},
	filterCloseButtonText: {
		color: Colors.textColor,
		fontSize: 22,
	},

	filterModalBody: {
		flex: 1,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},

	radioItem: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 5,
	},
	listContainer: {
		padding: 8,
	},
});