export declare type AppRegistrationRequest = RegistrationRequest | FacebookLoginRequest | LocalRegistrationRequest;
export declare type SocialLoginResponse = SocialLoginSuccessResponse | SocialLoginFailResponse;
export declare type AppRegistrationResponse = LocalRegistrationResponse | SocialLoginResponse;

export interface RegistrationRequest {
    fullname: string;
    email: string;
    username: string;
    provider: "FACEBOOK" | "GOOGLE" | "LOCAL";
}

export interface FacebookLoginRequest extends RegistrationRequest {
    id: string;
    authToken: string;
    name: string;
}

export interface LocalRegistrationRequest extends RegistrationRequest {
    password: string;
}

export interface LocalRegistrationResponse {

}

export class SocialLoginSuccessResponse {
    token: string;
    provider: string;
    name: string;
}

export interface SocialLoginFailResponse {

}

export interface FacebookUserVerifyResponse {
    id: string;
    name: string;
    email: string;
    first_name: string;
    last_name: string;
    provider: string;
}