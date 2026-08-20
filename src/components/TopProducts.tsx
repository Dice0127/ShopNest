import { useMemo, useState } from "react";
import { useCatalog } from "../CatalogContext";
import { applySort } from "../utils/sorting";
import ProductCard from "./ProductCard";
import Toolbar from "./Toolbar";
import CategoryTabs from "./CategoryTabs";
import Breadcrumbs, { buildProductCrumbs, type Crumb } from "./Breadcrumbs";
import { categoryLabel } from "../data/categoryMeta";
import type { Layout, Product, SortValue } from "../types";
import "./ProductGrid.css";
import "./TopProducts.css";

const PER_CATEGORY = 10;

interface TopProductsProps {
  onOpenProduct: (product: Product, crumbs?: Crumb[]) => void;
}

export default function TopProducts({ onOpenProduct }: TopProductsProps) {
  const { products, categories } = useCatalog();
  const [active, setActive] = useState<string | null>(categories[0] || null);
  const [sort, setSort] = useState<SortValue>("featured");
  const [layout, setLayout] = useState<Layout>("grid");

  // The top-rated pool (and each product's rank) stays fixed by rating —
  // sort only changes the display order below, not who makes the cut.
  const topPool = useMemo(() => {
    const pool = active ? products.filter((p) => p.category === active) : products;
    return [...pool].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, PER_CATEGORY);
  }, [products, active]);

  const rankOf = useMemo(() => new Map(topPool.map((p, i) => [p.id, i])), [topPool]);

  const ranked = useMemo(
    () => (sort === "featured" ? topPool : applySort(topPool, sort)), // featured = top-rated order
    [topPool, sort]
  );

  return (
    <div className="container top-products-page">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Top Products", to: active ? "/top-products" : undefined },
          ...(active ? [{ label: categoryLabel(active) }] : []),
        ]}
      />
      <div className="top-products-header">
        <h1>Top Products</h1>
        <p>The best-rated picks per category — pick a category to see its top sellers.</p>
      </div>

      <CategoryTabs categories={categories} active={active} onSelect={setActive} />

      {ranked.length === 0 ? (
        <div className="product-empty">
          <h3>No products in this category yet</h3>
        </div>
      ) : (
        <>
          <Toolbar sort={sort} setSort={setSort} layout={layout} setLayout={setLayout} />

          <div className={`product-grid top-products-grid ${layout === "list" ? "is-list" : ""}`}>
            {ranked.map((p) => {
              const i = rankOf.get(p.id)!;
              return (
                <div key={p.id} className="top-products-item">
                  <span className={`top-rank-badge ${i < 3 ? "is-top3" : ""}`}>{i < 3 ? `TOP ${i + 1}` : i + 1}</span>
                  <ProductCard
                    product={p}
                    onOpen={(product) => onOpenProduct(product, buildProductCrumbs(product, { label: "Top Products", to: "/top-products" }))}
                    layout={layout}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
