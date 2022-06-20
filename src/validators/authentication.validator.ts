import joi, { string } from "joi";
import { NextFunction, Request, Response } from 'express';
export class UserControllerValidator {
    static async registerUser(req: Request, res: Response, next: NextFunction) {
        try {
            const schema = joi.object({
                fullname: joi.string().min(3).max(20).required(),
                provider: joi.allow('LOCAL', 'GOOGLE', 'FACEBOOK').required(),
                email: joi.string().email().required(),
                password: joi.string(),
                authToken: joi.string()
            });
            let body = req.body;
            await schema.validateAsync(body);
            next();
        } catch (error) {
            console.log(error instanceof joi.ValidationError);
            next(error);
        }
    }
}

export const facebookRequestValidator = joi.object({
    authToken: joi.string().required()
});