import React, {Component} from "react";
import {
	StyleSheet,
	Text,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView
} from "react-native";
import Colors from "../../config/colors";
import { GetOrderGameCommonParts, AddGameCommonPartsForOrder } from "../../services/OrderService";
import OverlayLoader from "../OverlayLoader";
import Checkbox from "expo-checkbox";
import emitter from "../../helper/CommonEmitter";
import { AntDesign } from "@expo/vector-icons";
import colors from "../../config/colors";
import AppContext from "../../context/AppContext";

export default class OrderCommonParts extends Component {
static contextType = AppContext;
    _isMounted = false;

    constructor(props) {
        super(props);
        this._emitter = emitter;
        this.state = {
            isLoading: false,
            commonParts : [],
            ischevronClick: false,
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) {
            this.setState({isLoading: true})
        }

        GetOrderGameCommonParts({order_id: this.props.orderData.id})
        .then( (result) => {
            if(this._isMounted) {
                this.setState({
                    commonParts: result.data
                })
            }
        })
        .catch( err => console.log(err) )
        .finally( () => {
            if(this._isMounted) {
                this.setState({isLoading: false})
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleOnChange = (value, item) => {
      if(this.context.userData.action_types.indexOf('Add') >= 0) 
       {let data = {
            order_id: this.props.orderData.id,
            parts_id: item.parts_id,
            games: JSON.stringify(item.games),
            is_tic: (value === true) ? 1 : 0
        }

        this.setState({isLoading: true});
        AddGameCommonPartsForOrder(data)
        .then( (result) => {
            this.setState({isLoading: false} , () => {
                this._emitter.emit('LoadingPartsUpdatedFromCommonParts');
            });
        })
        .catch( err => console.log(err) )};
    }

    togglChvron = () => {
        this.setState({
            ischevronClick:!this.state.ischevronClick
        })
    
  }

    render() {
        return (
            <SafeAreaView style={{ marginTop: 5 }}>

                {this.state.isLoading && <OverlayLoader visible={this.state.isLoading} />}

                {
                    this.state.commonParts.length > 0 && (
                        <View style={styles.header}>
                        <View>
                            <Text style={{color:Colors.textColor,}}>Common Parts </Text>
                            </View>
                            <TouchableOpacity onPress={() => this.togglChvron()}>
                                <View style={{marginRight:12}}>
                                    <AntDesign name={this.state.ischevronClick ? 'down' : 'right'} style={[styles.chvronroate, { fontSize: 20, color: colors.black,opacity:Colors.opacity6 }]} />
                                </View>
                        </TouchableOpacity>
                    </View>
                         
                    )
                }

                <View>
                    {
                        this.state.commonParts.length > 0 && this.state.ischevronClick && this.state.commonParts.map( (item) => {
                            // console.log(".....game data...........",item)
                            return (
                                <View style={{ flexDirection: 'row', marginTop: 5, backgroundColor: Colors.white }} key={ item.parts_id }>
                                    <View style={{width: '16%', justifyContent: 'center', paddingHorizontal: 3}}>
                                        <Image style={{ width: 50, height: 50, borderWidth: 0.5, borderColor: '#dfdfdf'  }} source={{ uri: item.thumb_image_url}}/>
                                    </View>
                                    <View style={{width: '73%'}}>
                                        
                                        <View style={{ marginVertical: 7 ,}}>
                                            <Text style={{color:Colors.textColor,}}>{item.parts_name} ({item.total_quantity})</Text>
                                        </View>
                                       
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                                        { item.games.map( (game) => {
                                                return (
                                                    <Text key={game.game_id} style={ styles.gameNameText }>{game.game_name} x {game.common_part_quantity}</Text>                                                )
                                            } ) }
                                        </View>
                                    </View>
                                    <View style={{width: '9%', justifyContent: 'center', alignItems: 'center', padding: 2}}>
                                        {this.context.userData.action_types.indexOf('Add') >=0 ?
                                        <Checkbox
                                            value={item.is_parts_loaded}
                                            onValueChange={(value) => { this.handleOnChange(value, item) }}
                                            style={{borderColor: '#dfdfdf', borderRadius: 5}}
                                        />
                                        : null}
                                    </View>
                                </View>
                            )
                        })
                    }

                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
       // marginLeft: 5,
        // justifyContent: 'flex-start',
        justifyContent:'space-between',
        flexDirection:'row',
        backgroundColor: Colors.white,
        paddingVertical: 10,
    },
    gameNameText: {
        alignSelf: 'center',
        fontSize: 11,
        marginVertical: 2,
        marginLeft: 1,
        marginRight:5,
        padding: 5,
        // backgroundColor: Colors.primary,
        color: Colors.primary,
        borderWidth: 0.7, 
        borderColor:Colors.primary ,
        borderRadius: 3
    }
});