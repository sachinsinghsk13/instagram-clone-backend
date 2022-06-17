import { Router } from "express";
import { UserController } from "../controller/user.controller";

export const indexRouter = Router();
indexRouter.post('/users/register', UserController.registerUser);