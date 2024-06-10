import { Link, Redirect, router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Button } from "react-native-paper";
import { useAuth } from "../../../context/AuthProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfessionalCard from "../../../globals/components/ProfessionalCard";
import HistoryCard from "../../../globals/components/HistoryCard";
import NextSchedule from "../../../globals/components/NextSchedule";
import { Professional, User } from "../../../../types/dbTypes";

export default function Home() {
    const { user, role } = useAuth();
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
        button: {},
    });

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
                        >
                            See All
                        </Button>
                    </View>
                    <Text style={style.sectionItem}>
                        Here are our professional recommendation for you!
                    </Text>
                    <ProfessionalCard name="H. Ben Edict" />
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
                    <HistoryCard role="USER" />
                </View>
                <View style={style.sectionContainer}>
                    <Text style={style.subtitle}>Next Schedule</Text>
                    <NextSchedule
                        role="USER"
                        title="Konsultasi Masakan"
                        clientOrProfessionalName="Dr. H. Ben Edict"
                    />
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
                    <HistoryCard role="PROFESSIONAL" />
                </View>
                <View style={style.sectionContainer}>
                    <Text style={style.subtitle}>Next Schedule</Text>
                    <NextSchedule
                        role="PROFESSIONAL"
                        title="Konsultasi Masakan"
                        clientOrProfessionalName="Hugo Benedicto"
                    />
                </View>
                <Button mode="contained" onPress={() => router.push("/chat/1")}>
                    Chat
                </Button>
            </ScrollView>
        );
    }
}
