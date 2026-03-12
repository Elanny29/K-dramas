import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Fuentes de Google
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
document.head.appendChild(link);

// Estilos globales
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0a0a0f; }
  ::-webkit-scrollbar-thumb { background: rgba(230,62,109,0.4); border-radius: 3px; }

  /* Hover para las cards - no se puede hacer en inline styles */
  .serie-card:hover {
    transform: translateY(-8px) scale(1.01) !important;
    box-shadow: 0 24px 60px rgba(230,62,109,0.18), 0 4px 16px rgba(0,0,0,0.5) !important;
    border-color: rgba(230,62,109,0.5) !important;
  }
  .serie-card:hover img {
    transform: scale(1.06);
  }
  .image-overlay-hover:hover { opacity: 1 !important; }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<React.StrictMode><App /></React.StrictMode>);
