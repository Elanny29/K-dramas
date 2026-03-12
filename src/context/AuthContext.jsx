import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

// Email del admin — solo este puede eliminar series
const ADMIN_EMAIL = "tu@email.com";

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

  const isAdmin = user?.email === ADMIN_EMAIL;
  const isLogged = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, login, register, logout, isAdmin, isLogged }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);