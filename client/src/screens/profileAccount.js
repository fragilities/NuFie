import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions
} from "react-native";
import Constants from "expo-constants";
import { Entypo, FontAwesome, Foundation, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Btn from "../components/ButtonOnPost";
import { useNavigation } from "@react-navigation/native";
import { Logout } from "../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import { ReadSelf } from "../store/actions/user";
import Interest from "../components/interestItem";

export default function ProfileUser(params) {
  const loading = useSelector(state => state.user.loading);
  const biodata = useSelector(state => state.user.biodata);
  const defaultProfile = useSelector(state => state.user.profilePictureDefault);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const handleEdit = () => {
    navigation.navigate("EDIT PROFILE");
  };
  const handleLogout = () => {
    dispatch(Logout());
  };
  const handleListJoinGroup = () => {
    navigation.navigate("LIST JOIN GROUP");
  };

  const simbol = () => {
    const gen = biodata.gender;
    if (gen == undefined) {
      return "male-symbol";
    }
    return gen.toLowerCase() + "-symbol";
  };
  useEffect(() => {
    dispatch(ReadSelf());
  }, []);

  const renderBiodata = () => (
    <>
      <Image
        source={{ uri: biodata.profilePicture || defaultProfile }}
        style={styles.profpict}
      />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.name}>
          {biodata.firstName} {biodata.lastName}
        </Text>
        <Foundation name={simbol()} style={styles.icon} size={20} />
      </View>
      <View style={styles.contactWrapper}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Entypo name="mail" color="#fff" size={13} />
          <Text style={styles.contactText}>{biodata.email}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome name="phone" color="#fff" size={13} />
          <Text style={styles.contactText}>{biodata.phoneNumber}</Text>
        </View>
      </View>
    </>
  );

  const checkGender = () => {
    if (biodata.gender === "Female") {
      return (
        <>
          <LinearGradient
            colors={["#F67062", "#FC5296"]}
            style={{ height: Constants.statusBarHeight }}
            start={[1.1, 1.0]}
          ></LinearGradient>
          {/* batas status bar */}
          <LinearGradient
            colors={["#F67062", "#FC5296"]}
            style={styles.headerWraper}
            start={[1.1, 1.0]}
          >
            {renderBiodata()}
          </LinearGradient>
        </>
      );
    } else {
      return (
        <>
          <LinearGradient
            colors={["#09C6F9", "#045DE9"]}
            style={{ height: Constants.statusBarHeight }}
            start={[1.1, 1.0]}
          ></LinearGradient>
          {/* batas status bar */}
          <LinearGradient
            colors={["#09C6F9", "#045DE9"]}
            style={styles.headerWraper}
            start={[1.1, 1.0]}
          >
            {renderBiodata()}
          </LinearGradient>
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>{checkGender()}</View>
      <ScrollView>
        <View style={styles.body}>
          <Text style={styles.title}>About</Text>
          <Text style={styles.textNormal}>{biodata.aboutMe}</Text>
          <Text style={styles.title}>Interest</Text>
          <View style={styles.interestWrapper}>
            {biodata.interests.map((el, i) => (
              <Interest text={el} key={i} />
            ))}
          </View>
          <View style={styles.btnWrap}>
            <Btn text="EDIT PROFILE" color="#49beb7" handle={handleEdit} />
            <Btn
              text="LIST JOIN GROUP"
              color="#3282b8"
              handle={handleListJoinGroup}
            />
            <Btn text="LOGOUT" color="#c70039" handle={handleLogout} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff"
  },
  header: {
    height: "39%",
    width: "100%"
  },
  headerWraper: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  body: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 15
  },
  profpict: {
    height: 110,
    width: 110,
    borderRadius: 12,
    marginBottom: 4
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    color: "#333333",
    marginBottom: 4
  },
  name: {
    fontWeight: "700",
    fontSize: 18,
    color: "#fff"
  },
  contactText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4
  },
  contactWrapper: {
    justifyContent: "center",
    alignItems: "center"
  },
  textNormal: {
    textAlign: "justify",
    marginBottom: 12
  },
  interestWrapper: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  btnWrap: {
    alignItems: "center",
    marginTop: 50,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around"
  },
  icon: {
    color: "#fff",
    marginLeft: 4
  }
});
