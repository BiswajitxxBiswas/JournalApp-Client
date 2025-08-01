import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // cookies are automatically sent
});

let isRefreshing = false;
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.config) return Promise.reject(error);

    const originalRequest = error.config;
    const status = error.response?.status;

    // If this is the initial hydration call, don't try to refresh.
    // Let the AuthContext handle the error gracefully.
    if (originalRequest._isHydration) {
      return Promise.reject(error);
    }

    const isPublicAuthRoute = [
      "/public/login",
      "/public/refresh",
      "/public/logout",
    ].some((path) => originalRequest.url.endsWith(path));

    // Prevent infinite retry loop on failed refresh
    if (originalRequest._retryEnd) {
      return Promise.reject(error);
    }

    // Only trigger refresh for access errors on protected endpoints
    if (
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      !isPublicAuthRoute
    ) {
      originalRequest._retry = true;

      // Use global promise to ensure only one concurrent refresh
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = api
          .post("/public/refresh")
          .then((res) => {
            isRefreshing = false;
            return res;
          })
          .catch((err) => {
            isRefreshing = false;
            throw err;
          });
      }

      try {
        await refreshPromise;
        return api(originalRequest); // Retry failed request with new access token
      } catch (refreshError) {
        // Mark to prevent recursive loops
        originalRequest._retryEnd = true;
        // Do not use localStorage! Just handle logout logic here
        toast.error("Session expired. Please log in again.");

        // Redirect after slight delay to allow toast to show
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return Promise.reject(refreshError);
      }
    }

    // On all other errors, just propagate
    return Promise.reject(error);
  }
);

export default api;
