import { useEffect, useRef, useState } from "react";
import { Alert, GestureResponderEvent, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { createId } from "@paralleldrive/cuid2";
import { socket } from "../../../helpers/ioSocketHelper";
import ChatBubble from "../../globals/components/ChatBubble";
import { Message } from "../../../types/chat.type";
import { useAuth } from "../../context/AuthProvider";
import { Professional, User } from "../../../types/dbTypes";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { BACKEND_URL } from "@env";

export default function ChatRoom() {
    const { roomId } = useLocalSearchParams<{ roomId: string }>();
    const { user, role, accessToken } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageToSend, setMessageToSend] = useState<string>("");
    const [activity, setActivity] = useState("");
    const typingTimeout = useRef<NodeJS.Timeout>();
    const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);
    const insets = useSafeAreaInsets();
    const styles = chatRoomStyles(insets);
    useEffect(() => {
        const { user, role } = useAuth();
        const fetchMessages = async () => {
            const response = await axios({
                method: "GET",
                url: `${BACKEND_URL}/api/chatRoom/${roomId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setMessages(response.data.messages);
        };
        function onConnect() {
            setIsSocketConnected(true);
            socket.emit("enterRoom", {
                userId:
                    role === "USER" ? (user as User).user_id : (user as Professional).professional_id,
                name: user!.name,
                roomId: roomId,
                role: role,
            });
        }

        function onMessage(msg: Message) {
            const newMessageArr = [...messages, msg];
            setMessages(newMessageArr);
        }

        function onActivity(name: string) {
            setActivity(`${name} is typing...`);
            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => {
                setActivity("");
            }, 2000);
        }

        socket.connect();
        socket.on("connect", onConnect);
        socket.on("message", onMessage);
        socket.on("activity", onActivity);

        return () => {
            socket.off("connect", onConnect);
            socket.off("message", onMessage);
            socket.off("activity", onActivity);
            socket.disconnect();
        };
    }, []);

    function editMessageToSend(msg: string) {
        setMessageToSend(msg);
        socket.emit("activity", user?.name);
    }

    async function sendMessage(e: GestureResponderEvent) {
        e.preventDefault();
        if (messageToSend) {
            const createBackendMsg = await axios({
                method: "POST",
                url: `${BACKEND_URL}/api/chatMsg/${roomId}`,
                data: { content: messageToSend },
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const newMsg = {
                sender_id:
                    role === "USER" ? (user as User).user_id : (user as Professional).professional_id,
                sender_name: user?.name,
                text: messageToSend,
                created_at: new Intl.DateTimeFormat("default", {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                }).format(new Date()),
            };

            if (createBackendMsg.status === 200) {
                socket.emit("message", newMsg);
                setMessageToSend("");
            } else {
                Alert.alert("Error", "Failed sending message");
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.chatContainer}>
                <Text>Status: {isSocketConnected ? "connected" : "Disconnected"}</Text>
                <Text>Chat Room</Text>
                {messages.map((msg) => (
                    <ChatBubble
                        key={msg.message_id}
                        message={msg.content}
                        id={msg.message_id}
                        isSelf={true}
                    />
                ))}
                {activity && <Text key="activity">{activity}</Text>}
            </View>

            <View style={styles.chatInputContainer}>
                <View
                    style={{ flex: 1, flexDirection: "row", gap: 10, paddingVertical: 5, flexGrow: 3 }}
                >
                    <View style={styles.txtInputContainer}>
                        <TextInput
                            mode="outlined"
                            style={{ backgroundColor: "white", color: "blue" }}
                            onChangeText={editMessageToSend}
                            outlineStyle={{ borderColor: "white", borderRadius: 25 }}
                            value={messageToSend}
                        />
                    </View>
                    <Button style={styles.submitBtn} onPress={sendMessage} mode="contained">
                        <Text>Send</Text>
                    </Button>
                </View>
            </View>
        </View>
    );
}

const chatRoomStyles = (insets: EdgeInsets) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        },
        chatContainer: {
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "#F2F2F2",
            flexGrow: 3,
        },
        chatInputContainer: {
            flexDirection: "row",
            backgroundColor: "black",
            padding: 10,
        },
        txtInputContainer: {
            flex: 1,
            flexGrow: 6,
            borderRadius: 30,
        },
        submitBtn: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
        },
    });
