export class ErrorResponse {
    constructor(public message: string, public errorCode: string, public status: boolean = false, public timestamp: number = new Date().getTime()) { }
    static create(message: string, errorCode: string) {
        return new ErrorResponse(message, errorCode);
    }
}