import { useMemo } from "react";
import { formatPrice } from "../utils/currency";
import { ChevronRight, Flame, ShieldCheck, Truck } from "lucide-react";
import { useCatalog } from "../CatalogContext";
import { shuffled } from "../utils/shuffle";
import { byBiggestDiscount } from "../utils/productMath";
import { useHeroSlides } from "../utils/useHeroSlides";
import ProductCard from "./ProductCard";
import HeroCarousel from "./HeroCarousel";
import CategoryRail from "./home/CategoryRail";
import TopProductsSection from "./home/TopProductsSection";
import GuaranteeBanner from "./home/GuaranteeBanner";
import { buildProductCrumbs, type Crumb } from "./Breadcrumbs";
import type { Product } from "../types";
import "./Home.css";

const DISCOVER_PREVIEW_SIZE = 10;

interface HomeProps {
  onSelectCategory: (category: string | null) => void;
  onGoDeals: () => void;
  onOpenProduct: (product: Product, crumbs?: Crumb[]) => void;
  onGoTopProducts: () => void;
  onGoDiscover: () => void;
}

export default function Home({ onSelectCategory, onGoDeals, onOpenProduct, onGoTopProducts, onGoDiscover }: HomeProps) {
  const { products, categories } = useCatalog();

  const deals = useMemo(
    () => products.filter((p) => p.oldPrice).sort(byBiggestDiscount),
    [products]
  );

  // compact row of picks for the "guaranteed" style promo banner
  const guaranteedPicks = useMemo(() => shuffled(products, 7).slice(0, 5), [products]);

  // Top Products — ranked by rating first, review count as tiebreaker (not personalized, no filters)
  const topPicks = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 4),
    [products]
  );

  // Daily Discover preview — a fixed shuffled sample; "See more" leads to the
  // full, paginated catalog on its own page instead of an ever-growing feed.
  const discoverPreview = useMemo(
    () => shuffled(products, 0).slice(0, DISCOVER_PREVIEW_SIZE),
    [products]
  );

  const heroSlides = useHeroSlides(products, deals, onSelectCategory, onGoDeals);

  return (
    <div className="home-page">
      <section className="home-welcome-strip">
        <div className="container home-welcome-inner">
          <h2>Welcome to ShopNest</h2>
          <div className="home-welcome-perks">
            <span><Truck size={16} /> Free shipping over {formatPrice(2000)}</span>
            <span><ShieldCheck size={16} /> Secure checkout</span>
            <span><Flame size={16} /> New deals every week</span>
          </div>
        </div>
      </section>

      <section className="container home-main">
        <CategoryRail categories={categories} onSelectCategory={onSelectCategory} />

        <div className="home-main-right">
          <HeroCarousel slides={heroSlides} />
          <TopProductsSection products={topPicks} onOpenProduct={onOpenProduct} onGoTopProducts={onGoTopProducts} />
        </div>
      </section>

      <section className="container home-deals">
        <div className="home-section-header">
          <h2>Today's Deals</h2>
          <button className="home-view-all" onClick={onGoDeals}>
            View all deals <ChevronRight size={15} />
          </button>
        </div>
        <div className="product-grid">
          {deals.slice(0, 5).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onOpen={(product) =>
                onOpenProduct(
                  product,
                  buildProductCrumbs(
                    product,
                    { label: "Today's Deals", to: "/shop?deals=1" },
                    `/shop?deals=1&category=${encodeURIComponent(product.category)}`
                  )
                )
              }
            />
          ))}
        </div>
      </section>

      <section className="container">
        <GuaranteeBanner picks={guaranteedPicks} onGoDeals={onGoDeals} onOpenProduct={onOpenProduct} />
      </section>

      <section className="container home-feed">
        <div className="home-section-header">
          <h2>Daily Discover</h2>
          <span className="home-feed-sub">A fresh batch of products, refreshed daily</span>
        </div>
        <div className="product-grid">
          {discoverPreview.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onOpen={(product) => onOpenProduct(product, buildProductCrumbs(product, { label: "Discover", to: "/discover" }))}
            />
          ))}
        </div>

        <div className="home-feed-more">
          <button className="btn btn-outline" onClick={onGoDiscover}>
            See more
          </button>
        </div>
      </section>
    </div>
  );
}
