import React, { Component } from 'react'
import { View, Text, SafeAreaView, FlatList, StyleSheet } from 'react-native'
import Header from '../components/Header'
import AppContext from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../config/colors';
import moment from 'moment';
import { get_track_log } from '../services/APIServices';
import EmptyScreen from '../components/EmptyScreen';
import Loader from '../components/Loader';

export default class Track_order extends Component {

    static contextType = AppContext;
    _focusListner = null;
    constructor(props) {
        super(props)
        this.state = {
            order_id: this.props.route.params.order_id,
            isLoading:false,
            allData: [],
        }
    }
    componentDidMount() {
        console.log('.......order_id.........', this.props.route.params.order_id);
        let data = {
            order_id: this.state.order_id
        }
        this.setState({isLoading:true})
        get_track_log(data).then((res) => {
            // console.log('............res............',res);
            this.setState({ allData: res.data,isLoading:false })
        }).catch(err => {
            this.setState({isLoading:false})
            console.log('..........err..........', err);
        })
    }

    renderTracking = ({ item, index }) => {
        let data = (index+1)
        return (
            <View style={{ marginLeft: 10, marginBottom: 10,flexDirection: 'row',  marginTop: 10,}}>
                <View style={{width:'10%'}} >

                    <View style={{ paddingRight: 10,zIndex:2 }}>
                        <Ionicons name="ios-checkmark-circle" size={24} 
                        // color={item.type == 'user' ? Colors.orenge : Colors.primary} 
                        color={"green"}   
                        />
                    </View>
                  
                    {this.state.allData.length == data ? null :
                        <View style={{
                            borderLeftWidth: 2,
                            height: 53,
                            borderLeftColor: Colors.grey,
                            borderStyle: 'dashed',
                            // borderLeftColor: item.type == 'user' ? Colors.orenge : Colors.primary,
                            opacity: 0.4,
                            marginLeft: '28%',
                            position: 'absolute',
                            top: 5,
                        }}>

                        </View>
                    }
                </View>
                <View style={{width:'85%', paddingLeft: 10,}}>
                    <View style={{flexDirection:'row',alignItems:'flex-start'}}>
                        <Text style={{width:'68%'}}>{item.comment}</Text>
                        <Text style={{width:'31.5%',opacity:0.6,marginLeft:'15%'}}>{moment(item.date).format('hh:mm a')}</Text>
                        {/* <Text style={{width:'31.5%',fontSize:12,opacity:0.6,marginLeft:35}}>{moment(item.date).format('Do MMM YY  hh:mm a')}</Text> */}
                    </View>
                    {/* <View style={{borderBottomColor:Colors.lightGrey,borderBottomWidth:1,width:'100%',marginTop:'5%'}}></View> */}
                    </View>
            </View>
        )
    }

    emptyScreen=()=>{
        return(
            <View style={{height:'100%',backgroundColor:Colors.white,paddingVertical:"40%"}}>
            <EmptyScreen />
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <Header title="Track Order" />
                {this.state.isLoading ?
            <Loader />   
            : 
            <View style={{margin:5,marginBottom:'25%'}}>
            <FlatList
                data={this.state.allData}
                keyExtractor={(item, index) => index}
                renderItem={this.renderTracking}
                initialNumToRender={this.state.allData.length}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={() => (
                    // <Text style={styles.searchingText}>No Result Found</Text>
                    this.emptyScreen()
                )}
            />
            </View>
                }
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
})