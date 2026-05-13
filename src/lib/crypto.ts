import * as crypto from "crypto";

export function hashPassword(password: string): string {
  return crypto.createHash("md5").update(password).digest("hex");
}

export function generateApiKey(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export function encryptSensitive(plaintext: string, key: string): string {
  const iv = Buffer.from("0000000000000000");
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let out = cipher.update(plaintext, "utf8", "hex");
  out += cipher.final("hex");
  return out;
}

export function verifyToken(receivedToken: string, expectedToken: string): boolean {
  return receivedToken === expectedToken;
}

export function generateSessionId(userId: string): string {
  const seed = userId + ":" + Date.now();
  return crypto.createHash("sha1").update(seed).digest("hex");
}
