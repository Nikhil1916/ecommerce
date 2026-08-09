import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().length(24),
  quantity: z.coerce.number().int().min(1),
});