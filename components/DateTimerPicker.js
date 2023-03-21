import React from "react";

import {
    View,
    Text,
    Pressable,
    StyleSheet
} from "react-native";
import Colors from "../config/colors";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import { formatDateTimetoMysqlDateTimeFormat, showDateAsClientWant,showDateAsWant } from "../utils/Util";

export default class DateTimerPicker extends React.Component {

    static defaultProps = {
        pickerMode: 'date'
    }

    constructor(props) {
        super(props);
        this.state = {
            showPicker: false,
            pickerMode: this.props.pickerMode
        }
    }

    renderMoment = () => {

        let momentString = this.props.dateTime;
        if( momentString instanceof Date) {
            momentString = formatDateTimetoMysqlDateTimeFormat(momentString);
        }

        if(this.state.pickerMode == 'date') {
            return showDateAsWant(momentString);
        }

        return moment(momentString).format('h:mm A');
    }

    initTime = () => {
        if(this.props.dateTime) {
            if(this.props.dateTime instanceof Date) {
                return this.props.dateTime;
            } else {
                let d = new Date();
                d.setTime( Date.parse(this.props.dateTime) )
                return d;
            }
        }
        
        return new Date();
    }

    render() {
        return(
            <>
                <Pressable 
                    onPress={ () => this.setState({
                        showPicker: true
                    }) }
                    >
                    <View style={styles.inputContainer}>
                        {
                            this.props.label && <Text style={styles.inputLable}>{this.props.label}</Text>
                        }
						<View style={styles.textInput}>
                            {
                                this.props.dateTime ? (
                                    <Text style={[ styles.momentStyle, this.props.momentStyle ]}>
                                        {this.renderMoment() }
                                    </Text>
                                ) : (
                                    <Text
                                        style = {styles.placeHolderText}
                                    >
                                        {this.state.pickerMode === "date" ? "DD/MM/YYYY" : "HH:MM"}
                                    </Text>
                                )
                            }
						</View>
					</View>
                </Pressable>

                {
                    this.state.showPicker && 
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.initTime()}
                        mode={this.state.pickerMode}
                        is24Hour={false}
                        onChange={ (event, selectedDate) => {
                            this.setState({showPicker: false});
                            this.props.onChange(selectedDate);
                        } }
                    />
                }
            </>
        )
    }
}

const styles = StyleSheet.create({
    momentStyle: {
        fontSize: 14,
        color: Colors.textColor,
        alignSelf: 'center',
        marginVertical: 10,
        // opacity:Colors.opacity6
    },
	inputContainer: {
		width: "100%"
	},
	inputLable: {
		fontSize: 16,
		color: Colors.textColor,
        // opacity:Colors.opacity6
	},
	textInput: {
        fontSize: 14,
        width: "100%",
        // borderRadius: 4,
        borderColor: "#fff",
        backgroundColor: "#fff",
        // color: Colors.black,
        // opacity:Colors.opacity6
	},
    placeHolderText: {
        fontSize: 14,
        color: Colors.textColor,
        marginVertical: 10,
        alignSelf: 'center'
    }
});