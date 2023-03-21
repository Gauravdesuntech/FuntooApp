import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import ProgressiveImage from "./ProgressiveImage";
import Colors from "../config/colors";

export default class ItemDiscount extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      inputValue: 0
    }
  }

  cleanDigit = (value) => {
		const cleanNumbers = value.replace(/[^0-9]/g, "");
		this.setState({
			inputValue: cleanNumbers
		},()=>{this.props.onChange(this.state.inputValue)})
	}

  render() {
    return (
      <View key={this.props.data.id.toString()} style={styles.listRow}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "20%" }}>
            <ProgressiveImage
              source={{ uri: this.props.data.game.image_url }}
              style={{ height: 57, width: "100%" }}
              resizeMode="cover"
            />
          </View>
          <View style={{ width: "50%", paddingLeft: 10 }}>
            <Text
              style={styles.inputLable}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {this.props.data.game.name}
            </Text>
            <Text style={styles.inputLable}>X {this.props.data.quantity}</Text>
          </View>
          <View>
            <Text style={styles.inputLable}>Rent</Text>
            <Text style={styles.inputLable}>
              <FontAwesome name="rupee" size={13} color={Colors.textColor} />
              {Math.trunc(this.props.data.quantity * this.props.data.price)}
            </Text>
            <TextInput
              autoCompleteType="off"
              keyboardType="numeric"
              value={this.state.inputValue}
              style={[styles.AmountInput, { width: 80, height: 35 }]}
              onChangeText={this.cleanDigit}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputLable: {
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 0,
    // opacity: 0.8,
    textAlign: "left",
  },
  AmountInput: {
    fontSize: 14,
    color: Colors.textColor,
    marginBottom: 0,
    // opacity: 0.8,
    textAlign: "left",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.textInputBorder,
    backgroundColor: Colors.textInputBg,
    padding: 9,
    width: "100%",
  },
});
