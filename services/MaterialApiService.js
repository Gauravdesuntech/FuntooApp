import Configs,{ToFormData} from "../config/Configs";

export const MaterialList = async () => {
	let url = Configs.BASE_URL + "admin/material/list"
	let response = await fetch(url);
	return await response.json();
};

export const AddMaterial = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/material/add_material";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdateMaterial = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/material/update_material";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeleteMaterial = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/material/delete_material";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};