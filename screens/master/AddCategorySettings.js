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
import { add_category, create_wallet_permission, edit_category, GetEmployes, get_category, get_wallet_permission, update_wallet_permission } from '../../services/APIServices';

export default class AddCategorySettings extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);

        this.state = {
            cat_name: "",
            description: "",
            isLoading: false,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            stateID: 0,
            editedState: this.props.route.params.editedState,
        };
    }
    componentDidMount() {
        // console.log('.....this.props.route.params.data.........', this.props.route.params.data.cat_name);
        if (this.props.route.params.editedState == 1) {
            this.setState({
                cat_name: this.props.route.params.data.cat_name,
                description: this.props.route.params.data.description,
                isLoading: true
            })
            this.GetCategory(this.props.route.params.data.category_id)
        }
    }
    GetCategory = (id) => {
        this.setState({ isLoading: true })
        get_category(id).then((res) => {
            console.log('.res................',res)
            this.setState({
                cat_name: res.data[0].cat_name,
                description: res.data[0].description,
            })
        })
            .catch(err => { })
            .finally(() => this.setState({ isLoading: false }))
    }
    setCatData = (data) => {
        this.setState({
            cat_name: data,
        });
    };
    setDescription = (data) => {
        this.setState({
            description: data,
        });
    };
    gotoBack = () => this.props.navigation.goBack();
    ControlSubmit = () => {
        const { cat_name, description } = this.state;
        if (cat_name != '') {
            let data = {
                cat_name: cat_name,
                description: description,
                created_by: this.context.userData.id
            }
            console.log('........data.......', data)
            this.setState({ isLoading: true })
            add_category(data).then(res => {
                console.log('........res.......', res)
                this.gotoBack()
            }).catch(err => {
                console.log('........err.......', err)
            }).finally(() => this.setState({ isLoading: false }))
        } else {
            alert('category name required')
        }
    }
    ControlEditSubmit = () => {
        const { cat_name, description } = this.state;
        let data = {
            id: this.props.route.params.data.category_id,
            cat_name: cat_name,
            description: description,
            created_by: this.context.userData.id
        }
        this.setState({ isLoading: true })
        edit_category(data).then(res => {
            // console.log('........res.......',res)
            this.gotoBack()
        }).catch(err => {
            console.log('........err.......', err)
        }).finally(() => this.setState({ isLoading: false }))
    }
    render() {
        return (
            <SafeAreaView>
                {/* <Header title={this.state.editedState == 0 ? 'Add Category Settings' : 'Edit Category Settings'} /> */}
                <Header title={this.state.cat_name} />
                {this.state.isLoading && <OverlayLoader />}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text>Category name :</Text>
                        <TextInput
                            value={this.state.cat_name}
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

