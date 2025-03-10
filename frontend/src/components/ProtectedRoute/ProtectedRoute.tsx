import { useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { useGetStore } from "@/components/Contexts/AuthContext";
import { toast } from "@/components/Error/ErrorSonner";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; 
}

function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { isAuthorized, role } = useGetStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthorized === false) {
      toast({
        title: "Login / Sign Up Required",
        description: "You must login or sign up in order to access this page",
        button: {
          label: "Go to Login",
          onClick: () => navigate("/login"),
        },
      });
    } else if (isAuthorized && allowedRoles.length > 0 && !allowedRoles.includes(role ?? "")) {
      navigate("")
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        button: {
          label: "Go to Home",
          onClick: () => navigate("/"),
        },
      });
    }
  }, [isAuthorized, role, allowedRoles, navigate]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized || (allowedRoles.length > 0 && !allowedRoles.includes(role ?? ""))) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;