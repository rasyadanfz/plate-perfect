import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Booking } from "../../../../types/dbTypes";
import { BACKEND_URL } from "@env";
import axios from "axios";
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
    
    const {role} = useAuth();
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
};

export default consultationHist;
