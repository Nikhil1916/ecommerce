import { Role } from "@prisma/client";
import { z } from "zod";
export const RegisterUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be atleast 2 characters")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(2, "First name must be atleast 2 characters")
    .max(50, "First name cannot exceed 50 characters"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;

export interface UserResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role?: Role;
}