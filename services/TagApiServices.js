import Configs,{ToFormData} from "../config/Configs";

export const TagList = async () => {
	let url = Configs.BASE_URL + "admin/tag/list"
	let response = await fetch(url);
	return await response.json();
};

export const Addtag = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/tag/add_tag";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const Updatetag = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/tag/update_tag";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeleteTag = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/tag/delete_tag";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const GameListByTagId = async (tag_id) => {
	let url = Configs.BASE_URL + "user/game/game_list_by_tag?tag_id="+tag_id;
	let response = await fetch(url);

	return await  response.json();
};