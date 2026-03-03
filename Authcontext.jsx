import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  // useState : chaque variable d'état déclenche un re-rendu quand elle change
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");       // Message d'erreur à afficher
  const [loading, setLoading] = useState(false); // Désactive le bouton pendant la requête

  const navigate = useNavigate(); // Pour rediriger vers une autre page

  async function handleSubmit(e) {
    e.preventDefault(); // Empêche le rechargement de la page (comportement HTML par défaut)
    setError("");
    setLoading(true);

    try {
      // On appelle POST /auth/register avec le username et password
      await api.post("/auth/register", { username, password });
      // Si ça marche → on redirige vers la page de login
      navigate("/login");
    } catch (err) {
      // Le backend renvoie l'erreur dans err.response.data.message
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false); // Toujours réactiver le bouton à la fin
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>📝 Créer un compte</h2>

        {/* On affiche l'erreur seulement si elle existe */}
        {error && <p className="error-msg">{error}</p>}

        {/* On utilise onSubmit sur le form, pas onClick sur le bouton */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Met à jour le state à chaque frappe
              placeholder="Minimum 3 caractères"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <p className="auth-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}