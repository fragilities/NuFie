import React, { useRef, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import MyPost from "../screens/myPost";
import DetailMyPost from "../screens/detailPost";
import ChatRoom from "../screens/chattingRoom";
import CreateActivity from "../screens/CreateActivity";
import EditActivity from "../screens/EditActivity";
import { View, TouchableHighlight, Alert, Text } from "react-native";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import FindFriend from "../screens/FindFriends";
import { useNavigation } from "@react-navigation/native";
import DetailMember from "../screens/DetailMember";
import DetailProfile from "../screens/ProfileMember";
import ListPending from "../screens/PendingRequest";
import { cancelActivity } from "../store/actions/Activity";
import { useDispatch } from "react-redux";

export default function StackMyPost({ route }) {
  const menu = useRef();
  const hideMenu = () => menu.current.hide();
  const showMenu = () => menu.current.show();
  const [showAlert, setShowAlert] = useState(true);
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const handleEdit = () => {
    navigation.navigate("EDIT POST", {
      editActivity: route.state.routes[1].params.activity
    });
    hideMenu();
  };
  const renderTitle = () => {
    if (!route.state) {
      return "My Activity";
    } else if (!route.state.routes[1]) {
      return "My Activity";
    } else if (route.state.routes[1].params) {
      return route.state.routes[1].params.activity.title;
    }
  };

  const handlerCancel = () => {
    const id = route.state.routes[1].params.activity._id;
    const members = route.state.routes[1].params.activity.members;
    return Alert.alert(
      "Are You Sure?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            dispatch(cancelActivity({ id, members })).then(() => {
              navigation.navigate("My Activity");
            });
          }
        }
      ],
      { cancelable: false }
    );
  };

  const Stack = createStackNavigator();
  const renderDropdown = () => (
      <Menu
        ref={menu}
        button={
          route.state.routes[1].params.activity.status == 'open' 
              ? <TouchableHighlight style={{ marginRight: 18 }} onPress={showMenu}>
              <Ionicons name="md-more" size={28} />
            </TouchableHighlight>
            : <Text></Text>
        }
      >
        <MenuItem onPress={handleEdit}>Edit Activity</MenuItem>
        <MenuItem onPress={handlerCancel}>Cancel Activity</MenuItem>
        <MenuDivider />
      </Menu>
  );
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="My Activity"
        component={MyPost}
        options={{
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "700",
            color: "#fff"
          },
          headerStyle: {
            height: 110,
            backgroundColor: "#151965"
          }
        }}
      />
      <Stack.Screen
        name="Detail Post"
        component={DetailMyPost}
        options={{
          headerRight: () => renderDropdown()
          // <TouchableHighlight
          //   style={{ marginRight: 18 }}
          //   onPress={handlePress}
          // >
          //   <Ionicons name="md-more" size={28} />
          // </TouchableHighlight>
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{
          title: renderTitle()
        }}
      />
      <Stack.Screen
        name="ADD POST"
        component={CreateActivity}
        options={{
          title: "Add New Activity",
          headerBackground: () => (
            <LinearGradient
              colors={["#09C6F9", "#045DE9"]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
          headerStyle: {
            height: 110
          },
          headerTitleStyle: {
            fontWeight: "bold",
            color: "#fff"
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center"
        }}
      />
      <Stack.Screen name="EDIT POST" component={EditActivity} />
      <Stack.Screen name="MemberList" component={DetailMember} />
      <Stack.Screen name="DetailMember" component={DetailProfile} />
      <Stack.Screen
        name="PendingRequest"
        component={ListPending}
        options={{
          title: "Join Request",
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
      <Stack.Screen
        name="Search Friend"
        component={FindFriend}
        options={{
          headerBackground: () => (
            <LinearGradient
              colors={["#a13388", "#10356c"]}
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
    </Stack.Navigator>
  );
}
