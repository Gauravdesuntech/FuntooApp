import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const UserList = ({ userData,onUserPress }) => {

    const URL = 'http://stage.cablinkdigital.in/money-lover/uploads/users/profile_photo/';
    // console.log("userData===========================>", onUserPress)
    // console.log('............userData.........',userData)
    return (
        <>
            {/* <View style={styles.backgroundStyle}>
                <Feather name='search' style={styles.searchIcon} />
                <TextInput
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    placeholder='Search'
                    style={styles.inputStyle}
                // value={term}
                // onChangeText={(newTerm) => { onTermChange(newTerm) }}
                // onEndEditing={onTermSubmit}
                />
            </View> */}
            <ScrollView>
                <View style={styles.maincontainer}>
                    {/* <Text style={styles.titleStyle}>{title}</Text> */}
                    <FlatList
                        data={userData}
                        keyExtractor={(item, index) => {item.id+index}}
                        renderItem={({ item }) => {
                            //console.log("Key",key)
                            return <TouchableOpacity
                            
                            onPress={()=>{onUserPress(item)}}
                            >
                                <View style={styles.container}>
                                    {/* <Image
                                        source={{ uri: `${URL}${item.profile_photo}` }}
                                        style={styles.userImageStyle}
                                    /> */}
                                    <Text style={styles.userName}>{`${item.name}`}</Text>
                                    {/* <Text>{`${result.rating} Stars, ${result.review_count} Reviews`}</Text> */}
                                </View>
                            </TouchableOpacity>
                        }}
                    />
                </View>
            </ScrollView>
        </>
    )
}


const styles = StyleSheet.create({
    maincontainer: {
        marginTop: 15,
        marginHorizontal: 15,
    },
    backgroundStyle: {
        backgroundColor: '#F0EEEE',
        height: 50,
        borderRadius: 5,
        marginHorizontal: 15,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    },
    inputStyle: {
        flex: 1,
        fontSize: 18
    },
    searchIcon: {
        fontSize: 35,
        alignSelf: 'center',
        marginHorizontal: 15
    },
    container: {
        marginBottom: 15,
        flexDirection: 'row'
    },
    titleStyle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 15
    },
    noResultFound: {
        alignSelf: 'center',
        fontWeight: '600',
        fontSize: 16,
        marginTop: 15
    },
    // container: {
    //     marginLeft: 15,
    // },
    userImageStyle: {
        width: 30,
        height: 30,
        borderRadius: 5,
        marginBottom: 5,
        marginRight: 10
    },
   userName: {
        fontSize: 24,
        fontWeight: '800',
        width: 250
    }

})

export default UserList;