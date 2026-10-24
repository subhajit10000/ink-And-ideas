import {
    registerService,
    accessTokenService,
    sendOTPService,
    resendOTPService,
    verifyOTPService,
    loginService,
    refreshTokenService,
    logoutService,
    logoutAllService,
    forgotPasswordService,
    resetPasswordService,
    verifyEmailService,
} from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";
import sendResponse from "../helpers/response.js";

import { setAuthCookies, clearAuthCookies, accessTokenOption } from "../helpers/cookies.js";

const register = asyncHandler(async (req, res) => {
    const result = await registerService(req.body);
    return sendResponse(
        res,
        201,
        "Registration started. Check your email for the verification code.",
        result,
    );
});

const login = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await loginService(req.body, req);

    setAuthCookies(res, accessToken, refreshToken);

    return sendResponse(res, 200, "User login successfully", {
        user,
        accessToken,
    });
});

const refreshToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;
    const { user, accessToken, refreshToken: newRefreshToken } =
        await refreshTokenService(incomingRefreshToken, req);

    setAuthCookies(res, accessToken, newRefreshToken);

    return sendResponse(res, 200, "Token Refreshed Successfully", {
        user,
        accessToken,
    });
});

const accessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;
    const { user, accessToken: newAccessToken } = await accessTokenService(incomingRefreshToken);

    res.cookie("accessToken", newAccessToken, accessTokenOption);

    return sendResponse(res, 200, "AccessToken sent Successfully", {
        user,
        accessToken: newAccessToken,
    });
});

const logout = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;
    await logoutService(incomingRefreshToken);

    clearAuthCookies(res);
    return sendResponse(res, 200, "Logged out Successfully");
});

const logoutAll = asyncHandler(async (req, res) => {
    await logoutAllService(req.user._id);

    clearAuthCookies(res);
    return sendResponse(res, 200, "Logged out from all devices.");
});

const me = asyncHandler(async (req, res) => {
    return sendResponse(res, 200, "Current user fetched Successfully.", req.user);
});

const forgotPassword = asyncHandler(async (req, res) => {
    const result = await forgotPasswordService(req.body.email);
    return sendResponse(res, 200, result.message);
});

const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const result = await resetPasswordService(email, otp, newPassword);
    return sendResponse(res, 200, result.message);
});

const sendOTP = asyncHandler(async (req, res) => {
    const result = await sendOTPService(req.body.email);
    return sendResponse(res, 200, result.message);
});

const resendOTP = asyncHandler(async (req, res) => {
    const result = await resendOTPService(req.body.email);
    return sendResponse(res, 200, result.message);
});

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const result = await verifyOTPService(email, otp);
    return sendResponse(res, 200, result.message);
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const result = await verifyEmailService(email, otp);
    return sendResponse(res, 200, result.message);
});

export {
    register,
    login,
    refreshToken,
    accessToken,
    logout,
    logoutAll,
    me,
    forgotPassword,
    resetPassword,
    sendOTP,
    resendOTP,
    verifyOTP,
    verifyEmail,
};
