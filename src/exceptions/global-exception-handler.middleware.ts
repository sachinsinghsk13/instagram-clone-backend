import { AxiosError } from "axios";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { createModuleLogger } from "../utils/logger";
import { ErrorResponse } from "./error-response";
import { ExceptionHandlers } from "./exception-handlers";
import { InstagramCloneException } from "./instagram-clone.exception";
const logger = createModuleLogger('AppGlobalExceptionLogger');

export function GlobalExceptionHandler(error: any, req: Request, res: Response, next: NextFunction) {
    logger.error(error.stack);
    const proto = Object.getPrototypeOf(error);
    const key = proto.constructor.name;
    if (hanlders.has(key)) {
        const handlerFunction = hanlders.get(key);
        const errorResp = handlerFunction.call(null, error);
        res.status(error.respStatus || StatusCodes.INTERNAL_SERVER_ERROR).json(errorResp);
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse.create("Sorry! Something Went Wrong While Processing Your Request", "500"));
    }
    // if (!(error instanceof InstagramCloneException)) {
    //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse.create("Sorry! Something Went Wrong While Processing Your Request", "500"));
    // } else {
    //     res.status(error.respStatus).json(ErrorResponse.create(error.message, error.errorCode));
    // }
}

const hanlders: Map<string, Function> = new Map();
hanlders.set(InstagramCloneException.name, ExceptionHandlers.handleInstagramCloneException);
hanlders.set(Joi.ValidationError.name, ExceptionHandlers.handleValidationException);
hanlders.set(AxiosError.name, ExceptionHandlers.handleAxiosException)