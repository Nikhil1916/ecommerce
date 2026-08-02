import { z } from "zod";

export const UpdateUserSchema = z
  .object({
    firstName: z.string().trim().min(2).max(50).optional(),

    lastName: z.string().trim().min(2).max(50).optional(),

    phone: z.string().trim().min(10).max(15).optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided.",
    }
  ).strict();