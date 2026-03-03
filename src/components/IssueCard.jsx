import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useState } from "react";

// Ce composant reçoit en props : l'issue, et deux callbacks (fonctions)
// onVote : appelé quand l'utilisateur vote
// onResolved : appelé quand un admin résout l'issue
export default function IssueCard({ issue, onVote, onResolved }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [voteError, setVoteError] = useState("");

  async function handleVote(e) {
    // stopPropagation : évite que le clic sur le bouton ouvre aussi la page de détail
    e.stopPropagation();
    setVoteError("");
    try {
      await api.post(`/issues/${issue._id}/vote`);
      onVote(issue._id); // On notifie le parent pour mettre à jour le compteur
    } catch (err) {
      setVoteError("Déjà voté");
    }
  }

  async function handleResolve(e) {
    e.stopPropagation();
    try {
      await api.patch(`/issues/${issue._id}/resolve`);
      onResolved(); // On recharge la liste complète
    } catch (err) {
      alert("Erreur lors de la résolution");
    }
  }

  const categoryEmoji = {
    road: "🚗", lighting: "💡", waste: "🗑️", water: "💧", other: "❓"
  };

  return (
    // En cliquant sur la carte, on navigue vers la page de détail
    <div
      className={`issue-card ${issue.status === "resolved" ? "resolved" : ""}`}
      onClick={() => navigate(`/issues/${issue._id}`)}
      role="button"
    >
      <div className="card-top">
        <span className="card-category">
          {categoryEmoji[issue.category] || "❓"} {issue.category}
        </span>
        <span className={`status-badge status-${issue.status}`}>
          {issue.status === "open" ? "Ouvert" : "✅ Résolu"}
        </span>
      </div>

      <h3 className="card-title">{issue.title}</h3>

      {/* On tronque la description si elle est trop longue */}
      <p className="card-description">
        {issue.description.length > 100
          ? issue.description.substring(0, 100) + "..."
          : issue.description}
      </p>

      {issue.location?.address && (
        <p className="card-location">📍 {issue.location.address}</p>
      )}

      <div className="card-footer">
        <span className="card-votes">👍 {issue.votesCount} votes</span>

        {/* Bouton vote : seulement si connecté et issue encore ouverte */}
        {user && issue.status === "open" && (
          <button className="btn-vote-small" onClick={handleVote}>
            Voter
          </button>
        )}

        {/* Bouton resolve : seulement pour les admins */}
        {user?.role === "admin" && issue.status === "open" && (
          <button className="btn-resolve-small" onClick={handleResolve}>
            ✅ Résoudre
          </button>
        )}

        {voteError && <span className="error-small">{voteError}</span>}
      </div>
    </div>
  );
}