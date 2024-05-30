import { Image, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#f6ae0a",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    descContainer: {
        flex: 1,
        marginLeft: 15,
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
});

interface ProfessionalProps {
    name: string;
}
export default function ProfessionalCard(props: ProfessionalProps) {
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
                    <Button
                        mode="contained"
                        style={style.button}
                        labelStyle={{ fontSize: 10, lineHeight: 10, color: "black" }}
                    >
                        Book &gt;
                    </Button>
                </View>
            </View>
        </View>
    );
}
