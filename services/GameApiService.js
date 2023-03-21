import Configs,{ToFormData, BuildSeachParams} from "../config/Configs";

const getFormData = (obj) => {
	let formdata = new FormData();
	for (let key in obj) {
		formdata.append(key, obj[key]);
	}
	return formdata;
};

/**
 * Check if any game already exist with this current ordering and priority
 * 
 * @param {int} ordering 
 * @param {int} priority_id 
 * @returns object
 */
export const CheckGamePriorityOrderForAdd = async (ordering, priority_id) => {
	const ApiPath = `admin/game/check_if_order_piority_exist_for_add?ordering=${ordering}&priority_id=${priority_id}`;
	let url = Configs.BASE_URL + ApiPath
	let response = await fetch(url);
	console.log(".....CheckGamePriorityOrderForAdd...url.......",url)
	return await response.json();
}

export const SearchGameForUpdateOrder = async(query) => {
	const ApiPath = `admin/game/search_for_edit_order?${BuildSeachParams(query)}`;
	let url = Configs.BASE_URL + ApiPath
	let response = await fetch(url);

	return await response.json();
}

/**
 * Check if any game already exist with this current ordering and priority
 * 
 * @param {int} ordering 
 * @param {int} priority_id
 * @param {int} game_id
 * @returns object
 */
 export const CheckGamePriorityOrderForEdit = async (ordering, priority_id, game_id) => {
	const ApiPath = `admin/game/check_if_order_piority_exist_for_edit?ordering=${ordering}&priority_id=${priority_id}&game_id=${game_id}`;
	let url = Configs.BASE_URL + ApiPath
	let response = await fetch(url);

	return await response.json();
}

export const Gamedetail = async (id) => {
	let url = Configs.BASE_URL + "admin/game/get_game_detail?id="+id;
	let response = await fetch(url);
	console.log(url)
	return await response.json();
};

export const add_game = async (requestObj,files) => {
	let url = Configs.BASE_URL + "admin/game/add_game";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
		
	};
	// if (files.length > 0) {
	// 	files.forEach((item, i) => {
	// 	  requestOptions.body.append("media_files[]", {
	// 		uri: item.uri,
	// 		type: item.type,
	// 		name: item.name,
	// 	  });
	// 	});
	// }

	let response = await fetch(url, requestOptions);

	// console.log(".....add_game...url.......",url)
	// console.log(".....add_game...requestOptions.......",requestOptions)

	return await response.json();
};
export const add_image = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/game/add_image";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);

	// console.log(".....add_image...url.......",url)
	// console.log(".....add_image...requestOptions.......",requestOptions)

	return await response.json();
};


export const edit_game = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/game/update_game";

	let requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
		},
		body: getFormData(requestObj),
	};
	console.log('.....url,requestOptions.......',url,requestOptions);
	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const GetGamePartListByGameId = async (id) => {
	let url = Configs.BASE_URL + "admin/game/get_game_part_list_by_game_id?game_id="+id;
	let response = await fetch(url);
	return await response.json();
};

export const DeleteGamePart = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/game/delete_game_part";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const AddGamePart = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/game/add_game_part";

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

export const UpdateGamePart = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/game/update_game_part";

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


export const AddGameListDetail = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/game/add_game_list_detail";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdateGameListDetail = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/game/update_game_list_detail";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};



export const AddGameLaunchDetail = async (formData) => {
	let url = Configs.BASE_URL + "admin/game/add_game_launch_detail";

	let requestOptions = {
		method: "POST",
		body: formData,
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdateGameLaunchDetail = async (model) => {
	let url = Configs.BASE_URL + "admin/game/update_game_launch_detail";
	console.log(model);
	let requestOptions = {
		method: "POST",
		body: model,
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};



export const GetGameImageByGameId = async (id) => {
	let url = Configs.BASE_URL + "admin/game/get_game_image_by_game_id?game_id="+id;
	let response = await fetch(url);

	return await response.json();
};


export const AddGameImage = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/game/add_game_image";

	let requestOptions = {
		method: "POST",
		// headers: {
		// 	"Content-Type": "multipart/form-data",
		// },
		body: requestObj,
	};
	let response = await fetch(url, requestOptions);

	// console.log('........await response.text()......',await response.text());
	// return 
	return await response.json();
};

export const DeleteGameImage = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/game/delete_game_image";

	let requestOptions = {
		method: "POST",
		body: getFormData(requestObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};



export const GetGameTagListByGameId = async (id) => {
	let url = Configs.BASE_URL + "admin/game/get_game_tag_list_by_game_id?game_id="+id;
	let response = await fetch(url);
	return await response.json();
};

export const AddGameTag = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/game/add_game_tag";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const UpdateGameTag = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/game/update_game_tag";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const DeleteGameTag = async (requestObj) => {
	let url = Configs.BASE_URL + "admin/game/delete_game_tag";

	let requestOptions = {
		method: "POST",
		body: ToFormData(requestObj),
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const SearchAllType = async (query) => {
	let url = Configs.BASE_URL + "admin/game/search_all_type?query="+query;
	let response = await fetch(url);
	return await response.json();
};