import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createModuleLogger } from "../utils/logger";
import { ErrorResponse } from "./error-response";
import { InstagramCloneException } from "./instagram-clone.exception";
const logger = createModuleLogger('AppGlobalExceptionLogger');

export function GlobalExceptionHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(error.stack);
    if (!(error instanceof InstagramCloneException)) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse.create("Sorry! Something Went Wrong While Processing Your Request", "500"));
    } else {
        res.status(error.respStatus).json(ErrorResponse.create(error.message, error.errorCode));
    }

}