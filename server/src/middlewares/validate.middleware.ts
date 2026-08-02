import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { ApiError } from "../core/ApiError";
type ValidationTarget = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, target: ValidationTarget = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req[target]);
      if (target === "body") {
        req.body = validatedData;
      } else if (target === "params") {
            Object.assign(req.params, validatedData);
      } else {
        Object.assign(req.query, validatedData);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ApiError(400, "Validation failed", error.issues));
      }

      next(error);
    }
  };
