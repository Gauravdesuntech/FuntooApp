import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from "react-native";


// import { AntDesign } from "@expo/vector-icons"
// import { Colors } from '..';
import Colors from "../../config/colors";


class UserItem extends React.Component {
    render() {
        return (
            <TouchableOpacity
                onPress={() => this.props.clickUser(this.props.id , this.props.title)}
                style={styles.container}>
                <View style={styles.wrapper}>
                    {/* <Text style={styles.title}>{`${this.props.title} (${this.props.designation} of ${this.props.department})`}</Text> */}
                    <Text style={styles.title}>{`${this.props.title}`}</Text>
                </View>
                <TouchableOpacity style={styles.wrapper}>
                    {/* <Text style={styles.title}>{this.props.qty}</Text> */}
                    {/* <AntDesign name="right" size={16} style={{ opacity: 0.6 }} /> */}
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }
}
export default UserItem;

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "#0011",
        // width: '100%',
        marginHorizontal: 10,
        paddingHorizontal:10,
        paddingVertical: 5,
        // borderBottomColor: '#e5e5e5',
        borderWidth: 1,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#999",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,
		// elevation: 3,
        borderRadius: 3,
        borderColor: Colors.primary,
    },
    title: {
        fontSize: 14,
        paddingHorizontal:5,
        color: Colors.textColor,
        paddingRight: 5 //SUBHASH : adjust space here for the arrow
    },
    wrapper: {
        flexDirection: 'row',
        height:30,
        alignItems: 'center'
        
    }
});
