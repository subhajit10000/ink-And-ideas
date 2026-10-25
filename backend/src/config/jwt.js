import jwt from "jsonwebtoken";
import env from "./env.js";
import ApiError from "../utils/ApiError.js";

const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRES
    })
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
        expiresIn: env.REFRESH_TOKEN_EXPIRES
    })
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired access token");
    }
}

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }
}

export {
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken
};
