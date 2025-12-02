import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Commits = () => {
  const { user } = useAuth();
  const { repo } = useParams();
  const [commits, setCommits] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCommits = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("github_token");
        if (!token) {
          throw new Error(
            "GitHub token missing. Please connect your GitHub account."
          );
        }

        // Your backend endpoint to get commits for repoId
        const response = await fetch(
          `http://localhost:8080/repos/shinjir0u/${repo}/commits`,
          {
            headers: {
              Authorization: `Bearer ${user.token.value}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch commits");
        }

        const data = await response.json();

        // Map backend CommitResponse structure to UI model
        const mappedCommits = data.map((commitResp) => ({
          id: commitResp.sha,
          message: commitResp.commit.message,
          author: commitResp.commit.author?.name || "Unknown",
          date:
            new Date(commitResp.commit.author?.date).toLocaleString() || "N/A",
          hash: commitResp.sha,
          url: commitResp.htmlUrl, // Use html_url from backend as the commit URL
        }));

        setCommits(mappedCommits);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, [repo]);

  return (
    <div>
      <div className="commits-header">
        <Link to="/repositories" className="back-btn">
          &larr; Back to Repositories
        </Link>
        <h1>Commits for Repository #{repo}</h1>
      </div>

      {loading && <p>Loading commits...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && commits && commits.length === 0 && (
        <p>No commits found for this repository.</p>
      )}

      {!loading && !error && commits && commits.length > 0 && (
        <div className="commits-list">
          {commits.map((commit) => (
            <div key={commit.id} className="commit-item">
              <div className="commit-message">
                <strong>
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {commit.message}
                  </a>
                </strong>
              </div>
              <div className="commit-meta">
                <span>Author: {commit.author}</span>
                <span>Date: {commit.date}</span>
                <span>Commit: {commit.hash}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Commits;
