import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Modal,
	Dimensions,
	Alert,
	FlatList,
	RefreshControl,
	SafeAreaView
} from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { DateAndTimePicker, Dropdown } from "../../components";
import Configs from "../../config/Configs";
import { VolunteerList, AddVolunteer, UpdateVolunteer, DeleteVolunteer } from "../../services/VolunteerApiService";
import { DeleteVenderEnquiry, VenderEnquiryList } from "../../services/VenderEnquiryApiService";
import { VenderList } from "../../services/VenderApiService";
import { getFormattedDate } from "../../utils/Util";
import AwesomeAlert from 'react-native-awesome-alerts';
import AppContext from "../../context/AppContext";
import * as SMS from 'expo-sms';
import moment from "moment";
import Loader from "../../components/Loader";

export default class Volunteers extends React.Component {

	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			data: this.props?.props.route?.params?.data,
			event_id: this.props?.props.route?.params?.data?.id,
			tab: 'List',
			id: "",
			vender_id: "",
			vender_name: "",
			booking_done_by: "",
			booking_date: "",
			booking_time: null,
			reporting_time: null,
			number_of_staff: "",
			number_of_hours: "",
			rate_per_hour: "",
			amount: "",
			mobile: "",
			reporting_date: "",
			closing_time: "",
			isModalOpen: false,
			isVenderModalOpen: false,
			list: [],
			venders: [],
			enquirys: [],

			isLoading: true,

