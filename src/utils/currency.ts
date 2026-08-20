// Formats a numeric price as Philippine Peso, e.g. formatPrice(199.99) -> "₱199.99"
export function formatPrice(value: unknown): string {
  const n = Number(value) || 0;
  return `₱${n.toFixed(2)}`;
}
