import { BadgeCheck, CheckCircle2 } from "lucide-react";
import { formatPrice } from "../../utils/currency";
import { buildProductCrumbs } from "../Breadcrumbs";
import type { Product } from "../../types";

interface GuaranteeBannerProps {
  picks: Product[];
  onGoDeals: () => void;
  onOpenProduct: (product: Product, crumbs?: ReturnType<typeof buildProductCrumbs>) => void;
}

export default function GuaranteeBanner({ picks, onGoDeals, onOpenProduct }: GuaranteeBannerProps) {
  return (
    <div className="home-guarantee-banner">
      <div className="home-guarantee-copy">
        <div className="home-guarantee-brand"><BadgeCheck size={20} /> ShopNest Guaranteed</div>
        <ul>
          <li><CheckCircle2 size={14} /> Quick order and pay</li>
          <li><CheckCircle2 size={14} /> On-time delivery</li>
          <li><CheckCircle2 size={14} /> Money-back guarantee</li>
        </ul>
        <button className="btn home-guarantee-btn" onClick={onGoDeals}>Explore now</button>
      </div>
      <div className="home-guarantee-picks">
        {picks.map((p) => (
          <button key={p.id} className="home-guarantee-pick" onClick={() => onOpenProduct(p, buildProductCrumbs(p))}>
            <img src={p.img} alt={p.name} />
            <span className="home-guarantee-price">{formatPrice(p.price)}</span>
            <span className={`home-guarantee-tag ${p.stock === 0 ? "" : "is-free"}`}>
              {p.stock === 0 ? `${p.reviews} reviews` : "FREE shipping"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
