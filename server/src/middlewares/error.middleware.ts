import { NextFunction, Request, Response } from "express";
import { ApiError } from "../core/ApiError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [err.message],
  });
};