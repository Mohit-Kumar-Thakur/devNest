import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Import from context

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return token ? <>{children}</> : <Navigate to={`/auth?redirect=${location.pathname}`} replace />;
}