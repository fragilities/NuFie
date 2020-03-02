import React from 'react'
import {View, Text} from 'react-native'
import Request from '../components/requestCard'

export default function PendingRequest({route}) {
    const request = route.params.data
    return (
        <View>
            {
                request.map(el => <Request key={el._id} data={el} activityId={route.params.activityId}/>)
            }
        </View>
    )
}