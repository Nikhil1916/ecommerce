import api from "./api";
import type { DashboardApiResponse } from "../types/dashboard.types";

export const getDashboard = async (
  year: number,
): Promise<DashboardApiResponse> => {
  const response = await api.get<DashboardApiResponse>(
    `/admin/dashboard?year=${year}`,
  );

  return response.data;
};