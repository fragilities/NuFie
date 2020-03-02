import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import JoinGroupCard from "../components/JoinGroupCard";
import { getActivities } from "../store/actions/Activity";

function ListJoinGroup({ route }) {
  const listJoin = useSelector(state => state.activity);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getActivities());
    setLoading(true);
  }, []);

  if (!loading) {
    return null;
  }

  const renderListJoinCard = () => {
    if (listJoin.listJoin.length === 0) {
      return <Text>You haven't join any activities</Text>;
    } else {
      return listJoin.listJoin.map(activity => {
        return <JoinGroupCard key={activity._id} activity={activity} />;
      });
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView>
        <View style={styles.listCardContainer}>{renderListJoinCard()}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  listCardContainer: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  screen: {
    minHeight: "100%",
    width: "100%",
    backgroundColor: "#fff"
  }
});

export default ListJoinGroup;
