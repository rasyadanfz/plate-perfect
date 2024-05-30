import { Tabs } from "expo-router";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useAuth } from "../../context/AuthProvider";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "black",
                tabBarStyle: { backgroundColor: "#dba979", height: 53, paddingBottom: 3 },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="home" color={color} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 size={24} name="user-circle" color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
