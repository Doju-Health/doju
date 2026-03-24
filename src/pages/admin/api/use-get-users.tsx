import { API } from "@/lib/axios";
import { buildQueryString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FilterProps, PaginatedUsersData } from "@/types";

export const useGetUsers = (filters?: FilterProps) => {
  const getUsers = async () => {
    const queryString = buildQueryString({ ...filters });
    const response: { data: PaginatedUsersData } = await API.get(
      `/admin/users${queryString ? `?${queryString}` : ""}`
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["users", filters],
    queryFn: getUsers,
  });
};
