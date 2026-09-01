import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  DATABASE_URL: z.string(),
  MAX_FAILED_LOGIN_ATTEMPTS: z.coerce.number(),
  ACCOUNT_LOCK_DURATION_MINUTES: z.coerce.number(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  REDIS_URL: z.string(),
  RAZORPAY_KEY_ID: z.string(),
  RAZORPAY_KEY_SECRET: z.string(),
  RAZORPAY_WEBHOOK_SECRET: z.string(),
  EMAIL_PROVIDER: z.enum(["fake", "resend"]).default("resend"),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string()
});

export const env = envSchema.parse(process.env);
