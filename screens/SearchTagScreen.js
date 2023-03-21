import React, { Component } from "react";
import {
    StyleSheet,
    SafeAreaView,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    ScrollView
} from "react-native";
import Colors from "../config/colors";
import { Header } from "../components";
import GamesForTagAndSubCat from "../components/GamesForTagAndSubCat";
import EmptyScreen from "../components/EmptyScreen";
import { GameListByTagId } from "../services/TagApiServices";


export default class SearchTagScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tagList: this.props.route.params.tagList != null ? this.props.route.params.tagList : [],
            category_id: this.props.route.params.category_id,
            currentTagid: this.props.route.params.tag_id,
            itemPressedId: -1,
            games: []
        };

        this.tagScrollViewRef = React.createRef();
    }

    componentDidMount() {
        if (this.state.tagList.length > 0) {
            this.fetchData()
        }
    }

    fetchData = () => {
        GameListByTagId(this.props.route.params.tag_id)
            .then((result) => {
                this.setState({
                    games: result.data,
                    currentTagid: this.props.route.params.tag_id,
                    itemPressedId: this.props.route.params.tag_id
                });
            })
            .catch(err => console.log(err))
            .finally(() => {
                this.setState({
                    isLoading: false
                });
            })
    }

    toggleTab = (item) => {
        this.setState({
            currentTagid: item.tag_id,
            itemPressedId: item.tag_id
        });
    };

    gotoAddGame = () => this.props.navigation.navigate("AddGame");

    render = () => {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="" addAction={this.gotoAddGame} />

                {this.state.isLoading ? <Loader />
                    :
                    <>
                        {
                            this.state.tagList.length > 0 ?
                                <View style={styles.scroll} >

                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexWrap: 'wrap', backgroundColor: Colors.white, paddingVertical: 5, paddingHorizontal: 5 }}>

                                        {/* <Ionicons style={styles.icon} name="chevron-back-outline" size={26} color={Colors.white} /> */}
                                        {
                                            this.state.tagList.length > 0 ?
                                                (this.state.tagList.map((item) => {
                                                    return (
                                                        <>

                                                            <TouchableOpacity
                                                                key={item.id}
                                                                // onPress={this.toggleTab.bind(this, item)}
                                                            >
                                                                <View style={[styles.listItem, { backgroundColor: Colors.primary , }]} key={item.id}>
                                                                    <Text style={[styles.name, { color: Colors.white}]}>
                                                                        {item.name}
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>

                                                        </>
                                                    )

                                                })

                                                ) : null
                                        }
                                        {/* <Ionicons style={styles.icon} name="chevron-forward-outline" size={26} color={Colors.white} /> */}
                                    </ScrollView>
                                </View>
                                : <EmptyScreen />}
                    </>
                }

                {
                    this.state.currentTagid && <GamesForTagAndSubCat
                        type={'for_tags'}
                        id={this.state.currentTagid}
                    />
                }
            </SafeAreaView>
        );
    }
}

const windowwidth = Dimensions.get("window").width;
const styles = StyleSheet.create({

    activeTabColor: {
        backgroundColor: 'red',
        padding: 5
    },

    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    icon: {
        top: 10,
    },
    listItem: {
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderWidth: 0.6,
        borderRadius: 3,
        borderColor: Colors.primary,
        marginRight: 5
    },
    left: {
        width: "20%",
        justifyContent: "center",
    },
    middle: {
        justifyContent: "center",
        flex: 1,
        paddingLeft: 10
    },
    right: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    name: {
        fontSize: 14,
        color: Colors.white,
    },
    scroll: {
        // backgroundColor: Colors.grey,
        // color: Colors.white,
        marginTop: 0,
    },

    galleryContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap"
    },
    galleryGrid: {
        width: Math.floor((windowwidth - 10) / 3),
        height: Math.floor((windowwidth - 10) / 3),
        alignItems: "center",
        justifyContent: "center",
    },
    galleryImg: {
        width: Math.floor((windowwidth - 10) / 3),
        height: Math.floor((windowwidth - 10) / 3),
        borderWidth: 2,
        borderColor: Colors.white,

    }
});