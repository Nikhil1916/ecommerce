import { en } from "zod/v4/locales";
import { env } from "./env";

export const config = {
  port: env.PORT,

  nodeEnv: env.NODE_ENV,

  mongoUri: env.MONGODB_URI,

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  BCRYPT_SALT_ROUNDS: env.BCRYPT_SALT_ROUNDS,
  DATABASE_URL: env.DATABASE_URL
};