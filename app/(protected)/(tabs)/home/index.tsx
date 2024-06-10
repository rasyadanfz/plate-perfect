import { Link, Redirect, router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Button } from "react-native-paper";
import { useAuth } from "../../../context/AuthProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfessionalCard from "../../../globals/components/ProfessionalCard";
import HistoryCard from "../../../globals/components/HistoryCard";
import NextSchedule from "../../../globals/components/NextSchedule";
import { Booking, Professional, ProfessionalRole, User } from "../../../../types/dbTypes";
import React from "react";
import axios from "axios";
import { BACKEND_URL } from "@env";
import { useEffect } from "react";

export default function Home() {
    const { user, role, accessToken } = useAuth();
    const safeInsets = useSafeAreaInsets();

    const [tempProfessional, setTempProfessional] = React.useState<Professional | null>(null);
    const [userHistory, setUserHistory] = React.useState<Booking[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        const fetchProfessional = async () => {
            try {
                const response = await axios({
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    url: `${BACKEND_URL}/api/professional/getOneProfessional`,
                });
                setTempProfessional(response.data.data);
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
                    url: `${BACKEND_URL}/api/booking/oneUserHistory`,
                });
                setUserHistory(response.data.data);
            } catch (error) {
                console.log("oneHist");
                console.log(error);
            }
        };
        fetchProfessional();
        fetchUserHistory();
        setIsLoading(false);
    }, []);

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

    if (isLoading) {
        return (
            <View style={style.container}>
                <Text style={{ fontSize: 18 }}>Please wait...</Text>
            </View>
        );
    }

    if (role === "USER") {
        const userData = user as User;
        return (
            <ScrollView style={style.container}>
                <View style={{ marginBottom: 20 }}>
                    <Text style={style.title}>Hi {userData.name} !</Text>
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
                        {
                            userHistory.length > 0 &&                         <Button
                            mode="contained"
                            style={{ backgroundColor: "#ecca9c" }}
                            labelStyle={{ fontSize: 10, lineHeight: 10, color: "black" }}
                            onPress={() => router.push("/home/consultationHist")}
                        >
                            See All
                        </Button>
                        }

                    </View>
                    <Text style={style.sectionItem}>Your last consultation history</Text>
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
                <Button mode="contained" onPress={() => router.push("/chat/1")}>
                    Chat
                </Button>
            </ScrollView>
        );
    } else {
        const userData = user as Professional;
        return (
            <ScrollView style={style.container}>
                <View style={{ marginBottom: 20 }}>
                    <Text style={style.title}>Hi {userData.name} !</Text>
                </View>
                <View style={style.sectionContainer}>
                    <View style={style.section}>
                        <Text style={style.subtitle}>Consultation History</Text>
                        <Button
                            mode="contained"
                            style={{ backgroundColor: "#ecca9c" }}
                            labelStyle={{ fontSize: 10, lineHeight: 10, color: "black" }}
                        >
                            See All
                        </Button>
                    </View>
                    <Text style={style.sectionItem}>Your last consultation history</Text>
                    {/* <HistoryCard role="PROFESSIONAL" /> */}
                </View>
                <View style={style.sectionContainer}>
                    <Text style={style.subtitle}>Next Schedule</Text>
                    <NextSchedule role="PROFESSIONAL" />
                </View>
                <Button mode="contained" onPress={() => router.push("/chat/1")}>
                    Chat
                </Button>
            </ScrollView>
        );
    }
}
