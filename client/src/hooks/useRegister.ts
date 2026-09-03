import { useMutation } from "@tanstack/react-query";
import { register, type RegisterPayload } from "../services/auth.api";


export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterPayload) => register(data),
    })
}