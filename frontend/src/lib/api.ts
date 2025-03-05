import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

//switch to local when developing and vercel in deployment (every git commit)
//make sure to makemigrations and migrate before deploying
const api = axios.create({
  baseURL: import.meta.env.VITE_VERCEL_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
