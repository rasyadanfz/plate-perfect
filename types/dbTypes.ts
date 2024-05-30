enum ProfessionalRole {
    NUTRISIONIST = "NUTRISIONIST",
    CHEF = "CHEF",
}

enum BookingStatus {
    RESERVED = "RESERVED",
    PAID = "PAID",
    DONE = "DONE",
}

enum PaymentMethod {
    CASH = "CASH",
    DEBIT_CARD = "DEBIT_CARD",
    CREDIT_CARD = "CREDIT_CARD",
}

enum ReferenceSenderType {
    USER = "USER",
    PROFESSIONAL = "PROFESSIONAL",
}

export type User = {
    user_id: string;
    name: string;
    country?: string;
    age?: number;
    gender?: string;
    allergies: string[];
    medicalRecords: string[];
    date_of_birth?: Date;
    email: string;
    phone_num?: string;
    bookings: Booking[];
    payments: Payment[];
    consultations: Consultation[];
    chat_messages: ChatMessage[];
    refresh_tokens?: RefreshToken;
    hasCompletedData: boolean;
};

export type Professional = {
    professional_id: string;
    name: string;
    description: string;
    role: ProfessionalRole;
    email: string;
    phone_num?: string;
    balance: number;
    experience: number;
    consultations: Consultation[];
    chat_messages: ChatMessage[];
    summary: Summary[];
    hasCompletedData: boolean;
};

export type Booking = {
    booking_id: string;
    booking_time: Date;
    status: BookingStatus;
    customer: User;
    customer_id: string;
    payment?: Payment;
    consultation?: Consultation;
};

export type Payment = {
    payment_id: string;
    booking: Booking;
    booking_id: string;
    amount: number;
    payment_time: Date;
    method: PaymentMethod;
    customer: User;
    customer_id: string;
};

export type Consultation = {
    consultation_id: string;
    booking: Booking;
    booking_id: string;
    date: Date;
    start_time: Date;
    end_time: Date;
    customer: User;
    customer_id: string;
    professional: Professional;
    professional_id: string;
    summary?: Summary;
    chat?: Chat;
};

export type Summary = {
    summary_id: string;
    content: string;
    professional: Professional;
    professional_id: string;
    consultation: Consultation;
    consultation_id: string;
};

export type Chat = {
    chat_id: string;
    consultation: Consultation;
    consultation_id: string;
    messages: ChatMessage[];
};

export type ChatMessage = {
    message_id: string;
    content: string;
    user?: User;
    user_id?: string;
    professional?: Professional;
    professional_id?: string;
    chat: Chat;
    chat_id: string;
    created_at: Date;
    referenceType: ReferenceSenderType;
};

export type RefreshToken = {
    id: string;
    token: string;
    user: User;
    user_id: string;
};
