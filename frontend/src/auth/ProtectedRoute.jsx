import { useAuth } from "./AuthContext.jsx";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { access } = useAuth();
  const location = useLocation();

  // If the user isn't logged in, redirect to login and pass along the URL they originally tried to visit
  if (!access) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}