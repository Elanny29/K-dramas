import { useState, useEffect } from "react";
import { db, storage } from "../firebase/config";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, orderBy, query
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export function useSeries() {
  const [series, setSeries]   = useState([]);
  const [loading, setLoading] = useState(true);

  // Escucha en tiempo real la colección "series" en Firestore
  useEffect(() => {
    const q = query(collection(db, "series"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setSeries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  // Subir imagen al Storage y devolver la URL pública
  const uploadImage = async (file, id) => {
    const storageRef = ref(storage, `posters/${id}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // Agregar nueva serie
  const addSerie = async (data, imageFile) => {
    const docRef = await addDoc(collection(db, "series"), {
      ...data,
      img: "",
      createdAt: Date.now()
    });
    if (imageFile) {
      const url = await uploadImage(imageFile, docRef.id);
      await updateDoc(docRef, { img: url });
    }
    return docRef.id;
  };

  // Editar serie existente
  const updateSerie = async (id, data, imageFile, oldImgUrl) => {
    let img = data.img;
    if (imageFile) {
      // Borrar imagen anterior si existe en Storage
      if (oldImgUrl && oldImgUrl.includes("firebasestorage")) {
        try { await deleteObject(ref(storage, oldImgUrl)); } catch (_) {}
      }
      img = await uploadImage(imageFile, id);
    }
    await updateDoc(doc(db, "series", id), { ...data, img });
  };

  // Eliminar serie
  const deleteSerie = async (id, imgUrl) => {
    if (imgUrl && imgUrl.includes("firebasestorage")) {
      try { await deleteObject(ref(storage, imgUrl)); } catch (_) {}
    }
    await deleteDoc(doc(db, "series", id));
  };

  return { series, loading, addSerie, updateSerie, deleteSerie };
}
