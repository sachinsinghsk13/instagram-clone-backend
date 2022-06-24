import { AxiosError } from "axios";
import { ValidationError } from "joi";
import { ErrorResponse } from "./error-response";
import { InstagramCloneException } from "./instagram-clone.exception";

export class ExceptionHandlers {
    
    static handleValidationException(error: ValidationError) {
        return ErrorResponse.create('Test Mesage for validation', 'eor');
    }

    static handleAxiosException(error: AxiosError) {
        return ErrorResponse.create(`Internal error occured while communicating with ${error.request.host}: ${error.message}`, error.code);
    }

    static handleInstagramCloneException(error: InstagramCloneException) {
        return ErrorResponse.create(error.message, error.errorCode, error.respStatus);
    }
}
