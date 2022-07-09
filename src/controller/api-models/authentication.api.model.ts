export declare type AppRegistrationRequest = RegistrationRequest | FacebookLoginRequest | LocalRegistrationRequest;
export declare type SocialLoginResponse = SocialLoginSuccessResponse | SocialLoginFailResponse;
export declare type AppRegistrationResponse = LocalRegistrationResponse | SocialLoginResponse;
export declare type LoginProviders = "FACEBOOK" | "GOOGLE" | "LOCAL";
export interface RegistrationRequest {
    fullname: string;
    email: string;
    username: string;
    provider: LoginProviders;
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

export interface LoginRequest {
    provider: LoginProviders;
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken?: string;
}