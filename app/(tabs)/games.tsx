import { useRouter } from "expo-router";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import AddGameModal from "../../components/games/AddGameModal";
import GameCard from "../../components/games/GameCard";
import { useAuth } from "../../contexts/AuthContext";
import { firestore } from "../../firebaseConfig";
import { pickAndUploadGameImage } from "../../services/uploadGameImage"; // NOVI IMPORT
import type { Game } from "../../types/game";

export default function GamesScreen() {
  const { isLoggedIn } = useAuth();
  const router = useRouter(); 
  const [games, setGames] = useState<Game[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Stanja za formu
  const [gameTitle, setGameTitle] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [gameImageUrl, setGameImageUrl] = useState("");
  const [gameRoute, setGameRoute] = useState(""); 

  //Stanje za učitavanje slike
  const [uploadingImage, setUploadingImage] = useState(false);

  // Učitavanje igara iz baze
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesSnapshot = await getDocs(collection(firestore, "games"));
        const gamesList = gamesSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Game[];
        setGames(gamesList);
      } catch (error) { 
        console.error("Greška pri učitavanju:", error);
        Alert.alert("Greška", "Učitavanje nije uspjelo."); 
      }
    };
    fetchGames();
  }, []); 

  //Funkcija za odabir i upload slike
  const handlePickImage = async () => {
    try {
      setUploadingImage(true);
      const publicUrl = await pickAndUploadGameImage();
      if (publicUrl) {
        setGameImageUrl(publicUrl);
        Alert.alert("Uspjeh", "Slika je odabrana i spremna.");
      }
    } catch (error: any) {
      Alert.alert("Greška", error.message ?? "Upload slike nije uspio.");
    } finally {
      setUploadingImage(false);
    }
  };

  //Funkcija za dodavanje nove igre s DEBUG logovima
  const handleAddGame = async () => {
    console.log("--- Pokušaj dodavanja igre ---");

    if (!isLoggedIn) {
      console.log("Greška: Korisnik nije prijavljen");
      return Alert.alert("Prijava", "Prvo se prijavite u Auth tabu."); 
    }

    console.log("Uneseni podaci:", { 
      Naslov: gameTitle, 
      Opis: gameDescription, 
      Slika: gameImageUrl, 
      Ruta: gameRoute 
    });

    if (!gameTitle || !gameDescription || !gameImageUrl || !gameRoute) {
      console.log("Greška: Nedostaju podaci u poljima");
      return Alert.alert("Info", "Molimo popunite sva polja, odaberite sliku i unesite rutu."); 
    }
    
    try {
      const newGame = { 
        title: gameTitle, 
        description: gameDescription, 
        imageUrl: gameImageUrl,
        route: gameRoute 
      };
      
      console.log("Šaljem u Firestore...");
      const docRef = await addDoc(collection(firestore, "games"), newGame);
      console.log("Uspjeh! Novi ID:", docRef.id);

      setGames(prev => [...prev, { id: docRef.id, ...newGame }]); 
      
      setModalVisible(false); 
      setGameTitle(""); 
      setGameDescription(""); 
      setGameImageUrl(""); 
      setGameRoute(""); 
      
      Alert.alert("Uspjeh", "Nova igra je uspješno dodana.");
    } catch (error) { 
      console.error("DETALJNA FIRESTORE GREŠKA:", error);
      Alert.alert("Greška", "Spremanje u bazu nije uspjelo."); 
    }
  }; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Igre</Text>
      
      <Pressable style={styles.addButton} onPress={() => {
        console.log("Otvaram modal...");
        setModalVisible(true);
      }}>
        <Text style={styles.addButtonText}>Dodaj igru</Text>
      </Pressable>
      
      <FlatList 
        data={games} 
        keyExtractor={item => item.id} 
        renderItem={({ item }) => (
          <Pressable onPress={() => {
            console.log("Navigacija na:", item.route);
            router.push(item.route as any);
          }}>
            <GameCard game={item} />
          </Pressable>
        )} 
        contentContainerStyle={styles.listContent}
      />
      
      <AddGameModal
        visible={modalVisible}
        title={gameTitle}
        description={gameDescription}
        imageUrl={gameImageUrl}
        route={gameRoute}
        uploadingImage={uploadingImage}
        onChangeTitle={setGameTitle}
        onChangeDescription={setGameDescription}
        onChangeRoute={setGameRoute}
        onPickImage={handlePickImage}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddGame}
      />
    </View>
  );
} 

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef3f8", padding: 18 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 16, color: "#111827" },
  addButton: { backgroundColor: "#2563EB", padding: 14, borderRadius: 12, alignItems: "center", marginBottom: 16 },
  addButtonText: { color: "#ffffff", fontWeight: "700", fontSize: 16 },
  listContent: { paddingBottom: 20 }
});