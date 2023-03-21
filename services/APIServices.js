import Configs, { ToFormData } from "../config/Configs";
import Base64 from "../config/Base64";
import { getRequestUrl, getPostRequestOptions } from "../utils/Util";

const getFormData = (obj) => {
	let formdata = new FormData();
	for (let key in obj) {
		formdata.append(key, obj[key]);
	}
	return formdata;
};

export const authenticateAdmin = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/authenticate/";
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const update_admin_details = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/update_admin_details/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getNewArrivalsDetails = async () => {
	let url = Configs.BASE_URL + "adminApi/new_arrival_details";
	let response = await fetch(url);
	return await response.json();
};
export const update_user_profile = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/update_user_profile/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getCategory = async (catId = null) => {
	let url = catId ? Configs.BASE_URL + "adminApi/getcategory?cat_id=" + catId : Configs.BASE_URL + "adminApi/getcategory";
	// console.log(url);
	let response = await fetch(url);
	// console.log( await response.text() );
	// return;
	return await response.json();
};

export const getSubCategory = async (parent_id) => {
	let url = Configs.BASE_URL + "adminApi/getsubcategory?parent_id=" + parent_id;
	let response = await fetch(url);
	return await response.json();
};

// export const gamelist_by_sub_category = async (cat_id, sortBy) => {
// 	let url = Configs.BASE_URL + "adminApi/gamelist_by_sub_category?cat_id="+cat_id+"&sort_by="+`${sortBy}`;
// 	//console.log(url)
// 	let response = await fetch(url);
// 	return await response.json();
// };
export const gamedetails = async (id, cust_code) => {
	let url = Configs.BASE_URL + "adminApi/gamedetails?id=" + id + "&cust_code=" + cust_code;
	let response = await fetch(url);
	return await response.json();
};

export const getAdminInfo = async (phone) => {
	let url = Configs.BASE_URL + "adminApi/admin_info/?mobile=" + phone;
	let response = await fetch(url);
	return await response.json();
};
export const addWishList = async (game_code, cust_code) => {
	let url = Configs.BASE_URL + "adminApi/addwishlist/?game_code=" + game_code + "&cust_code=" + cust_code;
	let response = await fetch(url);
	return await response.json();
};

export const getWishList = async (cust_code) => {
	let url = Configs.BASE_URL + "adminApi/getwishlist/?cust_code=" + cust_code;
	let response = await fetch(url);
	return await response.json();
};

export const removeWishlistItem = async (game_code, cust_code) => {
	let url = Configs.BASE_URL + "adminApi/removewishlist/?game_code=" + game_code + "&cust_code=" + cust_code;
	let response = await fetch(url);
	return await response.json();
};

export const placeOrder = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/placeorder/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const addToCart = async (cust_id, game_id, total, qty) => {
	let url = Configs.BASE_URL + "adminApi/addcart/?game_id=" + game_id + "&cust_id=" + cust_id + "&price=" + total + "&qty=" + qty;
	let response = await fetch(url);
	return await response.json();
};

export const getCart = async (cust_id) => {
	let url = Configs.BASE_URL + "adminApi/getcart/?cust_id=" + cust_id;
	let response = await fetch(url);
	return await response.json();
};

export const clearCart = async (cust_id) => {
	let url = Configs.BASE_URL + "adminApi/clearcart/?cust_id=" + cust_id;
	let response = await fetch(url);
	return await response.json();
};
export const getEnquiryDetails = async (cust_id) => {
	let url = Configs.BASE_URL + "adminApi/get_event_details";
	let response = await fetch(url);
	return await response.json();
};
export const getOrderDetails = async (cust_id) => {
	let url = Configs.BASE_URL + "adminApi/get_event_order_confirmed_details?cust_id=" + cust_id;
	let response = await fetch(url);
	return await response.json();
};

export const getSlider = async () => {
	let url = Configs.BASE_URL + "adminApi/get_slider";
	let response = await fetch(url);
	return await response.json();
};

export const getProfile = async (studentCode) => {
	let url = Configs.BASE_URL + "adminApi/profile/" + studentCode;
	let response = await fetch(url);
	return await response.json();
};

export const editProfile = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/edit_profile/";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const addCategory = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/addCategory/";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);

	// console.log( await response.text() );
	// return;

	return await response.json();
};
export const addtaskCategory = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/addtaskCategory/";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);

	// console.log( await response.text() );
	// return;

	return await response.json();
};

export const editTaskCategory = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/editTaskCategory/";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log( await response.text() );
	// return;

	return await response.json();
};

export const editCategory = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/editCategory/";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log( await response.text() );
	// return;

	return await response.json();
};

