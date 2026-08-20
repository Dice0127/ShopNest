import { useEffect, useMemo, useState } from "react";
import { useCatalog } from "../CatalogContext";
import { applySort } from "../utils/sorting";
import { shuffled } from "../utils/shuffle";
import { useFilterParams } from "../utils/useFilterParams";
import { getMaxPrice, matchesFilters } from "../utils/productMath";
import Filters from "./Filters";
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";
import Toolbar from "./Toolbar";
import Pagination from "./Pagination";
import Breadcrumbs, { buildProductCrumbs, type Crumb } from "./Breadcrumbs";
import type { Layout, Product, SortValue } from "../types";
import "./ProductGrid.css";
import "./TopProducts.css";
import "./Discover.css";

const PAGE_SIZE = 20;

interface DiscoverProps {
  onOpenProduct: (product: Product, crumbs?: Crumb[]) => void;
}

export default function Discover({ onOpenProduct }: DiscoverProps) {
  const { products } = useCatalog();
  const maxPrice = useMemo(() => getMaxPrice(products), [products]);
  // Backed by URL search params so filters survive navigating to a product
  // and back, instead of resetting when this route remounts.
  const [filters, setFilters] = useFilterParams(maxPrice);
  const [sort, setSort] = useState<SortValue>("featured");
  const [layout, setLayout] = useState<Layout>("grid");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Stable shuffled base order so "Featured" still feels like a daily mix,
  // then filters/sort apply on top of it.
  const baseOrder = useMemo(() => shuffled(products, 0), [products]);

  const filtered = useMemo(() => {
    const list = baseOrder.filter((p) => matchesFilters(p, filters));
    return sort === "featured" ? list : applySort(list, sort); // featured = shuffled order
  }, [baseOrder, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Filters/sort changing can leave `page` out of range — snap back to 1.
  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [page, filtered]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const goToPage = (n: number) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Discover" }]} />
      <div className="shop-layout">
      <Filters filters={filters} setFilters={setFilters} maxPrice={maxPrice} />

      <div>
        <div className="top-products-header">
          <h1>Daily Discover</h1>
          <p>The full catalog, a fresh shuffle every visit — browse page by page.</p>
        </div>

        <Toolbar sort={sort} setSort={setSort} layout={layout} setLayout={setLayout} />

        {loading ? (
          <div className="product-grid">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="product-empty">
            <h3>No products found</h3>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
          <div className={`product-grid ${layout === "list" ? "is-list" : ""}`}>
            {pageItems.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpen={(product) => onOpenProduct(product, buildProductCrumbs(product, { label: "Discover", to: "/discover" }))}
                layout={layout}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} label="Discover pages" />}
      </div>
      </div>
    </div>
  );
}
