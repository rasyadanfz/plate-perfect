import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Consultation, Professional } from "../../../types/dbTypes";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { BACKEND_URL } from "@env";

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f6ae0a",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: "flex-start",
    },
    desc: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        flex: 1,
        alignContent: "flex-start",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 70,
        marginTop: 20,
    },
    buttonText: {
        color: "black",
        fontSize: 10,
        lineHeight: 10,
    },
});

export default function HistoryCard({
    role,
    type,
    booking_id,
}: {
    role: string;
    type: string;
    booking_id: string;
}) {
    if (role.toLowerCase() === "user") {
        const { accessToken } = useAuth();
        const [profData, setProfData] = useState<Professional>();
        const [consultationData, setConsultationData] = useState<Consultation>();
        const [isLoading, setIsLoading] = useState(true);
        const [trig,setTrig] = useState(0)
        useEffect(() => {


            const allinOneFunction = async()=>{
                setIsLoading(true)
                try {
                    const response = await axios({
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        url: `${BACKEND_URL}/api/consultation/getConsultationWithBookingId/${booking_id}`,
                    });

                    if(response.data.data){
                        setConsultationData(response.data.data)
                    }else{
                        console.log("THERE IS NO CONSULTATION DATA")
                        return;
                    }
                    
                } catch (error) {
                    console.log("GetConsultationWithBookingID");
                    console.log(error);
                }

                try {
                    setIsLoading(true)
                    const response = await axios({
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        url: `${BACKEND_URL}/api/professional/getProfId/${consultationData?.professional_id}`,
                    });

                    if(response){
                        setProfData(response.data.data)
                    }else{
                        console.log("THERE IS NO PROF DATA")
                    }
                
                } catch (error) {
                    console.log("getProfId");
                    console.log(error);
                }finally{
                    setIsLoading(false)
                }
            }

            allinOneFunction()
        },[trig]);


        if(isLoading === false){

            const date = new Date(consultationData.date);
            
            return (
                <View style={style.container}>
                    <View style={style.desc}>
                        <View style={style.title}>
                            <Text style={{ fontSize: 14 }}>Konsultasi {type}</Text>
                            <Text style={{ fontSize: 11 }}>{profData!.name}</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 13 }}>{date.toDateString()}</Text>
                        </View>
                    </View>
                    <View style={style.buttonContainer}>
                        <Button
                            mode="contained"
                            style={{ flex: 1, backgroundColor: "#ecca9c" }}
                            labelStyle={style.buttonText}
                        >
                            Summary &gt;
                        </Button>
                        <Button
                            mode="contained"
                            style={{ flex: 1, backgroundColor: "#ecca9c" }}
                            labelStyle={style.buttonText}
                        >
                            Chat History &gt;
                        </Button>
                    </View>
                </View>
            );
        }else{
        
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 18 }}>Please wait...</Text>
                </View>
            );
        }
    } else {
        return (
            <View style={style.container}>
                <View style={style.desc}>
                    <View style={style.title}>
                        <Text style={{ fontSize: 14 }}>Konsultasi Masakan</Text>
                        <Text style={{ fontSize: 11 }}>Client: Hugo Benedicto</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 13 }}>2022-01-01</Text>
                    </View>
                </View>
                <View style={style.buttonContainer}>
                    <Button
                        mode="contained"
                        style={{ flex: 1, backgroundColor: "#ecca9c" }}
                        labelStyle={style.buttonText}
                    >
                        Summary &gt;
                    </Button>
                    <Button
                        mode="contained"
                        style={{ flex: 1, backgroundColor: "#ecca9c" }}
                        labelStyle={style.buttonText}
                    >
                        Chat History &gt;
                    </Button>
                </View>
            </View>
        );
    }
}
