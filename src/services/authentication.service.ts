import axios from "axios";
import { AppRegistrationRequest, AppRegistrationResponse, FacebookLoginRequest, FacebookUserVerifyResponse, SocialLoginFailResponse, SocialLoginResponse } from "../controller/api-models/authentication.api.model";
import { UserModel } from "../models/user.model";
import { FACEBOOK_TOKEN_VERIFY_URL } from "../utils/constants.util";
import { createModuleLogger } from "../utils/logger";
const logger = createModuleLogger('AuthenticationService');

export class AuthenticationService {
    public static async processUserRegistration(request: AppRegistrationRequest) : Promise<AppRegistrationResponse> {
        switch (request.provider) {
            case 'LOCAL':

                break;
            case 'FACEBOOK':
                return AuthenticationService.processFacebookLogin(request as FacebookLoginRequest);
        }
        return null;
    }

    private static async processFacebookLogin(request: FacebookLoginRequest) : Promise<SocialLoginResponse> {
        const authToken: string = request.authToken;
        const userId: string = request.id;
        const scopes: string = 'id,name,email,first_name,picture';
        let fbResp: FacebookUserVerifyResponse;
        try {
            let resp = await axios.get<FacebookUserVerifyResponse>(`${FACEBOOK_TOKEN_VERIFY_URL}/${userId}`, {params: {access_token: authToken, fields: scopes}});
            fbResp = resp.data;
        } catch (error) {
            return Promise<SocialLoginFailResponse>.resolve({});
        }
        UserModel.find().where('userId', fbResp.id).exec();
        return null;
    }
}