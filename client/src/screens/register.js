import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { TextField } from "react-native-material-textfield";
import Constants from "expo-constants";
import BtnRegister from "../components/buttonLoginRegis";
import { RegisterAction } from "../store/actions/user";
import { useSelector, useDispatch } from "react-redux";
import Load from "../components/loading";
import AwesomeAlert from 'react-native-awesome-alerts'

export default function Register() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.user.loading);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {errorTrigger} = useSelector(state => state.other)

  const handleFirstName = event => {
    setFirstName(event.nativeEvent.text);
  };
  const handleLastName = event => {
    setLastName(event.nativeEvent.text);
  };
  const handleEmail = event => {
    setEmail(event.nativeEvent.text);
  };
  const handlePassword = event => {
    setPassword(event.nativeEvent.text);
  };
  const handleRegister = () => {
    dispatch({
      type: "SET_USERDATA",
      val: { email, password, firstName, lastName }
    });
    dispatch(RegisterAction({ email, password }));
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.bg1}></View>
        <View style={styles.bg2}></View>
        <Text style={styles.title}>SIGN UP</Text>
      </View>
      <KeyboardAvoidingView
        // contentContainerStyle={styles.container}
        behavior="position"
      >
        <View
          style={{
            backgroundColor: "#fff",
            width: "100%",
            alignItems: "center"
          }}
        >
          <Text style={styles.textBig}>Create New Account</Text>
          <View style={styles.nameWrapper}>
            <View style={styles.nameForm}>
              <TextField
                label="First Name"
                onChange={handleFirstName}
                disabled={loading}
              />
            </View>
            <View style={styles.nameForm}>
              <TextField
                label="Last Name"
                onChange={handleLastName}
                disabled={loading}
              />
            </View>
          </View>
          <View style={styles.formWrapper}>
            <TextField
              label="Email"
              onChange={handleEmail}
              disabled={loading}
            />
          </View>
          <View style={[styles.formWrapper, { marginBottom: 20 }]}>
            <TextField
              label="Password"
              onChange={handlePassword}
              disabled={loading}
              secureTextEntry={true}
            />
          </View>
          {loading ? (
            <Load />
          ) : (
            <BtnRegister
              text="REGISTER"
              color="#4BAEDD"
              textColor="#fff"
              handle={handleRegister}
            />
          )}
        </View>
        <AwesomeAlert
          show={errorTrigger.bool}
          showProgress={false}
          title="Oppssss"
          message={errorTrigger.message}
          onDismiss={() => {dispatch({type: 'SET_ERROR', val: {bool: false, message: ''}})}}
        />
      </KeyboardAvoidingView>
    </View>

    // <View style={styles.container}>
    //   <Text style={styles.titleRegister}>Create New Account</Text>

    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center"
  },
  header: {
    width: "100%",
    height: "43%",
    overflow: "hidden"
  },
  bg1: {
    position: "absolute",
    zIndex: -3,
    left: -185,
    top: -300,
    height: 550,
    width: 550,
    borderRadius: 450,
    backgroundColor: "#4BAEDD"
  },
  bg2: {
    height: 350,
    width: 350,
    borderRadius: 350,
    backgroundColor: "#043466",
    position: "absolute",
    zIndex: -2,
    right: -100,
    top: -170,
    opacity: 0.9
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
    position: "absolute",
    top: 100,
    left: 12
  },
  nameWrapper: {
    width: "93%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  nameForm: {
    width: "45%"
  },
  formWrapper: {
    width: "93%"
  },
  textBig: {
    fontWeight: "700",
    fontSize: 26,
    marginBottom: 5,
    color: "#4BAEDD"
  }
  // container: {
  //   paddingTop: Constants.statusBarHeight,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   flexGrow: 1
  // },
  // titleRegister: {
  //   alignSelf: "flex-start",
  //   paddingLeft: 30,
  //   marginBottom: 8
  // },
});
