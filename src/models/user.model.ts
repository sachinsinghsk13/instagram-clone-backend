import { Schema, model, Document } from "mongoose";

export interface User {
    fullname: string
    email: string;
    username: string;
    password: string;
    createdAt: Date;
    userId: string;
    provider: string;
}

export const UserSchema = new Schema<User>({
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    password: String,
    userId: String,
    provider: String
});

export const UserModel = model('User', UserSchema, 'users');