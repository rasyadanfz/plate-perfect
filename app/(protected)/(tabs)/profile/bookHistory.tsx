import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Booking } from "../../../../types/dbTypes";
import { useAuth } from "../../../context/AuthProvider";
import { BACKEND_URL } from "@env";
import axios from "axios";
import BookingHistCard from "../../../globals/components/BookingHistCard";

const BookHistory = () => {
    const { user, role, accessToken } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        // Fetch all bookings
        const fetchBookings = async () => {
            try {
                const response = await axios(`${BACKEND_URL}/api/booking`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log(response.data.data);
                const data: Booking[] = await response.data.data;
                data.sort(
                    (a, b) => new Date(b.booking_time).getTime() - new Date(a.booking_time).getTime()
                );
                setBookings(data);
            } catch (err) {
                console.log("Fetch Bookings");
                console.log(err);
            }
        };

        fetchBookings();
    }, []);
    return (
        <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", marginTop: 20 }}>
            {bookings.map((booking) => (
                <BookingHistCard key={booking.booking_id} booking={booking} />
            ))}
        </View>
    );
};

export default BookHistory;
