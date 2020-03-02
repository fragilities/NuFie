import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import Home from "../screens/home";
import Invitation from "../screens/invitation";
import detailFeed from "../screens/detailFeed";

export default function StackMyPost() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeFeed"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Invitation"
        component={Invitation}
        options={{
          title: "Invitation Request",
          headerBackground: () => (
            <LinearGradient
              colors={["#00c6fb", "#005bea"]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
          headerStyle: {
            backgroundColor: "#f79c1d",
            height: 115
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "700",
            color: "#fff"
          },
          headerTintColor: "#fff"
        }}
      />
      <Stack.Screen name="Detail Feed" component={detailFeed} />
    </Stack.Navigator>
  );
}
