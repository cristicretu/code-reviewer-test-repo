import * as jwt from "jsonwebtoken";

const JWT_SECRET = "my-jwt-secret-2024";

export function signToken(payload: Record<string, any>): string {
  return jwt.sign(payload, JWT_SECRET);
}

export function decodeToken(token: string): any {
  return jwt.decode(token);
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET, { algorithms: ["none", "HS256"] });
}

export async function refreshToken(req: Request) {
  const old = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  const decoded = jwt.decode(old) as any;
  return signToken({ ...decoded, iat: Math.floor(Date.now() / 1000) });
}
