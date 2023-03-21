import React from "react";
import {
    StyleSheet,
    Text,
    Pressable
} from "react-native";
import Colors from "../config/colors";

export default function PressableButton(props) {
    return(
        <Pressable style={[styles.btnStyle, props.btnStyle,]} onPress={ () => props.onPress() } >
            <Text style={[styles.btnTextStyle, props.btnTextStyle]}>{ (props.text) ? props.text  : 'Save' } {props.icon ? props.icon :null}</Text>
            
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btnTextStyle: {
        fontSize: 18,
        color: Colors.white,
        alignSelf: 'center'
    },
    btnStyle: {
        borderRadius: 4,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        height: 50,
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%'
    }
});