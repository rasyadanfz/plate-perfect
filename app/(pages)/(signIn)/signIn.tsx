import { View, Text } from "react-native";
import { Link } from "expo-router";
import globalStyles from "../../globals/styles/globalStyles";

export default function SignInPage() {
    const styles = globalStyles;
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.h1}>Sign In Here!</Text>
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
