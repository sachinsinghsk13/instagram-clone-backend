export interface RegistrationRequest {
    fullname: string;
    email: string;
    username: string;
    provider: string;
}

export interface FacebookRegistrationRequest extends RegistrationRequest {
    providerId: string;
    authToken: string;
}

export interface LocalRegistrationRequest extends RegistrationRequest {
    password: string;
}

export declare type AppRegistrationRequest = RegistrationRequest | FacebookRegistrationRequest | LocalRegistrationRequest;