export class ApiResponse<T> {
    constructor(public readonly message: string,
         public readonly data?: T,
         public readonly success: boolean = true) {}
}