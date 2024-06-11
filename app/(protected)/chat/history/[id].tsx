import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ChatBubble from "../../../globals/components/ChatBubble";
import { Message } from "../../../../types/chat.type";
import { BACKEND_URL } from "@env";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../../../context/AuthProvider";

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        backgroundColor: "#F2F2F2",
        flexGrow: 3,
        marginBottom: 15,
        paddingTop: 10,
    },
    container: {
        flex: 1,
    },
});

const chatHistory = () => {
    const { accessToken } = useAuth();
    const { id } = useLocalSearchParams();
    const scrollViewRef = useRef<ScrollView>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [otherPersonName, setOtherPersonName] = useState<string>("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios({
                    method: "GET",
                    url: `${BACKEND_URL}/api/chatRoom/getRoomWithConsultationId/${id}`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setMessages(response.data.data.messages);
            } catch (e) {
                console.log("fetchMSG");
                console.log(e);
            }
        };
        fetchMessages();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.chatContainer} ref={scrollViewRef}>
                {messages.map((msg) => (
                    <ChatBubble
                        key={msg.message_id}
                        message={msg.content}
                        id={msg.message_id}
                        sender_id={msg.user_id ? msg.user_id : msg.professional_id!}
                        time={msg.created_at}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default chatHistory;
