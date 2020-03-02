import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons
} from "@expo/vector-icons";
import MyPost from "../navigations/myPost";
import Home from "./homeNavigation";
import Account from "./ProfileStackNavigation";
import Search from "../navigations/searchNavigation";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-grid" color={color} size={28} />
          )
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" color={color} size={28} />
          )
        }}
      />
      <Tab.Screen
        name="MyPost"
        component={MyPost}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-list-box" color={color} size={28} />
          )
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" color={color} size={28} />
          )
        }}
      />
    </Tab.Navigator>
  );
}
