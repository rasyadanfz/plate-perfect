import { Pressable, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../../../context/AuthProvider";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Tab() {
    const { signOut, role } = useAuth();
    const insets = useSafeAreaInsets();
    const handleLogout = async () => {
        const logout = await signOut();
        if (logout) {
            router.replace("/signIn");
        }
    };

    const handleEditProfile = () => {
        router.push("/profile/edit");
    };

    interface ProfileButtonProps {
        onPress: () => void | Promise<void>;
        text: string;
    }

    const ProfileButton = ({ onPress, text }: ProfileButtonProps) => {
        return (
            <Pressable onPress={onPress}>
                <View
                    style={{
                        backgroundColor: "orange",
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderRadius: 15,
                    }}
                >
                    <Text style={{ fontSize: 16 }}>{text}</Text>
                    <Text style={{ fontSize: 16 }}>&gt;</Text>
                </View>
            </Pressable>
        );
    };

    const ProfessionalProfile = () => {
        return (
            <View style={{ flex: 1, marginTop: insets.top - 10, paddingHorizontal: 15 }}>
                <View></View>
                <View></View>
                <View></View>
                <View style={{ gap: 20 }}>
                    <ProfileButton onPress={handleEditProfile} text="Edit Profile" />
                    <ProfileButton onPress={handleLogout} text="Logout" />
                </View>
            </View>
        );
    };

    const UserProfile = () => {
        return (
            <View style={{ flex: 1, marginTop: insets.top - 10, paddingHorizontal: 15 }}>
                <Text>Profile</Text>
                <Button mode="contained" onPress={handleLogout}>
                    Logout
                </Button>
            </View>
        );
    };

    if (role === "PROFESSIONAL") {
        return <ProfessionalProfile />;
    } else {
        return <UserProfile />;
    }
}
