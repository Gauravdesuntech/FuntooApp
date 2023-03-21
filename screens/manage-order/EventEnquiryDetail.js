import React from "react";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	SafeAreaView,
	Modal,
	TouchableOpacity,
	Dimensions,
	ActivityIndicator,
	Alert,
	RefreshControl,
} from "react-native";
import Colors from "../../config/colors";
import { showTimeAsWant, showDateAsWant, getpdfData } from "../../utils/Util";
import Header from "../../components/Header";
import OverlayLoader from "../../components/OverlayLoader";
import ProgressiveImage from "../../components/ProgressiveImage";
import {
	FontAwesome,
	MaterialIcons,
	Ionicons,
	AntDesign,
	MaterialCommunityIcons
} from "@expo/vector-icons";
import { GetOrder, ChangeOrderStatus, upload_pdf } from "../../services/OrderService";
import Configs from "../../config/Configs";
import PressableButton from "../../components/PressableButton";
import AppContext from "../../context/AppContext";
import InputDropdown from "../../components/InputDropdown";
import { TextInput } from "react-native-gesture-handler";
import ItemDiscount from "../../components/ItemDiscount";
import { EditEnquiry, SendOrderBillingInfoUpdatePush, update_track_log } from "../../services/APIServices";
import Checkbox from "expo-checkbox";
import RadioForm from "react-native-simple-radio-button";
import firebase from "../../config/firebase";
import { message_and_notify, send_whatsappsms } from "../../services/ChatService";
import getDirections from "react-native-google-maps-directions";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import moment from "moment";
import CachedImage from 'expo-cached-image';
import AwesomeAlert from 'react-native-awesome-alerts';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const renderImage = (data) => {
	// console.log("........data..........", data)
	const images = data.map((item) => {
		return (`
      <div style="display:flex;align-items:center;padding: 5px 5px; border-bottom: 1px solid gray;">
      <div style="width: 12%; text-align: left;">
          <img src="${item.game.image_url}" style="width: 130%; height: 85%;">
      </div>
      <div style="width: 37%; text-align: left;font-size: 28px;margin-left: 30px">${item.game.name}<br>${item.quantity} * ₹${Math.floor(item.price)}
      </div>
      <div style="width: 50%; text-align: left;font-size: 28px;">₹${Math.round(item.total_amount)}</div>
  </div>`
		);
	})
	return images;
}

// const htmlRender = (item, gameData) => {
//   // console.log('....................//',gameData);
//   let html = `<!doctype html>
// <html lang="en">
// <head>
// <meta charset="utf-8">
// <meta http-equiv="x-ua-compatible" content="ie=edge">
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// <title>App Html Table</title>
// <style>
//   @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
// </style>
// </head>

// <body style="background: lightgray;">
// <main style="font-family: 'Roboto',sans-serif;">
//   <div style="background: white;width:100%;margin: 0 auto;">
//       <div style="display:flex;align-items:center;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px; color:gray;">Event start:</div>
//           <div style="width: 25%; text-align: left;font-size: 15px;color:gray;">
//           ${moment(item.event_data?.event_start_timestamp).format("Do MMM YY (ddd)")}

//           </div>
//           <div style="width: 25%; text-align: center;font-size: 15px;border-left:1px solid gray;color:gray;">
//             ${moment(item.event_data?.event_start_timestamp).format("hh:mm A")}
//           </div>
//       </div>

//       <div style="display:flex;align-items:center;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px; color:gray;">Event end:</div>
//           <div style="width: 25%; text-align: left;font-size: 15px;color:gray;">
//           ${moment(item.event_data?.event_end_timestamp).format("Do MMM YY (ddd)")}

//           </div>
//           <div style="width: 25%; text-align: center;font-size: 15px;border-left:1px solid gray;color:gray;">
//           ${moment(item.event_data?.event_end_timestamp).format("hh:mm A")}
//           </div>
//       </div>

//       <div style="display:flex;align-items:center;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px; color:gray;">Setup:</div>
//           <div style="width: 25%; text-align: left;font-size: 15px;color:gray;">
//           ${moment(item.event_data?.setup_timestamp).format("Do MMM YY (ddd)")}

//           </div>
//           <div style="width: 25%; text-align: center;font-size: 15px;border-left:1px solid gray;color:gray;">
//           ${moment(item.event_data?.setup_timestamp).format("hh:mm A")}
//           </div>
//       </div>

//       <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Play Time:</div>
//           <div style="width: 50%; text-align: left;font-size: 15px; color:gray;">${item.event_data?.play_time}</div>
//       </div>

//       <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;"># of Guest:</div>
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">${item.event_data?.num_of_guest}</div>
//       </div>

//       <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Event Type:</div>
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">${item.event_data?.event_type_name}</div>
//       </div>
//   </div>


//   <div style="background: white;width:100%;margin: 15px auto 0;">
//       <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Venue:</div>
//           <div style="width: 50%; text-align: left;font-size: 15px; color:gray;">${item.event_data?.venue}</div>
//       </div>

//       <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Which Floor is the Setup?:</div>
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">${item.event_data?.floor_name}</div>
//       </div>

//       <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Google Location:</div>
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">${item.event_data?.google_location}</div>
//       </div>

//       <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Landmark:</div>
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">${item?.landmark}</div>
//       </div>
//   </div>


//   <div style="background: white;width:100%;margin: 15px auto 0;">
//       <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Special instructions</div>
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">${item?.special_instructions}</div>
//       </div>
//   </div>`
//   if (gameData) {
//     html += ` <div style="background: white;width:100%;margin: 15px auto 0;">
//   <h5 style="margin:5px 5px 10px;color:gray;padding: 10px 10px;">Games</h5>
//       ${renderImage(gameData)}
//   </div>`
//   }

//   html += `<div style="background: white;width:100%;margin: 15px auto 0;">
//   <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//   <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Distance:</div>
//   <div style="width: 50%; text-align: left;font-size: 15px; color:gray;">${item.distance}</div>
// </div>

//       <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Sub Total:</div>
//           <div style="width: 50%; text-align: left;font-size: 15px; color:gray;">₹${Math.round(item.subtotal)}</div>
//       </div>`
//   if (item.ref_data != null) {
//     html += ` <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Discount:</div>
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">₹${parseInt(
//       JSON.parse(item.ref_data).TotalDiscount
//     )}</div>
//       </div>`}


//   if (item.ref_data != null) {
//     html += `<div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Transport Charges:</div>
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">₹${JSON.parse(item.ref_data)
//         .TotalTransportCharge}</div>
//       </div>`}
//   if (item.ref_data != null && JSON.parse(item.ref_data).showGST) {
//     html += ` <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">GST</div>
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">₹${JSON.parse(item.ref_data).TotalGST}</div>
//       </div>`}
//   if (item.ref_data != null && JSON.parse(item.ref_data).charge != null) {
//     html += ` <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Charge</div>
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">₹${JSON.parse(item.ref_data).charge}</div>
//       </div>`}
//   if (item.ref_data != null && JSON.parse(item.ref_data).comment != null) {
//     html += ` <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Comment</div>
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">${JSON.parse(item.ref_data).comment}</div>
//       </div>`}
//   if (item.payment != null) {
//     html += `<div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//               <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Payment Method:</div>
//               <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">₹${item.payment}</div>
//           </div>`}

//   if (item.ref_data != null && JSON.parse(item.ref_data).showGST) {
//     html += `<div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;"><strong>Net Amount</strong></div>
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">₹${JSON.parse(item.ref_data).TotalAmount}</div>
//       </div>`
//   } else {
//     html += `<div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;"><strong>Net Amount</strong></div>
//           <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">₹${Math.round(item.subtotal)}</div>
//       </div>`}
//   `</div>
// </main>		
// </body>
// </html>`;
//   {/* <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
// <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Alt name:</div>
// <div style="width: 50%; text-align: left;font-size: 15px; color:gray;">${item?.alt_name}</div>
// </div>

// <div style="display:flex;padding: 10px 10px; border-bottom: 1px solid gray;">
// <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">Alt mobile:</div>
// <div style="width: 50%; text-align: left;font-size: 15px;color:gray;">${item?.alt_mobile}</div>
// </div> */}


//   const export_data = async () => {
//     const { uri } = await Print.printToFileAsync({
//       html,
//     });
//     await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
//   };

