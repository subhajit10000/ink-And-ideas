import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import env from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import errorHandler from "./middlewares/error.middleware.js"

const App = express();
App.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })); // security

App.use(
    cors({
        origin: env.CLIENT_URL.split(",").map((o) => o.trim()),
        credentials: true,
    })
);
App.use(apiLimiter);
App.use(express.json({ limit: '5mb' }));
App.use(express.urlencoded({ extended: true }))

App.use(cookieParser());
App.use(compression());

if (env.NODE_ENV === "development") {
    App.use(morgan("dev"));
}
App.get('/', (req, res) => {
    res.send('Authentication API running')
})
App.use("/api/v1/auth", authRouter);
App.get("/api/v1/users/search/:username", async (req,res,next) => { try { const User = (await import("./models/User.js")).default; const Post = (await import("./models/Post.js")).default; const user = await User.findOne({ username: req.params.username.toLowerCase() }).select("username firstName lastName bio profilePhoto createdAt"); if(!user) return res.json({ success:true, data:null }); const postCount = await Post.countDocuments({ author: user._id }); res.json({ success:true, data:{ ...user.toObject(), postCount } }); } catch(e) { next(e); } });
App.use("/api/v1/users", userRouter);
App.use("/api/v1/posts", postRouter);

App.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    })
})

App.use(errorHandler);
export default App;