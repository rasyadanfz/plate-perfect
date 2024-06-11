import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Booking, Consultation, Professional } from "../../../../types/dbTypes";
import { BACKEND_URL } from "@env";
import axios, { all, AxiosResponse } from "axios";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native";
import HistoryCard from "../../../globals/components/HistoryCard";
import { useAuth } from "../../../context/AuthProvider";

const style = StyleSheet.create({
    listItemContainer:{
        marginVertical:10,
        marginHorizontal:15,
    },allContainer:{
        marginVertical:18,
    }
})

const consultationHist = () => {
    const {role} = useAuth();

    if(role === "USER"){
    // fetch all booking first
    const [allBookingDone, setAllBookingDone] = useState<Booking[]>([]);

    const {accessToken} = useAuth();
    useEffect(()=>{
        const fetchBooking = async()=>{
            try{
                const response  = await axios({
                    method:"GET",
                    url:`${BACKEND_URL}/api/booking/finishedBooking`,
                    headers:{
                        Authorization: `Bearer ${accessToken}`
                    }
                })

                if(response){
                    setAllBookingDone(response.data.data);
                }else{
                    console.log("Booking list empty")
                }
            }catch(err){
                console.log("Fetch All Done Booking Eroor")
                console.log(err)
            }
        }

        fetchBooking();
    },[])
    

    // need role, type, and booking_id
    return (
        <View style={style.allContainer}>
            <FlatList 
                data={allBookingDone}
                keyExtractor={(item)=> item.booking_id}
                renderItem={
                    ({item}) => (
                        <View style={style.listItemContainer}>
                            <HistoryCard 
                                role={role}
                                type={item.type}
                                booking_id={item.booking_id}
                            />
                        </View>
                    )
                }
            />
        </View>
    );
    }else{
        const {user,accessToken} = useAuth();
        const userData = user as Professional;
        const [consultationList, setConsultationList] = useState<Consultation[]>();
        const [bookingList, setBookingList] = useState<Booking[]>();
        const [bookingIdSet, setBookingIdSet] = useState<Set<string>>(new Set());
        const [isLoading, setIsLoading] = useState<boolean>(true);
        const [isUpdate, setIsUpdate] = useState<boolean>(true);

        const fetchConsultationList = async () => {
            try {
                const response = await axios({
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    url: `${BACKEND_URL}/api/consultation/professionalConsultationList`,
                });

                const consultationData: Consultation[] = response.data.data;
                return consultationData;
            } catch (error) {
                console.log("consultationList");
                console.log(error);
            }
        };

        const fetchBookingsWithId = async (consultList: Consultation[]) => {
            if (!consultList || !consultList.length) return;
            try {
                // Paid bookings
                const promises = consultList.map((consult) => {
                    return axios({
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        url: `${BACKEND_URL}/api/booking/${consult.booking_id}`,
                    });
                });

                const responses = await Promise.all(promises);
                const bookingList: Booking[] = responses.map((response) => response.data.data);
                setBookingList(bookingList);
                return bookingList;
            } catch (error) {
                console.log("bookingList");
                console.log(error);
            }
        };

        const getData = async () => {
            const list = await fetchConsultationList();
            console.log(list);
            const bookingList = await fetchBookingsWithId(list!);
            const processData = async (bookingList: Booking[]) => {
                if (!bookingList) return;
                const tempSet = new Set<string>();
                bookingList?.forEach((booking) => {
                    if (booking.status === "DONE") {
                        tempSet.add(booking.booking_id);
                    }
                });
                setBookingIdSet(tempSet);
                if (tempSet.size === 0) {
                    return;
                }
                const finalList = list!.filter((consult) => tempSet.has(consult.booking_id)).slice(0, 3);
                const finalBookingList = bookingList!.filter((booking) =>
                    tempSet.has(booking.booking_id)
                );
                setConsultationList(finalList);
                setBookingList(finalBookingList);
            };
            if (!bookingList) return;
            await processData(bookingList);
        };

        useEffect(() => {
            getData();
            setIsLoading(false);
        }, []);

      

        if (isLoading || consultationList === undefined){
            return<View>
                <Text>Please wait</Text>
            </View>
        } else {
            return (
                <ScrollView  contentContainerStyle={{gap:10, marginHorizontal:25, marginTop:15}}>

                     {consultationList!.map((consultation,index) => (
                                    <HistoryCard
                                        role="PROFESSIONAL"
                                        key={index}
                                        type={
                                            bookingList!.filter(
                                                (booking) =>
                                                    booking.booking_id === consultation!.booking_id
                                            )[0].type
                                        }
                                        booking_id={consultation.booking_id}
                                        user_id={
                                            bookingList!.filter(
                                                (booking) =>
                                                    booking.booking_id === consultation.booking_id
                                            )[0].customer_id
                                        }
                                        consultation={consultation}
                                    />
                                )
                            )
                        }
                </ScrollView>
            );
        }

    }
};

export default consultationHist;
