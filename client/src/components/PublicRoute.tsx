import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type PublicRouteProps = {
  children: React.ReactNode;
};

export default function PublicRoute({ children }: PublicRouteProps) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return children;
}