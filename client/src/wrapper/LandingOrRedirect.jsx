// wrapper/LandingOrRedirect.js
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";
import Landing from "../pages/Landing";

export default function LandingOrRedirect() {
  const { isAuthenticated, isAuthChecked } = useAuth();
  if (!isAuthChecked) return null; // or a loading spinner
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}
