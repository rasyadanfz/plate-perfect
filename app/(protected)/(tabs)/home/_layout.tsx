import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../../context/AuthProvider";
import { useEffect } from "react";
import { Professional, User } from "../../../../types/dbTypes";

export default function StackLayout() {
    const { user, role } = useAuth();

    if (role === "PROFESSIONAL") {
        const professionalUser = user as Professional;
        if (!professionalUser.hasCompletedData) {
            return <Redirect href="/profileCompletionProfessional" />;
        }
    } else {
        const normalUser = user as User;
        if (!normalUser.hasCompletedData) {
            return <Redirect href="/profileCompletionUser" />;
        }
    }

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerTitle: "Home" }} />
        </Stack>
    );
}
