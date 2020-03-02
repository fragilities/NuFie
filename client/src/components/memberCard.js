import React, {useState} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {useNavigation} from '@react-navigation/native'
import {useSelector, useDispatch} from 'react-redux'
import {KickMember} from '../store/actions/Activity'
import Load from './loading'

function FriendCard(props) {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const {profilePictureDefault} = useSelector(state => state.user)
  const handlePress = () => {
    navigation.navigate('DetailMember', {data: props.data})
  }
  const pp = () => {
    if(!props.data.profilePicture){
        return profilePictureDefault
    } else {
        return props.data.profilePicture
    }
  }

  const kickMember = () => {
    setLoading(true)
    dispatch(KickMember({activityId: props.activity, targetId: props.data._id, pushToken: props.data.pushToken}))
    .then(() => {
      navigation.goBack()
      setLoading(false)
    })
  }
  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.friendsContainer}>
        <View style={styles.leftContainer}>
          <Image
            source={
              { uri: pp() }
            }
            style={styles.contactImage}
          />
          <Text style={styles.name}>
            {props.data.firstName} {props.data.lastName}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          {
            props.from ? loading ? <Load/> :
            <TouchableOpacity onPress={kickMember}>
              <View style={styles.buttonInvite}>
                <Text style={styles.buttonText}>KickOut</Text>
              </View>
            </TouchableOpacity>
            : <View></View>
          }
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  friendsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    marginTop: 5,
    width: "98%",
    borderRadius: 10
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%"
  },
  name: {
    fontSize: 16,
    fontWeight: "700"
  },
  rightContainer: {
    width: "25%"
  },
  contactImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 10,
    borderWidth: 3
  },
  contactText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  buttonInvite: {
    paddingVertical: 6,
    backgroundColor: "#f79c1d",
    borderRadius: 10
  },
  buttonText: {
    textAlign: "center",
    color: "white"
  }
});

export default FriendCard;
