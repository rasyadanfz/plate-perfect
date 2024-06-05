
import { RadioButton } from "react-native-paper";
import React from "react";
import { StyleSheet } from "react-native";


const style = StyleSheet.create({
    container: {
        
    },
});

export function PaymentMethod(props:any){
    const {state,setState} = props
    const listPaymentMethods = [
        { value: 'CASH', label: 'Cash', icon: 'cash' },
        { value: 'DEBIT_CARD', label: 'Debit Card', icon: 'credit-card-outline' },
        { value: 'CREDIT_CARD', label: 'Credit Card', icon: 'credit-card' },
      ];
    return (
        listPaymentMethods.map((item, index) => {
            return (
            <RadioButton.Item
                key={item.value}
                label={item.label}
                value={item.value}
                status={state == item.value ? 'checked' : 'unchecked'}
                onPress={() =>{setState(item.value)}}
               // style=
                />
            )
        })
    )
}
