import { Image, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#f6ae0a",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: "flex-start",
    },
    descContainer: {
        flex: 1,
        justifyContent: "flex-start",
        marginLeft: 15,
    },
    image: {
        width: 80,
        height: 100,
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
        height: "100%",
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
                <Image source={require("../../../assets/chef-ed.jpg")} style={style.image} />
            </View>
            <View style={style.descContainer}>
                <View>
                    <View style={style.desc}>
                        <Text>{name}</Text>
                        <Button
                            mode="contained"
                            style={style.button}
                            labelStyle={{ fontSize: 8, lineHeight: 10 }}
                        >
                            Detail
                        </Button>
                    </View>
                    <Text style={{ fontSize: 10 }}>Chef de Cuisine</Text>
                </View>
                <View></View>
            </View>
        </View>
    );
}
