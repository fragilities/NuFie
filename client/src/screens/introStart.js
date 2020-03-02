import React, {useState, useEffect} from 'react'
import IntroSlider from "./intro"
import { useNavigation } from '@react-navigation/native'
import {Notifications} from 'expo'

export default function Intro() {
    const navigation = useNavigation()
    const [notification, setNotification] = useState({})
    const handleNotification = (notif) => {
      setNotification(notif)
    }
    useEffect(() => {
      _notificationSubscription = Notifications.addListener(handleNotification)
    },[])
    const changeStateShow = () => {
        navigation.navigate('Home')
    } 
    return (
      <IntroSlider done={changeStateShow} />
    )
}