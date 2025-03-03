import { Navigate, useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuthStore } from "@/components/Contexts/AuthContext";
import { toast } from "@/components/Error/ErrorSonner";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthorized } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  if (!isAuthorized) {
    if (isAuthorized === false) {
      toast({
        title: "Login / Sign Up Required",
        description: "You must login or sign up in order to access this page",
        button: {
          label: "Go to Login",
          onClick: () => navigate("/login"),
        },
      });
    }
  }

  return isAuthorized ? <>{children}</> : <Navigate to="/login" />;
}

export default ProtectedRoute;
