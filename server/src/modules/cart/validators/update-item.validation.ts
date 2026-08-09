import {z} from "zod";
export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1),
});