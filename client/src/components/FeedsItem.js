import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  TouchableHighlight
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import dummpProfilePicture from "../../assets/edit_profile_dummy.jpg";

export default function FeedsItem({ data, routeName }) {
  const navigation = useNavigation();
  if (routeName === "Category") {
    return (
      <View style={styles.cardFeed}>
        <View style={styles.cardHeader}>
          {data.owner.profilePicture ? (
            <Image
              source={{ uri: data.owner.profilePicture }}
              style={styles.profpict}
            />
          ) : (
            <Image source={dummpProfilePicture} style={styles.profpict} />
          )}
          <View style={{ justifyContent: "center" }}>
            <Text style={{ fontWeight: "700" }}>
              {data.owner.firstName + " " + data.owner.lastName}
            </Text>
            <Text style={{ fontSize: 10, color: "#777777" }}>
              {new Date(data.createdAt).toDateString()}
            </Text>
          </View>
          <TouchableHighlight
            style={styles.btnDetail}
            onPress={() => {
              navigation.navigate("Detail Category", { activity: data });
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12 }}>View Detail</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.cardImage}>
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={{ uri: data.image }}
          />
        </View>
        <View style={styles.cardText}>
          <View style={styles.textWrapper}>
            <Text style={styles.cardTitle}>{data.title}</Text>
            <View style={{ flexDirection: "row" }}>
              <MaterialIcons name="place" color="#777777" />
              <Text style={styles.place}>{data.location}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <FontAwesome name="calendar" color="#777777" />
              <Text style={styles.date}>
                {new Date(data.due_date).toDateString()}
              </Text>
            </View>
          </View>
          {!data.isPromo ? (
            <View></View>
          ) : (
            <View style={styles.promoWrapper}>
              <View style={styles.promoBtn}>
                <FontAwesome name="thumbs-up" color="#fff" size={14} />
                <Text style={styles.textPromo}>Has Promo</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.cardFeed}>
        <View style={styles.cardHeader}>
          {data.owner.profilePicture ? (
            <Image
              source={{ uri: data.owner.profilePicture }}
              style={styles.profpict}
            />
          ) : (
            <Image source={dummpProfilePicture} style={styles.profpict} />
          )}
          <View style={{ justifyContent: "center" }}>
            <Text style={{ fontWeight: "700" }}>
              {data.owner.firstName + " " + data.owner.lastName}
            </Text>
            <Text style={{ fontSize: 10, color: "#777777" }}>
              {new Date(data.createdAt).toDateString()}
            </Text>
          </View>
          <TouchableHighlight
            style={styles.btnDetail}
            onPress={() => {
              navigation.navigate("Detail Feed", { activity: data });
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12 }}>View Detail</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.cardImage}>
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
            source={{ uri: data.image }}
          />
        </View>
        <View style={styles.cardText}>
          <View style={styles.textWrapper}>
            <Text style={styles.cardTitle}>{data.title}</Text>
            <View style={{ flexDirection: "row" }}>
              <MaterialIcons name="place" color="#777777" />
              <Text style={styles.place}>{data.location}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <FontAwesome name="calendar" color="#777777" />
              <Text style={styles.date}>
                {new Date(data.due_date).toDateString()}
              </Text>
            </View>
          </View>
          {!data.isPromo ? (
            <View></View>
          ) : (
            <View style={styles.promoWrapper}>
              <View style={styles.promoBtn}>
                <FontAwesome name="thumbs-up" color="#fff" size={14} />
                <Text style={styles.textPromo}>Has Promo</Text>
              </View>
            </View>
          )}
        </View>
      </View>
      // <View style={styles.card}>
      //   <View></View>
      //   <View style={styles.footer}>
      //     <View style={styles.footerText}>
      //       <Text>This is title of Interest</Text>
      //       <Text>Sunday, 01 March 2020</Text>
      //       <Text>CinemaXXI Pondok Indah Mall</Text>
      //     </View>
      //     <View>
      //       <View style={styles.userPhoto}></View>
      //     </View>
      //   </View>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  cardFeed: {
    height: 330,
    width: Dimensions.get("window").width,
    // borderWidth: 1,
    // borderColor: "#c2c2c2",
    backgroundColor: "#fff",
    marginBottom: 12,
    paddingVertical: 4
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 6
  },
  profpict: {
    height: 40,
    width: 40,
    borderRadius: 100,
    marginLeft: 8,
    marginRight: 4
  },
  cardImage: {
    height: 220,
    width: "100%",
    backgroundColor: "#f00"
  },
  promoWrapper: {
    width: "23%",
    justifyContent: "center",
    alignItems: "center"
  },
  promoBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#21bf73",
    flexDirection: "row",
    borderRadius: 7,
    alignItems: "center"
  },
  textWrapper: {
    width: "77%"
  },
  cardText: {
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center"
  },
  textPromo: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 5,
    fontSize: 10
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginTop: 3
  },
  date: {
    fontSize: 11,
    color: "#777777",
    marginLeft: 4
  },
  card: {
    width: "93%",
    height: 220,
    justifyContent: "flex-end",
    backgroundColor: "#c1c1c1",
    marginVertical: 6,
    borderRadius: 20,
    overflow: "hidden"
  },
  footer: {
    backgroundColor: "#777777",
    height: "35%",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  userPhoto: {
    backgroundColor: "#c1c1c1",
    height: "80%",
    width: 50,
    marginLeft: 60,
    marginVertical: 8,
    borderRadius: 10
  },
  place: {
    fontSize: 10,
    color: "#777777",
    marginLeft: 4
  },
  btnDetail: {
    position: "absolute",
    alignSelf: "center",
    borderWidth: 1,
    backgroundColor: "#01B8E7",
    borderColor: "#01B8E7",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    right: 15
  }
});