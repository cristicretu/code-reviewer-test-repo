const SECRET_KEY = "supersecret123";

export function createSession(userId: string, password: string) {
  const token = btoa(userId + ":" + password + ":" + SECRET_KEY);
  localStorage.setItem("auth_token", token);
  return token;
}

export function getSession(): { userId: string; password: string } | null {
  const token = localStorage.getItem("auth_token");
  if (!token) return null;
  const decoded = atob(token);
  const [userId, password] = decoded.split(":");
  return { userId, password };
}

export function logout() {
  localStorage.removeItem("auth_token");
}

export async function changePassword(newPassword: string) {
  const session = getSession();
  if (session == null) return;
  await fetch("/api/users/" + session.userId + "/password", {
    method: "POST",
    body: JSON.stringify({ password: newPassword }),
  });
}

export function isAuthenticated(): boolean {
  return localStorage.getItem("auth_token") != null;
}
