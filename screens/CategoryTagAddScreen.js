import React from "react";
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Modal,
    Dimensions,
    TouchableOpacity,
    Alert,
    ScrollView,
    TextInput,
    RefreshControl,
    SafeAreaView
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import { Header} from "../components";
import { Dropdown } from 'react-native-element-dropdown';
import Loader from "../components/Loader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { CreateCategoryTag, DeleteCategoryTag, CategoryTagList } from "../services/CategoryService";
import { TagList } from "../services/TagApiServices";

export default class CategoryTagAddScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.route.params?.data,
            list: [],
            tags: [],
            id: "",
            cat_id: "",
            tag_id: "",
            tag_for: "",
            name: "",

            isModalOpen: false,
            refreshing: false,

            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }

    componentDidMount = () => {

        let data = this.state.data;
        this.setState({
            cat_id: data?.cat_id,
            tag_for: data?.tag_for

        });
        this.TagList();

    }


    TagList() {
        this.setState({
            isLoading: true
        });

        TagList().then(res => {
            this.setState({
                isLoading: false,
                tags: res.data
            });
        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }


    CreateCategoryTag() {
        let model = {
            cat_id: this.state.cat_id,
            tag_id: this.state.tag_id,
            tag_for: this.state.tag_for
        };

        //console.log(model);
        this.setState({
            isLoading: true
        });

        CreateCategoryTag(model).then(res => {
            this.setState({
                isLoading: false,
            });
            this.setState({
                isLoading: false
            });
            if (res.is_success) {
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message
                });
                this.gotoBack();
            } else {
                this.setState({
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: res.message
                })
            }



        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }



    ControlSubmit = () => {
        this.CreateCategoryTag();
    }


    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };


    editPart = (item) => {
        this.setState({
            id: item.id,
            tag_id: item.tag_id,
            game_id: item.game_id,
            name: item.name,
            isModalOpen: true,
        });
    }

    toggleModal = () =>
        this.setState({
            id: "",
            tag_id: "",
            name: "",
            isModalOpen: !this.state.isModalOpen,
        });

    onRefresh = () => {
        this.setState({ refreshing: true }, () => { this.CategoryTagList() })
    }

    gotoBack = () => this.props.navigation.goBack();

    SetTagId = (v) => {
        this.setState({
            tag_id: v.id,
            name: v.name,
        });
    };



    render() {
        let title = "";
        if (this.state.tag_for == "cat") {
            title = "Category Tag Add";
        } else {
            title = "Sub Category Tag"
        }
        return (
            <SafeAreaView style={styles.container}>
                <Header title={title}/>
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLable}>Tag</Text>
                        <Dropdown
                            value={this.state.name}
                            data={this.state.tags}
                            style={styles.textInput}
                            
                            inputSearchStyle={styles.inputSearchStyle}
                                                // placeholderStyle={styles.textInput}
                                                // selectedTextStyle={styles.textInput}
                            search
                            labelField="name"
                            valueField="name"
                            placeholder={!this.state.name ? 'Select Tag' : '...'}
                            searchPlaceholder="Search..."
                            onChange={this.SetTagId}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={this.ControlSubmit}
                    >
                        <Text style={{ fontSize: 18, color: Colors.white }}>
                            {this.state.id ? "UPDATE" : "ADD"}
                        </Text>
                    </TouchableOpacity>
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
        )
    }

}



const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    lsitContainer: {
        flex: 1,
    },
    card: {
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderColor: Colors.textInputBorder,
    },
    qtyContainer: {
        width: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    titleText: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.textColor,
        marginBottom: 2,
    },
    subText: {
        fontSize: 13,
        color: Colors.textColor,
        // opacity: 0.9,
        marginBottom: 2,
    },
    modalOverlay: {
        justifyContent: "center",
        alignItems: "center",
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.white,
    },
    itemModalContainer: {
        flex: 1,
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.white,
    },
    itemModalHeader: {
        height: 55,
        flexDirection: "row",
        width: "100%",
        backgroundColor: Colors.primary,
        elevation: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    headerBackBtnContainer: {
        width: "15%",
        height: 55,
        paddingLeft: 5,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    headerTitleContainer: {
        width: "70%",
        paddingLeft: 20,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
    },
    itemModalBody: {
        flex: 1,
        height: windowHeight - 55,
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
        marginBottom: 10,
        // opacity: 0.8,
    },
    textInput: {
borderWidth:1,
        padding: 9,
        fontSize: 14,
        width: "100%",
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
    },
    inputSearchStyle: {
		height: 40,
		fontSize: 16,
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