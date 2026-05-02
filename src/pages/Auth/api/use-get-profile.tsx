"use client";
import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

export const useGetUserProfile = () => {
  const location = useLocation();
  const isAuthPage = location?.pathname === "/auth";
  const getUserProfile = async () => {
    try {
      const response = await API.get(`/auth/me`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error;
    }
  };

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    enabled: !isAuthPage && !!location,
    retry: false,
  });
};
