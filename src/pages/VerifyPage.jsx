import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function VerifyPage() {
  const { verifyOTP, resendOTP, pendingUser, error, setError } = useAuth();
  const navigate = useNavigate();

  const [digits, setDigits]     = useState(["", "", "", "", "", ""]);
  const [loading, setLoading]   = useState(false);
  const [resending, setResend]  = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 min en segundos
  const inputRefs = useRef([]);

  // Redirigir si no hay usuario pendiente
  useEffect(() => {
    if (!pendingUser) navigate("/login", { replace: true });
  }, [pendingUser, navigate]);

  // Cuenta regresiva
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError("");
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setDigits(text.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) return;
    setLoading(true);
    const ok = await verifyOTP(pendingUser.uid, code);
    setLoading(false);
    if (ok) navigate("/", { replace: true });
  };

  const handleResend = async () => {
    setResend(true);
    await resendOTP();
    setCountdown(300);
    setDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    setResend(false);
  };

  const maskedEmail = pendingUser?.email?.replace(/(.{2}).+(@.+)/, "$1•••$2");

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <div style={styles.icon}>✉️</div>
        <h1 style={styles.title}>Verificación</h1>
        <p style={styles.sub}>
          Ingresa el código de 6 dígitos enviado a
        </p>
        <p style={styles.email}>{maskedEmail}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.digitsRow} onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{
                  ...styles.digitInput,
                  borderColor: d ? "#e63e6d" : "rgba(230,62,109,0.3)",
                  boxShadow: d ? "0 0 0 2px rgba(230,62,109,0.2)" : "none"
                }}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.timer}>
            {countdown > 0
              ? <span>Expira en <strong style={{ color: countdown < 60 ? "#e63e6d" : "#ff8fab" }}>{formatTime(countdown)}</strong></span>
              : <span style={{ color: "#e63e6d" }}>El código expiró. Reenvía uno nuevo.</span>
            }
          </div>

          <button
            type="submit"
            disabled={loading || digits.join("").length < 6}
            style={{
              ...styles.btn,
              opacity: digits.join("").length < 6 ? 0.5 : 1
            }}
          >
            {loading ? "Verificando..." : "Verificar código"}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>¿No recibiste el correo? </span>
          <button
            onClick={handleResend}
            disabled={resending || countdown > 240}
            style={styles.resendBtn}
          >
            {resending ? "Reenviando..." : "Reenviar código"}
          </button>
        </div>

        <button
          style={styles.backBtn}
          onClick={() => navigate("/login")}
        >
          ← Volver al inicio de sesión
        </button>
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
    maxWidth: "420px",
    textAlign: "center"
  },
  icon: { fontSize: "2.5rem", marginBottom: "16px" },
  title: {
    fontFamily: "'Nanum Myeongjo', serif",
    fontSize: "2rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #fff 30%, #ff8fab 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 8px"
  },
  sub: { color: "#8a8499", fontSize: "14px", margin: "0 0 4px" },
  email: { color: "#ff8fab", fontSize: "14px", fontWeight: 600, marginBottom: "28px" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  digitsRow: { display: "flex", gap: "10px", justifyContent: "center" },
  digitInput: {
    width: "48px",
    height: "56px",
    background: "#0a0a0f",
    border: "1px solid rgba(230,62,109,0.3)",
    borderRadius: "10px",
    color: "#f0eaf5",
    fontSize: "22px",
    fontWeight: 700,
    textAlign: "center",
    outline: "none",
    transition: "border-color .2s, box-shadow .2s",
    fontFamily: "'DM Sans', sans-serif"
  },
  error: { color: "#ff8fab", fontSize: "13px", margin: 0 },
  timer: { color: "#8a8499", fontSize: "13px" },
  btn: {
    background: "linear-gradient(135deg, #e63e6d, #ff8fab)",
    border: "none",
    borderRadius: "8px",
    padding: "13px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "opacity .2s"
  },
  footer: { marginTop: "20px" },
  footerText: { color: "#8a8499", fontSize: "13px" },
  resendBtn: {
    background: "none",
    border: "none",
    color: "#e63e6d",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
    fontFamily: "'DM Sans', sans-serif"
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#8a8499",
    fontSize: "12px",
    cursor: "pointer",
    marginTop: "16px",
    fontFamily: "'DM Sans', sans-serif"
  }
};
