import { StatusCodes } from "http-status-codes";

export class ErrorResponse {
    constructor(public message: string,  public errorCode: string,public httpStatusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, public status: boolean = false, public timestamp: number = new Date().getTime()) { }
    static create(message: string, errorCode: string, httpStatusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
        return new ErrorResponse(message, errorCode, httpStatusCode);
    }
}