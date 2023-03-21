import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Alert,
	FlatList,
	RefreshControl,
	Linking,
	Platform,
	SafeAreaView,
	Modal,
} from "react-native";
import {
	FontAwesome,
	Ionicons,
	MaterialIcons,
	Feather,
} from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";
import * as MediaLibrary from "expo-media-library";
import * as DocumentPicker from "expo-document-picker";
import * as mime from "react-native-mime-types";
import * as ImagePicker from "expo-image-picker";
import Colors from "../../config/colors";
import AwesomeAlert from "react-native-awesome-alerts";
import { getFileData } from "../../utils/Util";
import {
	CustomerComminationDetail,
	AddCustomerCommination,
	UpdateCustomerCommination,
	AddRecord,
	DeleteRecord,
	UpdateRecord,
} from "../../services/CustomerComminationApiService";
import { DateAndTimePicker } from "../../components";
import { getFormattedDate } from "../../utils/Util";
import { TemplateList } from "../../services/TemplateApiService";
import AppContext from "../../context/AppContext";
import * as FileSystem from "expo-file-system";

//import {SMS} from "expo";
import * as SMS from "expo-sms";
import Configs from "../../config/Configs";
import moment from "moment";
import Loader from "../../components/Loader";
import Modal2 from "react-native-modal";
export default class CustomerCommunications extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);
		console.log(
			".........this.props.........",
			JSON.parse(this.props?.orderData.alt_contact_number)
		);
		this.state = {
			isLoading: false,
			data: this.props?.orderData,
			order_id: this.props?.orderData?.id,
			activeTab: "sms",
			tmp_type: "",
			isCallRecordModalOpen: false,
			isSMSRecordModalOpen: false,
			isModalOpen: false,
			call_records: [],
			message_records: [],
			smsTemplates: [],
			name: this.props?.orderData.customer_name,
			phone: this.props?.orderData.customer_mobile,
			// alt_name: this.props?.orderData.alt_name,
			alt_phone: "",
			all_alt_contact_number:
				this.props?.orderData?.alt_contact_number != null
					? JSON.parse(this.props?.orderData.alt_contact_number)
					: [],
			time: new Date(),
			//record_by: "",
			comments: "",
			customer_name: this.props?.orderData.customer_name,
			fileName: undefined,
			attachment: undefined,
			template: undefined,
			template_name: "",
			index_of_array: "",

			showAlertModal: false,
			alertMessage: "",
			alertType: "",
			type: 0,
			isCommunicationModalOpen: false,
			selected: true,
			selectedforSMS: true,
			currentTab: "",
			allCommunication: [],
		};
	}

	componentDidMount = () => {
		this.CustomerComminationDetail();
		this.TemplateList();
	};

	SendSms = async (mobile, msg) => {
		const result = await SMS.sendSMSAsync([mobile], msg);
	};

	dialCall = (mobile) => {
		let phoneNumber = "";
		if (Platform.OS === "android") {
			phoneNumber = `tel:${mobile}`;
		} else {
			phoneNumber = `telprompt:${mobile}`;
		}

		Linking.openURL(phoneNumber);
	};

	TemplateList() {
		this.setState({
			isLoading: true,
		});

		TemplateList()
			.then((res) => {
				this.setState({
					isLoading: false,
					smsTemplates: res.data,
					refreshing: false,
				});
			})
			.catch((error) => {
				Alert.alert("Server Error ", error.message);
			});
	}

	CustomerComminationDetail() {
		// alert('......CustomerComminationDetail.....')
		this.setState({
			isLoading: true,
		});

		CustomerComminationDetail(this.state.order_id)
			.then((res) => {
				this.setState({
					isLoading: false,
				});

				if (res.is_success) {
					let data = res.data;
					// console.log("......CustomerComminationDetail..data.......", data);
					let tab = "call";
					if (data.type == 1) {
						tab = "sms";
					} else {
						tab = "call";
					}
					let allData = []
					if (data.message_records != null) {
						for (let i = 0; i < data.message_records.length; i++) {
							let item = data.message_records[i]
							allData.push(item)
						}
					}
					if (data.call_records != null) {
						for (let i = 0; i < data.call_records.length; i++) {
							let value = data.call_records[i]
							allData.push(value)
						}
					}
					console.log('..................allData..........', allData);

					this.setState({
						id: data.id,
						name: data.name,
						customer_name: data.name,
						phone: data.mobile,
						type: data.type,
						activeTab: tab,
						// alt_name: data.alt_name,
						// alt_phone: data.alt_phone,
						message_records: data.message_records ?? [],
						call_records: data.call_records ?? [],
						allCommunication: allData
					});
				}
			})
			.catch((error) => {
				Alert.alert("Server Error ", error.message);
			});
	}

	ControlRecordSubmit = () => {
		if (this.state.index_of_array !== "") {
			this.UpdateRecord();
			return;
		}
		if (this.state.type == 1) {
			this.SendSms(this.state.mobile, this.state.comments);
		} else {
			this.dialCall(this.state.mobile);
		}
		this.AddRecord();
	};

	RecordModel() {
		let model = {
			id: this.state.id,
			type: this.state.type,
			time: getFormattedDate(this.state.time),
			sent_by: this.context.userData?.name,
			name: this.state.customer_name,
			comments: this.state.comments,
			called_by: this.context.userData?.name,
			attachment: this.state.attachment,
			mobile: this.state.mobile,
			index_of_array: this.state.index_of_array,
		};

		// console.log('....RecordModel............', model);
		// return
		return model;
	}

	toggleAddRecord = (number, type) => {
		if (type == "call") {
			this.dialCall(number);
			this.setState({ mobile: number }, () => this.AddRecord());
		}
		if (type == "sms") {
			this.setState({ mobile: number, isSMSRecordModalOpen: true });
		}
	};

	AddRecord = () => {
		let model = this.RecordModel();
		this.setState({
			isLoading: true,
		});

		AddRecord(model)
			.then((res) => {
				this.setState({
					isLoading: false,
				});
				this.CustomerComminationDetail();
				if (res.is_success) {
					this.setState({
						isSMSRecordModalOpen: false,
						isCallRecordModalOpen: false,
						showAlertModal: true,
						alertType: "Success",
						alertMessage: res.message,
					});
				} else {
					this.setState({
						showAlertModal: true,
						alertType: "Error AddRecord",
						alertMessage: res.message,
					});
				}

				this.newRecordAsign();
			})
			.catch((error) => {
				Alert.alert("Server Error AddRecord", error.message);
			});
	};

	UpdateRecord = () => {
		let model = this.RecordModel();
		model.type = this.state.tmp_type;
		this.setState({
			isLoading: true,
		});
		UpdateRecord(model)
			.then((res) => {
				this.setState({
					isLoading: false,
				});
				this.CustomerComminationDetail();
				if (res.is_success) {
					this.setState({
						isSMSRecordModalOpen: false,
						isCallRecordModalOpen: false,
						showAlertModal: true,
						alertType: "Success",
						alertMessage: res.message,
					});
				} else {
					this.setState({
						showAlertModal: true,
						alertType: "Error UpdateRecord",
						alertMessage: res.message,
					});
				}

				this.newRecordAsign();
			})
			.catch((error) => {
				Alert.alert("Server Error UpdateRecord", error.message);
			});
	};

	DeleteRecord = (index, type) => {
		let model = {
			id: this.state.id,
			type: type,
			index_of_array: index,
		};

		Alert.alert("Are your sure?", "Are you sure you want to remove", [
			{
				text: "Yes",
				onPress: () => {
					DeleteRecord(model)
						.then((res) => {
							if (res.is_success) {
								this.CustomerComminationDetail();
							}
						})
						.catch((error) => {
							Alert.alert("Server Error DeleteRecord", error.message);
						});
				},
			},
			{
				text: "No",
			},
		]);
	};

	setActiveTab = (tab) => {
		let type = 0;
		if (tab == "sms") {
			type = 1;
		} else {
			type = 0;
		}
		console.log(".............................", type);
		this.setState({
			activeTab: tab,
			type: type,
		});
	};

	toggleCallRecordModal = () => {
		this.setState({
			isCallRecordModalOpen: !this.state.isCallRecordModalOpen,
			customer_name: this.state.name,
		});
		this.newRecordAsign();
	};

	newRecordAsign() {
		this.setState({
			index_of_array: "",
			sent_by: "",
			template: "",
			template_name: "",
			comments: "",
			called_by: "",
			mobile: "",
			fileName: "",
			tmp_type: "",
			attachment: null,
			customer_name: "",
		});
	}

	toggleCommunicationModal = () => {
		this.setState({
			isCommunicationModalOpen: !this.state.isCommunicationModalOpen,
			currentTab: "",
		});
	};
	colorChange = () => {
		this.setState({
			selected: !this.state.selected,
		});
	};
	colorChangeforSMS = () => {
		this.setState({
			selectedforSMS: !this.state.selectedforSMS,
		});
	};
	toggleSMSRecordModal = () => {
		this.setState({
			isSMSRecordModalOpen: !this.state.isSMSRecordModalOpen,
		});
		this.newRecordAsign();
	};

	encode = (uri) => {
		if (Platform.OS === "android") return encodeURI(`file://${uri}`);
		else return uri;
		// console.log('........encodeURI(`file://${uri}`)........', encodeURI(`file://${uri}`))
	};

	browseFile = async () => {
		try {
			// let result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, type: '*/*' });
			let result = await DocumentPicker.getDocumentAsync();
			// console.log('.....result....', result)
			if (result.type == "success") {
				this.encode(result.uri);
				// let fileBase64 = await FileSystem.readAsStringAsync(this.encode(result.uri), { encoding: 'base64' });
				let fileBase64 = await FileSystem.readAsStringAsync(result.uri, {
					encoding: FileSystem.EncodingType.Base64,
				});
				this.setState({
					fileName: result.name,
					attachment: fileBase64,
				});
			}
		} catch (e) {
			Alert.alert(
				"Warning",
				"Please grant the permission to access the media library."
			);
		}
	};

	editSMSRecordModal = (index, item) => {
		this.setState({
			index_of_array: index,
			isSMSRecordModalOpen: true,
			tmp_type: 1,
		});
		this.editModelAsign(item);
	};

	editCallRecordModal = (index, item) => {
		this.setState({
			index_of_array: index,
			tmp_type: 0,
			isCallRecordModalOpen: true,
		});
		this.editModelAsign(item);
	};

	editModelAsign(item) {
		this.setState({
			sent_by: item.sent_by,
			record_by: item.record_by,
			customer_name: item.name,
			mobile: item.mobile,
			comments: item.comments,
			called_by: item.called_by,
		});
	}

	GetModel() {
		let state = this.state;
		let model = {
			id: state.id,
			order_id: state.order_id,
			type: state.type,
			name: state.name,
			phone: state.phone,
			// alt_name: state.alt_name,
			alt_phone: state.alt_phone,
		};
		return model;
	}

	AddCustomerCommination() {
		let model = this.GetModel();
		this.setState({
			isLoading: true,
		});

		AddCustomerCommination(model)
			.then((res) => {
				this.setState({
					isLoading: false,
				});
				this.setState({
					isLoading: false,
				});
				if (res.is_success) {
					this.CustomerComminationDetail();
					this.setState({
						isModalOpen: false,
						showAlertModal: true,
						alertType: "Success",
						alertMessage: res.message,
					});
				} else {
					this.setState({
						showAlertModal: true,
						alertType: "Error AddCustomerCommination",
						alertMessage: res.message,
					});
				}
			})
			.catch((error) => {
				console.log(error);
				Alert.alert("Server Error AddCustomerCommination", error.message);
			});
	}

	UpdateCustomerCommination() {
		let model = this.GetModel();
		this.setState({
			isLoading: true,
		});

		UpdateCustomerCommination(model)
			.then((res) => {
				this.setState({
					isLoading: false,
				});
				if (res.is_success) {
					this.setState({
						isModalOpen: false,
						showAlertModal: true,
						alertType: "Success",
						alertMessage: res.message,
					});
					this.CustomerComminationDetail();
				} else {
					this.setState({
						showAlertModal: true,
						alertType: "Error UpdateCustomerCommination",
						alertMessage: res.message,
					});
				}
			})
			.catch((error) => {
				Alert.alert("Server Error ", error.message);
			});
	}

	ControlSubmit = () => {
		if (this.state.id) {
			this.UpdateCustomerCommination();
			return;
		}
		this.AddCustomerCommination();
	};

	setSMSTemplate = (v) => {
		this.setState({
			comments: v.template,
			template_name: v.name,
		});
	};

	hideAlert = () => {
		this.setState({
			showAlertModal: false,
		});
	};

	onTimeChange = (selectedDate) => this.setState({ time: selectedDate });

	toggleOpenModal = () =>
		this.setState({
			isModalOpen: !this.state.isModalOpen,
		});

	setMobile = (number) => {
		if (number?.length <= 10) {
			this.setState({ mobile: number });
		}
	};

	setPhone = (number) => {
		if (number?.length <= 10) {
			this.setState({ phone: number });
		}
	};

	setAltPhone = (number) => {
		if (number?.length <= 10) {
			this.setState({ alt_phone: number });
		}
	};

	renderDate = (date) => {
		// let day=moment(date, "YYYY-MM-DD").format("DD");
		// let month_year=moment(date, "YYYY-MM-DD").format("MMMM YYYY");
		// return `${day},${month_year}`;
		return moment(date, "YYYY-MM-DD").format("D/MM/YYYY");
	};

	renderTime = (v_time) => {
		let time = moment(v_time, "HH:mm").format("hh:mm A");
		return `${time}`;
	};

	render = () => (
		<SafeAreaView style={styles.container}>
			{this.state.isLoading ? (
				<Loader />
			) : (
				<View style={styles.form}>
					<KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
						{/* <View style={styles.topBtnContainer}>
              <TouchableOpacity
                onPress={this.setActiveTab.bind(this, "call")}
                style={
                  this.state.activeTab === "call"
                    ? styles.activeTopBtn
                    : styles.topBtn
                }
              >
                <Text
                  style={
                    this.state.activeTab === "call"
                      ? styles.activeTopBtnText
                      : styles.topBtnText
                  }
                >
                  Call
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.setActiveTab.bind(this, "sms")}
                style={
                  this.state.activeTab === "sms"
                    ? styles.activeTopBtn
                    : styles.topBtn
                }
              >
                <Text
                  style={
                    this.state.activeTab === "sms"
                      ? styles.activeTopBtnText
                      : styles.topBtnText
                  }
                >
                  SMS
                </Text>
              </TouchableOpacity>
            </View>  call & SMS*/}

						{/* <View style={styles.capsuleContainer}>
  					<TouchableOpacity
  						onPress={this.toggleOpenModal}
  						style={[styles.capsule, { backgroundColor: Colors.primary }]}
  					>
  						<FontAwesome
  							name="edit"
  							size={18}
  							color={Colors.white}
  							style={{ marginTop: 2, marginRight: 3 }}
  						/>
  					</TouchableOpacity>
  				</View> */}

						<View style={{ backgroundColor: Colors.background }}>
							<SafeAreaView
								// key={item.id}
								// onLongPress={() => console.log("delet enq")}
								// onPress={() => console.log("go to more update page")}
								style={[styles.listRowNew, { backgroundColor: Colors.white }]}
							>
								<View style={{ backgroundColor: Colors.white, width: "100%" }}>
									<TouchableOpacity
										onPress={() => this.toggleCommunicationModal()}
									>
										<View style={{ flexDirection: "row", marginBottom: 5 }}>
											<Text style={styles.textstyle}>
												Contact Name: {this.state.name}{" "}
											</Text>
										</View>
										<View style={{ flexDirection: "row" }}>
											<Text style={styles.subTextNew} t>
												Contact Number:
											</Text>

											<Text style={styles.rowValue}> {this.state.phone}</Text>
										</View>

										{/* <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View>
                {item.mobiles?.map((number, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => this.dialCall(number, item)}
                  >
                    <FontAwesome name="phone" size={17} color={"green"}>
                      <Text>{number}</Text>
                    </FontAwesome>
                  </TouchableOpacity>
                ))}
              </View>
            </View> */}
									</TouchableOpacity>
								</View>
							</SafeAreaView>
						</View>

						{/* <View style={styles.inputContainer}>
              <Text style={styles.inputLable}>Contact Name:</Text>
              <Text style={styles.textInput}>{this.state.name}</Text>
            </View> */}

						{/* <View style={styles.inputContainer}>
              <Text style={styles.inputLable}>Contact Number:</Text>
              <Text style={styles.textInput}>{this.state.phone}</Text>
              <TouchableOpacity style={styles.callBtn}>
                {this.state.activeTab === "call" ? (
                  <Feather
                    name="phone-call"
                    color={Colors.primary}
                    size={20}
                    onPress={() =>
                      this.toggleAddRecord(this.state.phone, "call")
                    }
                  />
                ) : (
                  <MaterialIcons
                    name="message"
                    color={Colors.primary}
                    size={24}
                    onPress={() =>
                      this.toggleAddRecord(this.state.phone, "sms")
                    }
                  />
                )}
              </TouchableOpacity>
            </View> */}

						{/* <View style={styles.inputContainer}>
  					<Text style={styles.inputLable}>Alt. Contact Name:</Text>
  					<Text style={styles.textInput}>{this.state.alt_name}</Text>
  				</View> */}
						{this.state.all_alt_contact_number != null ? (
							<>
								{this.state.all_alt_contact_number.map((item) => {
									return (
										<View style={styles.inputContainer}>
											<Text style={styles.inputLable}>
												Alt. Contact Number:
											</Text>
											<Text style={styles.textInput}>{item.number}</Text>
											<TouchableOpacity style={styles.callBtn}>
												{this.state.activeTab === "call" ? (
													<Feather
														name="phone-call"
														color={Colors.primary}
														size={20}
														onPress={() =>
															this.toggleAddRecord(item.number, "call")
														}
													/>
												) : (
													<MaterialIcons
														name="message"
														color={Colors.primary}
														size={24}
														onPress={() =>
															this.toggleAddRecord(item.number, "sms")
														}
													/>
												)}
											</TouchableOpacity>
										</View>
									);
								})}
							</>
						) : null}
						{/* <View style={styles.inputContainer}>
  					<Text style={styles.inputLable}>Alt. Contact Number:</Text>
  					<Text style={styles.textInput}>{this.state.alt_phone}</Text>
  					<TouchableOpacity style={styles.callBtn}>
  						{this.state.activeTab === "call" ? (
  							<Feather name="phone-call" color={Colors.primary} size={20}
  								onPress={() => this.toggleAddRecord(this.state.alt_phone, "call")} />
  						) : (
  							<MaterialIcons
  								name="message"
  								color={Colors.primary}
  								size={24}
  								onPress={() => this.toggleAddRecord(this.state.alt_phone, "sms")}
  							/>
  						)}
  					</TouchableOpacity>
  				</View> */}

						{/* {this.state.activeTab === "call" ? (
              <>
                {this.state.call_records.map((item, index) => {
                  // console.log('......call_records....',item)
                  return (
                    <TouchableOpacity
                      key={index}
                      onLongPress={() => this.DeleteRecord(index, 0)}
                      onPress={() => this.editCallRecordModal(index, item)}
                    >
                      <View style={styles.listRow}>
                        <View style={styles.leftPart}>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={styles.title}>
                              Called Number:{item.mobile}({item.name}){" "}
                            </Text>
                          </View>
                          <Text style={styles.subText}>
                            {"Call By: " + item.called_by}
                          </Text>
                          <Text style={styles.subText}>
                            Call date {"&"} time : {this.renderDate(item.date)}{" "}
                            ({this.renderTime(item.time)})
                          </Text>
                          <Text style={styles.subText}>Comments :</Text>
                          <Text style={styles.subText}>{item.comments}</Text>
                        </View>
                        <View
                          style={[styles.rightPart, { alignItems: "flex-end" }]}
                        >
                          <MaterialIcons
                            name="preview"
                            color={Colors.primary}
                            size={24}
                            onPress={() =>
                              this.props.navigation.navigate("Preview", {
                                url: Configs.UPLOAD_PATH + item.attachment,
                              })
                            }
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            ) : (
              <>
                {this.state.message_records.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onLongPress={() => this.DeleteRecord(index, 1)}
                    onPress={() => this.editSMSRecordModal(index, item)}
                  >
                    <View style={styles.listRow}>
                      <View style={styles.leftPart}>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.title}>
                            Customer Number:{item.mobile}({item.name}){" "}
                          </Text>
                        </View>
                        <Text style={styles.subText}>
                          Sent by: {item.sent_by}
                        </Text>
                        <Text style={styles.subText}>
                          Sent date {"&"} time : {this.renderDate(item.date)} (
                          {this.renderTime(item.time)})
                        </Text>
                        <Text style={styles.subText}>
                          {"Mobile: " + item.mobile}
                        </Text>
                        <Text style={styles.subText}>Comments :</Text>
                        <Text style={styles.subText}>{item.comments}</Text>
                      </View>
                      <View
                        style={[styles.rightPart, { alignItems: "flex-end" }]}
                      ></View>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )} */}


						<>
							{this.state.allCommunication.map((item, index) => {
								return (
									<TouchableOpacity
										key={index}
										onLongPress={() => this.DeleteRecord(index, 0)}
										onPress={() => item?.sent_by ? this.editSMSRecordModal(index, item) : this.editCallRecordModal(index, item)}
									>
										<View style={styles.listRow}>
											<View style={styles.leftPart}>
												<View style={{ flexDirection: "row" }}>
													{item.name != '' ?
														<Text style={styles.title}>
															Customer Number:{item.mobile}({item.name}){" "}
														</Text>
														:
														<Text style={styles.title}>
															Customer Number:{item.mobile}{" "}
														</Text>
													}
												</View>
												{item?.called_by ?
													<>
														<Text style={styles.subText}>
															{"Call By: " + item.called_by}
														</Text>

														<Text style={styles.subText}>
															Call date {"&"} time : {this.renderDate(item.date)}{" "}
															({this.renderTime(item.time)})
														</Text>
													</>
													: null}
												{item?.sent_by ?
													<>
														<Text style={styles.subText}>
															Sent by: {item.sent_by}
														</Text>
														<Text style={styles.subText}>
															Sent date {"&"} time : {this.renderDate(item.date)} (
															{this.renderTime(item.time)})
														</Text>
													</>
													: null}
												{item.comments != '' ?
													<>
														<Text style={styles.subText}>Comments :</Text>
														<Text style={styles.subText}>{item.comments}</Text>
													</>
													: null}
												{item.mobile != '' ?
													<Text style={styles.subText}>
														{"Mobile: " + item.mobile}
													</Text>
													: null}
											</View>
											<View
												style={[styles.rightPart, { alignItems: "flex-end" }]}
											>
												<MaterialIcons
													name="preview"
													color={Colors.primary}
													size={24}
													onPress={() =>
														this.props.navigation.navigate("Preview", {
															url: Configs.UPLOAD_PATH + item.attachment,
														})
													}
												/>
											</View>
										</View>
									</TouchableOpacity>
								);
							})}
						</>

						{/* <View style={styles.capsuleContainer}>
  					<TouchableOpacity
  						onPress={
  							this.state.activeTab === "call"
  								? this.toggleCallRecordModal
  								: this.toggleSMSRecordModal
  						}
  						style={[styles.capsule, { backgroundColor: Colors.grey }]}
  					>
  						<FontAwesome
  							name="plus"
  							size={10}
  							color={Colors.white}
  							style={{ marginTop: 2, marginRight: 3 }}
  						/>
  						<Text style={{ fontSize: 12, color: Colors.white }}>
  							Add Record
  						</Text>
  					</TouchableOpacity>
  				</View> */}
					</KeyboardAwareScrollView>
				</View>
			)}
			{/* Modal */}
			<Modal
				animationType="fade"
				transparent={true}
				visible={this.state.isModalOpen}
				onRequestClose={this.toggleOpenModal}
			>
				<SafeAreaView style={styles.modalOverlay}>
					<View style={styles.itemModalContainer}>
						<View style={styles.itemModalHeader}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.headerBackBtnContainer}
								onPress={this.toggleOpenModal}
							>
								<Ionicons name="arrow-back" size={26} color={Colors.white} />
							</TouchableOpacity>
							<View style={styles.headerTitleContainer}>
								<Text style={{ fontSize: 20, color: Colors.white }}>
									{this.state.id ? "Update" : "Add"} Commination
								</Text>
							</View>
						</View>

						<View style={styles.itemModalBody}>
							<View style={styles.form}>
								<KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
									<View style={styles.inputContainer}>
										<Text style={styles.inputLable}>Contact Name:</Text>
										<TextInput
											value={this.state.name}
											autoCompleteType="off"
											autoCapitalize="words"
											style={styles.textInput}
											onChangeText={(name) => this.setState({ name })}
										/>
									</View>

									<View style={styles.inputContainer}>
										<Text style={styles.inputLable}>Contact Number:</Text>
										<TextInput
											value={this.state.phone}
											autoCompleteType="off"
											autoCapitalize="words"
											keyboardType="numeric"
											style={styles.textInput}
											onChangeText={(phone) => this.setPhone(phone)}
										/>
									</View>

									{/* <View style={styles.inputContainer}>
  									<Text style={styles.inputLable}>Alt. Contact Name:</Text>
  									<TextInput
  										value={this.state.alt_name}
  										autoCompleteType="off"
  										autoCapitalize="words"
  										style={styles.textInput}
  										onChangeText={(alt_name) =>
  											this.setState({ alt_name })
  										}
  									/>
  								</View> */}

									{/* <View style={styles.inputContainer}>
  									<Text style={styles.inputLable}>Alt. Contact Number:</Text>
  									<TextInput
  										value={this.state.alt_phone}
  										autoCompleteType="off"
  										autoCapitalize="words"
  										keyboardType="numeric"
  										style={styles.textInput}
  										onChangeText={(alt_phone) =>
  											this.setAltPhone(alt_phone)
  										}
  									/>
  								</View> */}

									<TouchableOpacity
										style={styles.submitBtn}
										onPress={this.ControlSubmit}
									>
										<Text style={{ fontSize: 18, color: Colors.white }}>
											{this.state.id ? "Update" : "Add"}
										</Text>
									</TouchableOpacity>
								</KeyboardAwareScrollView>
							</View>
						</View>
					</View>
				</SafeAreaView>
			</Modal>
			{/* Call Record Modal */}
			<Modal
				animationType="fade"
				transparent={true}
				visible={this.state.isCallRecordModalOpen}
				onRequestClose={this.toggleCallRecordModal}
			>
				<SafeAreaView style={styles.modalOverlay}>
					<View style={styles.itemModalContainer}>
						<View style={styles.itemModalHeader}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.headerBackBtnContainer}
								onPress={this.toggleCallRecordModal}
							>
								<Ionicons name="arrow-back" size={26} color={Colors.white} />
							</TouchableOpacity>
							<View style={styles.headerTitleContainer}>
								<Text style={{ fontSize: 20, color: Colors.white }}>
									{this.state.index_of_array !== "" ? "Update" : "Add"}{" "}
									{"Call Record"}
								</Text>
							</View>
						</View>

						<View style={styles.itemModalBody}>
							<View style={styles.form}>
								<KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
									{/* <View style={styles.inputContainer}>
  									<Text style={styles.inputLable}>Contact Name:</Text>
  									<TextInput
  										value={this.state.customer_name}
  										autoCompleteType="off"
  										autoCapitalize="words"
  										style={styles.textInput}
  										onChangeText={(customer_name) =>
  											this.setState({ customer_name })
  										}
  									/>
  								</View>
  								<DateAndTimePicker
  									mode={"date"}
  									label={"Call Date:"}
  									value={this.state.time}
  									onChange={this.onTimeChange}
  								/>

  								<View style={styles.inputContainer}>
  									<Text style={styles.inputLable}>Mobile:</Text>
  									<TextInput
  										value={this.state.mobile}
  										autoCompleteType="off"
  										autoCapitalize="words"
  										keyboardType="numeric"
  										style={styles.textInput}
  										onChangeText={(mobile) => this.setMobile(mobile)}
  									/>
  								</View> */}

									<View style={styles.inputContainer}>
										<Text style={styles.inputLable}>Comments:</Text>
										<TextInput
											value={this.state.comments}
											autoCompleteType="off"
											autoCapitalize="words"
											style={styles.textInput}
											multiline={true}
											onChangeText={(comments) => this.setState({ comments })}
										/>
									</View>

									<View style={styles.inputContainer}>
										<Text style={styles.inputLable}>Attach Proof:</Text>
										<TouchableOpacity onPress={this.browseFile}>
											<TextInput
												editable={false}
												value={this.state.fileName}
												style={styles.textInput}
												placeholder="Browse File"
											/>
										</TouchableOpacity>
									</View>

									<TouchableOpacity
										style={styles.submitBtn}
										onPress={this.ControlRecordSubmit}
									>
										<Text style={{ fontSize: 18, color: Colors.white }}>
											{this.state.index_of_array !== "" ? "Update" : "Add"}
										</Text>
									</TouchableOpacity>
								</KeyboardAwareScrollView>
							</View>
						</View>
					</View>
				</SafeAreaView>
			</Modal>
			{/* SMS Record Modal */}
			<Modal
				animationType="fade"
				transparent={true}
				visible={this.state.isSMSRecordModalOpen}
				onRequestClose={this.toggleSMSRecordModal}
			>
				<SafeAreaView style={styles.modalOverlay}>
					<View style={styles.itemModalContainer}>
						<View style={styles.itemModalHeader}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.headerBackBtnContainer}
								onPress={this.toggleSMSRecordModal}
							>
								<Ionicons name="arrow-back" size={26} color={Colors.white} />
							</TouchableOpacity>
							<View style={styles.headerTitleContainer}>
								<Text style={{ fontSize: 20, color: Colors.white }}>
									{this.state.index_of_array !== "" ? "Update" : "Add"}{" "}
									{"SMS Record"}
								</Text>
							</View>
						</View>

						<View style={styles.itemModalBody}>
							<View style={styles.form}>
								<KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
									{/* <View style={styles.inputContainer}>
  									<Text style={styles.inputLable}>Contact Name:</Text>
  									<TextInput
  										value={this.state.customer_name}
  										autoCompleteType="off"
  										autoCapitalize="words"
  										style={styles.textInput}
  										onChangeText={(customer_name) =>
  											this.setState({ customer_name })
  										}
  									/>
  								</View>
  								<DateAndTimePicker
  									mode={"date"}
  									label={"SMS Date:"}
  									value={this.state.time}
  									onChange={this.onTimeChange}
  								/>

  								<View style={styles.inputContainer}>
  									<Text style={styles.inputLable}>Mobile:</Text>
  									<TextInput
  										value={this.state.mobile}
  										autoCompleteType="off"
  										autoCapitalize="words"
  										keyboardType="numeric"
  										style={styles.textInput}
  										onChangeText={(mobile) => this.setMobile(mobile)}
  									/>
  								</View> */}

									<View style={styles.inputContainer}>
										<Text style={styles.inputLable}>Select Template:</Text>
										<Dropdown
											value={this.state.template_name}
											data={this.state.smsTemplates}
											onChange={this.setSMSTemplate}
											style={styles.textInput}
											inputSearchStyle={styles.inputSearchStyle}
											// placeholderStyle={styles.textInput}
											// selectedTextStyle={styles.textInput}
											search
											labelField="name"
											valueField="name"
											placeholder={
												!this.state.template_name
													? "Select SMS Template"
													: "..."
											}
											searchPlaceholder="Search..."
										/>
									</View>

									<View style={styles.inputContainer}>
										<Text style={styles.inputLable}>Comments:</Text>
										<TextInput
											value={this.state.comments}
											autoCompleteType="off"
											autoCapitalize="words"
											style={styles.textInput}
											multiline={true}
											onChangeText={(comments) => this.setState({ comments })}
										/>
									</View>

									<TouchableOpacity
										style={styles.submitBtn}
										onPress={this.ControlRecordSubmit}
									>
										<Text style={{ fontSize: 18, color: Colors.white }}>
											{this.state.index_of_array !== "" ? "Update" : "Add"}
										</Text>
									</TouchableOpacity>
								</KeyboardAwareScrollView>
							</View>
						</View>
					</View>
				</SafeAreaView>
			</Modal>

			{/* new modal after design changes(Dibyendu,20-12-2022) */}
			<Modal2
				isVisible={this.state.isCommunicationModalOpen}
				onRequestClose={this.toggleCommunicationModal}
				onBackdropPress={() => { }}
			>
				<View
					style={{
						backgroundColor: "#fff",
						width: "100%",
						height: "25%",
						alignItems: "center",
						justifyContent: "center",
						paddingBottom: 3,
						//top: -15,
					}}
				>
					<Text style={{ fontSize: 16, marginVertical: 8, paddingBottom: 10 }}>
						Select Call or SMS to conitnue..
					</Text>
					<View
						style={{
							paddingBottom: 3,
							flexDirection: "row",
							justifyContent: "space-between",
							//top: -15,
						}}
					>
						{this.state.currentTab == "Call" ? (
							<View style={{ marginHorizontal: 25 }}>
								<View style={styles.inputContainerNew}>
									<TouchableOpacity style={styles.colorchange2}>
										<Text style={styles.inputLableNew}>Call</Text>
									</TouchableOpacity>
								</View>
							</View>
						) : (
							<View style={{ marginHorizontal: 25, marginBottom: 20 }}>
								<TouchableOpacity
									style={styles.colorchange1}
									onPress={() => {
										this.setState({
											currentTab: "Call",
											isCommunicationModalOpen: false,
										});
										this.setActiveTab("call");
										this.toggleAddRecord(this.state.phone, "call");
									}}
								>
									<Text style={styles.inputLableNewforText}> Call </Text>
								</TouchableOpacity>
							</View>
						)}
						{this.state.currentTab === "SMS" ? (
							<View style={{ marginHorizontal: 25 }}>
								<View style={styles.inputContainerNew}>
									<TouchableOpacity
										style={styles.colorchange2}
									// onPress={() =>
									//   this.toggleAddRecord(this.state.alt_phone, "sms")
									// }
									>
										<Text style={styles.inputLableNew}>SMS</Text>
									</TouchableOpacity>
								</View>
							</View>
						) : (
							<View style={{ marginHorizontal: 25, marginBottom: 20 }}>
								<TouchableOpacity
									onPress={() => {
										this.setActiveTab("sms");
										this.setState({
											currentTab: "sms",
											isCommunicationModalOpen: false,
										});
										this.toggleAddRecord(this.state.alt_phone, "sms");
									}}
									style={styles.colorchange1}
								>
									<Text style={styles.inputLableNewforText}> SMS </Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</View>
			</Modal2>
		</SafeAreaView>
	);
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		//backgroundColor: Colors.white,
		backgroundColor: Colors.background,
	},
	form: {
		flex: 1,
		padding: 8,
	},

	lsitContainer: {
		flex: 1,
	},
	card: {
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
		//elevation: 2
	},

	row: {
		marginTop: 5,
		flexDirection: "row",
	},
	rowItem: {
		width: "33.33%",
		justifyContent: "center",
		alignItems: "center",
	},

	rowLebel: {
		fontWeight: "bold",
		//color: 'silver',
		fontSize: 16,
	},
	rowValue: {
		color: Colors.textColor,
	},

	topBtnContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginVertical: 15,
	},
	topBtn: {
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		borderRadius: 3,
	},
	activeTopBtn: {
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: Colors.primary,
		backgroundColor: Colors.primary,
		borderRadius: 3,
	},
	topBtnText: {
		fontSize: 14,
		color: Colors.grey,
	},
	activeTopBtnText: {
		fontSize: 14,
		color: Colors.white,
	},
	inputContainer: {
		width: "100%",
		marginBottom: 20,
	},
	inputContainerNew: {
		width: "100%",
		marginBottom: 20,
	},
	inputLable: {
		fontSize: 16,
		color: Colors.grey,
		marginBottom: 10,
		opacity: 0.8,
	},
	inputLableNew: {
		fontSize: 16,
		color: Colors.white,
		marginBottom: 0,
		opacity: 0.8,
		marginVertical: 7,
		marginHorizontal: 15,
		alignSelf: "center",
		paddingBottom: 8,
	},
	inputLableNewforText: {
		fontSize: 16,
		color: Colors.primary,
		marginBottom: 0,
		opacity: 0.8,
		marginVertical: 7,
		marginHorizontal: 10,
		alignSelf: "center",
		paddingBottom: 8,
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
		color: Colors.grey,
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
	td: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		borderLeftWidth: 1,
		borderLeftColor: Colors.textInputBorder,
		paddingHorizontal: 6,
	},
	tdLabel: {
		fontSize: 14,
		color: Colors.grey,
		opacity: 0.8,
	},
	capsuleContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		marginVertical: 10,
	},
	capsule: {
		height: 25,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		paddingBottom: 2,
		borderRadius: 50,
	},
	callBtn: {
		position: "absolute",
		padding: 8,
		bottom: 5,
		right: 0,
	},

	submitBtnCom: {
		marginTop: 15,
		marginBottom: 15,
		alignItems: "center",
		justifyContent: "center",
	},

	submitBtn: {
		marginTop: 15,
		marginBottom: 15,
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
		borderColor: "#eee",
		borderWidth: 1,
		padding: 20,
		margin: 10,
		backgroundColor: Colors.white,
	},

	leftPart: {
		width: "80%",
		justifyContent: "center",
	},
	textstyle: {
		fontSize: 14,
		color: Colors.textColor,
		// fontWeight: "bold",
		lineHeight: 24,
		// opacity:Colors.opacity6
	},
	listRowNew: {
		flexDirection: "row",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		// elevation: 10,
		marginBottom: 10,
		margin: 5,
	},
	rightPart: {
		width: "20%",
		justifyContent: "center",
	},

	title: {
		//fontSize: 16,
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
	subTextNew: {
		fontSize: 13,
		color: Colors.textColor,
		marginBottom: 5,
	},
	colorchange1: {
		borderWidth: 2,
		borderColor: Colors.primary,
		marginHorizontal: 7,
		borderRadius: 5,
	},
	colorchange2: {
		borderWidth: 2,
		borderColor: Colors.primary,
		backgroundColor: Colors.primary,
		marginHorizontal: 7,
		borderRadius: 5,
	},
});

