import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { InstagramCloneException } from "../../exceptions/instagram-clone.exception";
import { UserModel } from "../../models/user.model";
import { AccessTokenJwtPayload } from "../api-models/authentication.api.model";

export async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    let authHeader: string = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        next(InstagramCloneException.create('Authorization header not present', StatusCodes.UNAUTHORIZED));
    }
    let accessToken: string = authHeader.replace("Bearer", "");
    try {
        let payload: AccessTokenJwtPayload = verify(accessToken, process.env.TOKEN_SECRET) as AccessTokenJwtPayload;
        let user = await UserModel.findOne({ username: payload.username }).lean().exec();
        req.user = user;
        next();
    } catch (error) {
        next(InstagramCloneException.create('Access token is not valid or expired.', StatusCodes.UNAUTHORIZED));
    }
}