import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number().default(5000),
    MONGODB_URI: z.string(),
    JWT_SECRET: z.string().min(10),
    JWT_EXPIRES_IN: z.string(),
    NODE_ENV: z.enum([
    "development",
    "production",
    "test",
  ]),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);