import multer from "multer";
import { imageFileFilter } from "./file-filter";

export const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: imageFileFilter,
});
