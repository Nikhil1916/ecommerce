import { z } from "zod";
import { Types } from "mongoose";

export const ProductQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),

  limit: z.coerce.number().int().positive().optional(),

  search: z.string().trim().optional(),

  sort: z.string().trim().optional(),

  order: z.enum(["asc", "desc"]).optional(),

  fields: z.string().trim().optional(),

categoryId: z
  .string()
  .refine(
    (id) => Types.ObjectId.isValid(id),
    "Invalid category id."
  )
  .optional(),

  minPrice: z.coerce.number().nonnegative().optional(),

  maxPrice: z.coerce.number().nonnegative().optional(),
});