"use client";
import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

export const useGetUserProfile = () => {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/auth";
  const getUserProfile = async () => {
    const response = await API.get(`/auth/me`);
    return response.data;
  };

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    enabled: !isAuthPage,
  });
};
