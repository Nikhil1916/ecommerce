import { CookieOptions } from "express";
import ms, { StringValue } from "ms";
import { config } from "../config";

export const getAccessTokenCookieOptions = (): CookieOptions => ({
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: ms(config.JWT_ACCESS_EXPIRES_IN as StringValue),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: ms(config.JWT_REFRESH_EXPIRES_IN as StringValue),
});