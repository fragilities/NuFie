import React from "react";
import Constants from "expo-constants";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Category from "../components/InterestCategory";
import SearchBar from "../components/searchBar";

export default function SearchInterest() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#B721FF", "#21D4FD"]}
        style={{ height: Constants.statusBarHeight }}
        start={[1.1, 1.0]}
      ></LinearGradient>
      <LinearGradient
        colors={["#B721FF", "#21D4FD"]}
        style={{ height: 150, justifyContent: "center" }}
        start={[1.1, 1.0]}
      >
        <Text style={styles.titlePage}>Explore Other Interest</Text>
      </LinearGradient>
      <SearchBar />
      <View style={styles.categoryWrapper}>
        <Category text="Music" />
        <Category text="Movie" />
        <Category text="Sports" />
        <Category text="Traveling" />
        <Category text="Food" textColor="#fff" />
        <Category text="Others" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titlePage: {
    textAlign: "center",
    fontWeight: "700",
    color: "#FFF",
    fontSize: 28
  },
  categoryWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around"
  }
});
