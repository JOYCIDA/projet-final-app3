import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import IssueCard from "../components/IssueCard";
import CreateIssueForm from "../components/CreateIssueForm";

export default function IssuesList() {
  const [issues, setIssues] = useState([]);       // La liste des issues
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // Afficher/cacher le formulaire de création
  const [filters, setFilters] = useState({ status: "", category: "", q: "" });

  const { user } = useAuth(); // On récupère l'utilisateur connecté depuis le Context

  // useEffect : s'exécute quand le composant s'affiche, et quand `filters` change
  useEffect(() => {
    fetchIssues();
  }, [filters]);

  async function fetchIssues() {
    setLoading(true);
    try {
      // On construit les query params à partir des filtres
      // Exemple : GET /issues?status=open&category=road
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.q) params.q = filters.q;

      const res = await api.get("/issues", { params });
      setIssues(res.data);
    } catch (err) {
      console.error("Erreur chargement issues:", err);
    } finally {
      setLoading(false);
    }
  }

  // Appelé par le formulaire de création quand une nouvelle issue est créée
  // On l'ajoute au début de la liste sans recharger toute la page
  function handleNewIssue(newIssue) {
    setIssues((prev) => [newIssue, ...prev]);
    setShowForm(false);
  }

  // Appelé par IssueCard quand un vote est effectué → on met à jour le compteur localement
  function handleVoteUpdate(issueId) {
    setIssues((prev) =>
      prev.map((issue) =>
        issue._id === issueId
          ? { ...issue, votesCount: issue.votesCount + 1 }
          : issue
      )
    );
  }

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="page-header">
        <h1>🏙️ Problèmes signalés</h1>
        {/* Le bouton "Signaler" n'apparaît que si l'utilisateur est connecté */}
        {user ? (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Fermer" : "+ Signaler un problème"}
          </button>
        ) : (
          <Link to="/login" className="btn-secondary">
            Connectez-vous pour signaler
          </Link>
        )}
      </div>

      {/* FORMULAIRE DE CRÉATION (conditionnel) */}
      {showForm && (
        <CreateIssueForm onCreated={handleNewIssue} />
      )}

      {/* FILTRES */}
      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Rechercher..."
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          className="filter-input"
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="">Tous les statuts</option>
          <option value="open">Ouvert</option>
          <option value="resolved">Résolu</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="filter-select"
        >
          <option value="">Toutes les catégories</option>
          <option value="road">🚗 Route</option>
          <option value="lighting">💡 Éclairage</option>
          <option value="waste">🗑️ Déchets</option>
          <option value="water">💧 Eau</option>
          <option value="other">❓ Autre</option>
        </select>
      </div>

      {/* LISTE DES ISSUES */}
      {loading ? (
        <p className="loading-text">Chargement...</p>
      ) : issues.length === 0 ? (
        <p className="empty-text">Aucun problème signalé pour le moment.</p>
      ) : (
        <div className="issues-grid">
          {issues.map((issue) => (
            // On passe chaque issue à IssueCard avec les callbacks nécessaires
            <IssueCard
              key={issue._id}
              issue={issue}
              onVote={handleVoteUpdate}
              onResolved={fetchIssues} // Après resolve, on recharge tout
            />
          ))}
        </div>
      )}
    </div>
  );
}