import { create } from "zustand";
import { UserData } from "@/lib/UserPage/UserData";
import api from "../../lib/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants";
import { AxiosError } from "axios";
import { toast } from "../Error/ErrorSonner";
import { jwtDecode } from "jwt-decode";
import { tourPackage } from "@/lib/SearchPage/tourPackage";

interface GlobalState {
  isAuthorized: boolean | null;
  userData: UserData[] | null;
  packageData: tourPackage[] | null;
  setIsAuthorized: (value: boolean) => void;
  getUserData: () => Promise<void>;
  refreshToken: () => Promise<void>;
  auth: () => Promise<void>;
  getPackageData: (id: Number) => Promise<void>;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  isAuthorized: null,
  userData: null,
  packageData: null,

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
        await useGlobalStore.getState().getUserData();
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
      await useGlobalStore.getState().refreshToken();
    } else {
      await useGlobalStore.getState().getUserData();
      set({ isAuthorized: true });
    }
  },

  getPackageData: async (id : Number) => {
    try {
      const fetchPkg = await api.get(`apps/package/${id}/`);
      set({ packageData: fetchPkg.data });
    } catch (error) {
      const err = error as AxiosError;
      let errorMessage = "An unexpected error occurred.";

      if (err.response) {
        errorMessage = `Error ${err.response.status}: ${err.response.data || "Something went wrong"}`;
      } else if (err.request) {
        errorMessage =
          "Network error: Unable to reach the server. Please check your internet connection.";
      } else {
        errorMessage = err.message;
      }

      toast({
        title: "404 NOT FOUND",
        description: errorMessage,
      });
    }
  }
}));