export const addSubCategory = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/addSubCategory/";
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const editSubCategory = async (requestObj) => {
	let url = Configs.BASE_URL + "adminApi/editSubCategory/";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const GameListBySubCategory = async (cat_id, sortBy) => {
	let url = Configs.BASE_URL + "admin/game/game_list_by_sub_category?cat_id=" + cat_id + "&sort_by=" + `${sortBy}`;
	let response = await fetch(url);
	return await response.json();
};

export const GameListByTag = async (tag_id, sortBy, cat_id) => {
	let url = Configs.BASE_URL + "admin/game/game_list_by_tag?tag_id=" + tag_id + "&cat_id=" + `${cat_id}` + "&sort_by=" + `${sortBy}`;
	let response = await fetch(url);
	return await response.json();
};

export async function SendOrderBillingInfoUpdatePush(data) {
	let url = Configs.BASE_URL + "admin/push/send_push_notification";
	console.log("called");
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(data),
	};

	await fetch(url, requestOptions);
}

export const addDesignation = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/Employee/manage_role";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const GetDesignation = async () => {
	let url = Configs.BASE_URL + "admin/Employee/roles";

	let response = await fetch(url);
	return await response.json();
};
export const GetEmployes = async () => {
	let url = Configs.BASE_URL + "admin/customer/getEmployes";

	let response = await fetch(url);
	return await response.json();
};

export const addemployee = async (requestObj) => {
	// console.log(".....api screen....... Data................", (requestObj) );
	// console.log(".....api screen.......Form Data................", getFormData(requestObj) );
	let url = Configs.BASE_URL + "admin/Employee/addEmployee";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log( await response.text() );
	// return;
	return await response.json();
};

export const addFileSetting = async (requestObj) => {
	// console.log(".....addFileSetting screen....... Data................", (requestObj) );
	// console.log(".....addFileSetting screen.......Form Data................", getFormData(requestObj) );
	let url = Configs.BASE_URL + "admin/Employee/addFileSetting";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log( await response.text() );
	// return;
	return await response.json();
};

export const getFileSetting = async () => {
	let url = Configs.BASE_URL + "admin/Employee/getFileSetting";

	let response = await fetch(url);
	return await response.json();
};

export const Getemployee = async () => {
	let url = Configs.BASE_URL + "admin/Employee/employees";
	// console.log('.........url............',url);
	let response = await fetch(url);
	return await response.json();
};

export const EditEnquiry = async (requestObj) => {
	// console.log(".....api screen....... Data................", (requestObj) );
	// console.log(".....api screen.......Form Data................", getFormData(requestObj) );
	let url = Configs.BASE_URL + "admin/order/apply_discount";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log("await response.text()..........>>", await response.text() );
	// return;
	return await response.json();
};

export const update_track_log = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/order/update_track_log";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log('...........await response.text().......',await response.text());
	// return
	return await response.json();
};

export const get_track_log = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/order/get_track_log";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log('...........await response.text().......',await response.text());
	// return
	return await response.json();
};

export const OrderIncharge = async (requestObj) => {
	console.log(".....api screen....... Data................", (requestObj));
	console.log(".....api screen.......Form Data................", getFormData(requestObj));
	let url = Configs.BASE_URL + "admin/order/order_incharge";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log("await response.text()..........>>", await response.text() );
	// return;
	return await response.json();
};
export const OrderTeamLeader = async (requestObj) => {
	// console.log(".....api screen....... Data................", (requestObj) );
	// console.log(".....api screen.......Form Data................", requestObj);
	let url = Configs.BASE_URL + "admin/order/order_team_leader";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		// body: requestObj,
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log("await response.text()..........>>", await response.text() );
	// return;
	return await response.json();
};
export const OrderTeamMember = async (requestObj) => {
	console.log(".....api screen....... Data................", (requestObj));
	console.log(".....api screen.......Form Data................", requestObj);
	let url = Configs.BASE_URL + "admin/order/order_team_member";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		// body: requestObj,
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log("await response.text()..........>>", await response.text() );
	// return;
	return await response.json();
};

export const remove_device_token = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/user/remove_device_token";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

//.............zoo task...............

