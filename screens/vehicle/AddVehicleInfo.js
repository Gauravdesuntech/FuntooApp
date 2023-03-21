import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import Colors from "../../config/colors";
import { Header } from "../../components";
import AwesomeAlert from "react-native-awesome-alerts";
import { getFormattedDate,showDateAsClientWant,showDayAsClientWant,showDayAsdate,showDateAsWant } from "../../utils/Util";
import { AddVehicleInfo as AddVehicleInfoApiService,UpdateVehicleInfo } from "../../services/VehicleInfoApiService";
import OverlayLoader from "../../components/OverlayLoader";
import { VenderList } from "../../services/VenderApiService";
import { GetAllWareHouses } from "../../services/WareHouseService";
import AppContext from "../../context/AppContext";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";
import DateAndTimePicker2 from "../../components/DateAndTimePicker2";
import GoogleAddressPickerModal from "../../components/GoogleAddressPickerModal";
import DateTimerPicker from "../../components/DateTimerPicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GetOrder } from "../../services/OrderService";
import { DeleteVehicleInfo } from "../../services/VehicleInfoApiService";
import { update_track_log } from "../../services/APIServices";

export default class AddVehicleInfo extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      orderData: this.props.route.params.orderData,
      editstate: this.props.route.params.editstate,
      editData: this.props.route.params.editData,
      selected_warehouse: "",
      warehouse_data: [],
      vender_name: "",
      vendor_id: null,
      venders: [],
      phone: "",
      type: "",
      journey_type: "",
      schedule_date: "",
      schedule_time: "",
      booking_done_by: "",
      booking_date: "",
      booking_time: "",
      from_address: "",
      to_address: "",
      formErrors: {},
      isGoogleAddressModalVisible: false,
      showvenderAlertModal: false,
      mode: "",
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      selectedDate: "",
      orderDetails:'',
      othervendor:{
        id:"other",
        name:"Add Vendor",
      }
    };
  }

  currentTime = () => {
    return moment(new Date()).format("HH:mm");
  };

  fetchData = () => {
		GetOrder({ id: this.state.orderData.id })
		.then((result) => {
			if (result.is_success) {
				this.setState({
					orderDetails: result.data,
          to_address: result.data.event_data.google_location,
				});
			}
		})
		.catch(err => console.log(err))
	}

  calculateScheduleTime = (setup_timestamp) => {
    let m = moment(`${setup_timestamp}`, "YYYY-MM-DD hh:mm:ss").subtract(
      4,
      "hours"
    );

    return moment(m).format("h:mm");
  };

  componentDidMount() {
    this.focusListner = this.props.navigation.addListener("focus", () => {
			this.Bind();
		});
    if(this.state.editstate == 0)
    {this.fetchData();
    let d = new Date();
    d.setTime(
      Date.parse(this.state.orderData.setup_timestamp.replace(" ", "T"))
    );

    this.setState(
      {
        
        booking_done_by: this.context.userData.name,
        booking_date: moment().format("YYYY-MM-DD"),
        booking_time: this.currentTime(),
        journey_type: "Onward",
        schedule_date: d,
        schedule_time: this.calculateScheduleTime(
          this.state.orderData.setup_timestamp
        ),
      },
      this.Bind()
    );}else{
      this.fetchData();
    let d = new Date();
    d.setTime(
      Date.parse(this.state.orderData.setup_timestamp.replace(" ", "T"))
    );
// console.log("....................props..................",this.props.route.params.editData[0].id)
    this.setState(
      {
        booking_done_by: this.context.userData.name,
        booking_date: moment().format("YYYY-MM-DD"),
        booking_time: this.currentTime(),
        journey_type: this.state.editData[0].journey_type,
        schedule_date: d,
        phone: this.state.editData[0].phone,
        vender_name:this.state.editData[0].vendor_name,
        vendor_id:this.state.editData[0].vender_id,
        type:this.state.editData[0].type,
        schedule_time: this.calculateScheduleTime(
          this.state.orderData.setup_timestamp
        ),
      },
      this.Bind()
    );
    }
  }
  componentWillUnmount(){
    this.focusListner
  }

  Bind() {
    this.setState({
      isLoading: true,
    });
    Promise.all([VenderList(), GetAllWareHouses()])
      .then((values) => {
        let alldata = values[0].data.concat(this.state.othervendor)
        this.setState({
          isLoading: false,
          venders: alldata,
          warehouse_data: values[1].data,
          from_address:values[1].data[0].address,
        });
        
      })
      .catch((err) => {
        this.setState(
          {
            isLoading: false,
          },
          () => {
            Alert.alert("Server Error", "please try again");
          }
        );
      });
  }
  gotoBack = () => this.props.navigation.goBack();

  deleteItem = (id) => {
	if(this.context.userData.action_types.indexOf('Delete') >= 0)
	{Alert.alert(
			"Are you sure?",
			"Are you sure you want to remove this Vehicle?",
			[
				{
					text: "Yes",
					onPress: () => {
						DeleteVehicleInfo({ id: this.props.route.params.editData[0].id}).then(res => {
							if (res.is_success) {
							this.gotoBack()
							}
						}).catch((error) => {
							Alert.alert("Server Error", error.message);
						});
					},
				},
				{
					text: "No",
				},
			]
		)};
	}

  validateData = () => {
    let errors = {};

    if (!this.state.vendor_id) {
      errors.vendor = "Vendor is required";
    }

    if (this.state.type == "") {
      errors.type = "Please enter vehicle type";
    }

    if (this.state.from_address == "") {
      errors.from_address = "Please select an warehouse";
    }

    if (this.state.to_address == "") {
      errors.to_address = "Please enter to address";
    }

    this.setState({
      formErrors: {},
    });

    if (Object.keys(errors).length != 0) {
      this.setState({
        formErrors: errors,
      });

      return false;
    }

    return true;
  };
  showDatePicker = () => {
    this.setState({isDatePickerVisible: true });
  };
  showTimePicker = () => {
    this.setState({
      isTimePickerVisible: true,
    });
  };
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false, isTimePickerVisible: false });
  };
  handleScheduleDateChange = (selectedDate) => {
    // console.log("A date has been picked: ", selectedDate);
    // console.log("A date has been picked: ", getFormattedDate(selectedDate));
    // let date = getFormattedDate(selectedDate);
    this.setState({ schedule_date : selectedDate},);
    this.hideDatePicker();
  };
  handleScheduleTimeChange = (selectedTime) => {
    // console.log("A Time has been picked: ", selectedTime);
    // console.log(
    //   "A Time has been picked:........... ",
    //   moment(selectedTime).format("h:mm A")
    // );
    this.setState({ schedule_date:  selectedTime,
        booking_time:this.currentTime(selectedTime), })
    this.hideDatePicker();
  };

  Add = () => {
    if (this.validateData()) {
      const data = {
        vender_id: this.state.vendor_id,
        order_id: this.state.orderData.id,
        type: this.state.type,
        phone: this.state.phone,
        journey_type: this.state.journey_type,
        schedule_date: getFormattedDate(this.state.schedule_date),
        schedule_time: this.state.schedule_time,
        from_address: this.state.from_address,
        to_address: this.state.to_address,
        booking_done_by: this.state.booking_done_by,
        booking_date: getFormattedDate(this.state.booking_date),
        booking_time: this.state.booking_time,
      };

      if(this.state.editstate == 0){
        let value = {
          order_id: this.state.orderData.id,
          reviewer_id: this.context.userData.cust_code,
          reviewer_name: this.context.userData.name,
          type: this.context.userData.type,
          track_comment: `Vehicle added for this order`,
      }
        console.log("..............data add..............",data)
        this.setState({
          isLoading: true,
        });
        update_track_log(value).then((res) => { console.log('..........res..........', res); }).catch(err => { })
      AddVehicleInfoApiService(data)
        .then((result) => {
          if (result.is_success) {
            this.props.navigation.goBack();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.setState({
            isLoading: false,
          });
        });
      }else{
        let value = {
          order_id: this.state.orderData.id,
          reviewer_id: this.context.userData.cust_code,
          reviewer_name: this.context.userData.name,
          type: this.context.userData.type,
          track_comment: `Vehicle edited for this order`,
      }
        data.id = this.state.editData[0].id
        console.log("..............data edit..............",data)
        this.setState({
          isLoading: true,
        });
        update_track_log(value).then((res) => { console.log('..........res..........', res); }).catch(err => { })
        UpdateVehicleInfo(data)
        .then((result) => {
          console.log("..........edited result...........",result)
          if (result.is_success) {

            this.props.navigation.goBack();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.setState({
            isLoading: false,
          });
        });
      }
    }
  };

  setVenders = (v) =>{
    if(v.id == "other"){
      this.setState({
        showvenderAlertModal : true,
        alertvenderMessage:"are you want to add new vendor?",
        phone:''
      })
    }
    else{
    this.setState({
      showvenderAlertModal : false,
      vendor_id: v.id,
      vender_name: v.name,
      phone: v.mobile,
    });
  }
  }
  hidevenderAlert=()=>{
    this.setState({showvenderAlertModal : false})
  }
  gotoaddVendor=()=>{
    this.props.navigation.navigate("VenderAddUpdateScreen", {
     screen:"AddVehicleInfo"
    });
  }

  render() {
    return (
      <>
        {this.state.isLoading && <OverlayLoader />}
        <SafeAreaView style={styles.container}>
          <Header 
          title={this.state.editstate == 0 ? "Add Vehicle" : "Edit Vehicle"} 
          delete={this.state.editstate == 0 ? '' : 'delete'}
          deleteItem={this.deleteItem}
          />
          <View style={styles.form}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              {/* <Text style={{ fontSize: 15, marginBottom: 5, marginTop: 10, color: Colors.darkgrey }}>Vendor Details</Text> */}
              <View style={[styles.rowContainer, { marginTop: 0 }]}>
                <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: Platform.OS === "android" ? 0 : 4,
                      paddingBottom: Platform.OS === "android" ? 2 : 4,
                      borderBottomWidth: 0.8,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>Choose Vendor:</Text>
                  </View>
                  <View
                    style={[
                      styles.rowRight,
                      { borderTopRightRadius: 5, marginLeft: 10 },
                    ]}
                  >
                    <Dropdown
                      value={this.state.vender_name}
                      data={this.state.venders}
                      onChange={this.setVenders}
                      style={styles.textInput}
                      inputSearchStyle={styles.inputSearchStyle}
                      placeholderStyle={styles.Dropdown_textInput}
                      selectedTextStyle={styles.Dropdown_textInput}
                      itemTextStyle={styles.Dropdown_textInput}
                      search
                      labelField="name"
                      valueField="name"
                      placeholder={
                        !this.state.vender_name ? "Select Vender" : "..."
                      }
                      searchPlaceholder="Search..."
                    />
                  </View>
                </View>
                {this.state.formErrors.vendor && (
                  <Text style={{ color: Colors.danger }}>
                    {this.state.formErrors.vendor}
                  </Text>
                )}

                <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: Platform.OS === "android" ? 8 : 15,
                      paddingBottom: Platform.OS === "android" ? 8 : 15,
                      borderBottomWidth: 0.8,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>Contact Number:</Text>
                  </View>
                  {/* <View
                    style={[
                      styles.rowRight,
                      { borderTopRightRadius: 5, paddingLeft: 10,},
                    ]}
                  > */}
                    <TextInput
                      value={this.state.phone}
                      autoCompleteType="off"
                      keyboardType="number-pad"
                      autoCapitalize="words"
                      style={[styles.inputLable,styles.rowRight,{borderTopRightRadius: 5, paddingLeft: 10,}]}
                      onChangeText={(phone) => {
                        this.setState({ phone: phone });
                      }}
                    />
                  {/* </View> */}
                </View>

                <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: Platform.OS === "android" ? 8 : 11,
                      paddingBottom: Platform.OS === "android" ? 8 : 11,
                      borderBottomWidth: 0.8,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>Type:</Text>
                  </View>
                  {/* <View
                    style={[
                      styles.rowRight,
                      { borderTopRightRadius: 5, paddingLeft: 10 },
                    ]}
                  > */}
                    <TextInput
                      value={this.state.type}
                      autoCompleteType="off"
                      autoCapitalize="words"
                      style={[styles.inputLable,styles.rowRight,
                        { borderTopRightRadius: 5, paddingLeft: 10 }]}
                      onChangeText={(type) => this.setState({ type: type })}
                    />
                  {/* </View> */}
                </View>

                {this.state.formErrors.type && (
                  <Text style={{ color: Colors.danger }}>
                    {this.state.formErrors.type}
                  </Text>
                )}

                <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: Platform.OS === "android" ? 0 : 4,
                      paddingBottom: Platform.OS === "android" ? 0 : 4,
                      borderBottomWidth: Platform.OS === "android" ? 1 : 0.8,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>Journey Type:</Text>
                  </View>
                  <View
                    style={[
                      styles.rowRight,
                      { borderTopRightRadius: 5, marginLeft: 10 },
                    ]}
                  >
                    <Dropdown
                      value={this.state.journey_type}
                      data={[
                        { id: "Onward", name: "Onward" },
                        { id: "Return", name: "Return" },
                        { id: "Both", name: "Both" },
                      ]}
                      onChange={(data) => {
                        this.setState({ journey_type: data.id });
                      }}
                      style={styles.textInput}
                      inputSearchStyle={styles.inputSearchStyle}
                      placeholderStyle={styles.Dropdown_textInput}
                      selectedTextStyle={styles.Dropdown_textInput}
                      itemTextStyle={styles.Dropdown_textInput}
                      search
                      labelField="name"
                      valueField="name"
                      placeholder={
                        !this.state.journey_type ? "Select Journey Type" : this.state.journey_type
                      }
                      searchPlaceholder="Search..."
                    />
                  </View>
                </View>

                {/* <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: Platform.OS === "android" ? 0 : 4,
                      paddingBottom: Platform.OS === "android" ? 0 : 4,
                      borderBottomWidth: Platform.OS === "android" ? 1 : 0.8,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>Select Warehouse:</Text>
                  </View>
                  <View
                    style={[
                      styles.rowRight,
                      { borderTopRightRadius: 5, marginLeft: 10 },
                    ]}
                  >
                    <Dropdown
                      value={this.state.selected_warehouse}
                      data={this.state.warehouse_data}
                      onChange={(data) => {
                        this.setState({
                          selected_warehouse: data.name,
                          from_address: data.address,
                        });
                      }}
                      style={styles.textInput}
                      inputSearchStyle={styles.inputSearchStyle}
                      placeholderStyle={styles.textInput}
                      selectedTextStyle={styles.textInput}
                      search
                      labelField="name"
                      valueField="name"
                      placeholder={
                        !this.state.selected_warehouse
                          ? "Select Warehouse"
                          : "..."
                      }
                      searchPlaceholder="Search..."
                    />
                  </View>
                </View> */}
                {/* {this.state.formErrors.from_address && (
                  <Text style={{ color: Colors.danger }}>
                    {this.state.formErrors.from_address}
                  </Text>
                )} */}

                <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: Platform.OS === "android" ? 8 : 12,
                      paddingBottom: Platform.OS === "android" ? 8 : 12,
                      borderBottomWidth: 0.8,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>
                      {this.state.journey_type == "Return" ? "Venue" : "Warehouse"}{" "}
                      Address:
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.rowRight,
                      { borderTopRightRadius: 5, paddingLeft: 10 },
                    ]}
                  >
                    <Text
                      style={styles.inputLable}
                    >
                      {this.state.from_address}
                      </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: Platform.OS === "android" ? 8 : 12,
                      paddingBottom: Platform.OS === "android" ? 8 : 12,
                      borderBottomWidth: 0.8,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>
                      {this.state.journey_type == "Return" ? "Warehouse" : "Venue"}{" "}
                      Address:
                    </Text>
                  </View>
                  <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                    <View style={{ width: "100%", marginLeft: 10 }}>
                    {this.state.orderDetails?.event_data?.landmark != null ?
                      <Text style={styles.inputLable}>
                        {this.state.orderDetails?.event_data?.venue}
                        </Text>
                      :
                       <Text style={styles.inputLable}>{this.state.orderDetails?.event_data?.venue}
                       </Text>
                       }
                     
                      {/* <TouchableOpacity
                        onPress={() => {
                          this.setState({ isGoogleAddressModalVisible: true });
                        }}
                        style={{
                          paddingRight: 3,
                        }}
                      >
                        {this.state.to_address == "" ? (
                          <Text style={styles.inputLable}>Select Address</Text>
                        ) : (
                          <Text style={styles.inputLable}>{this.state.to_address}</Text>
                        )}
                      </TouchableOpacity> */}

                      {/*                                         
                                                <TextInput
                                                    value={this.state.to_address}
                                                    autoCompleteType="off"
                                                    autoCapitalize="words"
                                                    multiline={true}
                                                    style={[styles.textInput, { marginRight: 3 }]}
                                                    onFocus={ () => {
                                                        
                                                    } }
                                                /> */}
                    </View>
                  </View>
                </View>

                {this.state.formErrors.to_address && (
                  <Text style={{ color: Colors.danger }}>
                    {this.state.formErrors.to_address}
                  </Text>
                )}

<View
                  style={[
                    styles.row,
                    {
                      paddingVertical: Platform.OS === "android" ? 8 : 12,
                      paddingBottom: Platform.OS === "android" ? 8 : 12,
                      borderBottomWidth: 0.8,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>
                      google location:
                    </Text>
                  </View>
                  <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                    <View style={{ width: "100%", marginLeft: 10 }}>
                    {this.state.orderDetails?.event_data?.landmark != null ?
                      <Text style={styles.inputLable}>
                        {this.state.orderDetails?.event_data?.google_location},{this.state.orderDetails?.event_data?.landmark}
                        </Text>
                      :
                       <Text style={styles.inputLable}>{this.state.orderDetails?.event_data?.google_location}
                       </Text>
                       }
                     
                    </View>
                  </View>
                </View>

                <View style={[styles.rowTop,{alignItems:'center'}]}>
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>Schedule:</Text>
                  </View>
                  <View
                    style={[styles.rowRight, { borderBottomRightRadius: 5,marginLeft:-5}]}
                  >
                    <View style={{ width: "55%" ,paddingBottom: 5 ,paddingTop:5,}}>
                      {/* <DateAndTimePicker2
                        mode={"date"}
                        label={""}
                        value={this.state.schedule_date}
                        onChange={(date) => {
                          this.setState({ schedule_date: date });
                        }}
                      /> */}
                       <TouchableOpacity
                        onPress={() => this.showDatePicker()}
                      >
                        {this.state.schedule_date != "" ? (
                          <Text
                            style={[
                              styles.inputLable,
                              { fontSize: 14, alignSelf: "center" },
                            ]}
                          >
                            {showDateAsWant(
                              this.state.schedule_date
                            )}
                          </Text>
                        ) : (
                          <Text
                            style={[
                              styles.inputLable,
                              { fontSize: 14, alignSelf: "center" },
                            ]}
                          >
                            {"DD/MM/YYYY"}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.divider}></View>
                    <View style={{ width: "43%",paddingBottom: 5 ,paddingTop:5 }}>
                      {/* <DateAndTimePicker2
                        mode={"time"}
                        label={""}
                        value={this.state.schedule_time}
                        onChange={(time) => {
                          this.setState({ schedule_time: time });
                        }}
                      /> */}
                      
                         <TouchableOpacity
                        onPress={() =>
                          this.showTimePicker()}
                      >
                        {this.state.schedule_date != "" ? (
                          <Text
                            style={[
                              styles.inputLable,
                              { fontSize: 14, alignSelf: "center" },
                            ]}
                          >
                            {moment(this.state.schedule_date).format(
                              "h:mm A"
                            )}
                          </Text>
                        ) : (
                          <Text
                            style={[
                              styles.inputLable,
                              { fontSize: 14, alignSelf: "center" },
                            ]}
                          >
                            {"HH:MM"}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <DateTimePickerModal
                      mode='date'
                      onConfirm={this.handleScheduleDateChange}
                      onCancel={this.hideDatePicker}
                      display={Platform.OS == "ios" ? "inline" : "default"}
                      isVisible={this.state.isDatePickerVisible}
                    />
                    <DateTimePickerModal
                      mode='time'
                      date={new Date(this.state.schedule_date)}
                       onConfirm={this.handleScheduleTimeChange}
                      onCancel={this.hideDatePicker}
                      display={Platform.OS == "ios" ? "spinner" : "default"}
                      isVisible={this.state.isTimePickerVisible}
                    />
              </View>

              <View style={[styles.rowContainer, { marginTop: 10 }]}>
                <View
                  style={[
                    styles.row,
                    {
                      paddingTop: 12,
                      paddingBottom: 12,
                      borderBottomWidth: 0.8,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>Booking Done By:</Text>
                  </View>
                  <View
                    style={[
                      styles.rowRight,
                      { borderTopRightRadius: 5, paddingLeft: 10 },
                    ]}
                  >
                    <View style={{ width: "60%" }}>
                      <Text style={{ color: Colors.black,}}>
                        {this.state.booking_done_by}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.row, { paddingBottom: 0 }]}>
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>Booking:</Text>
                  </View>
                  <View style={[styles.rowRight,{marginLeft:-5}]}>
                    <View style={{ width: "55%" }}>
                      {/* <DateAndTimePicker2
                                                mode={"date"}
                                                label={""}
                                                value={this.state.booking_date}
                                                onChange={()=>{}}
                                            /> */}
                      <DateTimerPicker
                        pickerMode={"date"}
                        dateTime={this.state.booking_date}
                        onChange={() => {}}
                      />
                    </View>

                    <View style={styles.divider}></View>
                    <View style={{ width: "43%" }}>
                      {/* <DateAndTimePicker2
                                                mode={"time"}
                                                label={""}
                                                value={this.state.booking_time}
                                                onChange={()=>{}}
                                            /> */}
                      <DateTimerPicker
                        pickerMode={"time"}
                        dateTime={this.state.booking_date}
                        onChange={() => {}}
                      />
                    </View>
                  </View>
                </View>

                {/* <View style={[styles.rowTop, {paddingVertical: 11 }]}>
                                <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                                    <Text style={styles.inputLable}>Booking:</Text>
                                </View>
                                <View style={[styles.rowRight, { borderTopRightRadius: 5}]}>
                                <View style={{ width: '80%' }}>
                                            <Text style={{color: Colors.grey}}>{moment(this.state.booking_date).format('Do - MMM - YY (ddd)').toString()} | {this.state.booking_time.toString()}</Text>
                                        </View>
                                </View>
                            </View> */}
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={this.Add}>
                <Text style={{ fontSize: 18, color: Colors.white }}>
                  {"Save"}
                </Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          </View>

{this.state.isGoogleAddressModalVisible ?
          <GoogleAddressPickerModal
            // isGoogleAddressModalVisible={this.state.isGoogleAddressModalVisible}
            isGoogleAddressModalVisible={true}
            onBackdropPressGAddressModal={() =>
              this.setState({
                isGoogleAddressModalVisible: false,
              })
            }
            onRequestCloseGAddressModal={() => {
              this.setState({
                isGoogleAddressModalVisible: false,
              });
            }}
            onTopCrossBtnPress={() => {
              this.setState({
                isGoogleAddressModalVisible: false,
              });
            }}
            onChooseAddress={(address) => {
              this.setState({
                isGoogleAddressModalVisible: false,
                to_address: address,
              });
            }}
          />
:null}

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

<AwesomeAlert
            show={this.state.showvenderAlertModal}
            showProgress={false}
            title={this.state.alertType}
            message={this.state.alertvenderMessage}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="cancel"
            confirmText="Ok"
            confirmButtonColor="#DD6B55"
            onCancelPressed={() => {
              this.hidevenderAlert();
            }}
            onConfirmPressed={() => {
              this.gotoaddVendor();
            }}
          />
        </SafeAreaView>
      </>
    );
  }
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d9dfe0",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    borderColor: "#eee",
    borderWidth: 1,
    padding: 10,
    margin: 2,
  },

  boxHead: {
    fontFamily: "serif",
    fontSize: 16,
    margin: 5,
    color: Colors.black,
    fontWeight: "bold",
  },
  lsitContainer: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    // borderBottomWidth: 0.5,
    borderColor: Colors.textInputBorder,
  },
  qtyContainer: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
    marginBottom: 2,
  },
  subText: {
    fontSize: 13,
    color:Colors.black,
    marginBottom: 2,
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
  form: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 5,
    //borderRadius: 10,
  },
  iconPickerContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 3,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  image: {
    height: 50,
    width: 50,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  // inputLable: {
  //   fontSize: 16,
  //   color: Colors.grey,
  //   marginBottom: 10,
  //   opacity: 0.8,
  // },
  // textInput: {
  //   borderWidth: 1,
  //   padding: 9,
  //   fontSize: 14,
  //   width: "100%",
  //   borderRadius: 4,
  //   borderColor: Colors.textInputBorder,
  //   backgroundColor: Colors.textInputBg,
  //   color: Colors.black,
  // },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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

  textInput: {
    borderWidth: 1,
    fontSize: 14,
    width: "100%",
    borderWidth: 0,
    // borderRadius: 4,
    borderColor: "#fff",
    backgroundColor: "#fff",
    marginBottom: 0,
    color: Colors.black,
  },
  Dropdown_textInput: {
    color:Colors.black,
    fontSize: 14,
    opacity:1
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

  rowContainer: {
    borderColor: "#d2d1cd",
    borderWidth: 0,
    borderRadius: 5,
    paddingVertical: 0,
    paddingHorizontal: 5,
    backgroundColor: Colors.white,
  },

  row: {
    flexDirection: "row",
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 0.5,
    paddingBottom: 7,
    height:50,
    alignItems:'center'
  },

  rowTop: {
    flexDirection: "row",
    borderBottomColor: "#cfcfcf",
    paddingBottom: 5 ,
    paddingTop:5,
    alignItems:'baseline'
  },

  inputLable: {
    fontSize: 14,
    color: Colors.black,
    marginBottom: 0,
    // opacity: Colors.opacity6,
  },

  rowRight: {
    flexDirection: "row",
    width: "50%",
    // marginLeft: 10,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },

  rowLeft: {
    width: "47%",
    backgroundColor: "#fff",
    paddingLeft: 10,
    justifyContent: "center",
  },

  divider: {
    width: "2%",
    borderLeftWidth: 0.3,
    alignSelf: "center",
    height: 20,
    borderLeftColor: "#444",
    // opacity: 0.4,
  },
});
