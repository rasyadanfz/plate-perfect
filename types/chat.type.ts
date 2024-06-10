export type ChatBubbleProps = {
    id: string;
    message: string;
    isSelf: boolean;
};

export type Message = {
    message_id: string;
    content: string;
    user_id?: string;
    professional_id?: string;
    chat_id: string;
    created_at: Date;
    referenceType: "USER" | "PROFESSIONAL";
};
