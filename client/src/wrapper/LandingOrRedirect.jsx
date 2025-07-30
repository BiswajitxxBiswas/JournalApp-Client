import { Navigate } from "react-router-dom";
import Landing from "../pages/Landing"; 

const LandingOrRedirect = ({ isAuthenticated, isAuthChecked }) => {
  if (!isAuthChecked) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Landing />;
};

export default LandingOrRedirect;