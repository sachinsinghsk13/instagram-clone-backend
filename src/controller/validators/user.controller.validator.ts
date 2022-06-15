import joi, { string } from "joi";
import { Request, Response } from 'express';
export class UserControllerValidator {
    static registerUser(req: Request, res: Response) {
        try {
            const schema = joi.object({
                fullname: joi.string().min(3).max(20)
            });
        } catch (error) {
            
        }
    }
}