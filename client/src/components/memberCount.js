import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {MaterialIcons} from '@expo/vector-icons'

export default function CountMember(props) {
    return (
        <View style={style.container}>
            <MaterialIcons name="people" size={25} />
            <Text style={style.text}>{props.totalMember} Members</Text>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'grey',
        borderWidth: 1,
        width: 130,
        borderRadius: 10,
        height: 30
    },
    text:{
        fontWeight: 'bold'
    }
})