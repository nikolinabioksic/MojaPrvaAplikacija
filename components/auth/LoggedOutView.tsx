import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import AuthInput from "../ui/AuthInput";
import ErrorMessage from "../ui/ErrorMessage";
import AuthButton from "./AuthButton";

export default function LoggedOutView() {
  const { login } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleLogin = async () => {
    try {
      await login(email, password); 
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(error.message ?? "Prijava nije uspjela.");
    }
  }; 

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Ionicons name="person-circle-outline" size={72} color="#2563EB" />
        <Text style={styles.title}>Prijava</Text>
        
        <AuthInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <AuthInput placeholder="Lozinka" value={password} onChangeText={setPassword} secureTextEntry />
        
        <ErrorMessage message={errorMessage} />
        <AuthButton title="Prijava" onPress={handleLogin} />
      </View>
    </View>
  ); 
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#FFFFFF" },
  card: { width: "100%", maxWidth: 380, padding: 24, alignItems: "center", backgroundColor: "white", borderRadius: 18, elevation: 4 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 18, color: "#111827" },
}); 