import React, { memo } from 'react';
import { StyleSheet, Text, TextInput as NativeInput } from 'react-native';
import { Input, Item, Label, Button, Spinner } from 'native-base';


const Password = ({ newLabel, oldabel, oldvalue, newValue, onOldPassChange,
    onNewPassChange, oldRef, newRef, onSubmit, completeSubmit, spinerShow, spinerHandle, ...props }) => {
    return (
        <>
            <Item floatingLabel>
                <Label>{oldabel}</Label>
                <Input
                    value={oldvalue}
                    onChangeText={(val) => { onOldPassChange(val) }}
                    getRef={oldRef}
                    onSubmitEditing={onSubmit}
                    {...props}
                />
            </Item>
            <Item floatingLabel>
                <Label>{newLabel}</Label>
                <Input
                    value={newValue}
                    getRef={newRef}
                    onChangeText={(val) => { onNewPassChange(val) }}
                    {...props}
                />
            </Item>
            <Button bordered block success style={{ marginTop: '5%' }}
                onPress={completeSubmit}
            >
                {spinerShow ?
                    <Spinner />
                    :
                    <Text>SUBMIT</Text>
                }
            </Button>
        </>
    );

}


export default memo(Password);
