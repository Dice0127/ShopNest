import { ChevronRight, Star } from "lucide-react";
import { categoryLabel } from "../../data/categoryMeta";
import { buildProductCrumbs, type Crumb } from "../Breadcrumbs";
import type { Product } from "../../types";

interface TopProductsSectionProps {
  products: Product[];
  onOpenProduct: (product: Product, crumbs?: Crumb[]) => void;
  onGoTopProducts: () => void;
}

export default function TopProductsSection({ products, onOpenProduct, onGoTopProducts }: TopProductsSectionProps) {
  return (
    <>
      <div className="home-section-header">
        <h2>Top Products</h2>
        <button className="home-view-all" onClick={onGoTopProducts}>
          View all top products <ChevronRight size={15} />
        </button>
      </div>
      <div className="home-spotlight-grid">
        {products.map((p) => (
          <button
            key={p.id}
            className="home-spotlight-card"
            onClick={() => onOpenProduct(p, buildProductCrumbs(p, { label: "Top Products", to: "/top-products" }))}
          >
            <span className="home-spotlight-label">{categoryLabel(p.category)}</span>
            <img src={p.img} alt={p.name} />
            <span className="home-spotlight-name">{p.name}</span>
            <span className="home-spotlight-rating"><Star size={12} fill="var(--star)" color="var(--star)" /> {p.rating}</span>
          </button>
        ))}
      </div>
    </>
  );
}
