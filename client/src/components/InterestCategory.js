import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ImageBackground
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { FetchCategory } from "../store/actions/Activity";

export default function InterestCategory(props) {
  let image;
  if (props.text === "Music") {
    image = require("../../assets/music.jpg");
  } else if (props.text === "Food") {
    image = require("../../assets/food.jpg");
  } else if (props.text === "Sports") {
    image = require("../../assets/sports.jpeg");
  } else if (props.text === "Traveling") {
    image = require("../../assets/travelling.jpg");
  } else if (props.text === "Movie") {
    image = require("../../assets/movie.jpg");
  } else {
    image = require("../../assets/other.jpeg");
  }

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const handlePress = () => {
    dispatch(FetchCategory(props.text.toLowerCase()));
    navigation.navigate("Category", { interest: props.text });
  };
  return (
    <TouchableHighlight
      style={[styles.container, { backgroundColor: props.color || "#f1f1" }]}
      onPress={handlePress}
    >
      <ImageBackground
        style={{ height: "104%", width: "100%", justifyContent: "center" }}
        source={image}
      >
        <Text style={[styles.cardLabel, { color: props.textColor || "#fff" }]}>
          {props.text}
        </Text>
      </ImageBackground>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: "46%",
    marginVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    overflow: "hidden"
  },
  cardLabel: {
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 10
  }
});
