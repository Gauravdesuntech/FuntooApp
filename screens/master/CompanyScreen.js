import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	Image,
    SafeAreaView,
} from "react-native";

import { Header } from "../../components";

export default class CompanyScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
       return (
        <SafeAreaView>
            <Header title="Company"/>
            <Text style={{alignSelf :"center",top: 100,fontSize: 20,color:"#444",opacity: 0.6}}>Company Master screen</Text>
        </SafeAreaView>
       )
    }
}