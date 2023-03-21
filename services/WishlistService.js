import Configs,{ BuildSeachParams, ToFormData } from "../config/Configs";

const getFormData = (obj) => {
	let formdata = new FormData();
	for (let key in obj) {
		formdata.append(key, obj[key]);
	}
	return formdata;
};


/*
*
*get admin wishlist
*updated by - Rahul Saha
*updated on -30.11.22
*
*/

export const WishlistCategory = async (admin_id) => {
	let url = Configs.BASE_URL + `admin/wishlist/get_admin_wishlists?admin_id=${admin_id}`;
	let response = await fetch(url);
	return await response.json();
};

/*
*
*add admin wishlist item
*updated by - Rahul Saha
*updated on -30.11.22
*
*/

export const addWishList = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/wishlist/add_admin_wishlist_items";
	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url,requestOptions);
	// console.log('...........await response.text()............',await response.text())
	// return
	return await response.json();
};

/*
*
*create wishlist 
*updated by - Rahul Saha
*updated on -30.11.22
*
*/

export const WishlistCategoryCreate = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/wishlist/create_wishlist_Admin";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	}
	
	let response = await fetch(url, requestOptions);
	return await response.json();
};

/*
*
*get all wishlist item
*updated by - Rahul Saha
*updated on -30.11.22
*
*/

export const Wishlist = async (id) => {
	let url = Configs.BASE_URL + `admin/wishlist/get_admin_wishlist_items?id=${id}`
	let response = await fetch(url);
	return await response.json();
};

/*
*
*delete admin wishlist  
*
*created by - Rahul Saha
*created on- 30.11.22
*
*/

export const WishlistCategoryDelete = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/wishlist/delete_admin_wishlist";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};


/*
*
*delete admin wishlist item
*
*created by - Rahul Saha
*created on- 30.11.22
*
*/

export const WishlistDelete = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/wishlist/remove_admin_wishlist_item";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};
/*
*
*send wishlist to user
*
*created by - Rahul Saha
*created on- 30.11.22
*
*/

export const send_wishlist_to_user = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/wishlist/send_wishlist_to_user";
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log('...........await response.text()............',await response.text())
	// return
	return await response.json();
};