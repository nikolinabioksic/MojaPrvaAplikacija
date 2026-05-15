import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { firestore } from "../../firebaseConfig";
import AuthInput from "../ui/AuthInput";
import ErrorMessage from "../ui/ErrorMessage";
import AuthButton from "./AuthButton";

type Profile = { name: string; age: string; city: string; bio: string; }; 

export default function LoggedInView() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<Profile>({ name: "", age: "", city: "", bio: "" });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); 

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as Profile);
        } else {
      
          const empty = { name: "", age: "", city: "", bio: "" };
          await setDoc(docRef, empty);
          setProfile(empty);
        }
      } catch (error: any) {
        setErrorMessage("Greška pri učitavanju."); 
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]); 

  const handleSaveProfile = async () => {
  if (!user) return;
  try {
    await setDoc(doc(firestore, "users", user.uid), profile, { merge: true });
    Alert.alert("Uspjeh", "Profil je spremljen."); 
  } catch (error: any) {
    setErrorMessage("Greška pri spremanju."); 
  }
};

  if (loading) return <View style={styles.centered}><Text>Učitavanje...</Text></View>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Ionicons name="person-circle-outline" size={72} color="#2563EB" />
        <Text style={styles.title}>Moj profil</Text>
        
        <AuthInput placeholder="Ime" value={profile.name} onChangeText={(t) => setProfile({...profile, name: t})} />
        <AuthInput placeholder="Dob" value={profile.age} onChangeText={(t) => setProfile({...profile, age: t})} keyboardType="numeric" />
        {/* ZADATAK ZA STUDENTE: Polje grad  */}
        <AuthInput placeholder="Grad" value={profile.city} onChangeText={(t) => setProfile({...profile, city: t})} />
        <AuthInput placeholder="O meni" value={profile.bio} onChangeText={(t) => setProfile({...profile, bio: t})} multiline />
        
        <ErrorMessage message={errorMessage} />
        <AuthButton title="Spremi profil" onPress={handleSaveProfile} />
        <AuthButton title="Odjavi se" onPress={logout} variant="secondary" />
      </View>
    </ScrollView>
  ); 
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#EEF3F8" },
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#EEF3F8" },
  card: { width: "100%", maxWidth: 420, backgroundColor: "white", borderRadius: 18, padding: 22, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", marginTop: 8, marginBottom: 18, color: "#111827" },
}); 