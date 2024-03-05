import { Text, View, StyleSheet } from "react-native";

const ConsultChoice = () => {
    return (
        <View style={styles.choiceContainer}>
            <ConsultCard type="chef" />
            <ConsultCard type="nutrisionist" />
        </View>
    );
};

const ConsultCard = ({ type }) => {
    return (
        <View style={styles.choiceCard}>
            <View>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                    {type === "chef"
                        ? "Chef Consultation"
                        : "Nutrisionist Consultation"}
                </Text>
                <Text>Consult with professional chefs here</Text>
            </View>
            <Text>&gt;&gt;</Text>
        </View>
    );
};

const HomeScreen = () => {
    return (
        <View style={{ flex: 1, alignItems: "flex-start" }}>
            <View style={styles.container}>
                <ConsultChoice />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: "5%",
    },
    choiceContainer: {
        flex: 1,
        flexDirection: "column",
        maxHeight: 300,
        marginLeft: "5%",
        rowGap: 30,
    },
    choiceCard: {
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: "5%",
        alignItems: "center",
        justifyContent: "space-between",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 10,
        gap: 10,
    },
});

export default HomeScreen;
