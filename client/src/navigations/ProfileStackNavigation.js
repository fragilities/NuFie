import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileAccount from "../screens/profileAccount";
import EditProfile from "../screens/EditProfile";
import ListJoinGroup from "../screens/ListJoinGroup";
import DetailJoin from "../screens/detailJoin";
import ChatRoom from "../screens/chattingRoom";
import DetailMember from "../screens/DetailMember";
import DetailProfile from "../screens/ProfileMember";

const Stack = createStackNavigator();

function ProfileStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EDIT PROFILE"
        component={EditProfile}
        options={{
          headerStyle: {
            height: 110
          },
          headerTitleStyle: {
            fontWeight: "bold"
          },
          headerTitleAlign: "center"
        }}
      />
      <Stack.Screen
        name="LIST JOIN GROUP"
        component={ListJoinGroup}
        options={{
          title: "Joined Activities",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "700",
            color: "#fff"
          },
          headerStyle: {
            height: 110,
            backgroundColor: "#151965"
          },
          headerTintColor: "#fff"
        }}
      />
      <Stack.Screen name="DETAIL JOIN" component={DetailJoin} />
      <Stack.Screen name="DETAILJOINMEMBER" options={{title: 'Member List'}} component={DetailMember} />
      <Stack.Screen name="DetailMember" options={{title: 'Detail Member'}} component={DetailProfile} />
      <Stack.Screen name="ChatRoomFromMember" options={{title: 'Chat Room'}} component={ChatRoom} />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigation;
