import pinoHttp from "pino-http";
import logger from "../lib/logger";
import type { Request } from "express";

export const loggerMiddleware = pinoHttp({
  logger,

 genReqId: (req) => (req as Request).requestId,
});