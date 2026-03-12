import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate("/");
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <div style={styles.logo}>✦</div>
        <h1 style={styles.title}>K-Drama World</h1>
        <p style={styles.sub}>Acceso administrador</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <button type="button" style={styles.cancelBtn} onClick={() => navigate("/")}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "#0a0a0f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'DM Sans', sans-serif"
  },
  card: {
    background: "#1a1a26",
    border: "1px solid rgba(230,62,109,0.25)",
    borderRadius: "16px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center"
  },
  logo: {
    fontSize: "2rem",
    color: "#e63e6d",
    marginBottom: "12px"
  },
  title: {
    fontFamily: "'Nanum Myeongjo', serif",
    fontSize: "2rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #fff 30%, #ff8fab 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 6px"
  },
  sub: {
    color: "#8a8499",
    fontSize: "13px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginBottom: "32px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  input: {
    background: "#0a0a0f",
    border: "1px solid rgba(230,62,109,0.3)",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#f0eaf5",
    fontSize: "14px",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif"
  },
  btn: {
    background: "linear-gradient(135deg, #e63e6d, #ff8fab)",
    border: "none",
    borderRadius: "8px",
    padding: "13px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "6px",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.5px"
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid rgba(230,62,109,0.3)",
    borderRadius: "8px",
    padding: "13px",
    color: "#8a8499",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif"
  },
  error: {
    color: "#ff8fab",
    fontSize: "13px",
    margin: 0
  }
};