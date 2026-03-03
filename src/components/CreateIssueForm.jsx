import { useState } from "react";
import api from "../api/axios";

// Ce formulaire reçoit une prop `onCreated` :
// c'est une fonction appelée par le parent pour récupérer la nouvelle issue
export default function CreateIssueForm({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other",
    location: { address: "", lat: "", lng: "" },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Mise à jour d'un champ de premier niveau (title, description, category)
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Mise à jour d'un sous-champ de location (address, lat, lng)
  // On utilise le spread pour ne modifier que le sous-objet concerné
  function handleLocationChange(e) {
    setForm({
      ...form,
      location: { ...form.location, [e.target.name]: e.target.value },
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Le backend attend lat et lng comme des nombres, pas des strings
      // parseFloat convertit "48.85" en 48.85
      const payload = {
        ...form,
        location: {
          ...form.location,
          lat: parseFloat(form.location.lat),
          lng: parseFloat(form.location.lng),
        },
      };

      const res = await api.post("/issues", payload);
      onCreated(res.data); // On transmet la nouvelle issue au composant parent
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-form-container">
      <h3>📍 Signaler un problème</h3>
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titre *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ex: Lampadaire cassé rue Victor Hugo"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Décris le problème en détail (min. 10 caractères)"
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label>Catégorie</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="road">🚗 Route</option>
            <option value="lighting">💡 Éclairage</option>
            <option value="waste">🗑️ Déchets</option>
            <option value="water">💧 Eau</option>
            <option value="other">❓ Autre</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Adresse</label>
            <input
              name="address"
              value={form.location.address}
              onChange={handleLocationChange}
              placeholder="Rue, ville..."
            />
          </div>

          <div className="form-group">
            <label>Latitude *</label>
            <input
              name="lat"
              type="number"
              step="any"
              value={form.location.lat}
              onChange={handleLocationChange}
              placeholder="Ex: 48.8566"
              required
            />
          </div>

          <div className="form-group">
            <label>Longitude *</label>
            <input
              name="lng"
              type="number"
              step="any"
              value={form.location.lng}
              onChange={handleLocationChange}
              placeholder="Ex: 2.3522"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Envoi..." : "📤 Signaler"}
        </button>
      </form>
    </div>
  );
}