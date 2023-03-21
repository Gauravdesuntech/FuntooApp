import moment from "moment";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";

const AccordianChild = ({ item }) => {
	const [show, setShow] = useState(false);
	const [data, setData] = useState([]);


	useEffect(() => {
		console.log("log_history-details about users", item);
		setData(item.details);
	}, []);

	return (
		<View>
			<TouchableOpacity onPress={() => setShow(!show)}>
				<View style={styles.container}>
					<View style={styles.statusNameDiv}>
						<Text style={[styles.titleHead, styles.font]}>
							{item.user_name}
						</Text>
						<Text
							style={[styles.titleHead, styles.font, { color: "green" }]}
						>
							({data.length})
						</Text>
					</View>
					{/* <Text style={[styles.titleHead, styles.font]}>
						{moment(item.date).format("h:mm a")}
					</Text> */}
					<View>
						{/* <View style={[styles.countDiv]}>
							<Text
								style={[
									styles.titleHead,
									styles.font,
									{ color: "white" },
								]}
							>
								{data.length}
							</Text>
						</View> */}
						<Ionicons
							name="chevron-forward"
							size={24}
							color={colors.textInputBorder}
						/>
					</View>
				</View>
			</TouchableOpacity>

			{show &&
				data &&
				data.map((item, i) => {
					return (
						<View key={i} style={[styles.bodyContainer]}>
							<Text style={[styles.titleBody, styles.font]}>
								{item.user_name}
							</Text>
							<Text
								style={[
									styles.titleBody,
									styles.font,
									{ color: "green" },
								]}
							>
								({item.status})
							</Text>
							<Text style={[styles.titleBody, styles.font]}>
								{moment(item.date).format("h:mm a")}
							</Text>
						</View>
					);
				})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: 50,
		// borderWidth: 0.2,
		borderColor: "grey",
		flexDirection: "row",
		justifyContent: "space-between",
		borderRadius: 2,
		marginBottom: 10,
		alignItems: "center",
		backgroundColor: "white",
	},

	statusNameDiv: {
		flexDirection: "row",
		width: 100,
		marginLeft:10,
	},

	bodyContainer: {
		width: "100%",
		height: "auto",
		// borderWidth: 0.1,
		borderColor: "grey",
		paddingBottom: 14,
		backgroundColor: "white",
		flexDirection: "row",
		justifyContent: "space-around",
		borderRadius: 2,
		marginBottom: 6,
		alignItems: "center",
	},
	titleHead: {
		fontSize: 13,
		// fontWeight: "bold",
		color: "black",
		marginLeft: 5,
	},
	titleBody: {
		fontSize: 14,
		// fontWeight: "bold",
		color: "grey",
		paddingTop: 12,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		height: 56,
		paddingLeft: 25,
		paddingRight: 18,
		alignItems: "center",
		backgroundColor: "lightgrey",
	},
	countDiv: {
		width: 50,
		height: 28,
		borderWidth: 1,
		borderColor: "white",
		borderRadius: 16,
		// paddingRight: 6,
		paddingLeft: 6,
		paddingTop: 4,
		backgroundColor: "#63c3a5",
	},

	parentHr: {
		height: 1,
		color: "white",
		width: "100%",
	},
	child: {
		backgroundColor: "grey",
		padding: 16,
	},
});

export default AccordianChild;
