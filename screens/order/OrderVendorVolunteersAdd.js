import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  Alert,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
// import Modal from "react-native-modal";
import Colors from "../../config/colors";
import { Header } from "../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";
import AwesomeAlert from "react-native-awesome-alerts";
import AppContext from "../../context/AppContext";
import {
  formatDateTimetoMysqlDateTimeFormat,
  showDateAsClientWant,
  showDateAsWant,
} from "../../utils/Util";
import {
  AddOrderVolunteerVendorDetails,
  EditOrderVolunteerVendorDetails,
  DeleteOrderVolunteerVendorDetails,
  AddOrderVendorStaffDetails,
  DeleteOrderVendorStaffDetails,
  EditOrderVendorStaffDetails,
} from "../../services/OrderService";
import OverlayLoader from "../../components/OverlayLoader";
import { VenderList } from "../../services/VenderApiService";
import moment from "moment";
import { GetTotalVolunteerRequiredForEvent } from "../../services/VolunteerApiService";
import DateTimerPicker from "../../components/DateTimerPicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { get_PaymentTerm, update_track_log } from "../../services/APIServices";
import { send_whatsappsms } from "../../services/ChatService";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

// const PAYMENT_TERMS = [
//   {
//     id: "fixed",
//     name: "Fixed",
//   },
//   {
//     id: "hourly",
//     name: "Hourly",
//   },
// ];

