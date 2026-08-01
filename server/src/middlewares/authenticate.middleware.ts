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
//         console.log(req.cookies);
// console.log(req.headers.cookie);
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new ApiError(401, "Unauthorized.", [], req.requestId);
      }

      const payload = jwtService.verifyAccessToken(accessToken);

      if (!payload.iat) {
        throw new ApiError(401, "Unauthorized.", [], req.requestId);
      }

      const user = await this.authRepository.findById(payload.sub);

      if (!user) {
        throw new ApiError(401, "Unauthorized.", [], req.requestId);
      }

      if (!user.isActive) {
        throw new ApiError(
          403,
          "Your account has been disabled.",
          [],
          req.requestId
        );
      }

      const tokenIssuedAt = new Date(payload.iat * 1000);

      if (
        user.lastPasswordUpdatedAt.getTime() >
        tokenIssuedAt.getTime()
      ) {
        throw new ApiError(
          401,
          "Session expired. Please login again.",
          [],
            req.requestId
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
