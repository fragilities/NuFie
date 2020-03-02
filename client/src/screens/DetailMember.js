import React from 'react'
import {useSelector} from 'react-redux'
import {View} from 'react-native'
import Member from '../components/memberCard'


export default function DetailMember(props) {
    const {detailMember} = useSelector(state => state.activity)
    return (
        <View>
            {
                detailMember.map(el => <Member key={el._id} data={el} activity={props.route.params.activityId} from={props.route.params.from}/>)
            }
        </View>
    )
}