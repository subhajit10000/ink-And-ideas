import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";
import generateOTP from "../utils/generateOTP.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { sendOtpEmail } from "../config/mailer.js";
import {
    createUser,
    findUserByEmail,
    findUserByEmailWithOTP,
    findUserById,
    updateUser,
    deleteUser,
} from "../repositories/user.repository.js";
import {
    issueTokenPair,
    rotateRefreshToken,
    revokeRefreshToken,
    revokeAllRefreshTokens,
} from "./token.service.js";
import { verifyRefreshToken } from "../config/jwt.js";
import encryptionService from "./encryption.service.js";

const normEmail = (email) => String(email || "").trim().toLowerCase();

const OTP_EXPIRY_MS = (Number(env.OTP_EXPIRY_MINUTES) || 5) * 60 * 1000;

const sanitizeUser = (user) => {
    const obj = user.toObject ? user.toObject() : user;
    delete obj.password;
    delete obj.otp;
    delete obj.otpExpiry;
    delete obj.otpPurpose;
    return obj;
};

const issueOTP = async (email, purpose) => {
    const user = await findUserByEmail(normEmail(email));
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const otp = generateOTP();
    const hashedOtp = await hashPassword(otp);

    await updateUser(user._id, {
        otp: hashedOtp,
        otpExpiry: Date.now() + OTP_EXPIRY_MS,
        otpPurpose: purpose,
    });

    try {
        await sendOtpEmail({
            to: user.email,
            name: user.firstName || "writer",
            otp,
            expiryMinutes: Math.round(OTP_EXPIRY_MS / 60000),
            purpose,
            appUrl: env.CLIENT_URL,
        });
    } catch (error) {
        await updateUser(user._id, { otp: null, otpExpiry: null, otpPurpose: null });
        throw new ApiError(503, "Unable to send the email right now. Please check SMTP settings and try again.");
    }

    return { message: "OTP sent successfully" };
};

const consumeOTP = async (email, otp, purpose) => {
    const user = await findUserByEmailWithOTP(normEmail(email));
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.otp || !user.otpExpiry || user.otpPurpose !== purpose) {
        throw new ApiError(400, "No OTP was requested for this action");
    }

    if (Date.now() > new Date(user.otpExpiry).getTime()) {
        throw new ApiError(400, "OTP has expired");
    }

    const isMatch = await comparePassword(String(otp || ""), user.otp);
    if (!isMatch) {
        throw new ApiError(400, "Invalid OTP");
    }

    return user;
};


const registerService = async (payload) => {
    const email = String(payload.email || "").trim().toLowerCase();
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        if (!existingUser.isVerified) {
            throw new ApiError(409, "An account with this email already exists but is not verified. Use Resend code to verify it.");
        }
        throw new ApiError(409, "A user with this email already exists");
    }

    // Whitelist fields: never trust role / isVerified / isBlocked from the client.
    const normalized = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email,
        password: payload.password,
        role: env.ADMIN_EMAILS.includes(email) ? "admin" : "user",
    };
    if (payload.name && !payload.firstName) {
        const parts = payload.name.trim().split(/\s+/);
        normalized.firstName = parts.shift();
        normalized.lastName = parts.join(" ") || `${normalized.firstName} Writer`;
    }
    if (payload.phone) normalized.phone = encryptionService.encrypt(String(payload.phone));

    const user = await createUser(normalized);
    try {
        await issueOTP(user.email, "verifyEmail");
    } catch (error) {
        // Do not leave an unusable, unverified account behind if the OTP email cannot be sent.
        await deleteUser(user._id);
        throw new ApiError(503, "We could not send the verification email. Check the mail server settings and try registering again.");
    }

    return { email: user.email, username: user.username, requiresEmailVerification: true };
};


const loginService = async (payload, req) => {
    const { email, password } = payload;

    const user = await findUserByEmail(normEmail(email));
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isBlocked) {
        throw new ApiError(403, "Your account is blocked.");
    }
    if (!user.isVerified) {
        throw new ApiError(403, "Please verify your email address with the OTP sent during registration before signing in.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(400, "Invalid password");
    }

    // Allow ADMIN_EMAILS to promote an account that registered before it was listed.
    if (user.role !== "admin" && env.ADMIN_EMAILS.includes(user.email)) {
        user.role = "admin";
        await updateUser(user._id, { role: "admin" });
    }

    const tokens = await issueTokenPair(user, req);

    await updateUser(user._id, { lastLogin: new Date() });

    const safe = sanitizeUser(user);
    if (safe.phone) {
        try { safe.phone = encryptionService.decrypt(safe.phone); } catch { safe.phone = ""; }
    }
    return { user: safe, ...tokens };
};


const refreshTokenService = async (refreshToken, req) => {
    const { user, accessToken, refreshToken: newRefreshToken } =
        await rotateRefreshToken(refreshToken, req);

    return { user: sanitizeUser(user), accessToken, refreshToken: newRefreshToken };
};


const accessTokenService = async (refreshToken) => {
    if (!refreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await findUserById(decoded.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.isBlocked) {
        throw new ApiError(403, "Your account is blocked.");
    }

    const accessToken = user.generateAccessToken();

    return { user: sanitizeUser(user), accessToken };
};


const logoutService = async (refreshToken) => {
    await revokeRefreshToken(refreshToken);
    return { message: "Logged out successfully" };
};


const logoutAllService = async (userId) => {
    await revokeAllRefreshTokens(userId);
    return { message: "Logged out from all sessions successfully" };
};


const forgotPasswordService = async (email) => {
    return issueOTP(email, "resetPassword");
};


const resetPasswordService = async (email, otp, newPassword) => {
    if (
        typeof newPassword !== "string" ||
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(newPassword)
    ) {
        throw new ApiError(422, "Password must be at least 8 characters with uppercase, lowercase, a number and a symbol.");
    }
    const user = await consumeOTP(email, otp, "resetPassword");


    user.password = newPassword;
    user.otp = null;
    user.otpExpiry = null;
    user.otpPurpose = null;
    await user.save();

    await revokeAllRefreshTokens(user._id);

    return { message: "Password reset successfully" };
};


const verifyEmailService = async (email, otp) => {
    const user = await consumeOTP(email, otp, "verifyEmail");

    await updateUser(user._id, {
        isVerified: true,
        otp: null,
        otpExpiry: null,
        otpPurpose: null,
    });

    return { message: "Email verified successfully" };
};


const sendOTPService = async (email) => {
    return issueOTP(email, "verifyEmail");
};


const verifyOTPService = async (email, otp) => {
    const user = await consumeOTP(email, otp, "verifyEmail");

    await updateUser(user._id, { otp: null, otpExpiry: null, otpPurpose: null });

    return { message: "OTP verified successfully" };
};


const resendOTPService = async (email) => {
    return issueOTP(email, "verifyEmail");
};

export {
    registerService,
    loginService,
    refreshTokenService,
    accessTokenService,
    logoutService,
    logoutAllService,
    forgotPasswordService,
    resetPasswordService,
    verifyEmailService,
    sendOTPService,
    verifyOTPService,
    resendOTPService,
};
