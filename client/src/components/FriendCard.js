import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import dummyPP from "../../assets/dummy_pp.webp";
import { useDispatch } from "react-redux";
import { InviteFriend } from "../store/actions/Activity";

function FriendCard(props) {
  const dispatch = useDispatch();
  const [textButton, setTextButton] = useState("INVITE");
  const [isButtonActive, setIsButtonActive] = useState(false);
  const inviteFriend = () => {
    dispatch(
      InviteFriend({
        userId: props.data._id,
        postId: props.detailPost._id,
        pushToken: props.data.pushToken
      })
    );
    setTextButton("WAITING RESPONSE");
    setIsButtonActive(true);
  };

  useEffect(() => {
    if (props.detailPost.pendingInvites.includes(props.data._id)) {
      setTextButton("WAITING RESPONSE");
      setIsButtonActive(true);
    }
  }, []);

  return (
    <View style={styles.friendsContainer}>
      <View style={styles.leftContainer}>
        <Image
          source={
            !props.data.profilePicture
              ? dummyPP
              : { uri: props.data.profilePicture }
          }
          style={styles.contactImage}
        />
        <Text style={styles.name}>
          {props.data.firstName} {props.data.lastName}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={inviteFriend} disabled={isButtonActive}>
          {textButton === "INVITE" ? (
            <View style={styles.buttonInvite}>
              <Text style={styles.buttonText}>{textButton}</Text>
            </View>
          ) : (
            <View style={[styles.buttonInvite, { backgroundColor: "#c2c2c2" }]}>
              <Text style={styles.buttonText}>{textButton}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
    // <View style={styles.friendsContainer}>
    //     <View style={styles.leftContainer}>
    //         <Image
    //         source={dummyPP}
    //         style={styles.contactImage}
    //         />
    //         <Text style={styles.contactText}>{props.data.firstName} {props.data.lastName}</Text>
    //     </View>
    //     <View style={styles.rightContainer}>
    //         <TouchableOpacity onPress={inviteFriend} disabled={isButtonActive}>
    //             <View style={styles.buttonInvite}>
    //                 <Text style={styles.buttonText}>{textButton}</Text>
    //             </View>
    //         </TouchableOpacity>
    //     </View>
    // </View>
  );
}

const styles = StyleSheet.create({
  friendsContainer: {
    flexDirection: "row",
    // paddingVertical: 8,
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
