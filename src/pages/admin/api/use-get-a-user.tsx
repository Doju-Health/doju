import { API } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetAUser = (userId: string) => {
  const getAUser = async () => {
    const response = await API.get(`/admin/users/${userId}`);
    return response.data;
  };

  return useQuery({
    queryKey: ["user", userId],
    queryFn: getAUser,
  });
};
