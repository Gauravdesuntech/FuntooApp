import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../config/colors";
import { Header } from "../components";

export default class EventDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			contactName: "Srinivas",
			contactNumber: "9060254544",
			altContactName: "",
			altContactNumber: "",
			gstBilling: true,
			paymentMode: "Cheque",
			billingName: "DNA Events",
			gstin: "29A76750007GA",
			emailID: "rakesh@gmail.com",
			billingAddress:
				"Bellary Rd, Lower Palace Orchards, Armane Nagar, Bengaluru, Karnataka 560080",
			specialInstructions: "",
		};
	}

	setGSTBilling = (value) => this.setState({ gstBilling: value });

	setPaymentMode = (value) => this.setState({ paymentMode: value });

	gotoManageEnquiry = () => this.props.navigation.navigate("ManageEnquiry");

	render = () => (
		<SafeAreaView style={styles.container}>
			<Header title="Event Details" />
			<View style={styles.form}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Contact Name:</Text>
						<TextInput
							value={this.state.contactName}
							autoCompleteType="off"
							autoCapitalize="words"
							style={styles.textInput}
							onChangeText={(contactName) => this.setState({ contactName })}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Contact Number:</Text>
						<TextInput
							value={this.state.contactNumber}
							autoCompleteType="off"
							keyboardType="number-pad"
							style={styles.textInput}
							onChangeText={(contactNumber) => this.setState({ contactNumber })}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Alt. Contact Name:</Text>
						<TextInput
							value={this.state.altContactName}
							autoCompleteType="off"
							autoCapitalize="words"
							style={styles.textInput}
							onChangeText={(altContactName) =>
								this.setState({ altContactName })
							}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Alt. Contact Number:</Text>
						<TextInput
							value={this.state.altContactNumber}
							autoCompleteType="off"
							keyboardType="number-pad"
							style={styles.textInput}
							onChangeText={(altContactNumber) =>
								this.setState({ altContactNumber })
							}
						/>
					</View>

					<View style={styles.radioBtnContainer}>
						<Text
							style={[styles.inputLable, { marginBottom: 0, marginRight: 10 }]}
						>
							GST Billing:
						</Text>

						<TouchableOpacity
							activeOpacity={1}
							onPress={this.setGSTBilling.bind(this, true)}
							style={{ flexDirection: "row", marginLeft: 5 }}
						>
							<MaterialIcons
								name={
									this.state.gstBilling ? "radio-button-on" : "radio-button-off"
								}
								color={Colors.primary}
								size={22}
							/>
							<Text style={[styles.inputLable, { marginBottom: 0 }]}>
								{" Yes"}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={1}
							onPress={this.setGSTBilling.bind(this, false)}
							style={{ flexDirection: "row", marginLeft: 5 }}
						>
							<MaterialIcons
								name={
									!this.state.gstBilling
										? "radio-button-on"
										: "radio-button-off"
								}
								color={Colors.primary}
								size={22}
							/>
							<Text style={[styles.inputLable, { marginBottom: 0 }]}>
								{" No"}
							</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.radioBtnContainer}>
						<Text
							style={[styles.inputLable, { marginBottom: 0, marginRight: 10 }]}
						>
							Payment Mode:
						</Text>

						<TouchableOpacity
							activeOpacity={1}
							onPress={this.setPaymentMode.bind(this, "Cheque")}
							style={{ flexDirection: "row", marginLeft: 5 }}
						>
							<MaterialIcons
								name={
									this.state.paymentMode === "Cheque"
										? "radio-button-on"
										: "radio-button-off"
								}
								color={Colors.primary}
								size={22}
							/>
							<Text style={[styles.inputLable, { marginBottom: 0 }]}>
								{" Cheque"}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={1}
							onPress={this.setPaymentMode.bind(this, "Online")}
							style={{ flexDirection: "row", marginLeft: 5 }}
						>
							<MaterialIcons
								name={
									this.state.paymentMode === "Online"
										? "radio-button-on"
										: "radio-button-off"
								}
								color={Colors.primary}
								size={22}
							/>
							<Text style={[styles.inputLable, { marginBottom: 0 }]}>
								{" Online"}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={1}
							onPress={this.setPaymentMode.bind(this, "UPI")}
							style={{ flexDirection: "row", marginLeft: 5 }}
						>
							<MaterialIcons
								name={
									this.state.paymentMode === "UPI"
										? "radio-button-on"
										: "radio-button-off"
								}
								color={Colors.primary}
								size={22}
							/>
							<Text style={[styles.inputLable, { marginBottom: 0 }]}>
								{" UPI"}
							</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Billing Name:</Text>
						<TextInput
							value={this.state.billingName}
							autoCompleteType="off"
							autoCapitalize="words"
							style={styles.textInput}
							onChangeText={(billingName) => this.setState({ billingName })}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>GSTIN:</Text>
						<TextInput
							value={this.state.gstin}
							autoCompleteType="off"
							autoCapitalize="characters"
							style={styles.textInput}
							onChangeText={(gstin) => this.setState({ gstin })}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Email ID:</Text>
						<TextInput
							value={this.state.emailID}
							autoCompleteType="off"
							autoCapitalize="none"
							style={styles.textInput}
							onChangeText={(emailID) => this.setState({ emailID })}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Billing Address:</Text>
						<TextInput
							multiline={true}
							numberOfLines={5}
							autoCompleteType="off"
							autoCapitalize="words"
							style={[styles.textInput, { textAlignVertical: "top" }]}
							value={this.state.billingAddress}
							onChangeText={(billingAddress) =>
								this.setState({ billingAddress })
							}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Special Instructions:</Text>
						<TextInput
							multiline={true}
							numberOfLines={5}
							autoCompleteType="off"
							autoCapitalize="words"
							style={[styles.textInput, { textAlignVertical: "top" }]}
							value={this.state.specialInstructions}
							onChangeText={(specialInstructions) =>
								this.setState({ specialInstructions })
							}
						/>
					</View>

					<TouchableOpacity
						style={styles.submitBtn}
						onPress={this.gotoManageEnquiry}
					>
						<Text style={{ fontSize: 18, color: Colors.white }}>
							Confirm Booking
						</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
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
	},
	radioBtnContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	submitBtn: {
		marginTop: 15,
		height: 45,
		width: "100%",
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
	},
});
