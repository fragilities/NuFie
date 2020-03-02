import React from 'react'
import {View, ActivityIndicator} from 'react-native'

export default function Loading() {
    return (
        <View>
             <ActivityIndicator size="large" color="#0000ff" />
        </View>
    )
    
}