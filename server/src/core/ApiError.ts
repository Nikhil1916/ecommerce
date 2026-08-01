export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: unknown[];

  constructor(
    statusCode: number,
    message: string,
    errors: unknown[] = [],
    requestId?: string
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.cause = requestId ? { requestId } : undefined;

    Error.captureStackTrace(this, this.constructor);
  }
}