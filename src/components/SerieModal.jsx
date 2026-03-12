import { useEffect } from "react";

const PH_EMOJIS = ['🌸','💕','✨','🎭','💫','🌷','🎬','💝','🌺','⭐','🎀','💖','🌼','🦋','🌙'];
const phEmoji = (t) => { let h = 0; for (let c of t) h += c.charCodeAt(0); return PH_EMOJIS[h % PH_EMOJIS.length]; };

export default function SerieModal({ serie, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); };
  }, [onClose]);

  if (!serie) return null;

  return (
    <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        {serie.img ? (
          <img src={serie.img} alt={serie.title} style={styles.img}
            onError={e => { e.target.style.display = "none"; }} />
        ) : (
          <div style={styles.ph}>
            <span style={{ fontSize: "3rem" }}>{phEmoji(serie.title)}</span>
          </div>
        )}

        <div style={styles.body}>
          <div style={styles.badgeRow}>
            <span style={styles.badge}>{serie.badge}</span>
          </div>
          <h2 style={styles.title}>{serie.title}</h2>
          <p style={styles.desc}>{serie.fullDesc || serie.desc}</p>
          <div style={styles.tags}>
            {(serie.tags || []).map(t => (
              <span key={t} style={styles.tag}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(8px)",
    zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "20px"
  },
  modal: {
    background: "#1a1a26",
    border: "1px solid rgba(230,62,109,0.25)",
    borderRadius: "16px",
    maxWidth: "600px", width: "100%",
    maxHeight: "90vh", overflowY: "auto",
    position: "relative",
    animation: "scaleIn 0.25s ease"
  },
  closeBtn: {
    position: "absolute", top: "14px", right: "14px",
    width: "36px", height: "36px",
    borderRadius: "50%",
    background: "rgba(0,0,0,0.6)",
    color: "#fff", border: "none",
    cursor: "pointer", fontSize: "16px",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 2, backdropFilter: "blur(6px)"
  },
  img: {
    width: "100%", maxHeight: "320px",
    objectFit: "cover", display: "block",
    borderRadius: "16px 16px 0 0"
  },
  ph: {
    height: "200px",
    background: "linear-gradient(135deg, #1a1a26, #2a1520)",
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: "16px 16px 0 0"
  },
  body: { padding: "24px 28px 28px" },
  badgeRow: { marginBottom: "10px" },
  badge: {
    background: "#e63e6d", color: "#fff",
    fontSize: "10px", fontWeight: 600,
    letterSpacing: "1.5px", textTransform: "uppercase",
    padding: "4px 12px", borderRadius: "4px"
  },
  title: {
    fontFamily: "'Nanum Myeongjo', serif",
    fontSize: "1.7rem", fontWeight: 800,
    color: "#f0eaf5", margin: "0 0 14px"
  },
  desc: {
    color: "#8a8499", lineHeight: 1.75,
    fontSize: "14px", margin: "0 0 18px"
  },
  tags: { display: "flex", gap: "8px", flexWrap: "wrap" },
  tag: {
    fontSize: "11px", color: "#e63e6d",
    border: "1px solid rgba(230,62,109,0.25)",
    padding: "4px 12px", borderRadius: "100px"
  }
};
