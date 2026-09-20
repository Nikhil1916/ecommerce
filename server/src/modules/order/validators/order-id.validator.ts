import { Types } from "mongoose";
import { z } from "zod";

export const OrderIdSchema = z.object({
  orderId: z.string().refine(
    (orderId) => Types.ObjectId.isValid(orderId),
    "Invalid order id.",
  ),
});