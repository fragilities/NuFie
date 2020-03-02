import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import Chat from "./chatCard";
import db from "../../config/config_firebase";

export default function ChatWrap(props) {
    const [messages, setMessages] = useState([])
    useEffect(() => {
      try {
        return db.firestore()
            .collection('chat')
            .doc(props.roomId)
            .collection('arrMessage')
            .onSnapshot(function(querySnapshot) {
                const messages = querySnapshot.docs
                    .map(doc => {
                        return {
                            id: doc.id,
                            ...doc.data()
                        }
                    })
                    .sort(function(a,b){
                        return a.createdAt.seconds - b.createdAt.seconds
                    })
                setMessages(messages)
            })
      } catch (error) {
      }
    },[])

  return (
    // <ScrollView>
    <View style={style.container}>
      {messages.map(el => {
        return <Chat key={el.id} message={el} />;
      })}
    </View>
    // </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    width: "100%"
  }
});
