import { Image, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import React from "react";
import { Redirect, router } from "expo-router";
import Icon from 'react-native-vector-icons/Ionicons';
import { Professional } from "../../../types/dbTypes";

const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#f6ae0a",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal:30,
    },
    descContainer: {
        flex: 1,
        marginLeft: 15,
        alignSelf:"flex-start",
        flexDirection:"column",
        gap:10,
    },
    image: {
        width: 64,
        height: 80,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
    },
    desc: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        backgroundColor: "#ecca9c",
    },
    chipContainer : {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'white',
        borderRadius: 20,
        
    },
    chipText:{
        marginLeft: 5,
        fontWeight: 'bold',
        fontSize:10,
    },
    chipsContainer:{
        flexDirection: 'row',
        marginVertical:5,
        justifyContent: 'space-between',    
    }

});

export default function ProfessionalCard2(props: Professional ) {
    const { name } = props;
    return (
        <View style={style.container}>
            <View style={style.imageContainer}>
                <Image source={require("../../../assets/chefv2.png")} style={style.image} />
            </View>
            <View style={style.descContainer}>
                <View style={style.desc}>
                    <View>
                        <Text>{name}</Text>
                        <Text style={{ fontSize: 10 }}>Chef de Cuisine</Text>
                    </View>
                </View>
                <View style={style.chipsContainer}>
                        <View style={style.chipContainer}>
                            <Icon name="people-circle-outline" size={16} color="black" /> 
                             <Text style={style.chipText}>{props.role}</Text>
                        </View>
                        <View style={style.chipContainer}>
                            <Icon name="ribbon-outline" size={16} color="black" /> 
                             <Text style={style.chipText}>{props.experience}</Text>
                        </View>
                </View>
            </View>
        </View>
    );
}
