import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function interestItem(props) {
  let colorGradient = [];
  if (props.text.toLowerCase() == "music") {
    colorGradient = ["#03C8A8", "#89D8D3"];
  } else if (props.text.toLowerCase() == "movie") {
    colorGradient = ["#F56545", "#99201C"];
  } else if (props.text.toLowerCase() == "sports") {
    colorGradient = ["#FAD961", "#F76B1C"];
  } else if (props.text.toLowerCase() == "travelling") {
    colorGradient = ["#0093E9", "#80D0C7"];
  } else if (props.text.toLowerCase() == "food") {
    colorGradient = ["#fe8c00", "#f83600"];
  } else {
    colorGradient = ["#4568DC", "#B06AB3"];
  }
  const renderIcon = () => {
    if (props.text.toLowerCase() == "music") {
      return <FontAwesome name="music" color="#fff" size={20} />;
    } else if (props.text.toLowerCase() == "movie") {
      return <MaterialCommunityIcons name="popcorn" color="#fff" size={20} />;
    } else if (props.text.toLowerCase() == "travelling") {
      return <FontAwesome name="suitcase" color="#fff" size={20} />;
    } else if (props.text.toLowerCase() == "sports") {
      return <FontAwesome name="soccer-ball-o" color="#fff" size={20} />;
    } else if (props.text.toLowerCase() == "food") {
      return <MaterialCommunityIcons name="food" color="#fff" size={20} />;
    } else {
      return (
        <MaterialCommunityIcons name="hexagon-slice-6" color="#fff" size={20} />
      );
    }
  };
  return (
    <LinearGradient colors={colorGradient} style={styles.container}>
      {renderIcon()}
      <Text style={styles.text}>{props.text}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    marginBottom: 5,
    flexDirection: "row",
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 12
  },
  text: {
    color: "#fff",
    marginLeft: 6
  }
});
