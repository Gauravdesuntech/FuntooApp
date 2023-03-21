import React from "react";
import Navigation from "./navigation/Navigation";
import AppLoading from "expo-app-loading";
import GlobalState from "./context/GlobalState";
import {
	readUserData,
	writeUserData,
	removeUserData,
} from "./utils/Util";
import { getAdminInfo } from "./services/APIServices";
import * as Notifications from "expo-notifications";


import * as Linking from 'expo-linking';
import { NavigationContainer } from "@react-navigation/native";
import { Text, AppState } from "react-native";

const prefix = Linking.createURL('/');

const linking = {
    prefixes: [prefix],
  };

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

//   Notifications.scheduleNotificationAsync({
// 	content: {
// 	  title: "Time's up!",
// 	  body: 'Change sides!',
// 	},
// 	trigger: {
// 	  seconds: 60,
// 	},
//   });

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isReady: false,
			persistantData: null,
		};
		// this.notificationListener = React.createRef();
		// this.responseListener = React.createRef();
	}
	componentDidMount() {
	}

	componentWillUnmount() {
	}


	// 	componentDidMount(){

	// 	    this.notificationListener.current =
	//       Notifications.addNotificationReceivedListener((notification) => {
	//         console.log(
	//           "notification....................................",
	//           notification
	//         );
	// 		this._handleNotification(notification)
	//       });

	//     this.responseListener.current =
	//       Notifications.addNotificationResponseReceivedListener((response) => {
	//         console.log("response....................................", response);
	// 		if(response.request.content.data.notification_type == 'admin'){
	// 				console.log('......press nav.........');
	// 				()=>this.props.navigation.navigate("EventEnquiryDetail", { id: response.request.content.data.id })
	// 			}
	//       });
	//   };

	//   _handleNotification = response => {

	//     // const data = response.notification.request.content;
	//     console.log('...............response.notification...................',response.request.content.data);
	// 	// 
	//     // if (data.type === "new_message") {
	//     //    // navigate to MessageScreen with data.id as param
	//     // } else {
	//     //    // do something else based on the type or...
	//     // }
	// };

	//   componentWillUnmount = () => {
	//     Notifications.removeNotificationSubscription(
	//       this.notificationListener.current
	//     );
	//     Notifications.removeNotificationSubscription(this.responseListener.current);
	//   };

	loadPersistantData = () => {
		readUserData().then((data) => {
			if (data !== null) {
				getAdminInfo(data.phone)
					.then((response) => {
						let persistObj = null;
						if (response !== null) {
							persistObj = { ...data, ...response };
							writeUserData(persistObj);
							// console.log("..........persistObj....app........", persistObj)
						} else {
							removeUserData();
						}

						this.setState({
							persistantData: persistObj,
							isReady: true,
						});
					})
					.catch((error) => console.log(error));
			} else {
				this.setState({
					persistantData: data,
					isReady: true,
				});
			}
		});
	};

	onFinish = () => null;

	render = () =>
		!this.state.isReady  ? (
			<AppLoading
				startAsync={this.loadPersistantData}
				onFinish={this.onFinish}
				onError={(err) => console.log(err)}
			/>
		) : (
			<>
					<GlobalState persistantData={this.state.persistantData}>
						<Navigation linking={linking}/>
					</GlobalState>
			</>
		);
}