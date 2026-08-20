import type { FilterState, Product } from "../types";

// Rounds up to the nearest 10 above the priciest product, so the price
// slider's max never sits exactly on a real product's price.
export function getMaxPrice(products: Product[]): number {
  return products.length ? Math.ceil(Math.max(...products.map((p) => p.price)) / 10) * 10 : 100;
}

// Whole-number discount percentage off a product's oldPrice, or null if
// it isn't discounted.
export function getDiscountPercent(product: Product): number | null {
  return product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;
}

// Sort comparator for "biggest discount first" — used anywhere deals are
// ranked (Home's Today's Deals preview, Shop's deals view).
export function byBiggestDiscount(a: Product, b: Product): number {
  const discA = a.oldPrice ? 1 - a.price / a.oldPrice : 0;
  const discB = b.oldPrice ? 1 - b.price / b.oldPrice : 0;
  return discA < discB ? 1 : -1;
}

// Shared category/price/rating/stock predicate used by both Shop and
// Discover's filter sidebar. Callers can layer their own extra checks
// (e.g. Shop's search query) on top.
export function matchesFilters(product: Product, filters: FilterState): boolean {
  if (filters.categories.length && !filters.categories.includes(product.category)) return false;
  if (product.price > filters.priceMax || product.price < filters.priceMin) return false;
  if (filters.minRating && product.rating < filters.minRating) return false;
  if (filters.inStockOnly && product.stock === 0) return false;
  return true;
}
