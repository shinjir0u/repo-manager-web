import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Repositories.css";

const Repositories = () => {
  const { user } = useAuth();
  const [repos, setRepos] = useState(null);
  const [error, setError] = useState(null);
  const [githubToken, setGithubToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check GitHub token from sessionStorage on mount
  useEffect(() => {
    const token = sessionStorage.getItem("github_token");
    if (token) {
      setGithubToken(token);
    }
  }, []);

  useEffect(() => {
    if (user && githubToken) {
      fetchRepos();
    }
  }, [user, githubToken]);

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.BACKEND_DOMAIN}:8080/repos`, {
        headers: {
          Authorization: `Bearer ${user.token.value}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      setRepos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // No user logged in
  if (!user) {
    return (
      <div>
        <h1>Repositories</h1>
        <p>
          Please <Link to="/login">login</Link> to view repositories.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Repositories</h1>

      {/* GitHub Auth Section */}
      {!githubToken ? (
        <div className="auth-section">
          <button
            onClick={() =>
              (window.location.href = "http://localhost:8080/github/authorize")
            }
            className="github-auth-btn"
          >
            🔐 Connect GitHub Account
          </button>
        </div>
      ) : (
        <div className="status-section">
          <span className="status-success">✅ GitHub Connected</span>
          <button
            onClick={fetchRepos}
            className="refresh-btn"
            disabled={loading}
          >
            {loading ? "Loading..." : "🔄 Refresh"}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-section">
          <p className="error">{error}</p>
          <button onClick={fetchRepos} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {githubToken && !repos && !error && (
        <p className="loading">Loading repositories...</p>
      )}

      {/* Repositories List */}
      {repos && repos.length > 0 && (
        <div className="repo-list">
          {repos.map((repo) => (
            <div className="repo-card" key={repo.id}>
              <h2>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </h2>
              <p className="repo-fullname">{repo.fullname}</p>
              {repo.description && <p>{repo.description}</p>}
              <Link to={`/repos/${repo.name}/commits`} className="commits-btn">
                View Commits
              </Link>
            </div>
          ))}
        </div>
      )}

      {repos && repos.length === 0 && <p>No repositories found.</p>}
    </div>
  );
};

export default Repositories;
