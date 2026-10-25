import User from "../models/User.js";
import  ApiError  from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../config/jwt.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(" ")[1] 
        // token = authHeader.replace("Bearer ","")
    }
    if (!token && req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }
    if (!token) {
        throw new ApiError(401, "Access token is required")
    }
    const decode = verifyAccessToken(token);
    const user = await User.findById(decode.id);
    if (!user) {
        throw new ApiError(401, "User not found.")
    }
    if (user.isBlocked) {
        throw new ApiError(403, "Your account is blocked.")
    }
    req.user = user;
    next();

})

export default authMiddleware;