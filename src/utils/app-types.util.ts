import { Request } from "express";
import { User } from "../models/user.model";

export interface IRequest extends Request {
    user: User
}
