import { Readable } from "stream";
import { UploadFile } from "../dto/upload-file.dto";
import { UploadResult } from "../dto/upload-result.dto";
import { StorageAssetType } from "../types/storage.types";

export interface ImageStorage {
  upload(file: UploadFile, assetType: StorageAssetType): Promise<UploadResult>;

  delete(key: string, assetType: StorageAssetType): Promise<void>;
  download(key: string, assetType: StorageAssetType): Promise<Readable>;
}
