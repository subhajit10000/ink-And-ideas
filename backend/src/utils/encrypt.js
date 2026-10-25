import crypto from "crypto";
import env from "../config/env.js";

const key = Buffer.from(env.CRYPTO_SECRET, 'utf-8');
const iv = Buffer.from(env.CRYPTO_IV, 'utf-8');
const algorithm = env.CRYPTO_ALGORITHM;

export const encrypt = (text) => {
    if (!text) return "";
    const cipher = crypto.createCipheriv(
        algorithm,
        key,
        iv
    );
    let encrypted = cipher.update(text, 'utf-8', "hex");
    encrypted += cipher.final("hex");
    return encrypted;

}