import React, { memo } from 'react';
import { StyleSheet, Text, TextInput as NativeInput } from 'react-native';
import { Input, Item, Label, Button, Spinner } from 'native-base';


const Mpin = ({ newLabel, oldabel, oldvalue, newValue, onOldPinChange, onNewPinChange, 
    oldRef, newRef, onSubmit,completeSubmit,spinerShow,spinerHandle, ...props }) => (
    <>
        <Item floatingLabel>
            <Label>{oldabel}</Label>
            <Input
                value={oldvalue}
                onChangeText={(val) => { onOldPinChange(val) }}
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
                onChangeText={(val) => { onNewPinChange(val) }}
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


export default memo(Mpin);
