export interface UploadResult {
  url: string;
  key: string;
}

export interface UploadFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface ImageStorage {
  upload(
    file: UploadFile
  ): Promise<UploadResult>;

  delete(
    key: string
  ): Promise<void>;
}