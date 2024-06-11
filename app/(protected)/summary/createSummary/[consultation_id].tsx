import { View, Text, Alert, StyleSheet } from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { BACKEND_URL } from "@env";
import axios from "axios";
import { Button, TextInput } from "react-native-paper";
import { useAuth } from "../../../context/AuthProvider";

const CreateSummary = () => {
    const { role, accessToken } = useAuth();
    const { consultation_id } = useLocalSearchParams();

    const handleSummary = async () => {
        try {
            const createSummary = await axios({
                method: "POST",
                url: `${BACKEND_URL}/api/summary/${consultation_id}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (createSummary.data) {
                Alert.alert("Success", "Summary has been created!");
                router.push("/home");
            }
        } catch (error) {}
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Dear {role.toLowerCase().charAt(0).toUpperCase() + role.toLowerCase().slice(1)},
            </Text>
            <Text style={styles.message}>
                We kindly request your assistance in summarizing the recent online consultation with a
                user.
            </Text>
            <Text style={styles.question}>
                Could you please summarize the recent online consultation?
            </Text>
            <TextInput style={styles.input} placeholder="Type here..." />

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={handleSummary}
                    style={styles.button}
                    labelStyle={{ color: "black" }}
                >
                    Submit
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#E8EFCF", // Warna latar belakang seperti contoh
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
    },
    question: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        height: 100,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
        textAlignVertical: "top",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    button: {
        backgroundColor: "#ecca9c",
        paddingHorizontal: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: "black",
        fontWeight: "bold",
    },
});

export default CreateSummary;
