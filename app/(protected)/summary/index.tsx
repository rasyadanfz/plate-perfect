import { View, Text, ScrollView, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Consultation, Professional, Summary } from "../../../types/dbTypes";
import axios from "axios";
import { BACKEND_URL } from "@env";
import { useAuth } from "../../context/AuthProvider";

const windowWidth = Dimensions.get('window').width;


const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#F2F2F2', // Light background
    },  scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
      },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333', // Dark title color
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 16,
      color: '#666', // Muted subtitle color
    },
    summary: {
      marginBottom: 20,
    },
    summaryText: {
      fontSize: 16,
      lineHeight: 24,
    },
    tipsSection: {
      flexDirection: 'column',
      gap: 10, // Vertical spacing between tips
      width: windowWidth - 40, // Adjust for container padding
    },
    tip: {
      backgroundColor: '#FFF', // White background for tips
      padding: 15,
      borderRadius: 8,
      shadowColor: '#000', // Subtle shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2, 
    },
    tipText: {
      fontSize: 15,
      lineHeight: 22,
    },
    footer: {
      marginTop: 20,
      alignItems: 'center',
    },
  });

export const SummaryPage = () => {
  
  const fetchParams = useLocalSearchParams();
    
  const {consultation_id} = fetchParams;

  const [theSummary,setSummary] = useState<Summary>();
  const [professional,setProfessional] = useState<Professional>();
  const [consultation,setConsultation] = useState<Consultation>();
  const {accessToken} = useAuth()
  const [iteration,setIteraation] = useState(0)

  
  useEffect(()=>{

      const fetchSummary = async() =>{
          try{
              const response = await axios({
                  method:"GET",
                  url:`${BACKEND_URL}/api/summary/${consultation_id}`,
                  headers:{
                      Authorization:`Bearer ${accessToken}`
                  }
              })
              setSummary(response.data.data)
          }catch(err){
              console.log("Fetch summary error")
              console.log(err)
          }
      }

      const fetchConsultation = async() =>{
        try{
          const response = await axios({
            method:"GET",
            url:`${BACKEND_URL}/api/consultation/getConsultationWithConsultationId/${consultation_id}`,
            headers:{
              Authorization: `Bearer ${accessToken}`,
            }
          })

          setConsultation(response.data.data)
        }catch(err){
          console.log("Fetch Cnsultation error")
          console.log(err)
        }
      }


      const fetchProfessional = async() =>{
        try{
          const response = await axios({
            method:"GET",
            url:`${BACKEND_URL}/api/professional/getProfId/${consultation!.professional_id}`,
            headers:{
              Authorization :`Bearer ${accessToken}`,
            }
          })
        

          
          setProfessional(response.data.data)
        }catch(err){
          console.log("Fetch Professional error")
          console.log(err)
        }
      }

      fetchSummary();
      fetchConsultation();
      fetchProfessional();
      if(iteration < 12){
          setIteraation(iteration+1)
      }
  },[consultation,professional])

  if(!consultation || !professional){
      return (
        <View>
          <Text>
              Loading...
          </Text>
        </View>
      )

  }

  const date = new Date(consultation.start_time)
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }); // Tuesday
  const dayOfMonth = date.getDate(); // 11
  const month = date.toLocaleString('en-US', { month: 'short' }); // Jun
  const year = date.getFullYear(); // 2024

const startDate =new Date(consultation.start_time);
const endDate = new Date(consultation.end_time);
const startHourMinute = `${startDate.getUTCHours().toString().padStart(2, '0')}:${startDate.getUTCMinutes().toString().padStart(2, '0')}`;
const endHourMinute = `${endDate.getUTCHours().toString().padStart(2, '0')}:${endDate.getUTCMinutes().toString().padStart(2, '0')}`;

const capitalizedStr = professional.role.charAt(0).toUpperCase() + professional.role.slice(1).toLowerCase();
  // Format the string
  const formattedString = `${dayOfWeek}, ${dayOfMonth} ${month} ${year} `; // Trailing space
    return (

        <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{formattedString}</Text>
            <Text style={styles.subtitle}>{capitalizedStr} - {professional.name} - ({startHourMinute} - {endHourMinute})</Text>
          </View>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
                {theSummary?.content}
            </Text>
          </View>
  
        </ScrollView>
      </SafeAreaView>

    );
};

export default SummaryPage;
