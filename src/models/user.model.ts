import { Schema, model, Document, Model, Types } from "mongoose";

export enum UserStatus {
    NOT_ACTIVE, ACTIVE, SUSPENDED, TEMP_BLOCKED
}

export interface User {
    _id: Types.ObjectId;
    fullname: string
    email: string;
    username: string;
    password: string;
    createdAt: Date;
    userId: string;
    provider: string;
    status: UserStatus
}

export const UserSchema = new Schema<User>({
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    username: { type: String, required: true, trim: true, unique: true },
    password: String,
    userId: String,
    provider: { type: String, required: true, default: "LOCAL" },
    createdAt: { type: Date, required: true, default: Date.now() },
    status: { type: Number, required: true, default: UserStatus.NOT_ACTIVE }
});

export const UserModel = model('User', UserSchema);







