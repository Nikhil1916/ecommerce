import { Role } from "@prisma/client";

export interface RegisterUserDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
}


export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UserResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    role: Role;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
