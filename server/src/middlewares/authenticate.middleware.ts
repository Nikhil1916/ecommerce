import { NextFunction, Request, Response } from "express";
import { AuthRepository } from "../modules/auth/repositories/auth.repository";
import { ApiError } from "../core/ApiError";
import { jwtService } from "../utils/jwt.util";

export class AuthMiddleware {
  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new ApiError(401, "Unauthorized.");
      }

      const payload = jwtService.verifyAccessToken(accessToken);

      if (!payload.iat) {
        throw new ApiError(401, "Unauthorized.");
      }

      const user = await this.authRepository.findById(payload.sub);

      if (!user) {
        throw new ApiError(401, "Unauthorized.");
      }

      if (!user.isActive) {
        throw new ApiError(
          403,
          "Your account has been disabled."
        );
      }

      const tokenIssuedAt = new Date(payload.iat * 1000);

      if (
        user.lastPasswordUpdatedAt.getTime() >
        tokenIssuedAt.getTime()
      ) {
        throw new ApiError(
          401,
          "Session expired. Please login again."
        );
      }

      req.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}