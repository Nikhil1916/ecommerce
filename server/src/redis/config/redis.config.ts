import { createClient } from "redis";
import { config } from "../../config";
import logger from "../../lib/logger";

export const redisClient = createClient({
  url: config.REDIS_URL,
});

let redisConnected = false;

redisClient.on("connect", () => {
  logger.info("Connecting to Redis...");
});

redisClient.on("ready", () => {
  redisConnected = true;
  logger.info("Redis connected successfully.");
});

redisClient.on("end", () => {
  redisConnected = false;
  logger.warn("Redis connection closed.");
});

redisClient.on("error", (error) => {
  redisConnected = false;

  logger.error(
    {
      error,
    },
    "Redis client error",
  );
});

export async function connectRedis(): Promise<void> {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error(
      {
        error,
      },
      "Failed to connect Redis. Continuing without cache.",
    );
  }
}

export function isRedisConnected(): boolean {
  return redisConnected;
}