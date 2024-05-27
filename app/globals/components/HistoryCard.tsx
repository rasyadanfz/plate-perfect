import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

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
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 70,
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 9,
        lineHeight: 9,
    },
});

export default function HistoryCard() {
    return (
        <View style={style.container}>
            <View style={style.desc}>
                <View style={style.title}>
                    <Text style={{ fontSize: 14 }}>Konsultasi Masakan</Text>
                    <Text style={{ fontSize: 11 }}>H. Ben Edict</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 13 }}>2022-01-01</Text>
                </View>
            </View>
            <View style={style.buttonContainer}>
                <Button mode="contained" style={{ flex: 1 }} labelStyle={style.buttonText}>
                    Summary &gt;
                </Button>
                <Button mode="contained" style={{ flex: 1 }} labelStyle={style.buttonText}>
                    Chat History &gt;
                </Button>
            </View>
        </View>
    );
}
