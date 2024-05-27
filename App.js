import { StatusBar, StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";

export default function App() {
    return (
        <PaperProvider>
            <App />
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: "5%",
    },
});
