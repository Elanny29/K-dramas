import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (e) {
      setError("Email o contraseña incorrectos.");
      return false;
    }
  };

  const register = async (email, password, nombre) => {
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: nombre });
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nombre,
        email,
        creadoEn: new Date()
      });
      return true;
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setError("Este email ya está registrado.");
      } else if (e.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError("Error al registrarse. Inténtalo de nuevo.");
      }
      return false;
    }
  };

  const logout = () => signOut(auth);

  const isLogged = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, login, register, logout, isLogged }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);