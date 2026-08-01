import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { ApiError } from "../core/ApiError";

export const authorize =
  (...roles: Role[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized.", [], req.requestId));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          "You do not have permission to perform this action.",
            [],
          req.requestId
        )
      );
    }

    next();
  };