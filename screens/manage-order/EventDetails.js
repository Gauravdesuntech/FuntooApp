import React, {Component} from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Dimensions,
	CheckBox,
	Alert,
	TouchableHighlight,
	SafeAreaView
} from "react-native";
import Colors from "../../config/colors";
import moment from "moment";
import AwesomeAlert from 'react-native-awesome-alerts';
import { EventLoadingList, EventLoadingPartList } from "../../services/EventApiService";
import ProofsAndLoadingList from "./ProofsAndLoadingList";

export default class EventDetails extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: this.props?.props.route?.params?.data,
			event_id: this.props?.props.route?.params?.data?.id,
			isSuccessModalOpen: false,
			seeMore: false,
			event_duration: "",

			list: [],
			game_parts: [],
			game_name: "",
			id: "",
			isLoading: true,
			quantity: "",
			isModalOpen: false,

			showAlertModal: false,
			alertMessage: "",
			alertType: ''
		};
	}

	toggleAddItemModal = () => {
		this.setState({
			id: "",
			isModalOpen: !this.state.isModalOpen
		});
	}

	componentDidMount() {
		EventLoadingList(this.state.event_id)
		.then(res => {
			this.setState({
				isLoading: false,
				list: res.data
			});
		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		});
	}

	renderDate = (date) => {
		let ab = "th";
		let day = moment(date, "YYYY-MM-DD").format("D");
		if (day == 1) {
			ab = "st";
		}
		if (day == 2) {
			ad = "nd";
		}
		let month = moment(date, "YYYY-MM-DD").format("MMM");
		let year = moment(date, "YYYY-MM-DD").format("YY");
		let day_name = moment(date, "YYYY-MM-DD").format("dddd");
		return `${day}${ab} - ${month} - ${year} (${day_name})`;
	}

	renderTime = (v_time) => {
		let time = moment(v_time, "HH:mm").format("hh:mm A");
		return `${time}`;
	}

	toggleSeeMore = () => this.setState({ seeMore: !this.state.seeMore });

	getDiffHour = (from, to) => {

		if (!from || !to) {
			return null;
		}
		let stringDate = moment(new Date()).format("YYYY-MM-DD");
		let formDate = new Date(stringDate + "T" + from);
		let toDate = new Date(stringDate + "T" + to);
		var diff = formDate.getTime() - toDate.getTime();
		var msec = diff;

		var hh = Math.floor(msec / 1000 / 60 / 60);
		msec -= hh * 1000 * 60 * 60;
		var mm = Math.floor(msec / 1000 / 60);

		// here using abs becasue we do not want to show the time difference
		// in the negative value
		return `${Math.abs(hh)} hours ${mm} minutes`;
	}

	EventLoadingPartList = (data) => {
		this.setState({
			isLoading: true,
			game_parts: [],
			id: data?.id,
			game_name:data?.game_name,
			quantity:data?.quantity,
			isModalOpen: !this.state.isModalOpen
		});

		EventLoadingPartList(this.state.event_id, data?.game_id)
		.then(res => {
			this.setState({
				isLoading: false,
				game_parts: res.data
		});
		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	renderGameList = ({ item }) => (
		<TouchableHighlight underlayColor={"#eee"}>
			<View style={styles.listRow}>

				<View style={{ width: '40%' }}>

					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity onPress={() => this.EventLoadingPartList(item)}>
							<Text style={styles.title}>{item.game_name}  </Text>
						</TouchableOpacity>
						{item.quantity > 1 && <Text style={styles.title_qnt}>-{item.quantity}</Text>}

					</View>
					<Text style={styles.subText}>
						{"Parts: " + item.total_part}
					</Text>
				</View>

				<View style={{ width: '20%' }}>
					<CheckBox value={item.is_tic ?? false}
						onValueChange={() => this.EventLoadingPartList(item)} />
				</View>

				<View style={{ width: '20%' }}>
					<CheckBox value={item.is_tic ?? false}
						onValueChange={() => this.EventLoadingPartList(item)} />
				</View>

				<View style={{ width: '20%' }}>
					<CheckBox value={item.is_tic ?? false}
						onValueChange={() => this.EventLoadingPartList(item)} />
				</View>
			</View>
		</TouchableHighlight>
	)

	render = () => {
		let model = this.state.data;
		model.event_duration = this.getDiffHour(model.event_end_time, model.event_start_time);
		let event_date = null;
		if (model.event_date) {
			event_date = new Date(model.event_date);
		}
		let setup_date = null;
		if (model.setup_date) {
			setup_date = new Date(model.setup_date);
		}

		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.form}>
					


					<View style={styles.rowContainer}>


						<Text style={[styles.desc, { fontWeight: 'bold', fontSize: 16 }]}>Event :-</Text>
						<Text style={styles.desc}>Date: {this.renderDate(model.event_date)}</Text>
						<Text style={styles.desc}>Playtime: {model.event_duration} </Text>

								{/* 
						<Text style={styles.desc}>
							Play Time: {model.play_time}
						</Text> */}

						<Text style={[styles.desc, { fontWeight: 'bold', fontSize: 16, marginTop: 10 }]}>Setup :-</Text>
						<Text style={styles.desc}>Date: {this.renderDate(model.setup_date)}</Text>
						<Text style={styles.desc}>Time: {this.renderTime(model.setup_start_time)} - {this.renderTime(model.setup_end_time)}</Text>



						<Text style={[styles.desc, { marginTop: 10 }]}>
							# of Guest: {model.no_guest}
						</Text>
						<Text style={styles.desc}>
							# of Kids: {model.no_guest}
						</Text>

						<Text style={styles.desc}>
							Event Type: {model.event_name}
						</Text>

						{/* 
						{!this.state.seeMore &&
							<TouchableOpacity style={{ alignItems: 'flex-end', marginTop: 5 }} onPress={this.toggleSeeMore} >
								<Text style={{ color: Colors.primary }}>{this.state.seeMore ? "Hide" : "Show More"}</Text>
							</TouchableOpacity>}

						{this.state.seeMore && <View>

							
						</View>
						} */}

												{/* {this.state.seeMore &&
							<TouchableOpacity style={{ alignItems: 'flex-end', marginTop: 5 }} onPress={this.toggleSeeMore} >
								<Text style={{ color: Colors.primary }}>{this.state.seeMore ? "Hide" : "Show More"}</Text>
							</TouchableOpacity>
						} */}

					</View>


					<View style={styles.rowContainer}>

						<Text style={styles.desc}>
							Venue Name: {model.venue}
						</Text>
						<Text style={styles.desc}>
							Landmark: {model.landmark}
						</Text>
						<Text style={styles.desc}>
							Which Floor is the setup?: {model.floor_name}
						</Text>
						<Text style={styles.desc}>
							Google Location: {model.google_location}
						</Text>
					</View>
					<View style={[styles.rowContainer,{flex: 1, flexDirection: 'row'}]}>
						<ProofsAndLoadingList props={this.props.props} />
					</View>
				</View>

				<AwesomeAlert
					show={this.state.showAlertModal}
					showProgress={false}
					title={this.state.alertType}
					message={this.state.alertMessage}
					closeOnTouchOutside={true}
					closeOnHardwareBackPress={false}
					showCancelButton={false}
					showConfirmButton={true}
					cancelText="cancel"
					confirmText="Ok"
					confirmButtonColor="#DD6B55"
					onCancelPressed={() => {
						this.hideAlert();
					}}
					onConfirmPressed={() => {
						this.hideAlert();
					}}
				/>
			</SafeAreaView>
		);
	}
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	rowContainer: {
		// borderColor: 'silver',
		// borderWidth: 1,
		// borderRadius: 10,
		// padding: 10,
		//width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		elevation: 10,
		margin: 5,

	},
	row: {
		marginTop: 5,
		flexDirection: 'row'
	},
	rowLeft: {
		width: '30%',
		justifyContent: 'center',
		backgroundColor: '#f9f9f9',
		alignItems: 'center'
	},
	rowRight: {
		width: '70%', marginLeft: 5
	},

	activeTab: {
		backgroundColor: Colors.primary,
	},

	activeText: {
		fontWeight: "bold",
		color: 'white',
	},
	inActiveText: {
		color: "silver",
		opacity: 0.8,
	},

	form: {
		flex: 1,
		padding: 8,
	},
	topBtnContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginBottom: 30,
	},
	topBtn: {
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
		marginRight: 15,
	},
	inputContainer: {
		width: "100%",
		marginBottom: 20,
	},
	inputLable: {
		fontSize: 16,
		color: Colors.grey,
		marginBottom: 10,
		opacity: 0.8,
	},
	textInput: {
borderWidth:1,
		padding: 9,
		fontSize: 14,
		width: "100%",
		borderWidth: 1,
		borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
	},
	submitBtn: {
		marginTop: 15,
		height: 45,
		width: "100%",
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
	},

	desc: {
		fontSize: 14,
		color: Colors.grey,
		marginBottom: 3,
		fontWeight: "normal",
		opacity: 0.9,
	}
});
