import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    SafeAreaView,
    SectionList,
    Dimensions,
    TextInput
} from "react-native";
import EmptyScreen from "../../components/EmptyScreen";
import OverlayLoader from "../../components/OverlayLoader";
import Colors from "../../config/colors";
import AuthService from "../../services/CashFlow/Auth"
import moment from "moment";

export default class EventExpenses extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            model: {},
            Alldata: [],
            isLoading: false,
            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            count: 30,
            event_expenses:null,
        };
    }

    componentDidMount = () => {
        console.log("............props.orderData...............", this.props.orderData?.event_expenses.event_expenses)
        this.AlltransDetail(this.props.orderData.id, this.state.count)
        this.setState({event_expenses:this.props.orderData?.event_expenses.event_expenses != null ? this.props.orderData?.event_expenses.event_expenses: null })
    }

    AlltransDetail = async (order_id, count) => {
        this.setState({ isLoading: true })
        const result = await AuthService.getEventTransferDetails(
            order_id,
            count
        );
        // console.log('..........result..........', result)
        this.setState({ Alldata: result.value, isLoading: false });

    };

    renderEmptyContainer = () => {
        return (
            <View style={{ height: windowHeight }}>
                <EmptyScreen />
            </View>
        );
    };

    renderItem = ({ item }) => {

         console.log(`===========item========>`, (item))
        return (
            <>
                {item != null || item != undefined ? (
                    <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }]}>
                        <View style={{ width: '35%', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', }}>
                                <Text>{item.cat_name}</Text>
                                {item.people > 0 ?
                                    <Text>({item.people})</Text>
                                    : null}
                            </View>
                            {item.description != null && item.description != 'undefined' ?
                                // <Text>({item.description})</Text>
                                <TextInput
                                    value={item.description}
                                    style={{color:Colors.black}}
                                    editable={false}
                                    multiline={true}
                                />
                                : null}
                        </View>
                        <Text >{item.Amount_type}</Text>
                        <Text >₹{item.amount}</Text>

                    </View>
                ) : (
                    <View style={styles.moneyDataSection}>
                        <Text style={{ color: "#ccc" }}>No Data Available</Text>
                    </View>
                )}
            </>
        );
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.state.isLoading ?
                    <OverlayLoader />
                    :
                    <View style={{ backgroundColor: '#ebe8e8',}}>
                        <View style={{height:'90%'}}>
                            <SectionList
                                sections={this.state.Alldata}
                                keyExtractor={(item, index) => item.id.toString()}
                                renderItem={this.renderItem}
                                contentContainerStyle={styles.listContainer}
                                ListEmptyComponent={this.renderEmptyContainer()}
                                onScrollEndDrag={() => this.AlltransDetail(this.props.orderData.id, parseInt(this.state.count) + 30)}
                                renderSectionHeader={({ section: { title } }) => {
                                    return (
                                        <View style={styles.sectionHeader}>
                                            <View style={styles.sectionHeaderLeft}>
                                                <Text style={{ fontSize: 26, color: Colors.white }}>
                                                    {moment(title, "YYYY-MM-DD").format("DD")}
                                                </Text>
                                            </View>
                                            <View style={styles.sectionHeaderRight}>
                                                <Text style={{ fontSize: 16, color: Colors.white }}>
                                                    {moment(title, "YYYY-MM-DD").format("dddd")}
                                                </Text>
                                                <Text style={{ fontSize: 14, color: Colors.white }}>
                                                    {moment(title, "YYYY-MM-DD").format("MMMM YYYY")}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                }}
                            // refreshControl={
                            //   <RefreshControl
                            //     refreshing={this.state.refreshing}
                            //     onRefresh={this.onRefresh}
                            //   />
                            // }
                            />
                        </View>
                        {this.state.event_expenses != null ?
                        <View style={[styles.card,{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:'8%',margin:'2%'}]}>
                            <Text style={{width: '35%',fontSize:16}}>Total Amount</Text>
                            <Text style={{fontSize:16}}>₹{this.state.event_expenses}</Text>
                        </View>
                        :null}
                    </View>
                }
            </SafeAreaView>
        )
    }

}

const windowwidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        // height: '75%',
        // borderColor: "#ccc",
        // borderWidth: 1,
        // shadowColor: "#000000",
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // shadowOffset: {
        //     height: 1,
        //     width: 1,
        // },
        flex:1,
        backgroundColor: '#ebe8e8'
    },
      title: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.textColor,
        marginBottom: 10,
        marginLeft: 5,
      },
      listContainer: {
        padding: 8,
        backgroundColor: '#ebe8e8',
      },
      sectionHeader: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        backgroundColor: Colors.primary,
        marginBottom: 10,
        borderRadius: 3,
      },
      sectionHeaderLeft: {
        width: "14%",
        alignItems: "flex-end",
        justifyContent: "center",
        borderRightWidth: 1,
        borderRightColor: Colors.white,
        paddingRight: 10,
      },
      sectionHeaderRight: {
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: 10,
      },
      card: {
        //width: "100%",
        // paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderRadius: 4,
        // elevation: 1,
        marginBottom: 10,
      },
});