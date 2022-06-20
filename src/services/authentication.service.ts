import axios from "axios";
import { AppRegistrationRequest, AppRegistrationResponse, FacebookLoginRequest, FacebookUserVerifyResponse, SocialLoginFailResponse, SocialLoginResponse, SocialLoginSuccessResponse } from "../controller/api-models/authentication.api.model";
import { UserModel } from "../models/user.model";
import { FACEBOOK_TOKEN_VERIFY_URL } from "../utils/constants.util";
import { createModuleLogger } from "../utils/logger";
import { sign } from "jsonwebtoken";
import { BaseApiResponse } from "../controller/api-models/common.api.model";
import { facebookRequestValidator } from "../validators/authentication.validator";
const logger = createModuleLogger('AuthenticationService');

export class AuthenticationService {
    public static async processUserRegistration(request: AppRegistrationRequest): Promise<AppRegistrationResponse> {
        switch (request.provider) {
            case 'LOCAL':

                break;
            case 'FACEBOOK':
                return AuthenticationService.processFacebookLogin(request as FacebookLoginRequest);
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
}