import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { UserControllerValidator } from "../controller/validators/user.controller.validator";

export const indexRouter = Router();
indexRouter.post('/users/register', UserControllerValidator.registerUser, UserController.registerUser);