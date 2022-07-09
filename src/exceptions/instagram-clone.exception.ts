import { StatusCodes } from "http-status-codes";

export class InstagramCloneException extends Error {
    constructor(public message: string, public respStatus: number, public errorCode?: string, public status: boolean = false) {
        super(message);
    }

    public static create(message: string, respStatus: number, errorCode?: string) {
        return new InstagramCloneException(message, respStatus, errorCode);
    }
}