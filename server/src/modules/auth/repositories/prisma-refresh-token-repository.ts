import { PrismaClient, RefreshToken, User } from "@prisma/client";
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

async findByJti(jti: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
        where:{
            jti
        }
    })
}

async revoke(id: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.update({
        where:{
            id
        },
        data:{
            revokedAt: new Date()
        }
    })
}

async revokeAllByUserId(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
        where:{
            userId,
            revokedAt: null
        },
        data:{
            revokedAt: new Date()
        }
    })
}

async deleteExpired(): Promise<void> {
    await prisma.refreshToken.deleteMany({
        where: {
            validUntil: {
                lt: new Date(),
            },
        },
    });
}

}