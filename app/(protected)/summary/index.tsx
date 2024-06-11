import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const SummaryPage = () => {

    const fetchParams = useLocalSearchParams();
    

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>WHAT THE SIGMA</Text>
        </View>
    );
};

export default SummaryPage;
