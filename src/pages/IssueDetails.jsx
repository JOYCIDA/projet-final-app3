import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function IssueDetail() {
  // useParams récupère l'ID dans l'URL : /issues/abc123 → id = "abc123"
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [voteMsg, setVoteMsg] = useState("");
  const [commentMsg, setCommentMsg] = useState("");

  // Au chargement : on récupère l'issue ET ses commentaires en parallèle
  useEffect(() => {
    async function load() {
      try {
        // Promise.all exécute les deux requêtes en même temps → plus rapide
        const [issueRes, commentsRes] = await Promise.all([
          api.get(`/issues/${id}`),
          api.get(`/issues/${id}/comments`),
        ]);
        setIssue(issueRes.data);
        setComments(commentsRes.data);
      } catch {
        navigate("/"); // Si l'issue n'existe pas, on retourne à l'accueil
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleVote() {
    try {
      await api.post(`/issues/${id}/vote`);
      setIssue((prev) => ({ ...prev, votesCount: prev.votesCount + 1 }));
      setVoteMsg("✅ Vote enregistré !");
    } catch (err) {
      setVoteMsg(err.response?.data?.message || "Erreur");
    }
  }

  async function handleResolve() {
    try {
      // PATCH /issues/:id/resolve → admin seulement
      await api.patch(`/issues/${id}/resolve`);
      setIssue((prev) => ({ ...prev, status: "resolved" }));
    } catch (err) {
      alert(err.response?.data?.message || "Erreur");
    }
  }

  async function handleComment(e) {
    e.preventDefault();
    try {
      const res = await api.post(`/issues/${id}/comments`, { content: newComment });
      // On ajoute le nouveau commentaire en tête de liste
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
      setCommentMsg("✅ Commentaire ajouté");
    } catch (err) {
      setCommentMsg(err.response?.data?.message || "Erreur");
    }
  }

  if (loading) return <p className="loading-text">Chargement...</p>;
  if (!issue) return null;

  // Fonction utilitaire pour afficher la catégorie avec un emoji
  const categoryLabel = {
    road: "🚗 Route", lighting: "💡 Éclairage",
    waste: "🗑️ Déchets", water: "💧 Eau", other: "❓ Autre"
  };

  return (
    <div className="page-container detail-page">
      <button className="btn-back" onClick={() => navigate(-1)}>← Retour</button>

      {/* ISSUE PRINCIPALE */}
      <div className="issue-detail-card">
        <div className="issue-detail-header">
          <h1>{issue.title}</h1>
          {/* Badge de statut : couleur différente selon open/resolved */}
          <span className={`status-badge status-${issue.status}`}>
            {issue.status === "open" ? "🔴 Ouvert" : "✅ Résolu"}
          </span>
        </div>

        <p className="issue-category">{categoryLabel[issue.category] || issue.category}</p>
        <p className="issue-description">{issue.description}</p>

        {issue.location?.address && (
          <p className="issue-location">📍 {issue.location.address}</p>
        )}

        <div className="issue-actions">
          {/* Bouton vote : visible seulement si connecté */}
          {user && (
            <button className="btn-vote" onClick={handleVote}>
              👍 Voter ({issue.votesCount})
            </button>
          )}
          {!user && <span>👍 {issue.votesCount} votes</span>}

          {/* Message de feedback après vote */}
          {voteMsg && <span className="feedback-msg">{voteMsg}</span>}

          {/* Bouton resolve : visible seulement pour les admins */}
          {user?.role === "admin" && issue.status === "open" && (
            <button className="btn-resolve" onClick={handleResolve}>
              ✅ Marquer comme résolu
            </button>
          )}
        </div>
      </div>

      {/* SECTION COMMENTAIRES */}
      <div className="comments-section">
        <h2>💬 Commentaires ({comments.length})</h2>

        {/* Formulaire de commentaire : visible si connecté */}
        {user && (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              rows={3}
              required
            />
            <button type="submit" className="btn-primary">Envoyer</button>
            {commentMsg && <span className="feedback-msg">{commentMsg}</span>}
          </form>
        )}

        {/* Liste des commentaires */}
        {comments.length === 0 ? (
          <p className="empty-text">Aucun commentaire pour l'instant.</p>
        ) : (
          <div className="comments-list">
            {comments.map((c) => (
              <div key={c._id} className="comment-item">
                <div className="comment-header">
                  <strong>{c.user?.username || "Utilisateur"}</strong>
                  <span className="comment-date">
                    {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p>{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}