export default class OrderVendorVolunteersAdd extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      orderData: this.props.route.params.orderData,
      orderVendorList: this.props.route.params.orderVendorList,
      editstate: this.props.route.params.editstate,
      orderDetails: null,
      venders: [],
      refreshing: false,
      showAlertModal: false,
      alertMessage: "",
      alertType: "",
      totalVolunteerRequired: this.props.route.params.resData,
      isLoading: false,

      order_id: "",
      vender_id: "",
      vender_name: "",
      booking_done_by: "",
      reporting_timestamp: "",
      closing_timestamp: "",
      booking_timestamp: "",
      num_of_staff_required: this.props.route.params.resData,
      num_of_hours: "",
      rate: "",
      amount: "",
      mobile: "",

      payment_term: "",

      mode: "",
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      isClosingTimePickerVisible: false,
      selectedDate: "",
      showvenderAlertModal: false,
      orderDetails: '',
      othervendor: {
        id: "other",
        name: "Add Vendor",
      },
      PAYMENT_TERMS: [],
      payment_brakeDown: '',
      payment_item: null,

      all_paymethod: [],
      isModalOpen: false,
      editStaffData: null
    };
  }

  componentDidMount = () => {
    // console.log('......this.props.route.params............',JSON.parse(this.props.route.params?.orderVendorList[0]?.staff_details))
    this.fetchData();
    this.getPayment();
    this.focusListner = this.props.navigation.addListener("focus", () => {
      this.fetchData();
      this.setState({ editstate: this.props.route.params.editstate, })
      if (this.props.route.params.editstate == 1) {
        this.setState({
          // num_of_staff_required:
          //   this.props.route.params?.orderVendorList[0]?.num_of_staff_required,
          payment_term:
            this.props.route.params?.orderVendorList[0]?.payment_term,
          mobile: this.props.route.params.orderData.customer_mobile,

        });
        if (this.props.route.params?.orderVendorList[0]?.staff_details) {
          this.setState({
            all_paymethod: JSON.parse(this.props.route.params?.orderVendorList[0]?.staff_details)
          })
        }
      }
      this.getPayment();
    });
  };
  getPayment = () => {
    this.setState({ isLoading: true });
    get_PaymentTerm().then(res => {
      this.setState({ PAYMENT_TERMS: res.data })
    })
      .catch(err => { })
      .finally(() => this.setState({ isLoading: false }))
  }
  componentWillUnmount() {
    this.focusListner

  };

  fetchData = () => {
    this.setState({ isLoading: true });
    if (this.state.editstate == 0) {
      Promise.all([
        VenderList(),
        GetTotalVolunteerRequiredForEvent({
          order_id: this.state.orderData.id,
        }),
      ])
        .then((result) => {
          let alldata = result[0].data.concat(this.state.othervendor);

          this.setState(
            {
              venders: alldata,
              // totalVolunteerRequired: result[1].data.total_volunteers,
              // num_of_staff_required: result[1].data.total_volunteers,
            },
            () => this.init()
          );
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this.setState({
            isLoading: false,
          });
        });
    } else {
      Promise.all([
        VenderList(),
        GetTotalVolunteerRequiredForEvent({
          order_id: this.state.orderData.id,
        }),
      ])
        .then((result) => {
          let alldata = result[0].data.concat(this.state.othervendor);
          this.setState(
            {
              venders: alldata,
              totalVolunteerRequired:
                this.state.editstate == 0
                  ? result[1].data.total_volunteers
                  : this.state.totalVolunteerRequired,
              num_of_staff_required:
                this.state.editstate == 0
                  ? result[1].data.total_volunteers
                  : this.state.num_of_staff_required,
            }
            // () => this.init()
          );
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this.setState({
            isLoading: false,
          });
        });

      if (this.state.orderVendorList[0].payment_term == "hourly") {
        this.setState({
          payment_term: "Hourly",
        });
      } else if (this.state.orderVendorList[0].payment_term == "fixed") {
        this.setState({
          payment_term: "Fixed",
        });
      }
      this.setState({
        vender_name: this.state.orderVendorList[0].vendor_name,
        vender_id: this.state.orderVendorList[0].vender_id,
        reporting_timestamp: this.state.orderVendorList[0].reporting_timestamp,
        closing_timestamp: this.state.orderVendorList[0].closing_timestamp,
        booking_timestamp: this.state.orderVendorList[0].booking_timestamp,

        // num_of_staff_required:
        //   this.state.editstate == 0
        //     ? result[1].data.total_volunteers
        //     : this.state.orderVendorList[0].num_of_staff_required,

        rate: this.state.orderVendorList[0].rate,
        // amount: this.state.orderVendorList[0].amount,
        mobile: this.state.orderVendorList[0].mobile,
        num_of_hours: this.state.orderVendorList[0].num_of_hours,
        booking_done_by: this.state.orderVendorList[0].booking_done_by,
      });
    }
  };

  addAction = () => {
    if (!this.state.num_of_staff_required) {
      this.setState({
        showAlertModal: true,
        alertType: "Error",
        alertMessage: "number of staff is required",
      });
      return;
    }
    if (!this.state.payment_term) {
      this.setState({
        showAlertModal: true,
        alertType: "Error",
        alertMessage: "payment term phone is required",
      });
      return;
    }
    let obj = {
      num_of_staff_required: this.state.num_of_staff_required,
      rate: this.state.rate,
      amount: this.state.amount,
      payment_term: this.state.payment_term,
      payment_item: this.state.payment_item,
      payment_brakeDown: this.state.payment_brakeDown,
    };
    this.state.all_paymethod.push(obj);
    this.setState({
      all_paymethod: this.state.all_paymethod,
      num_of_staff_required: this.state.num_of_staff_required,
      rate: '',
      amount: '',
      payment_term: '',
      payment_item: null,
      payment_brakeDown: '',
      isModalOpen:false
    });
    this.closeModal()
  }
  editAction = (data) => {
    console.log('............editAction............', data)
    // let newArr = this.state.all_paymethod.filter((item) => item.id != data.id)
    // console.log('............newArr............', newArr)
    this.setState({
       isModalOpen: true,
       num_of_staff_required: data.num_of_staff_required,
       rate: data.rate,
       amount: data.amount,
       payment_term: data.payment_term,
       editStaffData:data.id
      })
  }
  addModal =()=>{
    this.setState({isModalOpen:true})
  }
  closeModal = () => {
    this.setState({ isModalOpen: false })
  }
  saveModal = () => {
    if (!this.state.payment_item) {
      this.setState({
        showAlertModal: true,
        alertType: "Error",
        alertMessage: "please select payment term",
      });
      return;
    }
    if (!this.state.num_of_staff_required) {
      this.setState({
        showAlertModal: true,
        alertType: "Error",
        alertMessage: "number of staff is required",
      });
      return;
    }
    if (!this.state.payment_term) {
      this.setState({
        showAlertModal: true,
        alertType: "Error",
        alertMessage: "payment term phone is required",
      });
      return;
    }
    let obj = {
      num_of_staff_required: this.state.num_of_staff_required,
      rate: this.state.rate,
      amount: this.state.amount,
      payment_term: this.state.payment_term,
      payment_item: this.state.payment_item,
      payment_brakeDown: this.state.payment_brakeDown,
    };
    let newArr = this.state.all_paymethod.filter((item) => item.id != this.state.editStaffData)
    newArr.push(obj);
    this.setState({
      all_paymethod: newArr,
      isModalOpen: false,
      num_of_staff_required: this.state.num_of_staff_required,
      rate: '',
      amount: '',
      payment_term: '',
      payment_item: null,
      payment_brakeDown: '',
    });
    this.closeModal()
  }

  deleteAction = (data) => {
    console.log('............data............', data)
    let newArr = this.state.all_paymethod.filter((item) => item.id != data.id)
    console.log('............newArr............', newArr)
    this.setState({
      all_paymethod: newArr
    })
  }
  gotoBack = () => this.props.navigation.goBack();

  deleteItem = (id) => {
    if (this.context.userData.action_types.indexOf('Delete') >= 0) {
      Alert.alert(
        "Are your sure?",
        "Are you sure you want to remove this item?",
        [
          {
            text: "Yes",
            onPress: () => {
              this.setState({
                orderVendorList: this.state.orderVendorList.filter(item => item.id !== this.props.route.params.orderVendorList[0].id)
              }, () => {
                this.setState({ isLoading: true });
                DeleteOrderVendorStaffDetails({ id: this.props.route.params.orderVendorList[0].id, bill_id: this.props.route.params.orderVendorList[0].bill_number }).then(res => {
                  // console.log('.................res............',res)
                  this.gotoBack()
                }).catch(err => { console.log(err) }).finally(() => this.setState({ isLoading: false }))

              });
            },
          },
          {
            text: "No"
          },
        ]
      )
    };
  }

  init = () => {
    let reporting_timestamp = moment(this.state.orderData.event_start_timestamp)
      .subtract(90, "minutes")
      .format("YYYY-MM-DD HH:mm:ss");

    let closing_timestamp = moment(this.state.orderData.setup_timestamp)
      .add(60, "minutes")
      .format("YYYY-MM-DD HH:mm:ss");

    this.setState(
      {
        order_id: this.state.orderData.id,
        booking_done_by: this.context.userData?.name,
        reporting_timestamp: reporting_timestamp.replace(" ", "T"),
        closing_timestamp: closing_timestamp.replace(" ", "T"),
        booking_timestamp: new Date(),
      },
      () => this.UpdateNumberOfHours()
    );
  };

  getDiffHour = (from, to) => {
    let fromDate = moment(`${from}`);
    let toDate = moment(`${to}`);

    return toDate.hours() - fromDate.hours();
  };

  // onChangeReportingDateChange = (date) => {
  //     if(date) {
  //         this.setState({ reporting_timestamp: date },
  //             () => this.UpdateNumberOfHours()
  //         );
  //     }
  // }
  //   onReportingTimeChange = (selectedTime) => {
  //     if (selectedTime) {
  //       this.setState({ reporting_timestamp: selectedTime }, () =>
  //         this.UpdateNumberOfHours()
  //       );
  //     }
  //   };

  showDatePicker = (mode) => {
    this.setState({ mode: mode, isDatePickerVisible: true });
  };
  showTimePicker = (mode, date) => {
    this.setState({
      isTimePickerVisible: true,
      mode: mode,
      selectedDate: date,
    });
  };
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false, isTimePickerVisible: false });
  };
  handleReportingDateChange = (selectedDate) => {
    // console.log("A date has been picked: ", selectedDate);
    this.setState({ reporting_timestamp: selectedDate }, () =>
      this.UpdateNumberOfHours()
    );
    this.hideDatePicker();
  };
  handleReportingTimeChange = (selectedTime) => {
    // console.log("A Time has been picked: ", selectedTime);
    // console.log(
    //   "A Time has been picked:........... ",
    //   moment(selectedTime).format("h:mm A")
    // );
    this.setState({ reporting_timestamp: selectedTime }, () =>
      this.UpdateNumberOfHours()
    );
    this.hideDatePicker();
  };
  gotoBack = () => this.props.navigation.goBack();
  showClosingTimePicker = () => {
    this.setState({
      isClosingTimePickerVisible: true,
    });
  };
  hideClosingDatePicker = () => {
    this.setState({ isClosingTimePickerVisible: false });
  };
  handleClosingTimeChange = (selectedTime) => {
    // console.log("A Time has been picked........: ", selectedTime);
    this.setState({ closing_timestamp: selectedTime }, () =>
      this.UpdateNumberOfHours()
    );
    this.hideClosingDatePicker();
  };

  //   onClosingTimeChange = (time) => {
  //     if (time) {
  //       this.setState({ closing_timestamp: time }, () =>
  //         this.UpdateNumberOfHours()
  //       );
  //     }
  //   };

  UpdateNumberOfHours = () => {
    let hours = this.getDiffHour(
      this.state.orderData.event_start_timestamp,
      this.state.orderData.event_end_timestamp
    );

    hours = Math.abs(hours);
    this.setState({ num_of_hours: hours.toString() });
  };

  SetVenderId = (v) => {
    if (v.id == "other") {
      this.setState({
        showvenderAlertModal: true,
        alertvenderMessage: "are you want to add new vendor?",
        mobile: "",
      });
    } else {
      this.setState({
        showvenderAlertModal: false,
        vender_id: v.id,
        vender_name: v.name,
        mobile: v.mobile,
      });
    }
  };
  hidevenderAlert = () => {
    this.setState({ showvenderAlertModal: false });
  };

  gotoaddVendor = () => {
    this.props.navigation.navigate("VenderAddUpdateScreen", {
      screen: "OrderVendorVolunteersAdd",
    });
  };

  ControlSubmit = () => {
    // console.log('... this.state.all_paymethod...', this.state.all_paymethod)
    let total_staff = 0;
    let total_amount = 0;
    if (this.state.payment_term != '') {
      let obj = {
        num_of_staff_required: this.state.num_of_staff_required,
        rate: this.state.rate,
        amount: this.state.amount,
        payment_term: this.state.payment_term,
        payment_item: this.state.payment_item,
        payment_brakeDown: this.state.payment_brakeDown,
      };
      this.state.all_paymethod.push(obj);

      let Value = this.state.all_paymethod
      for (let i = 0; i < Value.length; i++) {
        total_amount = parseInt(total_amount) + parseInt(Value[i].amount)
        total_staff = parseInt(total_staff) + parseInt(Value[i].num_of_staff_required)
      }
      this.setState({
        all_paymethod: this.state.all_paymethod,
        num_of_staff_required: this.state.num_of_staff_required,
        rate: '',
        amount: '',
        payment_term: '',
        payment_item: null,
        payment_brakeDown: ''
      });
    }
    let data = {
      order_id: this.state.order_id,
      vender_id: this.state.vender_id,
      // num_of_staff_required: this.state.num_of_staff_required,
      num_of_hours: this.state.num_of_hours,
      reporting_timestamp: formatDateTimetoMysqlDateTimeFormat(
        this.state.reporting_timestamp
      ),
      closing_timestamp: formatDateTimetoMysqlDateTimeFormat(
        this.state.closing_timestamp
      ),
      booking_timestamp: formatDateTimetoMysqlDateTimeFormat(
        this.state.booking_timestamp
      ),
      booking_done_by: this.state.booking_done_by,
      // rate: this.state.rate,
      // amount: this.state.amount,
      mobile: this.state.mobile,
      // payment_term: this.state.payment_term,
      // payment_brakeDown: this.state.payment_brakeDown,
      all_paymethod: JSON.stringify(this.state.all_paymethod),
      total_amount: total_amount,
      total_num_of_staff_required: total_staff
    };

    let value = {
      order_id: this.state.orderData.id,
      reviewer_id: this.context.userData.cust_code,
      reviewer_name: this.context.userData.name,
      type: this.context.userData.type,
      track_comment: `Vendor added for this order`,
    };
    // console.log(".................data edited.............", data)
    // return
    this.setState({ isLoading: true });
    update_track_log(value)
      .then((res) => {
        // console.log("..........res..........", res);
      })
      .catch((err) => { });
    AddOrderVendorStaffDetails(data)
      .then((result) => {
        if (result.is_success) {
          this.gotoBack();
          this.sendWhatsappSms();
        } else {
          this.setState({
            showAlertModal: true,
            alertType: "Error",
            alertMessage: result.message,
          });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  EditSubmit = () => {
    let total_staff = 0;
    let total_amount = 0;
  
      let Value = this.state.all_paymethod
      for (let i = 0; i < Value.length; i++) {
        total_amount = parseInt(total_amount) + parseInt(Math.round(Value[i].amount))
        total_staff = parseInt(total_staff) + parseInt(Math.round(Value[i].num_of_staff_required))
      }

    let data = {
      id: this.state.orderVendorList[0].id,
      bill_number: this.state.orderVendorList[0].bill_number,
      order_id: this.state.orderData.id,
      vender_id: this.state.vender_id,
      // num_of_staff_required: this.state.num_of_staff_required,
      num_of_hours: this.state.num_of_hours,
      reporting_timestamp: this.state.reporting_timestamp,
      closing_timestamp: this.state.closing_timestamp,
      booking_timestamp: this.state.booking_timestamp,
      booking_done_by: this.state.booking_done_by,
      // rate: this.state.rate,
      // amount: this.state.amount,
      mobile: this.state.mobile,
      // payment_term: this.state.payment_term,
      // payment_brakeDown: this.state.payment_brakeDown,
      all_paymethod: JSON.stringify(this.state.all_paymethod),
      total_amount: total_amount,
      total_num_of_staff_required: total_staff
    };
    let value = {
      order_id: this.state.orderData.id,
      reviewer_id: this.context.userData.cust_code,
      reviewer_name: this.context.userData.name,
      type: this.context.userData.type,
      track_comment: `Vendor edited for this order`,
    };
    // console.log(".................data edited.............",data)
    this.setState({ isLoading: true });
    update_track_log(value)
      .then((res) => {
        // console.log("..........res..........", res);
      })
      .catch((err) => { });
    EditOrderVendorStaffDetails(data)
      .then((result) => {
        if (result.is_success) {
          this.gotoBack();
          this.sendWhatsappSms()
        } else {
          this.setState({
            showAlertModal: true,
            alertType: "Error",
            alertMessage: result.message,
          });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  hideAlert = () => {
    this.setState({
      showAlertModal: false,
    });
  };

  setStatus = (v) => {
    this.setState({
      status: v.id,
      status_name: v.name,
    });
  };

  UpdateAmount = () => {
    if (this.state.payment_term == "Fixed") {
      let num_of_hours = Number(this.state.num_of_hours);
      let rate = Number(this.state.rate);
      let num_of_staff_required = Number(this.state.num_of_staff_required);

      let total = rate * num_of_staff_required;

      this.setState({ amount: total.toString() });
    } else if (this.state.payment_term == "Hourly") {
      let num_of_hours = Number(this.state.num_of_hours);
      let rate = Number(this.state.rate);
      let num_of_staff_required = Number(this.state.num_of_staff_required);

      let total = num_of_hours * rate * num_of_staff_required;

      this.setState({ amount: total.toString() });
    }
  };

  setMobile = (number) => {
    if (number?.length <= 10) {
      this.setState({ mobile: number });
    }
  };

  payment = (item) => {
    // console.log('...........item............', item)
    this.setState(
      {
        payment_term: item.payment_name,
        rate: item.amount,
        payment_item: item,
      },
      () => this.totalAmount(item)
    )
  }

  totalAmount = (item) => {
    if (Number(item.no_of_hours) > Number(this.state.num_of_hours)) {
      let total = Number(item.amount) * Number(this.state.num_of_staff_required);
      let TotalComment = `( ${item.amount} * ${this.state.num_of_staff_required} ) = ₹ ${total.toString()}`
      // console.log('......total.......',TotalComment);
      this.setState({
        amount: total.toString(),
        payment_brakeDown: TotalComment
      })
    } else {
      let baseAmount = Number(item.amount) * Number(this.state.num_of_staff_required);
      let extraTime = (Number(this.state.num_of_hours) - Number(item.no_of_hours));
      let finalAmount = (baseAmount) + (extraTime * Number(this.state.num_of_staff_required) * Number(item.amount_beyond_hours))
      let TotalComment = `( ${item.amount} * ${this.state.num_of_staff_required} ) + (${extraTime} * ${this.state.num_of_staff_required} * ${item.amount_beyond_hours} ) = ₹ ${finalAmount.toString()}`
      // console.log('......total.......',TotalComment);
      this.setState({
        amount: finalAmount.toString(),
        payment_brakeDown: TotalComment
      })
    }
  }

  changeHours = (num_of_hours) => {
    if (this.state.payment_item != null) {
      this.setState({ num_of_hours }, () => this.payment(this.state.payment_item))
    }
    else {
      this.setState({ num_of_hours })
    }
  }

  ChangeStaff = (num) => {
    this.setState({ num_of_staff_required: num },
      () => {
        if (this.state.payment_item != null) { this.payment(this.state.payment_item) }
      })
  }

  /*
  *
  * order information send as whatsapp sms 
  * 
  * created by - Rahul Saha
  * 
  * created on - 20.12.22
  * 
  */

  sendWhatsappSms = () => {
    let text = `Order id : ${this.state.orderData.order_id}, number of staff: ${this.state.num_of_staff_required}, reporting date: ${moment(this.state.orderData.event_start_timestamp).format("Do MMM YY")} , closing date : ${moment(this.state.orderData.event_end_timestamp).format("Do MMM YY")} , number of hours : ${this.state.num_of_hours}, payment term : ${this.state.payment_term}, rate : ${this.state.rate}, amount : ${this.state.amount} , booking done by : ${this.state.orderData.customer_name} ,booking date : ${moment(this.state.orderData.order_date).format("Do MMM YY")}`
    let value = {
      to: this.state.orderData.customer_mobile,
      type: 'text',
      preview_url: false,
      body: text,
    }
    // console.log('..........sendWhatsappSms........',value);
    send_whatsappsms(value).then(res => {
      // console.log('........res........',res);
    }).catch(err => { })
  }
  render() {
    // console.log('........this.state.payment_term........',this.state.payment_term);
    return (
      <>
        {this.state.isLoading && <OverlayLoader />}
        <SafeAreaView style={styles.container}>
          <Header
            title={
              this.state.editstate == 0 ? "Add Volunteer" : "Edit Volunteer"
            }
            delete={this.state.editstate == 0 ? "" : "delete"}
            deleteItem={this.deleteItem}
          />

          <View style={styles.form}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              {/* <Text style={{ fontSize: 15, marginBottom: 5, marginTop: 10, color: Colors.darkgrey }}>
              Vendor Details</Text> */}
              <View style={[styles.rowContainer, { marginTop: 0 }]}>
                <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: Platform.OS === "android" ? 4 : 8,
                      paddingBottom: Platform.OS === "android" ? 4 : 8,
                      borderBottomWidth: 0.8,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>Choose Vendor</Text>
                  </View>
                  <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                    <View style={{ width: "90%", marginLeft: 9 }}>
                      <Dropdown
                        value={this.state.vender_name}
                        data={this.state.venders}
                        onChange={this.SetVenderId}
                        // style={styles.placeholdertext}
                        placeholderStyle={styles.Dropdown_textInput}
                        selectedTextStyle={styles.Dropdown_textInput}
                        inputSearchStyle={styles.Dropdown_textInput}
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
                </View>

                {/* <Text style={{ fontSize: 15, marginBottom: 5, marginTop: 10, color: Colors.darkgrey }}>Other Info</Text> */}

                <View
                  style={[
                    styles.row,
                    { borderBottomWidth: 0.8, paddingVertical: 5 },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>Reporting:</Text>
                  </View>
                  <View style={[styles.rowRight, { flexDirection: "row" }]}>
                    <View style={{ width: "55%" }}>
                      {/* <DateTimerPicker
                                                pickerMode={'date'}
                                                dateTime={this.state.reporting_timestamp}
                                                onChange={this.onChangeReportingDateChange}
                                            /> */}
                      <TouchableOpacity
                        onPress={() => this.showDatePicker("date")}
                      >
                        {this.state.reporting_timestamp != "" ? (
                          <Text
                            style={[
                              styles.inputLable,
                              {
                                fontSize: 14,
                                alignSelf: "flex-start",
                                marginLeft: 9,
                              },
                            ]}
                          >
                            {showDateAsWant(this.state.reporting_timestamp)}
                          </Text>
                        ) : (
                          <Text
                            style={[
                              styles.inputLable,
                              {
                                fontSize: 14,
                                alignSelf: "flex-start",
                                marginLeft: 9,
                              },
                            ]}
                          >
                            {"DD/MM/YYYY"}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.divider}></View>
                    <View style={{ width: "43%" }}>
                      {/* <DateTimerPicker
                                                pickerMode={'time'}
                                                dateTime={this.state.reporting_timestamp}
                                                onChange={this.onReportingTimeChange}
                                            /> */}
                      <TouchableOpacity
                        onPress={() =>
                          this.showTimePicker(
                            "time",
                            this.state.reporting_timestamp
                          )
                        }
                      >
                        {this.state.reporting_timestamp != "" ? (
                          <Text
                            style={[
                              styles.inputLable,
                              { fontSize: 14, alignSelf: "center" },
                            ]}
                          >
                            {moment(this.state.reporting_timestamp).format(
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

                    <DateTimePickerModal
                      mode={this.state.mode}
                      onConfirm={this.handleReportingDateChange}
                      onCancel={this.hideDatePicker}
                      display={Platform.OS == "ios" ? "inline" : "default"}
                      isVisible={this.state.isDatePickerVisible}
                    />
                    <DateTimePickerModal
                      mode={this.state.mode}
                      date={new Date(this.state.selectedDate)}
                      onConfirm={this.handleReportingTimeChange}
                      onCancel={this.hideDatePicker}
                      display={Platform.OS == "ios" ? "spinner" : "default"}
                      isVisible={this.state.isTimePickerVisible}
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.row,
                    {
                      borderBottomWidth: Platform.OS === "android" ? 1 : 1,
                      paddingVertical: 5,
                      paddingBottom: 5,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft]}>
                    <Text style={styles.inputLable}>Closing Time:</Text>
                  </View>
                  <View style={[styles.rowRight]}>
                    <View style={{ width: "100%", paddingLeft: 9 }}>
                      {/* <DateTimerPicker
                        pickerMode={"time"}
                        dateTime={this.state.closing_timestamp}
                        onChange={this.onClosingTimeChange}
                      /> */}
                      <TouchableOpacity
                        onPress={() => this.showClosingTimePicker()}
                      >
                        {this.state.closing_timestamp != "" ? (
                          <Text
                            style={[
                              styles.inputLable,
                              { fontSize: 14, alignSelf: "flex-start" },
                            ]}
                          >
                            {moment(this.state.closing_timestamp).format(
                              "h:mm A"
                            )}
                          </Text>
                        ) : (
                          <Text
                            style={[
                              styles.inputLable,
                              { fontSize: 14, alignSelf: "flex-start" },
                            ]}
                          >
                            {"HH:MM"}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                    <DateTimePickerModal
                      mode="time"
                      onConfirm={this.handleClosingTimeChange}
                      onCancel={this.hideClosingDatePicker}
                      display={Platform.OS == "ios" ? "spinner" : "default"}
                      isVisible={this.state.isClosingTimePickerVisible}
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: Platform.OS === "android" ? 8 : 12,
                      paddingBottom: Platform.OS === "android" ? 8 : 15,
                      borderBottomWidth: 0.8,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft]}>
                    <Text style={styles.inputLable}>No. of Hours:</Text>
                  </View>
                  <View style={[styles.rowRight]}>
                    <View style={{ width: "100%", marginLeft: 10 }}>
                      <TextInput
                        value={this.state.num_of_hours}
                        autoCompleteType="off"
                        keyboardType="number-pad"
                        style={styles.textInput}
                        onChangeText={(num_of_hours) =>
                          this.changeHours(num_of_hours)
                        }
                        // editable={false}
                        onBlur={this.UpdateAmount}
                      />
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: Platform.OS === "android" ? 8 : 12,
                      paddingBottom: Platform.OS === "android" ? 8 : 15,
                      borderBottomWidth: 0,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>Contact Number:</Text>
                  </View>
                  <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                    <View style={{ width: "100%", paddingLeft: 10 }}>
                      <TextInput
                        value={this.state.mobile}
                        autoCompleteType="off"
                        keyboardType="number-pad"
                        autoCapitalize="words"
                        style={styles.textInput}
                        onChangeText={(mobile) => this.setMobile(mobile)}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ marginTop: 10, flexDirection: 'row' }}>
                    <Text>Add Staff</Text>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={()=>{this.state.editstate == 0 ? this.addAction():this.addModal()}}
                      style={{ position: 'absolute', right: 5 }}
                    >
                      <AntDesign name="pluscircleo" size={20} color={Colors.textColor} />
                    </TouchableOpacity>
                  </View>

              {this.state.editstate == 0 ?
                <>
                  <View style={[styles.rowContainer, { marginTop: 10 }]}>
                    <View
                      style={[
                        styles.row,
                        {
                          paddingVertical: Platform.OS === "android" ? 8 : 12,
                          paddingBottom: Platform.OS === "android" ? 8 : 15,
                          borderBottomWidth: 0.8,
                        },
                      ]}
                    >
                      <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                        <Text style={styles.inputLable}>Payment Term:</Text>
                      </View>
                      <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                        {this.state.editstate == 0 ?
                          <View style={{ width: "100%", paddingLeft: 9 }}>
                            <Dropdown
                              value={this.state.payment_term}
                              data={this.state.PAYMENT_TERMS}
                              onChange={(item) =>
                                this.payment(item)
                              }
                              style={styles.placeholdertext}
                              inputSearchStyle={styles.Dropdown_textInput}
                              placeholderStyle={styles.Dropdown_textInput}
                              selectedTextStyle={styles.Dropdown_textInput}
                              search
                              labelField="payment_name"
                              valueField="payment_name"
                              placeholder={
                                this.state.payment_term == ''
                                  ? "Select Payment Term"
                                  : this.state.payment_term
                              }
                              searchPlaceholder="Search..."
                            />
                          </View>
                          :
                          <View style={{ width: "100%", paddingLeft: 9 }}>
                            <Text style={styles.Dropdown_textInput}>{this.state.payment_term}</Text>
                          </View>
                        }
                      </View>
                    </View>

                    <View
                      style={[
                        styles.row,
                        {
                          paddingVertical: Platform.OS === "android" ? 8 : 12,
                          paddingBottom: Platform.OS === "android" ? 8 : 15,
                          borderBottomWidth: 0.8,
                        },
                      ]}
                    >
                      <View style={[styles.rowLeft]}>
                        <Text style={styles.inputLable}>No. of Staff:</Text>
                      </View>
                      <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                        <View style={{ width: "100%", marginLeft: 13 }}>
                          <TextInput
                            value={this.state.num_of_staff_required}
                            autoCompleteType="off"
                            keyboardType="number-pad"
                            style={styles.textInput}
                            onChangeText={(num) =>
                              this.ChangeStaff(num)
                            }
                            onBlur={this.UpdateAmount}
                          />
                        </View>
                      </View>
                    </View>

                    {/* <Text style={{ marginTop: 10, marginBottom: 15, color: Colors.darkgrey }}>Total No. of Staff Required: {(this.state.totalVolunteerRequired !== null) ? this.state.totalVolunteerRequired : ''}</Text> */}

                    <View
                      style={[
                        styles.row,
                        {
                          paddingVertical: Platform.OS === "android" ? 8 : 12,
                          paddingBottom: Platform.OS === "android" ? 8 : 15,
                          borderBottomWidth: 0.8,
                        },
                      ]}
                    >
                      <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                        <Text style={styles.inputLable}>Rate:</Text>
                      </View>
                      <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                        <View style={{ width: "100%", paddingLeft: 9 }}>
                          <TextInput
                            value={this.state.rate}
                            autoCompleteType="off"
                            keyboardType="numeric"
                            style={styles.textInput}
                            editable={false}
                            onChangeText={(rate) => this.setState({ rate })}
                            onBlur={this.UpdateAmount}
                          />
                        </View>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.row,
                        {
                          paddingVertical: Platform.OS === "android" ? 8 : 12,
                          paddingBottom: Platform.OS === "android" ? 8 : 15,
                          borderBottomWidth: 0,
                        },
                      ]}
                    >
                      <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                        <Text style={styles.inputLable}>Amount:</Text>
                      </View>
                      <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                        <View style={{ width: "100%", paddingLeft: 9 }}>
                          <TextInput
                            value={this.state.amount}
                            autoCompleteType="off"
                            keyboardType="numeric"
                            editable={false}
                            style={styles.textInput}
                            onChangeText={(amount) => this.setState({ amount })}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </>
                : null}
              <View>
                {this.state.all_paymethod.map((data, index) => {
                  return (
                    <>
                      <View style={{ marginVertical: 12, flexDirection: 'row' }}>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => this.editAction(data)}
                          style={{ position: 'absolute', right: 40 }}
                        >
                          <AntDesign name="edit" size={20} color={Colors.textColor} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.5}
                          onPress={() => this.deleteAction(data)}
                          style={{ position: 'absolute', right: 5 }}
                        >
                          <MaterialIcons name="delete" size={20} color={Colors.textColor} />
                        </TouchableOpacity>
                      </View>

                      <View style={[styles.rowContainer, { marginTop: 10 }]}>
                        <View
                          style={[
                            styles.row,
                            {
                              paddingVertical: Platform.OS === "android" ? 8 : 12,
                              paddingBottom: Platform.OS === "android" ? 8 : 15,
                              borderBottomWidth: 0.8,
                            },
                          ]}
                        >
                          <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text style={styles.inputLable}>Payment Term:</Text>
                          </View>
                          <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                            <View style={{ width: "100%", paddingLeft: 9 }}>
                              <Text style={styles.Dropdown_textInput}>{data.payment_term}</Text>
                            </View>
                          </View>
                        </View>

                        <View
                          style={[
                            styles.row,
                            {
                              paddingVertical: Platform.OS === "android" ? 8 : 12,
                              paddingBottom: Platform.OS === "android" ? 8 : 15,
                              borderBottomWidth: 0.8,
                            },
                          ]}
                        >
                          <View style={[styles.rowLeft]}>
                            <Text style={styles.inputLable}>No. of Staff:</Text>
                          </View>
                          <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                            <View style={{ width: "100%", marginLeft: 13 }}>
                              <TextInput
                                value={data.num_of_staff_required}
                                autoCompleteType="off"
                                keyboardType="number-pad"
                                style={styles.textInput}
                                onChangeText={(num) =>
                                  this.ChangeStaff(num)
                                }
                                editable={false}
                                onBlur={this.UpdateAmount}
                              />
                            </View>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.row,
                            {
                              paddingVertical: Platform.OS === "android" ? 8 : 12,
                              paddingBottom: Platform.OS === "android" ? 8 : 15,
                              borderBottomWidth: 0.8,
                            },
                          ]}
                        >
                          <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text style={styles.inputLable}>Rate:</Text>
                          </View>
                          <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                            <View style={{ width: "100%", paddingLeft: 9 }}>
                              <TextInput
                                value={data.rate}
                                autoCompleteType="off"
                                keyboardType="numeric"
                                style={styles.textInput}
                                editable={false}
                                onChangeText={(rate) => this.setState({ rate })}
                                onBlur={this.UpdateAmount}
                              />
                            </View>
                          </View>
                        </View>

                        <View
                          style={[
                            styles.row,
                            {
                              paddingVertical: Platform.OS === "android" ? 8 : 12,
                              paddingBottom: Platform.OS === "android" ? 8 : 15,
                              borderBottomWidth: 0,
                            },
                          ]}
                        >
                          <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                            <Text style={styles.inputLable}>Amount:</Text>
                          </View>
                          <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                            <View style={{ width: "100%", paddingLeft: 9 }}>
                              <TextInput
                                value={data.amount}
                                autoCompleteType="off"
                                keyboardType="numeric"
                                editable={false}
                                style={styles.textInput}
                                onChangeText={(amount) => this.setState({ amount })}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    </>
                  );
                })}
              </View>

              {/* <Text style={{ fontSize: 15, marginBottom: 5, marginTop: 10, color: Colors.darkgrey }}>Booking Info</Text> */}
              <View style={[styles.rowContainer, { marginTop: 10 }]}>
                <View
                  style={[
                    styles.row,
                    {
                      paddingVertical: 0,
                      borderBottomWidth: 1,
                      paddingBottom: 0,
                    },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>Booking Done By:</Text>
                  </View>
                  <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                    <View style={{ width: "80%", paddingLeft: 9 }}>
                      <Text
                        style={{
                          color: Colors.textColor,
                        }}
                      >
                        {this.state.booking_done_by}
                      </Text>
                    </View>
                  </View>
                </View>
                {/* <View style={styles.row}>
										<View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
											<Text style={styles.inputLable}>Booking:</Text>
										</View>
										<View style={[styles.rowRight, { borderTopRightRadius: 5, }]}>
											<View style={{ width: "55%" }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{showDateAsClientWant(this.state.booking_date)}</Text>
												</TouchableOpacity>
											</View>
											<View style={styles.divider}></View>
											<View style={{ width: "45%", borderTopRightRadius: 5, }}>
												<TouchableOpacity
													activeOpacity={1}
													style={{ paddingRight: 0, paddingVertical: 4, paddingLeft: 10, width: "100%" }} >
													<Text style={styles.location}>{this.state.booking_time.toString()}</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View> */}
                <View
                  style={[
                    styles.rowTop,
                    {
                      paddingVertical: 0,
                      marginBottom: 5,
                      alignItems: "center",
                    },
                  ]}
                >
                  <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                    <Text style={styles.inputLable}>Booking:</Text>
                  </View>
                  <View style={[styles.rowRight, { flexDirection: "row" }]}>
                    <View style={{ width: "53%", marginLeft: -7, padding: 0 }}>
                      <DateTimerPicker
                        pickerMode={"date"}
                        dateTime={this.state.booking_timestamp}
                        onChange={() => { }}
                      />
                    </View>

                    <View style={styles.divider}></View>
                    <View style={{ width: "43%" }}>
                      <DateTimerPicker
                        pickerMode={"time"}
                        dateTime={this.state.booking_timestamp}
                        onChange={() => { }}
                      />
                    </View>
                  </View>
                </View>
              </View>
              {this.state.editstate == 0 ? (
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={this.ControlSubmit}
                >
                  <Text style={{ fontSize: 18, color: Colors.white }}>
                    {"Add & Send msg"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={this.EditSubmit}
                >
                  <Text style={{ fontSize: 18, color: Colors.white }}>
                    {"Edit & Send msg"}
                  </Text>
                </TouchableOpacity>
              )}

            </KeyboardAwareScrollView>
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.isModalOpen}
            onRequestClose={() => { this.closeModal() }}
            onBackdropPress={() => { this.closeModal() }}
          >
            <TouchableWithoutFeedback onPress={() => {
              this.setState({ isModalOpen: false });
            }}>
              <View style={styles.modalContainer}>
                <View style={styles.modalBody}>
                    <View style={[styles.rowContainer, { marginTop: 10 }]}>
                      <View
                        style={[
                          styles.row,
                          {
                            paddingVertical: Platform.OS === "android" ? 8 : 12,
                            paddingBottom: Platform.OS === "android" ? 8 : 15,
                            borderBottomWidth: 0.8,
                          },
                        ]}
                      >
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                          <Text style={styles.inputLable}>Payment Term:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                         
                            <View style={{ width: "100%", paddingLeft: 9 }}>
                              <Dropdown
                                value={this.state.payment_term}
                                data={this.state.PAYMENT_TERMS}
                                onChange={(item) =>
                                  this.payment(item)
                                }
                                style={styles.placeholdertext}
                                inputSearchStyle={styles.Dropdown_textInput}
                                placeholderStyle={styles.Dropdown_textInput}
                                selectedTextStyle={styles.Dropdown_textInput}
                                search
                                labelField="payment_name"
                                valueField="payment_name"
                                placeholder={
                                  this.state.payment_term == ''
                                    ? "Select Payment Term"
                                    : this.state.payment_term
                                }
                                searchPlaceholder="Search..."
                              />
                            </View>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.row,
                          {
                            paddingVertical: Platform.OS === "android" ? 8 : 12,
                            paddingBottom: Platform.OS === "android" ? 8 : 15,
                            borderBottomWidth: 0.8,
                          },
                        ]}
                      >
                        <View style={[styles.rowLeft]}>
                          <Text style={styles.inputLable}>No. of Staff:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                          <View style={{ width: "100%", marginLeft: 13 }}>
                            <TextInput
                              value={this.state.num_of_staff_required}
                              autoCompleteType="off"
                              keyboardType="number-pad"
                              style={styles.textInput}
                              onChangeText={(num) =>
                                this.ChangeStaff(num)
                              }
                              onBlur={this.UpdateAmount}
                            />
                          </View>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.row,
                          {
                            paddingVertical: Platform.OS === "android" ? 8 : 12,
                            paddingBottom: Platform.OS === "android" ? 8 : 15,
                            borderBottomWidth: 0.8,
                          },
                        ]}
                      >
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                          <Text style={styles.inputLable}>Rate:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                          <View style={{ width: "100%", paddingLeft: 9 }}>
                            <TextInput
                              value={this.state.rate}
                              autoCompleteType="off"
                              keyboardType="numeric"
                              style={styles.textInput}
                              editable={false}
                              onChangeText={(rate) => this.setState({ rate })}
                              onBlur={this.UpdateAmount}
                            />
                          </View>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.row,
                          {
                            paddingVertical: Platform.OS === "android" ? 8 : 12,
                            paddingBottom: Platform.OS === "android" ? 8 : 15,
                            borderBottomWidth: 0,
                          },
                        ]}
                      >
                        <View style={[styles.rowLeft, { borderTopLeftRadius: 5 }]}>
                          <Text style={styles.inputLable}>Amount:</Text>
                        </View>
                        <View style={[styles.rowRight, { borderTopRightRadius: 5 }]}>
                          <View style={{ width: "100%", paddingLeft: 9 }}>
                            <TextInput
                              value={this.state.amount}
                              autoCompleteType="off"
                              keyboardType="numeric"
                              editable={false}
                              style={styles.textInput}
                              onChangeText={(amount) => this.setState({ amount })}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.btn} onPress={()=>this.state.editStaffData != null ?this.saveModal(): this.addAction()}>
                      <Text style={{color:Colors.white}}>Save</Text>
                    </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
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
          {/* <AwesomeAlert
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
          /> */}
        </SafeAreaView>
      </>
    );
  }
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
  cardBody: {
    marginTop: 10,
    marginBottom: 10,
  },
  cardHeader: {
    fontSize: 25,
    marginBottom: 15,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
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
    // borderBottomWidth: 1,
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
    color: Colors.textColor,
    marginBottom: 2,
  },
  subText: {
    fontSize: 13,
    color: Colors.textColor,
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
  // form: {
  //     flex: 1,
  //     paddingTop: 10,
  //     paddingBottom: 10,
  //     paddingLeft: 20,
  //     paddingRight: 20

  // },

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
  inputLable: {
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 10,
    // opacity: Colors.opacity6,
  },
  textInput: {
    fontSize: 14,
    width: "100%",
    // borderRadius: 4,
    borderColor: "#fff",
    backgroundColor: "#fff",
    color: Colors.textColor,
  },
  placeholdertext: {
    fontSize: 14,
    width: "100%",
    // borderRadius: 4,
    borderColor: "#fff",
    backgroundColor: "#fff",
    color: Colors.textColor,
  },
  Dropdown_textInput: {
    color: Colors.black,
    fontSize: 14,
    opacity: 1
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
    borderColor: Colors.background,
    borderWidth: 0,
    borderRadius: 5,
    paddingVertical: 0,
    paddingHorizontal: 5,
    backgroundColor: Colors.white,
  },

  row: {
    marginTop: 0,
    flexDirection: "row",
    marginBottom: 0,
    borderBottomColor: "#cfcfcf",
    borderBottomWidth: 0.4,
    height: 45,
    alignItems: "center",
    // paddingBottom: 8,
  },

  rowTop: {
    flexDirection: "row",
    borderBottomColor: "#cfcfcf",
    // borderBottomWidth: 0.6,
    height: 45,
    // paddingVertical: 5,
    // paddingBottom: 8,
  },

  inputLable: {
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 0,
    // opacity: Colors.opacity6,
  },

  rowRight: {
    width: "53%",
    marginLeft: 0,
    backgroundColor: "#fff",
    marginTop: 0,
    // justifyContent: 'space-evenly',
    // alignItems: "center",
  },

  rowLeft: {
    width: "47%",
    backgroundColor: "#fff",
    paddingLeft: 2,
    justifyContent: "center",
    marginTop: 0,
    // paddingTop:1,
    // paddingBottom:1,
  },

  divider: {
    width: "2%",
    borderLeftWidth: 0.3,
    alignSelf: "center",
    height: 20,
    borderLeftColor: "#444",
    opacity: Colors.opacity4,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // backgroundColor: "red",
  },
  modalBody: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    width: windowWidth - 30,
    minHeight: Math.floor(windowHeight / 4),
    // borderRadius: 5,
    elevation: 5,
    padding: 20,
  },
  btn:{
    justifyContent:'center',
    alignItems:'center',
    width:'40%',
    height:50,
    backgroundColor:Colors.primary,
    marginVertical:10,
    borderRadius:6
  }
});
