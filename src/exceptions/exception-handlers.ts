import { ErrorResponse } from "./error-response";

export class ExceptionHandlers {
    
    static handleValidationException(error: Error) {
        return ErrorResponse.create('Test Mesage for validation', 'eor');
    }
}