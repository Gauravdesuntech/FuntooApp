import React from "react";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	TouchableOpacity
} from "react-native";
import ProgressiveImage from "../components/ProgressiveImage";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import { Ionicons, AntDesign } from "@expo/vector-icons";

export default class FlatListCategoryComponent extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			is_visible: false
		}
	}

    gotoSubCategory = (item) => this.props.navigation.navigate("SubCategory", { category_id: item.id, category_name: item.name })
	gotoEditCategory = (item) => this.props.navigation.navigate("EditCategory", { category_id: item.id });
	GoToGamesByTag = (data) => {
		this.props.navigation.navigate("GamesByTag", { data: { tag_id: data.tag_id, name: data.tag_name } });
	};

	render() {
		let url = '';
		if (this.props.item.image != '') {
			url = Configs.CATEGORY_IMAGE_URL + this.props.item.image;
		} else {
			url = 'https://www.osgtool.com/images/thumbs/default-image_450.png';
		}

		return (
			<>
				{
					<View style={styles.listItem}>

						<TouchableOpacity style={{ flexDirection: 'row' }}

							onPress={this.props.onpress.bind(this, this.props.item)}
							onLongPress={this.gotoEditCategory.bind(this, this.props.item)}>
							<View style={styles.left}>
								<ProgressiveImage
									style={styles.image}
									source={{ uri: url }}
									resizeMode="cover"
								/>
							</View>
							<View style={styles.middle}>
								<Text style={styles.name}>{this.props.item.name}

									{
										this.props.item.tags.length > 0 ? (
											<TouchableOpacity 
												onPress={ () => { this.setState( { is_visible : !this.state.is_visible } ) } }
											>
											<AntDesign name="down" size={24} color={Colors.textInputBorder} />
											</TouchableOpacity>
										) : null
									}
								

								</Text>
							</View>
							<View style={styles.right}>
								<View style={styles.qtyContainer}>
									<Text style={styles.qty}>{this.props.item.total_game}</Text>
								</View>
								<Ionicons
									name="chevron-forward"
									size={20}
									color={Colors.textInputBorder}
								/>
							</View>

						</TouchableOpacity>
						
						{
							

							( this.state.is_visible ) ? (
								<View style={{ marginTop: 10 }}>
									<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
										{this.props.item.tags?.map(tag => {
											return (
												<TouchableOpacity key={tag.id} style={{ elevation: 4, backgroundColor: '#F5F5F5', padding: 2, paddingLeft: 20, paddingRight: 20, borderRadius: 10, margin: 5 }}
													onPress={() => this.GoToGamesByTag(tag)}>
													<Text>{tag.tag_name}</Text>
												</TouchableOpacity>
											)
										})}
									</ScrollView>
								</View>
							) : null
						}
					</View>
				}
			</>
		)
	}
}

const styles = StyleSheet.create({
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
	}
});