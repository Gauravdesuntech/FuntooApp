import React from "react";
import { Button } from 'react-native';

export default class VehicleStatusButton extends React.Component {
    constructor(props) {
        super(props);
    }

    setButtonTitle = () => {
        return ( this.props.title != '' ) ? this.props.title : 'Next';
    }

    handleOnePress = () => {
            this.props.navigation.navigate("VehicleArrivalEntry", { data: this.props.data })
    }

    render() {
        return (
            <Button 
                title={`${this.setButtonTitle()}`}
                onPress={this.handleOnePress}
            />
        )
    }
}