import { useMutation } from "@tanstack/react-query";

import { logoutUser } from "../services/auth.api";

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};