			showAlertModal: false,
			alertMessage: "",
			alertType: '',
		};
	}


	componentDidMount = () => {
		this.focusListner = this.props.props?.navigation?.addListener("focus", () => {
			this.setState({
				isModalOpen: false,
				isVenderModalOpen: false,

			});
			this.Bind();
		});
		this.VenderList();
		this.Bind();
	};
	componentWillUnmount() {
		this.focusListner();
	}

	SendSms = async (mobile, msg) => {
		const result = await SMS.sendSMSAsync(
			[mobile],
			msg
		);
	}

	Bind() {
		this.VolunteerList();
		this.VenderEnquiryList();
	}


	VenderList() {
		VenderList().then(res => {
			this.setState({
				isLoading: false,
				venders: res.data,
				refreshing: false,
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	VenderEnquiryList() {
		VenderEnquiryList(this.state.event_id, 0).then(res => {
			this.setState({
				isLoading: false,
				enquirys: res.data,
				refreshing: false,
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	VolunteerList() {

		VolunteerList(this.state.event_id).then(res => {
			this.setState({
				isLoading: false,
				list: res.data,
				refreshing: false,
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	DeleteVolunteer = (id) => {
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to remove this volunteer?",
			[
				{
					text: "Yes",
					onPress: () => {
						DeleteVolunteer({ id: id }).then(res => {
							if (res.is_success) {
								this.VolunteerList();
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


	DeleteVenderEnquiry = (id) => {
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
		);
	}

	hideAlert = () => {
		this.setState({
			showAlertModal: false
		});
	};
	toggleVenderModal = () => this.setState({ isVenderModalOpen: !this.state.isVenderModalOpen });



	goToEnquiry = (item, mobile) => {
		let data = {
			event_id: this.state.event_id,
			vender_id: item.id,
			name: item.name,
			mobile: mobile,
			category: 0
		}
		this.props.props.navigation.navigate("VenderEnquiryAddUpdate", { data: data });
	}


	goToAddUpdateVolunteer = (item) => {
		let model = this.state.data;
		let data = {
			event_id: this.state.event_id,
			setup_end_time: model.setup_end_time,
			event_start_time: model.event_start_time,
			event_name: model.event_name,
		};
		if (item) {
			data = item;
			data.event_name = model.event_name;
		}
		this.props.props.navigation.navigate("VolunteerAddUpdate", { data: data });
	}

	renderDate = (date) => {
		let ab = "th";
		let day = moment(date, "YYYY-MM-DD").format("D");
		if (day == 1) {
			ab = "st";
		}
		if (day == 2) {
			ad = "nd";
		}
		let month = moment(date, "YYYY-MM-DD").format("MMM");
		let year = moment(date, "YYYY-MM-DD").format("YYYY");
		let day_name = moment(date, "YYYY-MM-DD").format("dddd");
		return `${day}${ab} - ${month} - ${year} (${day_name})`;
	}

	renderTime = (v_time) => {
		let time = moment(v_time, "HH:mm").format("hh:mm A");
		return `${time}`;
	}

	setMobile = (number) => {
		if (number?.length <= 10) {
			this.setState({ mobile: number });
		}
	}

	listItem = ({ item }) => (
		<TouchableOpacity key={item.id}
			onLongPress={this.DeleteVolunteer.bind(this, item.id)}
			onPress={() => this.goToAddUpdateVolunteer(item)}
			style={styles.listRow}
		>
			<View style={styles.leftPart}>
				<View style={{ flexDirection: 'row' }}>
					<View><Text>Vendor Name : <Text style={styles.title}>{item.vender_name}</Text></Text></View>
				</View>
				<Text style={styles.subText}>
					{"# of staff booked: " + item.number_of_staff} Guys
				</Text>
				<Text style={styles.subText}>Amount: {item.amount}</Text>
				{/* <Text style={[styles.subText, { fontWeight: 'bold', marginTop: 10 }]}>Reporting :-</Text> */}
				<Text style={styles.subText}>Reporting Date: {this.renderDate(item.reporting_date)}</Text>
				<Text style={styles.subText}>Reporting Time: {this.renderTime(item.reporting_time)}</Text>
			</View>

			<View style={[styles.rightPart, { alignItems: 'flex-end' }]}></View>
		</TouchableOpacity>
	);

	enquiryItem = ({ item }) => (
		<TouchableOpacity key={item.id}
			onLongPress={this.DeleteVenderEnquiry.bind(this, item.id)}
			onPress={() => this.props.props.navigation.navigate("VenderEnquiryAddUpdate", { data: item })}
			style={styles.listRow}
		>

			<View style={styles.leftPart}>
				<View style={{ flexDirection: 'row' }}>
					<Text style={styles.title}>Call By: {item.enquiry_by}  </Text>
				</View>
				<Text style={styles.subText}>
					{"Date: " + this.renderDate(item.date) + " (" + this.renderTime(item.time) + ")"}
				</Text>
				<Text style={styles.subText}>{"Name: " + item.name}</Text>
				<Text style={styles.subText}>{"Mobile: " + item.mobile}</Text>
				<View style={{ flexDirection: 'row' }}>
					<Text style={styles.subText}>Status: </Text>
					{item.status == "0" && <Text style={{ color: Colors.danger, alignSelf: 'center' }}>Pending</Text>}
					{item.status == "1" && <Text style={{ color: Colors.danger, alignSelf: 'center' }}>Rejected</Text>}
					{item.status == "2" && <Text style={{ color: Colors.primary, alignSelf: 'center' }}>Approved</Text>}
				</View>
				<Text style={styles.subText}>{"Remark: "}</Text>
				<Text style={styles.subText}>{item.remark}</Text>
			</View>
			<View style={[styles.rightPart, { alignItems: 'flex-end' }]}>
				<MaterialIcons
					name="preview"
					color={Colors.primary}
					size={24}
					onPress={() => this.props.props.navigation.navigate("Preview", { url: Configs.UPLOAD_PATH + item.attachment })}
				/>
			</View>

		</TouchableOpacity>
	);

	venderItem = ({ item }) => (
		<View key={item.id}
			onLongPress={this.DeleteVenderEnquiry.bind(this, item.id)}
			onPress={() => this.props.props.navigation.navigate("VenderEnquiryAddUpdate", { data: item })}
			style={styles.listRow}
		>

			<View style={styles.leftPart}>
				<View style={{ flexDirection: 'row' }}>
					<Text style={styles.title}>Vendor Name:{item.name}  </Text>
				</View>
				<Text style={styles.subText}>
					{"Shop Name: " + item.shop_name}
				</Text>

				<View style={{ flexDirection: 'row' }}>
					<Text style={styles.subText} t>Mobile :</Text>
					<TouchableOpacity onPress={() => this.goToEnquiry(item, item.mobile)}>
						<Text style={styles.rowValue}>{item.mobile}</Text>
					</TouchableOpacity>
				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
					<View>
						{item.mobiles?.map((row, index) => <TouchableOpacity key={index}
							onPress={() => this.goToEnquiry(item, row)}>
							<FontAwesome name="phone" size={17} color={'green'}><Text> {row}</Text></FontAwesome>
						</TouchableOpacity>)}
					</View>
				</View>
			</View>
			<View style={[styles.rightPart, { alignItems: 'flex-end' }]}>
			</View>
		</View>
	);

	render = () => (
		<>
			{this.state.isLoading ?
				<Loader /> :
				<View style={styles.container}>
					<View style={styles.tabContainer}>

						{this.state.tab === "List" ? <View style={[styles.tab, styles.activeTab, { flexDirection: 'row', alignItems: 'center' }]}>
							<Text style={styles.activeText}>
								Volunteer
							</Text>
							<TouchableOpacity
								onPress={() => this.goToAddUpdateVolunteer(null)}
							>
								<FontAwesome
									name="plus"
									size={14}
									color={Colors.primary}
									style={{ marginLeft: 10 }}
								/>

							</TouchableOpacity>

						</View>
							: <TouchableOpacity
								onPress={() => this.setState({ tab: 'List' })}
								style={styles.tab}
							>
								<Text
									style={styles.inActiveText}
								>
									Volunteers
								</Text>
							</TouchableOpacity>
						}


						{this.state.tab === "Enquiry" ? <View style={[styles.tab, styles.activeTab, { flexDirection: 'row', alignItems: 'center' }]}>
							<Text style={styles.activeText}>
							Call Records
							</Text>
							<TouchableOpacity
								onPress={() => this.toggleVenderModal(null)}
							>
								<FontAwesome
									name="plus"
									size={14}
									color={Colors.primary}
									style={{ marginLeft: 10 }}
								/>

							</TouchableOpacity>

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

					{this.state.tab == "List" && <View>

						<FlatList
							data={this.state.list}
							keyExtractor={(item, index) => item.id.toString()}
							renderItem={this.listItem}
							initialNumToRender={this.state.list?.length}
							contentContainerStyle={styles.lsitContainer}
							refreshControl={
								<RefreshControl
									refreshing={false}
									onRefresh={this.onRefresh}
								/>
							}
						/>

					</View>}


					{this.state.tab == "Enquiry" && <View>

						<FlatList
							data={this.state.enquirys}
							keyExtractor={(item, index) => item.id.toString()}
							renderItem={this.enquiryItem}
							initialNumToRender={this.state.enquirys.length}
							contentContainerStyle={styles.lsitContainer}
							refreshControl={
								<RefreshControl
									refreshing={false}
									onRefresh={this.onRefresh}
								/>
							}
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
										refreshControl={
											<RefreshControl
												refreshing={false}
												onRefresh={this.onRefresh}
											/>
										}
									/>
								</View>
							</View>
						</SafeAreaView>
					</Modal>


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
				</View>}
		</>
	);
}





const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	tabContainer: {
		width: "100%",
		height: tabHeight,
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#d1d1d1",
		borderTopWidth: 0,
		borderTopColor: "#d1d1d1",
		elevation: 1,
		marginTop: 10
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
		borderBottomColor: Colors.primary,
	},
	activeText: {
		fontSize: 14,
		fontWeight: "bold",
		color: Colors.primary,
	},
	inActiveText: {
		fontSize: 14,
		color: "silver",
		opacity: 0.8,
	},

	lsitContainer: {
		flex: 1,
		margin: 5,
		//height:'10%',
	},
	card: {
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
		elevation: 2,
	},


	rowContainer: {
		borderColor: 'silver',
		borderWidth: 1,
		borderRadius: 10,
		padding: 10,

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
		color: Colors.grey,
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
		color: Colors.grey,
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
		backgroundColor: Colors.white,
	},
	itemModalContainer: {
		flex: 1,
		width: windowWidth,
		height: windowHeight,
		backgroundColor: Colors.white,
	},
	itemModalHeader: {
		height: 55,
		flexDirection: "row",
		width: "100%",
		backgroundColor: Colors.primary,
		elevation: 1,
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

		flexDirection: "row",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		elevation: 10,
		marginBottom: 10,
		margin: 5,
	},

	leftPart: {
		width: "80%",
		justifyContent: "center",
	},
	rightPart: {
		width: "20%",
		justifyContent: "center",
	},

	title: {
		fontSize: 16,
		color: Colors.grey,
		fontWeight: "bold",
		lineHeight: 24,
	},

	subText: {
		color: Colors.grey,
		opacity: 0.8,
		fontSize: 14,
		lineHeight: 22,
	},
});
