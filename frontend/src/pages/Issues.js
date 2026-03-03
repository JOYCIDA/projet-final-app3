import { useEffect, useState } from "react";
import api from "../services/Api";
<button onClick={() => api.post(`/issues/${issue._id}/vote`)}>
  Upvote
</button>

function Issues() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    api.get("/issues")
      .then(res => setIssues(res.data));
  }, []);

  return (
    <div>
      {issues.map(issue => (
        <div key={issue._id}>
          <h3>{issue.title}</h3>
          <p>{issue.description}</p>
        </div>
      ))}
    </div>
  );
}