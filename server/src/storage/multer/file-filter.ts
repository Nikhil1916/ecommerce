import { FileFilterCallback } from "multer";
import { Request } from "express";

const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp"];

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(new Error("Only images are allowed."));

    return;
  }

  callback(null, true);
};
