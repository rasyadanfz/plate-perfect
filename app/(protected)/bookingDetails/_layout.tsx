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
                    headerTitle: "Booking Details",
                    headerStyle: { backgroundColor: "#E8EFCF", },
                    headerTintColor: "black",
                }}
            />
        </Stack>
    );
}
