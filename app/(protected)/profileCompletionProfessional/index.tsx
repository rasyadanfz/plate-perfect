import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthProvider";
import { BACKEND_URL } from "@env";
import axios from "axios";
import { router } from "expo-router";
import React from "react";

export default function ProfileCompletionProfessional() {
    const { accessToken, fetchUserData, signOut } = useAuth();
    const [professionalData, setProfessionalData] = useState({
        name: "",
        role: "",
        experience: 0,
        description: "",
        phone_num: "",
    });
    const insets = useSafeAreaInsets();
    const style = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-start",
            paddingHorizontal: 20,
            paddingTop: insets.top + 30,
            paddingBottom: 10,
            backgroundColor: "#e8efcf",
        },
        title: {
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 10,
        },
        subtitle: {
            marginBottom: 10,
        },
        textInput: {
            marginBottom: 15,
        },
    });
    const handleLogout = async () => {
        const logout = await signOut();
        if (logout) {
            router.replace("/signIn");
        }
    };

    const handleSave = async () => {
        if (
            !professionalData.name ||
            !professionalData.role ||
            !professionalData.experience ||
            !professionalData.description ||
            !professionalData.phone_num
        ) {
            Alert.alert("Error", "Please fill in all the fields");
            return;
        }

        if (!/^[a-zA-Z ]+$/.test(professionalData.name)) {
            Alert.alert("Error", "Please enter a valid name");
            return;
        }

        if (
            professionalData.role.toLowerCase() !== "nutrisionist" &&
            professionalData.role.toLowerCase() !== "chef"
        ) {
            Alert.alert("Error", "Please enter a valid role\n(Chef/Nutrisionist)");
            return;
        }

        if (!/^-?\d+(\.\d+)?$|^-?\.\d+$/.test(professionalData.experience.toString())) {
            Alert.alert("Error", "Please enter a valid experience number");
            return;
        }

        if (!/^\d+$/.test(professionalData.phone_num)) {
            Alert.alert("Error", "Please enter a valid phone number");
            return;
        }

        const data = {
            name: professionalData.name,
            role: professionalData.role.toUpperCase(),
            experience: professionalData.experience,
            description: professionalData.description,
            phone_num: professionalData.phone_num,
            firstCompleted: true,
        };

        try {
            const res = await axios({
                method: "PUT",
                url: `${BACKEND_URL}/api/profile/professional`,
                headers: { Authorization: `Bearer ${accessToken}` },
                data: data,
            });

            if (res.status === 200) {
                await fetchUserData();
                router.replace("/home");
                Alert.alert("Success", "Profile updated successfully");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={style.container}>
            <ScrollView>
                <Text style={style.title}>Hello!</Text>
                <Text style={style.subtitle}>
                    Welcome to PlatePerfect! To get started, we'd love to get to know you better.
                </Text>
                <Text style={{ marginTop: 10 }}>Please fill in the information below</Text>
                <TextInput
                    mode="outlined"
                    label="Name"
                    value={professionalData.name}
                    onChangeText={(text) => setProfessionalData({ ...professionalData, name: text })}
                    style={style.textInput}
                />
                <TextInput
                    mode="outlined"
                    label="Role"
                    value={professionalData.role}
                    onChangeText={(text) => setProfessionalData({ ...professionalData, role: text })}
                    style={style.textInput}
                />
                <TextInput
                    mode="outlined"
                    label="Experience"
                    onChangeText={(text) =>
                        setProfessionalData({ ...professionalData, experience: parseFloat(text) })
                    }
                    style={style.textInput}
                />
                <TextInput
                    mode="outlined"
                    label="Description"
                    value={professionalData.description}
                    onChangeText={(text) =>
                        setProfessionalData({ ...professionalData, description: text })
                    }
                    style={style.textInput}
                />
                <TextInput
                    mode="outlined"
                    label="Phone Number"
                    value={professionalData.phone_num}
                    onChangeText={(text) =>
                        setProfessionalData({ ...professionalData, phone_num: text })
                    }
                    style={style.textInput}
                />
                <Button mode="contained" style={{ marginTop: 10 }} onPress={handleSave}>
                    Save Profile
                </Button>
                <View
                    style={{ flex: 1, flexDirection: "row", alignItems: "center", marginVertical: 30 }}
                >
                    <View style={{ flex: 1, backgroundColor: "black", height: 0.5 }}></View>
                    <Text style={{ textAlign: "center", paddingHorizontal: 15 }}>Or</Text>
                    <View style={{ flex: 1, backgroundColor: "black", height: 0.5 }}></View>
                </View>
                <Button mode="contained" onPress={handleLogout}>
                    Back to Login Screen
                </Button>
            </ScrollView>
        </View>
    );
}
