import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

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
        color: "white",
        fontSize: 9,
        lineHeight: 9,
    },
});

function ConsultButton() {
    return (
        <Button mode="contained" labelStyle={style.buttonText}>
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
export default function NextSchedule() {
    return (
        <View style={style.container}>
            <View style={style.desc}>
                <View style={style.title}>
                    <Text style={{ fontSize: 14 }}>Konsultasi Masakan</Text>
                    <Text style={{ fontSize: 11 }}>H. Ben Edict</Text>
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
