import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Booking, Consultation, Professional } from "../../../types/dbTypes";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { BACKEND_URL } from "@env";
import { Button } from "react-native-paper";

const style = StyleSheet.create({
    paid: {
        backgroundColor: "#cbc9c3",
        paddingHorizontal: 15,
        paddingBottom: 20,
        paddingTop: 15,
        borderRadius: 15,
        gap: 20,
        marginBottom: 10,
    },
    done: {
        backgroundColor: "#f6ae0a",
        paddingHorizontal: 15,
        paddingBottom: 20,
        paddingTop: 15,
        borderRadius: 15,
        gap: 20,
        marginBottom: 10,
    },
});

const BookingHistCard = ({ key, booking }: { key: string; booking: Booking }) => {
    const { user, role, accessToken } = useAuth();
    const [profData, setProfData] = useState<Professional>();
    const [consultationData, setConsultationData] = useState<Consultation>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Fetch professional data based on booking
        const fetchProfessional = async (professionalId: string) => {
            console.log(professionalId);
            try {
                const response = await axios({
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    url: `${BACKEND_URL}/api/professional/getProfId/${professionalId}`,
                });
                setProfData(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchConsultationData = async () => {
            try {
                const response = await axios({
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    url: `${BACKEND_URL}/api/consultation/getConsultationWithBookingId/${booking.booking_id}`,
                });
                setConsultationData(response.data.data);
                return response.data.data.professional_id;
            } catch (error) {
                console.log(error);
            }
        };
        const getData = async () => {
            const professionalId = await fetchConsultationData();
            await fetchProfessional(professionalId);
        };

        getData();
        setIsLoading(false);
    }, []);

    if (isLoading || !profData || !consultationData) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading...</Text>
            </View>
        );
    } else {
        const starting_time = new Date(consultationData.start_time);
        const book_time = new Date(booking.booking_time);

        const startDate = starting_time.toDateString().split(" ");
        const startMonth = startDate[1];
        const startDay = startDate[0];
        const startDayNum = startDate[2];
        const startYear = startDate[3];
        const dateString = `${startDay}, ${startDayNum} ${startMonth} ${startYear}`;

        const bookDate = book_time.toDateString().split(" ");
        const bookMonth = bookDate[1];
        const bookDay = bookDate[0];
        const bookDayNum = bookDate[2];
        const bookYear = bookDate[3];
        const bookString = `${bookDay}, ${bookDayNum} ${bookMonth} ${bookYear}`;

        return (
            <View style={booking.status === "PAID" ? style.paid : style.done}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 30 }}>
                    <View style={{ flexDirection: "column" }}>
                        <Text>Konsultasi {booking.type}</Text>
                        <Text style={{ fontSize: 10 }}>{profData?.name}</Text>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontSize: 9 }}>{dateString}</Text>
                        <Text style={{ fontSize: 12 }}>
                            {new Date(consultationData!.start_time).toLocaleTimeString()}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 50,
                        alignItems: "center",
                    }}
                >
                    <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontSize: 9 }}>Booking date: {bookString}</Text>
                        <Text style={{ fontSize: 9 }}>
                            Booking time: {new Date(booking.booking_time).toLocaleTimeString()}
                        </Text>
                    </View>
                    <View>
                        {booking.status === "PAID" ? (
                            <Button
                                mode="outlined"
                                style={{ backgroundColor: "#5a5a5a" }}
                                labelStyle={{ color: "white", lineHeight: 11, fontSize: 10 }}
                                disabled={true}
                            >
                                Paid
                            </Button>
                        ) : (
                            <Button
                                mode="outlined"
                                style={{ backgroundColor: "#ecca9c" }}
                                labelStyle={{ color: "black", lineHeight: 11, fontSize: 10 }}
                                disabled={true}
                            >
                                Done
                            </Button>
                        )}
                    </View>
                </View>
            </View>
        );
    }
};

export default BookingHistCard;
