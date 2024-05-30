import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthProvider";
import { useState } from "react";
import { Professional, User } from "../../../../types/dbTypes";
import axios from "axios";
import { BACKEND_URL } from "@env";
import { router } from "expo-router";

const ProfessionalEdit = () => {
    const { user, accessToken, fetchUserData } = useAuth();
    const userData = user as Professional;
    const [professionalData, setProfessionalData] = useState({
        experience: userData.experience,
        description: userData.description,
        phone_num: userData.phone_num,
    });
    const insets = useSafeAreaInsets();
    const style = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-start",
            paddingHorizontal: 20,
            paddingTop: insets.top,
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

    const handleSave = async () => {
        if (
            !professionalData.experience ||
            !professionalData.description ||
            !professionalData.phone_num
        ) {
            Alert.alert("Error", "Please fill in all the fields");
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
            name: userData.name,
            role: userData.role.toUpperCase(),
            experience: professionalData.experience,
            description: professionalData.description,
            phone_num: professionalData.phone_num,
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
                router.replace("/profile");
                Alert.alert("Success", "Profile updated successfully");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={style.container}>
            <ScrollView>
                <Text style={{ marginTop: 10, fontSize: 16, marginBottom: 20 }}>
                    Edit your personal information
                </Text>
                <TextInput
                    mode="outlined"
                    label="Experience (years)"
                    keyboardType="numeric"
                    value={
                        isNaN(professionalData.experience) ? "" : professionalData.experience.toString()
                    }
                    onChangeText={(text) =>
                        setProfessionalData({ ...professionalData, experience: parseFloat(text) })
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
                    keyboardType="numeric"
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
                <Button
                    mode="contained"
                    style={{ marginTop: 10, backgroundColor: "#ecca9c" }}
                    labelStyle={{ color: "black" }}
                    onPress={handleSave}
                >
                    Save Profile
                </Button>
            </ScrollView>
        </View>
    );
};

const UserEdit = () => {
    const { user, accessToken, fetchUserData } = useAuth();
    const currData = user as User;
    const [userData, setUserData] = useState({
        age: currData.age,
        phone_num: currData.phone_num,
        allergies: currData.allergies,
        medicalRecords: currData.medicalRecords,
    });
    const insets = useSafeAreaInsets();
    const style = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-start",
            paddingHorizontal: 20,
            paddingTop: insets.top,
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

    const handleSave = async () => {
        if (!userData.age || !userData.phone_num) {
            Alert.alert("Error", "Please fill in all the fields");
            return;
        }

        if (!/^\d+$/.test(userData.phone_num)) {
            Alert.alert("Error", "Please enter a valid phone number");
            return;
        }

        if (!/^\d+$/.test(userData.age.toString())) {
            Alert.alert("Error", "Please enter a valid age");
            return;
        }

        const data = {
            email: currData.email,
            name: currData.name,
            country: currData.country,
            age: userData.age,
            gender: currData.gender,
            allergies: userData.allergies,
            medicalRecords: userData.medicalRecords,
            DoB: currData.date_of_birth,
            phoneNum: userData.phone_num,
            firstCompleted: true,
        };

        try {
            const res = await axios({
                method: "PUT",
                url: `${BACKEND_URL}/api/profile/user`,
                headers: { Authorization: `Bearer ${accessToken}` },
                data: data,
            });

            if (res.status === 200) {
                await fetchUserData();
                router.replace("/profile");
                Alert.alert("Success", "Profile updated successfully");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={style.container}>
            <ScrollView>
                <Text style={{ marginTop: 10, fontSize: 16, marginBottom: 20 }}>
                    Edit your personal information
                </Text>
                <TextInput
                    mode="outlined"
                    label="Age *"
                    keyboardType="numeric"
                    value={isNaN(userData.age!) ? "" : userData.age!.toString()}
                    onChangeText={(text) => setUserData({ ...userData, age: parseInt(text) })}
                    style={style.textInput}
                />
                <TextInput
                    mode="outlined"
                    label="Phone Number *"
                    value={userData.phone_num}
                    onChangeText={(text) => setUserData({ ...userData, phone_num: text })}
                    keyboardType="numeric"
                    style={style.textInput}
                />
                <Text style={{ fontSize: 11, color: "gray" }}>
                    Fill with ; as separator. Ex: allergy A; allergy B; ...
                </Text>
                <TextInput
                    mode="outlined"
                    label="Allergies"
                    value={userData.allergies.join("; ")}
                    onChangeText={(text) => setUserData({ ...userData, allergies: text.split("; ") })}
                    style={style.textInput}
                />
                <Text style={{ fontSize: 11, color: "gray" }}>
                    Fill with ; as separator. Ex: record A; record B; ...
                </Text>
                <TextInput
                    mode="outlined"
                    label="Medical Records"
                    value={userData.medicalRecords.join("; ")}
                    onChangeText={(text) =>
                        setUserData({ ...userData, medicalRecords: text.split("; ") })
                    }
                    style={style.textInput}
                />
                <Button
                    mode="contained"
                    style={{ marginTop: 10, backgroundColor: "#ecca9c" }}
                    labelStyle={{ color: "black" }}
                    onPress={handleSave}
                >
                    Save Profile
                </Button>
            </ScrollView>
        </View>
    );
};

const Edit = () => {
    const { role } = useAuth();
    if (role === "PROFESSIONAL") {
        return <ProfessionalEdit />;
    } else if (role === "USER") {
        return <UserEdit />;
    }
};

export default Edit;
