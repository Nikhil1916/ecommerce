import { Readable } from "stream";

import cloudinary from "../config/cloudinary";

import { StorageProvider } from "../interfaces/image-storage.interface";
import { UploadFile } from "../dto/upload-file.dto";
import { UploadResult } from "../dto/upload-result.dto";
import { StorageAssetType } from "../types/storage.types";

export class CloudinaryProvider implements StorageProvider {
  async upload(
    file: UploadFile,
    assetType: StorageAssetType,
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: assetType === StorageAssetType.IMAGE ? "images" : "imports",
          resource_type: this.getResourceType(assetType),
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(
              new Error("Upload failed: No result returned from Cloudinary."),
            );
            return;
          }

          resolve({
            url: result.secure_url || "",
            key: result.public_id || "",
          });
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async delete(key: string, assetType: StorageAssetType): Promise<void> {
    await cloudinary.uploader.destroy(key, {
      resource_type: this.getResourceType(assetType),
    });
  }

  async download(key: string, assetType: StorageAssetType): Promise<Readable> {
    const resourceType = this.getResourceType(assetType);

    const url = cloudinary.url(key, {
      secure: true,
      resource_type: resourceType,
    });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to download file from Cloudinary: ${response.statusText}`,
      );
    }

    return Readable.fromWeb(response.body as any);
  }

  private getResourceType(assetType: StorageAssetType): "image" | "raw" {
    switch (assetType) {
      case StorageAssetType.IMAGE:
        return "image";

      case StorageAssetType.IMPORT:
        return "raw";

      default:
        throw new Error(`Unsupported storage asset type: ${assetType}`);
    }
  }

  generateSignedUrl(key: string, assetType: StorageAssetType): string {
    const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60;

    return cloudinary.url(key, {
      secure: true,
      resource_type: this.getResourceType(assetType),
      sign_url: true,
      expires_at: expiresAt,
    });
  }
}
