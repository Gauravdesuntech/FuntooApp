import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableHighlight,
	FlatList, SafeAreaView,
	RefreshControl,
	Alert,
	TouchableOpacity,
} from "react-native";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import Configs from "../../config/Configs";
import { TagList, DeleteTag } from "../../services/TagApiServices";
import Loader from "../../components/Loader";
import EmptyScreen from "../../components/EmptyScreen";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AppContext from "../../context/AppContext";

export default class TagAreaMaster extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			strageList: [],
			isLoading: true,
			refreshing: false,
		};
	}

	componentDidMount = () => {
		this.loadTagList();
		this.focusListner = this.props.navigation.addListener("focus", () => { this.loadTagList() })
	};

	componentWillUnmount() {
		this.focusListner();
	}

	loadTagList = () => {
		this.setState({ isLoading: true })
		this.getTagData();
	};

	getTagData = () => {
		TagList()
			.then((response) => {
				this.setState({
					strageList: response.data,
					isLoading: false,
					refreshing: false,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}


	DeleteTag = (id) => {
	if(this.context.userData.action_types.indexOf('Delete') >= 0)
	{Alert.alert(
			"Are your sure?",
			"Are you sure you want to remove this tag?",
			[
				{
					text: "Yes",
					onPress: () => {
						DeleteTag({ id: id }).then(res => {
							if (res.is_success) {
								this.getTagData();
							}

						}).catch((error) => {
							Alert.alert("Server Error", error.message);
						})
					},
				},
				{
					text: "No",
				},
			]
		)};
	}

	onRefresh = () => {
		this.setState({ refreshing: true }, () => { this.loadTagList() })
	}

	renderEmptyContainer = () => {
		return (
			<EmptyScreen />
		)
	}


	gotoEditTag = (item) =>{ 
		if(this.context.userData.action_types.indexOf('Edit') >= 0 )
		{this.props.navigation.navigate("EditTagMaster", { tag_id: item.id, tag_name: item.name })};}

	gotoAddTag = () => this.props.navigation.navigate("AddTagMaster");

	renderListItem = ({ item }) => {
		let url = '';
		if (item.image != '') {
			url = Configs.CATEGORY_IMAGE_URL + item.image;
		} else {
			url = 'https://www.osgtool.com/images/thumbs/default-image_450.png';
		}

		return (
			<>
				{
					<TouchableHighlight
						underlayColor={Colors.textInputBg}
						onPress={this.gotoEditTag.bind(this, item)}
						onLongPress={this.DeleteTag.bind(this, item.id)}
					>
						<View style={styles.listItem}>
							<View style={styles.middle}>
								<Text style={styles.name}>{item.name}</Text>
							</View>
							<View style={styles.qtyContainer}>
							{this.context.userData.action_types.indexOf('Edit') >= 0 ?
                <TouchableOpacity
                    style={{ padding: 3 }}
                    onPress={this.gotoEditTag.bind(this, item)}
                >
                    <MaterialIcons name="create" size={22} color={Colors.success} />
                </TouchableOpacity>
				:null}
				 {this.context.userData.action_types.indexOf('Delete') >= 0 ?
                <TouchableOpacity style={{ padding: 3 }}>
                        <MaterialIcons name="delete" size={22} color={Colors.danger} onPress={this.DeleteTag.bind(this, item.id)} />
                    </TouchableOpacity>
					:null}
            </View>
						</View>
					</TouchableHighlight>
				}
			</>
		)
	};

	render = () => {
		return (
			<SafeAreaView style={styles.container}>
				<Header title="Tags" addAction={this.gotoAddTag} />
				{this.state.isLoading ? (
					<Loader />
				) : (
					<FlatList
						data={this.state.strageList}
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
	},
	// qtyContainer: {
	// 	height: 25,
	// 	width: 25,
	// 	borderRadius: 100,
	// 	backgroundColor: Colors.primary,
	// 	justifyContent: "center",
	// 	alignItems: "center",
	// 	padding: 3,
	// },
	qty: {
		fontSize: 14,
		color: Colors.white,
		textAlign: "center"
	},
	qtyContainer: {
        width: "10%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        
    },
});
