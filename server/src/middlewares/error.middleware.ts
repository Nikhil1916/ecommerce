import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../core/ApiError";
import multer from "multer";
import { PRODUCT_UPLOAD } from "../storage/constants/upload.constants";
import logger from "../lib/logger";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Unknown Errors
    logger.error(
      {
        error: err,
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
      },
      "Unhandled exception",
    );
  // Business Errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      requestId: req.requestId,
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        res.status(400).json({
          success: false,
          message: `Image size cannot exceed ${PRODUCT_UPLOAD.MAX_SIZE_LABEL} MB.`,
          errors: [err.message],
          requestId: req.requestId,
        });
        return;

      case "LIMIT_UNEXPECTED_FILE":
        res.status(400).json({
          success: false,
          message: `only ${PRODUCT_UPLOAD.MAX_FILES} image is allowed`,
          errors: [err.message],
          requestId: req.requestId,
        });
        return;

      default:
        res.status(400).json({
          success: false,
          message: err.message,
          errors: [err.message],
          requestId: req.requestId,
        });
        return;
    }
  }

  // Validation Errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        requestId: req.requestId,
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
      requestId: req.requestId,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: ["Unknown error occurred"],
    requestId: req.requestId,
  });
};
