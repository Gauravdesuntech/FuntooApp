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
import { add_subcategory, create_wallet_permission, edit_subcategory, GetEmployes, get_all_category, get_wallet_permission, update_wallet_permission } from '../../services/APIServices';

export default class AddsubCategorySettings extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);

        this.state = {
            cat_name: "",
            cat_id: "",
            subcat_name: "",
            description: "",
            isLoading: false,
            Allcategorys: [],
            parent_cat: '',
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            stateID: 0,
            editedState: this.props.route.params.editedState,
            allData:[],
        };
    }
    componentDidMount() {
        this.setState({
            allData:this.props.route.params.allData,
            cat_name: this.props.route.params.allData.category_name,
            cat_id: this.props.route.params.allData.category_id,
        })
        this.GetAllCategory()
        if (this.props.route.params.editedState == 1) {
            this.setState({
                subcat_name: this.props.route.params.data.val,
                description: this.props.route.params.data.description,
                // parent_cat: this.props.route.params.data.parent_cat,
                isLoading: true
            })
        }
    }
    GetAllCategory = () => {
        this.setState({ isLoading: true })
        get_all_category().then((res) => {
            // console.log('..........categoryd........', res.data)
            let data = []
            res.data.map((item) => {
                let obj = {
                    id: item.id,
                    name: item.cat_name
                }
                data.push(obj)
            })
            // console.log('..........data........', data)
            this.setState({ Allcategorys: data })
            // if(this.props.route.params.editedState == 1){
            //     this.Parent_Cat(this.props.route.params.data.parent_cat)
            // }
        }).catch(err => { }).finally(() => this.setState({ isLoading: false }))
    }
    Parent_Cat = (id) => {
        let value = [];
        value = this.state.Allcategorys.filter((item) => {
           if( item.id == id){
            return item
           }
        })
        this.setState({
            cat_name: value[0].name,
            cat_id: value[0].id,
        })
    }
    togglecategoryMenu = () =>
        this.setState({
            iscategoryMenuOpen: !this.state.iscategoryMenuOpen,
        });
    setcategoryData = (data) => {
        this.setState({
            cat_name: data.name,
            cat_id: data.id,
            iscategoryMenuOpen: false,
        });
    };
    setCatData = (data) => {
        this.setState({
            subcat_name: data,
        });
    };
    setDescription = (data) => {
        this.setState({
            description: data,
        });
    };

    gotoBack = () => this.props.navigation.goBack();
    ControlSubmit = () => {
        const { cat_name, cat_id, subcat_name, description } = this.state;
        if (cat_id != '' && subcat_name != '') {
            let data = {
                cat_id: cat_id,
                subcat_name: subcat_name,
                description: description,
            }
            console.log('........data.......',data)
            this.setState({ isLoading: true })
            add_subcategory(data).then(res => {
                console.log('........res.......',res)
                this.gotoBack()
            }).catch(err => {
                console.log('........err.......', err)
            }).finally(() => this.setState({ isLoading: false }))
        } else {
            alert('Invalid entry')
        }
    }
    ControlEditSubmit = () => {
        const { cat_name, cat_id, subcat_name, description } = this.state;
        if (cat_id != '' && subcat_name != '') {
            let data = {
                id: this.props.route.params.data.id,
                cat_id: cat_id,
                subcat_name: subcat_name,
                description: description,
            }
            this.setState({ isLoading: true })
            edit_subcategory(data).then(res => {
                // console.log('........res.......',res)
                this.gotoBack()
            }).catch(err => {
                console.log('........err.......', err)
            }).finally(() => this.setState({ isLoading: false }))
        } else {
            alert('Invalid entry')
        }
    }
    render() {
        return (
            <SafeAreaView>
                <Header title={this.state.editedState == 0 ? 'Add SubCategory Settings' : 'Edit SubCategory Settings'} />
                {this.state.isLoading && <OverlayLoader />}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <InputDropdown
                            label={"Category name :"}
                            value={this.state.cat_name}
                            isOpen={this.state.iscategoryMenuOpen}
                            items={this.state.Allcategorys}
                            openAction={() => this.togglecategoryMenu()}
                            closeAction={() => this.togglecategoryMenu()}
                            setValue={this.setcategoryData}
                            labelStyle={styles.inputLable}
                            textFieldStyle={styles.textInput}
                            placeholder={this.state.cat_name == '' ? 'select Category name' : this.state.cat_name}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>SubCategory name :</Text>
                        <TextInput
                            value={this.state.subcat_name}
                            onChangeText={(data) => this.setCatData(data)}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text>Description:</Text>
                        <TextInput
                            value={this.state.description}
                            onChangeText={(data) => this.setDescription(data)}
                            style={styles.textInput}
                            multiline={true}
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

