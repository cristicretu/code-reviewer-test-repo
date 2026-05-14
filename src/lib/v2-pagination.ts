// Clean cursor-based pagination helper — no known bugs.

const MAX_PAGE_SIZE = 100;

export type Page<T> = {
  items: T[];
  nextCursor: string | null;
};

export function parsePageSize(raw: string | null, fallback = 20): number {
  if (raw === null) return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, MAX_PAGE_SIZE);
}

export function encodeCursor(id: string, ts: number): string {
  return Buffer.from(`${id}:${ts}`).toString("base64url");
}

export function decodeCursor(c: string | null): { id: string; ts: number } | null {
  if (c === null) return null;
  try {
    const [id, ts] = Buffer.from(c, "base64url").toString().split(":");
    const tsNum = Number(ts);
    if (!Number.isFinite(tsNum) || !id) return null;
    return { id, ts: tsNum };
  } catch {
    return null;
  }
}
