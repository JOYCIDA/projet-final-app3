import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/Api";

function IssueCard({ issue }) {
  const { user } = useContext(AuthContext);

  const handleVote = async () => {
    try {
      await api.post(`/issues/${issue._id}/vote`);
      alert("Vote enregistré !");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Vous avez déjà voté.");
      }
    }
  };

  const handleResolve = async () => {
    try {
      await api.patch(`/issues/${issue._id}/resolve`);
      alert("Issue résolue !");
    } catch {
      alert("Action non autorisée.");
    }
  };

  return (
    <div>
      <h3>{issue.title}</h3>
      <p>{issue.description}</p>

      {/* Bouton Vote */}
      {user && (
        <button onClick={handleVote}>
          Upvote ({issue.votes.length})
        </button>
      )}

      {/* Bouton Admin */}
      {user?.role === "admin" && (
        <button onClick={handleResolve}>
          Resolve
        </button>
      )}
    </div>
  );
}

export default IssueCard;