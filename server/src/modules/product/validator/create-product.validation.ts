import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(3).max(200),

  description: z
    .string()
    .trim()
    .min(10)
    .max(5000),

  price: z.coerce.number().positive(),

  stock: z.coerce.number().int().min(0),

  categoryId: z.string().length(24),
});