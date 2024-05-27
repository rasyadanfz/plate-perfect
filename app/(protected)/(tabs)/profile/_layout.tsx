import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../../context/AuthProvider";

export default function StackLayout() {
    const { user, role } = useAuth();

    return (
        <Stack>
            <Stack.Screen name="profileMain" options={{ headerTitle: "Profile" }} />
            <Stack.Screen name="edit" options={{ headerTitle: "Edit Profile" }} />
        </Stack>
    );
}
