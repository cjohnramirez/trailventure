import { Navigate, useNavigate } from "react-router-dom";
import { ReactNode, useContext } from "react";
import { AuthContext } from "../ProtectedRoute/AuthContext";
import { toast } from "../../components/Error/ErrorSonner";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    return <Navigate to="/login" />;
  }

  const { isAuthorized } = authContext;

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
