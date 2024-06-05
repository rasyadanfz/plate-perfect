import React, { Fragment } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import ProfessionalCard2 from "../../globals/components/ProfessionalCard2";
import { Professional, ProfessionalRole } from "../../../types/dbTypes";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { BACKEND_URL } from "@env";
import { Text } from "react-native-paper";


  import {
    IAppointment,
    IAvailableDates,
    TimeSlotPicker,
  } from '@dgreasi/react-native-time-slot-picker';
  import { useState, useEffect } from "react";
import ContinueButton from "../../globals/components/ContinueButton";
import { Consumer } from "react-native-paper/lib/typescript/core/settings";
import { useAuth } from "../../context/AuthProvider";

  const availableDates: IAvailableDates[] = [  // CHANGE THIS
    {
      date: '2023-08-18T21:00:00.000Z',
      slotTimes: [], // No availability
    },
    {
      date: '2023-08-19T21:00:00.000Z',
      slotTimes: ['08:00-09:00', '09:00-10:00'],
    },
  ];    

  const tempoChef:Professional = {
    professional_id: "1",
    name: "Benedicttt",
    description: "A Chef",
    role: ProfessionalRole.CHEF,
    email: "testing1233@gmail.com",
    phone_num: "191919",
    balance: 123,
    experience: 123,
    consultations: [],
    chat_messages: [],
    summary: [],
    hasCompletedData: true
  }

function fetchAvailableDates() {
  availableDates.push(    {
    date: '2023-08-17T21:00:00.000Z', // new Date().toISOString()
    slotTimes: ['08:00-09:00', '09:00-10:00','10:00-11:00',
      '11:00-12:00','12:00-13:00','13:00-14:00',
      '14:00-15:00','15:00-16:00','16:00-17:00',
    ], // Array<string> of time slots
  })


  const allConsultationData = async () =>{
    try{
      const backendResponse =  await axios({
          method:"GET",
          headers:{
            Authorization:`Bearer ${useAuth().accessToken}`
          },
          url:`${BACKEND_URL}/api/consultation/allConsultation`,
          params:{
            ID : tempoChef.professional_id,
          }
      })
      return backendResponse.data;
    }catch(error){
      return error;
    }
  }

}



export default function Booking(){

  const [tempProfessional, setTempProfessional] = React.useState<Professional>();
  const fetchProfessional = useLocalSearchParams();
  useEffect(()=>{

    const {professional} = fetchProfessional;
    let deserializedProfessional:Professional;
    if(professional){
        deserializedProfessional = JSON.parse(professional as string);
        setTempProfessional(deserializedProfessional);
        console.log(deserializedProfessional)
    }
    
  },[])
  

  
  availableDates.length = 0;
  fetchAvailableDates();
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
        timeSlotContainer:{
          marginVertical:20,
        }
    });



    const [date, setDate] = React.useState(undefined);
    const [open, setOpen] = React.useState(false);
  
    const onDismissSingle = React.useCallback(() => {
      setOpen(false);
    }, [setOpen]);
  
    const onConfirmSingle = React.useCallback(
      (params:any) => {
        setOpen(false);
        setDate(params.date);
      },
      [setOpen, setDate]
    );

    const [dateOfAppointment, setDateOfAppointment] =
    useState<IAppointment | null>(null);

    useEffect(()=>{
      fetchAvailableDates();
    },[dateOfAppointment])

    if(!tempProfessional){
      return (<View>
        <Text>Loading</Text>
      </View>
      )
    }
    return (

        <ScrollView style={style.container}>
            <ProfessionalCard2 {...tempProfessional}/>
            {/*
                    <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                                    {date ? (date as Date).toDateString() : "Pick a date"} 
                    </Button>
                <DatePickerModal
                     locale="en"
                mode="single"
                visible={open}
                onDismiss={onDismissSingle}
                date={date}
                onConfirm={onConfirmSingle}
                
                />
              */}
              <View style={style.timeSlotContainer}>
            <TimeSlotPicker 
              availableDates={availableDates}
              setDateOfAppointment={setDateOfAppointment}
              timeSlotsTitle="Choose Your Appointment Time"
              
            />
            </View>
            <ContinueButton title="Continue" onPress={()=>{router.push({
              pathname:"/bookingDetails",
              params:{
                professional: JSON.stringify(tempProfessional),
                dateOfAppointment:  JSON.stringify(dateOfAppointment)
              },
              
            })}}/>

                

            
        </ScrollView>
    )   
}