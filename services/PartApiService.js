import Configs,{ToFormData} from "../config/Configs";

export const PartList = async () => {
	let url = Configs.BASE_URL + "admin/part/list"
	let response = await fetch(url);
	return await response.json();
};

export const AddPart = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/part/add_part";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	// console.log('......await response.text()....................',await response.text())
	// return
	return await response.json();
};

export const UpdatePart = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/part/update_part";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeletePart = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/part/delete_part";

	
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};