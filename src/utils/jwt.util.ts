import { sign } from "jsonwebtoken";

export function generateAccessToken(payload: any) {
    return sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.TOKEN_EXPIRY,
        issuer: 'InstagramClone'
    });
}