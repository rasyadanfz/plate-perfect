import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Button } from "react-native-paper";
import { useAuth } from "../../../context/AuthProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfessionalCard from "../../../globals/components/ProfessionalCard";
import HistoryCard from "../../../globals/components/HistoryCard";
import NextSchedule from "../../../globals/components/NextSchedule";

export default function Home() {
    const { user } = useAuth();
    const safeInsets = useSafeAreaInsets();

    const style = StyleSheet.create({
        container: {
            paddingTop: safeInsets.top - 10,
            paddingLeft: safeInsets.left + 20,
            paddingRight: safeInsets.right + 20,
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

    return (
        <ScrollView style={style.container}>
            <View style={{ marginBottom: 20 }}>
                <Text style={style.title}>Hi {user?.name} !</Text>
            </View>
            <View style={style.sectionContainer}>
                <View style={style.section}>
                    <Text style={style.subtitle}>Our Professionals</Text>
                    <Button mode="contained" labelStyle={{ fontSize: 9, lineHeight: 9 }}>
                        See All
                    </Button>
                </View>
                <Text style={style.sectionItem}>Here are our professional recommendation for you!</Text>
                <ProfessionalCard name="H. Ben Edict" />
            </View>
            <View style={style.sectionContainer}>
                <View style={style.section}>
                    <Text style={style.subtitle}>Consultation History</Text>
                    <Button mode="contained" labelStyle={{ fontSize: 9, lineHeight: 9 }}>
                        See All
                    </Button>
                </View>
                <Text style={style.sectionItem}>Your last consultation history</Text>
                <HistoryCard />
            </View>
            <View style={style.sectionContainer}>
                <Text style={style.subtitle}>Next Schedule</Text>
                <NextSchedule />
            </View>
        </ScrollView>
    );
}
