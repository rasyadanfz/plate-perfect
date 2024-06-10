import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react"
import axios from "axios";
import { useAuth } from "../../../context/AuthProvider";

import { Professional } from "../../../../types/dbTypes";
import { BACKEND_URL } from "@env";
import { List } from "react-native-paper";
import ProfessionalCard from "../../../globals/components/ProfessionalCard";


const style = StyleSheet.create({
    listItemContainer:{
        marginVertical:10,
        marginHorizontal:15,
    },allContainer:{
        marginVertical:18,
    }
})

const professionalList = () => {

    const [listProfessional,setListProfessional] = useState<Professional[]>([])
    const {user,accessToken} = useAuth();

    useEffect(()=>{
        const fetchProfessional = async() =>{
            try{
                const response = await axios({
                    method:"GET",
                    headers:{
                        Authorization: `Bearer ${accessToken}`
                    },
                    url:`${BACKEND_URL}/api/professional/getAllProfessional`
                })
                setListProfessional(response.data.data)
            }catch(err){
                console.log(err)
            }
        }


        fetchProfessional();
    },[])

    return (
        <View style={style.allContainer}>
            <FlatList 
                data={listProfessional}
                keyExtractor={(item)=> item.professional_id}
                renderItem={
                    ({item}) => (
                        <View style={style.listItemContainer}>
                            <ProfessionalCard {...item} />
                        </View>
                    )
                }
            />
        </View>
    );
};

export default professionalList;
