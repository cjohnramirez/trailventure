import { Navigate, useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { useGetStore } from "@/components/Contexts/GetContext";
import { toast } from "@/components/Error/ErrorSonner";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthorized } = useGetStore();
  const navigate = useNavigate();

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

  return isAuthorized ? <>{children}</> : <Navigate to={window.location.pathname} />;
}

export default ProtectedRoute;
