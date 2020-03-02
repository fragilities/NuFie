import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image } from "react-native";
import Post from "../components/mypost Component";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getActivities } from "../store/actions/Activity";
import { useSelector, useDispatch } from "react-redux";
import loadingSpinner from '../../assets/ball-loading.gif';

export default function MyPost() {
  const navigation = useNavigation();
  const activities = useSelector(state => state.activity);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false)

  useEffect(() => {
    dispatch(getActivities({ token: user.token, id: user.login }));
    setReady(true)
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getActivities({ token: user.token, id: user.login }))
    .then((data) => {
      setRefreshing(false)
    })
  }, [refreshing]);
  
  const renderActivities = () => {
    if (activities.loading)
      return (<View style={{alignItems: 'center', flex: 1}}>
          <Image source={loadingSpinner} style={{width: 100, height: 100}}/>
          <Text style={{fontSize: 15}}>Fetching data, Please wait....</Text>
        </View>)
    else if (activities.error) 
      return <Text>Error</Text>
    else if (activities.data.length === 0) 
      return <Text 
      style={{
        paddingTop: 250, 
        fontSize: 18,
        fontWeight: 'bold'
      }}>You haven't posted any activities</Text>
    return activities.data.map(activity => {
      return <Post key={activity._id} activity={activity} />;
    })
  }

  if (!ready) return null

  return (
    <View style={styles.screen}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
      >
        <View style={styles.container}>
          {renderActivities()}
        </View>
      </ScrollView>
      <View style={styles.floatWarper}>
        <TouchableOpacity onPress={() => navigation.navigate("ADD POST")}>
          <Text style={styles.addPostIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    minHeight: "100%"
  },
  container: {
    height: "100%",
    alignItems: "center",
    paddingVertical: 10
  },
  addPostIcon: {
    fontSize: 30,
    color: "white",
    padding: 0,
    margin: 0,
    fontWeight: "bold"
  },
  floatWarper: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4d80e4",
    borderRadius: 100,
    position: "absolute",
    zIndex: 3,
    bottom: 120,
    right: 15
  }
});
