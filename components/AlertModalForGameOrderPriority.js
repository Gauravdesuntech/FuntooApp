import AwesomeAlert from 'react-native-awesome-alerts';
import { useState } from 'react';

function AlertModalForGameOrderPriority(props) {

    const [ isVisible, setIsVisible ] = useState(props.isVisible);

    return (

        <AwesomeAlert
            show={isVisible}
            showProgress={false}
            title={props.alertType}
            message={props.message}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            cancelText="cancel"
            confirmText="Ok"
            confirmButtonColor="#DD6B55"
            onCancelPressed={() => {
                this.hideAlert();
            }}
            onConfirmPressed={() => {
                this.hideAlert();
            }}
        />
    )
}