import Configs, {ToFormData, BuildSeachParams} from "../config/Configs";

export const VolunteerList = async (event_id) => {
	let url = Configs.BASE_URL + "admin/volunteer/list?event_id="+event_id;
	let response = await fetch(url);
	return await response.json();
};

export const AddVolunteer = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/volunteer/add_volunteer";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdateVolunteer = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/volunteer/update_volunteer";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeleteVolunteer = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/volunteer/delete_volunteer";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const GetTotalVolunteerRequiredForEvent = async (obj) => {
	let url = `${Configs.BASE_URL}admin/volunteer/get_total_volunteers?${BuildSeachParams(obj)}`;
	let response = await fetch(url);

	return await response.json();
}