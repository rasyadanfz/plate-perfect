import { Redirect, Stack, useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthProvider";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Text } from "react-native-paper";

export default function ProfileLayout() {
    const { user, role } = useAuth();
    const router = useRouter();

    return (
        <Stack screenOptions={{ headerStyle: { backgroundColor: "#404c4c" }, headerTintColor: "white" }}>
            <Stack.Screen name="index" options={{ headerTitle: "Profile" }} />
            <Stack.Screen
                name="edit"
                options={{
                    headerTitle: "Edit Profile",
                    headerBackVisible: true,
                }}
            />
        </Stack>
    );
}
