// src/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "./utils/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const hydrate = async () => {
    try {
      // Add a custom config flag to this specific request
      const res = await api.get("/users/me", { _isHydration: true });
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
