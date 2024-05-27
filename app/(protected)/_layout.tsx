import { Redirect, Stack, router } from "expo-router";
import { useAuth } from "../context/AuthProvider";
import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

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
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}
