import axios from "axios";
import { BACKEND_URL } from "@env";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthProvider";
import { Alert } from "react-native";
import { router } from "expo-router";

function ProfileCompletion() {
    const { signOut } = useAuth();
    const { user, accessToken, fetchUserData } = useAuth();
    const [email, setEmail] = useState<string>(user!.email);
    const [name, setName] = useState<string | null>();
    const [country, setCountry] = useState<string | null>(null);
    const [age, setAge] = useState<string | null>(null);
    const [gender, setGender] = useState<string | null>(null);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [medicalRecords, setMedicalRecords] = useState<string[]>([]);
    const [DoB, setDoB] = useState<Date | null>(null);
    const [phoneNum, setPhoneNum] = useState<string | null>(null);
    const insets = useSafeAreaInsets();
    const style = styleProfileCompletion(insets);

    const handleLogout = async () => {
        const logout = await signOut();
        if (logout) {
            router.replace("/signIn");
        }
    };

    const handleSaveProfile = async () => {
        if (!name || !country || !age || !gender || !DoB || !phoneNum) {
            Alert.alert("Error", "Please fill in all the required fields");
            return;
        }

        if (!/^[a-zA-Z ]+$/.test(name)) {
            Alert.alert("Error", "Please enter a valid name");
            return;
        }

        if (!/^\d+$/.test(age)) {
            Alert.alert("Error", "Please enter a valid age");
            return;
        }

        if (gender.toLowerCase() !== "male" && gender.toLowerCase() !== "female") {
            Alert.alert("Error", "Please enter a valid gender\n(Male/Female)");
            return;
        }

        if (!/^[a-zA-Z]+$/.test(country)) {
            Alert.alert("Error", "Please enter a valid country");
            return;
        }

        if (!/^(?:19|20)\d\d-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/.test(DoB.toString())) {
            Alert.alert("Error", "Please enter a valid date of birth");
            return;
        }

        const data = {
            email: email,
            name: name,
            country: country,
            age: parseInt(age),
            gender: gender,
            allergies: allergies,
            medicalRecords: medicalRecords,
            DoB: new Date(DoB),
            phoneNum: phoneNum,
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
                router.replace("/home");
                Alert.alert("Success", "Profile updated successfully");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fields = [
        "Name",
        "Country",
        "Age",
        "Gender",
        "Allergies",
        "Medical Records",
        "Date of Birth",
        "Phone Number",
    ];

    const getSetter = (field: string) => {
        switch (field) {
            case "Name":
                return setName;
            case "Country":
                return setCountry;
            case "Age":
                return setAge;
            case "Gender":
                return setGender;
            case "Allergies":
                return setAllergies;
            case "Medical Records":
                return setMedicalRecords;
            case "Date of Birth":
                return setDoB;
            case "Phone Number":
                return setPhoneNum;
        }
    };

    const getGetter = (field: string) => {
        switch (field) {
            case "Name":
                return name;
            case "Country":
                return country;
            case "Age":
                return age;
            case "Gender":
                return gender;
            case "Allergies":
                return allergies;
            case "Medical Records":
                return medicalRecords;
            case "Date of Birth":
                return DoB;
            case "Phone Number":
                return phoneNum;
        }
    };

    return (
        <View style={style.container}>
            <ScrollView style={{ paddingHorizontal: 25 }}>
                <Text style={style.title}>Hello!</Text>
                <Text style={style.subtitle}>
                    Welcome to PlatePerfect! To get started, we'd love to get to know you better.
                </Text>
                <Text style={style.subtitle}>Please fill in the informations below</Text>

                {fields.map((field) => {
                    return profileDataComponent(field, getSetter(field), getGetter(field), style);
                })}
                <Button
                    mode="contained"
                    style={{ marginTop: 10, backgroundColor: "#ecca9c" }}
                    labelStyle={{ color: "black" }}
                    onPress={handleSaveProfile}
                >
                    Save Profile
                </Button>
                <View
                    style={{ flex: 1, flexDirection: "row", alignItems: "center", marginVertical: 30 }}
                >
                    <View style={{ flex: 1, backgroundColor: "black", height: 0.5 }}></View>
                    <Text style={{ textAlign: "center", paddingHorizontal: 15 }}>Or</Text>
                    <View style={{ flex: 1, backgroundColor: "black", height: 0.5 }}></View>
                </View>
                <Button
                    mode="contained"
                    onPress={handleLogout}
                    style={{ backgroundColor: "#ecca9c" }}
                    labelStyle={{ color: "black" }}
                >
                    Back to Login Screen
                </Button>
            </ScrollView>
        </View>
    );
}

function profileDataComponent(title: string, updateState: any, currData: any, styles: any) {
    const [data, setData] = useState<string | Date | string[]>(currData);
    let finalTitle = "";
    let isArray = false;
    if (title == "Allergies" || title == "Medical Records") {
        finalTitle = title;
        isArray = true;
    } else if (title === "Date of Birth") {
        finalTitle = title + " * (YYYY-MM-DD)";
    } else {
        finalTitle = title + " *";
    }
    const updateData = (data: string | Date) => {
        if (typeof data === "string" && isArray) {
            const arr = data.split(";");
            const newData = arr;
            setData(newData);
            updateState(newData);
        } else {
            setData(data);
            updateState(data);
        }
    };

    if (isArray) {
        const toShow = data as string[];
        return (
            <View>
                <Text style={styles.explanation}>
                    Fill with ; as separator. Ex: allergy A; allergy B; sickness A; ...
                </Text>
                <TextInput
                    label={finalTitle}
                    mode="outlined"
                    value={toShow.join(";")}
                    onChangeText={updateData}
                    style={styles.textInput}
                />
            </View>
        );
    } else {
        const finalData = data as string;
        return (
            <View>
                <TextInput
                    label={finalTitle}
                    mode="outlined"
                    value={finalData}
                    onChangeText={updateData}
                    style={styles.textInput}
                />
            </View>
        );
    }
}

const styleProfileCompletion = (insets: EdgeInsets) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "flex-start",
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
        explanation: {
            marginBottom: 5,
            color: "gray",
            opacity: 0.8,
        },
    });

export default ProfileCompletion;
