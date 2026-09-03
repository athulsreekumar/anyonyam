import axios from "axios";
import { readAuth, clearAuth } from "../auth/authStorage";

const baseURL = process.env.REACT_APP_BASE_URL;

if (!baseURL && process.env.NODE_ENV !== "test") {
  // Fail loudly at startup instead of every request silently hitting
  // "undefined/login" and failing with a confusing network error.
  // eslint-disable-next-line no-console
  console.error(
    "REACT_APP_BASE_URL is not set. Copy .env.example to .env and set it before starting the app."
  );
}

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const { token } = readAuth();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.assign("/Login");
      }
    }
    return Promise.reject(error);
  }
);
