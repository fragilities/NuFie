import React, { useRef } from "react";
import { View, Dimensions, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import InputChat from "../components/ChatInput";
import Chat from "../components/ChatWrap";
import db from "../../config/config_firebase";

export default function ChatRoom(props) {
  const dataUser = useSelector(state => state.user);
  const scrollView = useRef();
  const roomId = props.route.params.roomId;
  const handleSend = event => {
    const message = {
      message: event,
      owner: dataUser.login,
      profile: dataUser.biodata.profilePicture,
      createdAt: new Date()
    };
    db.firestore()
      .collection("chat")
      .doc(roomId)
      .collection("arrMessage")
      .add(message)
      .then(data => {
      })
      .catch(() => {
      })
  };
  return (
    <View style={style.container}>
      <ScrollView
        ref={scrollView}
        onContentSizeChange={() => {
          scrollView.current.scrollToEnd({ animated: true });
        }}
      >
        <View style={style.chatBody}>
          <Chat roomId={roomId} />
        </View>
      </ScrollView>
      <View style={style.chatInput}>
        <InputChat handle={handleSend} />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    height: "100%",
    width: Dimensions.get("window").width,
    backgroundColor: "#d6e5fa"
    // paddingHorizontal: 6
    // alignItems: "center"
  },
  chatBody: {
    width: "99%",
    paddingHorizontal: 6,
    paddingTop: 8,
    justifyContent: "center"
  },
  chatInput: {
    alignItems: "center",
    width: "100%"
  }
});
