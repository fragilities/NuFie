import React, {useState} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Btn from "./btnAcceptDecline";
import { useDispatch, useSelector } from "react-redux";
import { AcceptInvite, DeclineInvite } from "../store/actions/Activity";
import Load from '../components/loading'

export default function InvitationCard(props) {
  const dispatch = useDispatch();
  const {profilePictureDefault} = useSelector(state => state.user);
  const [loading, setLoading] = useState(false)
  const handleAccept = () => {
    setLoading(true)
    dispatch(AcceptInvite(props.data._id))
    .then(() => {
      setLoading(false)
    })
  };
  const handleDecline = () => {
    setLoading(true)
    dispatch(DeclineInvite(props.data._id))
    .then(() => {
      setLoading(false)
    })
  };
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: props.data.owner.profilePicture || {profilePictureDefault} }}
        style={styles.image}
      />
      <View style={styles.textWrapper}>
        <Text style={styles.name}>
          {props.data.owner.firstName} {props.data.owner.lastName}
        </Text>
        <Text style={styles.inviteText}>
          Invited you to Join " {props.data.title} " Activity
        </Text>
        {
          loading ? <Load/> :
          <View style={styles.btnWrap}>
            <Btn text="Accept" color="#00c6fb" handle={handleAccept} />
            <Btn text="Decline" color="#ef4339" handle={handleDecline} />
          </View>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 120,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4
  },
  image: {
    height: 65,
    width: 65,
    borderRadius: 65
  },
  textWrapper: {
    marginLeft: 14
  },
  btnWrap: {
    flexDirection: "row",
    marginTop: 5
  },
  name: {
    fontWeight: "700",
    fontSize: 18
  },
  inviteText: {
    color: "#777777",
    fontSize: 12
  }
  //   profile: {
  //     width: 80,
  //     height: 80,
  //     borderRadius: 40
  //   },
  //   container: {
  //     marginTop: 15,
  //     flexDirection: "row",
  //     alignItems: "center"
  //   },
  //   text: {
  //     marginLeft: 15,
  //     marginRight: 15,
  //     backgroundColor: "grey",
  //     borderRadius: 10,
  //     padding: 10,
  //     width: 220,
  //     color: "white"
  //   },

  //   right: {
  //     marginLeft: 30
  //   },
  //   name: {
  //     fontSize: 20,
  //     fontWeight: "bold"
  //   }
});