{
	/* <View
			  style={{
				backgroundColor: "#fff",
				padding: 55,
				alignItems: "center",
				paddingBottom: 3,
  
				marginHorizontal: 2,
				//top: -15,
			  }}
			>
			  <Text style={{ paddingBottom: 18 }}>
				Select Call or SMS to conitnue..{" "}
			  </Text>
			  <View style={styles.inputContainerNew}>
				<TouchableOpacity
				  onPress={() => this.colorChange()}
				  //style={{ color: this.state.selected ? "red" : "green" }}
  
				  style={
					this.state.selected
					  ? styles.colorchange1
					  : styles.colorchange2
				  }
				  //   style={{
				  //   borderBottomWidth: 2,
				  //   borderColor: Colors.primary,
				  //   marginHorizontal: 10,
				  //   borderWidth: 2,
				  // }}
				  // :
				>
				  <Text
					style={
					  this.state.selected
						? styles.inputLableNewforText
						: styles.inputLableNew
					}
				  >
					Call
				  </Text>
				</TouchableOpacity>
				<TouchableOpacity
				  onPress={() =>
					this.setState({
					  currentTab: "Call",
					  subTab: "SMS",
					})
				  }
				  style={
					this.state.selectedforSMS
					  ? styles.colorchange1
					  : styles.colorchange2
				  }
				>
				  <Text
					style={
					  this.state.selected
						? styles.inputLableNewforText
						: styles.inputLableNew
					}
				  >
					SMS
				  </Text>
				</TouchableOpacity>
			  </View>
			</View> */
}
