import React, {Component} from "react";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
    Image,
    SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import OverlayLoader from "../../components/OverlayLoader";
import { GetOrderSetupPhotos } from "../../services/OrderService";
import LottieView from 'lottie-react-native';

export default class OrderSetupPhotos extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order_id: this.props.route.params.orderItem.id,
            isLoading: false,
            orderSetupPhotos: []
        }
    }

    componentDidMount() {
        this.setState({isLoading: true});
        GetOrderSetupPhotos({order_id: this.state.order_id })
        .then( (result) => {
            if(result.is_success) {
                this.setState({
                    orderSetupPhotos: result.data
                });
            }
        })
        .catch( err => console.log(err) )
        .finally( () => {
            this.setState({isLoading: false});
        });
    }

    render() {
        return(
            <>
                {this.state.isLoading ? <OverlayLoader /> : (
                    <SafeAreaView style={styles.container}>
                        <Header title="Setup Photos Proof" />
                        {this.state.isLoading && <OverlayLoader visible={this.state.isLoading} />}
                        <ScrollView>
                            {this.state.orderSetupPhotos.length > 0 && this.state.orderSetupPhotos.map( (item) => {
                                return (
                                    <View style={ styles.card } key={item.game_id}>

                                        <View style={{ marginHorizontal: '25%', padding: 10,  marginTop: 10, marginBottom: 10, backgroundColor: Colors.primary, width: '50%', justifyContent: 'center', borderRadius: 5 }}>
                                            <Text style={{ alignSelf: 'center', color: Colors.white }}>{item.name}</Text>
                                        </View>

                                        <View style={styles.imageContainer}>
                                            { item.setup_photos.length > 0 ? item.setup_photos.map( (photo) => {
                                                if(photo.thumb_uri) {
                                                    return <View style={{width: '50%', justifyContent: 'center'}} key={photo.label}>
                                                            <Text style={styles.textLabel}>{photo.label}</Text>

                                                            <Image 
                                                                source={ {uri: photo.thumb_uri } } 
                                                                style={styles.imageStyle} 
                                                            />
                                                            
                                                    </View>
                                                } else {
                                                    return <View style={{width: '50%', justifyContent: 'center'}} key={photo.label}>
                                                        <Text style={styles.textLabel}>{photo.label}</Text>
                                                        <Ionicons
                                                            name="image"
                                                            color={Colors.lightGrey}
                                                            size={90}
                                                            style={styles.imageStyle} />
                                                    </View>
                                               
                                                }

                                            } ) : <View style={{justifyContent: 'center', borderColor: 'red', borderRadius: 1}}>
                                                    <LottieView
                                                        ref={animation => {
                                                            this.animation = animation;
                                                            this.animation?.play();
                                                        }}
                                                        style={{
                                                            width: 250,
                                                            height: 250,
                                                        }}
                                                        source={require('../../assets/lottie/no-result-found.json')}
                                                    />

                                                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                                                        <Text style={{ fontSize: 20, color: 'red' }}>
                                                            { this.props.header ? this.props.header : 'Oops!' }
                                                        </Text>

                                                        <Text style={{ color: 'grey' }}>
                                                            { this.props.message ? this.props.message : 'No photo uploaded yet!' }
                                                        </Text>

                                                    </View>
                                                </View> 
                                            }
                                        </View>
                                    </View>
                                )
                            } )}
                        </ScrollView>
                    </SafeAreaView>
                )}
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
		backgroundColor: Colors.white
    },
    imageContainer: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'center',
        alignItems: "flex-start", 
        flexWrap: "wrap",
    },
    imageStyle: {
        width: '50%',
		height: '40%',
		borderWidth: 2,
		borderColor: Colors.white,
        alignSelf: 'center'
    },
    card: {
        width: "100%",
		paddingHorizontal: 8,
		paddingVertical: 10,
		backgroundColor: Colors.white,
		borderRadius: 4,
		elevation: 10,
		marginBottom: 5,
        marginTop: 5
    },
    textLabel: {
        alignSelf: 'center', 
        fontSize: 12, 
        color: Colors.grey
    }
})