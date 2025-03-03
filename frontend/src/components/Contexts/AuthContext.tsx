import { create } from "zustand";
import { UserData } from "@/lib/UserPage/UserData";
import api from "../../lib/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants";
import { AxiosError } from "axios";
import { toast } from "../Error/ErrorSonner";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  isAuthorized: boolean | null;
  userData: UserData[] | null;
  setIsAuthorized: (value: boolean) => void;
  getUserData: () => Promise<void>;
  refreshToken: () => Promise<void>;
  auth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthorized: null,
  userData: null,

  setIsAuthorized: (value: boolean) => set({ isAuthorized: value }),

  getUserData: async () => {
    try {
      const response = await api.get(`/apps/users/customer/profile/`);
      set({ userData: response.data });
    } catch (error) {
      const err = error as AxiosError;
      let errorMessage = "An unexpected error occurred.";

      if (err.response) {
        errorMessage = `Error ${err.response.status}: ${
          err.response.data || "Something went wrong"
        }`;
      } else if (err.request) {
        errorMessage =
          "Network error: Unable to reach the server. Please check your internet connection.";
      }

      toast({
        title: "404 NOT FOUND",
        description: errorMessage,
      });
    }
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/apps/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        await useAuthStore.getState().getUserData();
        set({ isAuthorized: true });
      } else {
        set({ isAuthorized: false });
      }
    } catch (error) {
      set({ isAuthorized: false });
    }
  },

  auth: async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      set({ isAuthorized: false });
      return;
    }

    const decoded: any = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration && tokenExpiration < now) {
      await useAuthStore.getState().refreshToken();
    } else {
      await useAuthStore.getState().getUserData();
      set({ isAuthorized: true });
    }
  },
}));
