import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  doc, setDoc, deleteDoc, onSnapshot, collection
} from "firebase/firestore";

export function useFavoritos(userId) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    if (!userId) { setFavoritos([]); return; }
    const ref = collection(db, "usuarios", userId, "favoritos");
    const unsub = onSnapshot(ref, (snap) => {
      setFavoritos(snap.docs.map(d => d.id));
    });
    return unsub;
  }, [userId]);

  const toggleFavorito = async (serieId) => {
    if (!userId) return;
    const ref = doc(db, "usuarios", userId, "favoritos", serieId);
    if (favoritos.includes(serieId)) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { serieId, guardadoEn: Date.now() });
    }
  };

  const esFavorito = (serieId) => favoritos.includes(serieId);

  return { favoritos, toggleFavorito, esFavorito };
}