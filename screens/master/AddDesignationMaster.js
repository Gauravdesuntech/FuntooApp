import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	Image,
	SafeAreaView,
} from "react-native";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import Configs from "../../config/Configs";
import Checkbox from "../Checkbox";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import { addDesignation } from "../../services/APIServices";
import AppContext from "../../context/AppContext";

export default class AddDesignationMaster extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		console.log("..............",this.props.route.params?.data)
		this.state = {
			stateID: this.props.route.params.data == null ? 0 : 1 ,
			headerTitle: this.props.route.params.data == null ?"Add Designation": "Edit Designation" ,
			data: this.props.route.params.data,
			DesignationName: "",
			areaNameValidationFailedValidationFailed: false,
			isLoading: false,
			showAlert: false,
			check: '',
			message: '',
			selectedActionTypes: [],
			actionTypesValidationFailed: false,
			ModulePermissionsValidationFailed: false,
			OrderPermissionsValidationFailed: false,
			modulePermissions: [],
			orderPermissions: [],
			selectedModulePermissions: [],
			selectedOrderPermissions: [],
			overlay_loader:false,
			formErrors: {},
		};
	}

	showAlert = () => {
		this.setState({
		  showAlert: true
		});
	  };

	  hideAlert = () => {
		this.setState({
		  showAlert: false
		});
		this.props.navigation.goBack()
	  };

	
	  componentDidMount(){
		if(this.state.stateID == 1){
			let selectedModulePermissions = Configs.HOME_SCREEN_MENUES.filter((element) =>
						(this.state.data.menu_permission || []).includes(element.id)
					);
					let selectedOrderPermissions = Configs.MANAGE_ORDER_TABS.filter((element) =>
					(this.state.data.order_details_permission  || []).includes(
					  element.id
					)
					);
					console.log(".................adffa....selectedOrderPermissions...........",selectedOrderPermissions)
					this.setState({
						modulePermissions: Configs.HOME_SCREEN_MENUES,
						orderPermissions: Configs.USER_ORDER_DETAILS,
						selectedModulePermissions : selectedModulePermissions,
						selectedOrderPermissions : selectedOrderPermissions,
						selectedActionTypes :this.state.data.action_types,
						DesignationName:this.state.data.name
					  })
					}else{
						this.setState({
							modulePermissions: Configs.HOME_SCREEN_MENUES,
							orderPermissions: Configs.USER_ORDER_DETAILS,
						  })
					}
	  }
	gotoBack = () => this.props.navigation.goBack();

	setActionType = (type) => {
		let { selectedActionTypes } = this.state;

		if (selectedActionTypes.includes(type)) {
			selectedActionTypes = selectedActionTypes.filter(
				(element) => element !== type
			);
		} else {
			selectedActionTypes.push(type);
		}

	this.setState({ selectedActionTypes });
    console.log(selectedActionTypes.join(","),)
	};

  setSelectedModulePermissions = (item) => {this.setState({ selectedModulePermissions: item});
// console.log(this.state.selectedModulePermissions)
}
setSelectedOrderPermissions = (item) => {
    this.setState({ selectedOrderPermissions: item });
    // // console.log(this.state.selectedOrderPermissions);
  };
  ValidateData() {
	let errors = {};
 if (!this.state.DesignationName || this.state.DesignationName == "") {
      errors.DesignationName = "designation name is required";
    }
    if (this.state.selectedActionTypes.length === 0) {
      this.setState({ actionTypesValidationFailed: true });
    }
    if (this.state.selectedModulePermissions.length === 0) {
      this.setState({ ModulePermissionsValidationFailed: true });
    }
    if (this.state.selectedOrderPermissions.length === 0) {
      this.setState({ OrderPermissionsValidationFailed: true });
    }
    this.setState({
      formErrors: {},
    });
    if (Object.keys(errors).length != 0) {
      this.setState({
        formErrors: errors,
      });

      return false;
    }

    return true;
  }

    submit = () => {
		if (this.ValidateData()) {
			this.setState({
				overlay_loader:true
			})
		let userModulePermissions = this.state.selectedModulePermissions.map((v, i) => v.id);
		let userOrderPermissions = this.state.selectedOrderPermissions.map(
			(v, i) => v.id
		  );
// 		console.log( "menu_permission:",userModulePermissions.join(","))
// 		console.log( "action_types:", this.state.selectedActionTypes.join(","))
// console.log(".............this.state.Designation............",this.state.DesignationName)
let obj={
	id: this.state.stateID == 1 ? this.state.data.id : 0 ,
	name:this.state.DesignationName,
	menu_permission: userModulePermissions.join(","),
	order_permission: userOrderPermissions.join(","),
	action_types:this.state.selectedActionTypes.join(","),
  };
addDesignation(obj).then((response) => {
console.log("response................",response)
this.setState({
	overlay_loader:false
  })
this.props.navigation.navigate("Designation");
}).catch((error) => {console.log(error)
	this.setState({
		overlay_loader:false
	  })
});
		}
};




	render = () => {
		const {showAlert, isLoading} = this.state;
		if(isLoading){
			return (
				<OverlayLoader />
			)
		}
		return(
		<SafeAreaView style={styles.container}>
			<Header title={this.state.headerTitle} />
			{this.state.overlay_loader ?
        <OverlayLoader />
        :
			<View style={styles.form}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Designation:</Text>
						{this.state.stateID == 1 ?
						<TextInput
							value={this.state.DesignationName}
							autoCompleteType="off"
							autoCapitalize="words"
							style={[
								styles.textInput,
								this.state.areaNameValidationFailedValidationFailed ? styles.inputError : null,
								{color: Colors.textColor,}
							]}
							onChangeText={(data) => this.setState({ DesignationName:data })}
						/>

						:
						<TextInput
						value={this.state.Designation}
						autoCompleteType="off"
						autoCapitalize="words"
						style={[
							styles.textInput,
							this.state.areaNameValidationFailedValidationFailed ? styles.inputError : null,
							{color: Colors.textColor,}
						]}
						onChangeText={(DesignationName) => this.setState({ DesignationName })}
					/>
	}
	{this.state.formErrors.DesignationName && (
                  <Text style={{ color: "red" }}>
                    {this.state.formErrors.DesignationName}
                  </Text>
                )}
					</View>
					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>Action Type:</Text>
						<View
							style={{
								flexDirection: "row",
							}}
						>
							{Configs.USER_ACTION_TYPES.map((item) => (
								<Checkbox
									key={item.id}
									activeOpacity={1}
									label={item.name}
									checked={this.state.selectedActionTypes.includes(item.id)}
									checkedColor={Colors.primary}
									uncheckedColor={Colors.primary}
									onChange={this.setActionType.bind(this, item.id)}
									labelStyle={[styles.mb0,{fontSize: 16,
                    color: Colors.textColor,}]}
								/>
                // <Text>{item.name}</Text>
							))}
						</View>
						{this.state.actionTypesValidationFailed ? (
							<Text style={{ color: "red" }}>
								Choose atleast one action type
							</Text>
						) : null}
					</View>
        
          <View style={styles.inputLable}>
		  <MultiSelectDropdown
							label={"Module Permissions"}
							items={this.state.modulePermissions}
							selectedItems={this.state.selectedModulePermissions}
							labelStyle={styles.inputLable}
							placeHolderContainer={styles.textInput}
							placeholderStyle={styles.placeholderStyle}
							selectedItemsContainer={styles.textInput}
							onSave={this.setSelectedModulePermissions}
						/>
						  {this.state.ModulePermissionsValidationFailed ? (
                <Text style={{ color: "red" }}>
                  Choose atleast one Module Permissions
                </Text>
              ) : null}
					</View>

					<View style={styles.inputLable}>
              <MultiSelectDropdown
                label={"Order Permissions"}
                items={this.state.orderPermissions}
                selectedItems={this.state.selectedOrderPermissions}
                labelStyle={styles.inputLable}
                placeHolderContainer={styles.textInput}
                placeholderStyle={styles.placeholderStyle}
                selectedItemsContainer={styles.textInput}
                onSave={this.setSelectedOrderPermissions}
              />
			  {this.state.OrderPermissionsValidationFailed ? (
                <Text style={{ color: "red" }}>
                  Choose atleast one Order Permissions
                </Text>
              ) : null}
            </View>

					<TouchableOpacity style={styles.submitBtn} onPress={this.submit}>
					{this.state.stateID == 1 ?
						<Text style={{ fontSize: 18, color: Colors.white }}> Edit </Text>
						:
						<Text style={{ fontSize: 18, color: Colors.white }}> Save </Text>
					}
					</TouchableOpacity>
				</ScrollView>
				<AwesomeAlert
					show={showAlert}
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
			</View>
	}
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
	iconPickerContainer: {
		flexDirection: "row",
		marginVertical: 10,
		alignItems: "center",
		justifyContent: "space-between",
	},
	imageContainer: {
		borderColor: "#ccc",
		borderWidth: 1,
		padding: 3,
		backgroundColor: "#fff",
		borderRadius: 5,
	},
	image: {
		height: 50,
		width: 50,
	},
	inputContainer: {
		width: "100%",
		marginBottom: 20,
	},
	inputLable: {
		fontSize: 16,
		color: Colors.textColor,
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
		height: 50,
		width: "100%",
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
	},
	inputError: {
		borderWidth: 1,
		borderColor: Colors.danger,
	}
});
