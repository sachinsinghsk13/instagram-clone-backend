import axios from "axios";
import { AppRegistrationRequest, AppRegistrationResponse, FacebookLoginRequest, FacebookUserVerifyResponse, LocalRegistrationRequest, LocalRegistrationResponse, LoginRequest, LoginResponse, SocialLoginFailResponse, SocialLoginResponse, SocialLoginSuccessResponse } from "../controller/api-models/authentication.api.model";
import { User, UserModel, UserStatus } from "../models/user.model";
import { FACEBOOK_TOKEN_VERIFY_URL } from "../utils/constants.util";
import { createModuleLogger } from "../utils/logger";
import { sign } from "jsonwebtoken";
import { BaseApiResponse } from "../controller/api-models/common.api.model";
import { facebookRequestValidator, localRegistrationRequestValidator, loginValidator } from "../validators/authentication.validator";
import { MongooseError } from "mongoose";
import { InstagramCloneException } from "../exceptions/instagram-clone.exception";
import { StatusCodes } from "http-status-codes";
import { v4 as uuid } from 'uuid'
import moment from "moment";
import { EmailService } from "./email.service";
import { UserRegistrationTokenModel } from "../models/user-registration-token.model";
import { hash, genSaltSync, compare, compareSync } from 'bcryptjs';
import { generateAccessToken } from "../utils/jwt.util";
const logger = createModuleLogger('AuthenticationService');

export class AuthenticationService {

    public static async login(loginRequest: LoginRequest): Promise<BaseApiResponse<LoginResponse>> {
        switch (loginRequest.provider) {
            case "FACEBOOK":
                //AuthenticationService.processFacebookLogin(loginRequest);
                break;

            default:
                return AuthenticationService.localLogin(loginRequest);
        }
    }

    private static async localLogin(loginRequest: LoginRequest): Promise<BaseApiResponse<LoginResponse>> {
        loginValidator.validate(loginRequest);
        let user = await UserModel.findOne({ username: loginRequest.username }).lean().exec()
        if (!user || !compareSync(loginRequest.password, user.password)) {
            return Promise.reject(InstagramCloneException.create(`Incorrect username or password`, StatusCodes.OK));
        }
        let accessToken = generateAccessToken({
            provider: loginRequest.provider,
            username: loginRequest.username
        });
        let response = BaseApiResponse.build<LoginResponse>('Login Successfull!', true, { accessToken });
        return Promise<BaseApiResponse<LoginResponse>>.resolve(response);
    }

    public static async processUserRegistration(request: AppRegistrationRequest): Promise<AppRegistrationResponse> {
        switch (request.provider) {
            case 'FACEBOOK':
                return AuthenticationService.processFacebookLogin(request as FacebookLoginRequest);
            default:
                return AuthenticationService.processLocalRegistration(request as LocalRegistrationRequest)
        }
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
        let token = generateAccessToken(jwtTokenPayload);
        let response: BaseApiResponse<SocialLoginSuccessResponse> = {
            message: `${isNewRegistration ? 'Registration Successfull!' : 'Login Successfull'}`,
            status: true,
            data: { token, provider, name }
        }
        return Promise<BaseApiResponse<SocialLoginSuccessResponse>>.resolve(response);

    }

    private static async processLocalRegistration(request: LocalRegistrationRequest): Promise<BaseApiResponse<LocalRegistrationResponse>> {
        localRegistrationRequestValidator.validate(request);
        let user: User;
        try {
            // encrypt password
            request.password = await hash(request.password, genSaltSync(10));
            // save user
            user = await UserModel.create(request);
            // generate verification token
            let token = await UserRegistrationTokenModel.create({
                token: uuid(), // random uuid
                username: user.username,
                expiryDate: moment(Date.now()).add(1, 'week').toDate() // expire this token after one week
            });
            EmailService.sendRegistrationVerifyEmail(user, token);
        } catch (error: any) {
            if (error.code === 11000) {
                throw new InstagramCloneException(generateDuplicateIdentityMessage(error), StatusCodes.OK, "Duplicate Identity");
            } else throw error;
        }
        const response: BaseApiResponse<LocalRegistrationResponse> = {
            status: true,
            message: `Hi ${request.fullname}, We've received your request for registration. Please confirm your email to activate your account`
        };
        return Promise<BaseApiResponse<LocalRegistrationResponse>>.resolve(response);
    }

    public static async verifyUser(token: string): Promise<BaseApiResponse<any>> {
        let userRegistrtionToken = await UserRegistrationTokenModel.findOne({ token });
        if (!userRegistrtionToken) {
            return Promise<BaseApiResponse<any>>.reject(
                InstagramCloneException.create('Verification token is not valid', StatusCodes.OK)
            );
        }

        let user = await UserModel.findOne({ username: userRegistrtionToken.username }).exec();
        user.status = UserStatus.ACTIVE;
        await user.save();
        await userRegistrtionToken.remove();

        return Promise<BaseApiResponse<any>>.resolve({
            status: true,
            message: `Hi ${user.fullname}, Your email is verified and account activated`
        });
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