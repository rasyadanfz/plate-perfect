import React, { Fragment } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthProvider";

export default function Booking(){
  
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
        }
    });

    const {user, role} = useAuth();
    
    return (

        <View style={style.container}>
            <View>
                <Text style={style.bookConsult}>
                    Book Consultation For
                </Text>
                <Text style={style.userName}>
                    {user?.name}
                </Text>
            </View>
        </View>
    )   
}