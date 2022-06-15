import { Router } from "express";
import { UserController } from "../controller/user.controller";

export const indexRouter = Router();
indexRouter.use('/users/register', UserController.registerUser);