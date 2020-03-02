import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import Item from "../components/itemsInterest";
import { useSelector, useDispatch } from "react-redux";
import { UpdateProfile } from "../store/actions/user";
import { useNavigation } from "@react-navigation/native";

const interestList = [
  { name: "Movie", image: require("../../assets/interest-movie.jpg") },
  { name: "Music", image: require("../../assets/interest-music.jpeg") },
  {
    name: "Travelling",
    image: require("../../assets/interest-travelling.jpeg")
  },
  { name: "Food", image: require("../../assets/interest-food.jpeg") },
  { name: "Sports", image: require("../../assets/interest-sports.jpeg") }
];

export default function interestUpdate() {
  const interest = useSelector(state => state.user.interest);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const updateInterest = dataEdit => {
    const formData = new FormData();
    formData.append("interests", JSON.stringify(interest));
    dispatch(UpdateProfile(formData));
    navigation.navigate("MainPage");
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#5433FF", "#20BDFF"]}
        start={[1.1, 0.2]}
        style={styles.header}
      >
        <Text style={styles.title}>Choose Your Interest</Text>
      </LinearGradient>
      <ScrollView style={{ width: "100%" }}>
        <View style={styles.bodyScreen}>
          {interestList.map((el, i) => (
            <Item data={el} key={i} />
          ))}
        </View>
        <TouchableOpacity
          style={{ alignItems: "center", width: "100%" }}
          onPress={updateInterest}
        >
          <View style={styles.buttonSave}>
            <Text style={styles.btnText}>Save Interest</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingTop: Constants.statusBarHeight,
    alignItems: "center"
  },
  header: {
    height: "25%",
    width: Dimensions.get("window").width,
    justifyContent: "center",
    backgroundColor: "#0ff"
  },
  bodyScreen: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingTop: 10
  },
  title: {
    textAlign: "center",
    fontSize: 23,
    fontWeight: "700",
    color: "#fff"
  },
  buttonSave: {
    marginBottom: 30,
    backgroundColor: "#323edd",
    width: "85%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 20
  },
  btnText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 18
  }
});
