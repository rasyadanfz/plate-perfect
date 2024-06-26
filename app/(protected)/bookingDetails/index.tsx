import React, { Fragment } from "react";
import { View } from "react-native";
import { Divider, RadioButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthProvider";
import { Professional } from "../../../types/dbTypes";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import ProfessionalCard2 from "../../globals/components/ProfessionalCard2";
import { useState } from "react";
import { PaymentMethod } from "../../globals/components/PaymentMethod";
import ContinueButton from "../../globals/components/ContinueButton";
import { IAppointment } from "@dgreasi/react-native-time-slot-picker";
import axios from "axios";
import { BACKEND_URL } from "@env";

export default function bookingDetails() {
    const [tempProfessional, setTempProfessional] = React.useState<Professional>();
    const [slotAppointment, setSlotAppointment] = React.useState<IAppointment>();
    const fetchProfessional = useLocalSearchParams();
    useEffect(() => {
        const { professional } = fetchProfessional;
        let deserializedProfessional: Professional;
        if (professional) {
            deserializedProfessional = JSON.parse(professional as string);
            setTempProfessional(deserializedProfessional);
        }

        const { dateOfAppointment } = fetchProfessional;
        let deserializedDateOfAppointment;

        if (dateOfAppointment) {
            deserializedDateOfAppointment = JSON.parse(dateOfAppointment as string);
            setSlotAppointment(deserializedDateOfAppointment);
        }
    }, []);

    const safeInsets = useSafeAreaInsets();
    const style = StyleSheet.create({
        container: {
            paddingTop: safeInsets.top - 10,
            paddingLeft: safeInsets.left + 20,
            paddingRight: safeInsets.right + 20,
            paddingBottom: 30,
            backgroundColor: "#e8efcf",
            flex: 1,
            rowGap: 20,
        },
        bookConsult: {
            fontSize: 18,
        },
        userName: {
            fontSize: 22,
            fontWeight: "bold",
            marginVertical: 5,
            marginBottom: 10,
        },
        divider: {
            marginTop: 10,
            marginBottom: 8,
            borderStyle: "solid",
        },
        feeContainer: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
            marginTop: 10,
        },
        feeLeftContainer: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginLeft: 15,
        },
        feeText: {
            fontSize: 17,
            marginVertical: 5,
        },
        feeTobePaid: {
            fontSize: 17,
            fontWeight: "bold",
            marginVertical: 5,
        },
        paymentContainer: {
            marginTop: 20,
        },
        paymentText: {
            fontSize: 17,
            marginVertical: 5,
            fontWeight: "bold",
        },
    });

    const { user, role, accessToken } = useAuth();

    const [checked, setChecked] = useState("CASH");

    const createBooking = async () => {
        try {
            console.log("POST", slotAppointment);
            const res = await axios({
                method: "POST",
                url: `${BACKEND_URL}/api/booking/createBooking`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                data: {
                    professional_id: tempProfessional?.professional_id,
                    dateOfAppointment: slotAppointment,
                },
            });

            if (res.data.success) {
                // create the payment
                console.log("Booking created");

                const res2 = await axios({
                    method: "POST",
                    url: `${BACKEND_URL}/api/payment/createPayment`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    data: {
                        booking_id: res.data.query.booking_id,
                        method: checked,
                        amount:
                            (tempProfessional?.experience == undefined
                                ? 1
                                : tempProfessional?.experience) *
                                10000 +
                            3000,
                    },
                });

                if (res2.data.success) {
                    console.log("Payment created");
                } else {
                    console.log("Payment failed ");
                }
            } else {
                console.log("Booking failed");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleOnPress = async () => {
        try {
            await createBooking();
            router.navigate("home");
        } catch (err) {
            console.log(err);
        }
    };

    if (!tempProfessional) {
        return (
            <View>
                <Text>Loading</Text>
            </View>
        );
    }
    return (
        <View style={style.container}>
            <View>
                <Text style={style.bookConsult}>Book Consultation For</Text>
                <Text style={style.userName}>{user?.name}</Text>
                <ProfessionalCard2 {...tempProfessional} />
                <Divider style={style.divider} bold={true} theme={{ colors: { primary: "black" } }} />
                <View style={style.feeContainer}>
                    <View style={style.feeLeftContainer}>
                        <Text style={style.feeText}>Session Fee</Text>
                        <Text style={style.feeText}>Service Fee</Text>
                    </View>
                    <View>
                        <Text style={style.feeText}>Rp. {tempProfessional.experience * 10000}</Text>
                        <Text style={style.feeText}>Rp. 3000</Text>
                    </View>
                </View>
                <Divider style={style.divider} bold={true} theme={{ colors: { primary: "black" } }} />
                <View style={style.feeContainer}>
                    <View>
                        <Text style={style.feeTobePaid}>To be paid</Text>
                    </View>
                    <View>
                        <Text style={style.feeTobePaid}>
                            Rp. {tempProfessional.experience * 10000 + 3000}
                        </Text>
                    </View>
                </View>
                <View style={style.paymentContainer}>
                    <Text style={style.paymentText}>Choose Payment Method</Text>
                    <PaymentMethod setState={setChecked} state={checked} />
                </View>
                <ContinueButton title="Pay & Confirm" onPress={handleOnPress} />
            </View>
        </View>
    );
}
