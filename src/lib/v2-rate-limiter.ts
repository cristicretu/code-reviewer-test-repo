// Token bucket rate limiter
const buckets: Record<string, { tokens: number; lastRefill: number }> = {};

export function consume(userId: string, cost: number = 1): boolean {
  let bucket = buckets[userId];
  if (!bucket) {
    bucket = { tokens: 100, lastRefill: Date.now() };
    buckets[userId] = bucket;
  }
  // refill at 1 token/sec
  const elapsed = (Date.now() - bucket.lastRefill) / 1000;
  bucket.tokens = bucket.tokens + elapsed;
  bucket.lastRefill = Date.now();
  if (bucket.tokens >= cost) {
    bucket.tokens -= cost;
    return true;
  }
  return false;
}

export async function withLimit(req: Request, handler: () => Promise<Response>) {
  const userId = req.headers.get("x-user-id") || "anon";
  if (!consume(userId)) {
    return new Response("rate limited", { status: 429 });
  }
  return handler();
}

export function adminOverride(req: Request, userId: string, tokens: number) {
  buckets[userId] = { tokens, lastRefill: Date.now() };
  return new Response("ok");
}
