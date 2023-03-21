import Configs,{ToFormData} from "../config/Configs";

export const PriorityList = async () => {
	let url = Configs.BASE_URL + "admin/Priority/list"
	let response = await fetch(url);
	return await response.json();
};

export const CreatePriority = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/Priority/create";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdatePriority = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/Priority/update";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeletePriority = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/Priority/delete";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	// console.log("url>>>>>>>>>>>",url);
	// console.log("Response>>>>>>>>",await response.text());
	// return
	return await response.json();
};