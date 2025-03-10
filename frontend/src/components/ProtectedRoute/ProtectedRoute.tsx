import { useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { useGetStore } from "@/components/Contexts/AuthStore";
import useConfirmationStore from "../Contexts/ConfirmationStore";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; 
}

function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { isAuthorized, role } = useGetStore();
  const { openConfirmation } = useConfirmationStore()
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthorized === false) {
      navigate("/access-denied");
      openConfirmation({
        title: "Login / Sign Up Required",
        description: "You must login or sign up in order to access this page",
        cancelLabel: "Cancel",
        actionLabel: "Go to Login",
        onAction: () => { () => navigate("/login") },
        onCancel: () => { },
      });
    } else if (isAuthorized && allowedRoles.length > 0 && !allowedRoles.includes(role ?? "")) {
      openConfirmation({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        cancelLabel: "Cancel",
        actionLabel: "Go to Home",
        onAction: () => { },
        onCancel: () => { () => navigate("/") },
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