import app from "./app";
import { config } from "./config";
import { connectDatabase } from "./lib/database";
import logger from "./lib/logger";
import { connectRedis } from "./redis/config/redis.config";

const startServer = async (): Promise<void> => {
  try {
    await connectRedis();

    await connectDatabase();

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.fatal(error, "Application failed to start.");
    process.exit(1);
  }
};

startServer();