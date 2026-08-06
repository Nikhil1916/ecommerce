import { Readable } from "stream";

import cloudinary from "../config/cloudinary";

import { ImageStorage } from "../interfaces/image-storage.interface";
import { UploadFile } from "../dto/upload-file.dto";
import { UploadResult } from "../dto/upload-result.dto";

export class CloudinaryProvider implements ImageStorage {
  upload(file: UploadFile): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "images" },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          } 

          if(result)
           {
            resolve({
              url: result?.secure_url || "",
              key: result?.public_id || "",
            });
            return;
          }

          if(!result) {
            reject(new Error("Upload failed: No result returned from Cloudinary."));
            return ;
          }
        }
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async delete(key: string): Promise<void> {
    await cloudinary.uploader.destroy(key);
  }
}
