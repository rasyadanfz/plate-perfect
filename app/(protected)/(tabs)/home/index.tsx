import { Link, Redirect, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Button } from "react-native-paper";
import { useAuth } from "../../../context/AuthProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfessionalCard from "../../../globals/components/ProfessionalCard";
import HistoryCard from "../../../globals/components/HistoryCard";
import NextSchedule from "../../../globals/components/NextSchedule";
import { Booking, Consultation, Professional, ProfessionalRole, User } from "../../../../types/dbTypes";
import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@env";
import { useEffect } from "react";
import lodash from "lodash";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function Home() {
    const { user, role, accessToken } = useAuth();
    const safeInsets = useSafeAreaInsets();

    const style = StyleSheet.create({
        container: {
            paddingTop: safeInsets.top - 10,
            paddingLeft: safeInsets.left + 20,
            paddingRight: safeInsets.right + 20,
            paddingBottom: 30,
            backgroundColor: "#e8efcf",
            flex: 1,
            rowGap: 20,
        },
        title: {
            fontSize: 22,
            fontWeight: "bold",
        },
        sectionContainer: {
            flex: 1,
            marginBottom: 25,
        },
        section: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
        },
        sectionItem: {
            flex: 1,
            marginBottom: 10,
            fontSize: 13,
        },
        subtitle: {
            fontSize: 17,
            fontWeight: "bold",
            marginBottom: 5,
        },
    });

    if (role === "USER") {
        const userData = user as User;

        const [tempProfessional, setTempProfessional] = React.useState<Professional | null>(null);
        const [userHistory, setUserHistory] = React.useState<Booking[]>([]);
        const [isLoading, setIsLoading] = React.useState(true);
        const [isUpdate, setIsUpdate] = useState<boolean>(true);

        const fetchProfessional = async () => {
            try {
                const response = await axios({
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    url: `${BACKEND_URL}/api/professional/getProfId/clx8ynvru0013zd84m25ifr7a`,
                });
                if (!lodash.isEqual(response.data.data, tempProfessional)) {
                    setTempProfessional(response.data.data);
                }
            } catch (error) {
                console.log("getOne");
                console.log(error);
            }
        };

        const fetchUserHistory = async () => {
            try {
                const response = await axios({
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    url: `${BACKEND_URL}/api/booking/userHistory`,
                });
                setUserHistory(response.data.data);
            } catch (error) {
                console.log("oneHist");
                console.log(error);
            }
        };

        const getData = async () => {
            setIsUpdate(true);
            await fetchProfessional();
            await fetchUserHistory();

            setIsUpdate(false);
        };

        useEffect(() => {
            getData();
            setIsLoading(false);
        }, []);
        if (isLoading) {
            return (
                <View style={style.container}>
                    <Text style={{ fontSize: 18 }}>Please wait...</Text>
                </View>
            );
        }
        return (
            <ScrollView style={style.container}>
                <View
                    style={{
                        marginBottom: 20,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text style={style.title}>Hi {userData.name} !</Text>
                    <Pressable
                        onPress={async () => {
                            setIsLoading(true);
                            await getData();
                            setIsLoading(false);
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon name="sync" size={16} color="black" />
                            <Text style={{ fontSize: 12, marginLeft: 10 }}>Refresh</Text>
                        </View>
                    </Pressable>
                </View>
                <View style={style.sectionContainer}>
                    <View style={style.section}>
                        <Text style={style.subtitle}>Our Professionals</Text>
                        <Button
                            mode="contained"
                            style={{ backgroundColor: "#ecca9c" }}
                            labelStyle={{ fontSize: 10, lineHeight: 10, color: "black" }}
                            onPress={() => router.push("/home/professionalList")}
                        >
                            See All
                        </Button>
                    </View>
                    <Text style={style.sectionItem}>
                        Here are our professional recommendation for you!
                    </Text>
                    <ProfessionalCard {...(tempProfessional as Professional)} />
                </View>
                <View style={style.sectionContainer}>
                    <View style={style.section}>
                        <Text style={style.subtitle}>Consultation History</Text>
                        {userHistory.length > 0 && (
                            <Button
                                mode="contained"
                                style={{ backgroundColor: "#ecca9c" }}
                                labelStyle={{ fontSize: 10, lineHeight: 10, color: "black" }}
                                onPress={() => router.push("/home/consultationHist")}
                            >
                                See All
                            </Button>
                        )}
                    </View>
                    {userHistory.length > 0 && (
                        <Text style={style.sectionItem}>Your last consultation history</Text>
                    )}
                    {userHistory.length > 0 ? (
                        <HistoryCard
                            role="USER"
                            type={userHistory[0].type}
                            booking_id={userHistory[0].booking_id}
                        />
                    ) : (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontSize: 13, marginTop: 10, fontWeight: "bold" }}>
                                You have no consultation history
                            </Text>
                        </View>
                    )}
                </View>
                <View style={style.sectionContainer}>
                    <Text style={style.subtitle}>Next Schedule</Text>
                    <NextSchedule role="USER" />
                </View>
            </ScrollView>
        );
    } else {
        const userData = user as Professional;
        const [consultationList, setConsultationList] = useState<Consultation[]>();
        const [bookingList, setBookingList] = useState<Booking[]>();
        const [bookingIdSet, setBookingIdSet] = useState<Set<string>>(new Set());
        const [isLoading, setIsLoading] = useState<boolean>(true);
        const [isUpdate, setIsUpdate] = useState<boolean>(true);

        const fetchConsultationList = async () => {
            try {
                const response = await axios({
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    url: `${BACKEND_URL}/api/consultation/professionalConsultationList`,
                });

                const consultationData: Consultation[] = response.data.data;
                return consultationData;
            } catch (error) {
                console.log("consultationList");
                console.log(error);
            }
        };

        const fetchBookingsWithId = async (consultList: Consultation[]) => {
            if (!consultList || !consultList.length) return;
            try {
                // Paid bookings
                const promises = consultList.map((consult) => {
                    return axios({
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        url: `${BACKEND_URL}/api/booking/${consult.booking_id}`,
                    });
                });

                const responses = await Promise.all(promises);
                const bookingList: Booking[] = responses.map((response) => response.data.data);
                setBookingList(bookingList);
                return bookingList;
            } catch (error) {
                console.log("bookingList");
                console.log(error);
            }
        };

        const getData = async () => {
            const list = await fetchConsultationList();
            console.log(list);
            const bookingList = await fetchBookingsWithId(list!);
            const processData = async (bookingList: Booking[]) => {
                if (!bookingList) return;
                const tempSet = new Set<string>();
                bookingList?.forEach((booking) => {
                    if (booking.status === "DONE") {
                        tempSet.add(booking.booking_id);
                    }
                });
                setBookingIdSet(tempSet);
                if (tempSet.size === 0) {
                    return;
                }
                const finalList = list!.filter((consult) => tempSet.has(consult.booking_id)).slice(0, 3);
                const finalBookingList = bookingList!.filter((booking) =>
                    tempSet.has(booking.booking_id)
                );
                setConsultationList(finalList);
                setBookingList(finalBookingList);
            };
            if (!bookingList) return;
            await processData(bookingList);
        };

        useEffect(() => {
            getData();
            setIsLoading(false);
        }, []);

        if (isLoading) {
            return (
                <View style={style.container}>
                    <Text style={{ fontSize: 18 }}>Please wait...</Text>
                </View>
            );
        } else {
            return (
                <ScrollView style={style.container}>
                    <View
                        style={{
                            marginBottom: 20,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={style.title}>Hi, {userData.name} !</Text>
                        <Pressable
                            onPress={async () => {
                                setIsLoading(true);
                                await getData();
                                setIsLoading(false);
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Icon name="sync" size={16} color="black" />
                                <Text style={{ fontSize: 12, marginLeft: 10 }}>Refresh</Text>
                            </View>
                        </Pressable>
                    </View>
                    <View style={style.sectionContainer}>
                        <View style={style.section}>
                            <Text style={style.subtitle}>Consultation History</Text>
                            <Button
                                mode="contained"
                                style={{ backgroundColor: "#ecca9c" }}
                                labelStyle={{ fontSize: 10, lineHeight: 10, color: "black" }}
                                onPress={() => router.push("/home/consultationHist")}
                            >
                                See All
                            </Button>
                        </View>
                        {consultationList && (
                            <Text style={style.sectionItem}>Your consultation history</Text>
                        )}
                        <View style={{ gap: 15 }}>
                            {!consultationList ? (
                                <View
                                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                                >
                                    <Text style={{ fontSize: 13, marginTop: 10, fontWeight: "bold" }}>
                                        You have no consultation history
                                    </Text>
                                </View>
                            ) : (
                                

                                    <HistoryCard
                                        role="PROFESSIONAL"
                                        type={
                                            bookingList!.filter(
                                                (booking) =>
                                                    booking.booking_id === consultationList[0].booking_id
                                            )[0].type
                                        }
                                        booking_id={consultationList[0].booking_id}
                                        user_id={
                                            bookingList!.filter(
                                                (booking) =>
                                                    booking.booking_id === consultationList[0].booking_id
                                            )[0].customer_id
                                        }
                                        consultation={consultationList[0]}
                                    />
                                
                            )}
                        </View>
                    </View>
                    <View style={style.sectionContainer}>
                        <Text style={style.subtitle}>Next Schedule</Text>
                        <NextSchedule role="PROFESSIONAL" />
                    </View>
                </ScrollView>
            );
        }
    }
}
