import Configs,{ToFormData, BuildSeachParams} from "../config/Configs";

export const VenderList = async () => {
	let url = Configs.BASE_URL + "admin/vender/list"
	console.log(url)
	let response = await fetch(url);
	// console.log(await response.text())
	return await response.json();
};

export const AddVender = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/vender/add_vender";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdateVender = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/vender/update_vender";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeleteVender = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/vender/delete_vender";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const GetVenderOrders = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/vender/get_orders?${ BuildSeachParams(queryParams) }`;
	let response = await fetch(url);

	return await response.json();
}

export const GetVenderOrderDetails = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/vender/get_order_details?${ BuildSeachParams(queryParams) }`;
	let response = await fetch(url);

	return await response.json();
}

export const Edit_order_vendor_volunteers = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/vender/edit_order_vendor_volunteers";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};
