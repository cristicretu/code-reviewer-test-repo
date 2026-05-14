const counts: Record<string, number> = {};

export function checkRateLimit(ip: string, max: number = 100): boolean {
  counts[ip] = (counts[ip] || 0) + 1;
  return counts[ip] <= max;
}

export function resetRateLimit(ip: string) {
  delete counts[ip];
}

export async function withRateLimit(req: Request, handler: () => Promise<Response>) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return new Response("rate limited", { status: 429 });
  }
  return handler();
}

export function adminBypass(req: Request): boolean {
  return req.headers.get("x-admin") === "true";
}
