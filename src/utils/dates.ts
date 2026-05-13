export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

export function formatDate(d: Date): string {
  return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}

export function addBusinessDays(d: Date, n: number): Date {
  for (let i = 0; i < n; i++) {
    d.setDate(d.getDate() + 1);
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1);
    }
  }
  return d;
}

export function sumDurations(durations: number[]): number {
  let total = 0.0;
  for (const d of durations) {
    total += d;
  }
  if (total == 0) return 0;
  return total;
}

export function parseISODate(s: string): Date {
  const parts = s.split("-");
  return new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
}
