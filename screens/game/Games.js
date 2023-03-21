import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	Image,
	FlatList,
	Modal,
	Dimensions,
	RefreshControl,
	SafeAreaView
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Ratings } from "../../components";
import Configs from "../../config/Configs";
import { GameListBySubCategory } from "../../services/APIServices";
import Loader from "../../components/Loader";
import ProgressiveImage from "../../components/ProgressiveImage";
import EmptyScreen from "../../components/EmptyScreen";


export default class Games extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sortBy: "",
			isSortModalOpen: false,
			list: [],
			isLoading: true,
			game_id: null,
			categoryID: this.props.route.params?.cat?.id,
			categoryName: this.props.route.params?.cat?.name,
			subCategoryID: this.props.route.params?.sub_cat?.id,
			tag_id: this.props.route.params?.tag_id,
			subCategoryName: this.props.route.params?.sub_cat?.name,
			refreshing: false,
		};
	}
	componentDidMount = () => {
		this.LoadData(this.state.sortBy);
		this.focusListner = this.props.navigation.addListener("focus", () => { this.LoadData(this.state.sortBy) })
	};

	componentWillUnmount() {
		this.focusListner();
	}


	LoadData = (sortBy) => {
		this.GameListBySubCategory(sortBy);
	}

	GameListBySubCategory = (sortBy) => {
		GameListBySubCategory(this.state.subCategoryID, sortBy)
		.then((response) => {
			this.setState({
				list: response.data,
				isLoading: false,
				refreshing: false,
			});
		})
		.catch((err) => {
			console.log(err);
		});
	}

	onRefresh = () => {
		this.setState({ refreshing: true }, () => { this.LoadData(this.state.sortBy) })
	}

	toggleSortModal = () =>	this.setState({ isSortModalOpen: !this.state.isSortModalOpen });

	setSortBy = (value) => {
		this.setState({
			sortBy: value,
			isSortModalOpen: false,
		});
		this.LoadData(value);
	}


	gotoGameDetails = (item) => {
		this.props.navigation.navigate("GameDetails", {
			game_id: item.id,
		});
	};

	gotoEditGame = (item) => this.props.navigation.navigate("EditGame",
		{
			cat: { id: this.state.categoryID, name: this.state.categoryName },
			sub_cat: { id: this.state.subCategoryID, name: this.state.subCategoryName },
			game: item
		});

	gotoAddGame = () => this.props.navigation.navigate("AddGame",
		{
			cat: { id: this.state.categoryID, name: this.state.categoryName },
			sub_cat: { id: this.state.subCategoryID, name: this.state.subCategoryName }
		});


	renderEmptyContainer = () => {
		return (
			<EmptyScreen />
		)
	}

	renderListItem = ({ item }) => {
		
		let url = '';
		if (item.image != '') {
			url = Configs.CATEGORY_IMAGE_URL + item.image;
		} else {
			url = 'https://www.osgtool.com/images/thumbs/default-image_450.png';
		}

		return (
			<TouchableHighlight
				underlayColor={Colors.textInputBg}
				onPress={this.gotoGameDetails.bind(this, item)}
				onLongPress={this.gotoEditGame.bind(this, item)}
			>
				<View style={styles.listItem}>
					<View style={styles.left}>
						<ProgressiveImage
							style={styles.image}
							source={{ uri: Configs.NEW_COLLECTION_URL + item.image }}
							resizeMode="cover"
						/>
					</View>
					<View style={styles.middle}>
						<Text style={styles.name}>{item.name}</Text>
						<Ratings value={item.rating} />
					</View>
					<View style={styles.right}>
						<Text style={styles.priceText}>
							<FontAwesome name="rupee" size={12} color={Colors.textColor} />
							{item.rent}
						</Text>
					</View>
				</View>
			</TouchableHighlight>
		)
	};
	
	render = () => {
		return (
			<SafeAreaView style={styles.container}>


				<Header
					title="Games"
					addAction={this.gotoAddGame}
					sortAction={this.toggleSortModal}
				/>
				{this.state.isLoading ?
					<Loader /> :

					<FlatList
						data={this.state.list}
						keyExtractor={(item, index) => item.id.toString()}
						renderItem={this.renderListItem}
						ListEmptyComponent={this.renderEmptyContainer()}
						refreshControl={
							<RefreshControl
								refreshing={this.state.refreshing}
								onRefresh={this.onRefresh}
							/>
						}
					/>
				}



				<Modal
					animationType="none"
					transparent={true}
					statusBarTranslucent={true}
					visible={this.state.isSortModalOpen}
				>
					<SafeAreaView style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							<View style={styles.modalHeader}>
								<Text style={{ fontSize: 16, color: Colors.textColor, }}>
									SORT BY
								</Text>
								<TouchableOpacity
									style={styles.closeButton}
									onPress={this.toggleSortModal}
								>
									<Ionicons name="close-outline" style={styles.closeButtonText} />
								</TouchableOpacity>
							</View>
							<View style={styles.modalBody}>

								<TouchableOpacity
									style={styles.radioItem}
									onPress={this.setSortBy.bind(this, "name ASC")}
								>
									<Text>Name -- Ascending</Text>

									<Ionicons
										name={
											this.state.sortBy === "name ASC"
												? "radio-button-on"
												: "radio-button-off"
										}
										color={Colors.primary}
										size={20}
									/>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.radioItem}
									onPress={this.setSortBy.bind(this, "name DESC")}
								>
									<Text>Name -- Descending</Text>
									<Ionicons
										name={
											this.state.sortBy === "name DESC"
												? "radio-button-on"
												: "radio-button-off"
										}
										color={Colors.primary}
										size={20}
									/>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.radioItem}
									onPress={this.setSortBy.bind(this, "rent ASC")}
								>
									<Text>Price -- Ascending</Text>
									<Ionicons
										name={
											this.state.sortBy === "rent ASC"
												? "radio-button-on"
												: "radio-button-off"
										}
										color={Colors.primary}
										size={20}
									/>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.radioItem}
									onPress={this.setSortBy.bind(this, "rent DESC")}
								>
									<Text>Price -- Descending</Text>
									<Ionicons
										name={
											this.state.sortBy === "rent DESC"
												? "radio-button-on"
												: "radio-button-off"
										}
										color={Colors.primary}
										size={20}
									/>
								</TouchableOpacity>

							</View>
						</View>
					</SafeAreaView>
				</Modal>
			</SafeAreaView>
		);
	}
}

const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	listItem: {
		flexDirection: "row",
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
		paddingLeft: 10
	},
	right: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	image: {
		width: "100%",
		height: 40,
	},
	name: {
		fontSize: 18,
		color: Colors.textColor,
		marginBottom: 3,
	},
	priceText: {
		fontSize: 14,
		color: Colors.textColor,
	},
	modalOverlay: {
		height: windowHeight,
		backgroundColor: "rgba(0,0,0,0.2)",
		justifyContent: "flex-end",
	},
	modalContainer: {
		backgroundColor: Colors.white,
		minHeight: Math.floor(windowHeight * 0.32),
		elevation: 5,
	},
	modalHeader: {
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
	closeButton: {
		backgroundColor: "#ddd",
		width: 25,
		height: 25,
		borderRadius: 40 / 2,
		alignItems: "center",
		justifyContent: "center",
		elevation: 0,
	},
	closeButtonText: {
		color: Colors.textColor,
		fontSize: 22,
	},
	modalBody: {
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
	radioLabel: {
		fontSize: 18,
		color: Colors.textColor,
	},
});
