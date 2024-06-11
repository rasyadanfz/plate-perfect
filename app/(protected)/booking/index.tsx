import React, { Fragment } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import ProfessionalCard2 from "../../globals/components/ProfessionalCard2";
import { Professional, ProfessionalRole } from "../../../types/dbTypes";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { BACKEND_URL } from "@env";
import { Text } from "react-native-paper";
import { IAppointment, IAvailableDates, TimeSlotPicker } from "@dgreasi/react-native-time-slot-picker";
import { useState, useEffect } from "react";
import ContinueButton from "../../globals/components/ContinueButton";
import { useAuth } from "../../context/AuthProvider";
import moment from "moment";

function generateTimeSlots(startTime: string, endTime: string, slotDurationMinutes: number): string[] {
    const start = moment(startTime, "HH:mm");
    const end = moment(endTime, "HH:mm");
    const slots: string[] = [];

    while (start.isSameOrBefore(end)) {
        const slotEndTime = start.clone().add(slotDurationMinutes, "minutes");
        slots.push(`${start.format("HH:mm")} - ${slotEndTime.format("HH:mm")}`);

        // Move to the next full hour for the start of the next slot
        start.add(1, "hour").startOf("hour"); // Start next slot at the top of the hour
    }

    return slots;
}

function parseTime(time: string) {
    const [start, end] = time.split(" - ");

    // Extract hours (assuming 24-hour format)
    const startHour = parseInt(start.split(":")[0], 10);
    const endHour = parseInt(end.split(":")[0], 10);

    return {
        start: startHour,
        end: endHour,
    };
}

export default function Booking() {
    const { accessToken } = useAuth();
    const [tempProfessional, setTempProfessional] = React.useState<Professional>();
    const fetchProfessional = useLocalSearchParams();
    useEffect(() => {
        const { professional } = fetchProfessional;
        let deserializedProfessional: Professional;
        if (professional) {
            deserializedProfessional = JSON.parse(professional as string);
            setTempProfessional(deserializedProfessional);
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
        title: {
            fontSize: 22,
            fontWeight: "bold",
        },
        sectionContainer: {
            flex: 1,
            marginBottom: 25,
        },
        section: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
        },
        sectionItem: {
            flex: 1,
            marginBottom: 10,
            fontSize: 13,
        },
        subtitle: {
            fontSize: 17,
            fontWeight: "bold",
            marginBottom: 5,
        },
        timeSlotContainer: {
            marginVertical: 20,
        },
    });

    const [availableDates, setAvailableDates] = useState<IAvailableDates[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [dateOfAppointment, setDateOfAppointment] = useState<IAppointment | null>(null);

    useEffect(() => {
        const today = moment().startOf("day");
        const nextWeek = today.clone().add(6, "days");

        const dates: IAvailableDates[] = [];
        while (today.isSameOrBefore(nextWeek)) {
            dates.push({
                date: today.format("YYYY-MM-DD"),
                slotTimes: generateTimeSlots("08:00", "16:45", 45),
            });
            today.add(1, "day");

            for (let i = 0; i < dates.length; i++) {
                if (dates[i].slotTimes.length != 0) {
                    const newAppointmenDate: IAppointment = {
                        appointmentDate: dates[i].date,
                        appointmentTime: dates[i].slotTimes[0],
                    };
                    setDateOfAppointment(newAppointmenDate);
                    break;
                }
            }
        }
        const filteredAppointmentDate: IAvailableDates[] = [];
        (async () => {
            try {
                const res = await axios({
                    method: "POST",
                    url: `${BACKEND_URL}/api/consultation/takeAllConsultation`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    data: {
                        professional_id: tempProfessional?.professional_id,
                    },
                });

                const { data } = res.data;
                // filter

                for (let i = 0; i < dates.length; i++) {
                    filteredAppointmentDate.push({
                        date: dates[i].date,
                        slotTimes: [],
                    });

                    for (let j = 0; j < dates[i].slotTimes.length; j++) {
                        let exist = false;

                        for (let k = 0; k < data.length; k++) {
                            const date1 = new Date(data[k].start_time);
                            const date2 = new Date(dates[i].date);

                            const startOfDay1 = new Date(
                                date1.getFullYear(),
                                date1.getMonth(),
                                date1.getDate()
                            );
                            const startOfDay2 = new Date(
                                date2.getFullYear(),
                                date2.getMonth(),
                                date2.getDate()
                            );

                            if (startOfDay1.getTime() == startOfDay2.getTime()) {
                                // check for the hour
                                const { start, end } = parseTime(dates[i].slotTimes[j]);

                                if (start == date1.getUTCHours()) {
                                    exist = true;
                                }
                            }
                        }
                        if (exist === false) {
                            filteredAppointmentDate[i].slotTimes.push(dates[i].slotTimes[j]);
                        }
                    }
                }
                setAvailableDates(filteredAppointmentDate);
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);

    if (!tempProfessional) {
        return (
            <View>
                <Text>Loading</Text>
            </View>
        );
    }
    return (
        <ScrollView style={style.container}>
            <ProfessionalCard2 {...tempProfessional} />
            <View style={style.timeSlotContainer}>
                <TimeSlotPicker
                    availableDates={availableDates}
                    setDateOfAppointment={setDateOfAppointment}
                    timeSlotsTitle="Select a time slot"
                    datePickerBackgroundColor="#e8efcf"
                    timeSlotsBackgroundColor="#e8efcf"
                    timeSlotWidth={150}
                />
            </View>
            <ContinueButton
                title="Continue"
                onPress={() => {
                    router.push({
                        pathname: "/bookingDetails",
                        params: {
                            professional: JSON.stringify(tempProfessional),
                            dateOfAppointment: JSON.stringify(dateOfAppointment),
                        },
                    });
                }}
            />
        </ScrollView>
    );
}
