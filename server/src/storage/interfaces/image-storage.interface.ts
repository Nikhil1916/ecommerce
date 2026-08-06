import { UploadFile } from "../dto/upload-file.dto";
import { UploadResult } from "../dto/upload-result.dto";

export interface ImageStorage {
  upload(
    file: UploadFile
  ): Promise<UploadResult>;

  delete(
    key: string
  ): Promise<void>;
}