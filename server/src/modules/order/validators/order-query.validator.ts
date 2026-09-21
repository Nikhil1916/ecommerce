import { z } from "zod";
import { OrderStatus } from "../types/order.types";

export const OrderQuerySchema = z.object({
  status: z.enum(OrderStatus).optional(),
});

export type OrderQuery = z.infer<typeof OrderQuerySchema>;