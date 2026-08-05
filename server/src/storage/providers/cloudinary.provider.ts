import cloudinary from "../config/cloudinary";
import {
  ImageStorage,
  UploadFile,
  UploadResult,
} from "../interfaces/image-storage.interface";

export class CloudinaryProvider
  implements ImageStorage
{
  async upload(file: UploadFile): Promise<UploadResult> {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "ecommerce",
    });

    return {
      url: result.secure_url,
      key: result.public_id,
    };
  }

  async delete(key: string): Promise<void> {
    await cloudinary.uploader.destroy(key);
  }
}