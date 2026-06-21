import axios from "axios";
import {
  getStoredTokens,
  removeStoredTokens,
  setStoredTokens,
} from "./local-storage";

export const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const API = axios.create({
  baseURL: baseUrl,
});

const getUnauthorizedRedirectPath = (requestUrl?: string) => {
  if (typeof window === "undefined") {
    return "/auth";
  }

  const isAdminRequest = requestUrl?.startsWith("/admin/");
  const isAdminPath = window.location.pathname.startsWith("/admin");

  return isAdminRequest || isAdminPath ? "/admin/login" : "/auth";
};

API.interceptors.request.use(
  (request) => {
    if (request.data instanceof FormData) {
      request.headers["Content-Type"] = "multipart/form-data";
    } else {
      request.headers["Content-Type"] = "application/json";
    }

    if (typeof window !== "undefined") {
      const { accessToken } = getStoredTokens();
      if (accessToken && !request.headers["Authorization"]) {
        request.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }
    return request;
  },
  (error) => {
    return Promise.reject(error?.response?.data || error?.response || error);
  },
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRequest = originalRequest?.url?.startsWith("/auth/");

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = getStoredTokens();
        if (refreshToken) {
          const response = await axios.post(`${baseUrl}/refresh`, {
            refreshToken,
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;
          setStoredTokens(newAccessToken, newRefreshToken);

          API.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        } else {
          throw new Error("No refresh token available");
        }
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.clear();
          removeStoredTokens();
          window.location.href = getUnauthorizedRedirectPath(
            originalRequest?.url,
          );
        }
        console.log(refreshError);
        // Only redirect to auth if user had a session (was previously logged in)
        // Don't redirect unauthenticated users who are just browsing
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error?.response?.data || error?.response || error);
  },
);
