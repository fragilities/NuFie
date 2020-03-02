import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import InvitationCard from "../components/invitationCard";
import { useSelector } from "react-redux";

export default function Invitation() {
  const InvitationList = useSelector(state => state.user.invitation);
  return (
    <ScrollView>
      <View style={style.container}>
        {InvitationList.map(el => (
          <InvitationCard key={el._id} data={el} />
        ))}
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    alignItems: "center"
  }
});
