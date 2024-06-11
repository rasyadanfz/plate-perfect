import { Text } from "react-native-paper";
import { ChatBubbleProps } from "../../../types/chat.type";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../../context/AuthProvider";
import { Professional, User } from "../../../types/dbTypes";

function ChatBubble(props: ChatBubbleProps) {
    const { user, role } = useAuth();
    const { id, message, sender_id, time } = props;
    let userData = user;

    const isSelf =
        sender_id ===
        (role === "USER" ? (userData as User).user_id : (userData as Professional).professional_id);
    const isAdmin = sender_id === "ADMIN";
    const isOther = !isSelf && !isAdmin;

    let style;
    if (isSelf) {
        style = ChatBubbleStyle.chatBubbleSelf;
    } else if (isOther) {
        style = ChatBubbleStyle.chatBubbleOther;
    } else if (isAdmin) {
        style = ChatBubbleStyle.chatBubbleAdmin;
    }
    return (
        <View
            style={
                isSelf
                    ? ChatBubbleStyle.chatBubbleSelf
                    : isOther
                    ? ChatBubbleStyle.chatBubbleOther
                    : ChatBubbleStyle.chatBubbleAdmin
            }
        >
            <Text>{message}</Text>
            {!isAdmin && (
                <Text style={{ alignSelf: "flex-end", fontSize: 7, marginLeft: 30 }}>
                    {new Date(time).toLocaleTimeString()}
                </Text>
            )}
        </View>
    );
}

const ChatBubbleStyle = StyleSheet.create({
    chatBubbleSelf: {
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
        backgroundColor: "#afd198",
        alignSelf: "flex-end",
        gap: 3,
        marginBottom: 10,
    },
    chatBubbleOther: {
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginLeft: 10,
        backgroundColor: "#f6ae0a",
        alignSelf: "flex-start",
        gap: 3,
        marginBottom: 10,
    },
    chatBubbleAdmin: {
        color: "gray",
        opacity: 0.7,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginLeft: 10,
        alignSelf: "center",
        marginBottom: 10,
    },
});

export default ChatBubble;
