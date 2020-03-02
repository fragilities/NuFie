import React, {useState} from 'react'
import {View, Text, Image, StyleSheet} from 'react-native'
import Btn from './btnAcceptDecline'
import {useDispatch, useSelector} from 'react-redux'
import {AcceptRequestJoin, DeclineRequestJoin} from '../store/actions/Activity'
import Load from '../components/loading'
import {useNavigation} from '@react-navigation/native'

export default function InvitationCard (props) {
    const navigation = useNavigation()
    const {profilePictureDefault} = useSelector(state => state.user)
    const [Loading, setLoading] = useState(false) 
    const data = props.data
    const dispatch = useDispatch()
    const handleAccept = () => {
        setLoading(true)
        dispatch(AcceptRequestJoin(
            {
                activityId: props.activityId, 
                targetId: data._id, 
                pushToken: data.pushToken
            }
        ))
        .then(() => {
            setLoading(false)
            navigation.navigate('My Activity')
        })
    }
    const handleDecline = () => {
        setLoading(true)
        dispatch(DeclineRequestJoin(
            {
                activityId: props.activityId, 
                targetId: data._id,
                pushToken: data.pushToken
            }
        ))
        .then(() => {
            setLoading(false)
            navigation.navigate('My Activity')
        })
    }
    const pp = () => {
        if(!data.profilePicture){
            return profilePictureDefault
        } else {
            return data.profilePicture
        }
    }
    return (
        <View style={style.container}>
            <View>
                <Image 
                    source={{uri: pp()}}
                    style={style.profile} 
                />
            </View>
            <View style={style.right}>
                <View>
                    <Text style={style.name}>{data.firstName} {data.lastName}</Text>
                    <Text>Wants to join your activity</Text>
                </View>
                {
                    Loading ? <Load/> :
                    <View style={style.btnWrap}>
                        <Btn text="Accept" handle={handleAccept}/>
                        <Btn text="Decline" handle={handleDecline}/>
                    </View>
                }

            </View>
        </View>
    )
}

const style = StyleSheet.create({
    profile: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    container: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: 'grey',
        borderRadius: 10,
        padding: 10,
        width: 220,
        color: 'white'
    },
    btnWrap: {
        flexDirection: 'row',
        marginTop: 5
    },
    right: {
        marginLeft: 30
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold'
    }
})
