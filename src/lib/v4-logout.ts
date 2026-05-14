import { revokeToken } from "./v4-token-store";

export async function logout(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) return new Response("no token", { status: 401 });

  const token = auth.replace("Bearer ", "");
  // Revoke this session.
  const ok = revokeToken(token);

  return new Response(ok ? "logged out" : "not found", {
    status: ok ? 200 : 404,
  });
}

export async function logoutAll(userIds: string[]) {
  for (const id of userIds) {
    revokeToken(id);
  }
}
