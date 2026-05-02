import crypto from "crypto";

// ⚠️ keep these safe (store in .env in real apps)
const SECRET_KEY = crypto.randomBytes(32); // 256-bit key
const IV_LENGTH = 16; // AES block size

// 🔐 Encrypt Function
export function encryptToken(token) {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    SECRET_KEY,
    iv
  );

  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  // return iv + encrypted data (needed for decryption)
  return iv.toString("hex") + ":" + encrypted;
}

// 🔓 Decrypt Function
export function decryptToken(encryptedToken) {
  const [ivHex, encryptedData] = encryptedToken.split(":");

  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    SECRET_KEY,
    iv
  );

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}