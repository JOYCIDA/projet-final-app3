import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import IssuesList from "./pages/IssuesList";
import IssueDetail from "./pages/IssueDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

// L'App est enveloppée dans AuthProvider → toutes les pages ont accès au Context
// BrowserRouter active le système de routing dans toute l'app
// Routes : conteneur de toutes les routes
// Route : chaque route associe une URL à un composant

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* La Navbar s'affiche sur TOUTES les pages car elle est hors de Routes */}
        <Navbar />

        <main>
          <Routes>
            {/* / → Page principale : liste des issues */}
            <Route path="/" element={<IssuesList />} />

            {/* /issues/abc123 → Page de détail d'une issue (:id est dynamique) */}
            <Route path="/issues/:id" element={<IssueDetail />} />

            {/* Pages d'authentification */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}