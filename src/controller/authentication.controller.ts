import { Request, Response } from "express";
import { User, UserModel } from "../models/user.model";
import { RegistrationRequest } from "./api-models/authentication.api.model";

export class UserController {
    static async registerUser(req: Request<any, any, RegistrationRequest>, res: Response) {
        try {
            const registrationRequest: RegistrationRequest = req.body;
            switch (registrationRequest.provider) {
                case 'LOCAL':
                    break;
                case 'FACEBOOK':
                    break;
            }
        } catch (error: any) {
            res.json({ message: error.message });
        }
    }
}