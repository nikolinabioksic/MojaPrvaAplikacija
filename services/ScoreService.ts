import type { User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc, //
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import type { LeaderboardUser } from "../types/leaderboard";

// 1. Definicija bodova prema vježbi 
const CORRECT_ANSWER_POINTS = 5;
const WRONG_ANSWER_POINTS = -7;

export const updateUserScore = async (user: User, isCorrect: boolean) => {
  const points = isCorrect ? CORRECT_ANSWER_POINTS : WRONG_ANSWER_POINTS;
  const userRef = doc(firestore, "users", user.uid);

  const userSnap = await getDoc(userRef);
  let currentScore = 0;

  if (userSnap.exists()) {
    currentScore = userSnap.data().score || 0;
  }

  let newScore = currentScore + points;

  if (newScore < 0) {
    newScore = 0;
  }

  await setDoc(
    userRef,
    {
      username: user.email ?? "Anonimni korisnik",
      score: newScore,
      updatedAt: serverTimestamp(), 
    },
    { merge: true } 
  );

  return points;
};


export const fetchLeaderboard = async (): Promise<LeaderboardUser[]> => {
  const leaderboardQuery = query(
    collection(firestore, "users"),
    orderBy("score", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(leaderboardQuery);
  
  return snapshot.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      username: typeof data.username === "string" ? data.username : "Korisnik",
      score: typeof data.score === "number" ? data.score : 0,
    };
  });
};