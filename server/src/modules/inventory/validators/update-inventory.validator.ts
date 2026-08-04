import { z } from "zod";

export const UpdateInventorySchema = z.object({
  productId: z.string().trim().min(1),

  quantity: z.coerce.number().int().positive(),
});