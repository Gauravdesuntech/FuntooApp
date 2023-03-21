import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Modal,
	Dimensions,
	Alert,
	FlatList,
	RefreshControl,
	ScrollView,
	SafeAreaView,
	Linking,
	Platform,
	Image
} from "react-native";
import { FontAwesome, Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import { DeleteVehicleInfo } from "../../services/VehicleInfoApiService";
import { DeleteVenderEnquiry, VenderEnquiryList } from "../../services/VenderEnquiryApiService";
import { VenderList } from "../../services/VenderApiService";
import AwesomeAlert from 'react-native-awesome-alerts';
import AppContext from "../../context/AppContext";
import Loader from "../../components/Loader";
import { GetVehicleInfo } from "../../services/VehicleInfoApiService";
import VehicleButton from "../../components/VehicleButton";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ShowMoreLess from "../../components/ShowMoreLess";
import { showDateAsClientWant, showTimeAsClientWant } from "../../utils/Util";
import Accordion from 'react-native-collapsible/Accordion';
import moment from "moment";



export default class VehicleDetails extends React.Component {

	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			event_id: 1,
			orderData: this.props.orderData,
			tab: 'List',
			isLoading: false,
			list: [],
			venders: [],
			enquirys: [],
			rerenderList: 0,
			showAlertModal: false,
			isVenderModalOpen: false,
			alertMessage: "",
			alertType: '',
			enquiryListRefreshing: false,

			isShowMoreOpen: false,

			openImages: false,
			selectedImageHistory: '',
		};
	}

	componentDidMount() {
		this.focusListner = this.props.navigation.addListener("focus", () => {
			this.VehicleList();
		});

		this.Bind();
	};

	componentWillUnmount() {
		this.focusListner();
	}
	loadCurrentVehicleList = () => {
		// console.log('...................loadCurrentVehicleList......................');
		this.VehicleList();
	}

	Bind() {
		this.setState({ isLoading: true });
		Promise.all([
			GetVehicleInfo({ order_id: this.state.orderData.id }),
			VenderList(),
			VenderEnquiryList({
				order_id: this.state.orderData.id,
				category: 1
			})
		])
			.then((res) => {
				// console.log("..............result[0].data.................",res[0])
				// console.log("..............result[1].data.................",res[1])
				// console.log("..............result[2].data.................",res[2])
				this.setState({
					list: res[0].data,
					venders: res[1].data,
					enquirys: res[2].data,
				});
			})
			.catch(err => console.log(err))
			.finally(() => {
				this.setState({ isLoading: false });
			});
	}

	toggleVenderModal = () => this.setState({ isVenderModalOpen: !this.state.isVenderModalOpen });


	enquiryListOnRefresh = () => {
		this.VenderEnquiryList();
	}

	VenderEnquiryList() {

		this.setState({
			isLoading: true,
			enquiryListRefreshing: true
		});

		VenderEnquiryList({
			order_id: this.state.orderData.id,
			category: 1
		})
			.then(res => {
				this.setState({
					enquirys: res.data,
					refreshing: false,
				});
			}).catch((error) => {
				Alert.alert("Server Error", "Please try again later");
			})
			.finally(() => {
				this.setState({
					isLoading: false,
					enquiryListRefreshing: false
				});
			});
	}

	VehicleList() {
		// console.log('................called..............',this.state.orderData.id);
		this.setState({ isLoading: true });
		GetVehicleInfo({ order_id: this.state.orderData.id }).then(res => {
			this.setState({
				isLoading: false,
				list: res.data,
				refreshing: false,
				rerenderList: Number(this.state.rerenderList) + 1
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}
	EditVehicle = (id) => {
		if (this.context.userData.action_types.indexOf('Edit') >= 0) {
			let data = this.state.list.filter(item => item.id == id)
			// console.log("...............edit data...........", data)
			this.props.navigation.navigate("AddVehicleInfo", {
				orderData: this.state.orderData,
				editstate: 1,
				editData: data,
			});
		}
	}
	// DeleteVehicle = (id) => {
	// console.log(".......................console.............",id)
	// if(this.context.userData.action_types.indexOf('Delete') >= 0)
	// {Alert.alert(
	// 		"Are you sure?",
	// 		"Are you sure you want to remove this Vehicle?",
	// 		[
	// 			{
	// 				text: "Yes",
	// 				onPress: () => {
	// 					DeleteVehicleInfo({ id: id }).then(res => {
	// 						if (res.is_success) {
	// 							this.VehicleList();
	// 						}
	// 					}).catch((error) => {
	// 						Alert.alert("Server Error", error.message);
	// 					});
	// 				},
	// 			},
	// 			{
	// 				text: "No",
	// 			},
	// 		]
	// 	)};
	// }

	DeleteVenderEnquiry = (id) => {
		if (this.context.userData.action_types.indexOf('Delete') >= 0) {
			Alert.alert(
				"Are your sure?",
				"Are you sure you want to remove this enquiry?",
				[
					{
						text: "Yes",
						onPress: () => {
							DeleteVenderEnquiry({ id: id }).then(res => {
								if (res.is_success) {
									this.VenderEnquiryList();
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
			)
		};
	}

	hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
	};

	goToEnquiry = (item, mobile) => {
		let data = {
			order_id: this.state.orderData.id,
			vender_id: item.id,
			name: item.name,
			mobile: mobile,
			category: 1
		}
		this.props.navigation.navigate("VenderEnquiryAddUpdate", { data: data });
	}

	setMobile = (number) => {
		if (number?.length <= 10) {
			this.setState({ mobile: number });
		}
	}
	dialCall = (mobile, vendorDetails) => {
		let phoneNumber = (Platform.OS === 'android') ? `tel:${mobile}` : `telprompt:${mobile}`;
		Linking.openURL(phoneNumber)
			.then((isSuccess) => {
				// create a call record here
				if (isSuccess) {
					let data = {
						order_id: this.state.orderData.id,
						type: 'call',
						vendor_name: vendorDetails.name,
						called_number: mobile,
						created_by: this.context.userData.id,
						created_by_name: this.context.userData.name
					}
					AddOrderCommunicationDetails(data).
						then(res => { console.log(res) })
						.catch(err => { });
				}
			})
			.catch(err => console.log(err));
	};
	rightSwipeActions = () => {
		return (
			<View
				style={{
					backgroundColor: Colors.primary,
					justifyContent: 'center',
					alignItems: 'flex-end',
				}}
			>
				<Text
					style={{
						color: '#fff',
						paddingHorizontal: 10,
						fontWeight: "bold",
						paddingHorizontal: 20,
						paddingVertical: 10,
					}}
				>
					Vehicle Tracking
				</Text>
			</View>
		)
	}



	openImageHistory = (data) => {
		this.setState({ openImages: !this.state.openImages, selectedImageHistory: data })
	}

	listItem = (item) => {
		let arrival_photo_url = Configs.VEHICAL_IMAGE + item.arrival_photo;
		let upwords_journey_start_vehicle_photo_url = Configs.VEHICAL_IMAGE + item.upwords_journey_start_vehicle_photo;
		let upwords_journey_start_meter_photo_url = Configs.VEHICAL_IMAGE + item.upwords_journey_start_meter_photo;
		let upwords_journey_end_vehicle_photo_url = Configs.VEHICAL_IMAGE + item.upwords_journey_end_vehicle_photo;
		let upwords_journey_end_meter_photo_url = Configs.VEHICAL_IMAGE + item.upwords_journey_end_meter_photo;
		let downwords_journey_start_vehicle_photo_url = Configs.VEHICAL_IMAGE + item.downwords_journey_start_vehicle_photo;
		let downwords_journey_start_meter_photo_url = Configs.VEHICAL_IMAGE + item.downwords_journey_start_meter_photo;
		let downwords_journey_end_vehicle_photo_url = Configs.VEHICAL_IMAGE + item.downwords_journey_end_vehicle_photo;
		let downwords_journey_end_meter_photo_url = Configs.VEHICAL_IMAGE + item.downwords_journey_end_meter_photo;
		return (
			<View key={item.id} style={styles.listRow}>

				<TouchableOpacity key={item.id}
					// onLongPress={this.DeleteVehicle.bind(this, item.id)}
					onPress={() => { this.EditVehicle(item.id) }}
					style={{ flexDirection: 'row', height: 'auto' }}
					activeOpacity={1}
				>
					<View style={{ width: '70%' }}>
						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.subText}>Vendor Name : <Text >{item.vendor_name} ({item.type})</Text></Text>
						</View>
						<Text style={styles.subText}>
							Address : {item.from_address} to {item.to_address}
						</Text>

						<Text style={styles.subText}>Journey type: {item.journey_type}</Text>

						{/* <ShowMoreLess render={ () => (
								<>
									<View>
										<Text style={[styles.subText, { fontWeight: 'bold', marginTop: 10 }]}>Booked Details :-</Text>
										<Text style={styles.subText}>By: {item.booking_done_by} | {showDateAsClientWant(`${item.booking_date} ${item.booking_time}`)} | {showTimeAsClientWant(`${item.booking_date} ${item.booking_time}`)}</Text>
									</View>

									{ (item.grand_total !== null && item.line_total !== null ) && <View>
										<Text style={[styles.subText, { fontWeight: 'bold', marginTop: 10 }]}>Invoice Details :-</Text>
										<Text style={styles.subText}>Waiting Charges: ₹{item.waiting_charge}</Text>
										<Text style={styles.subText}>Others Charges: ₹{item.other_charges}</Text>
										<Text style={styles.subText}>Toll Charges: ₹{item.toll_charges}</Text>
										<Text style={styles.subText}>Permit Charges: ₹{item.permit_charge}</Text>
										<Text style={styles.subText}>Line Total: ₹{item.line_total}</Text>
										<Text style={styles.subText}>Discount: ₹{item.discount}</Text>
										<Text style={styles.subText}>Grand Total: ₹{item.grand_total}</Text>
									</View> }
								</>
							) } /> */}
					</View>
					<View style={[{ alignItems: 'flex-end', width: '30%' }]}>
						<VehicleButton 
						navigation={this.props.navigation} 
						vehicleInfo={item} 
						callBack={() => this.loadCurrentVehicleList()} 
						currentStatus={item.current_status} 
						orderData={this.state.orderData}
						/>
						{/* <TouchableOpacity 
                         onPress={this.DeleteVehicle.bind(this, item.id)}
                       style={[styles.rightPart, { alignItems: 'flex-end',opacity:Colors.opacity6,justifyContent:'flex-end',paddingTop:25 }]}>
                       <Ionicons name="trash-outline" size={24} color="black" />
                       </TouchableOpacity> */}
					</View>
				</TouchableOpacity>
				{item.current_status != "v-basic-info-recorded" ?
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => { this.openImageHistory(item.id) }}
						style={styles.Accordion_Image}
					>
						<Text style={{ fontSize: 14, color: Colors.white }}>Vehicle History</Text>
						{this.state.openImages ?
							<AntDesign name="down" size={12} color={Colors.white} />
							:
							<AntDesign name="right" size={12} color={Colors.white} />
						}
					</TouchableOpacity>
					: null}
				{this.state.selectedImageHistory == item.id && this.state.openImages ?
					<View>
						{item.arrival_photo != null ?
							<View>
								<Text style={styles.subText}>Vehicle Image:</Text>

								<Image source={{ uri: arrival_photo_url }} style={{ width: 100, height: 100, borderRadius: 6 }} />
								{item.arrival_date != null ?
								<Text style={styles.subText}>{moment(item.arrival_date).format('Do MMM YY')} </Text>
								:null}
							</View>
							: null}
						{item.upwords_journey_start_vehicle_photo != null || item.upwords_journey_start_meter_photo != null ?

							<View >
								<Text style={styles.subText}>Onward Journey Start Vehicle Image and Meter Image:</Text>
								<View style={{ flexDirection: 'row' }}>
									{item.upwords_journey_start_vehicle_photo != null ?
										<View>
											<Image source={{ uri: upwords_journey_start_vehicle_photo_url }} style={{ width: 100, height: 100, marginRight: 5, borderRadius: 6 }} />
											{item.upwords_journey_start_date != null ?
											<Text style={styles.subText}>{moment(item.upwords_journey_start_date).format('Do MMM YY')} </Text>
											:null}
										</View>
										: null}
									{item.upwords_journey_start_meter_photo != null ?
										<View>
											<Image source={{ uri: upwords_journey_start_meter_photo_url }} style={{ width: 100, height: 100, padding: 5, borderRadius: 6 }} />
										</View>
										: null}
								</View>
							</View>
							: null}
						{item.upwords_journey_end_vehicle_photo != null || item.upwords_journey_end_meter_photo != null ?
							<View >
								<Text style={styles.subText}>Onward Journey End Vehicle Image and Meter Image:</Text>
								<View style={{ flexDirection: 'row' }}>
									{item.upwords_journey_end_vehicle_photo != null ?
										<View>
											<Image source={{ uri: upwords_journey_end_vehicle_photo_url }} style={{ width: 100, height: 100, marginRight: 5, borderRadius: 6 }} />
											{item.upwords_journey_end_date != null ?
											<Text style={styles.subText}>{moment(item.upwords_journey_end_date).format('Do MMM YY')} </Text>
											:null}
										</View>
										: null}
									{item.upwords_journey_end_meter_photo != null ?
										<Image source={{ uri: upwords_journey_end_meter_photo_url }} style={{ width: 100, height: 100, padding: 5, borderRadius: 6 }} />
										: null}
								</View>
							</View>
							: null}
						{item.downwords_journey_start_vehicle_photo != null || item.downwords_journey_start_meter_photo != null ?
							<View >
								<Text style={styles.subText}>Return Journey Start Vehicle Image and Meter Image:</Text>
								<View style={{ flexDirection: 'row' }}>
									{item.downwords_journey_start_vehicle_photo != null ?
									<View>
										<Image source={{ uri: downwords_journey_start_vehicle_photo_url }} style={{ width: 100, height: 100, marginRight: 5, borderRadius: 6 }} />
										{item.downwords_journey_start_date != null ?
										<Text style={styles.subText}>{moment(item.downwords_journey_start_date).format('Do MMM YY')} </Text>
										:null}
										</View>
										: null}
									{item.downwords_journey_start_meter_photo != null ?
										<Image source={{ uri: downwords_journey_start_meter_photo_url }} style={{ width: 100, height: 100, padding: 5, borderRadius: 6 }} />
										: null}
								</View>
							</View>
							: null}
						{item.downwords_journey_end_vehicle_photo != null || item.downwords_journey_end_meter_photo != null ?
							<View >
								<Text style={styles.subText}>Return Journey End Vehicle Image and Meter Image:</Text>
								<View style={{ flexDirection: 'row' }}>
									{item.downwords_journey_end_vehicle_photo != null ?
									<View>
										<Image source={{ uri: downwords_journey_end_vehicle_photo_url }} style={{ width: 100, height: 100, marginRight: 5, borderRadius: 6 }} />
										{item.downwords_journey_end_date != null ?
										<Text style={styles.subText}>{moment(item.downwords_journey_end_date).format('Do MMM YY')} </Text>
										:null}
										</View>
										: null}
									{item.downwords_journey_end_meter_photo != null ?
										<Image source={{ uri: downwords_journey_end_meter_photo_url }} style={{ width: 100, height: 100, padding: 5, borderRadius: 6 }} />
										: null}
								</View>
							</View>
							: null}
					</View>
					: null}
			</View>
		)
	};

	enquiryItem = ({ item }) => (
		<ScrollView style={styles.container}>
			<TouchableOpacity key={item.id}
				onLongPress={this.DeleteVenderEnquiry.bind(this, item.id)}
				onPress={() => this.props.navigation.navigate("VenderEnquiryAddUpdate", { data: item })}
				style={styles.listRow}
			>

				<View style={styles.leftPart}>
					<View style={{ flexDirection: 'row' }}>
						<Text style={styles.title}>Call By: {item.enquiry_by}  </Text>
					</View>
					<Text style={styles.subText}>
						Date: {showDateAsClientWant(item.date)} ( {showTimeAsClientWant(item.time)} )
					</Text>
					<Text style={styles.subText}>{"Name: " + item.name}</Text>
					<Text style={styles.subText}>{"Mobile: " + item.mobile}</Text>
					<View style={{ flexDirection: 'row' }}>
						<Text style={styles.subText}>Status: </Text>
						{item.status == "0" && <Text style={{ color: Colors.danger, alignSelf: 'center' }}>Pending</Text>}
						{item.status == "1" && <Text style={{ color: Colors.danger, alignSelf: 'center' }}>Rejected</Text>}
						{item.status == "2" && <Text style={{ color: Colors.primary, alignSelf: 'center' }}>Approved</Text>}
					</View>
					<Text style={styles.subText}>Remark: {item.remark}</Text>
				</View>
				<View style={[styles.rightPart, { alignItems: 'flex-end' }]}>
					{
						item.attachment && (
							<MaterialIcons
								name="preview"
								color={Colors.primary}
								size={24}
								onPress={() => this.props.navigation.navigate("Preview", { url: Configs.UPLOAD_PATH + item.attachment })}
							/>
						)
					}

				</View>
			</TouchableOpacity>
		</ScrollView>
	);

	venderItem = ({ item }) => (
		<View key={item.id}
			style={styles.listRow}
		>
			<View style={styles.leftPart}>
				<TouchableOpacity onPress={() => this.dialCall(item.mobile, item)}>
					<View style={{ flexDirection: 'row' }}>
						<Text style={styles.title}>Vendor Name : {item.name}  </Text>
					</View>
					<Text style={styles.subText}>
						{"Shop Name: " + item.shop_name}
					</Text>

					<View style={{ flexDirection: 'row' }}>
						<Text style={styles.subText}>Mobile :</Text>
						<Text style={styles.subText}>{item.mobile}</Text>
					</View>


				</TouchableOpacity>
			</View>
			<View style={[styles.rightPart, { alignItems: 'flex-end' }]}>
			</View>
		</View>
	);

	render() {
		// console.log('////................', this.state.list)
		return (
			<>
				{this.state.isLoading ?
					<Loader /> :
					<View style={styles.container}>

						<View style={styles.tabContainer}>
							{this.state.tab === "List" ?
								<View style={[styles.tab, styles.activeTab, { flexDirection: 'row', alignItems: 'center' }]}>
									<Text style={styles.activeText}>
										Add Vehicle
									</Text>
									{this.context.userData.action_types.indexOf('Add') >= 0 ?
										<TouchableOpacity
											onPress={() => {
												this.props.navigation.navigate("AddVehicleInfo", {
													orderData: this.state.orderData,
													editstate: 0,
													editData: null
												});
											}}
										>
											<FontAwesome
												name="plus"
												size={15}
												color={Colors.white}
												style={{ marginLeft: 10 }}
											/>

										</TouchableOpacity>
										: null}
								</View>
								: <TouchableOpacity
									onPress={() => this.setState({ tab: 'List' })}
									style={styles.tab}
								>
									<Text
										style={styles.inActiveText}
									>
										Vehicles
									</Text>
								</TouchableOpacity>
							}


							{this.state.tab === "Enquiry" ? <View style={[styles.tab, styles.activeTab, { flexDirection: 'row', alignItems: 'center' }]}>
								<Text style={styles.activeText}>
									Call Records
								</Text>
								{this.context.userData.action_types.indexOf('Add') >= 0 ?
									<TouchableOpacity
										onPress={() => this.toggleVenderModal(null)}
									>
										<FontAwesome
											name="plus"
											size={15}
											color={Colors.white}
											style={{ marginLeft: 10 }}
										/>

									</TouchableOpacity>
									: null}
							</View>
								: <TouchableOpacity
									onPress={() => this.setState({ tab: 'Enquiry' })}
									style={styles.tab}
								>
									<Text
										style={styles.inActiveText}
									>
										Call Records
									</Text>
								</TouchableOpacity>
							}
						</View>

						{this.state.tab == "List" ?
							<ScrollView >
								{this.state.list.map((item) => {
									return this.listItem(item)
								})}
							</ScrollView>
							: null}

						{this.state.tab == "Enquiry" &&
							<View>

								<FlatList
									data={this.state.enquirys}
									keyExtractor={(item, index) => item.id.toString()}
									renderItem={this.enquiryItem}
									initialNumToRender={this.state.enquirys?.length}
									contentContainerStyle={styles.lsitContainer}
								/>

							</View>}

						<Modal
							animationType="fade"
							transparent={true}
							visible={this.state.isVenderModalOpen}
							onRequestClose={this.toggleVenderModal}
						>
							<SafeAreaView style={styles.modalOverlay}>
								<View style={styles.itemModalContainer}>
									<View style={styles.itemModalHeader}>
										<TouchableOpacity
											activeOpacity={1}
											style={styles.headerBackBtnContainer}
											onPress={this.toggleVenderModal}
										>
											<Ionicons name="arrow-back" size={26} color={Colors.white} />
										</TouchableOpacity>
										<View style={styles.headerTitleContainer}>
											<Text style={{ fontSize: 20, color: Colors.white }}>
												Contact Vendors
											</Text>
										</View>
									</View>
									<View style={styles.itemModalBody}>
										<FlatList
											data={this.state.venders}
											keyExtractor={(item, index) => item.id.toString()}
											renderItem={this.venderItem}
											initialNumToRender={this.state.venders?.length}
											contentContainerStyle={styles.lsitContainer}
										/>
									</View>
								</View>
							</SafeAreaView>
						</Modal>
					</View>
				}

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
const tabHeight = 50;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	tabContainer: {
		width: "100%",
		height: tabHeight,
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#d1d1d1",
		borderTopWidth: 0,
		borderTopColor: "#d1d1d1",
		backgroundColor: Colors.primary
		// elevation: 1,
		// marginTop: 10
	},

	tab: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		height: tabHeight,
	},
	underlineStyle: {
		backgroundColor: Colors.primary,
		height: 3,
	},
	activeTab: {
		height: tabHeight - 1,
		borderBottomWidth: 2,
		borderBottomColor: Colors.white,
	},
	activeText: {
		fontSize: 14,
		fontWeight: "bold",
		color: Colors.white,
	},
	inActiveText: {
		fontSize: 14,
		color: Colors.white,
		opacity: 0.8,
	},

	lsitContainer: {
		// flex: 1,
		margin: 5,
	},
	card: {
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.background,
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
		// elevation: 2
	},

	row: {
		marginTop: 5,
		flexDirection: 'row',
	},
	rowItem: {
		width: '33.33%',
		justifyContent: 'center',
		alignItems: 'center'
	},

	rowLebel: {
		fontWeight: 'bold',
		//color: 'silver',
		fontSize: 16

	},
	rowValue: {
		color: 'gray'
	},
	subText: {
		fontSize: 13,
		color: Colors.textColor,
		opacity: 0.9,
		marginBottom: 2,
	},
	btn_touch: {
		width: "10%",
		alignItems: "center",
		justifyContent: "center",
	},
	form: {
		flex: 1,
		padding: 8,
	},
	topBtnContainer: {
		width: "100%",
		flexDirection: "row",
		marginBottom: 30,
	},
	topBtn: {
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		marginRight: 15,
	},
	inputContainer: {
		width: "100%",
		marginBottom: 20,
	},
	inputLable: {
		fontSize: 16,
		color: Colors.textColor,
		marginBottom: 10,
		opacity: 0.8,
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
	},
	thead: {
		width: "100%",
		flexDirection: "row",
		height: 45,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderTopColor: Colors.textInputBorder,
		borderBottomColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
	},
	tbody: {
		flexDirection: "row",
		height: 45,
		borderBottomWidth: 1,
		borderBottomColor: Colors.textInputBorder,
	},
	tdLarge: {
		flex: 0.5,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderLeftColor: Colors.textInputBorder,
		borderRightColor: Colors.textInputBorder,
		justifyContent: "center",
		paddingHorizontal: 6,
	},
	tdSmall: {
		flex: 0.2,
		alignItems: "center",
		justifyContent: "center",
		borderRightWidth: 1,
		borderRightColor: Colors.textInputBorder,
		paddingHorizontal: 6,
	},
	tdLabel: {
		fontSize: 14,
		color: Colors.textColor,
		opacity: 0.8,
	},
	capsule: {
		height: 25,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		paddingBottom: 2,
		borderRadius: 50,
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
	modalOverlay: {
		justifyContent: "center",
		alignItems: "center",
		width: windowWidth,
		height: windowHeight,
		backgroundColor: Colors.background,
	},
	itemModalContainer: {
		flex: 1,
		width: windowWidth,
		height: windowHeight,
		backgroundColor: Colors.background,
	},
	itemModalHeader: {
		height: 55,
		flexDirection: "row",
		width: "100%",
		backgroundColor: Colors.primary,
		// elevation: 1,
		alignItems: "center",
		justifyContent: "flex-start",
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
	itemModalBody: {
		flex: 1,
		height: windowHeight - 55,
	},


	listRow: {
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		marginBottom: 10,
		margin: 10,
	},

	leftPart: {
		width: "70%",
		justifyContent: "center",
	},
	rightPart: {
		width: "30%",
		justifyContent: "center",
	},

	title: {
		fontSize: 16,
		color: Colors.textColor,
		fontWeight: "bold",
		lineHeight: 24,
	},

	subText: {
		color: Colors.textColor,
		opacity: 0.8,
		fontSize: 14,
		lineHeight: 22,
	},
	Accordion_Image: {
		backgroundColor: Colors.primary,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		width: '40%',
		padding: 5,
		borderRadius: 5,
		alignItems: 'baseline',
		marginVertical: 5,
		height: 30
	}
});
