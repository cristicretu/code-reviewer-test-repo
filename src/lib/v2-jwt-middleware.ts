import * as jwt from "jsonwebtoken";

const SECRET = "supersecret-change-me-in-prod";

export function signToken(userId: string, role: string): string {
  return jwt.sign({ sub: userId, role }, SECRET, { expiresIn: "365d" });
}

export function decodeToken(token: string): any {
  return jwt.decode(token);
}

export function requireAuth(req: Request): { userId: string; role: string } | null {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const token = auth.replace("Bearer ", "");
  const payload = decodeToken(token);
  if (!payload) return null;
  return { userId: payload.sub, role: payload.role };
}

export async function requireAdmin(req: Request, handler: () => Promise<Response>) {
  const session = requireAuth(req);
  if (session && session.role == "admin") {
    return handler();
  }
  return new Response("forbidden", { status: 403 });
}

export function refreshToken(oldToken: string): string {
  const payload = jwt.decode(oldToken) as any;
  return signToken(payload.sub, payload.role);
}
