import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { JournalNavbar } from "./components/JournalNavbar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateEntry from "./pages/CreateEntry";
import NotFound from "./pages/NotFound";
import api from "./utils/auth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ isAuthenticated, isAuthChecked, children }) => {
  if (!isAuthChecked) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ isAuthenticated, isAuthChecked, children }) => {
  if (!isAuthChecked) return null;
  return children;
};

const AppContent = ({ isAuthenticated, isAuthChecked, onLogin, onLogout }) => {
  const location = useLocation();
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
    const checkAuth = async () => {
      try {
        const response = await api.get("/users/me");
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (err) {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
      } finally {
        setIsAuthChecked(true);
      }
    };
    checkAuth();

    const syncAuth = () => {
      if (localStorage.getItem("isAuthenticated") !== "true") {
        setIsAuthenticated(false);
      }
    };
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    toast.info("You have been logged out.");
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
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
