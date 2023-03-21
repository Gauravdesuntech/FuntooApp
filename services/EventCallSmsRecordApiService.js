import Configs,{ToFormData} from "../config/Configs";

export const RecordList = async (event_id,category) => {
	let url = Configs.BASE_URL + `admin/EventCallSmsRecord/list?event_id=${event_id}&category=${category}`;
	let response = await fetch(url);
	return await response.json();
};

export const getAllCommunications = async (event_id) => {
	let url = Configs.BASE_URL + `admin/EventCallSmsRecord/get_all_communications?event_id=${event_id}`;
	let response = await fetch(url);

	return await response.json();
};

export const AddRecord = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/EventCallSmsRecord/create";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdateRecord = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/EventCallSmsRecord/update";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeleteRecord = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/EventCallSmsRecord/delete";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};
