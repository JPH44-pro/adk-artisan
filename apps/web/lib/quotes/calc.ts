/**
 * Calculs montants devis (centimes HT / TVA / TTC, TVA en basis points).
 */

export function parseQuantityInput(raw: string): number {
  const normalized = raw.trim().replace(",", ".");
  const n = parseFloat(normalized);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function lineTotalHtCents(
  quantityStr: string,
  unitPriceHtCents: number
): number {
  return Math.round(parseQuantityInput(quantityStr) * unitPriceHtCents);
}

export function aggregateQuoteTotals(
  lines: { quantity: string; unitPriceHtCents: number }[],
  vatRateBps: number
): {
  subtotalHtCents: number;
  vatCents: number;
  totalTtcCents: number;
} {
  let subtotal = 0;
  for (const line of lines) {
    subtotal += lineTotalHtCents(line.quantity, line.unitPriceHtCents);
  }
  const vat = Math.round((subtotal * vatRateBps) / 10000);
  return {
    subtotalHtCents: subtotal,
    vatCents: vat,
    totalTtcCents: subtotal + vat,
  };
}

export function formatCentsEUR(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
