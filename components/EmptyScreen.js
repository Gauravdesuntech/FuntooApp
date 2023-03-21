import React, { Component } from "react";
import {
	View,
	StyleSheet,
	Text,
	SafeAreaView
} from "react-native";
import Colors from "../config/colors";
import LottieView from 'lottie-react-native';

export default class EmptyScreen extends Component {

	constructor(props) {
		super(props);
	}


	render = () => {
		return (
			<SafeAreaView style={this.props.noBackground ? styles.container2 : styles.container} >
				{/* <Header title="Invite friends" /> */}
				<View style={{ alignItems: 'center', marginTop: 150 }}>
					<LottieView
						ref={animation => {
							this.animation = animation;
							this.animation?.play();
						}}
						style={{
							width: 250,
							height: 250,
							//backgroundColor: '#eee',
						}}
						source={require('../assets/lottie/no-result-found.json')}
					/>
				</View>

				<View style={{ alignItems: 'center', marginTop: 10 }}>
					<Text style={{ fontSize: 20, color: 'red' }}>
						{ this.props.header ? this.props.header : 'Oops!' }
					</Text>

					<Text style={{ color: Colors.textColor, }}>
						{ this.props.message ? this.props.message : 'No records found !' }
					</Text>
				</View>

				<View style={{ alignItems: 'center', marginTop: 30 }}>
					{/* <TouchableOpacity style={{
            backgroundColor: "#c43160",
            paddingLeft: 50,
            paddingRight: 50,
            padding: 10,
            color: 'white',
            borderRadius: 10,
          }}>

            <Text style={{
              fontSize: 18,
              color: '#FAFAFA',
              marginLeft: 10,
              marginTop: 2,
              fontWeight: 'bold'
            }}>START SHOPPING</Text>

          </TouchableOpacity> */}
				</View>
			</SafeAreaView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	container2: {
		flex: 1,
	}
});