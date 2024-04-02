import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Index() {
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
                Hello World! React Router
            </Text>
            <Link
                href="/signIn"
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginTop: 20,
                    textDecorationLine: "underline",
                }}
            >
                Sign In Now
            </Link>
        </View>
    );
}
