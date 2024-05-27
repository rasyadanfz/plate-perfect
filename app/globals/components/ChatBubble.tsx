import { Text } from "react-native-paper";
import { ChatBubbleProps } from "../../../types/chat.type";
import { StyleSheet } from "react-native";

function ChatBubble(props: ChatBubbleProps) {
    const { id, message, isSelf } = props;

    return (
        <Text style={isSelf ? ChatBubbleStyle.chatBubbleSelf : ChatBubbleStyle.chatBubbleOther}>
            {message}
        </Text>
    );
}

const ChatBubbleStyle = StyleSheet.create({
    chatBubbleSelf: {
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 10,
        backgroundColor: "##78fb7a",
        alignSelf: "flex-end",
    },
    chatBubbleOther: {
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginLeft: 10,
        backgroundColor: "#404c4c",
        borderColor: "#b5b5b5",
        alignSelf: "flex-start",
    },
});

export default ChatBubble;
