import React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BtnLogin from "../components/buttonLoginRegis";

const logoBrand = require("../../assets/logo.png");

export default function LandingScreen() {
  const navigation = useNavigation();
  const moveToLogin = () => {
    navigation.navigate("Login");
  };
  const moveToRegister = () => {
    navigation.navigate("Register");
  };
  return (
    <View style={styles.container}>
      <View style={styles.bg}>
        <ImageBackground
          source={require("../../assets/intro-bg.png")}
          style={{ height: "100%", width: "100%" }}
        />
      </View>
      <View style={styles.bg2}></View>
      <View style={styles.bg3}></View>
      <View style={styles.bodyWrapper}>
        <View style={{ height: 150, width: 150, marginBottom: 180 }}>
          <ImageBackground
            source={logoBrand}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
        <View style={styles.wrapperButton}>
          <BtnLogin
            text="LOGIN"
            handle={moveToLogin}
            color="#4d80e4"
            textColor="#fff"
          />
          <BtnLogin
            text="REGISTER"
            color="#70bcf3"
            textColor="#fff"
            handle={moveToRegister}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingBottom: 50
  },
  bg: {
    width: "100%",
    height: "56%",
    position: "absolute",
    zIndex: -2
  },
  bg2: {
    height: 200,
    width: 200,
    backgroundColor: "#70bcf3",
    position: "absolute",
    bottom: -100,
    right: -70,
    borderRadius: 200,
    zIndex: -1
  },
  bg3: {
    height: 160,
    width: 160,
    backgroundColor: "#486dac",
    position: "absolute",
    bottom: 60,
    left: -110,
    borderRadius: 200,
    zIndex: -1
  },
  bodyWrapper: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  wrapperButton: {
    width: "90%",
    alignItems: "center"
  }
  // wrapperText: {
  //   alignSelf: "center",
  //   justifyContent: "center"
  // },

  // titleWelcome: {
  //   fontSize: 32,
  //   color: "#fff",
  //   textAlign: "center"
  // }
});