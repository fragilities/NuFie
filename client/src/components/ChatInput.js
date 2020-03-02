import React, { useState } from "react";
import {
  View,
  Dimensions,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function ChatInput(params) {
  const [message, setMessage] = useState("");
  const handleChange = event => {
    setMessage(event.nativeEvent.text);
  };

  return (
    <View style={style.inputWrap}>
      <TextInput
        style={style.input}
        multiline={true}
        placeholder="Message"
        onChange={handleChange}
        value={message}
      />
      <TouchableOpacity
        onPress={() => {
          setMessage("");
          params.handle(message);
        }}
      >
        <FontAwesome name="send" style={style.icon} color="#3282b8" />
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  input: {
    height: "100%",
    width: "90%"
  },
  inputWrap: {
    flexDirection: "row",
    width: Dimensions.get("window").width,
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    minHeight: 50,
    maxHeight: 70,
    backgroundColor: "#fff"
  },
  icon: {
    fontSize: 20
  }
});
