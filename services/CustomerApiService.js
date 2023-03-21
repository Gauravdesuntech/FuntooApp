import Configs,{ToFormData} from "../config/Configs";

export const UpdateGstNumber = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/Customer/update_gst_number";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const updateTokenData = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/user/updateToken";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UnSetDeviceToken = async (requestObj) => {
	let url = Configs.BASE_URL + "user/Customer/unset_device_token";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};