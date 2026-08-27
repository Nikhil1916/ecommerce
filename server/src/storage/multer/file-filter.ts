import { FileFilterCallback } from "multer";
import { Request } from "express";
import { ApiError } from "../../core/ApiError";

const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp"];

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(new ApiError(
    400,
    "Only JPG, PNG and WEBP images are allowed."
  ));

    return;
  }

  callback(null, true);
};


export const excelFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  const allowedMimeTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(
      new ApiError(
        400,
        "Only XLS and XLSX files are allowed.",
      ),
    );

    return;
  }

  callback(null, true);
};