import Configs,{ToFormData} from "../config/Configs";

export const CategoryTagList = async (cat_id,tag_for) => {
	let url = Configs.BASE_URL + `admin/Category/get_tag_list?cat_id=${cat_id}&tag_for=${tag_for}`;
	//console.log(url);
	let response = await fetch(url);
	return await response.json();
};

export const CreateCategoryTag = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/Category/add_category_tag";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeleteCategoryTag = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/Category/delete_tag";
	
	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const GetCategorys = async () => {
	let url = Configs.BASE_URL + "admin/Category/get_categorys";

	let response = await fetch(url);
	return await response.json();
};
export const GetTaskCategorys = async () => {
	let url = Configs.BASE_URL + "admin/Category/get_taskcategorys";

	let response = await fetch(url);
	return await response.json();
};


export const GetSubCategorys = async (parent_id) => {
	let url = Configs.BASE_URL + `admin/Category/get_sub_categorys?parent_id=${parent_id}`;
	let response = await fetch(url);
	return await response.json();
};