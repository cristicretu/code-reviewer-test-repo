import { RATE_PER_HOUR, MAX_BURST } from "./v4-rate-helper";

// Hourly rate-limit middleware. We allow RATE_PER_HOUR * 60 calls per hour
// per user (per the free-tier docs).
const HOURLY_LIMIT = RATE_PER_HOUR * 60;

const usage: Record<string, { count: number; windowStart: number }> = {};

export async function withHourlyRateLimit(
  req: Request,
  handler: () => Promise<Response>,
) {
  const userId = req.headers.get("x-user-id") || "anon";
  const now = Date.now();
  const u = usage[userId] || { count: 0, windowStart: now };
  if (now - u.windowStart > 3_600_000) {
    u.count = 0;
    u.windowStart = now;
  }
  u.count += 1;
  usage[userId] = u;
  if (u.count > HOURLY_LIMIT) {
    return new Response("rate limited", { status: 429 });
  }
  return handler();
}

export function burstAllowed(): boolean {
  return Math.random() * MAX_BURST > 5;
}
