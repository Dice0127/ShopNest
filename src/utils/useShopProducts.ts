import { useEffect, useMemo, useState } from "react";
import { useCatalog } from "../CatalogContext";
import { applySort } from "./sorting";
import { useFilterParams } from "./useFilterParams";
import { getMaxPrice, matchesFilters, byBiggestDiscount } from "./productMath";
import type { Layout, SortValue } from "../types";

// Today's Deals only shows the biggest discounts, not every discounted item.
const DEALS_LIMIT = 12;
// Regular Shop browsing paginates like Discover, instead of one long scroll.
const PAGE_SIZE = 20;

interface UseShopProductsArgs {
  query: string;
  categoryFilter: string | null;
  dealsOnly: boolean;
}

/**
 * Owns all of the Shop page's data orchestration — filters (URL-backed),
 * sort, the deals-only pool, loading simulation, and pagination — so the
 * component itself only has to render the result. Pulled out of Shop.tsx
 * because that state machine was the bulk of what made the component large.
 */
export function useShopProducts({ query, categoryFilter, dealsOnly }: UseShopProductsArgs) {
  const { products } = useCatalog();
  const maxPrice = useMemo(() => getMaxPrice(products), [products]);
  // Backed by URL search params (?cat=, ?pmin=, ?pmax=, ?rating=, ?stock=) so
  // filters — including the category checkboxes — survive navigating to a
  // product and back, instead of resetting when this route remounts.
  const [filters, setFilters] = useFilterParams(maxPrice);
  const [sort, setSort] = useState<SortValue>("featured");
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<Layout>("grid");
  const [page, setPage] = useState(1);

  const dealCategories = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    products.forEach((p) => {
      if (p.oldPrice && !seen.has(p.category)) {
        seen.add(p.category);
        list.push(p.category);
      }
    });
    return list.sort();
  }, [products]);

  // Category tabs state for the deals view (replaces the Filters sidebar there).
  // Seeded from the URL's ?category= param too, so a link like
  // /shop?deals=1&category=beauty (e.g. from a product's breadcrumb) lands
  // on the right tab instead of always defaulting to the first category.
  const [dealCategory, setDealCategory] = useState<string | null>(categoryFilter || dealCategories[0] || null);

  // Sync category filter coming from navbar dropdown (regular Shop view)
  useEffect(() => {
    if (categoryFilter && !dealsOnly) {
      setFilters((f) => ({ ...f, categories: [categoryFilter] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, dealsOnly]);

  // Sync category filter coming from the URL for the deals view specifically
  useEffect(() => {
    if (categoryFilter && dealsOnly) {
      setDealCategory(categoryFilter);
    }
  }, [categoryFilter, dealsOnly]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, [query, filters, sort, dealCategory, page]);

  // Filters/sort/search changing can leave `page` out of range — snap back to 1.
  useEffect(() => {
    setPage(1);
  }, [query, filters, sort, dealsOnly, dealCategory]);

  const filtered = useMemo(() => {
    if (dealsOnly) {
      // Pick the biggest discounts first (fixed, independent of the sort
      // dropdown below) then only keep the top ones — same "top pool"
      // pattern as the Top Products page, so this stays a curated
      // shortlist, not a full listing of every discounted item.
      let pool = products.filter((p) => {
        if (!p.oldPrice) return false;
        if (dealCategory && p.category !== dealCategory) return false;
        if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      });
      pool = [...pool].sort(byBiggestDiscount).slice(0, DEALS_LIMIT);

      return sort === "featured" ? pool : applySort(pool, sort); // featured = biggest discount first
    }

    const list = products.filter((p) => {
      if (!matchesFilters(p, filters)) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    return applySort(list, sort);
  }, [products, filters, sort, query, dealsOnly, dealCategory]);

  const totalPages = dealsOnly ? 1 : Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => (dealsOnly ? filtered : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)),
    [filtered, page, dealsOnly]
  );

  const goToPage = (n: number) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    maxPrice,
    filters,
    setFilters,
    sort,
    setSort,
    loading,
    layout,
    setLayout,
    page,
    goToPage,
    totalPages,
    dealCategories,
    dealCategory,
    setDealCategory,
    filtered,
    pageItems,
  };
}
