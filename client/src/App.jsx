import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { JournalNavbar } from "./components/JournalNavbar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateEntry from "./pages/CreateEntry";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ isAuthenticated, isAuthChecked, children }) => {
  if (!isAuthChecked) return null; // or loading spinner
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ isAuthenticated, isAuthChecked, children }) => {
  if (!isAuthChecked) return null; // or loading spinner
  // Show public page for unauthenticated users.
  // Authenticated users see the page without forced redirect.
  return children;
};

const AppContent = ({ isAuthenticated, isAuthChecked, onLogin, onLogout }) => {
  const location = useLocation();
  console.log("Auth:", isAuthenticated, "Checked:", isAuthChecked, "Path:", location.pathname);

  const isNotFoundPage = location.pathname === "/404";

  return (
    <div className="min-h-screen bg-background">
      {!isNotFoundPage && <JournalNavbar isAuthenticated={isAuthenticated} onLogout={onLogout} />}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute isAuthenticated={isAuthenticated} isAuthChecked={isAuthChecked}>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute isAuthenticated={isAuthenticated} isAuthChecked={isAuthChecked}>
              <Login onLogin={onLogin} />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute isAuthenticated={isAuthenticated} isAuthChecked={isAuthChecked}>
              <Signup onLogin={onLogin} />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isAuthChecked={isAuthChecked}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isAuthChecked={isAuthChecked}>
              <CreateEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isAuthChecked={isAuthChecked}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch-All Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("userToken");
      const authStatus = localStorage.getItem("isAuthenticated");
      setIsAuthenticated(!!token && authStatus === "true");
      setIsAuthChecked(true);
    };
    checkAuth();

    // Optional: Listen to storage changes for sync between tabs
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent
            isAuthenticated={isAuthenticated}
            isAuthChecked={isAuthChecked}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
