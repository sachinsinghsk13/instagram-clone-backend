import { Router } from "express";
import { AuthenticationController } from "../controller/authentication.controller";
export const indexRouter = Router();
indexRouter.post('/users/register', AuthenticationController.registerUser);