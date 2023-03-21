import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Modal,
	Image,
	Dimensions,
	FlatList,
	Alert,
	Linking
} from "react-native";
import Colors from "../../config/colors";
import DateAndTimePicker from "../../components/DateAndTimePicker";
import { getFormattedDate } from "../../utils/Util";
import { GetEventDetail, UpdateEventOrder } from '../../services/EventApiService';
import { UpdateGstNumber } from '../../services/CustomerApiService';
import Header from "../../components/Header";
import moment from "moment";
import Loader from "../../components/Loader";
import OverlayLoader from "../../components/OverlayLoader";
import ProgressiveImage from "../../components/ProgressiveImage";
//import NumericInput from "react-native-numeric-input";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import Configs from "../../config/Configs";
import AwesomeAlert from 'react-native-awesome-alerts';


export default class EventBillDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props?.route?.params?.data,
			event_id: this.props?.route?.params?.data?.id,
			tax_category: 0,
			installation: "0.00",
			transport: "0.00",
			additional: "0.00",
			discount: "0.00",
			gst: "0.00",
			sub_total: "0.00",
			total_amount: "0.00",
			customer_gstin: this.props?.route?.params?.data?.customer_gstin,
			customer_gstin_edit: this.props?.route?.params?.data?.customer_gstin ? false : true,

			paid_amount: "",
			paid_status: false,




			billing_type: null, //withoutbill=0 billwith=1
			received_copy: null,//soft=0 hard=1,
			quirier_number: "",
			quirier_date: "",
			docket_number: "",
			paid_type: "",//Cash=0,cheque=1,netbanking=2
			cheque_number: "",
			cheque_date: null,
			utr: "",
			cash_collector: "",
			cash_collect_date: null,

			isSuccessModalOpen: false,
			isLoading: true,
			event_games: [],

			showAlertModal: false,
			alertMessage: "",
			alertType: '',
		};
	}

	componentDidMount = () => {
		this.loadOrderDetails();
	}

	loadOrderDetails = () => {
		GetEventDetail(this.state.event_id)
			.then((response) => {
				this.setState({ isLoading: false });
				if (response.is_success) {
					let data = response.data;

					let cheque_date = null;
					let quirier_date = null;
					let cash_collect_date = null;

					if (data.cheque_date) {
						cheque_date = new Date(data.cheque_date);
					}
					if (data.quirier_date) {
						quirier_date = new Date(data.quirier_date);
					}
					if (data.cash_collect_date) {
						cash_collect_date = new Date(data.cash_collect_date);
					}
					this.setState({
						data: data,
						event_games: data?.event_games ?? [],
						tax_category: data.installation ?? 0,
						installation: data.installation,
						transport: data.transport,
						additional: data.additional,
						discount: data.discount,
						gst: data.gst,
						sub_total: data.sub_total,
						total_amount: data.total_amount,
						paid_amount: data.paid_amount,
						paid_status: data.paid_status,
						paid_type: data.paid_type,
						cheque_date: cheque_date,
						quirier_date: quirier_date,
						paid_type: data.paid_type,//Cash=0,cheque=1,netbanking=2
						billing_type: data.billing_type, //withoutbill=0 withbill=1
						received_copy: data.received_copy,//soft=0 hard=1,
						quirier_number: data.quirier_number,
						docket_number: data.docket_number,
						cheque_number: data.cheque_number,
						utr: data.utr,
						cash_collector: data.cash_collector,
						cash_collect_date: cash_collect_date
					}, () => this.UpdateTotalAmount());
				}

			})
			.catch((error) => { Alert.alert("Warring", "Internet issue") })
	}


	onChequDateChange = (value) =>
		this.setState({ cheque_date: value });
	onQuirierDateChange = (value) =>
		this.setState({ quirier_date: value });

	onCashCollectDateChange = (value) =>
		this.setState({ cash_collect_date: value });

	UpdateEventOrder = () => {
		let data = this.state;
		let model = {
			id: data.event_id,
			installation: data.installation,
			transport: data.transport,
			additional: data.additional,
			discount: data.discount,
			gst: data.gst,
			sub_total: data.sub_total,
			total_amount: data.total_amount,
			paid_amount: data.paid_amount,


			paid_type: data.paid_type,//Cash=0,cheque=1,netbanking=2
			billing_type: data.billing_type, //withoutbill=0 withbill=1
			received_copy: data.received_copy,//soft=0 hard=1,
			quirier_number: data.quirier_number,
			quirier_date: getFormattedDate(data.quirier_date),
			docket_number: data.docket_number,
			cheque_number: data.cheque_number,
			cheque_date: getFormattedDate(data.cheque_date),
			cash_collect_date: getFormattedDate(data.cash_collect_date),
			utr: data.utr,
			cash_collector: data.cash_collector,
		};
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to update",
			[
				{
					text: "Yes",
					onPress: () => {
						UpdateEventOrder(model).then(res => {
							if (res.is_success) {
								this.setState({
									showAlertModal: true,
									alertType: "Success",
									alertMessage: res.message
								});
								this.loadOrderDetails();
								this.InvoiceDownload();
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
		);

	}



	UpdateGstNumber = () => {
		let model = {
			id: this.state.data.customer_id,
			gstin: this.state.customer_gstin
		};
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to set gst number",
			[
				{
					text: "Yes",
					onPress: () => {
						UpdateGstNumber(model).then(res => {
							if (res.is_success) {
								this.setState({
									showAlertModal: true,
									alertType: "Success",
									alertMessage: res.message,
									customer_gstin_edit: false
								});

							} else {
								this.setState({
									showAlertModal: true,
									alertType: "Error",
									alertMessage: res.message,
								});
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
		);

	}



	InvoiceDownload = () => {
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to download invoice",
			[
				{
					text: "Yes",
					onPress: () => {
						let url = Configs.BASE_URL + "download/print_bill?id=" + this.state.event_id;
						Linking.openURL(url);
					},
				},
				{
					text: "No",
				},
			]
		);

	}

	renderDate = (date) => {
		return moment(date, "YYYY-MM-DD").format("D/MM/YYYY");;
	}

	renderTime = (v_time) => {
		let time = moment(v_time, "HH:mm").format("hh:mm A");
		return `${time}`;
	}

	hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
	};
	// installation: data.installation,
	// transport: data.transport,
	// additional: data.additional,
	// discount: data.discount,
	// gst: data.gst,
	// sub_total: data.sub_total,
	// total_amount: data.total_amount,

	UpdateTotalAmount = () => {

		let model = this.state;
		let sub_total = parseInt(model.sub_total);
		let installation = parseInt(model.installation);
		let transport = parseInt(model.transport);
		let additional = parseInt(model.additional);
		let discount = parseInt(model.discount);
		let charges_total = installation + transport + additional;
		let gst = 0;
		let final_amount = (sub_total + charges_total) - discount;

		if (this.state.billing_type == 1) {
			gst=this.GetGstAmount(sub_total);
			final_amount = final_amount + gst;
		}

		this.setState({
			gst: gst.toString(),
			total_amount: final_amount.toString(),
		});

	};


	GetGstAmount = (amount) => {
		return parseInt((amount * 18) / 100);
	}

	render = () => {

		return (
			<>
				{this.state.isLoading && <OverlayLoader />}
				<View style={styles.container}>
					<Header title="Manage Bills" />
					<View style={{ margin: 5 }}>
						<Text style={styles.row_item}>Order# : {this.state.data.odid}</Text>
						<Text style={{ fontWeight: 'bold' }}>Customer Details</Text>
						<Text style={styles.row_item}>Name : {this.state.data.customer_name}</Text>
						<Text style={styles.row_item}>Mobile Number : {this.state.data.customer_mobile}</Text>
						<Text style={styles.row_item}>Email : {this.state.data.customer_email}</Text>
						<Text style={styles.row_item}>GST : {this.state.customer_gstin}</Text>
					</View>

					<ScrollView>
						{this.state.event_games?.map(item =>
							<View key={item.id.toString()} style={styles.listRow}>
								<View style={{ width: "20%" }}>
									<ProgressiveImage
										source={{ uri: Configs.NEW_COLLECTION_URL + item.image }}
										style={{ height: 57, width: "100%" }}
										resizeMode="cover"
									/>
								</View>
								<View style={{ width: "50%", paddingLeft: 10 }}>
									<Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
										{item.game_name}
									</Text>
									<Text style={styles.subText}>{item.quantity} Quantity</Text>
									{/* <Text style={styles.subText}>Rent</Text> */}
								</View>
								<View style={styles.qtyContainer}>
									<Text>Rent</Text>
									<Text style={styles.subText}>
										<FontAwesome name="rupee" size={13} color={Colors.textColor} />
										{item.total_amount}
									</Text>
								</View>
							</View>)}


						<View style={[styles.listRow, { flexDirection: "column" }]}>

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={[styles.textInput, { fontWeight: 'bold' }]}>Sub Total:</Text>
								</View>
								<View style={styles.rowRight}>
									<Text style={[styles.textInput, { backgroundColor: Colors.white }]}>
										<FontAwesome name="rupee" size={13} color={Colors.textColor} /> {this.state.sub_total}</Text>
								</View>
							</View>


							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.textInput}>Transport Charges:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.transport}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="numeric"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(transport) => this.setState({ transport })}
										onBlur={this.UpdateTotalAmount}
									/>
								</View>
							</View>

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.textInput}>Installation Charges:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.installation}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="numeric"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(installation) => this.setState({ installation })}
										onBlur={this.UpdateTotalAmount}
									/>
								</View>
							</View>

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.textInput}>Additional Charges:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.additional}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="numeric"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(additional) => this.setState({ additional })}
										onBlur={this.UpdateTotalAmount}
									/>
								</View>
							</View>


							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.textInput}>GST 18%:</Text>
								</View>
								<View style={styles.rowRight}>
									{/* <TextInput
										value={this.state.gst}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="numeric"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(gst) => this.setState({ gst })}
										editable={false}
									/> */}
									<Text style={[styles.textInput, { backgroundColor: Colors.white }]}>
										{this.state.gst}
									</Text>
								</View>
							</View>


							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.textInput}>Discount:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.discount}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="numeric"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(discount) => this.setState({ discount })}
										onBlur={this.UpdateTotalAmount}
									/>
								</View>
							</View>


							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={[styles.textInput, { fontWeight: 'bold' }]}>Total Amount:</Text>
								</View>
								<View style={styles.rowRight}>
									<Text style={[styles.textInput, { backgroundColor: Colors.white }]}>
										<FontAwesome name="rupee" size={13} color={Colors.textColor} /> {this.state.total_amount}</Text>
								</View>
							</View>

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.textInput}>Paid Amount:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.paid_amount}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="numeric"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(paid_amount) => this.setState({ paid_amount })}

									/>
								</View>
							</View>

							<View style={styles.row}>
								<View style={[styles.rowLeft, { width: '40%' }]}>
									<Text style={styles.textInput}>Paid Type:</Text>
								</View>
								<View style={{
									flexDirection: 'row',
									alignItems: 'center',
									flex: 1,
									justifyContent: 'center'
								}}>
									<TouchableOpacity
										style={styles.radioItem}
										onPress={() => this.setState({ paid_type: 0 })}
									>
										<Text>Cash</Text>
										<Ionicons
											name={
												this.state.paid_type == 0
													? "radio-button-on"
													: "radio-button-off"
											}
											color={Colors.primary}
											size={20}
										/>
									</TouchableOpacity>


									<TouchableOpacity
										style={styles.radioItem}
										onPress={() => this.setState({ paid_type: 1 })}
									>
										<Text>Cheque</Text>
										<Ionicons
											name={
												this.state.paid_type == 1
													? "radio-button-on"
													: "radio-button-off"
											}
											color={Colors.primary}
											size={20}
										/>
									</TouchableOpacity>

									<TouchableOpacity
										style={styles.radioItem}
										onPress={() => this.setState({ paid_type: 2 })}
									>
										<Text>Online</Text>
										<Ionicons
											name={
												this.state.paid_type == 2
													? "radio-button-on"
													: "radio-button-off"
											}
											color={Colors.primary}
											size={20}
										/>
									</TouchableOpacity>
								</View>
							</View>

							<View style={{ marginTop: 10 }}>
								{this.state.paid_type == 0 && <View style={{ margin: 10 }}>

									<Text style={{ marginBottom: 10 }}>Cash Collecting By</Text>
									<TextInput
										value={this.state.cash_collector}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="default"
										placeholder="Cash collecting by"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(cash_collector) => this.setState({ cash_collector })}

									/>


									<View style={{ marginTop: 10 }}>
										<DateAndTimePicker
											mode={"date"}
											label={"Date:"}
											value={this.state.cash_collect_date}
											onChange={this.onCashCollectDateChange}
										/>
									</View>


								</View>}

								{this.state.paid_type == 1 && <View>
									<Text style={{ marginBottom: 10 }}>Cheque Number :</Text>
									<TextInput
										value={this.state.cheque_number}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="default"
										placeholder="Cheque Number"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(cheque_number) => this.setState({ cheque_number })}

									/>

									<View style={{ marginTop: 10 }}>
										<DateAndTimePicker
											mode={"date"}
											label={"Date:"}
											value={this.state.cheque_date}
											onChange={this.onChequDateChange}
										/>
									</View>



								</View>}

								{this.state.paid_type == 2 && <View>
									<Text style={{ marginBottom: 10 }}>UTR :</Text>
									<TextInput
										value={this.state.utr}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="default"
										placeholder="UTR"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(utr) => this.setState({ utr })}

									/>

								</View>}
							</View>

							<View style={styles.row}>
								<View style={[styles.rowLeft, { width: '40%' }]}>
									<Text style={styles.textInput}>Billing Type:</Text>
								</View>
								<View style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center',
									flex: 1
								}}>
									<TouchableOpacity
										style={styles.radioItem}
										onPress={() => this.setState({ billing_type: 0 }, () => this.UpdateTotalAmount())}
									>
										<Text>Without Bill</Text>
										<Ionicons
											name={
												this.state.billing_type == 0
													? "radio-button-on"
													: "radio-button-off"
											}
											color={Colors.primary}
											size={20}
										/>
									</TouchableOpacity>


									<TouchableOpacity
										style={styles.radioItem}
										onPress={() => this.setState({ billing_type: 1 }, () => this.UpdateTotalAmount())}
									>
										<Text>With Bill</Text>
										<Ionicons
											name={
												this.state.billing_type == 1
													? "radio-button-on"
													: "radio-button-off"
											}
											color={Colors.primary}
											size={20}
										/>
									</TouchableOpacity>
								</View>
							</View>

							{this.state.billing_type == 1 && <View>
								{this.state.customer_gstin_edit && <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ marginRight: 10 }}>GST:</Text>
									<TextInput
										value={this.state.customer_gstin}
										autoCompleteType="off"
										//autoCapitalize="words"
										autoCapitalize="characters"
										keyboardType="default"
										placeholder="Enter GST number"
										style={[styles.textInput, { backgroundColor: Colors.white, flex: 1 }]}
										onChangeText={(customer_gstin) => this.setState({ customer_gstin })}

									/>
									<TouchableOpacity style={{ marginLeft: 10, backgroundColor: Colors.primary, padding: 10, borderRadius: 10 }}
										onPress={this.UpdateGstNumber}>
										<Text style={{ color: Colors.white }}>Submit</Text>
									</TouchableOpacity>
								</View>}
							</View>}

							<View style={styles.row}>
								<View style={[styles.rowLeft, { width: '40%' }]}>
									<Text style={styles.textInput}>Received Copy:</Text>
								</View>
								<View style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center',
									flex: 1
								}}>
									<TouchableOpacity
										style={styles.radioItem}
										onPress={() => this.setState({ received_copy: 0 })}
									>
										<Text>Soft Copy</Text>
										<Ionicons
											name={
												this.state.received_copy == 0
													? "radio-button-on"
													: "radio-button-off"
											}
											color={Colors.primary}
											size={20}
										/>
									</TouchableOpacity>


									<TouchableOpacity
										style={styles.radioItem}
										onPress={() => this.setState({ received_copy: 1 })}
									>
										<Text>Hard Copy</Text>
										<Ionicons
											name={
												this.state.received_copy == 1
													? "radio-button-on"
													: "radio-button-off"
											}
											color={Colors.primary}
											size={20}
										/>
									</TouchableOpacity>
								</View>
							</View>

							<View style={{ marginTop: 10 }}>
								{this.state.received_copy == 1 && <View style={{ margin: 10 }}>

									<Text style={{ marginBottom: 10 }}>Quirier Number</Text>
									<TextInput
										value={this.state.quirier_number}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="default"
										placeholder="Cash collecting by"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(quirier_number) => this.setState({ quirier_number })}

									/>

									<Text style={{ marginTop: 10, marginBottom: 10 }}>Docket Number</Text>
									<TextInput
										value={this.state.docket_number}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="default"
										placeholder="Cash collecting by"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(docket_number) => this.setState({ docket_number })}

									/>

									<View style={{ marginTop: 10 }}>
										<DateAndTimePicker
											mode={"date"}
											label={"Date:"}
											value={this.state.quirier_date}
											onChange={this.onQuirierDateChange}
										/>
									</View>


								</View>}
							</View>


							<View style={{ alignItems: 'center' }}>
								<TouchableOpacity
									style={styles.btn}
									onPress={this.UpdateEventOrder}
								>
									<Text style={{ fontSize: 18, color: Colors.white }}>Update</Text>
								</TouchableOpacity>
							</View>
						</View>

					</ScrollView>
				</View>

				<AwesomeAlert
					show={this.state.showAlertModal}
					showProgress={false}
					title={this.state.alertType}
					message={this.state.alertMessage}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showCancelButton={false}
					showConfirmButton={true}
					cancelText="cancel"
					confirmText="Ok"
					confirmButtonColor="#DD6B55"
					onCancelPressed={() => {
						this.hideAlert();
					}}
					onConfirmPressed={() => {
						this.hideAlert();
					}}
				/>
			</>
		);
	}
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},

	listRow: {
		// flexDirection: "row",
		// borderBottomColor: "#eee",
		// borderBottomWidth: 1,
		// paddingHorizontal: 5,
		// paddingVertical: 5,

		flexDirection: "row",
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		elevation: 10,
		marginBottom: 10,
	},


	rowBody: {
		flex: 1,
		padding: 8,
	},
	titleText: {
		fontSize: 14,
		fontWeight: "bold",
		color:Colors.textColor,
		marginBottom: 2,
	},
	subText: {
		fontSize: 13,
		color: Colors.textColor,
	},

	qtyContainer: {
		width: "30%",
		alignItems: "center",
		justifyContent: "center",
	},

	pricingItemContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	pricingText: {
		fontSize: 14,
		color:Colors.textColor,
	},

	btn: {
		marginTop: 15,
		height: 50,
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		width: '100%',
		borderRadius: 4,
	},

	row: {
		marginTop: 5,
		flexDirection: 'row'
	},
	rowLeft: {
		width: '70%',
		justifyContent: 'center',
		//backgroundColor: '#f9f9f9',
		//alignItems: 'center'
	},
	rowRight: {
		width: '30%', marginLeft: 5
	},


	inputContainer: {
		width: "100%",
		marginBottom: 20,
	},
	inputLable: {
		//fontSize: 16,
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


	row_item: {
		fontSize: 14,
		color: Colors.textColor,
		marginBottom: 3,
		fontWeight: "normal",
		// opacity: 0.9,
	},

	radioItem: {
		marginLeft: 15,
		justifyContent: 'center',
		alignItems: 'center'
	},
});
