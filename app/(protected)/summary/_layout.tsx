import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthProvider";
import { useEffect } from "react";
import { Professional, User } from "../../../types/dbTypes";
import React from "react";

export default function StackLayout() {
    const { user, role } = useAuth();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: "Summary",
                    headerStyle: { backgroundColor: "#404c4c" },
                    headerTintColor: "white",
                }}
            />
            <Stack.Screen
                name="createSummary/[consultation_id]"
                options={{
                    headerTitle: "Create Summary",
                    headerStyle: { backgroundColor: "#404c4c" },
                    headerTintColor: "white",
                }}
            />
        </Stack>
    );
}
