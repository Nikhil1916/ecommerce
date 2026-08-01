export class ApiResponse<T> {
  private constructor(
    public readonly success: boolean,
    public readonly message: string,
    public readonly data?: T,
    public readonly requestId?: string,
  ) {}

  static success<T>(
    message: string,
    data?: T,
    requestId?: string,
  ): ApiResponse<T> {
    return new ApiResponse(true, message, data, requestId);
  }

  static error(message: string, requestId?: string, errors?: unknown) {
    return {
      success: false,
      message,
      errors,
      requestId,
    };
  }
}
