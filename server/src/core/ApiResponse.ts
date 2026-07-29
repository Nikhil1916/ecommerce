export class ApiResponse<T> {
    private constructor(
        public readonly success: boolean,
        public readonly message: string,
        public readonly data?: T
    ) {}

    static success<T>(message: string, data?: T): ApiResponse<T> {
        return new ApiResponse(true, message, data);
    }
}