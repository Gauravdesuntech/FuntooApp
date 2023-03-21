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
    KeyboardAvoidingView,
    Platform,
    SafeAreaView
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header } from "../../components";
import Loader from "../../components/Loader";
import AwesomeAlert from 'react-native-awesome-alerts';
import { VenderList,DeleteVender } from "../../services/VenderApiService";
import EmptyScreen from "../../components/EmptyScreen";
import AppContext from "../../context/AppContext";

export default class VenderScreen extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            isModalOpen: false,
            refreshing: false,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }

    componentDidMount = () => {
        this.VenderList();
        this.focusListner = this.props.navigation.addListener("focus",()=>{this.VenderList()})	
    }
    componentWillUnmount() {
		this.focusListner();
	  }


    VenderList() {
        this.setState({
            isLoading: true
        });

        VenderList().then(res => {
            console.log("......VenderList......",res)
            this.setState({
                isLoading: false,
                list: res.data,
                refreshing: false,
            });

        }).catch((error) => {
            // Alert.alert("Server Error", error.message);
        })
    }

    
    DeleteVender = (id) => {
       if(this.context.userData.action_types.indexOf('Delete') >= 0) 
       {Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this vender?",
            [
              {
                text: "Yes",
                onPress: () => {
                    DeleteVender({id:id}).then(res => {
                        if(res.is_success){
                            this.VenderList();
                        }
            
                    }).catch((error) => {
                        Alert.alert("Server Error", error.message);
                    })
                },
              },
              {
                text: "No",
              },
            ]
          )};
    }


    renderEmptyContainer=()=> {
		return(
			<EmptyScreen/>
		)
	}


    lsitItem = ({ item }) => (
        <View key={item.id.toString()} style={styles.card}>

            <View style={{ paddingLeft: 10, width: "90%" }}>
                <Text style={styles.subText}>Name:  {item.name} ({item.vender_type_name})</Text>
                <Text style={styles.subText}>{"Shop Name: " + item.shop_name}</Text>
                <Text style={styles.subText}>{"Mobile: " + item.mobile}</Text>
            </View>
            <View style={styles.qtyContainer}>
            {this.context.userData.action_types.indexOf('Edit') >= 0 ?
                <TouchableOpacity
                    style={{ padding: 3 }}
                    onPress={()=>this.props.navigation.navigate("VenderAddUpdateScreen",{data:item})}
                >
                    <MaterialIcons name="create" size={22} color={Colors.success} />
                </TouchableOpacity>
:null}
 {this.context.userData.action_types.indexOf('Delete') >= 0 ?
                <TouchableOpacity style={{ padding: 3 }}>
                        <MaterialIcons name="delete" size={22} color={Colors.danger} onPress={this.DeleteVender.bind(this, item.id)} />
                    </TouchableOpacity>
                    :null}
            </View>
        </View>
    );


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="Vendor List" addAction={()=>this.props.navigation.navigate("VenderAddUpdateScreen")} />

                {this.state.isLoading ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={this.state.list}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.lsitItem}
                        initialNumToRender={this.state.list.length}
                        contentContainerStyle={styles.lsitContainer}
                        ListEmptyComponent={this.renderEmptyContainer()}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />
                        }
                    />
                )}

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
        // flex: 1,
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