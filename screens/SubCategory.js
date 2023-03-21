import React from "react";
import {
	StyleSheet,
	FlatList, 
	SafeAreaView,
	RefreshControl,
	View,
	TouchableOpacity,
	Text
} from "react-native";
import Colors from "../config/colors";
import { Header } from "../components";
import { GetSubCategorys } from "../services/CategoryService";
import Loader from "../components/Loader";
import EmptyScreen from "../components/EmptyScreen";
import Configs from "../config/Configs";
import ProgressiveImage from "../components/ProgressiveImage";
import { Ionicons } from "@expo/vector-icons";

export default class SubCategory extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			subCategoryList: [],
			isLoading: true,
			category_id: this.props.route.params.category_id,
			category_name: this.props.route.params.category_name,
			cat_id: this.props.route.params.category_id,
			refreshing: false,
		};
	}

	componentDidMount = () => {
		console.log("............SubCategory.................")
		this.loadSubCategoryList();
		this.focusListner = this.props.navigation.addListener("focus", () => { this.loadSubCategoryList() })
	};

	componentWillUnmount() {
		this.focusListner();
	}

	loadSubCategoryList = () => {
		this.getSubCatData();
	};

	getSubCatData = () => {
		GetSubCategorys(this.state.category_id)
		.then((response) => {
			console.log(response);
			this.setState({
				subCategoryList: response.data,
				isLoading: false,
				refreshing: false,
			});
		})
		.catch((err) => {
			console.log(err);
		});
	}

	onRefresh = () => {
		this.setState({ refreshing: true }, () => { this.getSubCatData() })
	}

	renderEmptyContainer = () => {
		return (
			<EmptyScreen />
		)
	}

	gotoGames = (item) => this.props.navigation.navigate("Games",
		{
			cat: { id: this.state.category_id, name: this.state.category_name },
			sub_cat: { id: item.id, name: item.name }
		});

	gotoAddSubCategory = () => this.props.navigation.navigate("AddSubCategory",
		{ cat: { id: this.state.category_id, name: this.state.category_name } });

	renderItem = ({item}) => {
		let url = '';
		if (item.image != '') {
			url = Configs.CATEGORY_IMAGE_URL + item.image;
		} else {
			url = 'https://www.osgtool.com/images/thumbs/default-image_450.png';
		}

		return	(
			<>
				<View style={styles.listItem}>
					<TouchableOpacity style={{ flexDirection: 'row' }}
						onPress={this.gotoGames.bind(this, item) }
						onLongPress={this.gotoAddSubCategory.bind(this, item)}>
						<View style={styles.left}>
							<ProgressiveImage
								style={styles.image}
								source={{ uri: url }}
								resizeMode="cover"
							/>
						</View>
						<View style={styles.middle}>
							<Text style={styles.name}>{item.name}</Text>
						</View>
						<View style={styles.right}>
							<View style={styles.qtyContainer}>
								<Text style={styles.qty}>{item.total_game}</Text>
							</View>
							<Ionicons
								name="chevron-forward"
								size={20}
								color={Colors.textInputBorder}
							/>
						</View>

					</TouchableOpacity>
				</View>
			</>
		)
	}

	render = () => {
		return (
			<SafeAreaView style={styles.container}>
				<Header title=" " addAction={this.gotoAddSubCategory} />
				{this.state.isLoading ? (
					<Loader />
				) : (
					<FlatList
						data={this.state.subCategoryList}
						keyExtractor={(item, index) => item.id.toString()}
						renderItem={this.renderItem}
						ListEmptyComponent={this.renderEmptyContainer()}
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
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
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
		paddingLeft: 10
	},
	right: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
    name: {
		fontSize: 18,
		color:Colors.textColor,
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
	}
});