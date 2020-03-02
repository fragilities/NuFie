import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

function JoinGroupCard(props) {
  const navigation = useNavigation();

  const activity = props.activity;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("DETAIL JOIN", { activity: activity })}
    >
      <View style={styles.container}>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>{props.activity.title}</Text>
          <Text style={styles.date}>
            {new Date(props.activity.due_date).toDateString()}
          </Text>
          <Text style={styles.place}>{props.activity.location}</Text>
          {props.activity.status === "open" ? (
            <Text
              style={{
                color: "#155727",
                fontSize: 11
              }}
            >
              {props.activity.status}
            </Text>
          ) : (
            <Text
              style={{
                color: "#721c24",
                fontSize: 11
              }}
            >
              {props.activity.status}
            </Text>
          )}
        </View>
        <View style={styles.badge}>
          <Ionicons name="ios-people" size={28} color="#fff" />
          <Text style={{ marginLeft: 8, fontWeight: "700", color: "#fff" }}>
            {props.activity.members.length}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2
  },
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

export default JoinGroupCard;
