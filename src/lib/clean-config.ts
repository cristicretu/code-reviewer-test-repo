// Clean env-var configuration — no known bugs.

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
}

function intEnv(name: string, fallback: number): number {
  const v = process.env[name];
  if (v === undefined) return fallback;
  const n = Number.parseInt(v, 10);
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid integer for ${name}: ${v}`);
  }
  return n;
}

export const CONFIG = {
  databaseUrl: requireEnv("DATABASE_URL"),
  port: intEnv("PORT", 8080),
  logLevel: process.env.LOG_LEVEL ?? "info",
} as const;

export type AppConfig = typeof CONFIG;
