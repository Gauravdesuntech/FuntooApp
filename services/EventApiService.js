import Configs,{ToFormData} from "../config/Configs";


export const GetEventsByGroup = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/event/get_events_by_group";
	let requestOptions = {
		method: "POST",
	};

	if(requestObj){
		requestOptions.body=ToFormData(requestObj);
	}
	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const GetEventsBills = async () => {
	let url = Configs.BASE_URL + "admin/event/get_events_bills";
	let requestOptions = {
		method: "GET",
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const GetEventDetail = async (id) => {
	let url = Configs.BASE_URL + "admin/event/get_event_detail?id="+id;
	let requestOptions = {
		method: "GET",
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const EventChangeStatus = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/event/change_status";
	let requestOptions = {
		method: "POST",
		body:ToFormData(requestObj)
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const EventList = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/event/get_events";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const ProofList = async (event_id) => {
	let url = Configs.BASE_URL + "admin/event/proof_list?event_id="+event_id;
	let response = await fetch(url);
	return await response.json();
};

export const EventLoadingList = async (event_id) => {
	let url = Configs.BASE_URL + "admin/event/event_loading_list?event_id="+event_id;
	let response = await fetch(url);
	return await response.json();
};


export const EventLoadingPartList = async (event_id,game_id) => {
	let url = Configs.BASE_URL + `admin/event/event_loading_part_list?event_id=${event_id}&game_id=${game_id}`;
	let response = await fetch(url);
	return await response.json();
};


export const SubmitPartLoad = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/event/submit_part_load";

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


export const AddUpdateProofVolunteer = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/event/add_update_proof_volunteer";

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


export const AddUpdateProofSetUp = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/event/add_update_proof_set_up";

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


export const ChangeOrderConfirm = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/event/change_order_confirm";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const EventVolunteerList = async (event_id,game_id) => {
	let url = Configs.BASE_URL + `admin/EventVolunteer/list?event_id=${event_id}&game_id=${game_id}`;
	let response = await fetch(url);
	return await response.json();
};

export const CreateEventVolunteer = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/EventVolunteer/create";

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

export const UpdateEventVolunteer = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/EventVolunteer/update";

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

export const DeleteEventVolunteer = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/EventVolunteer/delete";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};



export const UpdateEventOrder = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/event/update_event_order";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const EventVolunteers = async (event_id) => {
	let url = Configs.BASE_URL + `admin/event/event_volunteers?event_id=${event_id}`;
	let response = await fetch(url);
	return await response.json();
};

export const EventTracking = async (order_id) => {
	let url = Configs.BASE_URL + `admin/event/event_tracking?order_id=${order_id}`;
	let response = await fetch(url);
	return await response.json();
};

export const EventVenders = async (event_id) => {
	let url = Configs.BASE_URL + `admin/EventVolunteer/event_venders?event_id=${event_id}`;
	let response = await fetch(url);
	return await response.json();
};