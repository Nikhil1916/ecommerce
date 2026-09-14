import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/auth.api";

export const useMe = (enabled = true) => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    enabled,
  });
};