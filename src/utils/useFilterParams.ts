import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import type { FilterState } from "../types";

/**
 * Same shape as useState<FilterState>, but backed by URL search params
 * instead of component state. This means filters (category checkboxes,
 * price range, rating, in-stock toggle) survive navigating to a product
 * and back — the route remounts, but the URL (and therefore the filters)
 * is unchanged, unlike local state which resets on unmount.
 */
export function useFilterParams(maxPrice: number): [FilterState, Dispatch<SetStateAction<FilterState>>] {
  const [searchParams, setSearchParams] = useSearchParams();
  // Memoized on the actual param string, not recreated every render — other
  // effects/memos in Shop/Discover depend on `filters` by reference (e.g. to
  // reset pagination or trigger the loading skeleton), so a fresh object on
  // every render would fire those on every render too.
  const paramString = searchParams.toString();

  const filters: FilterState = useMemo(() => ({
    categories: searchParams.has("cat") ? searchParams.get("cat")!.split(",").filter(Boolean) : [],
    priceMin: searchParams.has("pmin") ? Number(searchParams.get("pmin")) : 0,
    priceMax: searchParams.has("pmax") ? Number(searchParams.get("pmax")) : maxPrice,
    minRating: searchParams.has("rating") ? Number(searchParams.get("rating")) : 0,
    inStockOnly: searchParams.get("stock") === "1",
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [paramString, maxPrice]);

  const setFilters: Dispatch<SetStateAction<FilterState>> = (value) => {
    const next = typeof value === "function" ? (value as (f: FilterState) => FilterState)(filters) : value;
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        next.categories.length ? p.set("cat", next.categories.join(",")) : p.delete("cat");
        next.priceMin > 0 ? p.set("pmin", String(next.priceMin)) : p.delete("pmin");
        next.priceMax < maxPrice ? p.set("pmax", String(next.priceMax)) : p.delete("pmax");
        next.minRating > 0 ? p.set("rating", String(next.minRating)) : p.delete("rating");
        next.inStockOnly ? p.set("stock", "1") : p.delete("stock");
        return p;
      },
      { replace: true } // don't spam browser history on every checkbox click
    );
  };

  return [filters, setFilters];
}
