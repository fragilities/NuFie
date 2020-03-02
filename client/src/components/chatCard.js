import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export default function ChatCard(props) {
  const id = useSelector(state => state.user.login);
  const owner = () => {
    if (props.message.owner == id) {
      return { flexdir: "row-reverse", bg: "#bbe1fa" };
    } else {
      return { flexdir: "row", bg: "#69b3e5" };
    }
  };
  return (
    <View style={[style.container, { flexDirection: owner().flexdir }]}>
      <Image source={{ uri: props.message.profile }} style={style.profile} />
      <View>
        <Text style={[style.text, { backgroundColor: owner().bg }]}>
          {props.message.message}
        </Text>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  profile: {
    width: 43,
    height: 43,
    borderRadius: 45
  },
  container: {
    marginBottom: 10,
    alignItems: "center"
  },
  text: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 10,
    padding: 10,
    maxWidth: 220,
    color: "#000"
  }
});
