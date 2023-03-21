import Configs,{ToFormData} from "../config/Configs";

export const TemplateList = async () => {
	let url = Configs.BASE_URL + "admin/template/list"
	let response = await fetch(url);
	return await response.json();
};

export const AddTemplate = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/template/add_template";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdateTemplate = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/template/update_template";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeleteTemplate = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/template/delete_template";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};