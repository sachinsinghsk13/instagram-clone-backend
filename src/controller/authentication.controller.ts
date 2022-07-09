import { AxiosError } from "axios";
import { NextFunction, Request, Response } from "express";
import { AuthenticationService as authService } from "../services/authentication.service";
import { IRequest } from "../utils/app-types.util";
import { AppRegistrationRequest, LoginRequest } from "./api-models/authentication.api.model";

export class AuthenticationController {
    
    static async registerUser(req: Request<any, any, AppRegistrationRequest>, res: Response, next: NextFunction) {
        let response = await authService.processUserRegistration(req.body);
        res.json(response);
    }

    static async verifyRegistration(req: Request, res: Response) {
        let token: string = req.query.token as string;
        let response = await authService.verifyUser(token);
        res.json(response);
    }

    static async loginUser(req: Request<any, any, LoginRequest>, res: Response) {
        let response = await authService.login(req.body);
        res.json(response);
    }
}