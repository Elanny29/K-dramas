import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSeries } from "../hooks/useSeries";
import { useFavoritos } from "../hooks/useFavoritos";
import SerieCard from "../components/SerieCard";
import SerieModal from "../components/SerieModal";
import SerieForm from "../components/SerieForm";

const FILTERS = [
  { value: "all",       label: "Todos" },
  { value: "romance",   label: "Romance" },
  { value: "fantasia",  label: "Fantasía" },
  { value: "drama",     label: "Drama" },
  { value: "thriller",  label: "Thriller" },
  { value: "favoritos", label: "Mis favoritos" }
];

export default function HomePage() {
  const { user, isAdmin, isLogged, logout } = useAuth();
  const { series, loading, addSerie, updateSerie, deleteSerie } = useSeries();
  const { esFavorito, toggleFavorito } = useFavoritos(user?.uid);

  const [filter, setFilter]         = useState("all");
  const [selected, setSelected]     = useState(null);
  const [editing, setEditing]       = useState(null);
  const [saving, setSaving]         = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const filtered = (() => {
    if (filter === "favoritos") return series.filter(s => esFavorito(s.id));
    if (filter === "all") return series;
    return series.filter(s => s.genre === filter);
  })();

  const handleSave = async (data, imageFile, oldImg) => {
    setSaving(true);
    try {
      if (editing === "new") {
        await addSerie(data, imageFile);
      } else {
        await updateSerie(editing.id, data, imageFile, oldImg);
      }
      setEditing(null);
    } catch (e) {
      console.error(e);
      alert("Error al guardar. Revisa la consola.");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    await deleteSerie(confirmDel.id, confirmDel.img);
    setConfirmDel(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.noise} />

      {/* ── Header ── */}
      <header style={styles.header}>
        <div style={styles.glow} />
        <span style={styles.logoTag}>Selección Coreana</span>
        <h1 style={styles.h1}>
          K-Drama<br />
          <span style={styles.h1Span}>World</span>
        </h1>
        <p style={styles.subtitle}>Las mejores series coreanas para enamorarte</p>

        <div style={styles.userBar}>
          {isLogged ? (
            <>
              <span style={styles.userBadge}>
                {isAdmin ? "Admin" : user?.displayName || user?.email}
              </span>
              <button style={styles.addBtn} onClick={() => setEditing("new")}>
                + Agregar serie
              </button>
              <button style={styles.logoutBtn} onClick={logout}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.authBtn}>Iniciar sesión</Link>
              <Link to="/registro" style={styles.authBtnPrimary}>Registrarse</Link>
            </>
          )}
        </div>
      </header>

      {/* ── Filtros ── */}
      <div style={styles.filterBar}>
        {FILTERS.map(f => {
          if (f.value === "favoritos" && !isLogged) return null;
          return (
            <button key={f.value}
              style={{ ...styles.filterBtn, ...(filter === f.value ? styles.filterActive : {}) }}
              onClick={() => setFilter(f.value)}>
              {f.label}
            </button>
          );
        })}
      </div>

      <p style={styles.resultsLabel}>
        Mostrando <span style={{ color: "#ff8fab", fontWeight: 500 }}>{filtered.length}</span> series
      </p>

      {/* ── Grid ── */}
      {loading ? (
        <div style={styles.loader}>Cargando series...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          {filter === "favoritos"
            ? <p>Aún no tienes series favoritas. Haz clic en el corazón de cualquier serie.</p>
            : <p>No hay series en esta categoría todavía.</p>
          }
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((s, i) => (
            <SerieCard
              key={s.id}
              serie={s}
              index={i}
              isAdmin={isAdmin}
              isLogged={isLogged}
              esFavorito={esFavorito(s.id)}
              onToggleFavorito={toggleFavorito}
              onClick={() => setSelected(s)}
              onEdit={() => setEditing(s)}
              onDelete={() => setConfirmDel(s)}
            />
          ))}
        </div>
      )}

      <footer style={styles.footer}>
        K-Drama World — Hecho con amor por fans, para fans
      </footer>

      {/* ── Modales ── */}
      {selected && <SerieModal serie={selected} onClose={() => setSelected(null)} />}

      {editing && (
        <SerieForm
          initial={editing === "new" ? null : editing}
          saving={saving}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {confirmDel && (
        <div style={styles.confirmOverlay} onClick={() => setConfirmDel(null)}>
          <div style={styles.confirmBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: "#f0eaf5", marginBottom: "10px" }}>Eliminar serie</h3>
            <p style={{ color: "#8a8499", fontSize: "14px", marginBottom: "20px" }}>
              "{confirmDel.title}" se eliminará permanentemente.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button style={styles.cancelBtn} onClick={() => setConfirmDel(null)}>Cancelar</button>
              <button style={styles.deleteConfirmBtn} onClick={handleDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", background: "#0a0a0f",
    color: "#f0eaf5", fontFamily: "'DM Sans', sans-serif",
    overflowX: "hidden"
  },
  noise: {
    position: "fixed", inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
    pointerEvents: "none", zIndex: 9999, opacity: 0.4
  },
  header: {
    position: "relative", textAlign: "center",
    padding: "70px 20px 50px", overflow: "hidden"
  },
  glow: {
    position: "absolute", top: "-60px", left: "50%",
    transform: "translateX(-50%)",
    width: "700px", height: "400px",
    background: "radial-gradient(ellipse, rgba(230,62,109,0.18) 0%, transparent 70%)",
    pointerEvents: "none"
  },
  logoTag: {
    display: "inline-block",
    fontSize: "11px", letterSpacing: "4px",
    textTransform: "uppercase", color: "#e63e6d",
    border: "1px solid rgba(230,62,109,0.25)",
    padding: "6px 18px", borderRadius: "2px", marginBottom: "22px"
  },
  h1: {
    fontFamily: "'Nanum Myeongjo', serif",
    fontSize: "clamp(3rem, 8vw, 5.5rem)",
    fontWeight: 800, lineHeight: 1, letterSpacing: "-2px",
    background: "linear-gradient(135deg, #fff 30%, #ff8fab 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
  },
  h1Span: {
    display: "block",
    background: "linear-gradient(135deg, #e63e6d 0%, #ff8fab 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
  },
  subtitle: {
    marginTop: "14px", color: "#8a8499",
    fontSize: "1rem", fontWeight: 300, letterSpacing: "1px"
  },
  userBar: {
    display: "flex", alignItems: "center",
    justifyContent: "center", gap: "12px",
    marginTop: "20px", flexWrap: "wrap"
  },
  userBadge: {
    fontSize: "12px", color: "#ff8fab",
    border: "1px solid rgba(230,62,109,0.3)",
    padding: "5px 14px", borderRadius: "100px"
  },
  addBtn: {
    background: "linear-gradient(135deg, #e63e6d, #ff8fab)",
    border: "none", borderRadius: "100px",
    padding: "8px 20px", color: "#fff",
    fontWeight: 600, cursor: "pointer",
    fontSize: "13px", fontFamily: "'DM Sans', sans-serif"
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid rgba(230,62,109,0.3)",
    borderRadius: "100px", padding: "8px 18px",
    color: "#8a8499", cursor: "pointer",
    fontSize: "13px", fontFamily: "'DM Sans', sans-serif"
  },
  authBtn: {
    color: "#8a8499", fontSize: "13px", textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "7px 18px", borderRadius: "100px"
  },
  authBtnPrimary: {
    background: "linear-gradient(135deg, #e63e6d, #ff8fab)",
    color: "#fff", fontSize: "13px", textDecoration: "none",
    fontWeight: 600, padding: "7px 18px", borderRadius: "100px"
  },
  filterBar: {
    display: "flex", justifyContent: "center",
    gap: "10px", flexWrap: "wrap", padding: "0 20px 44px"
  },
  filterBtn: {
    background: "#1a1a26", color: "#8a8499",
    border: "1px solid rgba(230,62,109,0.2)",
    padding: "8px 20px", borderRadius: "100px",
    fontSize: "13px", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s"
  },
  filterActive: { background: "#e63e6d", color: "#fff", borderColor: "#e63e6d" },
  resultsLabel: {
    textAlign: "center", fontSize: "12px", color: "#8a8499",
    letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "30px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "24px", maxWidth: "1300px",
    margin: "0 auto", padding: "0 24px 80px"
  },
  loader: { textAlign: "center", color: "#8a8499", fontSize: "1.1rem", padding: "80px 0" },
  empty: { textAlign: "center", color: "#8a8499", padding: "80px 20px", fontSize: "15px" },
  footer: {
    textAlign: "center", padding: "36px 20px",
    color: "#8a8499", fontSize: "12px", letterSpacing: "1px",
    borderTop: "1px solid rgba(230,62,109,0.1)"
  },
  confirmOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(6px)", zIndex: 1200,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
  },
  confirmBox: {
    background: "#1a1a26", border: "1px solid rgba(255,80,80,0.3)",
    borderRadius: "12px", padding: "28px", maxWidth: "360px", width: "100%"
  },
  cancelBtn: {
    background: "transparent", border: "1px solid rgba(230,62,109,0.3)",
    borderRadius: "8px", padding: "9px 20px",
    color: "#8a8499", cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
  },
  deleteConfirmBtn: {
    background: "linear-gradient(135deg, #ff4444, #ff8888)",
    border: "none", borderRadius: "8px", padding: "9px 20px",
    color: "#fff", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
  }
};