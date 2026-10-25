import crypto from "crypto";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
const ALGORITHM = env.CRYPTO_ALGORITHM || "aes-256-cbc";
const KEY = Buffer.from(env.CRYPTO_SECRET, "hex");


const encrypt = (plaintext) => {
  try {
    if (!plaintext) return "";
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(plaintext, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    throw new ApiError(500, "Encryption failed", error);
  }
};


const decrypt = (encryptedText) => {
  try {
    if (!encryptedText) return "";
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    throw new ApiError(500, "Decryption failed", error);
  }
};


export default { encrypt, decrypt };
