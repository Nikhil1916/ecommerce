import { z } from "zod";

export const ProductSlugSchema = z.object({
  slug: z.string().min(1),
});