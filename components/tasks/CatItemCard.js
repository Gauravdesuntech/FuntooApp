import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image, TouchableOpacity
} from "react-native";
import Theme from "../../Theme";
import Configs from "../../config/Configs";
import  Colors  from "../../config/colors";
const coin1 = require('../../assets/tasks/coin_1.png')

class CatItemCard extends React.Component {
    render() {
        // console.log('.................this.props..........',this.props.category_id)
        
        return (
            <TouchableOpacity
                onPress={() => { this.props.approval ? null : this.props.navigation.navigate('ViewItem', { id: this.props.id, category_id: this.props.category_id }) }} style={[styles.container, this.props.item.selectedClass]}
            // onLongPress={()=>{this.props.selectItem(this.props.item)}}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* change icon size for major icon here */}

                    <View style={{ width: '85%' }}>
                    {this.props.incident_type && this.props.category_id=='64' ? <Text style={{  fontSize: 12, opacity: 0.5 }}>Incident Type: {this.props.incident_type}</Text> : null }
                        <Text style={{ paddingBottom: 2, fontSize: 16, fontWeight: 'bold', color: Colors.textColor, }}>{this.props.title}</Text>
                        {this.props.category_name ? <Text style={{  paddingBottom: 2, fontSize: 16,  color: Colors.textColor,}}>Category Name: {this.props.category_name}</Text> : null}
                        <Text style={{  paddingBottom: 2, fontSize: 16,  color: Colors.textColor,}}>Schedule Date: {this.props.date}</Text>
                        <Text style={{  paddingBottom: 2, fontSize: 16,  color: Colors.textColor,}}>Assign by: {this.props.created}</Text>
                        <Text style={{  paddingBottom: 2, fontSize: 16,  color: Colors.textColor,}}>Assigned to: {this.props.members}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{  paddingBottom: 2, fontSize: 16,  color: Colors.textColor,}}>
                                Status:
                            </Text>
                            {Configs.TASK_STATUS[this.props.status] == "Completed" ?
                                <Text style={{ fontSize: 16,  color: Colors.green, }}> {Configs.TASK_STATUS[this.props.status]}</Text>
                                :
                                <Text style={{  paddingBottom: 2, fontSize: 16,  color: Colors.textColor,}}> {Configs.TASK_STATUS[this.props.status]}</Text>
                            }
                        </View>
                        {Configs.TASK_STATUS[this.props.status] == "Pending" ?
                            null
                            :
                            <>
                                {this.props.closed_date == '' ? null :
                                    <>
                                        <Text style={{  paddingBottom: 2, fontSize: 16,  color: Colors.textColor,}}>Completed Date: {this.props.closed_date}</Text>
                                        <Text style={{  paddingBottom: 2, fontSize: 16,  color: Colors.textColor,}}>Completed by: {this.props.closed}</Text>
                                    </>
                                }
                            </>
                        }
                        {this.props.approval ?
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <TouchableOpacity
                                    onPress={() => { this.props.action(this.props.id, 'rejected') }}
                                    style={{ width: '30%', alignItems: 'center', marginHorizontal: 10, justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 5, borderRadius: 3, backgroundColor: Colors.danger }}
                                >
                                    <Text style={{ fontSize: 10, color: Colors.white }}>Reject</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { this.props.action(this.props.id, 'approved') }}
                                    style={{ width: '30%', alignItems: 'center', marginHorizontal: 10, justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 5, borderRadius: 3, backgroundColor: Colors.primary }}
                                >
                                    <Text style={{ fontSize: 10, color: Colors.white }}>Approve</Text>
                                </TouchableOpacity>
                            </View>
                            : null}
                    </View>
                </View>

                <View>
                <Image source={this.props.priority} style={{ height: 35, width: 35, resizeMode: 'contain' }} />
                    <View style={{ alignItems: 'center', paddingRight: 10, paddingTop: 5}}>
                        {/* change icon size in image style */}
                        <Image source={coin1} style={{ marginBottom: 5, height: 35, width: 35, resizeMode: 'contain' }} />
                        <Text style={{ fontSize: 12, opacity: 0.5 }}>{this.props.coins}</Text>
                        <Text style={{ fontSize: 11, opacity: 0.5 }}>Coins</Text>
                    </View>
                    
                </View>
            </TouchableOpacity>
        );
    }
}
export default CatItemCard;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 12,
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});
