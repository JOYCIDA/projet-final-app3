import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();       // Efface le token du localStorage et du Context
    navigate("/");  // Redirige vers l'accueil
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        🏙️ CityTracker
      </Link>

      <div className="nav-links">
        <Link to="/">Problèmes</Link>

        {/* Si connecté : afficher username + déconnexion */}
        {user ? (
          <>
            <span className="nav-user">
              {/* On affiche un badge spécial pour les admins */}
              {user.role === "admin" ? "👑 " : "👤 "}
              {user.username}
            </span>
            <button className="btn-logout" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          /* Si non connecté : afficher les liens de connexion */
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register" className="btn-register">
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}