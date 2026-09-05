import { useMutation } from "@tanstack/react-query";

import { login, type LoginPayload } from "../services/auth.api";

export const useLogin = () => {
    return useMutation({
        mutationFn: (data:LoginPayload) => {
            return login(data);
        }
    })
}