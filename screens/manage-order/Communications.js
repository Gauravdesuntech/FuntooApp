import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    FlatList,
    RefreshControl,
} from "react-native";
import {
    MaterialIcons
} from "@expo/vector-icons";
import Colors from "../../config/colors";
import AppContext from "../../context/AppContext";
import Configs from "../../config/Configs";
import OverlayLoader from "../../components/OverlayLoader";
import { 
    GetAllOrderCommunicationDetails,
    DeleteOrderCommunicationDetails
 } from "../../services/OrderService";
import { showDateAsClientWant, showTimeAsClientWant } from "../../utils/Util";
import EmptyScreen from "../../components/EmptyScreen";

export default class Communications extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        // console.log("......................10............",this.props.orderData)
        this.state = {
            orderData: this.props.orderData,
            isLoading: false,
            communicationsLists: [],
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
        };
    }

    componentDidMount = () => {
        this.focusListner = this.props.navigation.addListener("focus", () => {
            this.Bind();
        });

        this.Bind();
    };
    componentWillUnmount() {
        this.focusListner();
    }

    Bind() {
        this.RecordList();
    }

    onRefresh = () => {
        this.setState({ refreshing: true }, () => { this.Bind() })
    }

    RecordList() {
        this.setState({isLoading: true});
        GetAllOrderCommunicationDetails({order_id: this.state.orderData.id})
        .then( (result) => {
            if(result.is_success) {
                this.setState({
                    communicationsLists: result.data,
                }); 
            }
        } )
        .catch ( err => console.log(err))
        .finally( () => {
            this.setState({
                isLoading: false,
                refreshing: false
            });
        });
    }

    handleDelete = (id) => {
        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this item",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        this.setState({
                            communicationsLists: this.state.communicationsLists.filter(item => item.id !== id)
                        }, () => DeleteOrderCommunicationDetails({ id: id }).then(res => { }).catch(err => { console.log(err) }));
                    },
                },
                {
                    text: "No",
                },
            ]
        );

    }

    renderCommListItem = ({ item }) => (
        <View style={{backgroundColor:'#f5f5f5'}}>
        <TouchableOpacity key={item.id}
            onLongPress={ () => this.handleDelete(item.id) }
            onPress={ () => console.log('go to details  page') }
            style={styles.listRow}

        >
            <View style={styles.leftPart}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.title}>{item.vendor_name} - {item.called_number}</Text>
                </View>
                <Text style={styles.subText}>
                    Type :  {item.type}
                </Text>
                <Text style={styles.subText}>
                    Date : { showDateAsClientWant(item.created_at) }
                </Text>
                <Text style={styles.subText}>
                    Time : { showTimeAsClientWant(item.created_at) }
                </Text>
                <Text style={styles.subText}>
                    {"Called By: " + item.created_by_name}
                </Text>
                <Text style={styles.subText}>Comments :</Text>
                <Text style={styles.subText}>{item.comments}</Text>
            </View>
            <View style={[styles.rightPart, { alignItems: 'flex-end' }]}>
                <MaterialIcons
                    name="preview"
                    color={Colors.primary}
                    size={24}
                    onPress={() => this.props.navigation.navigate("Preview", { url: Configs.UPLOAD_PATH + item.attachment })}
                />

            </View>
        </TouchableOpacity>
        </View>
    );

    render = () => (
        <View style={styles.container}>

            {this.state.isLoading ?
                <OverlayLoader visible={this.state.isLoading}/> :
                <View>
                    {
                        this.state.communicationsLists.length > 0 && <Text style={{
                            marginLeft: 10,
                            fontSize: 16,
                            fontWeight: 'bold',
                            fontFamily: 'serif',
                            color: Colors.grey,
                            margin: 10
                        }}>History :-</Text>
                    }
                    
                    <FlatList
                        data={this.state.communicationsLists}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={this.renderCommListItem}
                        initialNumToRender={this.state.communicationsLists?.length}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={ <EmptyScreen /> }
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={this.onRefresh}
                            />
                        }
                    />
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        marginBottom:50
    },
    listContainer: {
        margin:5,
        backgroundColor: Colors.white,
    },
    listRow: {
        flexDirection: "row",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		// elevation: 10,
		marginBottom: 10,
        margin: 5,
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
        //fontSize: 16,
        color: Colors.grey,
        fontWeight: "bold",
        lineHeight: 24,
    },

    subText: {
        color: Colors.grey,
        opacity: 0.8,
        fontSize: 14,
        lineHeight: 22,
    },


    inputContainer: {
        width: "100%",
        marginBottom: 20,
        flex: 1,
        padding: 10,
        flexDirection: 'row'
    },

    iconAbsolute: {
       
    },

    inputLable: {
        fontSize: 16,
        color: Colors.grey,
        marginBottom: 10,
        opacity: 0.8,
    },

    labelBox: {
        //padding: 9,
        fontSize: 14,
        // width: "100%",
        //borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        // backgroundColor: Colors.labelBoxBg,
    },

    headerRow: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        padding: 5,
        //flexDirection: "row",
        borderColor: "#eee",
        borderWidth: 1,
        // padding: 20,
        // margin: 10,
    },
});