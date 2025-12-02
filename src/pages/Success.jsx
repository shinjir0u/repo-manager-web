import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../contexts/AuthContext";

const GithubSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loadUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const code = searchParams.get("code");
    if (!code) {
      setError("No authorization code received");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/github/login?code=" + code + "&state=12345", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.value,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to exchange code for token");
        return res.json();
      })
      .then((data) => {
        sessionStorage.setItem("github_token", "I exist");
        navigate("/repositories");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Connecting GitHub...</h1>
          <p>Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Authentication Failed</h1>
          <div className="error-message">{error}</div>
          <button
            onClick={() => navigate("/repositories")}
            className="login-button"
          >
            Back to Repositories
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default GithubSuccess;
