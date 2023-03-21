import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableHighlight,
    Image,
    FlatList,
    SafeAreaView,
    RefreshControl,
    Alert,
    ActivityIndicator,
    Modal,
    TextInput,
    Dimensions,

} from "react-native";
import { Ionicons, AntDesign, } from "@expo/vector-icons";
import Colors from "../config/colors";
import Header from "../components/Header";
import Configs from "../config/Configs";
import EmptyScreen from '../components/EmptyScreen';
import { Wishlist, WishlistDelete } from "../services/WishlistService";
import AppContext from "../context/AppContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import CachedImage from 'expo-cached-image';
import Loader from "../components/Loader";
import { SearchAllType } from "../services/GameApiService";
import AwesomeAlert from "react-native-awesome-alerts";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import PressableButton from "../components/PressableButton";
import { TouchableWithoutFeedback } from "react-native";

/*
*
*share pdf 
*created by - Rahul Saha
*created on - 08.12.22
*updated on - 03.03.23
*
*/

const htmlRender = (item, gameData, event, data) => {
    let html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Wrangler Bull Html Page</title>
        <style>
            @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");
    
            * {
                margin: 0;
                padding: 0;
            }
        </style>
    </head>
    
    <body style="background: white;">
        <main style="font-family: 'Roboto', sans-serif">   
        <div>`
    item.forEach(element => {
        html += `<img src="${Configs.NEW_COLLECTION_URL + element.image}" style="width:70%; height:70%;margin:0 auto;display:block;">
        <div style="text-align: center;margin-top: 20px;">
            <h2><strong>${element.name}</strong></h2>
            <h3>(Product ID: G000${element.id})</h3>
        </div>`
        if (element.description != "") {
            html += `<div style="font-size: 12px;padding:0 5px;margin-top:25px;">
        <p style="font-size:24px">${element.description} </p>
       </div>`
        }
        html += `<div style="padding:0 5px;display: flex;flex-wrap: wrap;">`
        element?.images?.forEach(data => {
            if (data.image != null) {
                let gameImageurl = Configs.GAME_GALLERY_IMAGE_URL + data.image
                html += `<div style="border:1px solid lightgray;padding: 5px; width:150px;height:120px;margin:10px 6px 0 0;font-size: 12px;">
         <img src="${gameImageurl}" style="width: 100%;height: 100%;">
         </div> `
            }
        });
        html += `</div>`
        if (data) {
            html += `
        <div style="display:flex;font-size:12px;padding:5px;margin-top:5px;align-items: center;">
            <p style="margin-right:5px;font-size:24px">Rent: ₹${Math.trunc(element.rent)}</p> 
        </div>`}
        html += `
        <div style="display:flex;font-size:12px;padding:5px;margin-top:5px;align-items: center;">
           <p style="margin-right:5px;font-size:24px">Size: ${element.size}</p> 
        </div>

       <div style="display:flex;font-size:12px;padding:5px;margin-top:5px;align-items: center;">
            <p style="margin-right:5px;font-size:24px">Tags:</p>`
        element?.tags?.forEach(data => {

            html += ` <div style="border:1px solid lightgray;padding:2px;font-size:24px;margin-right:5px;border-radius:2px;">
                       ${data.name}
                       </div> `
        });
        html += `</div>`
    });
    html += `</div>
        </main>
    </body>
    
    </html>`;

    const export_data = async () => {
        const { uri } = await Print.printToFileAsync({
            html,
        });
        await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    };


    if (data != null) {
        export_data()
    }

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            // onPress={export_data}
            onPress={event}
            style={{ padding: 5 }}
        >
            <AntDesign name="export" size={22} color={Colors.white} />
        </TouchableOpacity>
    );
};


export default class WishList extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.searchInput = React.createRef();
        this.state = {
            data: this.props?.route?.params?.data,
            list: [],
            isLoading: true,
            refreshing: false,
            isModalOpen: false,
            searchlist: [],
            query: "",
            searchValue: '',
            isSearching: false,
            showAlertModal: false,
            alertMessage: "",
            alertType: "",
        };
    }

    componentDidMount = () => {
        // console.log('.......this.props?.route?.params?.data............', this.props?.route?.params?.data);
        this.focusListner = this.props.navigation.addListener("focus", () => { this.loadCategoryList() })
        this.getList();
    };

    componentWillUnmount() {
        this.focusListner();
    }

    loadCategoryList = () => {
        this.getList();
    };

    getList = () => {
        Wishlist(this.state.data.id)

            .then((response) => {
                // console.log('......response.....',response);
                this.setState({
                    list: response.data,
                    isLoading: false,
                    refreshing: false,
                });
            })
            .catch((err) => {
                Alert.alert("Warning", "Network error");
            });
    }

    onRefresh = () => {
        this.setState({ refreshing: true }, () => { this.getList() })
    }

    Delete = (id) => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this game?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        WishlistDelete({ id: id }).then(res => {
                            if (res.is_success) {
                                this.getList();
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
        );
    }

    gotGameDetail = (item) => {
        this.props.navigation.navigate("GameDetails", { game_id: item.id, name: item.name });
    }

    renderEmptyContainer = () => {
        return (
            <EmptyScreen props={this.props} />
        )
    }

    AddWishlist = () => {
        this.props.navigation.navigate("Wishlist_GameSearch", { data: this.props?.route?.params?.data })
    }

    withRentpdf = () => {
        this.setState({ isModalOpen: this.state.isModalOpen })
        htmlRender(this.state.list, null, this.ModalOpen(), true)
    }
    withoutRentpdf = () => {
        this.setState({ isModalOpen: this.state.isModalOpen })
        htmlRender(this.state.list, null, this.ModalOpen(), false)
    }

    /*
    *
    *updated by - Rahul Saha
    *updated on - 06.12.22 
    * 
    */

    renderListItem = ({ item }) => {
        // console.log("fxbhfhbsfnb..........", item)
        let url = '';
        if (item.game_image != '') {
            url = Configs.NEW_COLLECTION_URL + item.image;
        } else {
            url = 'https://www.osgtool.com/images/thumbs/default-image_450.png';
        }

        return (

            <TouchableOpacity style={styles.card}
                onPress={() => this.gotGameDetail(item)}
                onLongPress={() => this.Delete(item.item_id)}>
                <View style={{ width: "20%" }}>
                    {/* <Image
            source={{ uri: url }}
            style={{ height: 57, width: "100%" }}
            resizeMode="contain"
          /> */}
                    <CachedImage
                        source={{ uri: url }}
                        style={{ height: 57, width: "100%" }}
                        resizeMode="contain"
                        cacheKey={`${item.item_id}+${item.game_slug}`} // (required) -- key to store image locally
                        placeholderContent={( // (optional) -- shows while the image is loading
                            <ActivityIndicator // can be any react-native tag
                                color={Colors.primary}
                                size="small"
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                }}
                            />
                        )}
                    />
                </View>
                <View style={{ width: "50%", paddingLeft: 10 }}>
                    <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
                        {item.name}
                    </Text>
                    {/* <Text style={styles.subText}>
                        {"Price: "}
                        <FontAwesome name="rupee" size={13} color={Colors.black} />
                        {item.rent}
                    </Text> */}
                </View>
                <View style={styles.qtyContainer}>
                    {/* <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={Colors.textInputBorder}
                    /> */}
                    <Text style={styles.subText}>
                        <FontAwesome name="rupee" size={13} color={Colors.black} />
                        {item.rent}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    };
    ModalOpen = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    render = () => {
        return (
            <SafeAreaView style={styles.container}>
                <Header title={this.state.data?.name}
                    addAction={this.AddWishlist}
                    search={false}
                    export="true"
                    exportData={htmlRender}
                    exportItems={this.state.list}
                    eventModal={() => this.ModalOpen()}
                />
                {this.state.isLoading ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={this.state.list}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.renderListItem}
                        ListEmptyComponent={this.renderEmptyContainer()}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />
                        }
                    />
                )}

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isModalOpen}
                    onRequestClose={this.ModalOpen}
                    style={{ backgroundColor: "white" }}
                >
                    <TouchableWithoutFeedback onPress={()=>this.setState({isModalOpen: !this.state.isModalOpen})}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.itemModalContainer}>
                            <View
                                style={[
                                    styles.rowContainer,
                                    {
                                        flexDirection: "column",
                                        marginBottom: 0,
                                        justifyContent: "center",
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.inputLable,
                                        { textAlign: "center" },
                                    ]}
                                >
                                    Are you want to send pdf with amount?
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                }}
                            >
                                <PressableButton
                                    btnTextStyle={{ fontSize: 15 }}
                                    btnStyle={{
                                        height: 40,
                                        width: "30%",
                                        margin: 10,
                                    }}
                                    text={"Yes"}
                                    onPress={() => { this.withRentpdf() }}
                                />
                                <PressableButton
                                    btnTextStyle={{ fontSize: 15 }}
                                    btnStyle={{
                                        height: 40,
                                        width: "30%",
                                        margin: 10,
                                    }}
                                    text={"No"}
                                    onPress={() => { this.withoutRentpdf() }}
                                />
                            </View>
                        </View>
                    </View>            
                    </TouchableWithoutFeedback>
                </Modal>

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
                        // this.hideAlert();
                        this.props.navigation.goBack();
                    }}
                />
            </SafeAreaView>
        );
    }
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.white,
        // padding:10
    },
    card: {
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderRadius: 4,
        // elevation: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.textInputBorder,
        alignItems: 'center'
    },
    qtyContainer: {
        width: "30%",
        alignItems: "flex-end",
        justifyContent: "center",
    },
    titleText: {
        fontSize: 14,
        color: Colors.black,
    },
    subText: {
        fontSize: 13,
        color: Colors.black,
        // opacity: 0.9,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        width: windowWidth,
        height: windowHeight,
        marginTop: Platform.OS == "ios" ? 0 : '8%',
    },
    modalBody: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.white,
        width: windowWidth - 30,
        minHeight: Math.floor(windowHeight / 5),
        padding: 15,
        borderRadius: 5,
        elevation: 8,
    },

    closeButton: {
        position: "absolute",
        zIndex: 11,
        top: 5,
        right: 5,
        backgroundColor: "#ddd",
        width: 25,
        height: 25,
        borderRadius: 40 / 2,
        alignItems: "center",
        justifyContent: "center",
        elevation: 0,
    },
    closeButtonText: {
        color: "#444",
        fontSize: 22,
    },
    searchModalBody: {
        flex: 1,
        height: windowHeight - 50,
        paddingHorizontal: '5%',
        paddingVertical: 8,
    },

    listItem: {
        flexDirection: "row",
        borderBottomColor: Colors.textInputBorder,
        borderBottomWidth: 1,
        padding: 10,
    },
    left: {
        width: "20%",
        justifyContent: "center",
    },
    middle: {
        justifyContent: "center",
        flex: 1,
    },
    right: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    image: {
        width: 40,
        height: 40,
    },
    searchFieldBox: {
        width: "100%",
        height: 40,
        marginTop: 8,
        paddingLeft: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 2,
    },
    searchField: {
        padding: 5,
        width: "90%",
        color: Colors.textColor,
        fontSize: 15,
    },
    searchingText: {
        fontSize: 12,
        color: Colors.textColor,
        opacity: 0.8,
        alignSelf: "center",
        marginTop: 20,
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
    headerTitleContainer: {
        width: "70%",
        paddingLeft: 20,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    itemModalContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.white,
        width: windowWidth - 30,
        minHeight: Math.floor(windowHeight / 5),
        // borderRadius: 5,
        elevation: 5,
        padding: 20,
    },
    rowContainer: {
        paddingHorizontal: 8,
        backgroundColor: Colors.white,
        borderRadius: 4,
        margin: 10,
        marginHorizontal: 0,
        marginVertical: 5,
    }, 
     inputLable: {
        fontSize: 16,
        color: Colors.black,
        marginBottom: 10,
    
      },
});
