import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

// Redirects already-authenticated users away from the login/register pages.
export default function PublicRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) return <Spinner label="Loading..." />;
  if (session) return <Navigate to="/dashboard" replace />;

  return children;
}
