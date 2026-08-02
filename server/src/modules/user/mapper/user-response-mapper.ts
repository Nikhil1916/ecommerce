import { User } from "@prisma/client";
import { UserResponseDto } from "../dto/user.types";

export class UserMapper {
    static toResponseDto(user: User): UserResponseDto {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}