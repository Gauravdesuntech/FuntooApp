import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from "react-native";
import Colors from "../../config/colors";

import { AntDesign } from "@expo/vector-icons"



class TodoItem extends React.Component {

    

    render() {
        let percent = (this.props.completed_task_count / this.props.all_task_count) * 100;
        // console.log("................this.props.catId.................",this.props);
        percent = isNaN(percent) ? 0 : percent.toFixed();
        return ( 
            
                <TouchableOpacity
                    onPress={() =>{ this.props.navigation.push('CategoryItems',{catId:this.props.catId,title:this.props.title})}}
                    style={styles.container}>
                    <View style={styles.wrapper}>
                        <Image source={{ uri: this.props.img }}
                            style={{ height: 40, width: 40, resizeMode: 'contain' }} />
                        <Text style={styles.title}>{this.props.title}</Text>
                    </View>
                   
                  <TouchableOpacity style={[styles.wrapper, { flexDirection: 'column' }]}>
                        <Text style={[styles.title, { fontSize: 14 }]}>{`${this.props.pending_task_count}`}</Text>
                        <Text style={[styles.title, { fontSize: 12, color: Colors.tomato }]}>{percent}%</Text>
                    </TouchableOpacity> 
                  
                </TouchableOpacity>
           
        );
    }
}
export default TodoItem;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 17,
        paddingLeft: 15,
        color: Colors.textColor,
        paddingRight: 5 //SUBHASH : adjust space here for the arrow
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
