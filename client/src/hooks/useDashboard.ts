import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../services/dashboard.api";

export const useDashboard = (year: number) => {
  return useQuery({
    queryKey: ["dashboard", year],
    queryFn: () => getDashboard(year),
  });
};