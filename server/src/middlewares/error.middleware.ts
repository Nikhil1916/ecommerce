import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../core/ApiError";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Business Errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  // Validation Errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // Unexpected Errors
  if (err instanceof Error) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: [err.message],
    });
    return;
  }

  // Unknown Errors
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: ["Unknown error occurred"],
  });
};