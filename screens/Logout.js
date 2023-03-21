import React from "react";
import  Loader  from "../components/Loader";
import { removeUserData } from "../utils/Util";
import AppContext from "../context/AppContext";
import { remove_device_token } from "../services/APIServices";

export default class Logout extends React.Component {
	static contextType = AppContext;

	componentDidMount = () => {
		remove_device_token({cust_code:this.context.userData.cust_code}).then(res=>{console.log("...............",res)})
		console.log(this.context.userData.cust_code)
		removeUserData();
		this.context.unsetUserData();
		this.context.unsetTokenData();
		
	};

	render(){
		return(
			<></>
		)
	}
}
