import { Schema, model } from "mongoose";

export interface User {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
}

export const UserSchema = new Schema<User>({
    firstname: String,
    lastname: String,
    email: String,
    username: String,
    password: String
});

export const UserModel = model('User', UserSchema, 'users');