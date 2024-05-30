import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { Link, Redirect, router } from "expo-router";



const SummaryPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dear Chef,</Text>
      <Text style={styles.message}>
        We kindly request your assistance in summarizing the recent online
        consultation with a user. During the session, the user, Hugo expressed
        their goals which primarily focused on diet planning, along with cooking
        companion.
      </Text>
      <Text style={styles.question}>
        Could you please summarizing the recent online consultation?
      </Text>
      <TextInput style={styles.input} placeholder="Type here..." multiline />

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => router.push("/home")}
          style={styles.button}
        >
          Back
        </Button>

        <Button
          mode="contained"
          onPress={()=>router.push("/summary")} // Menonaktifkan tombol Next
          style={styles.button} // Tambahkan gaya untuk tombol Next
        >
          Next
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8EFCF", // Warna latar belakang seperti contoh
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    paddingTop: 30,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 300,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: 'top'
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#4DB6AC", // Warna tombol seperti contoh
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SummaryPage;
