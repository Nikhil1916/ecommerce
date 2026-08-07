import { redisClient, isRedisConnected } from "../config/redis.config";

const DEFAULT_TTL_IN_SECONDS = 60 * 60;

export class RedisService {
  async get<T>(key: string): Promise<T | null> {
    if (!isRedisConnected()) {
      return null;
    }

    const value = await redisClient.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async set(
    key: string,
    value: unknown,
    ttl = DEFAULT_TTL_IN_SECONDS,
  ): Promise<void> {
    if (!isRedisConnected()) {
      return;
    }

    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  }

  async del(key: string): Promise<boolean> {
    if (!isRedisConnected()) {
      return false;
    }

    const deleted = await redisClient.del(key);

    return deleted > 0;
  }

  async exists(key: string): Promise<boolean> {
    if (!isRedisConnected()) {
      return false;
    }

    const exists = await redisClient.exists(key);

    return exists > 0;
  }
}