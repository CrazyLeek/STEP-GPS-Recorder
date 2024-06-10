import React, { useState, useContext } from 'react';

import { View, Text, Button, FlatList, StyleSheet,
         TouchableOpacity, Pressable, Modal, ActivityIndicator } from 'react-native';





export default function PersonalisedButton({onPress, text, loadAnimation=false}){

    functionToCall = loadAnimation?() => {}:onPress;

    return (

        <TouchableOpacity
            onPress={functionToCall}

            style={style.button}
        >   
            
            <Text 
                style={style.text}
            >
                {text}
            </Text>

            {loadAnimation &&
            <ActivityIndicator 
                size="large" 
                color="#0000ff"
                style={{margin:10}} />
            }

        </TouchableOpacity>

    );
}


const style = StyleSheet.create({

    button: {
        //maxHeight:"12%",
        flex: 1,
        flexWrap: "nowrap",
        flexDirection: "row",
        backgroundColor: '#ff9a8d',
        padding: 15,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignContent: "center",
        
      },

    text: {
        fontSize:25, 
        borderRadius:10,
    }

})