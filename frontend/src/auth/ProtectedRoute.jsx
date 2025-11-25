import { useAuth } from "./AuthContext.jsx";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { access } = useAuth();

  if (!access) return <Navigate to="/login" replace />;

  return children;
}