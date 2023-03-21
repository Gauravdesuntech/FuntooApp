import React, {Component} from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	Linking,
	SafeAreaView
} from "react-native";

import Colors from "../../config/colors";
import DateAndTimePicker from "../../components/DateAndTimePicker";
import { UpdateGstNumber } from '../../services/CustomerApiService';
import Header from "../../components/Header";
import OverlayLoader from "../../components/OverlayLoader";
import ProgressiveImage from "../../components/ProgressiveImage";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Configs from "../../config/Configs";
import AwesomeAlert from 'react-native-awesome-alerts';
import InvoicePayments from "../../components/Invoice/InvoicePayments";
import { GetInvoice, UpdateInvoice } from "../../services/OrderService";
import { getFormattedDate } from "../../utils/Util";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class OrderInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoice_id: this.props.route.params?.id,
			invoiceData: null,
			invoice_number: '',
			customer_id: null,
			customer_name: '',
			customer_mobile: '',
			customer_email: '',
			customer_gstin: '',
			invoice_line_items : [],
			sub_total: '',
			transport_charges: '',
			installation_charges: '',
			additional_charges: '',
			discount: '',
			grand_total: '',
			paid_amount: '',
			amount_due: '',
			total_tax: '',
			
			paid_type: 0,
			cash_collector: '',
			cheque_number: '',
			utr: '',
			billing_type: '',
			is_customer_gstin_edit_required: false,
			received_copy: '',
			quirier_number: '',
			docket_number: '',
			quirier_date: '',

			isSuccessModalOpen: false,
			isLoading: false,
			showAlertModal: false,
			alertMessage: "",
			alertType: '',
			onPressAlertSuccess: null
        }
    }

    componentDidMount() {
        this.setState({isLoading: true});
        GetInvoice({ id: this.state.invoice_id })
        .then( (result) => {
            if(result.is_success) {
				const invoiceData = result.data;
				this.setState({
					invoiceData: invoiceData,
					invoice_number: invoiceData.invoice_number,
					customer_id: invoiceData.customer_id,
					customer_name: invoiceData.customer.name,
					customer_mobile: invoiceData.customer.mobile,
					customer_email: invoiceData.customer.email,
					customer_gstin: invoiceData.customer.gstin,
					invoice_line_items: invoiceData.line_items,
					sub_total: invoiceData.sub_total,
					transport_charges: invoiceData.transport_charges,
					installation_charges: invoiceData.installation_charges,
					additional_charges: invoiceData.additional_charges,
					discount: invoiceData.discount,
					grand_total: invoiceData.grand_total,
					paid_amount: invoiceData.paid_amount,
					amount_due: invoiceData.amount_due,
					total_tax: invoiceData.total_tax,
					billing_type: invoiceData.billing_type,
					received_copy: invoiceData.received_copy,
					quirier_number: invoiceData.quirier_number,
					docket_number: invoiceData.docket_number,
					quirier_date: (invoiceData.quirier_date) ? new Date(invoiceData.quirier_date) : null,

					is_customer_gstin_edit_required: (invoiceData.customer.gstin) ? false: true
				});
            }
        })
        .catch( err => console.log(err) )
        .finally( () => {
            this.setState({isLoading: false});
        });
    }

	UpdateInvoice = () => {

		let data = {
			id: this.state.invoice_id,
			transport_charges: this.state.transport_charges,
			installation_charges: this.state.installation_charges,
			additional_charges: this.state.additional_charges,
			discount: this.state.discount,
			grand_total: this.state.grand_total,
			amount_due: this.state.amount_due,
			billing_type: this.state.billing_type,
			received_copy: this.state.received_copy
		}

		if(this.state.billing_type == 'without bill') {
			data.total_tax = this.state.total_tax;
		}

		if(this.state.received_copy == 'hard copy') {
			data.quirier_number = this.state.quirier_number;
			data.docket_number = this.state.docket_number;
			data.quirier_date =  getFormattedDate(this.state.quirier_date);
		}

		Alert.alert(
			"Are your sure?",
			"Are you sure you want to update",
			[
				{
					text: "Yes",
					onPress: () => {
						this.setState({isLoading: true});
						UpdateInvoice(data)
						.then( (result) => {
							if(result.is_success) {
								this.setState({
									showAlertModal: true,
									alertMessage: result.message,
									alertType: 'Success',
									onPressAlertSuccess: this.InvoiceDownload
								});
							}
						} )
						.catch( err => console.log(err) )
						.finally( () => {
							this.setState({isLoading: false});
						} );
					},
				},
				{
					text: "No"
				},
			]
		);
	}

	UpdateGstNumber = () => {
		let data = {
			id: this.state.customer_id,
			gstin: this.state.customer_gstin
		};
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to set gst number",
			[
				{
					text: "Yes",
					onPress: () => {
						UpdateGstNumber(data).then(res => {
							if (res.is_success) {
								this.setState({
									showAlertModal: true,
									alertType: "Success",
									alertMessage: res.message,
									is_customer_gstin_edit_required: false
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
						this.setState({onPressAlertSuccess: null});
						let url = Configs.BASE_URL + "download/print_bill?invoice_id=" + this.state.invoice_id;
						Linking.openURL(url);
					},
				},
				{
					text: "No",
				},
			]
		);

	}

	hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
	};

	UpdateTotalAmount = () => {

		if(this.state.invoiceData.paid_status == 'paid') {
			return;
		}

		let model = this.state;
		let sub_total = parseFloat(model.sub_total);
		let installation = parseFloat(model.installation_charges);
		let transport = parseFloat(model.transport_charges);
		let additional = parseFloat(model.additional_charges);
		let discount = parseFloat(model.discount);

		let charges_total = installation + transport + additional;
		let grand_total = (sub_total + charges_total) - discount;

		let total_tax = parseFloat(this.state.invoiceData.total_tax);
		if (this.state.billing_type == 'with bill') {
			grand_total += total_tax;
		} else {
			total_tax = 0;
			grand_total -= total_tax;
		}

		this.setState({
			total_tax: total_tax.toString(),
			grand_total: grand_total.toString(),
			amount_due: grand_total.toString()
		});
	};

	GetGstAmount = (amount) => {
		return parseFloat(amount) * 0.18;
	}

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
				{this.state.isLoading && <OverlayLoader visible={this.state.isLoading}/>}

				<View style={styles.container}>
					<Header title="Manage Invoice" />
					<View style={{ margin: 5 }}>
						<Text style={styles.row_item}>Invoice# : {this.state.invoice_number}</Text>
						<Text style={{ fontWeight: 'bold' }}>Customer Details</Text>
						<Text style={styles.row_item}>Name : {this.state.customer_name}</Text>
						<Text style={styles.row_item}>Mobile Number : {this.state.customer_mobile}</Text>
						<Text style={styles.row_item}>Email : {this.state.customer_email}</Text>

						<Text style={styles.row_item}>GST : {this.state.customer_gstin}</Text>
					</View>

					<KeyboardAwareScrollView>
						{this.state.invoice_line_items?.map(item =>
							<View key={item.id.toString()} style={styles.listRow}>
								<View style={{ width: "20%" }}>
									<ProgressiveImage
										source={{ uri: item.game.thumb_image_url }}
										style={{ height: 57, width: "100%" }}
										resizeMode="cover"
									/>
								</View>
								<View style={{ width: "50%", paddingLeft: 10 }}>
									<Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
										{item.game.name}
									</Text>
									<Text style={styles.subText}>X {item.quantity}</Text>
								</View>
								<View style={styles.qtyContainer}>
									<Text>Rent</Text>
									<Text style={styles.subText}>
										<FontAwesome name="rupee" size={13} color={Colors.grey} />
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
										<FontAwesome name="rupee" size={13} color={Colors.grey} /> {this.state.sub_total}</Text>
								</View>
							</View>


							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={styles.textInput}>Transport Charges:</Text>
								</View>
								<View style={styles.rowRight}>
									<TextInput
										value={this.state.transport_charges}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="numeric"
										editable={ (this.state.invoiceData?.paid_status == 'paid') ? false : true }
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(transport_charges) => this.setState({ transport_charges })}
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
										value={this.state.installation_charges}
										autoCompleteType="off"
										editable={ (this.state.invoiceData?.paid_status == 'paid') ? false : true }
										autoCapitalize="words"
										keyboardType="numeric"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(installation_charges) => this.setState({ installation_charges })}
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
										value={this.state.additional_charges}
										autoCompleteType="off"
										editable={ (this.state.invoiceData?.paid_status == 'paid') ? false : true }
										autoCapitalize="words"
										keyboardType="numeric"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(additional_charges) => this.setState({ additional_charges })}
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
										{this.state.total_tax}
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
										editable={ (this.state.invoiceData?.paid_status == 'paid') ? false : true }
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
										<FontAwesome name="rupee" size={13} color={Colors.grey} /> {this.state.grand_total}</Text>
								</View>
							</View>

							<View style={styles.row}>
								<View style={styles.rowLeft}>
									<Text style={[styles.textInput, { fontWeight: 'bold' }]}>Amount Due:</Text>
								</View>
								<View style={styles.rowRight}>
									<Text style={[styles.textInput, { backgroundColor: Colors.white }]}>
										<FontAwesome name="rupee" size={13} color={Colors.grey} /> {this.state.amount_due}</Text>
								</View>
							</View>


							{/* Baler component will be here */}

							{ this.state.invoiceData && <InvoicePayments
								invoiceData={this.state.invoiceData}
								invoice_id={this.state.invoice_id}
								callbackAfterMakePayment={ ( invoice ) => this.setState({
									amount_due: invoice.amount_due
								}) }
							/> }
							
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
										onPress={() => this.setState({ billing_type: 'without bill' }, () => this.UpdateTotalAmount())}
									>
										<Text>Without Bill</Text>
										<Ionicons
											name={
												this.state.billing_type == 'without bill'
													? "radio-button-on"
													: "radio-button-off"
											}
											color={Colors.primary}
											size={20}
										/>
									</TouchableOpacity>


									<TouchableOpacity
										style={styles.radioItem}
										onPress={() => this.setState({ billing_type: 'with bill' }, () => this.UpdateTotalAmount())}
									>
										<Text>With Bill</Text>
										<Ionicons
											name={
												this.state.billing_type == 'with bill'
													? "radio-button-on"
													: "radio-button-off"
											}
											color={Colors.primary}
											size={20}
										/>
									</TouchableOpacity>
								</View>
							</View>

							{this.state.billing_type == 'with bill' && <View>
								{this.state.is_customer_gstin_edit_required && <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center', alignItems: 'center' }}>
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
										onPress={() => this.setState({ received_copy: 'soft copy' })}
									>
										<Text>Soft Copy</Text>
										<Ionicons
											name={
												this.state.received_copy == 'soft copy'
													? "radio-button-on"
													: "radio-button-off"
											}
											color={Colors.primary}
											size={20}
										/>
									</TouchableOpacity>


									<TouchableOpacity
										style={styles.radioItem}
										onPress={() => this.setState({ received_copy: 'hard copy' })}
									>
										<Text>Hard Copy</Text>
										<Ionicons
											name={
												this.state.received_copy == 'hard copy'
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
								{this.state.received_copy == 'hard copy' && <View style={{ margin: 10 }}>

									<Text style={{ marginBottom: 10 }}>Quirier Number</Text>
									<TextInput
										value={this.state.quirier_number}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="default"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(quirier_number) => this.setState({ quirier_number })}

									/>

									<Text style={{ marginTop: 10, marginBottom: 10 }}>Docket Number</Text>
									<TextInput
										value={this.state.docket_number}
										autoCompleteType="off"
										autoCapitalize="words"
										keyboardType="default"
										style={[styles.textInput, { backgroundColor: Colors.white }]}
										onChangeText={(docket_number) => this.setState({ docket_number })}

									/>

									<View style={{ marginTop: 10 }}>
										<DateAndTimePicker
											mode={"date"}
											label={"Date:"}
											value={this.state.quirier_date}
											LabelStyle={ { color: Colors.dark } }
											customContainerStyle={ { marginBottom: 0 } }
											onChange={ (value) => this.setState({ quirier_date: value }) }
										/>
									</View>


								</View>}
							</View>


							<View style={{ alignItems: 'center' }}>
								<TouchableOpacity
									style={styles.btn}
									onPress={this.UpdateInvoice}
								>
									<Text style={{ fontSize: 18, color: Colors.white }}>Update</Text>
								</TouchableOpacity>
							</View>
						</View>

					</KeyboardAwareScrollView>
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
						if(this.state.onPressAlertSuccess) {
							this.state.onPressAlertSuccess();
						}
					}}
				/>
			</SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	listRow: {
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
		color: Colors.grey,
		marginBottom: 2,
	},
	subText: {
		fontSize: 13,
		color: Colors.grey,
		opacity: 0.9,
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
		color: Colors.grey,
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
		color: Colors.grey,
		marginBottom: 10,
		opacity: 0.8,
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
		color: Colors.grey,
		marginBottom: 3,
		fontWeight: "normal",
		opacity: 0.9,
	},

	radioItem: {
		marginLeft: 15,
		justifyContent: 'center',
		alignItems: 'center'
	}
});