import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SectionList,
    RefreshControl,
    SafeAreaView
} from "react-native";
import moment from "moment";
import AppContext from "../../context/AppContext";
import Colors from "../../config/colors";
import VendorHeader from "../../components/VendorHeader";
import Loader from "../../components/Loader";
import EmptyScreen from "../../components/EmptyScreen";
import { GetVenderOrders } from "../../services/VenderApiService";
import { showDayAsClientWant, showTimeAsClientWant } from "../../utils/Util";

export default class Home extends Component {

    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            isLoading: false,
        }
    }

    componentDidMount() {
        this.loadOrderDetails()
    }

    loadOrderDetails = () => {
        this.setState({ isLoading: false });
        GetVenderOrders({vender_id: this.context.userData.vender_details.id })
        .then((result) => {
            console.log(result)
            if (result.is_success) {
                this.setState({
                    orders: result.data
                });
            }
        })
        .catch(err => console.log(err))
        .finally(() => {
            this.setState({ 
                isLoading: false,
                refreshing: false
            });
        });
    }

    onRefresh = () => {
		this.setState({ refreshing: true }, () => { this.loadOrderDetails() })
	}


    renderItem = ({item}) => (
        <TouchableOpacity
            key={item.id.toString()}
            activeOpacity={0.8}
            style={styles.card}
            onPress={() => this.props.navigation.navigate("VenderOrderDetails", { order_id: item.order_id }) }
        >
            <Text style={styles.desc}>{"Order#: " + item.uni_order_id}</Text>
            <Text style={styles.desc}>Event Date: {moment(item.event_start_timestamp).format("Do MMM YY")}{moment(item.event_start_timestamp).format(" (ddd)")}</Text>
            <Text style={styles.desc}>{"Venue: " + item.venue}</Text>
            <Text style={styles.desc}>Setup by: {showTimeAsClientWant(item.setup_timestamp)}</Text>
            <Text style={styles.desc}>
                Event Time: {showTimeAsClientWant(item.event_start_timestamp)} - {showTimeAsClientWant(item.event_end_timestamp)}
            </Text>
           
        </TouchableOpacity>
    )

    render() {
        return (
            <SafeAreaView>
                <VendorHeader title="Home" />
                {
                    this.state.isLoading ? (
                        <Loader />
                    ) : (    <View>
                            {this.state.orders.length > 0 ? (
                        <SectionList
                            sections={this.state.orders}
                            keyExtractor={(item, index) => item.id.toString()}
                            renderItem={this.renderItem}
                            contentContainerStyle={styles.listContainer}
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
                                )
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />
                            }
                        />
                        ):(<EmptyScreen
                                header={'Sorry!'}
                                message={'No data are found'}
                            />) }
                     </View>
                     
                     )
                    
                }
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	moreMenu: {
		alignSelf: 'center',
		fontSize: 11,
		marginVertical: 2,
		marginLeft: 1,
		padding: 10,
		backgroundColor: Colors.primary,
		color: Colors.white,
		borderWidth: 0.7,
		borderColor: '#dfdfdf',
		borderRadius: 8
	},
	listContainer: {
		padding: 8,
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
		width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		elevation: 10,
		marginBottom: 10,
	},
	desc: {
		fontSize: 14,
		color: Colors.textColor,
		marginBottom: 3,
		fontWeight: "normal",
		// opacity: 0.9,
	}
});