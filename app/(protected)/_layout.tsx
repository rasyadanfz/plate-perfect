import { Redirect, Stack, router } from "expo-router";
import { useAuth } from "../context/AuthProvider";
import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import React from "react";

export default function ProtectedLayout() {
    const { signOut, fetchUserData, isAuthenticated, user, accessToken } = useAuth();

    useEffect(() => {
        const getUserData = async () => {
            if (isAuthenticated) {
                await fetchUserData();
            }
        };

        getUserData();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Redirect href="/signIn" />;
    }

    if (!user) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#eda80c",
                }}
            >
                <Text style={{ fontSize: 20 }}>Loading...</Text>
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}
