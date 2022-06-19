import { Router } from "express";
import { UserController } from "../controller/authentication.controller";
import { UserControllerValidator } from "../controller/validators/authentication.controller.validator";

export const indexRouter = Router();
indexRouter.post('/users/register', UserControllerValidator.registerUser, UserController.registerUser);