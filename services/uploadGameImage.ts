import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabase";

const BUCKET_NAME = "game-images";

export async function pickAndUploadGameImage() {
  console.log("1. Pokrećem odabir slike...");
  
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  console.log("2. Status dozvole:", permission.granted);
  
  console.log("3. Otvaram galeriju...");
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  console.log("4. Rezultat odabira:", result);

  if (result.canceled) {
    console.log("5. Odabir je prekinut/otkazan.");
    return null;
  }

  console.log("6. Pripremam upload...");
  const asset = result.assets[0];
  const fileExt = asset.uri.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `games/${fileName}`;

  const response = await fetch(asset.uri);
  const arrayBuffer = await response.arrayBuffer();

  console.log("7. Šaljem u Supabase...");
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, arrayBuffer, {
      contentType: asset.mimeType ?? "image/jpeg",
      upsert: false,
    });

  if (error) {
    console.error("Supabase greška pri uploadu:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  console.log("8. Uspjeh! Dobiven URL:", data.publicUrl);
  return data.publicUrl;
}