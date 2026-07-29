import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { ApiError } from "../core/ApiError";

export const validate =
  (schema: ZodSchema) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const validatedData = await schema.parseAsync(req.body);
        req.body = validatedData;
        next();
    } catch(error) {
        if (error instanceof ZodError) {
          return next(new ApiError(400, "Validation failed", error.issues));
        }

        next(error);
    }
  };