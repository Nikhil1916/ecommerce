import { User } from "@prisma/client";
import { UserResponseDto } from "../schemas/register-user.schema";

export const toUserResponseDto = (
    user: User
): UserResponseDto => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
});