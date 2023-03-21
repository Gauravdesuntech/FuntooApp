import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from "react-native";
import Checkbox from "expo-checkbox";
import Colors from "../../config/colors";
import { useNavigation } from "@react-navigation/native";
import emitter from "../../helper/CommonEmitter";
import AppContext from "../../context/AppContext";

class OrderVolunteerProof extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this._emitter = emitter;
    }

    componentDidMount() {
        this._emitter.addListener('volRequirmentComplete', (data) => {
            this.updateTotalVolunteerRequiredCount(data);
        });
    }

    componentWillUnmount() {
        this._emitter.removeAllListeners();
    }

    updateTotalVolunteerRequiredCount = (status) => {
        if(this.context.userData.action_types.indexOf('Edit') >= 0 )
        {this.props.item.is_volunteer_proof_done = status;}
    }

    handleOnChange = () => {
        this.props.navigation.navigate("OrderVolunteerListScreen", {
			game_id: this.props.item.game_id,
			order_id: this.props.orderData.id
		});
    }

    render() {
        return(
            <View style={[styles.tableRow2, { height: 60 }]}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{position: 'relative', top: -1, right: -18, fontSize: 10}}>{this.props.item.total_volunteer_required}</Text>
                </View>
                
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 7 }}>
                    <Checkbox
                        value={(this.props.item.is_volunteer_proof_done == 1) ? true : false}
                        onValueChange={this.handleOnChange}
                        style={{borderColor: '#dfdfdf', borderRadius: 5}}
                    />
                </View>
            </View>
        )
    }
}

export default function (props) {
    const navigation = useNavigation();

    return <OrderVolunteerProof {...props} navigation={navigation} />;
}


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
    tableRow2: {
        // backgroundColor: Colors.lightGrey,
        marginRight: 5,
        color: Colors.textColor,
        width: 50
    },
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    lsitContainer: {
        flex: 1,
    },
    card: {
        width: "100%",
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderColor: Colors.textInputBorder,
        //elevation: 2
    },
    row: {
        marginTop: 5,
        flexDirection: 'row',
    },
    rowItem: {
        //width: '33.33%',
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowLebel: {
        fontWeight: 'bold',
        //color: 'silver',
        fontSize: 16

    },
    rowValue: {
        color: Colors.textColor,
    },
    form: {
        flex: 1,
        padding: 8,
    },
    topBtnContainer: {
        width: "100%",
        flexDirection: "row",
        // justifyContent: "space-evenly",
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
    table: {
        borderColor: "#eee",
        borderWidth: 1,
        paddingHorizontal: 1,
        paddingVertical: 5,
    },

    tableRow: {
        flexDirection: "row",
    },
    thead: {
        flexDirection: "row",
        height: 45,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: Colors.textInputBorder,
        borderBottomColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
    },
    tbody: {
        flexDirection: "row",
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: Colors.textInputBorder,
    },
    tdLarge: {
        width: "49%",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderLeftColor: Colors.textInputBorder,
        borderRightColor: Colors.textInputBorder,
        justifyContent: "center",
        paddingHorizontal: 6,
    },
    tdSmall: {
        width: "17%",
        alignItems: "center",
        justifyContent: "center",
        borderRightWidth: 1,
        borderRightColor: Colors.textInputBorder,
        paddingHorizontal: 6,
    },
    tdLabel: {
        fontSize: 16,
        color: Colors.textColor,
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
    iconPickerContainer: {
        flexDirection: 'row',
        padding: 13
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
    listRow: {
        flexDirection: "row",
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    image: {
        height: 50,
        width: 50,
    },
    leftPart: {
        width: "80%",
        justifyContent: "center",
    },
    rightPart: {
        width: "20%",
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        color: Colors.textColor,
        fontWeight: "bold",
        lineHeight: 24,
    },
    title_qnt: {
        fontSize: 16,
        color: Colors.textColor,
        lineHeight: 24,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    subText: {
        color: Colors.textColor,
        fontSize: 14,
        lineHeight: 22,
    },
    btnModalOverlay: {
        height: windowHeight,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "flex-end",
    },

    btnModalContainer: {
        backgroundColor: "#fff",
        height: Math.floor(400 * 0.5),
        elevation: 20,
    },
    btnModalBody: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    btnModalHeader: {
        height: 50,
        flexDirection: "row",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#ccc",
        elevation: 0.4,
        alignItems: "center",
        justifyContent: 'flex-end'
    },
    btnModalCloseBtn: {
        width: "10%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center'

    },
    btnChoosemodalBtn: {
        flexDirection: "row",
        width: '60%',
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        borderRadius: 5,
    },
    btnModalText: {
        fontSize: 16,
        color: Colors.white,
    }
}
)