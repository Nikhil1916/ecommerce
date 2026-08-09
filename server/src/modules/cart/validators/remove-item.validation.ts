import { z } from "zod";
export const removeCartItemSchema = z.object({
  productId: z.string().length(24),
});