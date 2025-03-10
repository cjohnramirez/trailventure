import { create } from "zustand";
import api from "@/api/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants";
import { jwtDecode } from "jwt-decode";

interface GetState {
  loading: boolean;
  loadingMessage: string;
  isAuthorized: boolean | null;
  role: "host" | "customer" | null;
  isAllowedToComment: boolean;
  setIsAuthorized: (value: boolean) => void;
  setRole: (role: "host" | "customer" | null) => void; 
  refreshToken: () => Promise<void>;
  auth: () => Promise<void>;
  isHost: () => boolean;
  isCustomer: () => boolean;
  setIsAllowedToComment: (value: boolean) => void;
}

export const useGetStore = create<GetState>((set) => ({
  loading: false,
  loadingMessage: "",
  isAuthorized: null,
  role: null,
  
  isAllowedToComment: false,
  setIsAllowedToComment: (value: boolean) => set({ isAllowedToComment: value }),

  setIsAuthorized: (value: boolean) => set({ isAuthorized: value }),
  setRole: (role: "host" | "customer" | null) => set({ role }),
  refreshToken: async () => {
    set({ loading: true });
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/apps/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        set({ isAuthorized: true });
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
      } else {
        set({ isAuthorized: false});
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
      set({ isAuthorized: true, role: decoded.role });
    }
  },
  isHost: (): boolean => useGetStore.getState().role === "host",
  isCustomer: (): boolean => useGetStore.getState().role === "customer",
}));
