import {ssoInstance} from './axios';
import Config from '../config/Configs';

const getFormData = (obj) => {
	let formdata = new FormData();
	for (let key in obj) {
		formdata.append(key, obj[key]);
	}
	return formdata;
};

export const addCategory=(data)=>{
    return ssoInstance.post(Config.TASK_URL+'category/add',data)
}
export const addSubCategory=(data)=>{
    console.log(Config.TASK_URL+'category/sadd',data)
    return ssoInstance.post(Config.TASK_URL+'category/sadd',data)
}
export const todoList=(user_id,query,adv)=>{
    if(query && !adv){
        console.log(Config.TASK_URL+'category/'+user_id+'?filter='+query)
        return ssoInstance.get(Config.TASK_URL+'category/'+user_id+'?filter='+query)
    }else if(!query && adv){
        console.log(Config.TASK_URL+'category/'+user_id+'?'+adv)
        return ssoInstance.get(Config.TASK_URL+'category/'+user_id+'?'+adv)
    }else if(query && adv){
        console.log(Config.TASK_URL+'category/'+user_id+'?filter='+query+'&'+adv)
        return ssoInstance.get(Config.TASK_URL+'category/'+user_id+'?filter='+query+'&'+adv)
    }else{
        console.log(Config.TASK_URL+'category/'+user_id)
        return ssoInstance.get(Config.TASK_URL+'category/'+user_id)
    }
}


export const subcat=(cat_id, user_id,query,adv)=>{
    if(query && !adv){
        console.log(Config.TASK_URL+'category/'+cat_id+'/'+user_id+'?filter='+query)
        return ssoInstance.get(Config.TASK_URL+'category/'+cat_id+'/'+user_id+'?filter='+query)
    }else if(!query && adv){
        console.log(Config.TASK_URL+'category/'+cat_id+'/'+user_id+'?'+adv)
        return ssoInstance.get(Config.TASK_URL+'category/'+cat_id+'/'+user_id+'?'+adv)
    }else if(query && adv){
        console.log(Config.TASK_URL+'category/'+cat_id+'/'+user_id+'?filter='+query+'&'+adv)
        return ssoInstance.get(Config.TASK_URL+'category/'+cat_id+'/'+user_id+'?filter='+query+'&'+adv)
    }else{
        console.log(Config.TASK_URL+'category/'+cat_id+'/'+user_id)
        return ssoInstance.get(Config.TASK_URL+'category/'+cat_id+'/'+user_id)
    }
}
//This below is not actually fetching subcat it is fetching tasks related data
//Don't know why this name i am not going to touch it (Biswanath Nath)
export const subCategoryList=(category_id,user_id,query,adv,page)=>{
    if(query && !adv){
        console.log(Config.TASK_URL+'task/'+category_id+"/"+user_id+'?filter='+query+"&page="+page)
        return ssoInstance.get(Config.TASK_URL+'task/'+category_id+"/"+user_id+'?filter='+query+"&page="+page)
    }else if(!query && adv){
        console.log(Config.TASK_URL+'task/'+category_id+"/"+user_id+'?'+adv+"&page="+page)
        return ssoInstance.get(Config.TASK_URL+'task/'+category_id+"/"+user_id+'?'+adv+"&page="+page)
    }else if(query && adv){
        console.log(Config.TASK_URL+'task/'+category_id+"/"+user_id+'?filter='+query+'&'+adv+"&page="+page)
        return ssoInstance.get(Config.TASK_URL+'task/'+category_id+"/"+user_id+'?filter='+query+'&'+adv+"&page="+page)
    }else{
        console.log(Config.TASK_URL+'task/'+category_id+"/"+user_id+"?page="+page)
        return ssoInstance.get(Config.TASK_URL+'task/'+category_id+"/"+user_id+"?page="+page)
    // console.log('................Config.TASK_URL/task/+category_id.........',Config.TASK_URL+'task/'+category_id+"/"+user_id)
    //     return ssoInstance.get(Config.TASK_URL+'task/'+category_id+"/"+user_id)
    }
}
export const getgameascat=(category_id)=>{
    console.log('................Config.TASK_URL/task/+category_id.........',Config.TASK_URL+'task/getgameascat/'+category_id)
        return ssoInstance.get(Config.TASK_URL+'task/getgameascat/'+category_id)

}

