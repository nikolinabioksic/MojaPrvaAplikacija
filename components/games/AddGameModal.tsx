import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type AddGameModalProps = {
  visible: boolean; 
  title: string; 
  description: string; 
  imageUrl: string; 
  route: string;
  uploadingImage: boolean;
  onChangeTitle: (v: string) => void; 
  onChangeDescription: (v: string) => void;
  onChangeRoute: (v: string) => void;
  onPickImage: () => void;
  onClose: () => void; 
  onSubmit: () => void;
}; 

export default function AddGameModal(props: AddGameModalProps) {
  return (
    <Modal visible={props.visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.content}>
          <Text style={styles.modalTitle}>Dodaj igru</Text>
          
          <TextInput 
            placeholder="Naslov" 
            value={props.title} 
            onChangeText={props.onChangeTitle} 
            style={styles.input} 
          />
          
          <TextInput 
            placeholder="Opis" 
            value={props.description} 
            onChangeText={props.onChangeDescription} 
            style={[styles.input, styles.textArea]} 
            multiline 
          />

          {/* NOVI DIO ZA SLIKU */}
          <Pressable
            style={styles.imageButton}
            onPress={props.onPickImage}
            disabled={props.uploadingImage}
          >
            <Text style={styles.imageButtonText}>
              {props.uploadingImage ? "Upload u tijeku..." : "Odaberi i upload-aj sliku"}
            </Text>
          </Pressable>

          {props.imageUrl ? (
            <Text style={styles.imageStatus}>Slika je odabrana i uploadana.</Text>
          ) : (
            <Text style={styles.imageHint}>Slika još nije odabrana.</Text>
          )}

          <TextInput 
            placeholder="/game-one" 
            value={props.route} 
            onChangeText={props.onChangeRoute} 
            style={styles.input} 
            autoCapitalize="none" 
          />
          
          <Pressable style={styles.primaryButton} onPress={props.onSubmit}>
            <Text style={styles.primaryButtonText}>Dodaj</Text>
          </Pressable>
          
          <Pressable style={styles.secondaryButton} onPress={props.onClose}>
            <Text style={styles.secondaryButtonText}>Zatvori</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.45)", padding: 20 },
  content: { width: "100%", maxWidth: 420, backgroundColor: "#ffffff", borderRadius: 18, padding: 22 },
  modalTitle: { fontSize: 22, fontWeight: "700", marginBottom: 14, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 12, padding: 12, marginBottom: 12 },
  textArea: { minHeight: 96, textAlignVertical: "top" },
  primaryButton: { backgroundColor: "#2563EB", padding: 13, borderRadius: 12, alignItems: "center" },
  primaryButtonText: { color: "#ffffff", fontWeight: "700" },
  secondaryButton: { marginTop: 10, padding: 13, alignItems: "center" },
  secondaryButtonText: { color: "#111827", fontWeight: "600" },
  
  /* NOVI STILOVI ZA UPLOAD SLIKE */
  imageButton: {
    backgroundColor: "#dbeafe",
    borderWidth: 1,
    borderColor: "#93c5fd",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  imageButtonText: {
    color: "#1d4ed8",
    fontWeight: "700",
  },
  imageStatus: {
    color: "#15803d",
    marginBottom: 12,
  },
  imageHint: {
    color: "#6b7280",
    marginBottom: 12,
  },
});