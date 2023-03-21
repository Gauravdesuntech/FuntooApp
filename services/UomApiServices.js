import Configs,{ToFormData} from "../config/Configs";

export const UOMList = async () => {
	let url = Configs.BASE_URL + "admin/uom/list"
	let response = await fetch(url);
	return await response.json();
};

export const AddUOM = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/uom/add_uom";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdateUOM = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/uom/update_uom";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const DeleteUOM = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/uom/delete_uom";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};