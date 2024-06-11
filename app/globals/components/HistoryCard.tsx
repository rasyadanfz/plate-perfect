import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Consultation, Professional, User } from "../../../types/dbTypes";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { BACKEND_URL } from "@env";
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
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 70,
        marginTop: 20,
    },
    buttonText: {
        color: "black",
        fontSize: 10,
        lineHeight: 10,
    },
});

export default function HistoryCard({
    role,
    type,
    booking_id,
    user_id,
    consultation,
}: {
    role: string;
    type: string;
    booking_id?: string;
    user_id?: string;
    consultation?: Consultation;
}) {
    const handleChatHistoryPress = () => {
        router.push(`/chat/history/${consultation?.consultation_id}`);
    };
    if (role.toLowerCase() === "user") {
        const { accessToken } = useAuth();
        const [profData, setProfData] = useState<Professional>();
        const [consultationData, setConsultationData] = useState<Consultation>();
        const [isLoading, setIsLoading] = useState(true);
        const [trig, setTrig] = useState(0);

        useEffect(() => {
            const allinOneFunction = async () => {
                setIsLoading(true);
                try {
                    const response = await axios({
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        url: `${BACKEND_URL}/api/consultation/getConsultationWithBookingId/${booking_id}`,
                    });

                    if (response.data.data) {
                        setConsultationData(response.data.data);
                    } else {
                        console.log("THERE IS NO CONSULTATION DATA");
                        return;
                    }
                } catch (error) {
                    console.log("GetConsultationWithBookingID");
                    console.log(error);
                }

                try {
                    setIsLoading(true);
                    const response = await axios({
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        url: `${BACKEND_URL}/api/professional/getProfId/${consultationData?.professional_id}`,
                    });

                    if (response) {
                        setProfData(response.data.data);
                    } else {
                        console.log("THERE IS NO PROF DATA");
                    }
                } catch (error) {
                    console.log("getProfId");
                    console.log(error);
                } finally {
                    setIsLoading(false);
                    if (trig < 1) {
                        setTrig(trig + 1);
                    }
                }
            };

            allinOneFunction();
        }, [trig]);

        if (isLoading === false && consultationData && profData) {
            const date = new Date(consultationData.date);

            const startDate = new Date(consultationData.start_time);
            const endDate = new Date(consultationData.end_time);

            const startHourMinute = `${startDate.getUTCHours().toString().padStart(2, "0")}:${startDate
                .getUTCMinutes()
                .toString()
                .padStart(2, "0")}`;
            const endHourMinute = `${endDate.getUTCHours().toString().padStart(2, "0")}:${endDate
                .getUTCMinutes()
                .toString()
                .padStart(2, "0")}`;

            return (
                <View style={style.container}>
                    <View style={style.desc}>
                        <View style={style.title}>
                            <Text style={{ fontSize: 14 }}>Konsultasi {type}</Text>
                            <Text style={{ fontSize: 11 }}>{profData.name}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 13, textAlign: "right" }}>
                                {date.toDateString()}
                            </Text>
                            <Text style={{ fontSize: 13, textAlign: "right" }}>
                                {startHourMinute} - {endHourMinute}{" "}
                            </Text>
                        </View>
                    </View>
                    <View style={style.buttonContainer}>
                        <Button
                            mode="contained"
                            style={{ flex: 1, backgroundColor: "#ecca9c" }}
                            labelStyle={style.buttonText}
                        >
                            Summary &gt;
                        </Button>
                        <Button
                            mode="contained"
                            style={{ flex: 1, backgroundColor: "#ecca9c" }}
                            labelStyle={style.buttonText}
                            onPress={handleChatHistoryPress}
                        >
                            Chat History &gt;
                        </Button>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 18 }}>Please wait...</Text>
                </View>
            );
        }
    } else {
        const [userData, setUserData] = useState<User>();
        const [isLoading, setIsLoading] = useState(true);
        const { accessToken } = useAuth();

        useEffect(() => {
            console.log(user_id);
            const getUserData = async () => {
                try {
                    const response = await axios({
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        url: `${BACKEND_URL}/api/profile/user/${user_id}`,
                    });
                    setUserData(response.data.data);
                    setIsLoading(false);
                } catch (error) {
                    console.log("getUserData");
                    console.log(error);
                }
            };
            getUserData();
        }, []);

        if (isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 18 }}>Please wait...</Text>
                </View>
            );
        } else {
            return (
                <View style={style.container}>
                    <View style={style.desc}>
                        <View style={style.title}>
                            <Text style={{ fontSize: 14 }}>Konsultasi {type}</Text>
                            <Text style={{ fontSize: 11 }}>Client: {userData!.name}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 11 }}>
                                {new Date(consultation!.start_time).toDateString() +
                                    " " +
                                    new Date(consultation!.start_time).toLocaleTimeString()}
                            </Text>
                        </View>
                    </View>
                    <View style={style.buttonContainer}>
                        <Button
                            mode="contained"
                            style={{ flex: 1, backgroundColor: "#ecca9c" }}
                            labelStyle={style.buttonText}
                        >
                            Summary &gt;
                        </Button>
                        <Button
                            mode="contained"
                            style={{ flex: 1, backgroundColor: "#ecca9c" }}
                            labelStyle={style.buttonText}
                            onPress={handleChatHistoryPress}
                        >
                            Chat History &gt;
                        </Button>
                    </View>
                </View>
            );
        }
    }
}
