import React, { Component } from 'react'
import {
    SafeAreaView,
    Text,
    Dimensions,
    ToastAndroid,
    Container,
    Image,
    Pressable,
    View,
    StyleSheet,
    BackHandler,
    ImageBackground,
    ScrollView
} from 'react-native'
import Constants from "expo-constants";
import Header from '../components/Header';
import AppContext from '../context/AppContext';
import OverlayLoader from '../components/OverlayLoader';
import colors from '../config/colors';
import * as WebBrowser from "expo-web-browser";
import { getVersion } from '../services/APIServices';
import { Entypo } from '@expo/vector-icons';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

const currentVersion = Constants.manifest.version;
export default class VersionControl extends Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            currentVersion: '',
            newVersion: '',
            isSameVersion: true,
            details:null,
        };
    } 

    componentDidMount() {
        this.setState({
            isLoading: true
        })

        getVersion('admin').then((res) => {
            console.log('.......res...........', JSON.parse(res.data.details))
            const currentVersion = Constants.manifest.version;
            const currentVersionNO = Constants.manifest.version.replace('.', '').replace('.', '');
        	const newVersionNo = res.data.version.replace('.', '').replace('.', '');
        	let isSameVersion = Number(currentVersionNO) < Number(newVersionNo) ? false : true;
            let newVersion = res.data;

            this.setState({
                currentVersion,
                newVersion,
                isLoading: false,
                isSameVersion,
                details:JSON.parse(res.data.details)
            })
        }).catch((err) => console.log(err))
    }
    checkUpdates = () => {
        this.setState({
            isLoading: true
        })
        setTimeout(() => {
            this.setState({
                isLoading: false
            });
            if (this.state.isSameVersion) {
                ToastAndroid.show("No Updates Available !!", ToastAndroid.LONG);
            } else {
                ToastAndroid.show("Updates Available !!", ToastAndroid.LONG);
            }
        }, 2000);
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1,backgroundColor:colors.white,}}>
                    <OverlayLoader visible={this.state.isLoading} />
                    {/* <ImageBackground source={"../assets/logo.png"} resizeMode="cover" style={styles.image}> */}
                    <View style={{justifyContent:'center',alignItems:'center',margin:10}}>
                    <Image
                            source={require("../assets/updateScreen.png")}
                            resizeMode="cover"
                            style={{ height: windowHeight/2.5, }}
                        />
                        </View>
                        {/* <View style={{marginTop:10,justifyContent:'center',alignItems:'center',}}>
                        <Pressable
                            onPress={() => {
                                this.checkUpdates()
                            }}
                            style={{justifyContent:'center',alignItems:'center',width:100,height:40,backgroundColor:'#ededed',borderRadius:20}}
                        >
                            <Text style={[{ fontSize:16,fontWeight:'bold',alignSelf:'center',color: colors.danger}]}>V{this.state.currentVersion}</Text>
                        </Pressable>
                        </View> */}
                    <View style={{}}>
                        {this.state.isSameVersion ?
                        <View >
                              <View style={{margin:10,justifyContent:'space-between',marginTop:20,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:18,fontWeight:'bold',}}>No Update Available </Text>
                                <View  style={{justifyContent:'center',alignItems:'center',width:100,height:40,backgroundColor:colors.primary,borderRadius:20}}>
                                <Text style={{fontSize:16,fontWeight:'bold',color:colors.white}}>V{this.state.currentVersion} </Text>
                                </View>
                            </View>
                           {this.state.details != null ?
                             <View style={{backgroundColor:'#ededed',padding:8,borderRadius:6,margin:15,height:"40%"}}>
                             <Text style={{fontWeight:'bold'}}>
                                 Whats New
                             </Text>
                             <ScrollView>
                         {this.state.details.map((item)=>{
                             return(
                                 <View style={{flexDirection:'row',marginTop:3}}>
                                 <Entypo name="dot-single" size={24} color="black" />
                                 <Text>{item.details}</Text>
                                 </View>
                             )
                         })}
                         </ScrollView>
                         </View>
                            :null}

                            <View style={{ flexDirection: "row", justifyContent:'space-around',marginTop:50,marginHorizontal:10}}>
                                <View style={{ width: "49%",height:40,backgroundColor:colors.danger,borderRadius:6}}>
                                    <Pressable
                                        style={{alignItems:'center'}}
                                        onPress={() => {
                                            this.props.navigation.goBack();
                                        }}
                                    >
                                        <Text style={[{ color: colors.white,alignSelf:'center',marginTop:10}]}>GO BACK</Text>
                                    </Pressable>
                                </View>

                                <View style={{ width: "49%", height:40,backgroundColor:colors.primary,borderRadius:6}}>
                                    <Pressable
                                        style={{}}
                                        onPress={() => {
                                            this.checkUpdates()
                                        }}
                                    >
                                        <Text style={{color:colors.white,alignSelf:'center',marginTop:10}}>Check for Updates</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                        : 
                        <>
                            <View style={{margin:10,justifyContent:'space-between',marginTop:20,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:18,fontWeight:'bold',}}>New Version Available </Text>
                                <View  style={{justifyContent:'center',alignItems:'center',width:100,height:40,backgroundColor:colors.primary,borderRadius:20}}>
                                <Text style={{fontSize:16,fontWeight:'bold',color:colors.white}}>V{this.state.newVersion.version} </Text>
                                </View>
                            </View>
                            
                            {this.state.details != null ?
                             <View style={{backgroundColor:'#ededed',padding:8,borderRadius:6,margin:15,height:"40%"}}>
                             <Text style={{fontWeight:'bold'}}>
                                 Whats New
                             </Text>
                             <ScrollView>
                         {this.state.details.map((item)=>{
                             return(
                                 <View style={{flexDirection:'row',marginTop:3}}>
                                 <Entypo name="dot-single" size={24} color="black" />
                                 <Text>{item.details}</Text>
                                 </View>
                             )
                         })}
                         </ScrollView>
                         </View>
                            :null}
                        
                            <View style={{ flexDirection: "row", justifyContent:'space-around',marginHorizontal:10,marginTop:50}}>
                                <View style={{ width: "49%",height:40,backgroundColor:colors.danger,borderRadius:6}}>
                                    <Pressable
                                        style={{alignItems:'center'}}
                                        onPress={() => {
                                            BackHandler.exitApp();
                                        }}
                                    >
                                        <Text style={[{ color: colors.white,alignSelf:'center',marginTop:10}]}>EXIT</Text>
                                    </Pressable>
                                </View>

                                <View style={{ width: "49%", height:40,backgroundColor:colors.primary,borderRadius:6}}>
                                    <Pressable
                                        style={{}}
                                        onPress={() => {
                                            WebBrowser.openBrowserAsync(this.state.newVersion.link)
                                        }}
                                    >
                                        <Text style={{color:colors.white,alignSelf:'center',marginTop:10}}>Update</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </>
                         } 
                    </View>
                    {/* </ImageBackground> */}
                
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: 'center',
        height:500,
        width:500,
        overflow:'visible',
      }
});