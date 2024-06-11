import { useEffect, useRef, useState } from "react";
import { Alert, GestureResponderEvent, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
// import { socket } from "../../../helpers/ioSocketHelper";
import ChatBubble from "../../globals/components/ChatBubble";
import { Message } from "../../../types/chat.type";
import { useAuth } from "../../context/AuthProvider";
import { Consultation, Professional, User } from "../../../types/dbTypes";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { BACKEND_URL } from "@env";
import { io } from "socket.io-client";

const socket = io(`${BACKEND_URL}`, {
    autoConnect: false,
});

export default function ChatRoom() {
    const roomId = useLocalSearchParams<{ id: string }>().id;
    const { user, role, accessToken } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageToSend, setMessageToSend] = useState<string>("");
    const [activity, setActivity] = useState("");
    const typingTimeout = useRef<NodeJS.Timeout>();
    const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);
    const insets = useSafeAreaInsets();
    const styles = chatRoomStyles(insets);
    const scrollViewRef = useRef<ScrollView>(null);
    const [consultationData, setConsultationData] = useState<Consultation>();
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        // Fetch old messages
        const fetchMessages = async () => {
            try {
                const response = await axios({
                    method: "GET",
                    url: `${BACKEND_URL}/api/chatRoom/room/${roomId}`,
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

        const getConsultationStartTime = async () => {
            try {
                const response = await axios({
                    method: "GET",
                    url: `${BACKEND_URL}/api/consultation/getConsultationWithChatId/${roomId}`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const start_time = new Date(response.data.data.start_time);
                setConsultationData(response.data.data);
                setMinutes(Math.floor((new Date().getTime() - start_time.getTime()) / 1000 / 60));
                setSeconds(Math.floor(((new Date().getTime() - start_time.getTime()) / 1000) % 60));
            } catch (e) {
                console.log("fetchChatRoom");
                console.log(e);
            }
        };
        fetchMessages();
        const update = getConsultationStartTime();
    }, []);

    useEffect(() => {
        const update = setInterval(() => {
            setMinutes(
                Math.floor(
                    (new Date(consultationData!.end_time).getTime() - new Date().getTime()) / 1000 / 60
                )
            );
            setSeconds(
                Math.floor(
                    ((new Date(consultationData!.end_time).getTime() - new Date().getTime()) / 1000) % 60
                )
            );
        }, 1000);

        return () => clearInterval(update);
    }, [minutes, seconds]);

    useEffect(() => {
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
            setMessages((messages) => [...messages, msg]);
        }

        function onActivity(name: string) {
            setActivity(`${name} is typing...`);
            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => {
                setActivity("");
            }, 2000);
        }

        function onEndByProfessional() {
            Alert.alert("Consultation Status", "Consultation has ended");
            router.push("/home");
        }

        function onEndByUser() {
            Alert.alert("Consultation Status", "Consultation has ended");
            router.push("/summary");
        }

        socket.connect();
        socket.on("connect", onConnect);
        socket.on("message", onMessage);
        socket.on("activity", onActivity);
        socket.on("endByProfessional", onEndByProfessional);
        socket.on("endByUser", onEndByUser);

        return () => {
            socket.off("connect", onConnect);
            socket.off("message", onMessage);
            socket.off("activity", onActivity);
            socket.off("endByProfessional", onEndByProfessional);
            socket.off("endByUser", onEndByUser);
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({
            animated: true,
        });
    }, [messages]);

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

            const newMsg = createBackendMsg.data.data;

            if (createBackendMsg.status === 200) {
                socket.emit("message", newMsg);
                setMessageToSend("");
            } else {
                Alert.alert("Error", "Failed sending message");
            }
        }
    }

    const handleEndPress = async () => {
        try {
            const response = await axios({
                method: "PUT",
                url: `${BACKEND_URL}/api/booking/${consultationData?.booking_id}`,
                headers: { Authorization: `Bearer ${accessToken}` },
                data: {
                    status: "DONE",
                },
            });

            if (role === "USER") {
                socket.emit("endByUser", { id: (user as User).user_id, role: role });
                router.push("/home");
            } else if (role === "PROFESSIONAL") {
                socket.emit("endByProfessional", {
                    id: (user as Professional).professional_id,
                    role: role,
                });
                router.push("/summary");
            }
        } catch (error) {
            console.log("UpdateBookingDoneStatus");
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 10,
                    paddingBottom: 5,
                }}
            >
                <Button
                    mode="contained"
                    style={{ backgroundColor: "#D6CFEF" }}
                    labelStyle={{ color: "black" }}
                >
                    {minutes}:{seconds}
                </Button>
                <Button
                    mode="contained"
                    onPress={handleEndPress}
                    style={{ backgroundColor: "#E53B3B", paddingHorizontal: 5 }}
                >
                    End
                </Button>
            </View>
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
                <Text key="activity">{activity}</Text>
            </ScrollView>

            <View style={styles.chatInputContainer}>
                <View
                    style={{ flex: 1, flexDirection: "row", gap: 10, paddingVertical: 5, flexGrow: 3 }}
                >
                    <View style={styles.txtInputContainer}>
                        <TextInput
                            mode="outlined"
                            style={{ backgroundColor: "#d1d1d3", color: "blue" }}
                            onChangeText={editMessageToSend}
                            outlineStyle={{ borderColor: "#d1d1d3", borderRadius: 20 }}
                            value={messageToSend}
                        />
                    </View>
                    <Button
                        style={styles.submitBtn}
                        onPress={sendMessage}
                        mode="contained"
                        textColor="black"
                    >
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
            paddingTop: 5,
            paddingBottom: insets.bottom,
        },
        chatContainer: {
            flex: 1,
            backgroundColor: "#F2F2F2",
            flexGrow: 3,
            marginBottom: 15,
        },
        chatInputContainer: {
            flexDirection: "row",
            backgroundColor: "white",
            padding: 10,
            paddingTop: 5,
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
            backgroundColor: "#ecca9c",
        },
    });
