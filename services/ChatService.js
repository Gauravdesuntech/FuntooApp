import Configs,{ BuildSeachParams, ToFormData } from "../config/Configs";

export const message_and_notify  = async (data) => {
   
	let url = `${Configs.BASE_URL}admin/message/message_and_notify`;
    console.log("................./message/message_and_notify...............",ToFormData(data))
    console.log(".................url...............",url)
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});
	// console.log('.......await response.text()..........',await response.text())
	// return
	return await response.json();
}
export const send_whatsappsms  = async (data) => {
   
	let url = `${Configs.BASE_URL}admin/message/send_whatsappsms `;
	
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});
	return await response.json();
}

export const get_unread_message = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/message/get_unread_message";
console.log(url)
console.log(requestObj)
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};
export const get_individual_unread_message = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/message/get_individual_unread_message";
console.log(url)
console.log(requestObj)
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};



export const update_admin_unread_message  = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/message/update_admin_unread_message";
console.log(url)
console.log(requestObj)
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};