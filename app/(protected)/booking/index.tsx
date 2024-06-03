import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfessionalCard2 from "../../globals/components/ProfessionalCard2";
import { Professional, ProfessionalRole } from "../../../types/dbTypes";
import { DatePickerModal } from "react-native-paper-dates";
import { Button } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";


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
        button: {},
    });

    const tempoChef:Professional = {
        professional_id: "1",
        name: "Benedict",
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


    return (
        <View style={style.container}>
            <ProfessionalCard2 {...tempoChef}/>
                    <SafeAreaProvider>
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
                    </SafeAreaProvider> 
            
            
        </View>
    )
}