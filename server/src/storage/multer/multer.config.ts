import multer from "multer";
import { imageFileFilter } from "./file-filter";
import { PRODUCT_UPLOAD } from "../constants/upload.constants";

export const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: PRODUCT_UPLOAD.MAX_SIZE,
  },

  fileFilter: imageFileFilter,
});
