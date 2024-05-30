import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { Button, Modal, Portal, TextInput } from "react-native-paper";
import { BACKEND_URL } from "@env";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";

const WithdrawModal = ({
    isVisible,
    onDismiss,
    currBal,
    accToken,
}: {
    isVisible: boolean;
    onDismiss: () => void;
    currBal: number;
    accToken: string;
}) => {
    const { fetchUserData } = useAuth();
    const [amount, setAmount] = useState<number>(0);
    const handleWithdraw = async () => {
        if (isNaN(amount) || amount === 0) {
            Alert.alert("Error", "Please enter a valid amount");
        } else if (amount > currBal) {
            // Can't withdraw
            Alert.alert("Error", "Insufficient balance");
        } else {
            const updateBalance = await axios({
                method: "PUT",
                url: `${BACKEND_URL}/api/profile/professional/balance`,
                headers: { Authorization: `Bearer ${accToken}` },
                data: {
                    balance: amount,
                },
            });

            if (!(updateBalance.status === 200)) {
                Alert.alert("Error", "Failed to withdraw");
            } else if (updateBalance.status === 200) {
                await fetchUserData();
                Alert.alert("Success", "Withdrawal successful");
                onDismiss();
            }
        }
    };
    return (
        <Portal>
            <Modal visible={isVisible} onDismiss={onDismiss}>
                <View
                    style={{
                        padding: 15,
                        gap: 10,
                        backgroundColor: "#e8efcf",
                        marginHorizontal: 15,
                        borderRadius: 15,
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>
                        Withdraw Balance
                    </Text>
                    <TextInput
                        label={"Amount"}
                        mode="outlined"
                        onChangeText={(e) => setAmount(parseFloat(e))}
                        keyboardType="numeric"
                    />
                    <Button
                        mode="contained"
                        style={{ backgroundColor: "#ecca9c", marginTop: 10 }}
                        labelStyle={{ color: "black" }}
                        onPress={handleWithdraw}
                    >
                        Withdraw
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

export default WithdrawModal;
