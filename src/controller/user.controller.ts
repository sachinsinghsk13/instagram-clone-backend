import { Request, Response } from "express";
import { User, UserModel } from "../models/user.model";

export class UserController {
    static async registerUser(req: Request, res: Response) {
        const user: User = req.body;
        let doc = await UserModel.create(user);
        res.json({message: 'registered', user: doc});
    }
}