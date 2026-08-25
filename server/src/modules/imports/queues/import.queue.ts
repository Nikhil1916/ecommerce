import { Queue } from "bullmq";
import { redisConnection } from "../../../redis/config/redis.config";
import { ImportType } from "../types/import.types";

export interface ImportJobData {
  importJobId: string;
  type: ImportType;
  filePath: string;
}

export const importQueue = new Queue<ImportJobData>(
  "import",
  {
    connection: redisConnection,
  },
);