import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, HelperText, TextInput, Title } from "react-native-paper";
import { useAuth } from "../../context/AuthProvider";
import { AuthError } from "@supabase/supabase-js";
import { Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const styles = StyleSheet.create({
    formContainer: {
        height: "100%",
        width: "100%",
        gap: 1,
        paddingTop: 5,
        backgroundColor: "#b5b5b5",
    },
    helperTextContainer: {},
    imageContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#404c4c",
    },
});

const appIcon = require("../../../assets/adaptive_icon.png");
export default function SignUp() {
    const insets = useSafeAreaInsets();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<{
        email: string;
        password: string;
        confirmPassword: string;
    }>({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const { signUp } = useAuth();
    const handleSignIn = async () => {
        // Validate All Inputs
        let newErrors = {
            email: "",
            password: "",
            confirmPassword: "",
        };
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!email.includes("@")) {
            newErrors.email = "Email is invalid";
        }

        if (!password) {
            newErrors.password = "Password is required";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Password confirmation is required";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.values(newErrors).some((error) => error !== "")) {
            setFormErrors(newErrors);
        } else {
            try {
                const user = await signUp(email, password);
                if (user) {
                    router.replace("/home");
                }
            } catch (error) {
                const errorItem = error as AuthError;
                Alert.alert("Error", errorItem.message);
            }
        }
    };

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }}
        >
            <View id="logo" style={styles.imageContainer}>
                <Image source={appIcon} alt="App Logo" style={{ width: 150, height: 150 }} />
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>Plate Perfect</Text>
            </View>
            <View style={styles.formContainer}>
                <Title style={{ marginVertical: 20, textAlign: "center", fontWeight: "bold" }}>
                    Create your Account
                </Title>
                <View style={{ marginHorizontal: "10%" }}>
                    <TextInput
                        label="Email"
                        left={<TextInput.Icon icon="email" />}
                        value={email}
                        mode="outlined"
                        onChangeText={(email) => {
                            setEmail(email);
                            setFormErrors((formErrors) => ({ ...formErrors, email: "" }));
                        }}
                    />
                    <HelperText
                        type="error"
                        visible={formErrors.email !== ""}
                        style={styles.helperTextContainer}
                    >
                        {formErrors.email}
                    </HelperText>
                    <TextInput
                        label="Password"
                        left={<TextInput.Icon icon="lock" />}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                        secureTextEntry={!showPassword}
                        mode="outlined"
                        onChangeText={(password) => {
                            setPassword(password);
                            setFormErrors((formErrors) => ({ ...formErrors, password: "" }));
                        }}
                    />
                    <HelperText
                        type="error"
                        visible={formErrors.password !== ""}
                        style={styles.helperTextContainer}
                    >
                        {formErrors.password}
                    </HelperText>
                    <TextInput
                        label="Confirm Password"
                        left={<TextInput.Icon icon="lock" />}
                        right={
                            <TextInput.Icon
                                icon={showConfirmPassword ? "eye-off" : "eye"}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        }
                        secureTextEntry={!showConfirmPassword}
                        mode="outlined"
                        onChangeText={(confirmPassword) => {
                            setConfirmPassword(confirmPassword);
                            setFormErrors((formErrors) => ({ ...formErrors, confirmPassword: "" }));
                        }}
                    />
                    <HelperText
                        type="error"
                        visible={formErrors.confirmPassword !== ""}
                        style={styles.helperTextContainer}
                    >
                        {formErrors.confirmPassword}
                    </HelperText>
                    <Button mode="contained" onPress={handleSignIn}>
                        Sign Up
                    </Button>

                    <Link href="/signIn" style={{ marginTop: 10, textDecorationLine: "underline" }}>
                        Already have an account?
                    </Link>
                </View>
            </View>
        </View>
    );
}
