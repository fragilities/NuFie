import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ButtonLoginRegis(props) {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: props.color || "#fff" }]}
      onPress={() => props.handle()}
    >
      <Text style={{ fontWeight: "700", color: props.textColor || "#000" }}>
        {props.text || "LOGIN"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "85%",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 30,
    marginVertical: 5
  }
});
