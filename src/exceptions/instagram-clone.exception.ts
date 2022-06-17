import { StatusCodes } from "http-status-codes";

export class InstagramCloneException extends Error {
    constructor(public message: string, public respStatus: number, public errorCode: string) {
        super(message);
    }
}