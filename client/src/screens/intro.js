import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import firebase from "../../config/config_firebase";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  useNavigation,
  useRoute,
  StackActions,
  NavigationAction,
  CommonActions
} from "@react-navigation/native";
import { ReadSelf } from "../store/actions/user";
import AwesomeAlert from "react-native-awesome-alerts";

const Slides = [
  {
    key: "slides1",
    title: "Discover People With Same Interest",
    text: "There will be many people with same Interest like you in our app",
    image: require("../../assets/asset3.png"),
    colors: ["#78ebcc", "#16a2ff"]
  },
  {
    key: "slides2",
    title: "Do Something Fun and New",
    text: "Every new friends is a new adventure and start of more memories",
    image: require("../../assets/asset1.png"),
    colors: ["#89f7fe", "#66a6ff"]
  },
  {
    key: "slides3",
    title: "Find new Connection",
    image: require("../../assets/asset2.png"),
    text: "Happines and Connection are made by meeting new people.",
    colors: ["#00f2fe", "#4facfe"]
  }
];

export default function IntroSlider(props) {
  const renderSlider = props => (
    <LinearGradient colors={props.item.colors}>
      <View
        style={[
          styles.container,
          { width: props.dimensions.width, height: props.dimensions.height }
        ]}
      >
        <View style={styles.imageWrapper}>
          <ImageBackground
            resizeMode="contain"
            source={props.item.image}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
        <Text style={styles.sliderTitle}>{props.item.title}</Text>
        <View style={styles.textwrapper}>
          <Text style={styles.sliderText}>{props.item.text}</Text>
        </View>
      </View>
    </LinearGradient>
  );
  const dispatch = useDispatch();
  const userData = useSelector(state => state.user.userData);
  const log = useSelector(state => state.user.login);
  const url = useSelector(state => state.other.url);
  const navigation = useNavigation();
  let flag = true;
  if (flag) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase
          .auth()
          .currentUser.getIdToken(true)
          .then(idToken => {
            const { email, firstName, lastName, password } = userData;
            if (flag) {
              return axios({
                method: "POST",
                url: `${url}/users/signIn`,
                data: { email, firstName, lastName, password, idToken }
              });
            }
          })
          .then(({ data, status }) => {
            if (flag) {
              dispatch({ type: "SET_LOGIN", val: data.userId });
              dispatch({ type: "SET_TOKEN", val: data.token });
              dispatch({ type: "SET_LOADING", val: false });
              dispatch(ReadSelf());
              if (status == "201") {
                navigation.navigate("InterestUpdate");
              } else if (status == "200") {
                navigation.navigate("MainPage");
              }
              flag = false;
            }
          })
          .catch(error => {
          });
      } else {
        if (log == "logout") {
          flag = true;
          dispatch({ type: "SET_LOGIN", val: false });
          navigation.dispatch(CommonActions.reset());
        }
      }
    });
  }

  return (
    <AppIntroSlider
      slides={Slides}
      onDone={props.done}
      onSkip={props.done}
      renderItem={renderSlider}
      showSkipButton
    />
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  imageWrapper: {
    height: 300,
    width: "80%"
  },
  sliderTitle: {
    fontWeight: "700",
    textAlign: "center",
    fontSize: 22,
    color: "#fff"
  },
  sliderText: {
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
    color: "#fff"
  },
  textwrapper: {
    padding: 10,
    width: "85%"
  }
});
