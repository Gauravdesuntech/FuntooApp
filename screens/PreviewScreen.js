import React from "react";
import { View, StyleSheet, Text, TouchableHighlight, Image, FlatList, SafeAreaView, RefreshControl, Dimensions } from "react-native";
import Header from "../components/Header";
import Colors from "../config/colors";
import ProgressiveImage from "../components/ProgressiveImage";
import * as WebBrowser from 'expo-web-browser';
export default class PreviewScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.props.route.params?.url,
            type: "",
        };
    }


    componentDidMount = () => {
        this.getfileType(this.state.url);
    };


    getfileType = (fileName) => {
        let imageExtensions = [".jpg", ".gif", ".png", ".jpeg"];
        let videoExtensions = [".mp4", ".3gp", ".avi"];
        let audioExtensions = [".mp3", ".wav", ".m4a"];
        let otherExtensions = [".pdf", ".doc", ".docx"];
        let extension = fileName.substring(fileName.lastIndexOf("."))?.toLocaleLowerCase();
        let type = "";
        if (imageExtensions.includes(extension)) {
            type = "image";
        }
        if (videoExtensions.includes(extension)) {
            type = 'video'
        }
        if (audioExtensions.includes(extension)) {
            type = 'audio'
        }
        if (otherExtensions.includes(extension)) {
            type = 'other'
        }
        this.setState({
            type: type
        });

        if (type != "image") {
            this.browser(this.state.url);
        }
    }

    browser = async(url) => {
        await WebBrowser.openBrowserAsync(url);
        this.props.navigation.goBack()
    }


    render() {
        return (
            <>
                <SafeAreaView style={styles.container}>
                    <Header title="Preview" />
                    {this.state.type == "image" ?
                        <View style={styles.preview}>
                            <ProgressiveImage
                                source={{ uri: this.state.url }}
                            />
                        </View> : null}
                </SafeAreaView>
            </>
        )
    }

}

const windowheight = Dimensions.get("window").height;
const windowwidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    preview: {

        width: windowwidth - 10,
        height: windowheight,
        marginHorizontal: 5,
        borderRadius: 3,
    }
});