import { API } from "@/lib/axios";
import { buildQueryString } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { ApiProduct, PaginatedResponse } from "@/types";

export type ProductSortBy =
  | "createdAt"
  | "name"
  | "priceAsc"
  | "priceDesc"
  | "rating"
  | "stock";

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  sortBy?: ProductSortBy;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export const useGetProducts = (
  filters?: ProductFilters,
  options?: { enabled?: boolean },
) => {
  const getProducts = async (): Promise<PaginatedResponse<ApiProduct>> => {
    const queryString = buildQueryString({ ...filters });
    const response = await API.get(
      `/products/approved${queryString ? `?${queryString}` : ""}`,
    );
    return response.data;
  };

  return useQuery({
    queryKey: ["products", filters],
    queryFn: getProducts,
    enabled: options?.enabled ?? true,
  });
};
