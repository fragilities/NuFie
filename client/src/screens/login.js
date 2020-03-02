import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  KeyboardAvoidingView
} from "react-native";
import { TextField } from "react-native-material-textfield";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { LoginEmailPassword } from "../store/actions/user";
import { useSelector } from "react-redux";
import ButtonLogin from "../components/buttonLoginRegis";
import Loading from "../components/loading";
import AwesomeAlert from "react-native-awesome-alerts";

export default function Login() {
  const load = useSelector(state => state.user.loading);
  const { errorTrigger } = useSelector(state => state.other);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const handleLogin = () => {
    dispatch({
      type: "SET_USERDATA",
      val: { email, password, firstName: null, lastName: null }
    });
    dispatch(LoginEmailPassword({ email, password }));
  };
  const handleEmail = prop => {
    setEmail(prop.nativeEvent.text);
  };

  const handlePassword = prop => {
    setPassword(prop.nativeEvent.text);
  };
  return (
    <KeyboardAvoidingView
      style={{ width: "100%", height: "100%" }}
      behavior="height"
    >
      <View style={styles.container}>
        <View style={styles.bgtop}>
          <ImageBackground
            source={require("../../assets/bg-top.png")}
            style={{ height: "100%", width: "100%" }}
          ></ImageBackground>
        </View>
        <View style={styles.bgbot}>
          <ImageBackground
            source={require("../../assets/bg-bot.png")}
            style={{ height: "100%", width: "100%" }}
          ></ImageBackground>
        </View>
        <View style={styles.cardLogin}>
          <Text style={styles.titleLogin}>LOGIN</Text>
          <View style={styles.form}>
            <TextField label="Email" onChange={handleEmail} />
          </View>
          <View style={styles.form}>
            <TextField
              label="Password"
              onChange={handlePassword}
              secureTextEntry={true}
            />
          </View>
          {load ? (
            <Loading />
          ) : (
            <ButtonLogin
              handle={handleLogin}
              color="#0096FE"
              textColor="#fff"
            />
          )}
        </View>
      </View>
      <AwesomeAlert
        show={errorTrigger.bool}
        showProgress={false}
        title="Oppssss"
        message={errorTrigger.message}
        onDismiss={() => {
          dispatch({ type: "SET_ERROR", val: { bool: false, message: "" } });
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  bgtop: {
    height: 350,
    width: "100%",
    position: "absolute",
    zIndex: -3,
    top: -120
  },
  bgbot: {
    height: 350,
    width: "100%",
    position: "absolute",
    zIndex: -2,
    bottom: -120
  },
  cardLogin: {
    width: "90%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16
  },
  form: {
    width: "90%",
    marginBottom: 10
  },
  socialLogo: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#c1c1c1",
    justifyContent: "center",
    alignItems: "center"
  },
  wrapperSocial: {
    flexDirection: "row",
    justifyContent: "center"
  },
  footer: {
    position: "absolute",
    bottom: 20
  },
  footerText: {
    color: "#002970",
    marginBottom: 10,
    fontWeight: "700"
  },
  titleLogin: {
    paddingHorizontal: 30,
    fontWeight: "700",
    fontSize: 24,
    color: "#0096FE"
  }
});
