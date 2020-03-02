import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ButtonOnPost(prop) {
  return (
    <TouchableOpacity
      onPress={() => {
        prop.handle();
      }}
    >
      <View
        style={[style.container, { backgroundColor: prop.color || "#777777" }]}
      >
        <Ionicons name={prop.icon} color={prop.iconColor || "#fff"} size={20} />
        <Text style={style.text}>{prop.text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
    width: 160,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row"
  },
  text: {
    color: "white",
    fontSize: 15,
    marginLeft: 8
  }
});
