import env from "../config/env.js";

const isProduction = env.NODE_ENV === "production";

const accessTokenOption = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'Strict' : 'lax',
    maxAge: 15 * 60 * 1000 
}

const refreshTokenOption = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'Strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 
}

const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, accessTokenOption);
    res.cookie("refreshToken", refreshToken, refreshTokenOption);
}

const clearAuthCookies = (res) => {
    res.clearCookie("accessToken", accessTokenOption);
    res.clearCookie("refreshToken", refreshTokenOption);

}

export { accessTokenOption, refreshTokenOption, setAuthCookies, clearAuthCookies };