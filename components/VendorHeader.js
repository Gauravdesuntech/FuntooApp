import React from "react";
import {
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	StatusBar,
	Dimensions
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
	Ionicons,
	FontAwesome,
	MaterialIcons,
	AntDesign,
} from "@expo/vector-icons";
import Colors from "../config/colors";

export default function VendorHeader(props){
	const navigation = useNavigation();
	const route = useRoute();
	const routeName = route.name;
	const toggleDrawer = () => navigation.toggleDrawer();
	const gotoBack = () => navigation.goBack();

	return (
		<>
			<StatusBar barStyle="dark-content" backgroundColor={Colors.primary} />
			<View style={styles.headerContainer}>
				<TouchableOpacity
					activeOpacity={1}
					onPress={routeName === "Home" ? toggleDrawer : gotoBack}
					style={styles.headerLeft}
				>
					{routeName === "Home" ? (
						<FontAwesome name="navicon" size={22} color={Colors.white} />
					) : (
						<Ionicons name="arrow-back" size={26} color={Colors.white} />
					)}
				</TouchableOpacity>

				
				{routeName === "Home" ? (
                     <View style={[styles.headerMiddle, {alignItems: 'flex-start', justifyContent: 'flex-start'}]}>
                     <Text
                       numberOfLines={1}
                       ellipsizeMode="tail"
                       style={{ fontSize: 22, color: Colors.white }}
                     >
                       Home
                     </Text>
                   </View>
                   
        ) : (
          <View style={styles.headerMiddle}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 22, color: Colors.white }}
            >
              {props.title}
            </Text>
          </View>
        )}
		{
			routeName !== 'Home'?
			<View style={styles.headerRight}>

				{/* {typeof props.searchIcon !== "undefined" ? (
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={()=>props.navigation.navigate("SearchScreen")}
							style={{ padding: 5 }}
						>
							<Ionicons name="search" size={20} color={Colors.white} />
						</TouchableOpacity>
					) : null} */}

					{typeof props.addAction !== "undefined" ? (
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={props.addAction}
							style={{ padding: 5 }}
						>
							<AntDesign name="pluscircleo" size={20} color={Colors.white} />
						</TouchableOpacity>
					) : null}
					{typeof props.sortAction !== "undefined" ? (
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={props.sortAction}
							style={{ padding: 5 }}
						>
							<MaterialIcons name="sort" size={24} color={Colors.white} />
						</TouchableOpacity>
					) : null}
				</View> : null
		}
				
			</View>
		</>
	);
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
	headerContainer: {
		height: 50,
		paddingHorizontal: 5,
		flexDirection: "row",
		width: "100%",
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "space-between",
	},
	headerLeft: {
		width: "10%",
		height: "100%",
		alignItems: "flex-start",
		justifyContent: "center",
	},
	headerMiddle: {
		width: "58%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 3,
	},
	headerRight: {
		minWidth: "15%",
		maxWidth: "32%",
		height: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
	},
	searchModalOverlay: {
		justifyContent: "center",
		alignItems: "center",
		width: windowWidth,
		height: windowHeight,
	},
	seacrhModalContainer: {
		flex: 1,
		width: windowWidth,
		height: windowHeight,
		backgroundColor: Colors.white,
	},
	searchModalHeader: {
		height: 50,
		flexDirection: "row",
		width: "100%",
		backgroundColor: Colors.primary,
		elevation: 1,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	headerBackBtnContainer: {
		width: "20%",
		height: 50,
		paddingLeft: 8,
		alignItems: "flex-start",
		justifyContent: "center",
	},
	headerTitleContainer: {
		width: "60%",
		height: 50,
		alignItems: "flex-start",
		justifyContent: "center",
	},
	headerTitle: {
		fontSize: 20,
		color: Colors.white,
		alignSelf: "center",
	},
	searchModalBody: {
		flex: 1,
		height: windowHeight - 50,
		padding: 8,
	},
	searchInputBox: {
		width: "100%",
		height: 45,
		borderWidth: 1,
		borderColor: Colors.primary,
		borderRadius: 4,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 5,
	},
	textInput: {
borderWidth:1,
		width: "93%",
		height: "100%",
		marginLeft: 5,
		paddingLeft: 5,
		fontSize: 14,
		color: Colors.textColor,
	},

	
	autocompleteContainer: {
		//flex: 1,
		//left: 0,
		//position: 'absolute',
		//right: 0,
		//top: 0,
		//zIndex: 1,
		//width: "100%",
		height: 45,
		padding:10,
		//borderWidth: 1,
		//borderColor: Colors.primary,
		//borderRadius: 4,
		//flexDirection: "row",
		//alignItems: "center",
		//paddingHorizontal: 5,
		color:Colors.textColor,
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
	  },
	  right: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	  },
	  image: {
		width: 40,
		height: 40,
	  },
});