// CHANGED: verifyToken used to return a user id (string | null).
// It now returns boolean. Every caller in src/lib/handler.ts will silently break:
// `if (!userId)` will be falsy when verifyToken returns false (correct behavior),
// but truthy `userId` is now `true` (a boolean), so `.eq("id", userId)` will pass
// `true` as the user id, returning no rows OR a SQL error depending on schema.
import * as jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-only";

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}
