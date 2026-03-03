import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

// 1. On crée le "conteneur" global — c'est une boîte vide pour l'instant
const AuthContext = createContext();

// 2. Le Provider : c'est lui qui FOURNIT les données à toute l'app
// Tout composant enfant peut accéder à { user, token, login, logout }
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // L'utilisateur connecté (ou null)
  const [token, setToken] = useState(localStorage.getItem("token")); // Token JWT

  // Au chargement de l'app : si un token existe déjà dans localStorage,
  // on va chercher les infos de l'utilisateur pour "restaurer" la session
  useEffect(() => {
    if (token) {
      api.get("/me")
        .then((res) => setUser(res.data.user))
        .catch(() => {
          // Token expiré ou invalide → on déconnecte
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  // Appelé après un login réussi
  // On stocke le token en localStorage (persistant) et en state (réactif)
  function login(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  // Déconnexion : on efface tout
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook custom : au lieu d'écrire useContext(AuthContext) partout,
// on crée un raccourci useAuth() — plus propre et lisible
export function useAuth() {
  return useContext(AuthContext);
}