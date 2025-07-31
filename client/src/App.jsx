import React from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./AuthContext"; 
import { JournalNavbar } from "./components/JournalNavbar";
import LandingOrRedirect from "./wrapper/LandingOrRedirect";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateEntry from "./pages/CreateEntry";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Route guard for logged-in routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthChecked } = useAuth();
  if (!isAuthChecked) return null; // or a spinner
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// For routes accessible to anyone
const PublicRoute = ({ children }) => {
  const { isAuthChecked } = useAuth();
  if (!isAuthChecked) return null;
  return children;
};

// Your main app content, grabs auth state from context
const AppContent = () => {
  const { isAuthenticated, isAuthChecked, handleLogin, handleLogout } = useAuth();
  const location = useLocation();
  const isNotFoundPage = location.pathname === "/404";

  return (
    <div className="min-h-screen bg-background">
      {!isNotFoundPage && (
        <JournalNavbar
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      )}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <LandingOrRedirect
              isAuthenticated={isAuthenticated}
              isAuthChecked={isAuthChecked}
            />
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login onLogin={handleLogin} />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup onLogin={handleLogin} />
            </PublicRoute>
          }
        />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

// App root
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
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
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
