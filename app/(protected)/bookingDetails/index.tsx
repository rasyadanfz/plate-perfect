import React, { Fragment } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthProvider";
import { Professional } from "../../../types/dbTypes";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import ProfessionalCard2 from "../../globals/components/ProfessionalCard2";

export default function bookingDetails(){
  
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
        bookConsult:{
            fontSize:18,
        },
        userName:{
            fontSize:22,
            fontWeight:"bold",
            marginVertical:5
        }
    });

    const {user, role} = useAuth();
    
    
    if(!tempProfessional){
        return (<View>
          <Text>Loading</Text>
        </View>
        )
      }
    return (

        <View style={style.container}>
            <View>
                <Text style={style.bookConsult}>
                    Book Consultation For
                </Text>
                <Text style={style.userName}>
                    {user?.name}
                </Text>
                <ProfessionalCard2 {...tempProfessional}/>
            </View>
        </View>
    )   
}