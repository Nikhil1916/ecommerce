import { PrismaClient, RefreshToken } from "@prisma/client";
import { IRefreshTokenRepository } from "./refresh-token-repository";
import { prisma } from "../../../config/prisma";

export class RefreshTokenRepository {
    constructor(
    ) {}

async create(
    userId: string,
    jti: string,
    tokenHash: string,
    validUntil: Date
): Promise<RefreshToken> {
    return prisma.refreshToken.create({
        data: {
            userId,
            jti,
            tokenHash,
            validUntil,
        },
    });
}

}