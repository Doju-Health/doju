import { useLocation, useNavigate } from "react-router";

export function usePaginationQuery(defaultPage = 1, defaultSize = 10) {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const params = new URLSearchParams(search);

  const page = parseInt(params.get("page") || `${defaultPage}`, 10);
  const size = parseInt(params.get("size") || `${defaultSize}`, 10);

  const setPage = (newPage: number) => {
    params.set("page", String(newPage));
    navigate(`${pathname}?${params.toString()}`);
  };

  const setSize = (newSize: number) => {
    params.set("page", "1");
    params.set("size", String(newSize));
    navigate(`${pathname}?${params.toString()}`);
  };

  return {
    page,
    size,
    setPage,
    setSize,
  };
}
