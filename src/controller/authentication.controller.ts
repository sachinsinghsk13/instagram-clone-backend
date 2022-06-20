import { NextFunction, Request, Response } from "express";
import { AuthenticationService } from "../services/authentication.service";
import { AppRegistrationRequest } from "./api-models/authentication.api.model";

export class AuthenticationController {
    static async registerUser(req: Request<any, any, AppRegistrationRequest>, res: Response, next: NextFunction) {
        try {
            let response = await AuthenticationService.processUserRegistration(req.body);
            res.json(response);
        } catch (error: any) {
            next(error);
        }
    }
}