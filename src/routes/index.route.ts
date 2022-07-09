import { Router } from "express";
import { AuthenticationController } from "../controller/authentication.controller";
import { authenticationMiddleware } from "../controller/middlewares/user-auth.middleware";
import profileController from "../controller/user-profile.controller";
export const indexRouter = Router();

/** Authentication Endpoints */
indexRouter.post('/users/register', AuthenticationController.registerUser);
indexRouter.get('/users/verify-registration', AuthenticationController.verifyRegistration);
indexRouter.post('/users/login', AuthenticationController.loginUser);

/** Protected Endpoints */
const protectedRouter = Router();
indexRouter.use('/app', authenticationMiddleware, protectedRouter);

protectedRouter.get('/test', profileController.protectedTest);