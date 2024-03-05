import { StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";

export default function App() {
    const TabNav = createBottomTabNavigator();
    return (
        <NavigationContainer>
            <StatusBar style="auto" />
            <TabNav.Navigator>
                <TabNav.Screen name="Home" component={HomeScreen} />
            </TabNav.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: "5%",
    },
});