export const getAnimalGroups = async (cid, groupName) => {
	let url = Configs.BASE_URL + "groups/?cid=" + cid;
	if (typeof groupName !== "undefined") {
		url += "&group_name=" + groupName;
	}
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const getRandomCommonName = async (cid) => {
	let url = Configs.BASE_URL + "random_common_name/?cid=" + cid;
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const addGroup = async (requestObj) => {
	let url = Configs.BASE_URL + "manage_group/";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getApprovalTasks = async (requestObj) => {
	let url = Configs.TASK_URL + 'task/get_task_waiting_approval';

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAllCategory = async (cid, classID) => {
	let url = Configs.BASE_URL + "category/?cid=" + cid;
	if (typeof classID !== "undefined") {
		url += "&class_id=" + classID;
	}
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const fetchCategoryCoverPhoto = async (cid, classID) => {
	let url = Configs.BASE_URL + "fetch_category_cover_images/?cid=" + cid;
	if (typeof classID !== "undefined") {
		url += "&class_id=" + classID;
	}
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const searchCategory = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.BASE_URL + "search_cat", requestObj);
	console.log("Search URL******", url);
	let response = await fetch(url);
	return await response.json();
};

export const searchTasks = async (user_id, value) => {
	let url = getRequestUrl(Configs.TASK_URL + 'task/searchTask?userid=' + user_id + "&query=" + value);
	console.log("...searchTasks...", url)
	let response = await fetch(url);
	return await response.json();
};

export const getAllSubCategory = async (cid, categoryID) => {
	let url = Configs.BASE_URL + "sub_category/?cid=" + cid;
	if (typeof categoryID !== "undefined") {
		url += "&category_id=" + categoryID;
	}
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const getSubCatCoverImage = async (cid, categoryID) => {
	let url = Configs.BASE_URL + "fetch_subcategory_cover_images/?cid=" + cid;
	if (typeof categoryID !== "undefined") {
		url += "&category_id=" + categoryID;
	}
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const searchSubCategory = async (requestObj = {}) => {
	let url = getRequestUrl(
		Configs.BASE_URL + "search_sub_category",
		requestObj
	);
	console.log("Search URL******", url);
	let response = await fetch(url);
	return await response.json();
};

export const searchSection = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.BASE_URL + "search_section", requestObj);
	console.log("Search URL******", url);
	let response = await fetch(url);
	// console.log(await response.text())
	return await response.json();
};

export const searchEnclosure = async (requestObj = {}) => {
	let url = getRequestUrl(Configs.BASE_URL + "search_enclosure/?search_value=" + requestObj.search_value + "&cid=" + requestObj.cid);
	console.log("Search URL******", url)
	let response = await fetch(url);
	// console.log(await response.text())
	return await response.json();
};

export const getAllSpecies = async (cid, categoryID) => {
	let url = Configs.BASE_URL + "species/?cid=" + cid;
	if (typeof categoryID !== "undefined") {
		url += "&category_id=" + categoryID;
	}

	let response = await fetch(url);
	return await response.json();
};

export const getAllSpeciesByClass = async (cid, classID) => {
	let url = Configs.BASE_URL + "species/?cid=" + cid;
	if (typeof classID !== "undefined") {
		url += "&class_id=" + classID;
	}
	let response = await fetch(url);
	return await response.json();
};

export const addSpecies = async (requestObj) => {
	let url = Configs.BASE_URL + "add_species/";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAllSubSpecies = async (cid, speciesID) => {
	let url = Configs.BASE_URL + "subspecies/?cid=" + cid;
	if (typeof speciesID !== "undefined") {
		url += "&species_id=" + speciesID;
	}
	let response = await fetch(url);
	return await response.json();
};

export const addSubSpecies = async (requestObj) => {
	let url = Configs.BASE_URL + "add_subspecies/";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getCommonNames = async (paramObj = {}) => {
	let url = Configs.BASE_URL + "common_names/";
	if (Object.keys(paramObj).length > 0) {
		url += "?params=" + JSON.stringify(paramObj);
	}
	console.log(url);
	let response = await fetch(url);
	const result = await response.json();
	// console.log(result)
	return result;
};

export const getSectionCommonNames = async (paramObj = {}) => {
	let url = Configs.BASE_URL + "section_common_names/";

	if (Object.keys(paramObj).length > 0) {
		url += "?section_id=" + paramObj.section_id + "&cid=" + paramObj.cid;
	}
	console.log(url);
	let response = await fetch(url);
	// console.log("response data",await response.text());
	return await response.json();
};

export const getReportView = async (paramObj = {}) => {
	let url = Configs.BASE_URL + "section_report_view/";

	if (Object.keys(paramObj).length > 0) {
		url += "?section_id=" + paramObj.section_id + "&cid=" + paramObj.cid;
	}
	console.log(url);
	let response = await fetch(url);
	// console.log("response data",response.json());
	return await response.json();
};

export const manageCommonName = async (requestObj) => {
	let url = Configs.BASE_URL + "manage_common_name/";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const searchCommonName = async (requestObj = {}) => {
	let url = Configs.BASE_URL + "search_common_name";

	let params = [];
	for (const [key, value] of Object.entries(requestObj)) {
		params.push(key + "=" + value);
	}

	if (params.length > 0) {
		url += "/?" + params.join("&");
	}

	console.log("Search URL******", url)

	let response = await fetch(url);
	return await response.json();
};

export const getCommonNameDetails = async (commonName) => {
	let url =
		Configs.BASE_URL +
		"common_name_details/?common_name=" +
		Base64.encode(commonName);
	console.log("Common name url", url);
	let response = await fetch(url);
	return await response.json();
};

export const exportCommonName = async (commonName) => {
	let url =
		Configs.BASE_URL +
		"export_common_name_details/?common_name=" +
		Base64.encode(commonName);
	console.log("EXPORT URL *******", url)
	let response = await fetch(url);
	// console.log(await response.text())
	return await response.json();
};

export const exportSection = async (sectionID) => {
	let url =
		Configs.BASE_URL +
		"export_section/?section_id=" +
		sectionID;
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalsCount = async (commonName) => {
	let url =
		Configs.BASE_URL +
		"animals_count/?common_name=" +
		Base64.encode(commonName);
	let response = await fetch(url);
	return await response.json();
};

export const getCommonNameSections = async (commonName, animalType) => {
	let url =
		Configs.BASE_URL +
		"common_name_sections/?common_name=" +
		Base64.encode(commonName);

	if (typeof animalType !== "undefined") {
		url += "&type=" + animalType;
	}

	let response = await fetch(url);
	return await response.json();
};

export const getCommonNameEnclosures = async (commonName, sectionID) => {
	let url =
		Configs.BASE_URL +
		"common_names_enclosures/?common_name=" +
		Base64.encode(commonName);

	if (typeof sectionID !== "undefined") {
		url += "&section_id=" + sectionID;
	}

	let response = await fetch(url);
	return await response.json();
};

export const getIdentificationTypeCount = async (
	commonName,
	enclosureID,
	gender
) => {
	let url =
		Configs.BASE_URL +
		"enclosure_identification_count/?common_name=" +
		Base64.encode(commonName);

	if (typeof enclosureID !== "undefined") {
		url += "&enclosure_id=" + enclosureID;
	}

	if (typeof gender !== "undefined") {
		url += "&gender=" + gender;
	}
	let response = await fetch(url);
	return await response.json();
};

export const getAnimals = async (params) => {
	let arr = [];
	for (let key in params) {
		arr.push(key + "=" + params[key]);
	}

	let url = Configs.BASE_URL + "animals/?" + arr.join("&");
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const getSectionAnimals = async (params) => {
	let arr = [];
	for (let key in params) {
		arr.push(key + "=" + params[key]);
	}

	let url = Configs.BASE_URL + "section_animals/?" + arr.join("&");
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const generateSectionCommonNameReport = async (requestObj) => {
	let url =
		Configs.BASE_URL + "generate_common_name_report_section_wise_excel/";
	console.log(url);
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	// console.log(await response.text());
	return await response.json();
};

export const getReportViewSection = async (paramObj = {}) => {
	let url = Configs.BASE_URL + "report_section_view/";

	if (Object.keys(paramObj).length > 0) {
		url += "?section_id=" + paramObj.section_id + "&cid=" + paramObj.cid;
	}
	console.log(url);
	let response = await fetch(url);
	// console.log("response data",await response.json());
	return await response.json();
};

export const getAnimalsEnclosureBased = async (params) => {
	let arr = [];
	for (let key in params) {
		arr.push(key + "=" + params[key]);
	}

	let url = Configs.BASE_URL + "animals_enclosure_based/?" + arr.join("&");
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const getAllAnimals = async (cid, enclosure_id) => {
	let url = Configs.BASE_URL + "all_animals/?cid=" + cid;
	if (typeof enclosure_id !== "undefined") {
		url += "&enclosure_id=" + enclosure_id;
	}
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const getAllEnclosures = async (cid, section_id) => {
	let url = Configs.BASE_URL + "all_enclosures/?cid=" + cid;
	if (typeof section_id !== "undefined") {
		url += "&section_id=" + section_id;
	}
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const getIndividualAnimals = async (englishName) => {
	let url =
		Configs.BASE_URL +
		"individual_animals/?english_name=" +
		Base64.encode(englishName);
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalInfo = async (id) => {
	let url = Configs.BASE_URL + "animal_info/" + id;
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalID = async () => {
	let url = Configs.BASE_URL + "animal_code/";
	let response = await fetch(url);
	return await response.json();
};

export const createAnimalProfile = async (requestObj) => {
	let url = Configs.BASE_URL + "create_animal_profile/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAnimalProfileData = async (animalID) => {
	let url = Configs.BASE_URL + "animal_profile/" + animalID;
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalPedigree = async (id) => {
	let url = Configs.BASE_URL + "animal_pedigree/" + id;
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const saveAnimalPedigreeDetails = async (requestObj) => {
	// console.log("requestObj-------",requestObj);return;
	let url = Configs.BASE_URL + "save_animal_pedigree/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	// console.log( await response.text())
	return await response.json();
};

export const getAnimalVaccineDetails = async (animalID) => {
	let url = Configs.BASE_URL + "animal_vaccines/" + animalID;
	let response = await fetch(url);
	return await response.json();
};

export const getVaccineTypes = async () => {
	let url = Configs.BASE_URL + "vaccine_types/";
	let response = await fetch(url);
	return await response.json();
};

export const getVaccines = async (id) => {
	let url = Configs.BASE_URL + "vaccines/" + id;
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalVaccineRecord = async (id) => {
	let url = Configs.BASE_URL + "animal_vaccine_record/" + id;
	let response = await fetch(url);
	return await response.json();
};

export const saveAnimalVaccineRecord = async (requestObj) => {
	let url = Configs.BASE_URL + "manage_animal_vaccine/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAnimalVaccinationDetails = async (animalCode) => {
	let url = Configs.BASE_URL + "animal_vaccinations/" + animalCode;
	let response = await fetch(url);
	return await response.json();
};

export const saveAnimalVaccinationsRecord = async (requestObj) => {
	let url = Configs.BASE_URL + "mannage_animal_vaccinations_record/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAnimalVaccinationRecord = async (id) => {
	let url = Configs.BASE_URL + "animal_vaccination_record/" + id;
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalDiagnosis = async (ref, ref_id) => {
	let url = Configs.BASE_URL + "animal_diagnosis/" + ref + "/" + ref_id;
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const getDiagnosis = async () => {
	let url = Configs.BASE_URL + "diagnosis/";
	let response = await fetch(url);
	return await response.json();
};

export const saveAnimalDiagnosisRecord = async (requestObj) => {
	let url = Configs.BASE_URL + "manage_animal_diagnosis_record/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAnimalDiagnosisRecord = async (id) => {
	let url = Configs.BASE_URL + "animal_diagnosis_record/" + id;
	let response = await fetch(url);
	return await response.json();
};

export const getEnclosureTypes = async () => {
	let url = Configs.BASE_URL + "enclosure_types/";
	let response = await fetch(url);
	return await response.json();
};

export const getEnclosureChangeHistory = async (user_id, page) => {
	let url = Configs.BASE_URL + "enclosure_history/?user_id=" + user_id + "&page=" + page;
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};

export const getConfirmedEnclosureChangeHistory = async (user_id) => {
	let url = Configs.BASE_URL + "enclosure_history/?user_id=" + user_id + "&status=changed";
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};

export const getPendingEnclosure = async (user_id) => {
	let url = Configs.BASE_URL + "get_approval_enclosure_for_user?user_id=" + user_id;
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};

export const getEnclosureHistory = async (user_id, enclosure_id) => {
	let url = Configs.BASE_URL + "enclosure_history/?user_id=" + user_id + "&status=changed&enclosure_id=" + enclosure_id;
	console.log(url)
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalEnclosureID = async () => {
	let url = Configs.BASE_URL + "enclosure_id/";
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalEnclosures = async (animalCode) => {
	let url = Configs.BASE_URL + "animal_enclosures/" + animalCode;
	let response = await fetch(url);
	return await response.json();
};

export const saveAnimalEnclosureRecord = async (requestObj) => {
	let url = Configs.BASE_URL + "manage_animal_enclosure_record/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAnimalEnclosureRecord = async (id) => {
	let url = Configs.BASE_URL + "animal_enclosure_record/" + id;
	let response = await fetch(url);
	return await response.json();
};

export const getIncidentTypes = async () => {
	let url = Configs.BASE_URL + "incident_types/";
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalIncidentReports = async (ref, ref_id) => {
	let url = Configs.BASE_URL + "animal_incident_reports/" + ref + "/" + ref_id;
	let response = await fetch(url);
	console.log(url);
	return await response.json();
};

export const saveAnimalIncidentRecord = async (requestObj) => {
	let url = Configs.BASE_URL + "manage_animal_incident_record/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAnimalIncidentDetails = async (id) => {
	let url = Configs.BASE_URL + "animal_incident_record/" + id;
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalMeasurements = async (animalCode) => {
	let url = Configs.BASE_URL + "animal_measurements/" + animalCode;
	let response = await fetch(url);
	return await response.json();
};

export const addAnimalMeasurementRecord = async (requestObj) => {
	let url = Configs.BASE_URL + "add_animal_measurement_record/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAnimalFeedingAssignments = async (animalCode) => {
	let url = Configs.BASE_URL + "animal_feeding_assignments/" + animalCode;
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalFoods = async () => {
	let url = Configs.BASE_URL + "foods/";
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalMealSlots = async () => {
	let url = Configs.BASE_URL + "meal_slots/";
	let response = await fetch(url);
	return await response.json();
};

export const getUnits = async () => {
	let url = Configs.BASE_URL + "units/";
	let response = await fetch(url);
	return await response.json();
};

export const saveAnimalFeedingAssignment = async (requestObj) => {
	let url = Configs.BASE_URL + "manage_animal_feeding_assignment/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAnimalAssignFoodDetails = async (id) => {
	let url = Configs.BASE_URL + "animal_assign_food_details/" + id;
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalFeedings = async (animalCode) => {
	let url = Configs.BASE_URL + "animal_feedings/" + animalCode;
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalFoodsForFeeding = async (animalCode) => {
	let url = Configs.BASE_URL + "foods_for_feeding/" + animalCode;
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const saveAnimalFeedingRecord = async (requestObj) => {
	let url = Configs.BASE_URL + "manage_animal_feeding_record/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAnimalFeedingDetails = async (id) => {
	let url = Configs.BASE_URL + "animal_feeding_details/" + id;
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalFarms = async (cid) => {
	let url = Configs.BASE_URL + "farms/?cid=" + cid;
	let response = await fetch(url);
	return await response.json();
};

export const addFarm = async (requestObj) => {
	let url = Configs.BASE_URL + "manage_farm/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAnimalOrigins = async () => {
	let url = Configs.BASE_URL + "origins/";
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalOwners = async () => {
	let url = Configs.BASE_URL + "owners/";
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalFullNames = async () => {
	let url = Configs.BASE_URL + "animal_full_names/";
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalEnglishNames = async () => {
	let url = Configs.BASE_URL + "animal_english_names/";
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalDatabases = async (cid) => {
	let url = Configs.BASE_URL + "animal_databases/?cid=" + cid;
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalEnclosureIds = async (requestObj = {}) => {
	let url = getRequestUrl(
		Configs.BASE_URL + "animal_enclosure_ids",
		requestObj
	);
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const getAnimalEnclosureIdDetails = async (id) => {
	let url = Configs.BASE_URL + "animal_enclosure_id_details/?id=" + id;
	let response = await fetch(url);
	return await response.json();
};

export const manageAnimalEnclosureID = async (requestObj) => {
	let galleryData = [];
	let url = Configs.BASE_URL + "manage_animal_enclosure_id/";

	if (requestObj.hasOwnProperty("gallery")) {
		galleryData = requestObj["gallery"];
		delete requestObj["gallery"];
	}

	let formData = getFormData(requestObj);
	(galleryData || []).forEach((value, index) => {
		formData.append("gallery[]", value);
	});

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: formData,
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const deleteEnclosureidGalleryItem = async (id) => {
	let url = getRequestUrl(
		Configs.BASE_URL + "delete_enclosureid_gallery_item"
	);
	let response = await fetch(url, getPostRequestOptions({ id }));
	return await response.json();
};

export const downloadUserIDQrcode = async (id) => {
	let url = getRequestUrl(Configs.BASE_URL + "download_userid_qrcode");
	let response = await fetch(url, getPostRequestOptions({ user_id: id }));
	return await response.json();
};

export const getAnimalEnclosureTypes = async (cid) => {
	let url = Configs.BASE_URL + "animal_enclosure_types/?cid=" + cid;
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const manageAnimalEnclosureType = async (requestObj) => {
	let url = Configs.BASE_URL + "manage_animal_eclosure_type/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAnimalSections = async (cid) => {
	let url = Configs.BASE_URL + "sections/?cid=" + cid;
	console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const manageSection = async (requestObj) => {
	let url = Configs.BASE_URL + "manage_section/";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const manageDeviceLog = async (requestObj) => {
	let url = Configs.BASE_URL_APP + "journal/log";
	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	console.log(url);
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getDistanceand = async (origin, destination) => {
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	// console.log("origin, destination.........", origin, destination)

	let response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${Configs.GOOGLE_PLACE_API_KEY}&mode=driving`, requestOptions)


	return await response.json();
}

export const getSectionRelations = async (cid) => {
	let url = Configs.BASE_URL + "section_relations/?cid=" + cid;
	let response = await fetch(url);
	return await response.json();
};

export const getSectionRelationDetails = async (id) => {
	let url = Configs.BASE_URL + "section_relation_details/?id=" + id;
	let response = await fetch(url);
	return await response.json();
};

export const manageSectionRelation = async (requestObj) => {
	let url = Configs.BASE_URL + "manage_section_relation/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const generateExcel = async (requestObj) => {
	let url = Configs.BASE_URL + "generate_excel/";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getAnimalEnclosureHistory = async (animalID) => {
	let url =
		Configs.BASE_URL + "animal_enclosure_history/?animal_id=" + animalID;
	let response = await fetch(url);
	return await response.json();
};

export const animalChangeEnclosure = async (requestObj) => {
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let url = Configs.BASE_URL + "animal_change_enclosure/";
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const animalChangeEnclosureUpdate = async (requestObj) => {
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let url = Configs.BASE_URL + "animal_change_enclosure_update/";
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getApprovalUser = async (cid, user_id) => {
	let url = Configs.BASE_URL + "get_approval_user/?cid=" + cid + "&user_id=" + user_id;
	let response = await fetch(url);
	return await response.json();
};

export const exportAnimals = async (requestObj) => {
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let url = Configs.BASE_URL + "export_animals/";
	let response = await fetch(url, requestOptions);
	// console.log(await response.text());
	return await response.json();
};

export const getGalleryData = async (commonNameID) => {
	let url = Configs.BASE_URL + "gallery/?common_name_id=" + commonNameID;
	let response = await fetch(url);
	return await response.json();
};

export const getCommonNameInfo = async (commonNameID) => {
	let url =
		Configs.BASE_URL + "common_name_info/?common_name_id=" + commonNameID;
	let response = await fetch(url);
	return await response.json();
};

export const changeCommonNameCoverImage = async (requestObj) => {
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let url = Configs.BASE_URL + "change_common_name_cover_image/";
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const delteCommonNameGalleryItem = async (id) => {
	let requestOptions = {
		method: "POST",
		body: getFormData({ id }),
	};

	let url = Configs.BASE_URL + "remove_common_name_gallery_item/";
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const searchAnimal = async (requestObj = {}) => {
	let params = [];
	let url = Configs.BASE_URL + "search_animal";

	for (const [key, value] of Object.entries(requestObj)) {
		params.push(key + "=" + value);
	}

	if (params.length > 0) {
		url += "/?" + params.join("&");
	}
	console.log("Search URL******", url);
	let response = await fetch(url);
	return await response.json();
};

export const getParentAnimals = async (commonName, enclosureID) => {
	let url =
		Configs.BASE_URL +
		"parent_animals/?common_name=" +
		Base64.encode(commonName) +
		"&enclosure_id=" +
		enclosureID;
	let response = await fetch(url);
	return await response.json();
};

export const uploadAnimalImages = async (requestObj) => {
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let url = Configs.BASE_URL + "upload_animal_images/";
	let response = await fetch(url, requestOptions);
	// console.log( await response.text())
	return await response.json();
};

export const GetLogHistory = async () => {
	let url = `${Configs.BASE_URL}admin/log/Get_log_History`;
	let response = await fetch(url);
	return await response.json();
};
export const GetLogHistoryDetail = async () => {
	let url = `${Configs.BASE_URL}admin/log/Get_log_History_details`;
	let response = await fetch(url);
	return await response.json();
};
export const GetLogHistory_by_user = async (user_id) => {
	let url = `${Configs.BASE_URL}admin/log/Get_log_History?user_id=${user_id}`;
	let response = await fetch(url);
	return await response.json();
};
export const GetLogHistoryDetail_by_user = async (user_id) => {
	let url = `${Configs.BASE_URL}admin/log/Get_log_History_details?user_id=${user_id}`;
	let response = await fetch(url);
	return await response.json();
};
//............


/*
*
*add payment type
*
*created by - Rahul Saha
*created on- 19.12.22
*     
*/

export const add_PaymentTerm = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/Employee/addPaymentType";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

/*
*
*edit payment type
*
*created by - Rahul Saha
*created on- 19.12.22
*     
*/

export const edit_PaymentTerm = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/Employee/editPaymentType";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

/*
	*
	*get payment type
	*
	*created by - Rahul Saha
	*created on- 19.12.22
	*     
	*/

export const get_PaymentTerm = async () => {
	let url = Configs.BASE_URL + "admin/Employee/get_payment_Term";

	let response = await fetch(url);
	return await response.json();
};

/*
*
*delete payment type
*
*created by - Rahul Saha
*created on- 19.12.22
*     
*/

export const delete_PaymentTerm = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/Employee/remove_payment_Term";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};


//............


/*
*
*
*for create new wallet permission
*created by -Rahul Saha
*created on - 09.01.23
* 
*/


export const create_wallet_permission = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/CashFlowPermission/create_wallet_permission";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

/*
*
*edit wallet permission
*created by -Rahul Saha
*created on - 09.01.23
* 
*/

export const update_wallet_permission = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/CashFlowPermission/update_wallet_permission";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

/*
	*
	*get getting all wallet permissions
*created by -Rahul Saha
*created on - 09.01.23
* 
*/

export const get_wallet_permissions = async () => {
	let url = Configs.BASE_URL + "admin/CashFlowPermission/get_wallet_permissions";

	let response = await fetch(url);
	return await response.json();
};
/*
	*
	*get getting single wallet permissions
*created by -Rahul Saha
*created on - 09.01.23
* 
*/

export const get_wallet_permission = async (id) => {
	let url = Configs.BASE_URL + "admin/CashFlowPermission/get_wallet_permission?id=" + id;
	// console.log('........url..........',url)
	let response = await fetch(url);
	return await response.json();
};

/*
*
*delete delete wallet permission
*created by -Rahul Saha
*created on - 09.01.23
* 
*/

export const delete_wallet_permission = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/CashFlowPermission/delete_wallet_permission";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

/*
	*
	*get Version
*created by -Rahul Saha
*created on - 13.01.23
* 
*/

export const getVersion = async (type) => {
	let url = Configs.BASE_URL + "VersionControl/get_Version?type=" + type;
	// console.log('........url..........',url)
	let response = await fetch(url);
	return await response.json();
};

/*
*
* verify_upi 
* created by - Rahul Saha
* created on - 31.01.23
*
*/

export const verify_upi = async (requestObj) => {
	let url = Configs.BASE_URL + "Payment/verify_upi";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log('.....await response.text().....',await response.text())
	// return
	return await response.json();
};
/*
*
* transfer_amount 
* created by - Rahul Saha
* created on - 31.01.23
*
*/

export const transfer_amount = async (requestObj) => {
	let url = Configs.BASE_URL + "Payment/amount_transfer";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log('.....await response.text().....',await response.text())
	// return
	return await response.json();
};

/*
*
*user login settings
*created by - Rahul Saha
*created in - 03.02.23
*
*/

export const addUserLoginSetting = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/MasterSettings/addUserLoginSetting";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log( await response.text() );
	// return;
	return await response.json();
};

export const getUserLoginSetting = async () => {
	let url = Configs.BASE_URL + "admin/MasterSettings/getUserLoginSetting";

	let response = await fetch(url);
	return await response.json();
};

/*
*
* verify_bank_account 
* created by - Rahul Saha
* created on - 07.02.23
*
*/

export const verify_bank_account = async (requestObj) => {
	let url = Configs.BASE_URL + "Payment/verify_bank_account";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log('.....await response.text().....',await response.text())
	// return
	return await response.json();
};

/*
*
* bank_amount_transfer 
* created by - Rahul Saha
* created on - 07.02.23
*
*/

export const bank_amount_transfer = async (requestObj) => {
	let url = Configs.BASE_URL + "Payment/bank_amount_transfer";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log('.....await response.text().....',await response.text())
	// return
	return await response.json();
};

/*
*
* add_bank_details 
* created by - Rahul Saha
* created on - 08.02.23
*
*/

export const add_bank_details = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/bankDetails/add_bank_details";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log('.....await response.text().....',await response.text())
	// return
	return await response.json();
};
/*
*
* get_bank_details 
* created by - Rahul Saha
* created on - 08.02.23
*
*/

export const get_bank_details = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/bankDetails/get_bank_details";
	// console.log('.....url.....',url)
	let response = await fetch(url);
	// console.log('.....await response.text().....',await response.text())
	// return
	return await response.json();
};

/*
*
* get category cashflow by id
* created by - Rahul Saha
* created on - 20.02.23
*
*/

export const get_category = async (id) => {
	let url = `${Configs.BASE_URL}CashFlow/AddDetails/get_category?id=${id}`;
	let response = await fetch(url);
	return await response.json();
};
/*
*
* get aLL category cashflow
* created by - Rahul Saha
* created on - 20.02.23
*
*/

export const get_all_category = async (id) => {
	let url = `${Configs.BASE_URL}CashFlow/AddDetails/get_all_category`;
	let response = await fetch(url);
	return await response.json();
};
/*
*
* get new category cashflow
* created by - Rahul Saha
* created on - 01.03.23
*
*/

export const get_new_category = async (id) => {
	let url = `${Configs.BASE_URL}CashFlow/AddDetails/get_categorys`;
	let response = await fetch(url);
	return await response.json();
};
/*
*
* Add category cashflow 
* created by - Rahul Saha
* created on - 20.02.23
*
*/

export const add_category = async (requestObj) => {
	let url = `${Configs.BASE_URL}CashFlow/AddDetails/add_category`;
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

/*
*
* edit category cashflow 
* created by - Rahul Saha
* created on - 20.02.23
*
*/

export const edit_category = async (requestObj) => {
	let url = `${Configs.BASE_URL}CashFlow/AddDetails/edit_category`;
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};
/*
*
* delete category cashflow 
* created by - Rahul Saha
* created on - 20.02.23
*
*/

export const delete_category = async (requestObj) => {
	let url = `${Configs.BASE_URL}CashFlow/AddDetails/delete_category`;
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};


/*
*
* get subcategory cashflow by id
* created by - Rahul Saha
* created on - 20.02.23
*
*/

export const get_subcategory = async (id) => {
	let url = `${Configs.BASE_URL}CashFlow/AddDetails/get_subcategory?id=${id}`;
	let response = await fetch(url);
	return await response.json();
};

/*
*
* get new subcategory cashflow by id
* created by - Rahul Saha
* created on - 01.03.23
*
*/

export const get_subcategory_by_id = async (id) => {
	let url = `${Configs.BASE_URL}CashFlow/AddDetails/get_subcategory_by_id?id=${id}`;
	let response = await fetch(url);
	return await response.json();
};
/*
*
* get aLL subcategory cashflow
* created by - Rahul Saha
* created on - 20.02.23
*
*/

export const get_all_subcategory = async (id) => {
	let url = `${Configs.BASE_URL}CashFlow/AddDetails/get_all_subcategory`;
	let response = await fetch(url);
	return await response.json();
};
/*
*
* Add subcategory cashflow 
* created by - Rahul Saha
* created on - 20.02.23
*
*/

export const add_subcategory = async (requestObj) => {
	let url = `${Configs.BASE_URL}CashFlow/AddDetails/add_subcategory`;
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

/*
*
* edit subcategory cashflow 
* created by - Rahul Saha
* created on - 20.02.23
*
*/

export const edit_subcategory = async (requestObj) => {
	let url = `${Configs.BASE_URL}CashFlow/AddDetails/edit_subcategory`;
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};
/*
*
* delete subcategory cashflow 
* created by - Rahul Saha
* created on - 20.02.23
*
*/

export const delete_subcategory = async (requestObj) => {
	let url = `${Configs.BASE_URL}CashFlow/AddDetails/delete_subcategory`;
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

/**
   *
   *  add default manager
   * @author Rahul Saha
   * date 21.03.23 
   *
   */

export const addDefaultManager = async (requestObj) => {
	let url = Configs.BASE_URL + "api/addDefaultManager";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log( await response.text() );
	// return;
	return await response.json();
};

/**
*
*  get default manager
* @author Rahul Saha
* date 21.03.23 
*
*/

export const getDefaultManager = async () => {
	let url = Configs.BASE_URL + "api/getDefaultManager";

	let response = await fetch(url);
	return await response.json();
};