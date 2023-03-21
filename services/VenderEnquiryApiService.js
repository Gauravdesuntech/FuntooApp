import Configs,{ToFormData, BuildSeachParams} from "../config/Configs";

export const VenderEnquiryList = async (params) => {
	const url = Configs.BASE_URL + `admin/VenderEnquiry/list?${BuildSeachParams(params)}`;
	const response = await fetch(url);
	return await response.json();
};

export const AddVenderEnquiry = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/VenderEnquiry/create";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestObj),
	};

	let response = await fetch(url, requestOptions);
	
	return await response.json();
};

export const UpdateVenderEnquiry = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/VenderEnquiry/update";

	let requestOptions = {
		method: "POST",
		headers: {
      		'Content-Type': 'application/json',
		},
		body: JSON.stringify(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeleteVenderEnquiry = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/VenderEnquiry/delete";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};