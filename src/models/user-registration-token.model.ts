import { HydratedDocument, Model, model, Query, Schema } from "mongoose";

type IUserRegistrationTokenModelType = Model<IUserRegistrationToken, UserRegistrationTokenQueryHelpers>
type UserRegistrationTokenModelQuery = Query<any, HydratedDocument<IUserRegistrationToken>, UserRegistrationTokenQueryHelpers> & UserRegistrationTokenQueryHelpers;

export interface IUserRegistrationToken {
    token: string;
    username: string;
    expiryDate: Date;
    createdAt: Date;
}

export interface UserRegistrationTokenQueryHelpers {
    byToken(token: string): UserRegistrationTokenModelQuery;
}

export const UserRegistrationTokenSchema = new Schema<IUserRegistrationToken, IUserRegistrationTokenModelType, {}, UserRegistrationTokenModelQuery>({
    token: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

UserRegistrationTokenSchema.query.byToken = function (token: string): UserRegistrationTokenModelQuery {
    return this.where({ token });
}

export const UserRegistrationTokenModel = model<IUserRegistrationToken, IUserRegistrationTokenModelType>('UserRegistrationToken', UserRegistrationTokenSchema)