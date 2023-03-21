import * as mime from "react-native-mime-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import {View,Text} from 'react-native';
import Colors from "../config/colors";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import * as Permissions from "expo-permissions";


const FUNTOO_DEVICE_STORAGE_KEY = "@funtoo_admin";

export const getFileData = (obj = {}) => {
	let uri = obj.uri;

	let arr = uri.split("/");
	let fileName = arr[arr.length - 1];

	return {
		uri: uri,
		name: fileName,
		type: mime.lookup(fileName),
	};
};

export const getpdfData = (pdf) => {
	let uri = pdf;

	let arr = uri.split("/");
	let fileName = arr[arr.length - 1];

	return {
		uri: uri,
		name: fileName,
		type: mime.lookup(fileName),
	};
};

export const getFormattedDate = (dateStr, formatType = "YYYY-MM-DD") => {
	if(!dateStr){
		return null;
	}
	var d = new Date(dateStr);

	//prepare day
	let day = d.getDate();
	day = day < 10 ? "0" + day : day;

	//prepare month
	let month = d.getMonth() + 1;
	month = month < 10 ? "0" + month : month;

	//prepare year
	let year = d.getFullYear();

	let date = undefined;
	switch (formatType) {
		case "DD/MM/YYYY":
			date = day + "/" + month + "/" + year;
			break;
		default:
			// date = year + "-" + month + "-" + day;
			date = day + "-" + month + "-" + year;
	}

	return date;
};

export const renderDate = (date) => {
	if (!date) {
		return "";
	}
	let ab = "th";
	let day = moment(date, "YYYY-MM-DD").format("D");
	if (day == 1) {
		ab = "st";
	}
	if (day == 2) {
		ad = "nd";
	}
	let month = moment(date, "YYYY-MM-DD").format("MMM");
	let year = moment(date, "YYYY-MM-DD").format("YY");
	let day_name = moment(date, "YYYY-MM-DD").format("dddd");
	return `${day}${ab} - ${month} - ${year} (${day_name})`;
}

export const renderTime = (time) => {
	if (!time) {
		return "";
	}
	return  moment(time, "HH:mm").format("hh:mm A");
}

export const isMobile = (no) => {
	let regx = /^\d{10}$/;
	return regx.test(no);
};


export const isEmail = (email) => {
	let regx =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return regx.test(email);
};

