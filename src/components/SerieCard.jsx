import { useState } from "react";

export default function SerieCard({ serie, onClick, onEdit, onDelete, isAdmin, isLogged, esFavorito, onToggleFavorito, index }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{ ...styles.card, animationDelay: `${index * 0.04}s` }} onClick={onClick}>

      <div style={styles.imgWrap}>
        {serie.img && !imgError ? (
          <img src={serie.img} alt={serie.title} style={styles.img}
            onError={() => setImgError(true)} />
        ) : (
          <div style={styles.ph}>
            <div style={styles.phTitle}>{serie.title}</div>
          </div>
        )}
        <div style={styles.overlay} />
        <span style={styles.badge}>{serie.badge}</span>

        {/* Boton favorito — solo para usuarios logueados */}
        {isLogged && (
          <button
            style={{ ...styles.favBtn, ...(esFavorito ? styles.favActive : {}) }}
            onClick={e => { e.stopPropagation(); onToggleFavorito(serie.id); }}
            title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            {esFavorito ? "♥" : "♡"}
          </button>
        )}
      </div>

      <div style={styles.body}>
        <div style={styles.title}>{serie.title}</div>
        <div style={styles.desc}>{serie.desc}</div>
        <div style={styles.tags}>
          {(serie.tags || []).slice(0, 3).map(t => (
            <span key={t} style={styles.tag}>{t}</span>
          ))}
        </div>

        {/* Botones admin/usuario logueado */}
        {isLogged && (
          <div style={styles.adminRow} onClick={e => e.stopPropagation()}>
            <button style={styles.editBtn} onClick={() => onEdit(serie)}>Editar</button>
            {isAdmin && (
              <button style={styles.deleteBtn} onClick={() => onDelete(serie)}>Borrar</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#1a1a26",
    border: "1px solid rgba(230,62,109,0.2)",
    borderRadius: "12px", overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
    animation: "fadeUp 0.5s ease both",
    position: "relative"
  },
  imgWrap: {
    position: "relative", width: "100%",
    aspectRatio: "2/3", overflow: "hidden"
  },
  img: {
    width: "100%", height: "100%",
    objectFit: "cover", display: "block",
    transition: "transform 0.4s ease"
  },
  ph: {
    width: "100%", height: "100%",
    background: "linear-gradient(135deg, #12121a 0%, #2a1520 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "24px", textAlign: "center"
  },
  phTitle: {
    fontFamily: "'Nanum Myeongjo', serif",
    fontSize: "0.95rem", fontWeight: 700,
    color: "#ff8fab", lineHeight: 1.5
  },
  overlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: "50%",
    background: "linear-gradient(to top, rgba(10,10,15,0.95), transparent)",
    pointerEvents: "none"
  },
  badge: {
    position: "absolute", top: "12px", left: "12px",
    background: "#e63e6d", color: "#fff",
    fontSize: "10px", fontWeight: 500,
    letterSpacing: "1px", textTransform: "uppercase",
    padding: "4px 10px", borderRadius: "4px", zIndex: 2
  },
  favBtn: {
    position: "absolute", top: "10px", right: "10px",
    width: "32px", height: "32px",
    borderRadius: "50%",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff", fontSize: "16px",
    cursor: "pointer", zIndex: 2,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s"
  },
  favActive: {
    background: "rgba(230,62,109,0.85)",
    borderColor: "#e63e6d"
  },
  body: { padding: "14px 16px 16px" },
  title: {
    fontFamily: "'Nanum Myeongjo', serif",
    fontSize: "1rem", fontWeight: 700,
    color: "#f0eaf5", marginBottom: "6px", lineHeight: 1.3
  },
  desc: {
    fontSize: "12px", color: "#8a8499",
    lineHeight: 1.6,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    marginBottom: "10px"
  },
  tags: { display: "flex", gap: "6px", flexWrap: "wrap" },
  tag: {
    fontSize: "10px", color: "#e63e6d",
    border: "1px solid rgba(230,62,109,0.25)",
    padding: "3px 10px", borderRadius: "100px"
  },
  adminRow: {
    display: "flex", gap: "8px",
    marginTop: "12px", paddingTop: "10px",
    borderTop: "1px solid rgba(230,62,109,0.15)"
  },
  editBtn: {
    flex: 1,
    background: "rgba(230,62,109,0.1)",
    border: "1px solid rgba(230,62,109,0.3)",
    borderRadius: "6px", padding: "6px",
    color: "#ff8fab", cursor: "pointer",
    fontSize: "12px", fontFamily: "'DM Sans', sans-serif"
  },
  deleteBtn: {
    background: "rgba(255,80,80,0.1)",
    border: "1px solid rgba(255,80,80,0.3)",
    borderRadius: "6px", padding: "6px 10px",
    color: "#ff8f8f", cursor: "pointer",
    fontSize: "12px", fontFamily: "'DM Sans', sans-serif"
  }
};