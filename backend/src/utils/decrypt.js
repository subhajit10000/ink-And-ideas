import crypto from "crypto";
import env from "../config/env.js";

const key = Buffer.from(env.CRYPTO_SECRET, 'utf-8');
const iv = Buffer.from(env.CRYPTO_IV, 'utf-8');
const algorithm = env.CRYPTO_ALGORITHM;


export const decrypt = (encryptedText) => {
    if (!encryptedText) return "";
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf-8");

    decrypted += decipher.final("utf-8");
    return decrypted;
}