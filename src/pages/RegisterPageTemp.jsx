import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre]         = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (password !== confirm) {
      setLocalError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setLocalError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const ok = await register(email, password, nombre);
    setLoading(false);
    if (ok) navigate("/");
  };

  const errorMsg = localError || error;

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <div style={styles.logo}>K-Drama World</div>
        <h1 style={styles.title}>Crear cuenta</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Nombre</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={e => { setError(""); setLocalError(""); setNombre(e.target.value); }}
            required
            style={styles.input}
          />
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={e => { setError(""); setLocalError(""); setEmail(e.target.value); }}
            required
            style={styles.input}
          />
          <label style={styles.label}>Contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={e => { setError(""); setLocalError(""); setPassword(e.target.value); }}
            required
            style={styles.input}
          />
          <label style={styles.label}>Confirmar contraseña</label>
          <input
            type="password"
            placeholder="Repite tu contraseña"
            value={confirm}
            onChange={e => { setError(""); setLocalError(""); setConfirm(e.target.value); }}
            required
            style={styles.input}
          />
          {errorMsg && <p style={styles.error}>{errorMsg}</p>}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p style={styles.switchText}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={styles.link}>Inicia sesión</Link>
        </p>
        <p style={styles.switchText}>
          <Link to="/" style={styles.linkMuted}>Volver al inicio</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "#0a0a0f",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "20px", fontFamily: "'DM Sans', sans-serif"
  },
  card: {
    background: "#1a1a26",
    border: "1px solid rgba(230,62,109,0.25)",
    borderRadius: "16px",
    padding: "48px 40px",
    width: "100%", maxWidth: "400px",
    textAlign: "center"
  },
  logo: {
    fontFamily: "'Nanum Myeongjo', serif",
    fontSize: "1.1rem", color: "#e63e6d",
    letterSpacing: "2px", marginBottom: "16px"
  },
  title: {
    fontFamily: "'Nanum Myeongjo', serif",
    fontSize: "1.8rem", fontWeight: 800,
    color: "#f0eaf5", margin: "0 0 28px"
  },
  form: { display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" },
  label: {
    color: "#8a8499", fontSize: "11px",
    letterSpacing: "1.5px", textTransform: "uppercase"
  },
  input: {
    background: "#0a0a0f",
    border: "1px solid rgba(230,62,109,0.3)",
    borderRadius: "8px", padding: "12px 16px",
    color: "#f0eaf5", fontSize: "14px",
    outline: "none", fontFamily: "'DM Sans', sans-serif",
    marginBottom: "8px"
  },
  btn: {
    background: "linear-gradient(135deg, #e63e6d, #ff8fab)",
    border: "none", borderRadius: "8px",
    padding: "13px", color: "#fff",
    fontSize: "14px", fontWeight: 600,
    cursor: "pointer", marginTop: "8px",
    fontFamily: "'DM Sans', sans-serif"
  },
  error: { color: "#ff8fab", fontSize: "13px", margin: "4px 0" },
  switchText: { marginTop: "16px", color: "#8a8499", fontSize: "13px" },
  link: { color: "#e63e6d", textDecoration: "none", fontWeight: 600 },
  linkMuted: { color: "#8a8499", fontSize: "12px", textDecoration: "none" }
};