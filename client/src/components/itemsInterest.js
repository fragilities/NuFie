import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function itemIterest(props) {
  const [clicked, setClicked] = useState(false);
  const interest = useSelector(state => state.user.interest);
  const dispatch = useDispatch();
  const handlePress = () => {
    setClicked(!clicked);
    if (!clicked) {
      dispatch({ type: "SET_INTEREST", val: [...interest, props.data.name] });
    } else {
      dispatch({
        type: "SET_INTEREST",
        val: interest.filter(element => element !== props.data.name)
      });
    }
  };
  return (
    <TouchableOpacity style={styles.listItem} onPress={handlePress}>
      <ImageBackground
        source={props.data.image}
        style={{ width: "100%", height: "100%", opacity: 0.8 }}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
            padding: 14
          }}
        >
          <View style={styles.circle}>
            {clicked ? <Entypo name="check" size={18} /> : <Text></Text>}
          </View>
          <Text style={styles.text}>{props.data.name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  listItem: {
    height: 240,
    width: "46%",
    marginBottom: 10,
    borderRadius: 20,
    overflow: "hidden"
  },
  circle: {
    height: 25,
    width: 25,
    borderRadius: 25,
    backgroundColor: "#fff",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 10,
    top: 9
  },
  circleSmall: {
    width: "70%",
    height: "70%",
    borderRadius: 100,
    backgroundColor: "#000"
  },
  text: {
    fontWeight: "700",
    fontSize: 22,
    color: "#fff"
  }
});
