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

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = getStoredTokens();
        if (refreshToken) {
          const response = await axios.post(baseUrl, {
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
        removeStoredTokens();
        console.log(refreshError)
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error?.response?.data || error?.response || error);
  },
);
