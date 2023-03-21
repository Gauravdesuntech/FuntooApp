import Configs,{ToFormData, BuildSeachParams} from "../config/Configs";

export async function GetVehicleInfo(queryParams) {
    let url = `${Configs.BASE_URL}admin/VehicleInfo/get_vehicle_info?${BuildSeachParams(queryParams)}`;
    let response = await fetch(url);
    return await response.json();
}

export async function GetSingleVehicleInfo(id) {
    let url = Configs.BASE_URL + "admin/VehicleInfo/get_single_vehicle_info?id=" + id;
    let response = await fetch(url);

    return await response.json();
}

export async function AddVehicleInfo(data) {
    let url = Configs.BASE_URL + "admin/VehicleInfo/insert_vehicle_info";
    let requestOptions = {
		method: "POST",
		body: ToFormData(data),
	};

    
    let response = await fetch(url, requestOptions);

    return await response.json();
}

export async function UpdateVehicleInfo(data) {
    let url = Configs.BASE_URL + "admin/VehicleInfo/update_vehicle_info";
    
    let requestOptions = {
		method: "POST",
		body: ToFormData(data),
	};
    let response = await fetch(url, requestOptions);
    return await response.json();
}

export async function DeleteVehicleInfo(data) {
    let url = Configs.BASE_URL + "admin/VehicleInfo/delete_vehicle_info";
    let requestOptions = {
		method: "POST",
		body: ToFormData(data),
	};
    let response = await fetch(url, requestOptions);

    return await response.json();
}

export async function AddVehicleArrivalEntry(data) {
    let url = Configs.BASE_URL + "admin/VehicleInfo/insert_vehicle_arrival_info";
    let body = ToFormData(data);
    let requestOptions = {
		method: "POST",
        headers: {
			"Content-Type": "multipart/form-data",
		},
		body: body,
	};
    console.log('...... requestOptions.....', requestOptions);
    let response = await fetch(url, requestOptions);
    console.log('......await response.text().....',await response.text());
    return 
    await response.json();
}

export async function GetVehicleArrivalEntry(vehicle_info_id) {
    let url = Configs.BASE_URL + "admin/VehicleInfo/get_vehicle_arrival_info?vehicles_info_id=" + vehicle_info_id;
    let response = await fetch(url);

    return await response.json();
}

export async function AddVehicleUpwordsJourneyStart(data) {
    let url = Configs.BASE_URL + "admin/VehicleInfo/insert_vehicle_up_journey_start";
    let body = ToFormData(data);
    let requestOptions = {
		method: "POST",
        headers: {
			"Content-Type": "multipart/form-data",
		},
		body: body,
	};
    let response = await fetch(url, requestOptions);

    return await response.json();
}

export async function AddVehicleUpwordsJourneyEnd(data) {
    let url = Configs.BASE_URL + "admin/VehicleInfo/insert_vehicle_up_journey_end";
    let body = ToFormData(data);
    let requestOptions = {
		method: "POST",
        headers: {
			"Content-Type": "multipart/form-data",
		},
		body: body,
	};
    let response = await fetch(url, requestOptions);

    return await response.json();
}

export async function AddVehicleDownwardsJourneyStart(data) {
    let url = Configs.BASE_URL + "admin/VehicleInfo/insert_vehicle_down_journey_start";
    let body = ToFormData(data);
    let requestOptions = {
		method: "POST",
        headers: {
			"Content-Type": "multipart/form-data",
		},
		body: body,
	};
    let response = await fetch(url, requestOptions);

    return await response.json();
}

export async function AddVehicleDownwardsJourneyEnd(data) {
    let url = Configs.BASE_URL + "admin/VehicleInfo/insert_vehicle_down_journey_end";
    let body = ToFormData(data);
    let requestOptions = {
		method: "POST",
        headers: {
			"Content-Type": "multipart/form-data",
		},
		body: body,
	};
    let response = await fetch(url, requestOptions);

    return await response.json();
}

export async function GetVehicleBillingInfo(vehicles_info_id) {
    let url = Configs.BASE_URL + "admin/VehicleInfo/get_vehicle_billing_info?vehicles_info_id=" + vehicles_info_id;
    let response = await fetch(url);

    return await response.json();
}

export async function AddVehicleBilling(data) {
    let url = Configs.BASE_URL + "admin/VehicleInfo/insert_vehicle_billing";
    let requestOptions = {
		method: "POST",
		body: ToFormData(data),
	};
    let response = await fetch(url, requestOptions);

    return await response.json();
}

export async function AddVehiclePayment(data) {
    let url = Configs.BASE_URL + "admin/VehicleInfo/insert_vehicle_payments";
    let requestOptions = {
		method: "POST",
		body: ToFormData(data),
        headers: {
			"Content-Type": "multipart/form-data",
		},
	};
    let response = await fetch(url, requestOptions);

    return await response.json();
}