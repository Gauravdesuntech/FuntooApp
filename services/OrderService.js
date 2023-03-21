import Configs, { BuildSeachParams, ToFormData } from "../config/Configs";

export const GetOrders = async (status, order_confirmed, limit) => {
	if (order_confirmed != null) {
		if (limit != null) {
			let url = `${Configs.BASE_URL}admin/order/get_orders?status=${status}&order_confirmed=${order_confirmed}&limit=${limit}`;
			console.log(url)
			let response = await fetch(url);
			return await response.json();
		}
		else {
			let url = `${Configs.BASE_URL}admin/order/get_orders?status=${status}&order_confirmed=${order_confirmed}`;
			console.log(url)
			let response = await fetch(url);
			return await response.json();
		}
	} else {
		let url = `${Configs.BASE_URL}admin/order/get_orders?status=${status}`;
		console.log(url)
		let response = await fetch(url);
		return await response.json();
	}

};
export const GetCustomers = async (ID) => {
	let url = `${Configs.BASE_URL}admin/customer/getCustomers?id=${ID}`;
	let response = await fetch(url);

	return await response.json();
};
export const GetSortCustomers = async (ID) => {
	let url = `${Configs.BASE_URL}admin/customer/getSortCustomers?id=${ID}`;
	let response = await fetch(url);

	return await response.json();
};

/**

	* Get all customer  (sort by date )
	*
	* created by - Rahul Saha
	* 
	* created at - 25.11.22
	* 
	*/

export const getSortCustomersByDate = async (ID) => {
	let url = `${Configs.BASE_URL}admin/customer/getSortCustomersByDate?id=${ID}`;
	let response = await fetch(url);

	return await response.json();
};

export const GetSortCompany = async (ID) => {
	let url = `${Configs.BASE_URL}admin/customer/getSortCompany`;
	let response = await fetch(url);

	return await response.json();
};

/**

	* Get all Company  (sort by date )
	*
	* created by - Rahul Saha
	* 
	* created at - 25.11.22
	* 
	*/

export const getSortCompany_by_date = async (ID) => {
	let url = `${Configs.BASE_URL}admin/customer/getSortCompany_by_date`;
	let response = await fetch(url);

	return await response.json();
};

export const GetCustomers_unreadChat = async (ID) => {
	let url = `${Configs.BASE_URL}admin/customer/getCustomers_unreadChat?id=${ID}`;
	let response = await fetch(url);

	return await response.json();
};

export const GetOrderSetupPhotos = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_order_setup_photos?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
};

export const GetOrder = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_order?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);
	// console.log('........GetOrder..url........',url);
	return await response.json();
};

export const UpdateOrderItems = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/update_order_items`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	// console.log('.......await response.text()..........',await response.text())
	// return

	return await response.json();
}

export const ChangeOrderStatus = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/update_order_status`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});
	return await response.json();
}
export const upload_pdf = async (data) => {
	let url = `${Configs.BASE_URL}admin/game/upload_pdf`;
	// console.log('..............url.............',url);
	// console.log('..............ToFormData(data).............',data);

	var formdata = new FormData();
	formdata.append("pdf", data);

	let response = await fetch(url, {
		method: 'POST',
		body: formdata,
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});
	// console.log('..........await response.text()............',await response.text());
	// return
	return await response.json();
}

export const AddOrderVolunteerVendorDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/create_order_vendor_volunteers`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});
	return await response.json();
}
export const EditOrderVolunteerVendorDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/edit_order_vendor_volunteers`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});
	return await response.json();
}

export const GetAllOrderVolunteerVendorDetails = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_all_order_vendor_volunteers?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);
	console.log(url)
	return await response.json();
}

export const DeleteOrderVolunteerVendorDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/delete_order_vendor_volunteers`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const AddOrderCommunicationDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/add_communication_records`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetAllOrderCommunicationDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/get_all_communication_records?${BuildSeachParams(data)}`;
	let response = await fetch(url);

	return await response.json();
}

export const DeleteOrderCommunicationDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/delete_communication_records`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetAllOrderGameParts = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_all_order_game_parts?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const GetOrderGameCommonParts = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_common_parts?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const AddGameCommonPartsForOrder = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/add_order_common_game_parts`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetAllSingleGameParts = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_all_parts_for_game_for_order?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const GetOrderPoofDetails = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/proof_details?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const AddGamePartsForOrder = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/add_order_game_parts`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const SaveOrderGamePhotoProof = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/save_order_game_photo_proof`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetOrderGamePhotoProof = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_order_game_photo_proof?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const GetOrderVenderLists = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_order_venders?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const GetOrderDeliveryVolunteerList = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_order_vender_volunteers?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);
	// console.log(response.text());
	// return
	return await response.json();
}

export const AddOrderVenderVolunteer = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/create_order_vender_volunteer`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const UpdateOrderVenderVolunteer = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/update_order_vender_volunteer`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const DeleteOrderVenderVolunteer = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/delete_order_vender_volunteer`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetOrderBills = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_order_billing?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const CheckInvoiceExist = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/invoice/test_invoice_exist?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const CreateInvoice = async (data) => {
	let url = `${Configs.BASE_URL}admin/invoice/create`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const UpdateInvoice = async (data) => {
	let url = `${Configs.BASE_URL}admin/invoice/update`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetInvoice = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/invoice/get?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const GetAllInvoice = async () => {
	let url = `${Configs.BASE_URL}admin/invoice/get_all`;
	let response = await fetch(url);

	return await response.json();
}

export const MakeInvoicePayment = async (data) => {
	let url = `${Configs.BASE_URL}admin/invoice/add_payments`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetAllOrderInvoicePayments = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/invoice/payments?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}


export const AddBillExpenses = async (data) => {
	let url = `${Configs.BASE_URL}admin/expenses/add_payments`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});

	return await response.json();
}

export const GetAllOrderExpenses = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/expenses/get_expenses?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
}

export const GetChatOrder = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_orders?customer_id=${(queryParams)}`;
	let response = await fetch(url);

	return await response.json();
};

export const GetCustomerOrder = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_orders?customer_id=${queryParams}&status=`;
	let response = await fetch(url);
	console.log("......GetOrderEnquiry...url...........", url)
	return await response.json();
}

export const Get_ordersByCompany = async (queryParams, status) => {
	let url = `${Configs.BASE_URL}admin/order/get_ordersByCompany?company_id=${queryParams}&status=${status}`;
	let response = await fetch(url);
	// console.log("......Get_ordersByCompany...url...........",url)
	return await response.json();
}

export const GetCompany_Customers = async (data) => {
	let url = `${Configs.BASE_URL}admin/customer/getCompany_Customers`;
	console.log('..............', url);
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});
	// console.log('..............',await response.text());
	// return
	return await response.json();
}

/**
 * order vendor staff
 * @author Rahul Saha
 * date 22.02.23
 * 
 */
export const GetAllOrderVendorStaffDetails = async (queryParams) => {
	let url = `${Configs.BASE_URL}admin/order/get_all_order_vendor_staff?${BuildSeachParams(queryParams)}`;
	let response = await fetch(url);
	console.log(url)
	return await response.json();
}

export const AddOrderVendorStaffDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/create_order_vendor_staff`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});
	return await response.json();
}

export const DeleteOrderVendorStaffDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/delete_order_vendor_staff`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});
// console.log('..............',await response.text());
// 	return
	return await response.json();
}

/**
 * order vendor staff
 * @author Rahul Saha
 * date 23.02.23
 * 
 */

export const EditOrderVendorStaffDetails = async (data) => {
	let url = `${Configs.BASE_URL}admin/order/edit_order_vendor_staff`;
	let response = await fetch(url, {
		method: 'POST',
		body: ToFormData(data)
	});
	return await response.json();
}