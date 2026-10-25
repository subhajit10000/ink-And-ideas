import User from "../models/User.js";
import { verifyAccessToken } from "../config/jwt.js";

// Attaches req.user when a valid token is present; never rejects the request.
const optionalAuth = async (req, res, next) => {
  try {
    const h = req.headers["authorization"];
    const token = h && h.startsWith("Bearer ") ? h.split(" ")[1] : req.cookies?.accessToken;
    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (user && !user.isBlocked) req.user = user;
    }
  } catch { /* anonymous */ }
  next();
};
export default optionalAuth;
