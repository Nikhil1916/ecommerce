export enum ImportType {
  PRODUCT = "PRODUCT",
  CATEGORY = "CATEGORY",
  STOCK_NOTIFICATION = "STOCK_NOTIFICATION",
}

export enum ImportJobStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum ImportRowStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}