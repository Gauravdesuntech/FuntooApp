import Configs,{ToFormData} from "../config/Configs";

export const StorageAreaList = async () => {
	let url = Configs.BASE_URL + "admin/StorageArea/list"
	let response = await fetch(url);
	return await response.json();
};

export const AddStorageArea = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/StorageArea/add_storage_area";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdateStorageArea = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/StorageArea/update_storage_area";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeleteStorageArea = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/StorageArea/delete_storage_area";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};