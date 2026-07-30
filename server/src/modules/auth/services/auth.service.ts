import { User } from "@prisma/client";
import { config } from "../../../config/index";
import { ApiError } from "../../../core/ApiError";
import { toUserResponseDto } from "../mapper/auth.mapper";
import { AuthRepository } from "../repositories/auth.repository";
import { LoginResponseDto, LoginUserDto } from "../schemas/login-user.schema";
import { RegisterUserDto, UserResponseDto } from "../schemas/register-user.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import ms, { StringValue } from "ms";
import { RefreshTokenRepository } from "../repositories/prisma-refresh-token-repository";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository, private readonly refreshTokenRepository:RefreshTokenRepository) {}

  async register(dto: RegisterUserDto): Promise<UserResponseDto> {
    const existingUser = await this.authRepository.findByEmail(dto.email);
    if (existingUser) {
        throw new ApiError(
            409,
            "User already exists with this email."
        );
    }
    
    const passwordHash = await bcrypt.hash(dto.password, config.BCRYPT_SALT_ROUNDS);
    const user = await this.authRepository.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        passwordHash,
    });

    return toUserResponseDto(user);
  }

  async login(dto: LoginUserDto): Promise<LoginResponseDto> {
        const user = await this.authRepository.findByEmail(dto.email);

        if (!user) {
            throw new ApiError(401, "Invalid email or password.");
        }

        if (!user.isActive) {
            throw new ApiError(403, "Your account has been disabled.");
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new ApiError(401, "Your account is temporarily locked.");
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            const updatedUser =
                await this.authRepository.incrementFailedLoginAttempts(user.id);

            if (
                updatedUser.failedLoginAttempts >=
                config.MAX_FAILED_LOGIN_ATTEMPTS
            ) {
                const lockedUntil = new Date(
                    Date.now() +
                        config.ACCOUNT_LOCK_DURATION_MINUTES * 60 * 1000
                );

                await this.authRepository.lockUser(
                    user.id,
                    lockedUntil
                );
            }

            throw new ApiError(401, "Invalid email or password.");
        }

            await this.authRepository.resetFailedLoginAttempts(user.id);
            const accessToken = this.generateAccessToken(user);
            const jti = randomUUID();
            const refreshToken = this.generateRefreshToken(user, jti);
            const validUntil = new Date(
            Date.now() +
            ms(config.JWT_REFRESH_EXPIRES_IN as StringValue)
            );
            const refreshTokenHash = await this.hashRefreshToken(refreshToken);
            await this.refreshTokenRepository.create(
            user.id,
            jti,
            refreshTokenHash,
            validUntil
        );
        return {
            user: toUserResponseDto(user),
            accessToken,
            refreshToken,
        };
    }


    private generateAccessToken(user: User): string {
        // Cast secret and expiresIn to the types expected by jsonwebtoken
        const secret: jwt.Secret = config.JWT_ACCESS_SECRET as jwt.Secret;
        const options: jwt.SignOptions = {
            expiresIn: config.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
        };

        return jwt.sign(
            {
                sub: user.id,
                email: user.email,
            },
            secret,
            options
        );
    }

    private generateRefreshToken(user: User, jti: string): string {
        const secret: jwt.Secret = config.JWT_REFRESH_SECRET as jwt.Secret;
        const options: jwt.SignOptions = {
            expiresIn: config.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
        };
    return jwt.sign(
        {
            sub: user.id,
            jti
        },
        secret,
        options
    );
}

private async hashRefreshToken(
    refreshToken: string
): Promise<string> {
    return bcrypt.hash(refreshToken, config.BCRYPT_SALT_ROUNDS);
}

private async verifyRefreshTokenHash(
    refreshToken: string,
    tokenHash: string
): Promise<boolean> {
    return bcrypt.compare(refreshToken, tokenHash);
}

}
