

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDuYM7zKcT5oA4rTIodZPIKoKCI6c9ojOI",
  authDomain: "k-dramas-6b7fc.firebaseapp.com",
  projectId: "k-dramas-6b7fc",
  storageBucket: "k-dramas-6b7fc.firebasestorage.app",
  messagingSenderId: "113714343853",
  appId: "1:113714343853:web:1c456f11465c25e5cb3b24"
};

const app  = initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
