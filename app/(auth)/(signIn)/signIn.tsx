import { View, Text, Image, StyleSheet, Alert } from "react-native";
import { Link, Redirect, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Title, HelperText, TextInput, Button } from "react-native-paper";
import appIcon from "../../../assets/adaptive_icon.png";
import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { AuthError } from "@supabase/supabase-js";

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

export default function SignInPage() {
    const insets = useSafeAreaInsets();
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
        return <Redirect href="/home" />;
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<{
        email: string;
        password: string;
    }>({
        email: "",
        password: "",
    });

    const bypassSignIn1 = async () => {
        const user = await signIn("faza1234@gmail.com", "faza1234", false);
        if (user) {
            router.replace("/home");
        }
    };
    const bypassSignIn2 = async () => {
        const user = await signIn("professionalDev@gmail.com", "professional1234", false);
        if (user) {
            router.replace("/home");
        }
    };

    const { signIn } = useAuth();
    const handleSignIn = async () => {
        let newErrors = {
            email: "",
            password: "",
        };
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!email.includes("@")) {
            newErrors.email = "Email is invalid";
        }

        if (!password) {
            newErrors.password = "Password is required";
        }

        if (Object.values(newErrors).some((error) => error !== "")) {
            setFormErrors(newErrors);
        } else {
            try {
                const user = await signIn(email, password, false);
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
                    Login to your Account
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
                    <Button mode="contained" onPress={handleSignIn}>
                        Sign In
                    </Button>

                    <Link
                        href="/signUp"
                        style={{
                            marginTop: 15,
                            marginBottom: 50,
                            textDecorationLine: "underline",
                            textAlign: "center",
                        }}
                    >
                        Don't have an account?
                    </Link>
                    <Button mode="contained" onPress={bypassSignIn1}>
                        Bypass User
                    </Button>
                    <Button mode="contained" onPress={bypassSignIn2} style={{ marginTop: 10 }}>
                        Bypass Professional
                    </Button>
                </View>
            </View>
        </View>
    );
}
