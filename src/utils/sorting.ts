import type { Product, SortValue } from "../types";

// Shared "Sort by" options and sort logic used by Shop, Discover, and Top
// Products — kept in one place instead of copy-pasted across the three.
export const SORTS: { value: SortValue; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name: A-Z" },
];

// Sorts a copy of `list` according to `sort`. "featured" is a no-op here —
// each page defines its own default/featured order before calling this.
export function applySort<T extends Product>(list: T[], sort: SortValue): T[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
    case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
    case "rating": sorted.sort((a, b) => b.rating - a.rating); break;
    case "newest": sorted.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()); break;
    case "name": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: break;
  }
  return sorted;
}
