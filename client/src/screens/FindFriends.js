import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import Constants from "expo-constants";
import FriendCard from "../components/FriendCard";
import { FindFriend } from "../store/actions/user";
import { useDispatch, useSelector } from "react-redux";

function FindFriends(props) {
  const dispatch = useDispatch()
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(2)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(FindFriend({data: detailPost, page: page}))
    .then(() => { 
      setPage(page+1)
      setRefreshing(false)
    })
    .catch((err) => {
    })
  }, [refreshing]);

  useEffect(() => {
    if(userData.suggestFriend.length == 0){
      setPage(1)
    }
  },[page])
  const detailPost = props.route.params.data;
  const userData = useSelector(state => state.user)
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
      }
    >
      <View style={styles.container}>
        {userData.suggestFriend.map(el => (
          <FriendCard key={el._id} detailPost={detailPost} data={el} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 10
  },
  friendsContainer: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center"
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%"
  },
  rightContainer: {
    width: "25%"
  },
  contactImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 15
  },
  contactText: {
    fontSize: 18,
    marginRight: 50,
    fontWeight: "bold"
  },
  buttonInvite: {
    paddingVertical: 4,
    backgroundColor: "#C4C4C4",
    borderRadius: 10
  },
  buttonText: {
    textAlign: "center",
    color: "white"
  }
});

export default FindFriends;
