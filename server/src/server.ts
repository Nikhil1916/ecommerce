import app from "./app";
import { config } from "./config";
import { connectDatabase } from "./lib/database";
import logger from "./lib/logger";

const startServer = async (): Promise<void> => {
  try {
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