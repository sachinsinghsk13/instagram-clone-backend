export interface RegistrationRequest {
    fullname: string;
    email: string;
    username: string;
    provider: "FACEBOOK" | "GOOGLE" | "LOCAL";
}

export interface FacebookRegistrationRequest extends RegistrationRequest {
    providerId: string;
    authToken: string;
}

export interface LocalRegistrationRequest extends RegistrationRequest {
    password: string;
}

export declare type AppRegistrationRequest = RegistrationRequest | FacebookRegistrationRequest | LocalRegistrationRequest;