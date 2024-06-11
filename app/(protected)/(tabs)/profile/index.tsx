import { Image, Pressable, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../../../context/AuthProvider";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Professional, User } from "../../../../types/dbTypes";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useState } from "react";
import WithdrawModal from "../../../globals/components/WithdrawModal";

export default function Profile() {
    const { signOut, role, user, accessToken } = useAuth();
    const insets = useSafeAreaInsets();
    const handleLogout = async () => {
        const logout = await signOut();
        if (logout) {
            router.replace("/signIn");
        }
    };

    const ListButtonDisabled = ({ text }: { text: string }) => {
        return (
            <Button
                mode="contained"
                style={{ backgroundColor: "#ecca9c", borderColor: "black", borderWidth: 1 }}
                labelStyle={{ color: "black", fontSize: 11, lineHeight: 12 }}
                disabled
            >
                {text}
            </Button>
        );
    };

    const handleEditProfile = () => {
        router.push("/profile/edit");
    };

    const handleBookingHistory = () => {
        router.push("/profile/bookHistory");
    };

    interface ProfileButtonProps {
        onPress: () => void | Promise<void>;
        text: string;
    }

    const LineSeparator = () => {
        return <View style={{ height: 1, backgroundColor: "black", marginVertical: 20 }}></View>;
    };

    const BalanceViewer = ({ balance, onPress }: { balance: number; onPress: () => void }) => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#eda80c",
                    padding: 15,
                    borderRadius: 15,
                }}
            >
                <View>
                    <Text style={{ fontWeight: "bold" }}>Your balance</Text>
                    <Text>{balance}</Text>
                </View>
                <View>
                    <Button
                        mode="contained"
                        style={{ backgroundColor: "#ecca9c" }}
                        labelStyle={{ fontSize: 10, lineHeight: 10, color: "black" }}
                        onPress={onPress}
                    >
                        Withdraw
                    </Button>
                </View>
            </View>
        );
    };

    const ProfileButton = ({ onPress, text }: ProfileButtonProps) => {
        return (
            <Pressable onPress={onPress}>
                <View
                    style={{
                        backgroundColor: "#ecca9c",
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderRadius: 15,
                    }}
                >
                    <Text style={{ fontSize: 16 }}>{text}</Text>
                    <Text style={{ fontSize: 16 }}>&gt;</Text>
                </View>
            </Pressable>
        );
    };

    const ProfessionalProfile = () => {
        const userData = user as Professional;
        const [isModalVisible, setIsModalVisible] = useState(false);
        const showModal = () => setIsModalVisible(true);
        const hideModal = () => setIsModalVisible(false);
        return (
            <View
                style={{
                    flex: 1,
                    paddingTop: insets.top - 10,
                    paddingHorizontal: 15,
                    backgroundColor: "#e8efcf",
                }}
            >
                <View
                    style={{
                        backgroundColor: "#d9d9d9",
                        borderRadius: 15,
                        padding: 20,
                        marginBottom: 20,
                    }}
                >
                    <WithdrawModal
                        isVisible={isModalVisible}
                        onDismiss={hideModal}
                        currBal={userData.balance}
                        accToken={accessToken!}
                    />
                    <View style={{ flexDirection: "row", gap: 5 }}>
                        <Image
                            source={require("../../../../assets/chefv2.png")}
                            resizeMode="contain"
                            style={{ width: 80, height: 100 }}
                        />
                        <View
                            style={{
                                gap: 10,
                                alignItems: "center",
                                justifyContent: "center",
                                alignSelf: "center",
                                flexGrow: 1,
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{userData.name}</Text>
                            <Text>{userData.email}</Text>
                            <Text>{userData.phone_num}</Text>
                        </View>
                    </View>
                    <LineSeparator />
                    <View style={{ gap: 20 }}>
                        <BalanceViewer balance={userData.balance} onPress={showModal} />
                        <View style={{ gap: 10 }}>
                            <Text>
                                Occupation:{" "}
                                {[role.charAt(0), ...role.substring(1).toLowerCase()].join("")}
                            </Text>
                            <Text>Experience: {userData.experience} years</Text>
                        </View>
                    </View>
                    <LineSeparator />
                    <View style={{ gap: 5 }}>
                        <Text>Description: </Text>
                        <Text>{userData.description}</Text>
                    </View>
                </View>
                <View style={{ gap: 20 }}>
                    <ProfileButton onPress={handleEditProfile} text="Edit Profile" />
                    <ProfileButton onPress={handleLogout} text="Logout" />
                </View>
            </View>
        );
    };

    const UserProfile = () => {
        const userData = user as User;
        const GenderLogo = ({ gender }: { gender: string }) => {
            return gender.toLowerCase() === "male" ? (
                <FontAwesome5Icon name="mars" size={18} color="#03a3ff" />
            ) : (
                <FontAwesome5Icon name="venus" size={18} color="#e648a2" />
            );
        };

        const AllergyOrMedRecordList = ({ type }: { type: string }) => {
            const allergies = userData.allergies;
            const medRecord = userData.medicalRecords;
            console.log(allergies[0]);

            if (type === "allergies") {
                if (allergies.length === 0) {
                    return (
                        <View style={{ flexDirection: "row", gap: 5, marginVertical: 10 }}>
                            <ListButtonDisabled text="None" />
                        </View>
                    );
                } else {
                    return (
                        <View style={{ flexDirection: "row", gap: 5, marginVertical: 10 }}>
                            {allergies.map((allergy, idx) => (
                                <ListButtonDisabled key={idx} text={allergy} />
                            ))}
                        </View>
                    );
                }
            } else {
                if (medRecord.length === 0) {
                    return (
                        <View style={{ flexDirection: "row", gap: 5, marginVertical: 10 }}>
                            <ListButtonDisabled text="None" />
                        </View>
                    );
                } else {
                    return (
                        <View style={{ flexDirection: "row", gap: 5, marginVertical: 10 }}>
                            {medRecord.map((allergy, idx) => (
                                <ListButtonDisabled key={idx} text={allergy} />
                            ))}
                        </View>
                    );
                }
            }
        };

        return (
            <View
                style={{
                    flex: 1,
                    paddingTop: insets.top - 10,
                    paddingHorizontal: 15,
                    backgroundColor: "#e8efcf",
                }}
            >
                <View
                    style={{
                        backgroundColor: "#d9d9d9",
                        borderRadius: 15,
                        padding: 20,
                        marginBottom: 20,
                    }}
                >
                    <View style={{ alignItems: "center", gap: 5 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{userData.name}</Text>
                            <GenderLogo gender={userData.gender!} />
                        </View>
                        <Text>{userData.email}</Text>
                        <Text>{userData.phone_num}</Text>
                    </View>
                    <LineSeparator />
                    <View style={{ gap: 10 }}>
                        <Text>Age: {userData.age}</Text>
                        <Text>Country: {userData.country}</Text>
                        <View>
                            <Text>Food Allergies: </Text>
                            <AllergyOrMedRecordList type="allergies" />
                        </View>
                        <View>
                            <Text>Medical Records: </Text>
                            <AllergyOrMedRecordList type="medRecord" />
                        </View>
                    </View>
                </View>
                <View style={{ gap: 20 }}>
                    <ProfileButton onPress={handleBookingHistory} text="Booking History" />
                    <ProfileButton onPress={handleEditProfile} text="Edit Profile" />
                    <ProfileButton onPress={handleLogout} text="Logout" />
                </View>
            </View>
        );
    };

    if (role === "PROFESSIONAL") {
        const userData = user as Professional;
        return <ProfessionalProfile />;
    } else {
        return <UserProfile />;
    }
}
