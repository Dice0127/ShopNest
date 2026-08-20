import { useShopProducts } from "../utils/useShopProducts";
import Filters from "./Filters";
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";
import Toolbar from "./Toolbar";
import CategoryTabs from "./CategoryTabs";
import Pagination from "./Pagination";
import Breadcrumbs, { buildProductCrumbs, type Crumb } from "./Breadcrumbs";
import { categoryLabel } from "../data/categoryMeta";
import type { Product } from "../types";
import "./ProductGrid.css";
import "./TopProducts.css";

interface ShopProps {
  query: string;
  onOpenProduct: (product: Product, crumbs?: Crumb[]) => void;
  categoryFilter: string | null;
  dealsOnly: boolean;
}

export default function Shop({ query, onOpenProduct, categoryFilter, dealsOnly }: ShopProps) {
  const {
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
  } = useShopProducts({ query, categoryFilter, dealsOnly });

  const noSidebar = dealsOnly;

  // The regular Shop page's breadcrumb never names a specific category —
  // the sidebar's category selection is checkbox-based (multi-select), so
  // a single "Shop > Category" crumb would misrepresent it as one fixed
  // page. The deals view is different: its category tabs are single-select,
  // so there's always exactly one active category worth naming.
  const breadcrumbItems = dealsOnly
    ? [
        { label: "Home", to: "/" },
        { label: "Today's Deals", to: dealCategory ? "/shop?deals=1" : undefined },
        ...(dealCategory ? [{ label: categoryLabel(dealCategory) }] : []),
      ]
    : [{ label: "Home", to: "/" }, { label: "Shop" }];

  const productSourceCrumb: Crumb = dealsOnly
    ? { label: "Today's Deals", to: "/shop?deals=1" }
    : { label: "Shop", to: "/shop" };

  // Category crumb link for a product opened from here: for deals, route
  // back into the deals view filtered by that category (not the plain
  // Shop page), so the trail stays consistent with where you came from.
  const productCategoryTo = (product: Product) =>
    dealsOnly ? `/shop?deals=1&category=${encodeURIComponent(product.category)}` : undefined;

  return (
    <div className="container">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="shop-layout">
        {!noSidebar && <Filters filters={filters} setFilters={setFilters} maxPrice={maxPrice} />}

      <div className={noSidebar ? "shop-content-full" : undefined}>
        {!dealsOnly && query && (
          <h2 className="shop-search-heading">Search results for &quot;{query}&quot;</h2>
        )}

        {dealsOnly && (
          <div className="top-products-header">
            <h1>Today's Deals</h1>
            <p>Today's biggest discounts — pick a category to see its top deals.</p>
          </div>
        )}

        {dealsOnly && dealCategories.length > 0 && (
          <CategoryTabs categories={dealCategories} active={dealCategory} onSelect={setDealCategory} />
        )}

        <Toolbar sort={sort} setSort={setSort} layout={layout} setLayout={setLayout} />

        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="product-empty">
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className={`product-grid ${layout === "list" ? "is-list" : ""}`}>
            {pageItems.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpen={(product) => onOpenProduct(product, buildProductCrumbs(product, productSourceCrumb, productCategoryTo(product)))}
                layout={layout}
              />
            ))}
          </div>
        )}

        {!dealsOnly && !loading && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} label="Shop pages" />
        )}
      </div>
      </div>
    </div>
  );
}
