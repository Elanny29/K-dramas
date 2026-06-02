import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage       from "./pages/HomePage";
import LoginPage      from "./pages/LoginPage";
import RegisterPage   from "./pages/RegisterPageTemp";
import VerifyPage     from "./pages/VerifyPage";

function PrivateRoute({ children }) {
  const { user, loading, pendingVerification } = useAuth();

  if (loading) return <p style={{ color: "#f0eaf5", textAlign: "center", marginTop: "40vh" }}>Cargando...</p>;

  // Pendiente de verificar 2FA → forzar a /verificar
  if (pendingVerification) return <Navigate to="/verificar" replace />;

  // No autenticado → forzar a /login
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/registro"  element={<RegisterPage />} />
      <Route path="/verificar" element={<VerifyPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
