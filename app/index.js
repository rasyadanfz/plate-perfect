/* Component imports */
import { View, Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";

/* Style imports */
import globalStyles from "./globals/styles/globalStyles";
import { useAuth } from "./context/AuthProvider";
import { Link, Redirect } from "expo-router";

export default function Index() {
    const { user } = useAuth();

    if (user) {
        return <Redirect href="/home" />;
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.h1}>Welcome</Text>
            <View style={{ gap: 10, marginTop: 10 }}>
                <Link href="/signIn" asChild>
                    <TouchableOpacity>
                        <Button mode="contained">Sign in</Button>
                    </TouchableOpacity>
                </Link>
                <Link href="/signUp" asChild>
                    <TouchableOpacity>
                        <Button mode="contained">Sign up</Button>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
