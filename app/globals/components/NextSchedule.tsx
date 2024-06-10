import { BACKEND_URL } from "@env";
import axios from "axios";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useAuth } from "../../context/AuthProvider";
import { useEffect, useState } from "react";
import { Booking, Consultation, Professional } from "../../../types/dbTypes";

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

function ConsultButton() {
    return (
        <Button mode="contained" style={{ backgroundColor: "#ecca9c" }} labelStyle={style.buttonText}>
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
                    return tempBooking;
                } catch (error) {
                    console.log("HERE1");
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
                const tempConsultation = await getConsultationData(tempBook!);
                await getProfData(tempConsultation!);
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
                    <Text style={{ fontSize: 13, marginTop: 10, fontWeight: "bold" }}>
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
                            <ConsultButton />
                        </View>
                    </View>
                    <View style={style.detailContainer}>
                        <DetailCard text="45 Minute" />
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                            {new Date(consultationData?.date).toLocaleTimeString("en-GB")}
                        </Text>
                    </View>
                </View>
            );
        }
    } else {
        return (
            <View style={style.container}>
                <View style={style.desc}>
                    <View style={style.title}>
                        <Text style={{ fontSize: 14 }}>{title}</Text>
                        <Text style={{ fontSize: 11 }}>Client: {clientOrProfessionalName}</Text>
                    </View>
                    <View>
                        <ConsultButton />
                    </View>
                </View>
                <View style={style.detailContainer}>
                    <DetailCard text="45 Minute" />
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>13:00</Text>
                </View>
            </View>
        );
    }
}
