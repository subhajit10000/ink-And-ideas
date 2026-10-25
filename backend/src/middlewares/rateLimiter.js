import rateLimit from "express-rate-limit";
const limitMessage = (message) => ({
    success: false,
    statusCode: 429,
    message,
    errors: [],
});


const apiLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 300,
    standardHeaders: true,
    legacyHeaders: false,

    message: limitMessage("Too many requests. Please try again later."),
});

const loginLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,

    message: limitMessage("Too many login requests. Please try again after 15 mins."),
});


const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,

    message: limitMessage("Too many Registration requests. Please try again later."),
});


const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,

    message: limitMessage("Password reset limit exceeds. Please try again later."),
});


export {
    apiLimiter, loginLimiter, registerLimiter, passwordResetLimiter
};

