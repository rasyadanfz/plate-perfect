import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function SignInPage() {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Text
                style={{
                    fontSize: 30,
                    fontWeight: "bold",
                }}
            >
                Sign In Here!
            </Text>
            <Link
                href="/"
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginTop: 20,
                    textDecorationLine: "underline",
                }}
            >
                Go To Home Page
            </Link>
        </View>
    );
}
