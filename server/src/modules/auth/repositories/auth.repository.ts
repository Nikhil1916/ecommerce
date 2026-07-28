import { Prisma, User } from "@prisma/client";

export abstract class AuthRepository {
    abstract findByEmail(email: string): Promise<User | null>;

    abstract create(data: Prisma.UserCreateInput): Promise<User>;

    abstract updatePassword(
        userId: string,
        passwordHash: string
    ): Promise<User>;

    abstract verifyEmail(userId: string): Promise<User>;

    abstract incrementFailedLoginAttempts(
        userId: string
    ): Promise<User>;

    abstract resetFailedLoginAttempts(
        userId: string
    ): Promise<User>;

    abstract lockUser(
        userId: string,
        lockedUntil: Date
    ): Promise<User>;

    // abstract updateRefreshToken(
    //     userId: string,
    //     refreshToken: string | null
    // ): Promise<User>;
}