import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import FeedsItem from "../components/FeedsItem";
import { useNavigation } from "@react-navigation/native";
import { getActivities, getByInterest } from "../store/actions/Activity";
import { useSelector, useDispatch } from "react-redux";
import ExpoNotif from "../components/exponotif";

export default function Home({ route }) {
  const trigger = useSelector(state => state.other.trigger);
  const listByInterest = useSelector(state => state.activity.listByInterest);
  const user = useSelector(state => state.user);
  const navigation = useNavigation();
  const [ loading, setLoading ] = useState(false);
  const InvitationList = useSelector(state => state.user.invitation);
  const handleNotif = () => {
    navigation.navigate("Invitation");
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getByInterest())
    .then(() => {
      setLoading(false);
    })
  }, []);

  useEffect(() => {
    dispatch(getActivities({ token: user.token, id: user.login }))
  }, [trigger])

  useEffect(() => {
    ExpoNotif(user.login);
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getActivities({ token: user.token, id: user.login }))
    .then((data) => {
      return dispatch(getByInterest())
    })
    .then(() => {
      setRefreshing(false)
    })
  }, [refreshing]);

  const badge = () => {
    return (
      <View style={styles.badgeNotif}>
        <Text style={styles.notifText}>{InvitationList.length}</Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.statusBar}></View>
      <View style={styles.navbar}>
        <View style={styles.brandLogo}>
          <ImageBackground
            resizeMode="contain"
            source={require("../../assets/homelogo.png")}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={handleNotif}>
            <View>
              <View style={styles.badgeNotif}>
                <Text style={styles.notifText}>{InvitationList.length}</Text>
              </View>
              <Ionicons name="ios-notifications" size={28} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.titleScreen}>Recomended Activity</Text>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
      >
        <View style={styles.listWrapper}>
          {
            listByInterest.length == 0 ? <Text>No Data</Text> :
            listByInterest.map(activity => {
              return <FeedsItem key={activity._id} data={activity} routeName={route.name} />
            })
          }
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%"
  },
  statusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: "#01B8E7"
  },
  brandLogo: {
    width: 90,
    marginLeft: 6
  },
  navbar: {
    height: 50,
    backgroundColor: "#01B8E7",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#01B8E7",
    borderBottomColor: "#c3c3c3"
  },
  titleNavbar: {
    fontWeight: "700",
    fontSize: 24,
    marginLeft: 10,
    flexGrow: 1
  },
  listWrapper: {
    alignItems: "center"
  },
  titleScreen: {
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 8,
    marginTop: 8,
    marginBottom: 10
  },
  iconWrapper: {
    position: "absolute",
    right: 15
  },
  badgeNotif: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: 21,
    width: 21,
    borderRadius: 21,
    padding: 2,
    zIndex: 3,
    backgroundColor: "#f00",
    left: 4,
    top: -5
  },
  notifText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700"
  }
});
