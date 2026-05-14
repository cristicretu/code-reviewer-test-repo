// Clean utility helpers — no known bugs.
import { z } from "zod";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(s: string): boolean {
  return SLUG_RE.test(s);
}

const EMAIL_SCHEMA = z.string().email().max(254);

export function parseEmail(input: unknown): string | null {
  const r = EMAIL_SCHEMA.safeParse(input);
  return r.success ? r.data : null;
}

export function chunk<T>(arr: readonly T[], size: number): T[][] {
  if (size <= 0) throw new RangeError("chunk size must be positive");
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export function debounce<F extends (...args: unknown[]) => void>(fn: F, ms: number): F {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const wrapped = ((...args: Parameters<F>) => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as F;
  return wrapped;
}