//   // const export_pdf_data = async () => {
//   //   const { uri } = await Print.printToFileAsync({
//   //     html,
//   //   });
//   //   // console.log('........pdf uri..............', getpdfData(uri));
//   //   await upload_pdf(getpdfData(uri)).then(res =>
//   //      { 
//   //       // console.log('.......res...........', res);
//   //      }).catch(err => { })
//   // };
//   // export_pdf_data();
//   return (
//     <TouchableOpacity
//       activeOpacity={0.5}
//       onPress={export_data}
//       style={{ padding: 5 }}
//     >
//       <AntDesign name="export" size={22} color={Colors.white} />
//     </TouchableOpacity>
//   );
// };
const htmlRender = (item, gameData) => {
	let html = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Funtoo App Html</title>
      <style>
          @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
      </style>
  </head>
  
  <body style="background: whitesmoke;font-family: 'Roboto',sans-serif;">
      <main>
          <div style="background: white;padding: 10px;margin-bottom: 10px;">
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;">
                  <div style="text-align: left;width: 40%;font-size:28px">Event Start</div>
                  <div style="text-align: center;font-size:28px">  ${moment(item.event_data?.event_start_timestamp).format("Do MMM YY (ddd)")}</div>
                  <div style="text-align: center; border-left: 1px solid lightgray;padding-left: 10px;font-size:28px"> ${moment(item.event_data?.event_start_timestamp).format("hh:mm A")}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 40%;font-size:28px">Event End:</div>
                  <div style="text-align: center;font-size:28px"> ${moment(item.event_data?.event_end_timestamp).format("Do MMM YY (ddd)")}</div>
                  <div style="text-align: center; border-left: 1px solid lightgray;padding-left: 10px;font-size:28px">${moment(item.event_data?.event_end_timestamp).format("hh:mm A")}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 40%;font-size:28px">Setup:</div>
                  <div style="text-align: center;font-size:28px">${moment(item.event_data?.setup_timestamp).format("Do MMM YY (ddd)")}</div>
                  <div style="text-align: center; border-left: 1px solid lightgray;padding-left: 10px;font-size:28px">${moment(item.event_data?.setup_timestamp).format("hh:mm A")}</div>
              </div>
  
          </div>
  
          <div style="background: white;padding: 10px;margin-bottom: 10px;">
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Venue:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.event_data?.venue}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Which Floor is the setup?</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.event_data?.floor_name}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Google Location:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.event_data?.google_location}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Landmark:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.event_data?.landmark}</div>
              </div>
          </div>
  
          <div style="background: white;padding: 10px;margin-bottom: 10px;">
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 40%;font-size:28px">Special Instructions:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item?.special_instructions}</div>
              </div>
          </div>`
	if (gameData) {
		html += `   <div style="background: white;padding: 10px;margin-bottom: 10px;">
              <h4 style="font-size:28px;">Games</h4>
              ${renderImage(gameData)}
          </div>
          `
	}

  
    html +=   ` <div style="background: white;padding: 10px;margin-bottom: 10px;">
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 85%;font-size:28px">Sub Total:</div>
                  <div style="text-align: right;width: 65%;font-size:28px">₹${Math.round(item.subtotal)}</div>
              </div>`
	if (item.ref_data != null) {
		html += ` <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 85%;font-size:28px">Discount:</div>
                  <div style="text-align: right;width: 65%;font-size:28px">₹${parseInt(
			JSON.parse(item.ref_data).TotalDiscount
		)}</div>
              </div>`
	}

	html += ` <div
              style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
              <div style="text-align: left;width: 85%;font-size:28px">Transport Charges:</div>
              <div style="text-align: right;width: 65%;font-size:28px">₹${Math.round(item.transport)}</div>
          </div>`
	html += `
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 85%;font-size:28px">GST amount:</div>
                  <div style="text-align: right;width: 65%;font-size:28px">₹${Math.round(item.total_gst)}</div>
              </div>`

	if (item.ref_data != null && JSON.parse(item.ref_data).charge != null) {
		html += ` 
                        <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 85%;font-size:28px">Extra Charge:</div>
                  <div style="text-align: right;width: 65%;font-size:28px">₹${JSON.parse(item.ref_data).charge}</div>
              </div>
                        `}
	if (item.ref_data != null && JSON.parse(item.ref_data).comment != null) {
		html += ` 
                        <div
                        style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                        <div style="text-align: left;width: 85%;font-size:28px">Comment:</div>
                        <div style="text-align: right;width: 65%;font-size:28px">${JSON.parse(item.ref_data).comment}</div>
                    </div>
                        `}

	if (item.payment != null) {
		html += `<div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 85%;font-size:28px">Payment Method:</div>
                  <div style="text-align: right;width: 65%;font-size:28px">${item.payment}</div>
              </div>`}

	if (item.ref_data != null && JSON.parse(item.ref_data).showGST) {
		html += ` <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 85%;font-weight: 700;font-size:28px">Net Amount</div>
                  <div style="text-align: right;width: 65%;font-weight: 700;font-size:28px ">₹${parseInt(JSON.parse(item.ref_data).TotalSubtotal) + parseInt(item.total_gst) + parseInt(JSON.parse(item.ref_data)
			.TotalTransportCharge) + parseInt(JSON.parse(item.ref_data).charge)}</div>
              </div>
          </div>`
	} else {
		html += `<div
              style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
              <div style="text-align: left;width: 85%;font-weight: 700;font-size:28px">Net Amount</div>
              <div style="text-align: right;width: 65%;font-weight: 700;font-size:28px ">₹${Math.round(parseInt(item.subtotal) + parseInt(item.total_gst) + parseInt(item.transport))}</div>
          </div>
      </div>`
	}

	if (item.gst_available) {
		html += `
		<div style="background: white;padding: 10px;margin-bottom: 10px;">
            <div
            style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
            <div style="text-align: left;width: 50%;font-size:28px">Company Name:</div>
            <div style="text-align: left;width: 50%;font-size:28px">${item.company_name}</div>
        </div>
            <div
            style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
            <div style="text-align: left;width: 50%;font-size:28px">GST:</div>
            <div style="text-align: left;width: 50%;font-size:28px">${item.gst_number}</div>
        </div>
            `
	}
	else {
		html += `
            <div
            style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
            <div style="text-align: left;width: 50%;font-size:28px">Billing Name:</div>
            <div style="text-align: left;width: 50%;font-size:28px">${item.billing_name}</div>
        </div>
            `
	}
	html += `
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Distance:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.distance}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Contact number:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.contact_number}</div>
              </div>
  
              <div
                  style="display: flex; justify-content: space-between;align-items: center;border-bottom: 1px solid lightgray;padding-bottom: 10px;padding-top: 10px;">
                  <div style="text-align: left;width: 50%;font-size:28px">Email:</div>
                  <div style="text-align: left;width: 50%;font-size:28px">${item.email}</div>
              </div>
          </div>

	  </main>
  </body>
  
  </html>`;

	const export_data = async () => {
		const { uri } = await Print.printToFileAsync({
			html,
		});
		await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
	};

	return (
		<TouchableOpacity
			activeOpacity={0.5}
			onPress={export_data}
			style={{ padding: 5 }}
		>
			<AntDesign name="export" size={22} color={Colors.white} />
		</TouchableOpacity>
	);
};

export default class EventEnquiryDetail extends React.Component {
	static contextType = AppContext;
	_focustListner = null;
	constructor(props) {
		super(props);
		this.state = {
			order_data: this.props.route.params.data,
			isLoading: false,
			enquiryData: {},
			GamesData: "",
			oldGameData: "",
			isModalOpen: false,
			isDiscountsMenuOpen: false,
			discount: "",
			discountPercentage: "",
			messages: [],
			lastID: 0,
			nextID: 0,
			DiscountType: [
				{
					value: 0,
					label: "Lumpsum",
				},
				{
					value: 1,
					label: "Percentage",
				},
				{
					value: 2,
					label: "Item Wise",
				},
			],
			TotalSubtotal: "",
			TotalDiscount: 0,
			itemDiscount: [],
			isGSTModalOpen: false,
			isTransportModalOpen: false,
			showGST: true,
			applyGST: false,
			TotalGST: 0,
			TotalTransportCharge: 0,
			TotalAmount: "",
			customer_id: "",
			showDiscount: false,
			typeOfDiscount: "",
			loading: false,
			discountBox: false,
			SelectedRadioButton: "",

			isModalOpenCancel: false,
			reason_of_cancel: "",
			id: "",
			modal_type: "edt",
			showAlertModal: false,
			alertMessage: "",
			alertType: '',
			extraCharge: false,
			comment: '',
			charge: 0,
			payment: '',
			refreshing: false,
			all_Alt_num: [],
			contact_number: '',
			email: '',
			all_Alt_email: [],
			billing_Address: '',
			GST_number: '',
			company_Name: '',
			billing_name: '',
			gst_available: '',
			status: '',
			AltPerson_name: '',
			AltMobileNo: '',
			AltEmail_Id: '',
			Alt_Person_array: [],
			uni_Order_Id: null,
			checkUpdation: 0,
			visible:false
		};
	}

	componentDidMount() {
		this.blinkInformation()
		// console.log('order data =========>', this.props.route.params.data);
		// this is the change done by sharad-yadav--->>>>>>>>

		// console.log("............this.props.route.params.data................>>",this.props.route.params.data)
		this.setState({ uni_Order_Id: this.props.route.params.data.order_id })
		this._focustListner = this.props.navigation.addListener(
			"focus",
			() => {
				this.loadData();
				if (this.props.route.params.itemID == 1) {
					this.setState({
						isLoading: true,
					});
					GetOrder({ id: this.state.order_data.id })
						.then((result) => {
							// console.log("......GetOrder......",result.data);
							this.setState({
								enquiryData: result.data,
								// TotalAmount: parseInt(result.data.grand_total),
								TotalAmount: parseInt(result.data.subtotal) + parseInt(result.data.total_gst) + parseInt(result.data.transport),
								TotalSubtotal: result.data.subtotal,
								GamesData: result.data.line_items,
								all_Alt_num: JSON.parse(result.data.alt_contact_number),
								contact_number: result.data.contact_number,
								email: result.data.email,
								all_Alt_email: JSON.parse(result.data.alt_email),
								Alt_Person_array: (JSON.parse(result.data.Alt_Person_array)),
								billing_Address: result.data.billing_address,
								GST_number: result.data.gst_number,
								company_Name: result.data.company_name,
								AltPerson_name: result.data.AltPerson_name,
								AltMobileNo: result.data.AltMobileNo,
								AltEmail_Id: result.data.AltEmail_Id,
								billing_name: result.data.billing_name,
								gst_available: result.data.gst_available,
								status: result.data.status,
								oldGameData: result.data.line_items,
								customer_id: result.data.customer_id,
								payment: result.data.payment,
								TotalGST: result.data.total_gst,
								TotalTransportCharge: Math.trunc(result.data.transport),
								TotalDiscount: 0,
								TotalDiscount_per: 0,
								distance: "",
								showDiscount: false,
								showGST: true,
								discountPercentage: "",
								applyGST: false,
								checkUpdation: 1,
							});
						})
						.catch((err) => console.log(err))
						.finally(() => {
							this.setState({
								isLoading: false,
							});
						});
				} else {
					this.fetchData();
				}
				// () => {
				//   this.loadData();
				// }
			},
		);
	}

	blinkInformation = () => {
		// if( this.state.enquiryData.event_data.play_time >= 4){
			setInterval(() =>this.setState({visible: !this.state.visible}), 200)
		// }
	}

	fetchData = () => {
		// console.log("props..........................",this.props.route.params.itemID)
		this.setState({
			isLoading: true,
		});
		GetOrder({ id: this.state.order_data.id })
			.then((result) => {
				// console.log("......GetOrder......",typeof result.data.Alt_Person_array);
				this.context.setOldGameData([]);
				this.context.setOldGameData(result.data);
				// console.log("get fetch data /.......................>",result.data)
				// if (this.props.route.params.itemID == 1) {
				//   this.setState(
				//     {
				//       enquiryData: result.data,
				//       TotalAmount: parseInt(result.data.subtotal),
				//       TotalSubtotal: result.data.subtotal,
				//       GamesData: result.data.line_items,
				//       oldGameData: result.data.line_items,
				//       customer_id: result.data.customer_id,
				//       TotalGST: 0,
				//       TotalTransportCharge: 0,
				//       TotalDiscount: 0,
				//       TotalDiscount_per: "",
				//       showDiscount: false,
				//     },
				//   );
				// } else {
				if (result.data.ref_data != null) {
					// console.log('............................00....................', parseInt(JSON.parse(result.data.ref_data).TotalSubtotal) + parseInt(result.data.total_gst) + parseInt(JSON.parse(result.data.ref_data)
					// .TotalTransportCharge) + parseInt(JSON.parse(result.data.ref_data).charge))
					this.setState({
						// TotalAmount: JSON.parse(result.data.ref_data).TotalAmount,
						TotalAmount: parseInt(JSON.parse(result.data.ref_data).TotalSubtotal) + parseInt(result.data.total_gst) + parseInt(JSON.parse(result.data.ref_data)
							.TotalTransportCharge) + parseInt(JSON.parse(result.data.ref_data).charge),
						TotalTransportCharge: Math.trunc(JSON.parse(result.data.ref_data)
							.TotalTransportCharge),
						TotalGST: result.data.total_gst,
						enquiryData: result.data,
						TotalSubtotal: JSON.parse(result.data.ref_data).TotalSubtotal,
						customer_id: result.data.customer_id,
						distance: result.data.distance,
						GamesData: JSON.parse(JSON.parse(result.data.ref_data).game_data),
						oldGameData: JSON.parse(JSON.parse(result.data.ref_data).game_data),
						showDiscount: true,
						TotalDiscount: parseInt(
							JSON.parse(result.data.ref_data).TotalDiscount
						),
						TotalDiscount_per: JSON.parse(result.data.ref_data)
							.TotalDiscount_per,
						charge: JSON.parse(result.data.ref_data).charge,
						comment: JSON.parse(result.data.ref_data).comment,
						payment: result.data.payment,
						all_Alt_num: JSON.parse(result.data.alt_contact_number),
						contact_number: result.data.contact_number,
						email: result.data.email,
						all_Alt_email: JSON.parse(result.data.alt_email),
						Alt_Person_array: (JSON.parse(result.data.Alt_Person_array)),
						billing_Address: result.data.billing_address,
						GST_number: result.data.gst_number,
						company_Name: result.data.company_name,
						AltPerson_name: result.data.AltPerson_name,
						AltMobileNo: result.data.AltMobileNo,
						AltEmail_Id: result.data.AltEmail_Id,
						billing_name: result.data.billing_name,
						gst_available: result.data.gst_available,
						status: result.data.status,
					});
					if (JSON.parse(result.data.ref_data).charge > 0) {
						this.setState({
							extraCharge: true
						})
					}
					if (JSON.parse(result.data.ref_data).showGST == "true" || JSON.parse(result.data.ref_data).showGST == "Yes") {
						this.setState({ showGST: true, applyGST: false });
					} else {
						this.setState({ showGST: false, applyGST: true });
					}
				} else {
					this.setState({
						enquiryData: result.data,
						// TotalAmount: parseInt(result.data.grand_total),
						TotalAmount: parseInt(result.data.subtotal) + parseInt(result.data.total_gst) + parseInt(result.data.transport),
						TotalSubtotal: result.data.subtotal,
						GamesData: result.data.line_items,
						oldGameData: result.data.line_items,
						customer_id: result.data.customer_id,
						distance: result.data.distance,
						payment: result.data.payment,
						all_Alt_num: JSON.parse(result.data.alt_contact_number),
						contact_number: result.data.contact_number,
						email: result.data.email,
						all_Alt_email: JSON.parse(result.data.alt_email),
						Alt_Person_array: (JSON.parse(result.data.Alt_Person_array)),
						billing_Address: result.data.billing_address,
						GST_number: result.data.gst_number,
						company_Name: result.data.company_name,
						AltPerson_name: result.data.AltPerson_name,
						AltMobileNo: result.data.AltMobileNo,
						AltEmail_Id: result.data.AltEmail_Id,
						billing_name: result.data.billing_name,
						gst_available: result.data.gst_available,
						status: result.data.status,
						showGST: true,
						applyGST: false,
						TotalGST: result.data.total_gst,
						TotalTransportCharge: result.data.transport,
					});
				}
				// }
			})
			.catch((err) => console.log(err))
			.finally(() => {
				this.setState({
					isLoading: false,
					refreshControl: false,
				});
			});
	};
	editSubTotal = () => {
		this.setState({
			isModalOpen: true,
			itemDiscount: [],
			TotalSubtotal: parseInt(this.state.enquiryData.subtotal),
		});
	};

	componentWillUnmount() {
		this._focustListner();
	}

	fetchData = () => {
		// console.log("props..........................",this.props.route.params.itemID)
		this.setState({
			isLoading: true,
		});
		GetOrder({ id: this.state.order_data.id })
			.then((result) => {
				// console.log("......GetOrder......",typeof result.data.Alt_Person_array);
				this.context.setOldGameData([]);
				this.context.setOldGameData(result.data);
				// console.log("get fetch data /.......................>",result.data)
				// if (this.props.route.params.itemID == 1) {
				//   this.setState(
				//     {
				//       enquiryData: result.data,
				//       TotalAmount: parseInt(result.data.subtotal),
				//       TotalSubtotal: result.data.subtotal,
				//       GamesData: result.data.line_items,
				//       oldGameData: result.data.line_items,
				//       customer_id: result.data.customer_id,
				//       TotalGST: 0,
				//       TotalTransportCharge: 0,
				//       TotalDiscount: 0,
				//       TotalDiscount_per: "",
				//       showDiscount: false,
				//     },
				//   );
				// } else {
				if (result.data.ref_data != null) {
					// console.log('............................00....................', parseInt(JSON.parse(result.data.ref_data).TotalSubtotal) + parseInt(result.data.total_gst) + parseInt(JSON.parse(result.data.ref_data)
					// .TotalTransportCharge) + parseInt(JSON.parse(result.data.ref_data).charge))
					this.setState({
						// TotalAmount: JSON.parse(result.data.ref_data).TotalAmount,
						TotalAmount:
							parseInt(JSON.parse(result.data.ref_data).TotalSubtotal) +
							parseInt(result.data.total_gst) +
							parseInt(
								JSON.parse(result.data.ref_data).TotalTransportCharge
							) +
							parseInt(JSON.parse(result.data.ref_data).charge),
						TotalTransportCharge: Math.trunc(
							JSON.parse(result.data.ref_data).TotalTransportCharge
						),
						TotalGST: result.data.total_gst,
						enquiryData: result.data,
						TotalSubtotal: JSON.parse(result.data.ref_data).TotalSubtotal,
						customer_id: result.data.customer_id,
						distance: result.data.distance,
						GamesData: JSON.parse(
							JSON.parse(result.data.ref_data).game_data
						),
						oldGameData: JSON.parse(
							JSON.parse(result.data.ref_data).game_data
						),
						showDiscount: true,
						TotalDiscount: parseInt(
							JSON.parse(result.data.ref_data).TotalDiscount
						),
						TotalDiscount_per: JSON.parse(result.data.ref_data)
							.TotalDiscount_per,
						charge: JSON.parse(result.data.ref_data).charge,
						comment: JSON.parse(result.data.ref_data).comment,
						payment: result.data.payment,
						all_Alt_num: JSON.parse(result.data.alt_contact_number),
						contact_number: result.data.contact_number,
						email: result.data.email,
						all_Alt_email: JSON.parse(result.data.alt_email),
						Alt_Person_array: JSON.parse(result.data.Alt_Person_array),
						billing_Address: result.data.billing_address,
						GST_number: result.data.gst_number,
						company_Name: result.data.company_name,
						AltPerson_name: result.data.AltPerson_name,
						AltMobileNo: result.data.AltMobileNo,
						AltEmail_Id: result.data.AltEmail_Id,
						billing_name: result.data.billing_name,
						gst_available: result.data.gst_available,
						status: result.data.status,
					});
					if (JSON.parse(result.data.ref_data).charge > 0) {
						this.setState({
							extraCharge: true,
						});
					}
					if (
						JSON.parse(result.data.ref_data).showGST == "true" ||
						JSON.parse(result.data.ref_data).showGST == "Yes"
					) {
						this.setState({ showGST: true, applyGST: false });
					} else {
						this.setState({ showGST: false, applyGST: true });
					}
				} else {
					this.setState({
						enquiryData: result.data,
						// TotalAmount: parseInt(result.data.grand_total),
						TotalAmount:
							parseInt(result.data.subtotal) +
							parseInt(result.data.total_gst) +
							parseInt(result.data.transport),
						TotalSubtotal: result.data.subtotal,
						GamesData: result.data.line_items,
		 				oldGameData: result.data.line_items,
						customer_id: result.data.customer_id,
						distance: result.data.distance,
						payment: result.data.payment,
						all_Alt_num: JSON.parse(result.data.alt_contact_number),
						contact_number: result.data.contact_number,
						email: result.data.email,
						all_Alt_email: JSON.parse(result.data.alt_email),
						Alt_Person_array: JSON.parse(result.data.Alt_Person_array),
						billing_Address: result.data.billing_address,
						GST_number: result.data.gst_number,
						company_Name: result.data.company_name,
						AltPerson_name: result.data.AltPerson_name,
						AltMobileNo: result.data.AltMobileNo,
						AltEmail_Id: result.data.AltEmail_Id,
						billing_name: result.data.billing_name,
						gst_available: result.data.gst_available,
						status: result.data.status,
						showGST: true,
						applyGST: false,
						TotalGST: result.data.total_gst,
						TotalTransportCharge: result.data.transport,
					});
				}
				// }
			})
			.catch((err) => console.log(err))
			.finally(() => {
				this.setState({
					isLoading: false,
					refreshControl: false,
				});
			});
	};
	editSubTotal = () => {
		this.setState({
			isModalOpen: true,
			itemDiscount: [],
			TotalSubtotal: parseInt(this.state.enquiryData.subtotal),
		});
	};

	getBackUpOrderData() {
		this.setState({
			isLoading: true,
		});
		GetOrder({ id: this.state.order_data.id })
			.then((result) => {
				this.setState({
					oldGameData: result.data.line_items,
				});
			})
			.catch((err) => console.log(err))
			.finally(() => {
				this.setState({
					isLoading: false,
				});
			});
	}

	editTransport = () => {
		this.setState({
			isTransportModalOpen: true,

		});
	};

	editGST = () => {
		this.setState({
			isGSTModalOpen: true,
		});
	};

	lumsumData = (value) => {
		const lumsumCharge = value.replace(/[^0-9]/g, "");
		this.setState({ TotalDiscount: lumsumCharge, checkUpdation: 1, });
	};

	PercentageData = (value) => {
		const PercentageCharge = value.replace(/[^0-9]/g, "");
		if (PercentageCharge > 100) {
			alert("Percentage can't be more then 100");
			return;
		} else {
			this.setState({
				TotalDiscount: (PercentageCharge / 100) * this.state.TotalSubtotal,
				discountPercentage: PercentageCharge,
				checkUpdation: 1,
			});
		}
	};

	saveModal = () => {
		this.setState({
			isModalOpen: !this.state.isModalOpen,
			// showGST: false,
			// applyGST: true,
		});

		if (this.state.discount == "Lumpsum") {
			this.setState({
				// TotalSubtotal:parseInt(this.state.TotalSubtotal) - parseInt(this.state.TotalDiscount),
				GamesData: this.state.oldGameData,
				TotalAmount:
					parseInt(this.state.TotalSubtotal) +
					parseInt(this.state.TotalTransportCharge) +
					parseInt(this.state.TotalGST) +
					parseInt(this.state.charge) -
					parseInt(this.state.TotalDiscount),
				showDiscount: true,
				TotalDiscount_per:
					(parseInt(this.state.TotalDiscount) * 100) / this.state.TotalSubtotal,
			});
		}

		if (this.state.discount == "Percentage") {
			this.setState({
				// TotalSubtotal:parseInt(this.state.TotalSubtotal) - parseInt(this.state.TotalDiscount),
				GamesData: this.state.oldGameData,
				TotalAmount:
					parseInt(this.state.TotalSubtotal) +
					parseInt(this.state.TotalTransportCharge) +
					parseInt(this.state.TotalGST) +
					parseInt(this.state.charge) -
					parseInt(this.state.TotalDiscount),
				showDiscount: true,
				TotalDiscount_per:
					(parseInt(this.state.TotalDiscount) * 100) / this.state.TotalSubtotal,
			});
		}

		if (this.state.discount == "Item Wise") {
			if (this.state.GamesData.length > 0) {
				this.state.GamesData.map((item) => {
					this.state.itemDiscount.push(item.discount);
				});
				let i = 0;
				let data = 0;
				for (i; i < this.state.GamesData.length; i++) {
					if (this.state.GamesData[i].discount > 0) {
						data = data + parseInt(this.state.GamesData[i].discount);
					}
				}
				// console.log("total discount......................", data);
				this.setState(
					{
						//  TotalSubtotal: parseInt(this.state.TotalSubtotal )- parseInt(data) ,
						TotalDiscount: data,
						TotalAmount:
							parseInt(this.state.TotalSubtotal) +
							parseInt(this.state.TotalTransportCharge) +
							parseInt(this.state.TotalGST) +
							parseInt(this.state.charge) -
							parseInt(data),
						showDiscount: true,
						TotalDiscount_per: (data * 100) / this.state.TotalSubtotal,
					},
					() => {
						this.getBackUpOrderData();
					}
				);
				// console.log("............TotalDiscount_per...............", (data * 100) / this.state.TotalSubtotal)
			}
		}
	};

	setItemDiscount = (item, amount) => {
		// console.log(".............................", amount);
		// const itemCharge = value.replace(/[^0-9]/g, "");R

		let game_data = [...this.state.GamesData];
		item.total_amount = amount;
		if (amount == "") {
			item.discount = 0;
		} else if (amount > 0) {
			item.discount = item.quantity * item.price - item.total_amount;
		}
		let index = game_data.findIndex((data) => data.id == item.id);
		if (index !== -1) {
			game_data[index] = item;
		} else {
			game_data.push(item);
		}
		this.setState({ GamesData: game_data });
	};
	transportCharge = (value) => {
		const transportCharge = value.replace(/[^0-9]/g, "");
		this.setState({ TotalTransportCharge: transportCharge, checkUpdation: 1, });
	};

	// here code has been changed by sharad yadav ---->>>(set state checkUpdation : 1)----->>>>  //

	saveTransportModal = () => {
		if (this.state.showGST == true) {
			this.setState({
				isTransportModalOpen: !this.state.isTransportModalOpen,
				checkUpdation: 1,
				TotalAmount:
					parseInt(this.state.TotalSubtotal) +
					parseInt(this.state.TotalTransportCharge) +
					parseInt(this.state.TotalGST) +
					parseInt(this.state.charge) -
					parseInt(this.state.TotalDiscount),
			});
		} else {
			this.setState({
				isTransportModalOpen: !this.state.isTransportModalOpen,
				TotalAmount:
					parseInt(this.state.TotalSubtotal) +
					parseInt(this.state.TotalTransportCharge) +
					parseInt(this.state.TotalGST) +
					parseInt(this.state.charge) -
					parseInt(this.state.TotalDiscount),
			});
		}
	};

	cloesModal = () => {
		this.setState({
			isModalOpen: !this.state.isModalOpen,
		});
	};

	cloesTransportModal = () => {
		this.setState({
			isTransportModalOpen: !this.state.isTransportModalOpen,
		});
	};

	cloesGSTModal = () => {
		this.setState({
			isGSTModalOpen: !this.state.isGSTModalOpen,

		});
	};
	saveGSTModal = (value) => {
		// console.log(
		//   "gst total subtotal.............",
		//   this.state.TotalSubtotal,
		//   this.state.TotalDiscount
		// );
		if (value == true) {
			if (this.state.TotalDiscount > 0) {
				this.setState({
					showGST: true,
					applyGST: false,
					TotalGST:
						(parseInt(this.state.TotalSubtotal) -
							parseInt(this.state.TotalDiscount)) *
						(18 / 100),
					TotalAmount:
						parseInt(this.state.TotalSubtotal) +
						parseInt(this.state.TotalTransportCharge) +
						parseInt(this.state.charge) +
						(parseInt(this.state.TotalSubtotal) -
							parseInt(this.state.TotalDiscount)) *
						(18 / 100) -
						parseInt(this.state.TotalDiscount),
				});
			} else {
				this.setState({
					showGST: true,
					applyGST: false,
					TotalGST: parseInt(this.state.TotalSubtotal) * (18 / 100),
					TotalAmount:
						parseInt(this.state.TotalSubtotal) +
						parseInt(this.state.TotalTransportCharge) +
						parseInt(this.state.charge) +
						parseInt(this.state.TotalSubtotal) * (18 / 100),
				});
			}
		} else {
			if (this.state.TotalDiscount > 0) {
				this.setState({
					showGST: false,
					applyGST: true,
					TotalAmount:
						parseInt(this.state.TotalSubtotal) +
						parseInt(this.state.TotalTransportCharge) +
						parseInt(this.state.charge) -
						parseInt(this.state.TotalDiscount),
				});
			} else {
				this.setState({
					showGST: false,
					applyGST: true,
					TotalAmount:
						parseInt(this.state.TotalSubtotal) +
						parseInt(this.state.TotalTransportCharge) +
						parseInt(this.state.charge) -
						parseInt(this.state.TotalDiscount),
				});
			}
		}
	};

	// updated here data by sharad yadav on 30-Jan-2023 -------->>> //

	HideGSTModal = () => {
		this.setState({
			checkUpdation: 1,
			showGST: false,
			applyGST: true,
			TotalAmount:
				parseInt(this.state.TotalSubtotal) +
				parseInt(this.state.TotalTransportCharge) +
				parseInt(this.state.charge) -
				parseInt(this.state.TotalDiscount),
		});
	};
	extraChargeAmount = (value) => {
		this.setState({
			charge: value
		})
		if (this.state.extraCharge) {
			if (value == '') {
				value = 0
			}
			if (this.state.TotalGST > 0) {
				if (this.state.TotalDiscount > 0) {
					this.setState({
						TotalAmount:
							parseInt(this.state.TotalSubtotal) +
							parseInt(this.state.TotalTransportCharge) +
							parseInt(this.state.TotalGST) -
							parseInt(this.state.TotalDiscount) + parseInt(value),
					});
				} else {
					this.setState({
						TotalAmount:
							parseInt(this.state.TotalSubtotal) +
							parseInt(this.state.TotalTransportCharge) +
							parseInt(this.state.TotalGST) + parseInt(value),
					});
				}
			} else {
				if (this.state.TotalDiscount > 0) {
					this.setState({
						TotalAmount:
							parseInt(this.state.TotalSubtotal) +
							parseInt(this.state.TotalTransportCharge) -
							parseInt(this.state.TotalDiscount) + parseInt(value),
					});
				} else {
					this.setState({
						TotalAmount:
							parseInt(this.state.TotalSubtotal) +
							parseInt(this.state.TotalTransportCharge) -
							parseInt(this.state.TotalDiscount) + parseInt(value),
					});
				}
			}
		}
	}

	showExtraCharge = () => {
		this.setState({ extraCharge: true })
	};

	// this code has been changed by sharad yadav in (showExtra charge and hideExtraCharge function updated checkUpdation state), after clicking on checkbox reconfirm button will be enable and disable //

	showExtraCharge = () => {
		this.setState({ extraCharge: true, checkUpdation: 1, });
	};


	HideExtraCharge = () => {
		this.setState({ extraCharge: false, charge: 0, checkUpdation: 0, });
		if (this.state.showGST == true) {
			if (this.state.TotalDiscount > 0) {
				this.setState({
					TotalAmount:
						parseInt(this.state.TotalSubtotal) +
						parseInt(this.state.TotalTransportCharge) +
						parseInt(this.state.TotalGST) -
						parseInt(this.state.TotalDiscount),
				});
			} else {
				this.setState({
					TotalAmount:
						parseInt(this.state.TotalSubtotal) +
						parseInt(this.state.TotalTransportCharge) +
						parseInt(this.state.TotalGST),
				});
			}
		} else {
			if (this.state.TotalDiscount > 0) {
				this.setState({
					TotalAmount:
						parseInt(this.state.TotalSubtotal) +
						parseInt(this.state.TotalTransportCharge) -
						parseInt(this.state.TotalDiscount),
				});
			} else {
				this.setState({
					TotalAmount:
						parseInt(this.state.TotalSubtotal) +
						parseInt(this.state.TotalTransportCharge) -
						parseInt(this.state.TotalDiscount),
				});
			}
		}
	};

	toggleDiscountsMenu = () => {
		this.setState({
			isDiscountsMenuOpen: !this.state.isDiscountsMenuOpen,
			discount: "",
			TotalDiscount: "",
			TotalSubtotal: this.state.enquiryData.subtotal,
			TotalDiscount_per: "",
		});
		// if(this.state.itemDiscount.length > 0){
		// 	this.setState({GamesData:
		// 	   this.state.itemDiscount})
		//    }
	};
	setDiscountsData = (data) => {
		// console.log("setDiscountsData.............", data);
		this.setState({ SelectedRadioButton: data });
		if (data == 0) {
			this.setState({
				discount: "Lumpsum",
				isDiscountsMenuOpen: false,
				discountBox: true,
			});
		}
		if (data == 1) {
			this.setState({
				discount: "Percentage",
				isDiscountsMenuOpen: false,
				discountBox: true,
			});
		}
		if (data == 2) {
			this.setState({
				discount: "Item Wise",
				isDiscountsMenuOpen: false,
				discountBox: true,
			});
		}
	};
	gotoBack = () => this.props.navigation.goBack();
	updateDetails = () => {
		let obj = {
			customer_id: this.state.customer_id,
			Order_id: this.state.order_data.id,
			TotalSubtotal: Math.round(this.state.TotalSubtotal),
			TotalDiscount: Math.round(this.state.TotalDiscount),
			TotalDiscount_per: this.state.TotalDiscount_per,
			discount_type: this.state.discount,
			TotalTransportCharge: Math.trunc(this.state.TotalTransportCharge),
			TotalGST: Math.round(this.state.TotalGST),
			TotalAmount: Math.round(this.state.TotalAmount),
			game_data: JSON.stringify(this.state.GamesData),
			showGST: this.state.showGST,
			applyGST: this.state.applyGST,
			charge:
				this.state.charge == "" || this.state.charge == null
					? 0
					: this.state.charge,
			comment: this.state.comment,
		};
		if (this.state.discount == "Percentage") {
			obj.discount_Percentage = this.state.discountPercentage;
		}

		let value = {
			order_id: this.state.order_data.id,
			reviewer_id: this.context.userData.cust_code,
			reviewer_name: this.context.userData.name,
			type: this.context.userData.type,
			// track_comment :this.state.status == 'review' ? ' requested to confirmation the order ':' you edited the order ',
		};
		if (this.state.status == "review") {
			value.track_comment = ` order has been reviewed by ${this.context.userData.type} `;
		}
		if (this.state.status == "request_confirmation") {
			value.track_comment = ` Admin has requested for reconfirmation with changes `;
		}
		if (this.state.status == "confirmed") {
			value.track_comment = ` order has been confirmed by ${this.context.userData.type} `;
		}
		// console.log("enquiry edit obj..........U00001........>>",obj)
		
		this.setState({ isLoading: true });
		update_track_log(value)
			.then((res) => {
				//  console.log('..........res..........', res);
			})
			.catch((err) => { });
		EditEnquiry(obj)
			.then((res) => {
				// htmlRender(this.state.GamesData, this.state.enquiryData);

				// console.log("enquiry edit..................>>", res)
				this.props.navigation.navigate("ManageEnquiry");
				this.setState({ isLoading: false });
				this.onSend();
			})
			.catch((error) => {
				console.log(error);
				this.setState({ isLoading: false });
			});
	};

	loadData = () => {
		firebase
			.database()
			.ref(
				"message/" +
				`U00001` +
				`/${this.state.order_data.customer_cust_code}`
			)
			.on("value", (value) => {
				if (value.val() != null) {
					let arrayOfObj = Object.entries(value.val()).map((e) => e[1]);
					let lastObject = arrayOfObj.slice(-1);
					this.setState({
						lastID: parseInt(lastObject[0]._id),
						nextID: parseInt(lastObject[0]._id) + 1,
					});
				} else {
					this.setState({
						nextID: 1,
					});
				}
			});
	};

	onSend = () => {
		// console.log('...........onSend.............');
		let sms = "";
		if (this.state.status == "confirmed") {
			sms = `Your order has been confirmed.`;
		} else {
			// sms = `There is an update on your enquiry . Please check and confirm.`
			// sms = `Admin has confirmed the order with changes.`
			sms = ` Admin has requested for reconfirmation with changes .`;
		}
		let date = new Date().getTime();

		firebase
			.database()
			.ref(
				"message/" +
				`U00001` +
				`/${this.state.order_data.customer_cust_code}`
			)
			.push()
			.set({
				_id: this.state.nextID,
				createdAt: date,
				text: sms,
				// `There is an update on your enquiry . Please check and confirm.`,
				user: {
					_id: 2,
					name: this.context.userData.name,
				},
			})
			.catch(alert);

		let data = {
			sender_id: "U00001",
			receiver_id: this.state.order_data.customer_cust_code,
			title: "New message",
			content: sms,
			// `There is an update on your enquiry . Please check and confirm.`,
			type: "user",
			// data:JSON.stringify({ "notification_type": "UpdateEnquiry", "id": `${this.props.route.params.data.id}` })
			// data: { notification_type: 'EventEnquiryDetail', id: this.props.route.params.data.id },
			//   content:
			//     `Hi ,` +
			//     `${this.state.order_data.customer_name}` +
			//     ` ` +
			//     `${this.context.userData.name} ` +
			//     `has given` +
			//     ` ₹` +
			//     `${Math.round(this.state.TotalDiscount)}` +
			//     ` ` +
			//     ` discount on your order with ID ` +
			//     ` ` +
			//     `ENQ#:` +
			//     `${this.state.order_data.order_id.toString().replace("O", "E")}`,
			//   type: "user",
		};
		// console.log("...........send notification..data........", data);
		message_and_notify(data)
			.then((res) => {
				// console.log("...........send notification..........", res);
			})
			.catch((err) => {
				console.log("...........send notification...err.......", err);
			});
	
		let whatsappData = {
			to: this.state.order_data.customer_mobile,
			type: 'text',
			preview_url: false,
			body: this.state.status == "request_confirmation" ?
				`Hello` + ` ` + `order has been confirmed by ${this.context.userData.type}`
				+ `\n Event Start :` + ` ${moment(this.state.enquiryData?.event_data.event_start_timestamp).format('Do MMM YY, h:mm a')}` +
				`\n Event End :` + ` ${moment(this.state.enquiryData?.event_data.event_end_timestamp).format('Do MMM YY, h:mm a')}` +
				`\n Setup :` + ` ${moment(this.state.enquiryData?.event_data.setup_timestamp).format('Do MMM YY, h:mm a')}` +
				`\n Venue :` + ` ${this.state.enquiryData?.event_data.venue}` +
				`\n Google Location :` + ` ${this.state.enquiryData?.event_data.google_location}`+
				`\n Landmark :` + ` ${this.state.enquiryData?.event_data.landmark}`+
				`\n`+
				`\n Games ` + ` ` +
				this.state.GamesData.map((item) => {
					return (
						`\n ${item.game.name}` + ` ` + ` ${item.quantity} x ${Math.trunc(item.price)}` + ` = ` + `${Math.trunc(
							item.total_amount
						)}`
					)
				})
				+ `\n Sub Total :` + `${Math.round(this.state.TotalSubtotal)}`
				+ `\n Transport Charges :` + `${Math.trunc(this.state.TotalTransportCharge)}`
				+ `\n Payment Method :` + `${this.state.payment}`
				+ `\n GST Amount :` + `${Math.trunc(this.state.TotalGST)}`
				+ `\n Total Amount :` + `${Math.trunc(this.state.TotalAmount)}`
				:
				`Hello` + ` ` + `Admin has requested for reconfirmation with changes `
				+ `\n Event Start :` + ` ${moment(this.state.enquiryData?.event_data.event_start_timestamp).format('Do MMM YY, h:mm a')}` +
				`\n Event End :` + ` ${moment(this.state.enquiryData?.event_data.event_end_timestamp).format('Do MMM YY, h:mm a')}` +
				`\n Setup :` + ` ${moment(this.state.enquiryData?.event_data.setup_timestamp).format('Do MMM YY, h:mm a')}` +
				`\n Venue :` + ` ${this.state.enquiryData?.event_data.venue}` +
				`\n Google Location :` + ` ${this.state.enquiryData?.event_data.google_location}`+
				`\n Landmark :` + ` ${this.state.enquiryData?.event_data.landmark}`+
				`\n`+
				`\n Games ` + ` ` +
				this.state.GamesData.map((item) => {
					return (
						`\n ${item.game.name}` + ` ` + ` ${item.quantity} x ${Math.trunc(item.price)}` + ` = ` + `${Math.trunc(
							item.total_amount
						)}`
					)
				})
				+ `\n Sub Total :` + `${Math.round(this.state.TotalSubtotal)}`
				+ `\n Transport Charges :` + `${Math.trunc(this.state.TotalTransportCharge)}`
				+ `\n Payment Method :` + `${this.state.payment}`
				+ `\n GST Amount :` + `${Math.trunc(this.state.TotalGST)}`
				+ `\n Total Amount :` + `${Math.trunc(this.state.TotalAmount)}`,
		};
		// console.log("whatsappData......................>", whatsappData)
		// return
		send_whatsappsms(whatsappData)
			.then((res) => {
				// console.log("...........send_whatsappsms..........", res);
			})
			.catch((err) => {
				console.log("...........send_whatsappsms...err.......", err);
			});
	};

	handleGetDirections = () => {
		// console.log(".............navigating....................")

		const data = {
			source: {
				latitude: Configs.ofcLat_Lng.lat,
				longitude: Configs.ofcLat_Lng.lng,
			},
			destination: {
				latitude: JSON.parse(this.state.enquiryData?.userLat_Lng).lat,
				longitude: JSON.parse(this.state.enquiryData?.userLat_Lng).lng,
			},
			params: [
				{
					key: "travelmode",
					value: "driving",
				},
				{
					key: "dir_action",
					value: "navigate",
				},
			],
		};
		// console.log("..........direction.......",data)

		getDirections(data);
	};

	UpdateOrderStatus() {
		let data = {
			id: this.state.id,
			status: this.state.status,
			contact_number: this.state.order_data.customer_mobile,
			uni_order_id: this.props.route.params.data.order_id,
		};
		if (this.state.reason_of_cancel) {
			data.reason_of_cancel = this.state.reason_of_cancel;
		}

		this.setState({ isLoderVisible: true });
		ChangeOrderStatus(data)
			.then((result) => {
				console.log("......result......", result);
				if (result.is_success) {
					this.setState(
						{
							isModalOpenCancel: false,
							showAlertModal: true,
							alertType: "Success",
							alertMessage: result.message,
						},
						// () => this.loadOrderDetails()
						() => this.gotoBack()
					);
				} else {
					// console.log('err', result);
				}
			})
			.catch((err) => console.log(err))
			.finally(() => {
				this.setState({
					isLoderVisible: false,
					reason_of_cancel: "",
				});
			});
	}

	ConfirmOrder = (item) => {
		// console.log('................item props...........',item)
		Alert.alert("Alert", "Are you sure you want to Confirmed this order?", [
			{
				text: "Yes",
				onPress: () => {
					this.setState({
						id: item.id,
						status: "confirmed",
					});
					this.updateDetails();
					this.UpdateOrderStatus();
					// SendOrderBillingInfoUpdatePush({
					//   order_id: item.id,
					//   title: 'Update Order',
					//   body: 'Your order has been confirmed and updated please share further details for confirmation  '
					// });
				},
			},
			{
				text: "No",
				onPress: () => {
					// console.log('current item', item);
				},
			},
		]);
	};
	ReviewedOrder = (item) => {
		// console.log('................item props...........',item)
		Alert.alert("Alert", "Are you sure you want to ReConfirm this order?", [
			{
				text: "Yes",
				onPress: () => {
					this.setState({
						id: item.id,
						status: "request_confirmation",
					});
					this.updateDetails();
					this.UpdateOrderStatus();
					// SendOrderBillingInfoUpdatePush({
					//   order_id: item.id,
					//   title: 'Update Order',
					//   body: 'Your order has been reviewd and updated please share further details for confirmation  '
					// });
				},
			},
			{
				text: "No",
				onPress: () => {
					// console.log('current item', item);
				},
			},
		]);
	};

	toggleOpenModal = (item, type) => {
		this.setState({
			isModalOpenCancel: !this.state.isModalOpenCancel,
			id: item?.id,
			reason_of_cancel: item?.reason_of_cancel,
			modal_type: type ?? "edt",
		});
	};

	CancelOrder = () => {
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to cancel this order?",
			[
				{
					text: "Yes",
					onPress: () => {
						this.setState({
							status: "declined",
						});
						this.UpdateOrderStatus();
					},
				},
				{
					text: "No",
				},
			]
		);
	};

	hideAlert = () => {
		this.setState({
			showAlertModal: false,
		});
	};

	onRefresh = () => {
		this.setState({ refreshing: true }, () => {
			this.fetchData();
		});
	};

	render = () => {
		let eventDetails = this.state.enquiryData?.event_data;
		let lineItems = this.state.enquiryData?.line_items;
		// console.log("...........eventDetails?.play_time................>>", eventDetails?.play_time)
		// console.log(".........typeof...this.state.Alt_Person_array................>>", typeof this.state.Alt_Person_array)
		return (
			<SafeAreaView style={styles.container}>
				<Header
					title="Enquiry Details"
					export="true"
					exportGamedata={this.state.GamesData}
					exportData={htmlRender}
					exportItems={this.state.enquiryData}
					// showHome={false}
					search={false}
					delete="delete"
					deleteItem={() =>
						this.toggleOpenModal(this.state.order_data, "edt")
					}
				/>
				{this.state.isLoading && <OverlayLoader visible={true} />}
				{this.state.isLoading ? (
					<OverlayLoader visible={true} />
				) : (
					<KeyboardAwareScrollView
						keyboardShouldPersistTaps={"always"}
						showsVerticalScrollIndicator={false}
						style={styles.form}
					>
						<ScrollView
							showsVerticalScrollIndicator={false}
							refreshControl={
								<RefreshControl
									refreshing={this.state.refreshing}
									onRefresh={this.onRefresh}
								/>
							}
						>
							<View style={styles.rowContainer}>
								<View style={styles.row}>
									<View
										style={[
											styles.rowLeft,
											{ borderTopRightRadius: 5 },
										]}
									>
										<Text style={[styles.inputLable]}>
											Event start:
										</Text>
									</View>
									<View
										style={[
											styles.rowRight,
											{
												borderTopRightRadius: 5,
												alignItems: "center",
												marginLeft: 7,
											},
										]}
									>
										<Text
											style={[
												styles.momentStyle,
												{
													width: "50%",
													alignSelf: "center",
													color: Colors.textColor,
												},
											]}
										>
											{showDateAsWant(
												eventDetails?.event_start_timestamp
											)}
										</Text>
										<View style={[styles.divider, {}]}></View>
										<Text
											style={[
												styles.momentStyle,
												{
													width: "50%",
													alignSelf: "center",
													paddingHorizontal: 10,
													color: Colors.textColor,
												},
											]}
										>
											{showTimeAsWant(
												eventDetails?.event_start_timestamp
											)}
										</Text>
									</View>
								</View>

								<View style={styles.row}>
									<View
										style={[
											styles.rowLeft,
											{ borderTopRightRadius: 5 },
										]}
									>
										<Text style={[styles.inputLable]}>
											Event end{" "}
										</Text>
									</View>
									<View style={[styles.rowRight, { marginLeft: 7 }]}>
										<Text
											style={[
												styles.momentStyle,
												{ width: "50%", alignSelf: "center" },
											]}
										>
											{showDateAsWant(
												eventDetails?.event_end_timestamp
											)}
										</Text>
										<View style={[styles.divider, {}]}></View>
										<Text
											style={[
												styles.momentStyle,
												{
													width: "50%",
													alignSelf: "center",
													paddingHorizontal: 10,
												},
											]}
										>
											{showTimeAsWant(
												eventDetails?.event_end_timestamp
											)}
										</Text>
									</View>
								</View>

								<View style={styles.row}>
									<View
										style={[
											styles.rowLeft,
											{ borderTopRightRadius: 5 },
										]}
									>
										<Text style={[styles.inputLable]}>Setup: </Text>
									</View>
									<View style={[styles.rowRight, { marginLeft: 7 }]}>
										<Text
											style={[
												styles.momentStyle,
												{ width: "50%", alignSelf: "center" },
											]}
										>
											{showDateAsWant(eventDetails?.setup_timestamp)}
										</Text>

										<View style={[styles.divider, {}]}></View>
										<Text
											style={[
												styles.momentStyle,
												{
													width: "50%",
													alignSelf: "center",
													paddingHorizontal: 10,
												},
											]}
										>
											{showTimeAsWant(eventDetails?.setup_timestamp)}
										</Text>
									</View>
								</View>

								<View style={styles.row}>
									<View
										style={[
											styles.rowLeft,
											{ borderTopRightRadius: 5 },
										]}
									>
										<Text style={[styles.inputLable]}>
											Play Time:
										</Text>
									</View>
									<View
										style={[
											styles.rowRight,
											{ paddingLeft: 7, paddingTop: 10 },
										]}
									>
										{/* Change play time here=============================== */}
										{
											eventDetails?.play_time >= 8 ? 
											<Text style={[styles.inputLable, {display: this.state.visible && eventDetails?.play_time >= 8 ? 'flex' : 'none'}]}>
												{eventDetails?.play_time} !
											</Text> : 
											<>
											{eventDetails?.play_time >= 5 ?
											
												<Text style={[styles.inputLable, {display: this.state.visible && eventDetails?.play_time >= 5 ? 'flex' : 'none'}]}>
												{eventDetails?.play_time} 
												</Text>
												:
												<Text style={[styles.inputLable,]}>
												{eventDetails?.play_time} 
												</Text>
										}
											</>
										}
									</View>
								</View>

								<View style={styles.row}>
									<View
										style={[
											styles.rowLeft,
											{ borderTopRightRadius: 5 },
										]}
									>
										<Text style={[styles.inputLable]}>
											{" "}
											# of Guest:
										</Text>
									</View>
									<View
										style={[
											styles.rowRight,
											{ paddingLeft: 7, paddingTop: 10 },
										]}
									>
										<Text style={[styles.inputLable]}>
											{eventDetails?.num_of_guest}
										</Text>
									</View>
								</View>

								{/* <View style={styles.row}>
                  <View style={[styles.rowLeft, { borderTopRightRadius: 5 }]}>
                    <Text style={[styles.inputLable]}> # of Kids:</Text>
                  </View>
                  <View
                    style={[
                      styles.rowRight,
                      { paddingLeft: 7, paddingTop: 10 },
                    ]}
                  >
                    <Text style={[styles.inputLable]}>
                      {eventDetails?.num_of_kids}
                    </Text>
                  </View>
                </View> */}

								<View style={styles.rowlast}>
									<View
										style={[
											styles.rowLeft,
											{ borderTopRightRadius: 5 },
										]}
									>
										<Text style={[styles.inputLable]}>
											{" "}
											Event Type:
										</Text>
									</View>
									<View
										style={[
											styles.rowRight,
											{ paddingLeft: 8, paddingTop: 10 },
										]}
									>
										<Text style={[styles.inputLable]}>
											{eventDetails?.event_type_name}
										</Text>
									</View>
								</View>
								{/* // */}
							</View>

							<View style={styles.rowContainer}>
								<View style={[styles.row, { marginBottom: 2 }]}>
									<View style={[styles.rowLeft]}>
										<Text style={[styles.inputLable]}> Venue: </Text>
									</View>
									<View
										style={[
											styles.rowRight,
											{ paddingLeft: 10, paddingTop: 10 },
										]}
									>
										<Text style={[styles.inputLable]}>
											{eventDetails?.venue}
										</Text>
									</View>
								</View>

								{/* <View style={styles.row}>
									<View
										style={[
											styles.rowLeft,
											{ borderTopRightRadius: 5, },
										]}
									>
										<Text
											style={[
												styles.inputLable
											]}
										>
											{" "}
											Address:{" "}
										</Text>
									</View>
									<View style={[styles.rowRight, { width: "60%" }]}>
										<Text
											style={[
												styles.inputLable
											]}
										>
											{eventDetails?.address}
										</Text>
									</View>
								</View> */}

								{/* <View style={styles.row}>
                  <View
                    style={[
                      styles.rowLeft,
                      { borderTopRightRadius: 5, },
                    ]}
                  >
                    <Text style={[styles.inputLable]}> Landmark: </Text>
                  </View>
                  <View style={[styles.rowRight, { width: "60%" }]}>
                    <Text style={[styles.inputLable]}>
                      {eventDetails?.landmark}
                    </Text>
                  </View>
                </View> */}

								<View style={styles.row}>
									<View
										style={[
											styles.rowLeft,
											{ borderTopRightRadius: 5, width: "46%" },
										]}
									>
										<Text style={[styles.inputLable]}>
											Which Floor is the setup?:
										</Text>
									</View>
									<View
										style={[
											styles.rowRight,
											{ paddingLeft: 10, paddingTop: 10 },
										]}
									>
										<Text style={[styles.inputLable]}>
											{eventDetails?.floor_name}
										</Text>
									</View>
								</View>

								<View style={styles.row}>
									<View
										style={[
											styles.rowLeft,
											{ borderTopRightRadius: 5 },
										]}
									>
										<Text style={[styles.inputLable]}>
											{" "}
											Google Location:
										</Text>
									</View>
									<View
										style={[
											styles.rowRight,
											{
												paddingLeft: 10,
												paddingTop: 10,
												flexDirection: "column",
											},
										]}
									>
										<Text style={[styles.inputLable]}>
											{eventDetails?.google_location}
										</Text>
										<View
											style={{
												flexDirection: "row",
												paddingVertical: 8,
											}}
										>
											<View style={{ width: "50%" }}></View>
											<PressableButton
												btnTextStyle={{ fontSize: 13 }}
												btnStyle={{
													height: 30,
													width: "50%",
													alignItems: "center",
												}}
												text={"Navigate"}
												// icon={<Ionicons name="ios-navigate-sharp" size={15} color={Colors.white} />}
												onPress={() => this.handleGetDirections()}
											/>
										</View>
									</View>
								</View>
								<View style={styles.rowlast}>
									<View
										style={[
											styles.rowLeft,
											{ borderTopRightRadius: 5 },
										]}
									>
										<Text style={[styles.inputLable]}>
											{" "}
											Landmark:{" "}
										</Text>
									</View>
									<View
										style={[
											styles.rowRight,
											{ paddingLeft: 10, paddingTop: 8 },
										]}
									>
										<Text style={[styles.inputLable]}>
											{eventDetails?.landmark}
										</Text>
									</View>
								</View>
							</View>

							<View style={[styles.rowContainer]}>
								{/* <View style={{ marginBottom: 10 }}>
										<Text style={{ fontSize: 16 }}>Alt Details</Text>
									</View> */}
								{/* <View style={styles.row}>
                  <View style={[styles.rowLeft]}>
                    <Text style={[styles.inputLable]}> Alt name:</Text>
                  </View>
                  <View
                    style={[
                      styles.rowRight,
                      { paddingLeft: 10, paddingTop: 10 },
                    ]}
                  >
                    <Text style={[styles.inputLable]}>
                      {this.state.enquiryData?.alt_name}
                    </Text>
                  </View>
                </View>
                <View style={[styles.row, { borderBottomColor: "#fff" }]}>
                  <View style={[styles.rowLeft]}>
                    <Text style={[styles.inputLable]}> Alt mobile:</Text>
                  </View>
                  <View
                    style={[
                      styles.rowRight,
                      { paddingLeft: 10, paddingTop: 10 },
                    ]}
                  >
                    <Text style={[styles.inputLable]}>
                      {this.state.enquiryData?.alt_mobile}
                    </Text>
                  </View>
                </View> */}
								{this.state.enquiryData?.special_instructions?.length >
									0 ? (
									<View
										style={[
											styles.rowlast,
											{
												// borderTopWidth: 0.6,
												// borderTopColor: "#cfcfcf",
												alignItems: "center",
											},
										]}
									>
										<View style={[styles.rowLeft]}>
											<Text style={[styles.inputLable]}>
												Special instructions:
											</Text>
										</View>
										<View
											style={[
												styles.rowRight,
												{ paddingLeft: 10, paddingBottom: 0 },
											]}
										>
											<Text
												style={[
													styles.inputLable,
													{ marginBottom: 0 },
												]}
											>
												{
													this.state.enquiryData
														?.special_instructions
												}
											</Text>
										</View>
									</View>
								) : null}
							</View>

							<View style={styles.rowContainer}>
								<View style={[styles.rowlast, { marginBottom: 10 }]}>
									<Text style={[styles.inputLable, { fontSize: 16 }]}>
										Games
									</Text>
								</View>
								{this.state.GamesData.length > 0 ? (
									<>
										{this.state.GamesData?.map((item) => {
											// console.log('game image..................>', item.game)
											return (
												<View
													key={item.id.toString()}
													style={[styles.listRow]}
												>
													<View style={{ flexDirection: "row" }}>
														<View style={{ width: "20%" }}>
															{/* <ProgressiveImage
                                source={{ uri: item.game.image_url }}
                                style={{ height: 57, width: "100%" }}
                                resizeMode="cover"
                              /> */}
															<CachedImage
																style={{
																	height: 57,
																	width: "100%",
																}}
																source={{
																	uri: item.game.image_url,
																}}
																resizeMode="cover"
																cacheKey={`${item.game.image}+${item.game.id}`}
																placeholderContent={
																	<ActivityIndicator
																		color={Colors.primary}
																		size="small"
																		style={{
																			flex: 1,
																			justifyContent:
																				"center",
																		}}
																	/>
																}
															/>
														</View>
														{/* <View style={{ width: "50%", paddingLeft: 10 }}>
                              <Text
                                style={styles.inputLable}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {item.game.name}
                              </Text>
                              <Text style={styles.inputLable}>
                                X {item.quantity}
                              </Text>
                            </View> */}
														<View
															style={{
																width: "50%",
																paddingLeft: 10,
																justifyContent: "center",
															}}
														>
															<Text
																style={[styles.inputLable]}
																numberOfLines={1}
																ellipsizeMode="tail"
															>
																{item.game.name}
															</Text>
															{item.quantity > 1 ? (
																<View
																	style={{
																		flexDirection: "row",
																	}}
																>
																	<Text
																		style={{
																			color: Colors.textColor,
																		}}
																	>{`${item.quantity > 1
																		? item.quantity + " * "
																		: ""
																		}`}</Text>
																	<Text
																		style={{
																			fontSize: 9,
																			paddingTop:
																				Platform.OS == "ios"
																					? 1.1
																					: 2.2,
																			color: Colors.textColor,
																		}}
																	>
																		{"₹"}
																	</Text>
																	<Text
																		style={{
																			color: Colors.textColor,
																		}}
																	>{`${Math.floor(
																		item.price
																	)}`}</Text>
																	{/* <Text
                            style={{
                              fontSize: 9,
                              paddingTop: Platform.OS == "ios" ? 1 : 1.8,
                              color: Colors.black,
                              opacity: Colors.opacity6,
                            }}
                          >
                            {"00"}
                          </Text> */}
																</View>
															) : null}
														</View>
														<View
															style={[
																styles.qtyContainer,
																{
																	width: "30%",
																	flexDirection: "row",
																	justifyContent: "flex-end",
																	paddingTop:
																		item.quantity > 1
																			? 10
																			: 0,
																	alignItems: "center",
																},
															]}
														>
															{/* <Text style={styles.inputLable}>Rent</Text> */}
															{this.state.discount ==
																"Item Wise" ? (
																<View
																	style={{
																		flexDirection: "column",
																		alignItems: "center",
																	}}
																>
																	<View
																		style={{
																			flexDirection: "row",
																			justifyContent:
																				"center",
																		}}
																	>
																		<Text
																			style={{
																				fontSize: 9,
																				paddingTop:
																					Platform.OS ==
																						"ios"
																						? 1.1
																						: 2.2,
																				color: Colors.textColor,
																			}}
																		>
																			{"₹"}
																		</Text>
																		<Text
																			style={[
																				styles.inputLable,
																				{ paddingRight: 5 },
																			]}
																		>
																			{/* {alert(item.total_amount)} */}
																			{/* {Math.round(
                                      item.total_amount - item.discount
                                    )} */}
																			{Math.round(
																				item.total_amount
																			)}
																		</Text>
																	</View>
																	{item.discount ? (
																		<View
																			style={{
																				flexDirection:
																					"row",
																				justifyContent:
																					"center",
																				alignItems:
																					"baseline",
																			}}
																		>
																			<Text
																				style={{
																					fontSize: 9,
																					// paddingTop: Platform.OS == "ios" ? 1.1 : 2.2,
																					color: Colors.textColor,
																				}}
																			>
																				{"₹"}
																			</Text>
																			<Text
																				style={[
																					styles.inputLable,
																					{
																						textDecorationLine:
																							"line-through",
																						textDecorationStyle:
																							"solid",
																						fontSize: 10,
																					},
																				]}
																			>
																				{Math.round(
																					item.quantity *
																					item.price
																				)}
																			</Text>
																		</View>
																	) : null}
																</View>
															) : (
																<View
																	style={{
																		flexDirection: "row",
																		justifyContent: "center",
																	}}
																>
																	<Text
																		style={{
																			fontSize: 9,
																			paddingTop:
																				Platform.OS == "ios"
																					? 1.1
																					: 2.2,
																			color: Colors.textColor,
																		}}
																	>
																		{"₹"}
																	</Text>
																	<Text
																		style={styles.inputLable}
																	>
																		{Math.round(
																			item.total_amount
																		)}
																	</Text>
																</View>
															)}
														</View>
													</View>
												</View>
											);
										})}
									</>
								) : null}
								<View
									style={{ flexDirection: "row", paddingVertical: 8 }}
								>
									<View style={{ width: "70%" }}></View>
									<View style={{ width: "30%" }}>
										{this.context.userData.action_types.indexOf(
											"Edit"
										) >= 0 ? (
											<PressableButton
												btnTextStyle={{ fontSize: 13 }}
												btnStyle={{ height: 30 }}
												text={"Edit Games"}
												onPress={() => {
													this.props.navigation.navigate(
														"EditOrderedGames",
														{
															orderDetails:
																this.state.enquiryData,
														}
													);
												}}
											/>
										) : null}
									</View>
								</View>
							</View>


							{this.state.status == 'pending' || this.state.status == 'confirmed' ?
								<View style={styles.rowContainer}>
									{this.state.gst_available == 'Yes' ?
										<>
											<View style={[styles.row, { marginBottom: 2 }]}>
												<View style={[styles.rowLeft]}>
													<Text style={[styles.inputLable]}>Company Name: </Text>
												</View>
												<View
													style={[
														styles.rowRight,
														{ paddingLeft: 10, paddingTop: 10 },
													]}
												>
													<Text style={[styles.inputLable]}>
														{this.state.company_Name}
													</Text>
												</View>
											</View>
											<View style={[styles.row, { marginBottom: 2 }]}>
												<View style={[styles.rowLeft]}>
													<Text style={[styles.inputLable]}>GST: </Text>
												</View>
												<View
													style={[
														styles.rowRight,
														{ paddingLeft: 10, paddingTop: 10 },
													]}
												>
													<Text style={[styles.inputLable]}>
														{this.state.GST_number}
													</Text>
												</View>
											</View>
										</>
										:
										<>
											{this.state.billing_name == null ?
												null :
												<View style={styles.row}>
													<View style={[styles.rowLeft, { borderTopRightRadius: 5 }]}>
														<Text style={[styles.inputLable]}>Billing Name: </Text>
													</View>
													<View
														style={[
															styles.rowRight,
															{ paddingLeft: 10, paddingTop: 8 },
														]}
													>
														<Text style={[styles.inputLable]}>
															{this.state.billing_name}
														</Text>
													</View>
												</View>
											}
										</>
									}
									{/* <View style={styles.row}>
                    <View style={[styles.rowLeft, { borderTopRightRadius: 5 }]}>
                      <Text style={[styles.inputLable]}>Billing Address: </Text>
                    </View>
                    <View
                      style={[
                        styles.rowRight,
                        { paddingLeft: 10, paddingTop: 8 },
                      ]}
                    >
                      <Text style={[styles.inputLable]}>
                        {this.state.billing_Address}
                      </Text>
                    </View>
                  </View> */}

									{/* <View style={styles.row}>
										<View
											style={[
												styles.rowLeft,
												{ borderTopRightRadius: 5 },
											]}
										>
											<Text style={[styles.inputLable]}>
												Distance:{" "}
											</Text>
										</View>
										<View
											style={[
												styles.rowRight,
												{ paddingLeft: 10, paddingTop: 8 },
											]}
										>
											<Text style={[styles.inputLable]}>
												{this.state.distance}
											</Text>
										</View>
									</View> */}

									<View style={[styles.row, { marginBottom: 2 }]}>
										<View style={[styles.rowLeft]}>
											<Text style={[styles.inputLable]}>
												Contact number:{" "}
											</Text>
										</View>
										<View
											style={[
												styles.rowRight,
												{ paddingLeft: 10, paddingTop: 10 },
											]}
										>
											<Text style={[styles.inputLable]}>
												{this.state.contact_number}
											</Text>
										</View>
									</View>

									{/* {this.state.all_Alt_num?.length > 0 ?
                    <>
                      {this.state.all_Alt_num.map((item, index) => {
                        return (
                          <View key={index} style={[styles.row, { marginBottom: 2, alignItems: 'center' }]}>
                            <View style={[styles.rowLeft, { borderTopRightRadius: 5, width: "46%" }]}>
                              <Text style={[styles.inputLable]}>Alt Contact number:
                              </Text>
                            </View>
                            <View
                              style={[styles.rowRight, { paddingLeft: 11, paddingTop: 10, width: '45%' }]}
                            >
                              <Text style={[styles.inputLable]}>{item.number}</Text>

                            </View>

                          </View>
                        )
                      })}</>
                    : null} */}



									<View style={styles.rowlast}>
										<View
											style={[
												styles.rowLeft,
												{ borderTopRightRadius: 5, width: "46%" },
											]}
										>
											<Text style={[styles.inputLable]}>Email:
											</Text>
										</View>
										<View
											style={[
												styles.rowRight,
												{ paddingLeft: 10, paddingTop: 10 },
											]}
										>
											<Text style={[styles.inputLable]}>
												{this.state.email}
											</Text>
										</View>
									</View>

									{/* {this.state.all_Alt_email?.length > 0 ?
                    <>
                      {this.state.all_Alt_email.map((item, index) => {
                        return (
                          <View key={index} style={[styles.row, { marginBottom: 2, alignItems: 'center' }]}>
                            <View style={[
                              styles.rowLeft,
                              { borderTopRightRadius: 5, width: "46%" },
                            ]}>
                              <Text style={[styles.inputLable]}>Alt Email:
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.rowRight,
                                { paddingLeft: 10, paddingTop: 10 },
                              ]}
                            >
                              <Text style={[styles.inputLable]}>{item.email}</Text>

                            </View>

                          </View>
                        )
                      })}</>
                    : null} */}

								</View>
								:
								<View style={styles.rowContainer}>
									<View style={[styles.rowlast, { marginTop: 2 }]}>
										<View style={[styles.rowLeft, { borderTopRightRadius: 5 }]}>
											<Text style={[styles.inputLable]}>Distance: </Text>
										</View>
										<View
											style={[
												styles.rowRight,
												{ paddingLeft: 10, paddingTop: 8, },
											]}
										>
											<Text style={[styles.inputLable]}>
												{this.state.distance}
											</Text>
										</View>
									</View>
								</View>
							}
							{this.state.Alt_Person_array != null ?
								<>
									{this.state.Alt_Person_array.length > 0 ?
										<View>
											<Text>Alternate Person Contacts:</Text>
											{this.state.Alt_Person_array.map((item) => {
												return (
													<View style={styles.rowContainer}>
														{item.name == '' ? null :
															<View style={[styles.row, { marginTop: 2 }]}>
																<View style={[styles.rowLeft, { borderTopRightRadius: 5 }]}>
																	<Text style={[styles.inputLable]}>Name: </Text>
																</View>
																<View
																	style={[
																		styles.rowRight,
																		{ paddingLeft: 10, paddingTop: 8, },
																	]}
																>
																	<Text style={[styles.inputLable]}>
																		{item.name}
																	</Text>
																</View>
															</View>
														}
														{item.mobile == '' ? null :
															<View style={[styles.row, { marginTop: 2 }]}>
																<View style={[styles.rowLeft, { borderTopRightRadius: 5 }]}>
																	<Text style={[styles.inputLable]}>Mobile: </Text>
																</View>
																<View
																	style={[
																		styles.rowRight,
																		{ paddingLeft: 10, paddingTop: 8, },
																	]}
																>
																	<Text style={[styles.inputLable]}>
																		{item.mobile}
																	</Text>
																</View>
															</View>
														}
														{item.email == '' ? null :
															<View style={[styles.rowlast, { marginTop: 2 }]}>
																<View style={[styles.rowLeft, { borderTopRightRadius: 5 }]}>
																	<Text style={[styles.inputLable]}>Email: </Text>
																</View>
																<View
																	style={[
																		styles.rowRight,
																		{ paddingLeft: 10, paddingTop: 8, },
																	]}
																>
																	<Text style={[styles.inputLable]}>
																		{item.email}
																	</Text>
																</View>
															</View>
														}
													</View>
												)
											})
											}
										</View>
										: null}
								</> : null}
							<View
								style={[
									styles.rowContainer,
									{ flexDirection: "column", marginBottom: 0 },
								]}
							>
								<View
									style={{
										width: "100%",
										paddingVertical: 10,
										backgroundColor: Colors.white,
										marginBottom: 10,
									}}
								>
									{/* <View style={styles.pricingItemContainer}>
                    <Text style={[styles.inputLable]}>Distance</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        // paddingRight: 22,
                        paddingRight: 3,
                      }}
                    >
                      <Text style={[styles.inputLable]}>
                        {this.state.distance}
                      </Text>
                    </View>
                  </View> */}
									<View style={styles.pricingItemContainer}>
										<Text
											style={[styles.inputLable, { marginTop: 5 }]}
										>
											Sub Total
										</Text>
										<TouchableOpacity
											style={{
												flexDirection: "row",
												justifyContent: "center",
												// paddingRight: 22,
												paddingRight: 3,
											}}
											onLongPress={() => {
												{
													this.context.userData.action_types.indexOf(
														"Edit"
													) >= 0
														? this.editSubTotal()
														: null;
												}
											}}
										>
											<Text
												style={{
													fontSize: 9,

													color: Colors.textColor,
												}}
											>
												{"₹"}
											</Text>
											<Text
												style={{
													color: Colors.textColor,
												}}
											>
												{Math.round(this.state.TotalSubtotal)}
											</Text>
											{/* {this.context.userData.action_types.indexOf("Edit") >=
                        0 ? (
                        <TouchableOpacity
                          style={{ padding: 3 }}
                          onPress={() => {
                             this.editSubTotal()
                          }}
                        >
                          <MaterialIcons
                            name="create"
                            size={16}
                            color={Colors.success}
                          />
                        </TouchableOpacity>
                      ) : null} */}
										</TouchableOpacity>
									</View>

									{this.state.showDiscount &&
										this.state.TotalDiscount > 0 ? (
										<>
											<View
												style={[
													styles.pricingItemContainer,
													{ marginTop: 5 },
												]}
											>
												<View
													style={{
														flexDirection: "row",
														alignItems: "baseline",
													}}
												>
													<Text
														style={[
															styles.inputLable,
															{ color: "red" },
														]}
													>
														Discount {""}
													</Text>
													{this.state.TotalDiscount_per >= 1 ? (
														<Text
															style={[
																styles.inputLable,
																{ fontSize: 11, color: "red" },
															]}
														>
															(
															{parseFloat(
																this.state.TotalDiscount_per
															).toFixed(2)}
															%)
														</Text>
													) : (
														<Text
															style={[
																styles.inputLable,
																{ fontSize: 11, color: "red" },
															]}
														>
															(
															{parseFloat(
																this.state.TotalDiscount_per
															).toFixed(2)}
															%)
														</Text>
													)}
												</View>
												<View
													style={{
														flexDirection: "row",
														justifyContent: "center",
													}}
												>
													<Text
														style={{
															color: "red",
															// opacity: Colors.opacity6,
															marginRight: 3,
														}}
													>
														{"-"}
													</Text>
													<Text
														style={{
															fontSize: 9,
															paddingTop:
																Platform.OS == "ios"
																	? 1.1
																	: 2.2,
															color: "red",
															// opacity: Colors.opacity6,
														}}
													>
														{"₹"}
													</Text>
													<Text
														style={{
															color: "red",
															// opacity: Colors.opacity6,
															marginRight: 3,
														}}
													>
														{Math.round(this.state.TotalDiscount)}
													</Text>
												</View>
											</View>

											{/* <View
                        style={[styles.pricingItemContainer, { marginTop: 5 }]}
                      >
                        <View>
                          <Text style={[styles.inputLable]}>
                            Discount percentage(%)
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: Colors.black,
                              opacity: Colors.opacity6,
                              marginRight: 22,
                            }}
                          >
                            {parseFloat(this.state.TotalDiscount_per).toFixed(
                              2
                            )}
                          </Text>
                        </View>
                      </View> */}
										</>
									) : null}

									<View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
										<Text style={[styles.inputLable]}>Transport Charges</Text>
										<TouchableOpacity
											style={{
												flexDirection: "row", justifyContent: "center",
												// paddingRight: 22,
												paddingRight: 3,
											}}
											onLongPress={() => {
												{
													this.context.userData.action_types.indexOf("Edit") >=
														0 ?
														this.editTransport() : null
												}
											}}

										>
											<Text
												style={{
													fontSize: 9,
													paddingTop: Platform.OS == "ios" ? 1.1 : 2.2,
													color: Colors.textColor,
												}}
											>
												{"₹"}
											</Text>
											<>
												{this.state.TotalTransportCharge > 0 ? (
													<Text
														style={{
															color: Colors.textColor,
														}}
													>
														{Math.trunc(this.state.TotalTransportCharge)}
													</Text>
												) : (
													<Text
														style={{
															color: Colors.textColor,
														}}
													>
														{"00"}
													</Text>
												)}
											</>
											{/* {this.context.userData.action_types.indexOf("Edit") >=
                        0  ? (
                        <TouchableOpacity
                          style={{ padding: 3 }}
                          onPress={() => {
                            this.editTransport();
                          }}
                        >
                          <MaterialIcons
                            name="create"
                            size={16}
                            color={Colors.success}
                          />
                        </TouchableOpacity>
                      ) : null} */}
										</TouchableOpacity>
									</View>

									{this.state.applyGST ? (
										<View
											style={[
												styles.pricingItemContainer,
												{ marginTop: 5 },
											]}
										>
											<Text style={[styles.inputLable]}>GST </Text>
											<View style={{ flexDirection: "row" }}>
												<View
													style={{
														flexDirection: "row",
														justifyContent: "space-evenly",
														// paddingRight: 22,
														paddingRight: 3,
													}}
												>
													{/* <PressableButton
                      btnTextStyle={{ fontSize: 15 }}
                      btnStyle={{ height: 40, width: "30%" ,}}
                      text={"Yes"}
                      onPress={() => this.saveGSTModal("yes")}
                    /> */}

													<Checkbox
														value={this.state.showGST}
														onValueChange={(v) => {
															this.saveGSTModal(v);
														}}
													/>
													{/* <PressableButton
                      btnTextStyle={{ fontSize: 15 }}
                      btnStyle={{ height: 40, width: "30%" ,}}
                      text={"No"}
                      onPress={() => this.saveGSTModal("no")}
                    /> */}
												</View>
												{/* {this.state.showGST === "" ? (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 9,
                              paddingTop: Platform.OS == "ios" ? 1.1 : 2.2,
                              color: Colors.black,
                              opacity: Colors.opacity6,
                            }}
                          >
                            {"₹"}
                          </Text>
                          <Text style={{ color: Colors.black, opacity: Colors.opacity6 }}>
                            {"00"}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        {this.state.showGST ? (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 9,
                                paddingTop: Platform.OS == "ios" ? 1.1 : 2.2,
                                color: Colors.black,
                                opacity: Colors.opacity6,
                              }}
                            >
                              {"₹"}
                            </Text>
                            <Text style={{ color: Colors.black, opacity: Colors.opacity6 }}>
                              {Math.round(this.state.TotalGST)}
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={{ color: Colors.black, opacity: Colors.opacity6 }}>
                              {"NAN"}
                            </Text>
                          </View>
                        )}
                      </>
                    )} */}
												{/* 
                    {this.context.userData.action_types.indexOf("Edit") >= 0 ? (
                      <TouchableOpacity
                        style={{ padding: 3 }}
                        onPress={() => this.editGST()}
                      >
                        <MaterialIcons
                          name="create"
                          size={16}
                          color={Colors.success}
                        />
                      </TouchableOpacity>
                    ) : null} */}
											</View>
										</View>
									) : null}
									{this.state.showGST ? (
										<TouchableOpacity
											style={[styles.pricingItemContainer, { marginTop: 5 }]}
											onPress={this.HideGSTModal}
											activeOpacity={1}
										>
											<Text style={[styles.inputLable]}>GST amount</Text>
											<View
												style={{
													flexDirection: "row",
													justifyContent: "center",
													// paddingRight: 22,
													paddingRight: 3,
												}}
											>
												{/* //  ( */}
												<View
													style={{
														flexDirection: "row",
														justifyContent: "center",
													}}
												>
													<Text
														style={{
															fontSize: 9,
															paddingTop: Platform.OS == "ios" ? 1.1 : 2.2,
															color: Colors.textColor,
														}}
													>
														{"₹"}
													</Text>
													<Text
														style={{
															color: Colors.textColor,
														}}
													>
														{Math.round(this.state.TotalGST)}
													</Text>
												</View>
												{/* // ) 
                        // : (
                        //   <View
                        //     style={{
                        //       flexDirection: "row",
                        //       justifyContent: "center",
                        //     }}
                        //   >
                        //     <Text style={{ color: Colors.black, opacity: Colors.opacity6 }}>
                        //       {"NAN"}
                        //     </Text>
                        //   </View>
                        // )} */}
											</View>
										</TouchableOpacity>
									) : null}

									{/* {!this.state.extraCharge ? ( */}
									<View
										style={[
											styles.pricingItemContainer,
											{ marginTop: 5 },
										]}
									>
										<Text style={[styles.inputLable]}>
											Extra Charge{" "}
										</Text>
										<View style={{ flexDirection: "row" }}>
											{!this.state.extraCharge ? (
												<TouchableOpacity
													style={{
														flexDirection: "row",
														justifyContent: "space-evenly",
														// paddingRight: 19,
													}}
													onPress={this.showExtraCharge}
												>
													{/* <Checkbox
                            value={this.state.showGST}
                            onValueChange={(v) => this.HideExtraCharge(v)}
                          /> */}
													<MaterialCommunityIcons
														name="checkbox-blank-outline"
														size={27}
														color={Colors.textColor}
													/>
												</TouchableOpacity>
											) : (
												<TouchableOpacity
													style={{
														flexDirection: "row",
														justifyContent: "space-evenly",
														// paddingRight: 19,
													}}
													onPress={this.HideExtraCharge}
												>
													{/* <Checkbox
                            value={this.state.showGST}
                            onValueChange={(v) => this.HideExtraCharge(v)}
                          /> */}
													<MaterialCommunityIcons
														name="checkbox-marked"
														size={27}
														color={Colors.textColor}
													/>
												</TouchableOpacity>
											)}
										</View>
									</View>
									{/* ) : null} */}

									{this.state.extraCharge ? (
										<View
										//  onPress={this.HideExtraCharge}
										>
											<View
												style={[
													styles.pricingItemContainer,
													{ marginTop: 5 },
												]}
											>
												<Text style={[styles.inputLable]}>
													Charge
												</Text>
												<View
													style={{
														flexDirection: "row",
														justifyContent: "center",
														width: "40%",
														// paddingRight: 19,
													}}
												>
													<TextInput
														value={this.state.charge}
														autoCompleteType="off"
														autoCapitalize="words"
														style={[styles.ChargeInput]}
														placeholderStyle={[styles.inputLable]}
														keyboardType="numeric"
														onChangeText={(data) =>
															this.extraChargeAmount(data)
														}
													/>
												</View>
											</View>
											<View
												style={[{ marginTop: 5, width: "100%" }]}
											>
												<Text
													style={[
														styles.inputLable,
														{ alignItems: "flex-start" },
													]}
												>
													Comment
												</Text>
												<View
													style={{
														flexDirection: "row",
														justifyContent: "center",
														marginTop: 5,
													}}
												>
													<TextInput
														value={this.state.comment}
														autoCompleteType="off"
														autoCapitalize="words"
														style={[
															styles.ChargeInput,
															{ textAlign: "left" },
														]}
														placeholderStyle={[styles.inputLable]}
														onChangeText={(data) =>
															this.setState({ comment: data })
														}
													/>
												</View>
											</View>
										</View>
									) : null}

									<View
										style={[
											styles.pricingItemContainer,
											{ marginTop: 5 },
										]}
									>
										<Text style={[styles.inputLable]}>
											Payment Method
										</Text>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "center",
												//  paddingRight: 19,
											}}
										>
											<Text
												style={{
													color: Colors.textColor,
												}}
											>
												{this.state.payment}
											</Text>
										</View>
									</View>

									<View
										style={[
											styles.pricingItemContainer,
											{ marginTop: 5 },
										]}
									>
										<Text
											style={[
												styles.inputLable,
												{ fontWeight: "bold" },
											]}
										>
											Net Amount
										</Text>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "center",
											}}
										>
											<Text
												style={{
													fontSize: 9,
													paddingTop:
														Platform.OS == "ios" ? 1.1 : 2.2,
													color: Colors.textColor,
												}}
											>
												{"₹"}
											</Text>
											<Text
												style={{
													color: Colors.textColor,
													// marginRight: 20,
												}}
											>
												{Math.round(this.state.TotalAmount)}
											</Text>
										</View>
									</View>
								</View>
								{/* <View style={[styles.pricingItemContainer, { marginTop: 5 }]}>
				<Text style={[styles.inputLable, {fontSize:10}]}>* 18 % GST Applied</Text>
			  </View> */}
							</View>
							{this.state.order_data.order_status == "declined" ||
								this.state.order_data.order_status == "closed" ? null : (
								<>
									{this.state.order_data.order_status == "pending" ||
										this.state.order_data.order_status ==
										"request_confirmation" ? (
										<View
											style={{
												display: "flex",
												flexDirection: "row",
												justifyContent: "space-around",
												marginVertical:
													Platform.OS == "ios" ? 15 : 10,
											}}
										>
											<PressableButton
												btnTextStyle={{ fontSize: 18 }}
												btnStyle={{ height: 50, width: "45%" }}
												text={"Confirm"}
												onPress={() =>
													this.ConfirmOrder(this.state.order_data)
												}
											/>
											{this.state.checkUpdation == 1 ? (
												<PressableButton
													btnTextStyle={{ fontSize: 18 }}
													btnStyle={{ height: 50, width: "45%" }}
													text={"ReConfirm"}
													onPress={() => {
														this.ReviewedOrder(
															this.state.order_data
														);
													}}
												/>
											) : null}
										</View>
									) : (
										<>
											{this.state.order_data.order_status ==
												"review" ? (
												<View
													style={{
														marginTop: 20,
														marginBottom: 5,
													}}
												>
													<PressableButton
														btnTextStyle={{ fontSize: 18 }}
														btnStyle={{
															height: 50,
															width: "50%",
														}}
														text={"Confirm"}
														// onPress={() => this.updateDetails()}
														onPress={() =>
															this.ConfirmOrder(
																this.state.order_data
															)
														}
													/>
													{/* <TouchableOpacity style={styles.submitBtn} onPress={!this.state.loading ? this.updateDetails : ()=>{}}>
						{this.state.loading ? (
							<ActivityIndicator color={'#fff'} />
						) : (<Text style={{ fontSize: 18, color: Colors.white }}>Save</Text>)}
					</TouchableOpacity> */}
												</View>
											) : (
												<View
													style={{
														marginTop: 20,
														marginBottom: 5,
													}}
												>
													<PressableButton
														btnTextStyle={{ fontSize: 18 }}
														btnStyle={{
															height: 50,
															width: "50%",
														}}
														text={"Save"}
														// onPress={() => this.updateDetails()}
														onPress={() =>
															this.ReviewedOrder(
																this.state.order_data
															)
														}
													/>
													{/* <TouchableOpacity style={styles.submitBtn} onPress={!this.state.loading ? this.updateDetails : ()=>{}}>
						{this.state.loading ? (
							<ActivityIndicator color={'#fff'} />
						) : (<Text style={{ fontSize: 18, color: Colors.white }}>Save</Text>)}
					</TouchableOpacity> */}
												</View>
											)}
										</>
									)}
								</>
							)}
						</ScrollView>

						<Modal
							animationType="fade"
							transparent={false}
							visible={this.state.isModalOpen}
							onRequestClose={this.cloesModal}
							style={{ backgroundColor: "white" }}
						>
							<SafeAreaView style={styles.modalOverlay}>
								<View style={styles.itemModalContainer}>
									<View style={styles.itemModalHeader}>
										<TouchableOpacity
											activeOpacity={1}
											style={styles.headerBackBtnContainer}
											onPress={this.cloesModal}
										>
											<Ionicons
												name="arrow-back"
												size={26}
												color={Colors.white}
											/>
										</TouchableOpacity>
										<View style={styles.headerTitleContainer}>
											<Text
												style={{
													fontSize: 20,
													color: Colors.white,
												}}
											>
												Discount
											</Text>
										</View>
									</View>
									<View
										style={[
											styles.rowContainer,
											{ flexDirection: "column", marginBottom: 0 },
										]}
									>
										{/* <InputDropdown
                      label={"Discount Type:"}
                      value={this.state.discount}
                      isOpen={this.state.isDiscountsMenuOpen}
                      items={this.state.DiscountType}
                      openAction={this.toggleDiscountsMenu}
                      closeAction={this.toggleDiscountsMenu}
                      setValue={this.setDiscountsData}
                      labelStyle={styles.inputLable}
                      textFieldStyle={styles.AmountInput}
                      placeholder={this.state.discount}
                    /> */}
										<Text
											style={[styles.inputLable, { fontSize: 16 }]}
										>
											{"Discount Type:"}
										</Text>
										{/* {this.state.DiscountType.map((item)=>{
                      return(
                        <View key={item.id} style={{flexDirection:'row',justifyContent:'space-between'}}>
                          <Text style={styles.inputLable}>{item.name}</Text> */}
										{/* <Checkbox
                          value={this.state.discountBox}
                          onValueChange={()=>this.setDiscountsData(item.name)}
                        /> */}
										<RadioForm
											radio_props={this.state.DiscountType}
											initial={this.state.SelectedRadioButton}
											animation={false}
											formHorizontal={true}
											buttonColor={Colors.primary}
											selectedButtonColor={Colors.primary}
											labelColor={Colors.textColor}
											selectedlabelColor={Colors.textColor}
											style={{
												justifyContent: "space-between",
												paddingHorizontal: 10,
											}}
											onPress={(value) => {
												this.setDiscountsData(value);
											}}
										/>
										{/* </View> */}
										{/* )
                    })} */}
									</View>
									<View>
										{this.state.discount == "Lumpsum" ? (
											<View
												style={[
													styles.rowContainer,
													{
														flexDirection: "column",
														marginBottom: 0,
													},
												]}
											>
												<Text style={[styles.inputLable]}>
													Discount Amount
												</Text>
												<TextInput
													value={this.state.TotalDiscount}
													autoCompleteType="off"
													autoCapitalize="words"
													style={[styles.AmountInput]}
													placeholderStyle={[styles.inputLable]}
													keyboardType="numeric"
													onChangeText={(data) =>
														this.lumsumData(data)
													}
												/>
											</View>
										) : (
											<>
												{this.state.discount == "Percentage" ? (
													<View
														style={[
															styles.rowContainer,
															{
																flexDirection: "column",
																marginBottom: 0,
															},
														]}
													>
														<Text style={[styles.inputLable]}>
															Discount Percentage
														</Text>
														<TextInput
															value={
																this.state.discountPercentage
															}
															autoCompleteType="off"
															autoCapitalize="words"
															keyboardType="numeric"
															style={[styles.AmountInput]}
															onChangeText={(data) =>
																this.PercentageData(data)
															}
														/>
													</View>
												) : (
													<>
														{this.state.discount ==
															"Item Wise" ? (
															<ScrollView
																style={[
																	styles.rowContainer,
																	{
																		flexDirection: "column",
																		marginBottom: 0,
																	},
																]}
															>
																{this.state.GamesData.length >
																	0 ? (
																	<>
																		{this.state.GamesData?.map(
																			(item) => {
																				return (
																					<ItemDiscount
																						data={item}
																						onChange={(
																							val
																						) =>
																							this.setItemDiscount(
																								item,
																								val
																							)
																						}
																					/>
																				);
																			}
																		)}
																	</>
																) : null}
															</ScrollView>
														) : null}
													</>
												)}
											</>
										)}
									</View>
									<PressableButton
										btnTextStyle={{ fontSize: 15 }}
										btnStyle={{
											height: 40,
											width: "50%",
											margin: 10,
										}}
										text={"Save"}
										onPress={this.saveModal}
									/>
								</View>
							</SafeAreaView>
						</Modal>

						<Modal
							animationType="fade"
							transparent={false}
							visible={this.state.isTransportModalOpen}
							onRequestClose={this.cloesTransportModal}
							style={{ backgroundColor: "white" }}
						>
							<SafeAreaView style={styles.modalOverlay}>
								<View style={styles.itemModalContainer}>
									<View style={styles.itemModalHeader}>
										<TouchableOpacity
											activeOpacity={1}
											style={styles.headerBackBtnContainer}
											onPress={this.cloesTransportModal}
										>
											<Ionicons
												name="arrow-back"
												size={26}
												color={Colors.white}
											/>
										</TouchableOpacity>
										<View style={styles.headerTitleContainer}>
											<Text
												style={{
													fontSize: 20,
													color: Colors.white,
												}}
											>
												Transport Charges
											</Text>
										</View>
									</View>
									<View
										style={[
											styles.rowContainer,
											{ flexDirection: "column", marginBottom: 0 },
										]}
									>
										<Text style={[styles.inputLable]}>
											{" "}
											Transport Charges
										</Text>
										<TextInput
											value={this.state.TotalTransportCharge}
											autoCompleteType="off"
											autoCapitalize="words"
											style={[styles.AmountInput]}
											placeholderStyle={[styles.inputLable]}
											keyboardType="numeric"
											onChangeText={(data) =>
												this.transportCharge(data)
											}
										/>
									</View>
									<PressableButton
										btnTextStyle={{ fontSize: 15 }}
										btnStyle={{
											height: 40,
											width: "50%",
											margin: 10,
										}}
										text={"Save"}
										onPress={this.saveTransportModal}
									/>
								</View>
							</SafeAreaView>
						</Modal>
						<Modal
							animationType="fade"
							transparent={false}
							visible={this.state.isGSTModalOpen}
							onRequestClose={this.cloesGSTModal}
							style={{ backgroundColor: "white" }}
						>
							<SafeAreaView style={styles.modalOverlay}>
								<View style={styles.itemModalContainer}>
									<View style={styles.itemModalHeader}>
										<TouchableOpacity
											activeOpacity={1}
											style={styles.headerBackBtnContainer}
											onPress={this.cloesGSTModal}
										>
											<Ionicons
												name="arrow-back"
												size={26}
												color={Colors.white}
											/>
										</TouchableOpacity>
										<View style={styles.headerTitleContainer}>
											<Text
												style={{
													fontSize: 20,
													color: Colors.white,
												}}
											>
												GST
											</Text>
										</View>
									</View>
									<View
										style={[
											styles.rowContainer,
											{
												flexDirection: "column",
												marginBottom: 0,
												justifyContent: "center",
											},
										]}
									>
										<Text
											style={[
												styles.inputLable,
												{ textAlign: "center" },
											]}
										>
											Are you want to apply GST?
										</Text>
									</View>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-evenly",
										}}
									>
										<PressableButton
											btnTextStyle={{ fontSize: 15 }}
											btnStyle={{
												height: 40,
												width: "30%",
												margin: 10,
											}}
											text={"Yes"}
											onPress={() => this.saveGSTModal("yes")}
										/>
										<PressableButton
											btnTextStyle={{ fontSize: 15 }}
											btnStyle={{
												height: 40,
												width: "30%",
												margin: 10,
											}}
											text={"No"}
											onPress={() => this.saveGSTModal("no")}
										/>
									</View>
								</View>
							</SafeAreaView>
						</Modal>

						<Modal
							animationType="fade"
							transparent={true}
							visible={this.state.isModalOpenCancel}
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
											<Ionicons
												name="arrow-back"
												size={26}
												color={Colors.white}
											/>
										</TouchableOpacity>
										<View style={styles.headerTitleContainer}>
											<Text
												style={{
													fontSize: 20,
													color: Colors.white,
												}}
											>
												Reason of cancel
											</Text>
										</View>
									</View>

									<View style={styles.itemModalBody}>
										<View style={styles.form}>
											<ScrollView
												showsVerticalScrollIndicator={false}
											>
												<View style={styles.inputContainer}>
													<Text
														style={[
															styles.inputLable,
															{ fontWeight: "bold" },
														]}
													>
														Give Reason Of Cancel:
													</Text>
													{this.state.modal_type == "edt" && (
														<TextInput
															value={this.state.reason_of_cancel}
															autoCompleteType="off"
															autoCapitalize="words"
															style={styles.textInput}
															onChangeText={(reason_of_cancel) =>
																this.setState({
																	reason_of_cancel,
																})
															}
															multiline={true}
														/>
													)}

													{this.state.modal_type == "det" && (
														<Text style={styles.textInput}>
															{this.state.reason_of_cancel}
														</Text>
													)}
												</View>

												{this.state.modal_type == "edt" && (
													<TouchableOpacity
														style={[
															styles.submitBtn,
															{ backgroundColor: Colors.danger },
														]}
														onPress={() => this.CancelOrder()}
													>
														<Text
															style={{
																fontSize: 18,
																color: Colors.white,
															}}
														>
															Cancel
														</Text>
													</TouchableOpacity>
												)}
											</ScrollView>
										</View>
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
							confirmButtonColor={Colors.primary}
							onCancelPressed={() => {
								this.hideAlert();
							}}
							onConfirmPressed={() => {
								this.hideAlert();
							}}
						/>
					</KeyboardAwareScrollView>
				)}
			</SafeAreaView>
		);
	};
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
		// backgroundColor: "transparent",
		backgroundColor: "#f5f5f5",
	},

	rowContainer: {
		paddingHorizontal: 8,
		backgroundColor: Colors.white,
		borderRadius: 4,
		margin: 10,
		marginHorizontal: 0,
		marginVertical: 5,
	},
	row: {
		marginTop: 0,
		flexDirection: "row",
		marginBottom: 0,
		borderBottomWidth: 0.6,
		borderBottomColor: "#cfcfcf",
	},
	rowlast: {
		marginTop: 0,
		flexDirection: "row",
		marginBottom: 0,

		// borderBottomWidth: 1.5,
		// borderBottomColor: '#cfcfcf'
	},
	rowLeft: {
		width: "47%",
		backgroundColor: "#fff",
		paddingLeft: 0,
		paddingVertical: 10,
		justifyContent: "center",
		marginTop: 0,
	},
	rowRight: {
		flexDirection: "row",
		width: "53%",
		marginLeft: 0,
		backgroundColor: "#fff",
		marginTop: 0,
		// justifyContent: 'space-evenly',
		paddingBottom: 8,
	},

	activeTab: {
		backgroundColor: Colors.primary,
	},

	activeText: {
		fontWeight: "bold",
		color: "white",
	},
	inActiveText: {
		color: "silver",
		// opacity: Colors.opacity8,
	},
	inputLable: {
		fontSize: 14,
		color: Colors.textColor,
		marginBottom: 0,
		// opacity: Colors.opacity8,
	},
	form: {
		flex: 1,
		padding: 8,
		// backgroundColor: "#f5f5f5",
		backgroundColor: "#f5f5f5",
		marginBottom: 8

	},
	topBtnContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-evenly",
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
	// inputLable: {
	// 	fontSize: 16,
	// 	color: Colors.grey,
	// 	marginBottom: 10,
	// 	opacity: Colors.opacity8,
	// },
	textInput: {
		fontSize: 14,
		width: "100%",
		borderWidth: 0,
		// borderRadius: 4,
		borderColor: "#fff",
		backgroundColor: "#fff",
		marginBottom: 0,
		color: Colors.textColor,
	},
	AmountInput: {
		fontSize: 14,
		color: Colors.textColor,
		marginBottom: 0,
		textAlign: "left",
		borderWidth: 1,
		borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		padding: 9,
		width: "100%",
	},
	ChargeInput: {
		height: 35,
		fontSize: 14,
		color: Colors.textColor,
		marginBottom: 0,
		borderWidth: 1,
		borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		padding: 9,
		width: "100%",
		textAlign: 'right'
	},
	submitBtn: {
		marginTop: 15,
		marginLeft: "30%",
		height: 45,
		width: "40%",
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
	},

	desc: {
		fontSize: 14,
		color: Colors.textColor,
		marginBottom: 3,
		fontWeight: "normal",

	},

	listRow: {
		borderBottomColor: "#eee",
		borderBottomWidth: 1,
		paddingHorizontal: 5,
		paddingVertical: 5,
	},

	titleText: {
		fontSize: 14,
		fontWeight: "bold",
		color: Colors.textColor,
		marginBottom: 2,
	},
	divider: {
		width: "2%",
		borderRightWidth: 0.3,
		alignSelf: "center",
		height: 20,
		borderLeftColor: "#444",

	},
	pricingItemContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
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
	momentStyle: {
		fontSize: 13,
		color: Colors.textColor,
		alignSelf: "center",
		marginVertical: 2,
		justifyContent: "center",
	},
});
