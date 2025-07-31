// src/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "./utils/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // User object from /users/me
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Hydrate authentication state from backend on mount and on focus
  const hydrate = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setIsAuthChecked(true);
    }
  };

  useEffect(() => {
    hydrate();
    // Optionally refresh auth state on tab focus (for more robustness)
    window.addEventListener("focus", hydrate);
    return () => window.removeEventListener("focus", hydrate);
  }, []);

  // Call after any login/signup/email verify event
  const handleLogin = async () => {
    await hydrate();
  };

  // Call on logout
  const handleLogout = async () => {
    try {
      await api.post("/public/logout");
    } catch {}
    setUser(null);
    setIsAuthChecked(true);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthChecked,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
