import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { FetchCategory } from "../store/actions/Activity";

export default function SearchBar() {
  const [searchVal, setSearchVal] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleChange = e => {
    setSearchVal(e.nativeEvent.text);
  };

  const handleSearch = (e) => {
    navigation.navigate('Category', { interest: searchVal });
  }

  return (
    <>
      <View style={styles.formWrapper}>
        <FontAwesome
          name="search"
          size={18}
          color="#cecece"
          style={styles.iconSearch}
        />
        <TextInput
          style={styles.formSearch}
          placeholder="Explore Activity Out of your Interest"
          onChange={handleChange}
          value={searchVal}
          onSubmitEditing={handleSearch}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  formWrapper: {
    marginHorizontal: 12,
    paddingVertical: 2,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  formSearch: {
    flex: 1,
    paddingRight: 18,
    fontSize: 16
  },
  iconSearch: {
    padding: 10
  }
});
