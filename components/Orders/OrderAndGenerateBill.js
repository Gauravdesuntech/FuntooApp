import React, {Component} from "react";
import { useNavigation } from "@react-navigation/native";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
    Alert,
	View
} from "react-native";
import Colors from "../../config/colors";
import OverlayLoader from "../OverlayLoader";
import { CreateInvoice, CheckInvoiceExist } from "../../services/OrderService";

export class OrderAndGenerateBill extends Component {

	_isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            invoiceExistStatus: false
        }
    }

    componentDidMount() {
		this._isMounted = true;
        CheckInvoiceExist({order_id: this.props.orderData.id})
        .then( (result) => {
			if(this._isMounted) {
				if(result.is_success) {
					this.setState({invoiceExistStatus: true})
				} else {
					this.setState({invoiceExistStatus: false})
				}
			}
        })
        .catch( err => console.log(err) )
    }

	componentWillUnmount() {
		this._isMounted = false;
	}

    createInvoice = () => {
		this.setState({showLoader: true})
		CreateInvoice({ order_id: this.props.orderData.id })
		.then( (result) => {
			if(result.is_success) {
				this.props.navigation.navigate("OrderInvoice", {
					id: result.data.invoice_id
				});
			}
		})
		.catch( err => console.log(err) )
		.finally( () => {
			this.setState({showLoader: false})
		})
	}

    confirmUserForGenerateBill = () => {
        Alert.alert(
			"Alert",
			"Are you sure you want to generate Invoice?",
			[
				{
					text: "Yes",
					onPress: () => { this.createInvoice() }
				},
				{
					text: "No"
				},
			]
		);
    }

    render() {
        return (
            <>
                <OverlayLoader visible={this.state.showLoader}/>
                {
                    this.state.invoiceExistStatus == true ? (
                        <View style={ styles.billGenerateBtn }>
                            <Text style={styles.btnText}>Invoice Raised</Text>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={this.confirmUserForGenerateBill}
                            style={ styles.billGenerateBtn }>
                            <Text style={styles.btnText}>Complete {'&'} Raise Invoice</Text>
                        </TouchableOpacity>
                    )
                }
            </>
        )
    }
}

export default function (props) {
    const navigation = useNavigation();

    return <OrderAndGenerateBill navigation={navigation} {...props} />
}

const styles = StyleSheet.create({
    billGenerateBtn: {
		backgroundColor: Colors.primary, 
		marginLeft: 12, 
		marginRight: 12,
		marginBottom: 10, 
		padding: 10,
		borderRadius: 10,
		elevation: 4
	},
    btnText: {
        color: Colors.white, 
        textAlign: 'center'
    }
})