export const isNumeric = (n) => {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

export const readUserData = async () => {
	try {
		let rawData = await AsyncStorage.getItem(FUNTOO_DEVICE_STORAGE_KEY);
		return rawData !== null ? JSON.parse(rawData) : null;
	} catch (e) {
		throw new Error("failed to retrieve data from storage");
	}
};

export const writeUserData = async (value) => {
	try {
		await AsyncStorage.setItem(
			FUNTOO_DEVICE_STORAGE_KEY,
			JSON.stringify(value)
		);
	} catch (e) {
		throw new Error("failed to write data in storage");
	}
};

export const removeUserData = async () => {
	try {
		await AsyncStorage.removeItem(FUNTOO_DEVICE_STORAGE_KEY);
	} catch (e) {
		throw new Error("failed to remove data from storage");
	}
};

// export const showDateAsClientWant = (date) => {
// 	let m = moment(date);

// 	return m.format("Do - MMM - YY (ddd)");
// }

export const showDayAsClientWant = (date) => {
	let m = moment(date);
	return (
		<View>
			<Text style={{ color: Colors.textColor, fontSize: 14,}}>{`${m.format("Do")} ${m.format("MMM")} ${m.format("YY")}`}  </Text>
			<Text style={{ fontSize: 10, alignSelf: 'center', color: Colors.textColor, }}>{` (${m.format("ddd")}) `}</Text>
		</View>
	)
	// return m.format("D/MMM/YY (ddd)");
}
export const showDayAsdate = (date) => {
	let m = moment(date);
	return (
		<View style={{flexDirection:'row',alignItems:'baseline'}}>
			<Text style={{  fontSize: 14,margin:0}}>{`${m.format("Do")} ${m.format("MMM")} ${m.format("YY")} `}  </Text>
			<Text style={{ fontSize: 10,margin:0,left:-12,}}>{` (${m.format("ddd")}) `}</Text>
		</View>
	)
	// return m.format("D/MMM/YY (ddd)");
}

// export const showDateAsClientWant = (date) => {
// 	let m = moment(date);
// 	return (
// 		<Text style={{color: Colors.black, fontSize: 14, opacity: 0.6}}>{`${m.format("Do")} `}{`${m.format("MMM")} ${m.format("YY")}`}<Text style={{fontSize: 10}}>{` (${m.format("ddd")}) `}</Text>  </Text>
// 	)
// 	// return m.format("D/MMM/YY (ddd)");
// }

export const showDateAsWant = (date, customStyle={}) => {
	let m = moment(date);
	// console.log("util date........",date)
	return (
		<View >
		<Text style={{ color: Colors.textColor, fontSize: 13, marginBottom: 3,}}>{`${m.format("Do")} `}{`${m.format("MMM")} ${m.format("YY")}`}</Text>
		<Text  style={{ fontSize: 10, alignSelf: 'center', color: Colors.textColor,}}>{` (${m.format("ddd")}) `}</Text>  
		</View>
	)
}
export const showDateAsClientWant = (date, customStyle={}) => {
	let m = moment(date);
	// console.log("util date........",date)
	return (
		<Text style={[  customStyle ]}>{`${m.format("Do")} `}{`${m.format("MMM")} ${m.format("YY")}`}<Text style={{fontSize: 10}}>{` (${m.format("ddd")}) `}</Text>  </Text>
	)
}

export const showTimeAsWant = (time, customStyle={}) => {
	if (!time) {
		return "";
	}

	return (
		<Text style={[ customStyle ,{color:Colors.textColor,}]}>
			{ moment(time).format("hh:mm A") }
		</Text>
	)
}
export const showTimeAsClientWant = (time, customStyle={}) => {
	if (!time) {
		return "";
	}

	return (
		<Text style={[ customStyle ]}>
			{ moment(time).format("hh:mm A") }
		</Text>
	)
}

export function formatDateTimetoMysqlDateTimeFormat(dateTime) {
	if(!dateTime) {
		return null;
	}

	let d = dateTime;
	if (!(dateTime instanceof Date)) {
		d = new Date(dateTime);
	} 

	// mysql date time format YYYY-MM-DD hh:mm:ss

	//prepare day
	let day = d.getDate();
	day = day < 10 ? "0" + day : day;

	//prepare month
	let month = d.getMonth() + 1;
	month = month < 10 ? "0" + month : month;

	// prepare hour
	let h  = d.getHours();
	h = h < 10 ? '0' + h : h;

	// prepare mininutes
	let m = d.getMinutes();
	m = m < 10 ? '0' + m : m;

	let s = d.getSeconds();
	s = s < 10 ? '0' + s : s;

	return `${d.getFullYear()}-${month}-${day} ${h}:${m}:${s}`;
}

export const getDeviceToken = async () => {
	let token = null;

	if (Device.isDevice) {
		const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);
		let finalStatus = existingStatus;

		if (existingStatus !== "granted") {
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}
		if (finalStatus === "granted") {
			token = await Notifications.getExpoPushTokenAsync({experienceId: '@desuntechnology/FuntooAdmin'});
		} else {
			console.log("Failed to get push token for push notification!");
		}
	} else {
		console.log("Must use physical device for Push Notifications");
	}

	if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	return token;
};
export const getRequestUrl = (url, requestObj = {}) => {
	let params = [];

	for (const [key, value] of Object.entries(requestObj)) {
		params.push(key + "=" + value);
	}

	if (params.length > 0) {
		url += "/?" + params.join("&");
	}

	return url;
};
export const getPostRequestOptions = (requestObj = {}) => {
	let formdata = new FormData();
	for (const [key, value] of Object.entries(requestObj)) {
		formdata.append(key, value);
	}

	let requestOptions = {
		method: "POST",
		headers: { "Content-Type": "multipart/form-data" },
		body: formdata,
	};

	return requestOptions;
};