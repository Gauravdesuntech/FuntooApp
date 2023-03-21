import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    FlatList
} from "react-native";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import AppContext from "../../context/AppContext";
import { Ionicons,MaterialIcons  } from '@expo/vector-icons';

const menus = [
    { name: 'Wallet Settings', icon: 'account-balance-wallet', navigate: 'WalletSettings'},
    { name: 'Add Category', icon: 'category', navigate: 'CategorySettings'},
];

export default class CashFlowSettings extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
    }

    GoTo = (navigate) => {
        this.props.navigation.navigate(navigate);
    }

    renderItem = ({item}) => {
        return (
            <TouchableOpacity key={Math.random()}
                onPress={() => this.GoTo(item.navigate)} style={{ marginTop: 2, marginBottom: 2 }}>

                <View style={{ flex: 1, flexDirection: "row", borderBottomWidth: 1, padding: 20, borderBottomColor: "#eeeeee" }}>
                    <View style={{ width: "20%", marginLeft: 10 }}>
                        <MaterialIcons name={item.icon} style={styles.icon} />
                    </View>
                    <View style={{ width: "80%", paddingTop: 9 }}>
                        <Text style={styles.mText}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    render = () => {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="CashFlow Settings" />
                <View style={styles.content}>
                    <FlatList
						data={menus}
						keyExtractor={(item) => item.name.toString()}
						renderItem={this.renderItem}
					/>
                </View>
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
    },
    content: {
        height: windowHeight - (windowHeight / 6),
        // marginTop: 5,
        flexDirection: "row",
        // alignItems: "center",
    },
    imgContainer: {
		width: "20%",
	},
    mText: {
		fontSize: 14,
        color: Colors.textColor,
        fontWeight: 'bold'
    },
    icon: {
        fontSize: 30,
        color: Colors.textColor,
    },
    listItemTouch: {
        borderBottomColor: Colors.textInputBorder,
        padding: 5,
        marginTop: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    listItem: {
        borderBottomColor: Colors.textInputBorder,
        width: 150,
        justifyContent: 'center'
    },
    left: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        borderWidth: 1
    },
    middle: {
        justifyContent: "center",
        alignItems: 'center',
        alignContent: 'center',
        flex: 1,
        height: 50
    },
    right: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 100,
    },
    name: {
        fontSize: 18,
        color: Colors.textColor,
        marginBottom: 3,
    },
    priceText: {
        fontSize: 18,
        color: Colors.textColor,
    },
    modalOverlay: {
        height: windowHeight,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: Colors.white,
        minHeight: Math.floor(windowHeight * 0.32),
        elevation: 5,
    },
    modalHeader: {
        height: 50,
        flexDirection: "row",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.white,
        elevation: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    closeButton: {
        backgroundColor: "#ddd",
        width: 25,
        height: 25,
        borderRadius: 40 / 2,
        alignItems: "center",
        justifyContent: "center",
        elevation: 0,
    },
    closeButtonText: {
        color: Colors.textColor,
        fontSize: 22,
    },
    modalBody: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    radioItem: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5,
    },
    radioLabel: {
        fontSize: 18,
        color: Colors.textColor,
    },
});
