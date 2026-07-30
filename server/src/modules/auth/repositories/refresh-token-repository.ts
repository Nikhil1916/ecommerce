import { RefreshToken } from "@prisma/client";

export interface IRefreshTokenRepository {
    create(
        userId: string,
        jti: string,
        tokenHash: string,
        validUntil: Date
    ): Promise<RefreshToken>;

    findByJti(
        jti: string
    ): Promise<RefreshToken | null>;

    revoke(
        id: string
    ): Promise<RefreshToken>;

    revokeAllByUserId(
        userId: string
    ): Promise<void>;

    deleteExpired(): Promise<number>;
}