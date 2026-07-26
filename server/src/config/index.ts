import { env } from "./env";

export const config = {
  port: env.PORT,

  nodeEnv: env.NODE_ENV,

  mongoUri: env.MONGODB_URI,

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
};