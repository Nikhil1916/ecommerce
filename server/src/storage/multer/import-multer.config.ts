import multer from "multer";
import { excelFileFilter } from "./file-filter";

export const importUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: excelFileFilter,
});