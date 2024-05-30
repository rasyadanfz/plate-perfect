import { Slot, Stack } from "expo-router";
import AuthProvider from "./context/AuthProvider";
import { PaperProvider } from "react-native-paper";

export default function AppLayout() {
    return (
        <PaperProvider>
            <AuthProvider>
                <Slot />
            </AuthProvider>
        </PaperProvider>
    );
}
