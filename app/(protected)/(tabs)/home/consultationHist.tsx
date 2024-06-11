import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Booking, Consultation, Professional } from "../../../../types/dbTypes";
import { BACKEND_URL } from "@env";
import axios, { all } from "axios";
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

        const [allConsultation, setAllConsultation] = useState<Consultation[]>([]);

        const temp = useAuth();
        const prof = temp.user as Professional
        const {accessToken} = useAuth();
        const [allBooking, setAllBooking] = useState<Booking[]>([])
        const [newAllConsul, setnewallconsul]  = useState<Consultation[]>([]);
        useEffect(()=>{
            const fetchConsultation = async()=>{
                try{
                    const response  = await axios({
                        method:"GET",
                        url:`${BACKEND_URL}/api/consultation/getAllConsultationWithProfId/${prof.professional_id}`,
                        headers:{
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
    
                    console.log("RESPONSEEE",response.data.data)
                    if(response){
                        setAllConsultation(response.data.data);
                        const ret:Consultation[] = response.data.data
                        return ret;
                    }else{
                        
                        console.log("Consultation list empty")
                    }
                }catch(err){
                    console.log("Fetch All Consultation  Eroor")
                    console.log(err)
                }
            }
    
            const temp = fetchConsultation();
            
            temp.then(async (allConsul)=>{
                for(let i = 0;i < allConsul!.length;i++){
                    try{
                        const res = await axios({
                            method:"GET",
                            headers:{
                                Authorization:`Bearer ${accessToken}`
                            },
                            url:`${BACKEND_URL}/api/booking/${allConsul![i].booking_id}`
                        })
                        
                        
                        console.log(res.data,"ASD")
                        if(res.data.data.status === "DONE"){
                            setnewallconsul(
                                ()=>{
                                    return [...newAllConsul,allConsul![i]]
                                }
                            )
                            setAllBooking(
                                ()=>{
                                    return  [...allBooking,res.data.data]
                                }
                            );

                            
                        }

                    }catch(err){
                        console.log(err)
                    }
                }
            }).catch
            


        },[])


        return (
            <View style={style.allContainer}>
                <FlatList 
                    data={allBooking}
                    keyExtractor={(item)=> item.booking_id}
                    renderItem={
                        ({item,index}) => (
                            <View style={style.listItemContainer}>
                                <HistoryCard
                                        role="PROFESSIONAL"
                                        type={item.type}
                                        booking_id={item.booking_id}
                                        consultation={newAllConsul[index]}
                                    />
                            </View>
                        )
                    }
                />
            </View>
        );

    }
};

export default consultationHist;
