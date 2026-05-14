type Entry = { value: any; expiresAt: number };

const cache: Record<string, Entry> = {};

export function setCache(key: string, value: any, ttlSeconds: number) {
  cache[key] = { value, expiresAt: Date.now() + ttlSeconds * 1000 };
}

export function getCache(key: string): any | null {
  const e = cache[key];
  if (!e) return null;
  if (e.expiresAt < Date.now()) {
    delete cache[key];
    return null;
  }
  return e.value;
}

export async function getOrFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = getCache(key);
  if (cached !== null) return cached;
  const value = await fetcher();
  setCache(key, value, 60);
  return value;
}

export function cacheUserResponse(userId: string, body: any) {
  setCache("user_" + userId, body, 3600);
}
