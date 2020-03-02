import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function AcceptDecline(props) {
  return (
    <TouchableOpacity
      onPress={() => {
        props.handle();
      }}
    >
      <View
        style={[style.container, { backgroundColor: props.color || "#c1c1c1" }]}
      >
        <Text style={style.text}>{props.text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: "grey",
    width: 90,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 7,
    paddingRight: 7,
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 13,
    marginRight: 7
  },
  text: {
    color: "white",
    fontWeight: "bold"
  }
});
