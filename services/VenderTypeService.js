import Configs,{ToFormData} from "../config/Configs";

export const VenderTypeList = async () => {
	let url = Configs.BASE_URL + "admin/venderType/list"
	let response = await fetch(url);
	return await response.json();
};

export const CreateVenderType = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/venderType/create";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdateVenderType = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/venderType/update";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeleteVenderType = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/venderType/delete";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};