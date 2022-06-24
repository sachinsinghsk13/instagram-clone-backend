import axios from "axios";
import { AppRegistrationRequest, AppRegistrationResponse, FacebookLoginRequest, FacebookUserVerifyResponse, LocalRegistrationRequest, LocalRegistrationResponse, SocialLoginFailResponse, SocialLoginResponse, SocialLoginSuccessResponse } from "../controller/api-models/authentication.api.model";
import { User, UserModel } from "../models/user.model";
import { FACEBOOK_TOKEN_VERIFY_URL } from "../utils/constants.util";
import { createModuleLogger } from "../utils/logger";
import { sign } from "jsonwebtoken";
import { BaseApiResponse } from "../controller/api-models/common.api.model";
import { facebookRequestValidator, localRegistrationRequestValidator } from "../validators/authentication.validator";
import { MongooseError } from "mongoose";
import { InstagramCloneException } from "../exceptions/instagram-clone.exception";
import { StatusCodes } from "http-status-codes";
const logger = createModuleLogger('AuthenticationService');

export class AuthenticationService {
    public static async processUserRegistration(request: AppRegistrationRequest): Promise<AppRegistrationResponse> {
        switch (request.provider) {
            case 'FACEBOOK':
                return AuthenticationService.processFacebookLogin(request as FacebookLoginRequest);
            default:
                return AuthenticationService.processLocalRegistration(request as LocalRegistrationRequest)
        }
        return null;
    }

    private static async processFacebookLogin(request: FacebookLoginRequest): Promise<SocialLoginResponse> {
        facebookRequestValidator.validate(request);
        const authToken: string = request.authToken;
        const userId: string = request.id;
        const provider: string = request.provider;
        const name: string = request.name;
        const scopes: string = 'id,name,email,first_name,picture';
        let isNewRegistration: boolean = false;
        let fbResp: FacebookUserVerifyResponse;

        let resp = await axios.get<FacebookUserVerifyResponse>(`${FACEBOOK_TOKEN_VERIFY_URL}/${userId}`, { params: { access_token: authToken, fields: scopes } });
        fbResp = resp.data;
        let exists = await UserModel.exists({ userId: fbResp.id, provider }).exec();
        if (!exists) {
            // insert user into database
            isNewRegistration = true;
            let username = "123" + Math.random().toFixed(4);
            let user = new UserModel({
                fullname: fbResp.name,
                email: fbResp.email,
                username,
                userId,
                provider
            });
            user = await user.save();
            // TODO: send new registartion mail
        }
        let jwtTokenPayload = {
            provider,
            userId
        };
        const token = sign(jwtTokenPayload, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: process.env.TOKEN_EXPIRY,
            issuer: 'InstagramClone'
        });
        let response: BaseApiResponse<SocialLoginSuccessResponse> = {
            message: `${isNewRegistration ? 'Registration Successfull!' : 'Login Successfull'}`,
            status: true,
            data: { token, provider, name }
        }
        return Promise<BaseApiResponse<SocialLoginSuccessResponse>>.resolve(response);

    }

    private static async processLocalRegistration(request: LocalRegistrationRequest): Promise<LocalRegistrationResponse> {
        localRegistrationRequestValidator.validate(request);
        let user: User;
        try {
            user = await UserModel.create(request);
        } catch (error: any) {
            if (error.code === 11000) {
                throw new InstagramCloneException(generateDuplicateIdentityMessage(error), StatusCodes.OK, "Duplicate Identity");
            }
        }
        const response: BaseApiResponse<LocalRegistrationResponse> = {
            status: true,
            message: `Hi ${request.fullname}, We've received your request for registration. Please confirm your email to activate your account`
        };
        return Promise<BaseApiResponse<LocalRegistrationResponse>>.resolve(response);
    }
}

function generateDuplicateIdentityMessage(error: any) {
    let message = ""
    let duplicateKeys = Object.keys(error.keyValue);
    for (let i = 0; i < duplicateKeys.length; i++) {
        message += `${duplicateKeys[i]} [${error.keyValue[duplicateKeys[i]]}]`;
        if (i != duplicateKeys.length - 1)
            message += " and "
    }
    message += " is alredy taken.";
    return message;
}