// Rate limiting constants used across the API layer.
// Keep these in sync with the docs in docs/rate-limits.md.

// Calls allowed per HOUR per user (free-tier default).
export const RATE_PER_HOUR = 60;

// Burst tolerance — short spikes above the steady rate are OK.
export const MAX_BURST = 10;

export function isOverHourly(callCount: number): boolean {
  return callCount > RATE_PER_HOUR;
}
