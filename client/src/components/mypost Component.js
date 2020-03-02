import React from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function MyPost(props) {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("Detail Post", { activity: props.activity });
  };
  return (
    <TouchableHighlight onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>{props.activity.title}</Text>
          <Text style={styles.date}>
            {new Date(props.activity.due_date).toDateString()}
          </Text>
          <Text style={styles.place}>{props.activity.location}</Text>
          {
            props.activity.status === 'open'
              ? <Text style={{
                color: '#155727', 
                fontSize: 11,
              }}>{props.activity.status}</Text>
              : <Text style={{
                color: '#721c24', 
                fontSize: 11,
              }}>{props.activity.status}</Text>
          }
        </View>
        <View style={styles.badge}>
          <Ionicons name="ios-people" size={28} color="#fff" />
          <Text style={{ marginLeft: 8, fontWeight: "700", color: "#fff" }}>
            {props.activity.members.length}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "97%",
    height: 75,
    marginBottom: 10,
    elevation: 2,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8
  },
  textWrapper: {
    width: "79%"
  },
  title: {
    fontSize: 14,
    fontWeight: "700"
  },
  badge: {
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#3282b8",
    backgroundColor: "#3282b8",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8
  },
  place: {
    fontSize: 11,
    color: "#939393"
  },
  date: {
    fontSize: 11,
    color: "#939393"
  }
});
