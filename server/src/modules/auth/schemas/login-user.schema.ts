import { z } from "zod";
import { UserResponseDto } from "./register-user.schema";

export const LoginUserSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),

    password: z
        .string()
        .min(1, "Password is required"),
});

export type LoginUserDto = z.infer<typeof LoginUserSchema>;

export interface LoginResponseDto {
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
}