import { BACKEND_URL } from "@env";
import axios from "axios";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useAuth } from "../../context/AuthProvider";
import { useEffect, useState } from "react";
import { Booking, Consultation, Professional, User } from "../../../types/dbTypes";
import { router } from "expo-router";

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f6ae0a",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: "flex-start",
    },
    desc: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        flex: 1,
        alignContent: "flex-start",
    },
    duration: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    detailContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    buttonText: {
        color: "black",
        fontSize: 10,
        lineHeight: 10,
    },
});

function ConsultButton({ chatRoomID }: { chatRoomID: string }) {
    const handlePress = () => {
        router.push(`/chat/${chatRoomID}`);
    };
    return (
        <Button
            mode="contained"
            style={{ backgroundColor: "#ecca9c" }}
            labelStyle={style.buttonText}
            onPress={handlePress}
        >
            Consult &gt;
        </Button>
    );
}
function DetailCard({ text }: { text: string }) {
    return (
        <View style={style.duration}>
            <FontAwesome5 size={16} name="clock" color="black" />
            <Text style={{ fontSize: 12, marginBottom: 1 }}>{text}</Text>
        </View>
    );
}

export default function NextSchedule({ role }: { role: string }) {
    const { accessToken } = useAuth();
    if (role.toLowerCase() === "user") {
        const [consultationData, setConsultationData] = useState<Consultation>();
        const [bookingData, setBookingData] = useState<Booking>();
        const [profData, setProfData] = useState<Professional>();
        const [isLoading, setIsLoading] = useState(true);
        const [chatRoomId, setChatRoomId] = useState<string>("");
        useEffect(() => {
            let tempBooking: Booking[], tempConsultation: Consultation;
            const getOnePaidBooking = async () => {
                try {
                    const response = await axios.get(`${BACKEND_URL}/api/booking/onePaidBooking`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    setBookingData(response.data.data);
                    tempBooking = response.data.data;
                    console.log(tempBooking);
                    return tempBooking;
                } catch (error) {
                    console.log("HERE1");
                    console.log(error);
                }
            };

            const getID = async (consultationId: string) => {
                try {
                    const response = await axios({
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        url: `${BACKEND_URL}/api/chatRoom/${consultationId}`,
                    });
                    const chatRoomId = response.data.data.chat_id;
                    setChatRoomId(chatRoomId);
                } catch (error) {
                    console.log(error);
                }
            };
            const getConsultationData = async (tempBook: Booking[]) => {
                if (tempBook.length === 0) return;
                try {
                    const response = await axios.get(
                        `${BACKEND_URL}/api/consultation/getConsultationWithBookingId/${tempBook[0].booking_id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    setConsultationData(response.data.data);
                    tempConsultation = response.data.data;
                    return tempConsultation;
                } catch (error) {
                    console.log("HERE2");
                    console.log(error);
                }
            };
            const getProfData = async (tempConsultation: Consultation) => {
                if (!tempConsultation) return;
                try {
                    const response = await axios.get(
                        `${BACKEND_URL}/api/professional/getProfId/${tempConsultation.professional_id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    setProfData(response.data.data);
                } catch (error) {
                    console.log("HERE3");
                    console.log(error);
                }
            };
            const getData = async () => {
                const tempBook = await getOnePaidBooking();
                if (!tempBook || !tempBook.length) return;
                const tempConsultation = await getConsultationData(tempBook!);
                await getProfData(tempConsultation!);
                await getID(tempConsultation!.consultation_id);
            };

            getData();
            setIsLoading(false);
        }, []);
        if (isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 18 }}>Please wait...</Text>
                </View>
            );
        } else if (!consultationData) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 13, marginTop: 20, fontWeight: "bold" }}>
                        You have no consultation scheduled
                    </Text>
                </View>
            );
        } else {
            return (
                <View style={style.container}>
                    <View style={style.desc}>
                        <View style={style.title}>
                            <Text style={{ fontSize: 14 }}>Konsultasi {bookingData?.type}</Text>
                            <Text style={{ fontSize: 11 }}>{profData?.name}</Text>
                        </View>
                        <View>
                            <ConsultButton chatRoomID={chatRoomId} />
                        </View>
                    </View>
                    <View style={style.detailContainer}>
                        <DetailCard text="45 Minute" />
                        <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                            {new Date(consultationData?.start_time).toDateString() +
                                " " +
                                new Date(consultationData?.start_time).toLocaleTimeString()}
                        </Text>
                    </View>
                </View>
            );
        }
    } else {
        const [consultationData, setConsultationData] = useState<Consultation>();
        const [booking, setBooking] = useState<Booking>();
        const [customerData, setCustomerData] = useState<User>();
        const [isLoading, setIsLoading] = useState(true);
        const [chatRoomId, setChatRoomId] = useState<string>("");

        useEffect(() => {
            // Get the next schedule
            const getConsultationData = async () => {
                try {
                    const response = await axios({
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        url: `${BACKEND_URL}/api/consultation/professionalNextSchedule`,
                    });
                    const data: Consultation[] = response.data.data;
                    setConsultationData(data[0]);
                    return data;
                } catch (error) {
                    console.log("getConsultationData");
                    console.log(error);
                }
            };

            const getUserData = async (userId: string) => {
                try {
                    const response = await axios({
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        url: `${BACKEND_URL}/api/profile/user/${userId}`,
                    });
                    setCustomerData(response.data.data);
                } catch (error) {
                    console.log("getUserData");
                    console.log(error);
                }
            };

            const getID = async (consultationId: string) => {
                try {
                    const response = await axios({
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        url: `${BACKEND_URL}/api/chatRoom/${consultationId}`,
                    });
                    const chatRoomId = response.data.data.chat_id;
                    setChatRoomId(chatRoomId);
                } catch (err) {
                    console.log("getID");
                    console.log(err);
                }
            };

            const getBooking = async (bookId: string) => {
                try {
                    const response = await axios({
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        url: `${BACKEND_URL}/api/booking/${bookId}`,
                    });
                    setBooking(response.data.data);
                } catch (error) {
                    console.log("getBooking");
                    console.log(error);
                }
            };

            const getData = async () => {
                const consultData = await getConsultationData();
                console.log("HERE");
                if (!consultData || !consultData.length) return;
                await getBooking(consultData[0].booking_id);
                await getUserData(consultData[0].customer_id);
                await getID(consultData[0].consultation_id);
            };

            getData();
            setIsLoading(false);
        }, []);
        if (isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 18 }}>Please wait...</Text>
                </View>
            );
        }

        if (consultationData && booking && customerData) {
            return (
                <View style={style.container}>
                    <View style={style.desc}>
                        <View style={style.title}>
                            <Text style={{ fontSize: 14 }}>Konsultasi {booking?.type}</Text>
                            <Text style={{ fontSize: 11 }}>Client: {customerData?.name}</Text>
                        </View>
                        <View>
                            <ConsultButton chatRoomID={chatRoomId} />
                        </View>
                    </View>
                    <View style={style.detailContainer}>
                        {consultationData && (
                            <>
                                <DetailCard text="45 Minute" />
                                <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                                    {new Date(consultationData.start_time).toDateString() +
                                        " " +
                                        new Date(consultationData?.start_time).toLocaleTimeString()}
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 13, marginTop: 10, fontWeight: "bold" }}>
                        You have no schedule
                    </Text>
                </View>
            );
        }
    }
}
