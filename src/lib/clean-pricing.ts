// Clean billing helpers — no known bugs.

export type Currency = "USD" | "EUR" | "GBP";

export function formatMoney(cents: number, currency: Currency = "USD"): string {
  if (!Number.isInteger(cents)) {
    throw new TypeError("cents must be an integer");
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    cents / 100,
  );
}

export function applyDiscount(cents: number, percent: number): number {
  if (percent < 0 || percent > 100) {
    throw new RangeError("percent must be 0..100");
  }
  // Round to integer cents to avoid floating-point drift.
  return Math.round(cents * (1 - percent / 100));
}

export function totalWithTax(items: readonly { cents: number }[], taxRate: number): number {
  if (taxRate < 0) throw new RangeError("taxRate must be >= 0");
  const subtotal = items.reduce((s, i) => s + i.cents, 0);
  return Math.round(subtotal * (1 + taxRate));
}
