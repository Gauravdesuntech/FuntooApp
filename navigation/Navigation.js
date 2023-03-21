import React, { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
	createStackNavigator,
	CardStyleInterpolators,
} from "@react-navigation/stack";
import useNotifications from "../Notification";
import MobileVerification from "../screens/MobileVerification";
import OtpVerification from "../screens/OtpVerification";
import UpdateAccount from "../screens/UpdateAccount";
import AppContext from "../context/AppContext";
import UserLoginScreen from "../screens/user/UserLoginScreen";
import UserForgotPasswordScreen from "../screens/user/UserForgotPasswordScreen";

import AdminNavigation from "./AdminNavigation";
import VendorNavigation from "./VendorNavigation";

import { navigationRef } from "../navigationRef";

import Constants from "expo-constants";
import { getVersion } from "../services/APIServices";
import VersionControl from "../screens/VersionControl";

const Stack = createStackNavigator();
const Navigation = (props) => {
	// useNotifications();
	// static contextType = AppContext;
	const context = useContext(AppContext);

	const [isSameVersion, setIsSameVersion] = useState(true);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true)
		getVersion('admin').then((res) => {
			const currentVersion = Constants.manifest.version;
			const currentVersionNO = Constants.manifest.version.replace('.', '').replace('.', '');
			const newVersionNo = res.data.version.replace('.', '').replace('.', '');
			let isSameVersion = Number(currentVersionNO) < Number(newVersionNo) ? false : true;
			setIsSameVersion(isSameVersion)
			setLoading(false)
		}).catch((err) => setLoading(false))
	}, [])

	// render = () => {

	if (context.userData === null && isSameVersion) {
		return (
			<NavigationContainer ref={navigationRef} linking={props.linking}>
				<Stack.Navigator
					initialRouteName={'UserLogin'}
					screenOptions={{
						headerShown: false,
						cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
					}}
				>
					<Stack.Screen name="UserLogin" component={UserLoginScreen} />
					<Stack.Screen name="MobileVerification" component={MobileVerification} />
					<Stack.Screen name="OtpVerification" component={OtpVerification} />
					<Stack.Screen name="UserForgotPassword" component={UserForgotPasswordScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		)
	} else if (context.userData.name.length == 0 || context.userData.email.length == 0 && isSameVersion) {
		return (
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName={'UpdateAccount'}
					screenOptions={{
						headerShown: false,
						cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
					}}
				>
					<Stack.Screen name="UpdateAccount" component={UpdateAccount} />
				</Stack.Navigator>
			</NavigationContainer>
		)
	} else if (context.userData.type == 'admin' || context.userData.type == 'employe' || context.userData.type == 'vender' && isSameVersion) {
		return (
			<NavigationContainer>
				<>
					{isSameVersion ?
						<Stack.Navigator
							screenOptions={{
								headerShown: false,
								cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
							}}>
							{(() => AdminNavigation())()}
						</Stack.Navigator>
						:
						<VersionControl />
					}
				</>
			</NavigationContainer>
		)
	} else if (isSameVersion == false) {
		return (
			<VersionControl />
		)
	}
	// else if(context.userData.type == 'vender') {
	// 	return (
	// 		<NavigationContainer>
	// 			<Stack.Navigator
	// 				screenOptions={{
	// 					headerShown: false,
	// 					cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
	// 				}}>
	// 				{ (() => VendorNavigation())() }
	// 			</Stack.Navigator>
	// 		</NavigationContainer>
	// 	)
	// }
}
// }
export default Navigation;