import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";

// ─── Configura tus claves de EmailJS ────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "TU_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "TU_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "TU_PUBLIC_KEY";
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function AuthProvider({ children }) {
  const [user, setUser]                   = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [pendingVerification, setPending] = useState(false);
  const [pendingUser, setPendingUser]     = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && !pendingVerification) setUser(u);
      setLoading(false);
    });
    return unsub;
  }, [pendingVerification]);

  /** Paso 1: valida credenciales y envía OTP por correo */
  const login = async (email, password) => {
    setError("");
    try {
      const cred   = await signInWithEmailAndPassword(auth, email, password);
      const otp    = generateOTP();
      const expira = new Date(Date.now() + 5 * 60 * 1000); // 5 min

      await setDoc(doc(db, "otpCodes", cred.user.uid), { otp, expira });

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { destinatario: email, codigo: otp },
        EMAILJS_PUBLIC_KEY
      );

      setPendingUser(cred.user);
      setPending(true);
      return { ok: true, uid: cred.user.uid };
    } catch (e) {
      const credErrors = ["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"];
      setError(credErrors.includes(e.code)
        ? "Email o contraseña incorrectos."
        : "Error al iniciar sesión. Inténtalo de nuevo."
      );
      return { ok: false };
    }
  };

  /** Paso 2: valida el código OTP ingresado por el usuario */
  const verifyOTP = async (uid, inputCode) => {
    setError("");
    try {
      const snap = await getDoc(doc(db, "otpCodes", uid));
      if (!snap.exists()) {
        setError("El código no existe o ya fue usado.");
        return false;
      }

      const { otp, expira } = snap.data();

      if (new Date() > expira.toDate()) {
        await deleteDoc(doc(db, "otpCodes", uid));
        setError("El código expiró. Inicia sesión de nuevo.");
        setPending(false);
        setPendingUser(null);
        await signOut(auth);
        return false;
      }

      if (otp !== inputCode.trim()) {
        setError("Código incorrecto. Revisa tu correo.");
        return false;
      }

      // ✓ Código válido — limpiar y conceder acceso
      await deleteDoc(doc(db, "otpCodes", uid));
      setUser(pendingUser);
      setPending(false);
      setPendingUser(null);
      return true;
    } catch (e) {
      setError("Error al verificar el código.");
      return false;
    }
  };

  /** Reenvía un nuevo OTP al correo del usuario pendiente */
  const resendOTP = async () => {
    if (!pendingUser) return;
    setError("");
    try {
      const otp    = generateOTP();
      const expira = new Date(Date.now() + 5 * 60 * 1000);
      await setDoc(doc(db, "otpCodes", pendingUser.uid), { otp, expira });
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { destinatario: pendingUser.email, codigo: otp },
        EMAILJS_PUBLIC_KEY
      );
    } catch (e) {
      setError("No se pudo reenviar el código.");
    }
  };

  const register = async (email, password, nombre) => {
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: nombre });
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nombre, email, creadoEn: new Date()
      });
      return true;
    } catch (e) {
      if (e.code === "auth/email-already-in-use") setError("Este email ya está registrado.");
      else if (e.code === "auth/weak-password")   setError("La contraseña debe tener al menos 6 caracteres.");
      else                                         setError("Error al registrarse. Inténtalo de nuevo.");
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setPending(false);
    setPendingUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, error, setError,
      pendingVerification, pendingUser,
      login, verifyOTP, resendOTP, register, logout,
      isLogged: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