export const getDatewiseTasks=(user_id)=>{
        console.log(Config.TASK_URL+'task/getTaskDateWise/'+user_id)
        return ssoInstance.get(Config.TASK_URL+'task/getTaskDateWise/'+user_id)
}

// export const getApprovalTasks=(obj)=>{
//      console.log(Config.TASK_URL+'task/get_task_waiting_approval')
//     return ssoInstance.post(Config.TASK_URL+'task/get_task_waiting_approval',obj)
// }

export const getPendingTasks=(category_id,user_id)=>{
    //  console.log(Config.TASK_URL+'pending_task/'+category_id+"/"+user_id)
    return ssoInstance.get(Config.TASK_URL+'pending_task/'+category_id+"/"+user_id)
}

export const getAllSubcatList=()=>{
    return ssoInstance.get(Config.TASK_URL+'category/allsubcat')
}
export const getPriority=()=>{
    return ssoInstance.get(Config.TASK_URL+'priority')
}
export const getPoints=()=>{
    return ssoInstance.get(Config.TASK_URL+'point')
}
export const getTypes=()=>{
    return ssoInstance.get(Config.TASK_URL+'task/task_type')
}
export const getAssignLevel=(type)=>{
    return ssoInstance.get(Config.TASK_URL+'assign/'+type)
}
// export const addTask=(data)=>{
//     // console.log(Config.TASK_URL+'task/add',data)
//     return ssoInstance.post(Config.TASK_URL+'task/add',data)
// }
export const addTask = async (requestObj) => {
	let url = Config.TASK_URL+'task/add';
	let requestOptions = {
		method: "POST",
		body: JSON.stringify(requestObj),
	};

	let response = await fetch(url, requestOptions);
    // console.log("url....................",url)
    // console.log("....requestOptions...........",requestOptions)
	return await response.text();
};

export const editTask=(task_id)=>{
    return ssoInstance.get(Config.TASK_URL+'task'+'/edit/'+task_id)
}
export const deleteTask=(task_id)=>{
    return ssoInstance.get(Config.TASK_URL+'task'+'/delete_task/'+task_id)
}
export const updateTask=(task_id,data)=>{
    console.log(Config.TASK_URL+'task'+'/update/'+task_id,data)
    return ssoInstance.put(Config.TASK_URL+'task'+'/update/'+task_id,data)
}
export const userList= async()=>{
    console.log(Config.TASK_URL+'users/')
    // return ssoInstance.get(Config.TASK_URL+'users/')
    let response = await fetch(Config.TASK_URL+'users/');
	return await response.json();
}
export const ListUsers= async () => {
    console.log(Config.TASK_URL+'users/list')
    // return ssoInstance.get(Config.TASK_URL+'users/list')
    let response = await fetch(Config.TASK_URL+'users/list');
	return await response.json();
}
export const usersTaskList=(user_id)=>{
    return ssoInstance.get(Config.TASK_URL+'users/task/'+user_id)
}
export const usersTaskListWithSubcat=(user_id,subcat_id)=>{
    console.log(Config.TASK_URL+'task/get_user_task/'+user_id+'/'+subcat_id)
    return ssoInstance.get(Config.TASK_URL+'task/get_user_task/'+user_id+'/'+subcat_id)
}
export const updateTaskStatus=(task_id,data)=>{
    console.log(Config.TASK_URL+'task'+'/status/'+task_id,data)
    return ssoInstance.put(Config.TASK_URL+'task'+'/status/'+task_id,data)
}

export const changeAssignedTask= async(data)=>{
    // console.log(Config.TASK_URL+'task'+'/changeAssign/',data)
    // return ssoInstance.put(Config.TASK_URL+'task'+'/changeAssign/',data)
    let url = Config.TASK_URL+'task'+'/changeAssign/';
	let requestOptions = {
		method: "POST",
		body: JSON.stringify(data),
	};

	let response = await fetch(url, requestOptions);
    console.log("url....................",url)
    console.log("....requestOptions...........",data)
	return await response.text();
}

export const searchTask=(data)=>{
    console.log(Config.TASK_URL+'task'+'/searchTask/',data)
    return ssoInstance.put(Config.TASK_URL+'task'+'/searchTask/',data)
}