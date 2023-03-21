import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { Header } from '../../components';
import Colors from '../../config/colors';
import AppContext from "../../context/AppContext";
import OverlayLoader from "../../components/OverlayLoader";
import AwesomeAlert from 'react-native-awesome-alerts';
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import InputDropdown from "../../components/InputDropdown";
import { create_wallet_permission, GetEmployes, get_wallet_permission, update_wallet_permission } from '../../services/APIServices';

export default class AddWalletSettings extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);

        this.state = {
            user_name: "",
            user_id: "",
            isLoading: false,
            AllUsers: [],
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            stateID:0,
            selectedwallet_permissions:[],
            editedState:this.props.route.params.editedState,
        };
    }
    componentDidMount() {
        this.GetAllEmployes()
        // console.log('.....this.props.route.params.editedState.........',this.props.route.params.editedState);
        if(this.props.route.params.editedState == 1){
            this.setState({
                user_name:this.props.route.params.data.user_name,
                user_id:this.props.route.params.data.user_id,
                isLoading:true
            })
            get_wallet_permission(this.props.route.params.data.user_id).then(res=>{
                // console.log('......res.....',res.data[0].user_permissions)
                if(res.is_success == true){
                    this.setState({selectedwallet_permissions:res.data[0].user_permissions})
                }
            }).catch(err=>{}).finally(()=>{this.setState({isLoading:false})})
        }
    }
    GetAllEmployes = () => {
        this.setState({isLoading:true})
        GetEmployes().then((res) => {
            console.log('..........userd........', res)
            this.setState({ AllUsers: res })
        }).catch(err => { }).finally(()=>this.setState({isLoading:false}))
    }
    toggleUserMenu = () =>
        this.setState({
            isUserMenuOpen: !this.state.isUserMenuOpen,
        });
    setUserData = (data) => {
        // console.log("setUserData.............", data)
        this.setState({
            user_name: data.name,
            user_id: data.id,
            isUserMenuOpen: false,
        });
    };
    setWalletPermissions = (item) => {
        // console.log('............selectedwallet_permissions..........',item);
        this.setState({ selectedwallet_permissions: item });
    };
    gotoBack = () => this.props.navigation.goBack();
    ControlSubmit=()=>{
        const {selectedwallet_permissions,user_name,user_id}=this.state;
        let selectedwallet_id = [];
        for(let i = 0; i < selectedwallet_permissions.length ; i++ ){
            selectedwallet_id.push(selectedwallet_permissions[i].id)
        }
        let data = {
            user_id:user_id,
            user_name:user_name,
            user_permission_id:selectedwallet_id.join()
        }
        // console.log('........data.......',data)
        this.setState({isLoading:true})
        create_wallet_permission(data).then(res=>{
            // console.log('........res.......',res)
            this.gotoBack()
        }).catch(err=>{
            console.log('........err.......',err)
        }).finally(()=>this.setState({isLoading:false}))
    }
    ControlEditSubmit=()=>{
        const {selectedwallet_permissions,user_name,user_id}=this.state;
        let selectedwallet_id = [];
        for(let i = 0; i < selectedwallet_permissions.length ; i++ ){
            selectedwallet_id.push(selectedwallet_permissions[i].id)
        }
        let data = {
            id:this.props.route.params.data.id,
            user_id:user_id,
            user_name:user_name,
            user_permission_id:selectedwallet_id.join()
        }
        this.setState({isLoading:true})
        update_wallet_permission(data).then(res=>{
            // console.log('........res.......',res)
            this.gotoBack()
        }).catch(err=>{
            console.log('........err.......',err)
        }).finally(()=>this.setState({isLoading:false}))
    }
    render() {
        return (
            <SafeAreaView>
                <Header title={this.state.editedState == 0 ?'Add Wallet Settings' : 'Edit Wallet Settings'} />
                {this.state.isLoading && <OverlayLoader />}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <InputDropdown
                            label={"User name :"}
                            value={this.state.user_name}
                            isOpen={this.state.isUserMenuOpen}
                            items={this.state.AllUsers}
                            openAction={this.toggleUserMenu}
                            closeAction={this.toggleUserMenu}
                            setValue={this.setUserData}
                            labelStyle={styles.inputLable}
                            textFieldStyle={styles.textInput}
                            placeholder={this.state.user_name == '' ? 'select employe name' : this.state.user_name}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <MultiSelectDropdown
                            label={"Wallet Permissions :"}
                            items={this.state.AllUsers}
                            selectedItems={this.state.selectedwallet_permissions}
                            labelStyle={styles.name}
                            placeHolderContainer={styles.placeholderStyle}
                            placeholderStyle={styles.placeholderStyle}
                            selectedItemsContainer={styles.selectedItemsContainer}
                            onSave={this.setWalletPermissions}
                        />
                    </View>
            
              {this.state.editedState == 1 ? (
                        <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={this.ControlEditSubmit}
                      >
                <Text style={{ fontSize: 18, color: Colors.white }}>
                  {" "}
                  Edit{" "}
                </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                style={styles.submitBtn}
                onPress={this.ControlSubmit}
              >
                <Text style={{ fontSize: 18, color: Colors.white }}>
                  {" "}
                  Save{" "}
                </Text>
            </TouchableOpacity>
              )}
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
                        this.onConfirm();
                    }}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    form: {
        padding: 8,
    },
    heading: {
        fontSize: 16,
        color: Colors.textColor,
        fontWeight: "bold",
        marginVertical: 30,
        alignSelf: "center",
    },
    inputContainer: {
        width: "100%",
        marginBottom: 25,
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between'
    },
    inputLable: {
        fontSize: 16,
        color: Colors.textColor,
        // width: "50%",
        // marginHorizontal: 10,
        // opacity: 0.8,
    },
    textInput: {
        borderWidth: 1,
        padding: 9,
        fontSize: 14,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
        alignItems: 'center',
        // marginHorizontal: 10,
    },
    placeholderStyle: {
        padding: 5,
        fontSize: 14,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.white,
        color: Colors.textColor,
        opacity: 0.7
    },
    selectedItemsContainer: {
        padding: 5,
        fontSize: 14,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
        alignItems: 'flex-start'
        // marginHorizontal: 10,
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
    name: {
        fontSize: 16,
        color: Colors.textColor,
    },
});

