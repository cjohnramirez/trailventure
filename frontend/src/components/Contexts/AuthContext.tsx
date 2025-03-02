import { jwtDecode } from "jwt-decode";
import api from "../../lib/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants";
import { useState, useEffect, ReactNode, createContext } from "react";
import { UserData } from "@/lib/UserPage/UserData";
import { AxiosError } from "axios";
import { toast } from "../Error/ErrorSonner";

interface AuthContextType {
  isAuthorized: boolean;
  setIsAuthorized: (value: boolean) => void;
  userData: UserData | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const getUserData = async () => {
    try {
      const fetchUserData = await api.get(`/apps/users/customer/profile/`);
      setUserData(fetchUserData.data);
    } catch (error) {
      const err = error as AxiosError;
      let errorMessage = "An unexpected error occurred.";

      if (err.response) {
        errorMessage = `Error ${err.response.status}: ${err.response.data || "Something went wrong"}`;
      } else if (err.request) {
        errorMessage =
          "Network error: Unable to reach the server. Please check your internet connection.";
      } else {
        errorMessage = "Internal server error.";
      }

      toast({
        title: "404 NOT FOUND",
        description: errorMessage,
        button: {
          label: "Ignore",
          onClick: () => console.log("OK clicked"),
        },
      });
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/apps/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        getUserData();
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded: any = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration && tokenExpiration < now) {
      await refreshToken();
    } else {
      getUserData();
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthorized, setIsAuthorized, userData }}>
      {children}
    </AuthContext.Provider>
  );
}
