import mongoose from "mongoose";
import { config } from "../config";
import logger from "./logger";

export const connectDatabase = async (): Promise<void> => {
  mongoose.connection.on("connected", () => {
    logger.info("MongoDB connection established.");
  });

  mongoose.connection.on("error", (error) => {
    logger.error(error, "MongoDB connection error.");
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected.");
  });

  try {
    await mongoose.connect(config.mongoUri);
  } catch (error) {
    logger.fatal(error, "Failed to connect to MongoDB.");
    process.exit(1);
  }
  
};

export async function disconnectMongo() {
  await mongoose.connection.close();
}