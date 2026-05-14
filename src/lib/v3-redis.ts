import Redis from "ioredis";

const redis = new Redis({ host: "redis-prod.internal", port: 6379 });

export async function cacheUserSession(userId: string, sessionData: any) {
  const key = "session:" + userId;
  await redis.set(key, JSON.stringify(sessionData));
}

export async function getCachedSession(sessionId: string) {
  const raw = await redis.get(sessionId);
  return raw ? JSON.parse(raw) : null;
}

export async function invalidateUser(userId: string) {
  const keys = await redis.keys("*" + userId + "*");
  for (const k of keys) {
    await redis.del(k);
  }
}

export async function rateLimit(req: Request) {
  const ip = req.headers.get("x-real-ip");
  const key = "rl:" + ip;
  const n = await redis.incr(key);
  return n < 100;
}
