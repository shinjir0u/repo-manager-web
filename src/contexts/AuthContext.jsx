import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check token on app load
    loadUser();
    setLoading(false);
  }, []);

  const loadUser = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      try {
        setIsAuthenticated(true);
        const userData = {
          token,
        };
        setUser(userData);
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  };

  const login = (token) => {
    localStorage.setItem("token", JSON.stringify(token));
    setUser({ token });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("github_token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
