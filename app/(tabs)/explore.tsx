import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Accelerometer, Magnetometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, Vibration, View } from "react-native";
import HardwareFeatureCard from "../../components/hardware/HardwareFeatureCard";
import SensorValueRow from "../../components/hardware/SensorValueRow";

export default function ExploreScreen() {
  const [locationText, setLocationText] = useState("Lokacija još nije dohvaćena.");
  const [accelerometerEnabled, setAccelerometerEnabled] = useState(false);
  const [magnetometerEnabled, setMagnetometerEnabled] = useState(false);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const [imageUri, setImageUri] = useState<string | null>(null);

  // 1. Logika za Akcelerometar 
  useEffect(() => {
    if (!accelerometerEnabled) return;
    Accelerometer.setUpdateInterval(500);
    const sub = Accelerometer.addListener(setAccelerometerData);
    return () => sub.remove();
  }, [accelerometerEnabled]);

  // 2. Logika za Magnetometar 
  useEffect(() => {
    if (!magnetometerEnabled) return;
    Magnetometer.setUpdateInterval(500);
    const sub = Magnetometer.addListener(setMagnetometerData);
    return () => sub.remove();
  }, [magnetometerEnabled]);

  // 3. GPS Lokacija 
 const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync(); 
    if (status !== "granted") {
      return Alert.alert("Dozvola odbijena", "Lokacija se ne može dohvatiti bez dozvole."); 
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    }); 

    const { latitude, longitude } = location.coords; 
    setLocationText(
      `Lat: ${latitude.toFixed(6)}\nLng: ${longitude.toFixed(6)}`
    ); 

  } catch (error: any) {
    Alert.alert(
      "Lokacija nedostupna", 
      "Provjeri je li GPS upaljen na mobitelu i imaš li signal."
    );
  }
};

  // 4. Kamera i Galerija 
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return Alert.alert("Dozvola odbijena");
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return Alert.alert("Dozvola odbijena");
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="hardware-chip-outline" size={42} color="#2563EB" />
        <Text style={styles.title}>Hardware funkcije</Text>
      </View>

      <HardwareFeatureCard title="GPS i geolokacija" description="Dohvaća trenutnu lokaciju uređaja.">
        <Text style={styles.output}>{locationText}</Text>
        <ActionButton title="Dohvati lokaciju" onPress={getCurrentLocation} />
      </HardwareFeatureCard>

      <HardwareFeatureCard title="Akcelerometar" description="Prati promjene kretanja uređaja.">
        <SensorValueRow label="x" value={accelerometerData.x} />
        <SensorValueRow label="y" value={accelerometerData.y} />
        <SensorValueRow label="z" value={accelerometerData.z} />
        <ActionButton 
          title={accelerometerEnabled ? "Zaustavi" : "Pokreni"} 
          onPress={() => setAccelerometerEnabled(!accelerometerEnabled)} 
        />
      </HardwareFeatureCard>

      <HardwareFeatureCard title="Kamera i galerija" description="Snimi novu sliku ili odaberi iz galerije.">
        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
        <View style={styles.buttonRow}>
          <ActionButton title="Kamera" onPress={takePhoto} compact />
          <ActionButton title="Galerija" onPress={pickImage} compact />
        </View>
      </HardwareFeatureCard>

      <HardwareFeatureCard title="Vibracije" description="Pokreće vibracijski uzorak.">
        <ActionButton title="Pokreni vibraciju" onPress={() => Vibration.vibrate([300, 150, 300])} />
      </HardwareFeatureCard>
    </ScrollView>
  );
}


function ActionButton({ title, onPress, compact }: { title: string; onPress: () => void; compact?: boolean }) {
  return (
    <Pressable style={[styles.button, compact && styles.compactButton]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#eef3f8" },
  content: { padding: 18, paddingBottom: 32 },
  header: { alignItems: "center", marginBottom: 18 },
  title: { fontSize: 28, fontWeight: "800", color: "#111827", marginTop: 8 },
  output: { backgroundColor: "#f8fafc", borderRadius: 12, padding: 12, color: "#111827", lineHeight: 20 },
  button: { marginTop: 12, backgroundColor: "#2563EB", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  compactButton: { flex: 1, marginHorizontal: 4 },
  buttonText: { color: "#ffffff", fontWeight: "700" },
  buttonRow: { flexDirection: "row", marginHorizontal: -4 },
  previewImage: { width: "100%", height: 180, borderRadius: 14, marginBottom: 10, backgroundColor: "#e5e7eb" },
});