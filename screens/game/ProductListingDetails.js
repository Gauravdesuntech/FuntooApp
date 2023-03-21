import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	SafeAreaView
} from "react-native";
import Colors from "../../config/colors";
import { Header, } from "../../components";
import { Dropdown } from 'react-native-element-dropdown';
import AwesomeAlert from 'react-native-awesome-alerts';

import { AddGameListDetail,UpdateGameListDetail } from "../../services/GameApiService";
import {VenderList} from "../../services/VenderApiService";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

 const types = [
    {name:"In House",id:0},
    {name:"Third Party",id:1}
]

export default class ProductListingDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data:this.props.route.params.data,
			id:null,
			game_id:"",
			type:"",
			type_name:"",
			vender_id:"",
			vender_name: "",
			item_name: "",
			minimum_quantity: "",
			maximum_quantity: "",
			rate_per_unit: "",
			margin: "",
			rent: this.props.route.params.game_rent_to_customer,
			types:types,
			venders:[],
			showAlertModal: false,
            alertMessage: "",
			alertType: '',
		};
		
	}

	componentDidMount = () => {
		let d = this.state.data;
		let type_name=null;
		if(d.type==1){
			type_name="Third Party";
		}else {
			type_name="In House";
		}
		this.setState({
			id:d.id,
			game_id:d.game_id,
			type:d.type,
			vender_name: d.vender_name,
			item_name: d.item_name,
			minimum_quantity: d.minimum_quantity,
			maximum_quantity: d.maximum_quantity,
			rate_per_unit: d.rate_per_unit,
			margin: d.margin,
			// rent: d.rent,
			type_name:type_name
		});

		this.Initialize();
		this.focusListner = this.props.navigation.addListener("focus", () => { this.Initialize() })
	}


	componentWillUnmount() {
		this.focusListner();
	}


	
	Initialize() {
		this.VenderList();
	}
	VenderList() {
		this.setState({
			isLoading: true
		});

		VenderList().then(res => {
			this.setState({
				isLoading: false,
				venders: res.data
			});

		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}

	gotoBack = () => this.props.navigation.goBack();


	AddGameListDetail () {
		let state=this.state;
		let model = {
			id:state.id,
			game_id:state.game_id,
			type:state.type,
			vender_id:state.vender_id,
			item_name:state.item_name,
			minimum_quantity: state.minimum_quantity,
			maximum_quantity: state.maximum_quantity,
			rate_per_unit:state.rate_per_unit,
			margin:state.margin,
			rent:state.rent
	
		};
		this.setState({
			isLoading: true
		});
	
		AddGameListDetail(model).then(res => {
			this.setState({
				isLoading: false,
			});
	
			if (res.is_success) {
				this.props.navigation.goBack();
			}else{
				this.setState({
					showAlertModal:true,
                    alertType:"Error",
                    alertMessage:res.message
				})
			}
		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}
	
	
	UpdateGameListDetail () {
		let state = this.state;
		let model = {
			id:state.id,
			game_id:state.game_id,
			type:state.type,
			vender_id:state.vender_id,
			item_name:state.item_name,
			minimum_quantity:state.minimum_quantity,
			maximum_quantity: state.maximum_quantity,
			rate_per_unit:state.rate_per_unit,
			margin:state.margin,
			rent:state.rent
	
		};
		this.setState({
			isLoading: true
		});
	
		UpdateGameListDetail(model).then(res => {
			this.setState({
				isLoading: false,
			});

			if (res.is_success) {
				this.props.navigation.goBack();
			}else {
				this.setState({
					showAlertModal:true,
                    alertType:"Error",
                    alertMessage:res.message
				})
			}
		}).catch((error) => {
			Alert.alert("Server Error", error.message);
		})
	}
	
	ControlSubmit=()=> {
		if(this.state.id){
			this.UpdateGameListDetail();
			return;
		}
		this.AddGameListDetail();
	}

	setType = (v) => {
		this.setState({
			type: v.id,
			type_name: v.name,
		});
	};

	setVenderId = (v) => {
		this.setState({
			vender_id: v.id,
			vender_name: v.name,
		});
	};


	SetModelValue = (name, text) => {
		if (!name) {
		  return alert("propertyName undefined")
		}

		this.setState({
			[name]:text
		})
	
	  }
	

	render = () => {
		return(
		<SafeAreaView style={styles.container}>
			<Header title="Product Listing Details" />
			<View style={styles.form}>
				<KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

					<View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Type:</Text>
							<Dropdown
								value={this.state.type_name}
								data={this.state.types}
								onChange={this.setType}
								style={styles.textInput}
								inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
								search
								labelField="name"
								valueField="name"
								placeholder={!this.state.type_name ? 'Select Sub Type Name' : '...'}
								searchPlaceholder="Search..."
							/>
					</View>

					{this.state.type==1 && <View style={styles.inputContainer}>
							<Text style={styles.inputLable}>Vender:</Text>
							<Dropdown
								value={this.state.vender_name}
								data={this.state.venders}
								onChange={this.setVenderId}
								style={styles.textInput}
								inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
								search
								labelField="name"
								valueField="name"
								placeholder={!this.state.vender_name ? 'Select Vender' : '...'}
								searchPlaceholder="Search..."
							/>
					</View>}

					
					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Item Name:</Text>
						<TextInput
							value={this.state.item_name}
							autoCompleteType="off"
							autoCapitalize="words"
							style={styles.textInput}
							onChangeText={(item_name) => this.setState({ item_name })}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Minimum Quantity:</Text>
						<TextInput
							value={this.state.minimum_quantity}
							autoCompleteType="off"
							autoCapitalize="words"
							style={styles.textInput}
							onChangeText={(minimum_quantity) => this.setState({ minimum_quantity })}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Maximum Quantity:</Text>
						<TextInput
							value={this.state.maximum_quantity}
							autoCompleteType="off"
							autoCapitalize="words"
							style={styles.textInput}
							onChangeText={(maximum_quantity) => this.setState({ maximum_quantity })}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Rate Per Unit:</Text>
						<TextInput
							value={this.state.rate_per_unit}
							autoCompleteType="off"
							autoCapitalize="words"
							style={styles.textInput}
							onChangeText={(rate_per_unit) => this.setState({ rate_per_unit })}
							onEndEditing={ (e) => {
								// calculate margin here
								const customerPrice = parseFloat(this.state.rent);
								const rate= parseFloat(this.state.rate_per_unit);
								const totalMargin = Math.round(((customerPrice - rate) / customerPrice) * 100);

								this.setState({ margin: totalMargin.toString() });
							}}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Margin (%):</Text>
						<TextInput
							value={this.state.margin}
							autoCompleteType="off"
							autoCapitalize="words"
							style={styles.textInput}
							editable={false}
							onChangeText={(margin) => this.setState({ margin })}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Rent to Customer:</Text>
						<TextInput
							value={this.state.rent}
							autoCompleteType="off"
							autoCapitalize="words"
							editable={false}
							style={styles.textInput}
							onChangeText={(rent) =>
								this.setState({ rent })
							}
						/>
					</View>

					<TouchableOpacity style={styles.submitBtn} onPress={this.ControlSubmit}>
						<Text style={{ fontSize: 18, color: Colors.white }}>SUBMIT</Text>
					</TouchableOpacity>
				</KeyboardAwareScrollView>
			</View>
			<AwesomeAlert
                    show={this.state.showAlertModal}
                    showProgress={false}
                    title={this.state.check}
                    message={this.state.message}
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
	)};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
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
	},
	inputContainer: {
		width: "100%",
		marginBottom: 20,
	},
	inputLable: {
		fontSize: 16,
		color: Colors.textColor,
		marginBottom: 10,
		// opacity: 0.8,
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
});
