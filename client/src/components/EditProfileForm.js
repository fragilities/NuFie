import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import SelectPicker from "react-native-form-select-picker";
import Load from './loading'

function EditProfileForm(props) {
  const {biodata, loading} = useSelector(state => state.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [phone, setPhone] = useState("");
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [gender, setGender] = useState("");
  const [errorPhone, setError] = useState(false)
  const [blank, setBlank] = useState(false)
  useEffect(() => {
    setFirstName(biodata.firstName);
    setLastName(biodata.lastName);
    setPhone(biodata.phone);
    setAboutMe(biodata.aboutMe);
    setPhone(biodata.phoneNumber);
    if (biodata.interests !== null) {
      setTags(biodata.interests);
    }
    setGender(biodata.gender);
  }, []);
  const inputPhone = value => {
    if (value[0] !== "+") {
      setPhone("+62" + value);
    } else {
      setPhone(value);
    }
  };

  const handleFirstName = event => {
    setFirstName(event);
  };

  const handleLastName = event => {
    setLastName(event);
  };

  const handleAboutMe = event => {
    setAboutMe(event);
  };

  const handleSubmitEdit = () => {
    if(phone){
      setBlank(false)
      if(phone.length > 9){
        setError(false)
        props.handleEdit({ firstName, lastName, phone, aboutMe, gender, tags });
      }else {
        setError(true)
      }
    } else {
      setBlank(true)
    }
  };
  const addTags = action => {
    if (action.nativeEvent.key === " ") {
      setTags([...tags, tagText.slice(0, tagText.length - 1)]);
      setTagText("");
    }
  };

  const deleteTag = deletedTag => {
    const newTags = tags.filter(tag => {
      return tag !== deletedTag;
    });
    setTags(newTags);
  };

  return (
    <>
      <Text style={{ fontSize: 13, fontWeight: "bold", marginBottom: 10 }}>
        First Name
      </Text>
      <TextInput
        value={firstName}
        onChangeText={handleFirstName}
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#C1C1C1",
          paddingHorizontal: 10,
          paddingVertical: 8,
          marginBottom: 10
        }}
      />
      <Text style={{ fontSize: 13, fontWeight: "bold", marginBottom: 10 }}>
        Last Name
      </Text>
      <TextInput
        value={lastName}
        onChangeText={handleLastName}
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#C1C1C1",
          paddingHorizontal: 10,
          paddingVertical: 8,
          marginBottom: 10
        }}
      />
      <Text style={{ fontSize: 13, fontWeight: "bold", marginBottom: 10 }}>
        Gender
      </Text>
      <SelectPicker
        onValueChange={value => {
          setGender(value);
        }}
        selected={gender}
        style={styles.selector}
      >
        <SelectPicker.Item label="Female" value="Female"></SelectPicker.Item>
        <SelectPicker.Item label="Male" value="Male"></SelectPicker.Item>
      </SelectPicker>
      <Text style={{ fontSize: 13, fontWeight: "bold", marginBottom: 10 }}>
        Phone
      </Text>
      <TextInput
        value={phone}
        onChangeText={inputPhone}
        type="number"
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#C1C1C1",
          paddingHorizontal: 10,
          paddingVertical: 8,
          marginBottom: 10
        }}
      />
      <Text style={{ fontSize: 13, fontWeight: "bold", marginBottom: 10 }}>
        About Me
      </Text>
      <TextInput
        style={{
          height: 200,
          borderWidth: 1,
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 10,
          fontSize: 15,
          borderColor: "#C1C1C1"
        }}
        value={aboutMe}
        onChangeText={handleAboutMe}
        multiline={true}
        textAlignVertical="top"
      />
      <Text style={{ fontSize: 13, fontWeight: "bold", marginBottom: 10 }}>
        Interest
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#C1C1C1",
          paddingHorizontal: 10,
          paddingVertical: 8,
          marginBottom: 10
        }}
        onKeyPress={addTags}
        value={tagText}
        onChangeText={value => setTagText(value)}
      />
      {tags.length === 0 ? (
        <View></View>
      ) : (
        <View style={styles.tagsContainer}>
          {tags.map((tag, i) => {
            return (
              <View key={i} style={styles.tagContainer}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity onPress={() => deleteTag(tag)}>
                  <FontAwesome name="times" size={18} color="white" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
      {
        loading ? <Load/> :
        <TouchableOpacity
          style={{ marginVertical: 25 }}
          onPress={handleSubmitEdit}
        >
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#01B8E7",
              paddingVertical: 13,
              borderRadius: 10
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold"
              }}
            >
              EDIT PROFILE
            </Text>
          </View>
        </TouchableOpacity>
      }
      {
        errorPhone ? <Text style={styles.warning}>Invalid Phone Number</Text> : <Text></Text>
      }
      {
        blank ? <Text style={styles.warning}>Please Input Phone Number</Text> : <Text></Text>
      }
    </>
  );
}

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    paddingLeft: 3
  },
  tagContainer: {
    backgroundColor: "black",
    flexDirection: "row",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 10
  },
  tagText: {
    color: "white",
    marginRight: 10
  },
  selector: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 9,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderColor: "#C1C1C1",
    height: 36
  },
  warning: {
    color: "#f00"
  }
});

export default EditProfileForm;
