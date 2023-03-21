import Configs,{ToFormData} from "../config/Configs";

export const VehicleList = async (event_id) => {
	let url = Configs.BASE_URL + "admin/vehicle/list?event_id="+event_id;
	let response = await fetch(url);
	return await response.json();
};

export const AddVehicle = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/vehicle/add_vehicle";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdateVehicle = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/vehicle/update_vehicle";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeleteVehicle = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/vehicle/delete_vehicle";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};