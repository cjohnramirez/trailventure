import { create } from "zustand";
import api from "@/api/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants";
import { jwtDecode } from "jwt-decode";

interface GetState {
  loading: boolean;
  loadingMessage: string;
  isAuthorized: boolean | null;
  setIsAuthorized: (value: boolean) => void;
  refreshToken: () => Promise<void>;
  auth: () => Promise<void>;
}

export const useGetStore = create<GetState>((set) => ({
  loading: false,
  loadingMessage: "",
  isAuthorized: null,
  userData: null,
  packageData: null,

  setIsAuthorized: (value: boolean) => set({ isAuthorized: value }),

  refreshToken: async () => {
    set({ loading: true });
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/apps/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        set({ isAuthorized: true });
      } else {
        set({ isAuthorized: false });
      }
    } catch (error) {
      set({ isAuthorized: false });
    } finally {
      set({ loading: false });
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
      await useGetStore.getState().refreshToken();
    } else {
      set({ isAuthorized: true });
    }
  }
}));
