import { useState, useRef } from "react";

const GENRES = [
  { value: "romance",  label: "Romance" },
  { value: "fantasia", label: "Fantasía" },
  { value: "drama",    label: "Drama" },
  { value: "thriller", label: "Thriller" }
];

const BADGE_MAP = {
  romance: "Romance", fantasia: "Fantasía",
  drama: "Drama", thriller: "Thriller"
};

const EMPTY = {
  title: "", genre: "romance", desc: "", fullDesc: "",
  tags: "", img: ""
};

export default function SerieForm({ initial, onSave, onClose, saving }) {
  const [form, setForm]         = useState(initial || EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]   = useState(initial?.img || "");
  const fileRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tags = form.tags
      ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
      : [];
    onSave(
      { ...form, badge: BADGE_MAP[form.genre], tags },
      imageFile,
      initial?.img
    );
  };

  return (
    <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
        <h2 style={styles.heading}>
          {initial ? "✏️ Editar serie" : "✦ Agregar serie"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* ── Imagen ── */}
          <label style={styles.label}>Imagen del póster</label>
          <div style={styles.imageArea} onClick={() => fileRef.current.click()}>
            {preview ? (
              <img src={preview} alt="preview" style={styles.previewImg} />
            ) : (
              <div style={styles.imagePlaceholder}>
                <span style={{ fontSize: "2rem" }}>🖼️</span>
                <span style={styles.imageHint}>Haz clic para seleccionar imagen de tu ordenador</span>
              </div>
            )}
            {preview && (
              <div style={styles.imageOverlay}>
                <span style={{ fontSize: "1.5rem" }}>📷 Cambiar</span>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImage}
          />

          {/* ── Campos ── */}
          <label style={styles.label}>Título *</label>
          <input style={styles.input} required
            value={form.title}
            onChange={e => set("title", e.target.value)}
            placeholder="Ej: Goblin" />

          <label style={styles.label}>Género *</label>
          <select style={styles.input} value={form.genre}
            onChange={e => set("genre", e.target.value)}>
            {GENRES.map(g => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>

          <label style={styles.label}>Descripción corta *</label>
          <textarea style={{ ...styles.input, height: "80px", resize: "vertical" }}
            required value={form.desc}
            onChange={e => set("desc", e.target.value)}
            placeholder="Descripción breve que aparece en la tarjeta..." />

          <label style={styles.label}>Descripción completa</label>
          <textarea style={{ ...styles.input, height: "110px", resize: "vertical" }}
            value={form.fullDesc}
            onChange={e => set("fullDesc", e.target.value)}
            placeholder="Descripción detallada que aparece en el modal..." />

          <label style={styles.label}>Etiquetas (separadas por coma)</label>
          <input style={styles.input}
            value={form.tags}
            onChange={e => set("tags", e.target.value)}
            placeholder="Romance, Comedia, Oficina" />

          <div style={styles.btnRow}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? "Guardando..." : initial ? "Guardar cambios" : "Agregar serie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.88)",
    backdropFilter: "blur(8px)",
    zIndex: 1100,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "20px"
  },
  modal: {
    background: "#1a1a26",
    border: "1px solid rgba(230,62,109,0.3)",
    borderRadius: "16px",
    maxWidth: "520px", width: "100%",
    maxHeight: "92vh", overflowY: "auto",
    padding: "32px 28px",
    position: "relative"
  },
  closeBtn: {
    position: "absolute", top: "14px", right: "14px",
    width: "34px", height: "34px", borderRadius: "50%",
    background: "rgba(0,0,0,0.5)", color: "#fff",
    border: "none", cursor: "pointer", fontSize: "15px"
  },
  heading: {
    fontFamily: "'Nanum Myeongjo', serif",
    fontSize: "1.4rem", fontWeight: 800,
    color: "#f0eaf5", marginBottom: "24px"
  },
  form: { display: "flex", flexDirection: "column", gap: "8px" },
  label: {
    color: "#8a8499", fontSize: "11px",
    letterSpacing: "1.5px", textTransform: "uppercase",
    marginTop: "8px"
  },
  input: {
    background: "#0a0a0f",
    border: "1px solid rgba(230,62,109,0.25)",
    borderRadius: "8px",
    padding: "11px 14px",
    color: "#f0eaf5", fontSize: "14px",
    outline: "none", width: "100%",
    fontFamily: "'DM Sans', sans-serif"
  },
  imageArea: {
    width: "100%", aspectRatio: "16/9",
    border: "2px dashed rgba(230,62,109,0.35)",
    borderRadius: "10px", overflow: "hidden",
    cursor: "pointer", position: "relative",
    background: "#0a0a0f",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  imagePlaceholder: {
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "10px"
  },
  imageHint: {
    color: "#8a8499", fontSize: "13px",
    textAlign: "center", maxWidth: "200px"
  },
  previewImg: {
    width: "100%", height: "100%", objectFit: "cover"
  },
  imageOverlay: {
    position: "absolute", inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: 0, transition: "opacity 0.2s",
    color: "#fff", fontWeight: 600,
    ":hover": { opacity: 1 }
  },
  btnRow: {
    display: "flex", gap: "12px",
    marginTop: "20px", justifyContent: "flex-end"
  },
  cancelBtn: {
    background: "transparent",
    border: "1px solid rgba(230,62,109,0.3)",
    borderRadius: "8px", padding: "11px 22px",
    color: "#8a8499", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontSize: "14px"
  },
  saveBtn: {
    background: "linear-gradient(135deg, #e63e6d, #ff8fab)",
    border: "none", borderRadius: "8px",
    padding: "11px 24px",
    color: "#fff", fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", fontSize: "14px"
  }
};
