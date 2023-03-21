import React, {Component} from "react";
import {
	Text,
	Pressable,
    StyleSheet
} from "react-native";
import {AntDesign } from "@expo/vector-icons";
import propTypes from "prop-types";
import Colors from "../config/colors";

export default class ShowMoreLess extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowMoreOpen: false
        }
    }

    render() {
        return (
            <>
                <Pressable
                    style={styles.btnBackground}
                    onPress = { ()=> this.setState({isShowMoreOpen: !this.state.isShowMoreOpen}) }
                    >
                    <Text style={styles.btn}>Show {this.state.isShowMoreOpen ? 'Less' : 'More'} <AntDesign name={ this.state.isShowMoreOpen ? 'upcircleo' : 'downcircleo' } size={16} color="#fff" /></Text>
                </Pressable>

                {/* applying react render props pattern here */}
                { this.state.isShowMoreOpen && this.props.render() }
            </>
        )
    }
}

ShowMoreLess.propTypes = {
    render: propTypes.func
}

const styles = StyleSheet.create({
    btnBackground: {
        padding: 5,
        backgroundColor: Colors.primary,
        width: '50%',
        justifyContent: 'center',
        borderRadius: 6,
        marginTop: 10
    },
    btn: {
        color: Colors.white,
        textAlign: 'center'
    }
});