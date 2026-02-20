"use client";
import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetUserProfile = () => {
  const getUserProfile = async () => {
    const response = await API.get(`/auth/me`);
    return response.data;
  };

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });
};
