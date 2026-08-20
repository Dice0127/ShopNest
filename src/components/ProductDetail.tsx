import { formatPrice } from "../utils/currency";
import { getDiscountPercent } from "../utils/productMath";
import { useState } from "react";
import { ArrowLeft, Star, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCatalog } from "../CatalogContext";
import { categoryLabel } from "../data/categoryMeta";
import { useCart } from "../CartContext";
import { useToast } from "../ToastContext";
import ProductCard from "./ProductCard";
import Breadcrumbs, { buildProductCrumbs, type Crumb } from "./Breadcrumbs";
import type { Product } from "../types";
import "./ProductDetail.css";
import "./ProductGrid.css";

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onOpenProduct: (product: Product, crumbs?: Crumb[]) => void;
  onBuyNow?: () => void;
  /** Crumb trail carried over from wherever the user clicked to get here
   *  (Today's Deals, Top Products, Discover, Shop). Falls back to a plain
   *  Home > Category > Product trail when navigated to directly. */
  breadcrumb?: Crumb[];
}

export default function ProductDetail({ product, onBack, onOpenProduct, onBuyNow, breadcrumb }: ProductDetailProps) {
  const { products } = useCatalog();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);

  const discount = getDiscountPercent(product);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const trail = breadcrumb ?? buildProductCrumbs(product);
  // Related items share this product's category, so reuse the same trail
  // up to (but not including) the current product name, then swap in theirs.
  const relatedTrail = (p: Product): Crumb[] => [...trail.slice(0, -1), { label: p.name }];

  const stockLabel = product.stock === 0 ? "Out of stock" : product.stock <= 10 ? `Only ${product.stock} left` : "In stock";
  const stockClass = product.stock === 0 ? "out" : product.stock <= 10 ? "low" : "in";

  const handleAdd = () => {
    if (product.stock === 0) return;
    addItem(product, qty);
    showToast(`${qty} × ${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (product.stock === 0) return;
    addItem(product, qty);
    onBuyNow?.();
  };

  return (
    <div className="container">
      <Breadcrumbs items={trail} />

      <button className="detail-back" onClick={onBack}>
        <ArrowLeft size={15} /> Back to shop
      </button>

      <div className="detail-grid">
        <div className="detail-img-wrap">
          {discount && <span className="detail-badge">-{discount}%</span>}
          <img className="detail-img" src={product.img} alt={product.name} />
        </div>

        <div>
          <div className="detail-category">{categoryLabel(product.category)}</div>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating">
            <Star size={15} fill="var(--star)" color="var(--star)" />
            {product.rating} · {product.reviews} reviews
          </div>

          <div className="detail-price-row">
            <span className="detail-price">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="detail-oldprice">{formatPrice(product.oldPrice)}</span>}
          </div>

          <p className="detail-desc">{product.desc}</p>

          <div className={`detail-stock ${stockClass}`}>{stockLabel}</div>

          <div className="detail-actions">
            <div className="qty-stepper">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span>{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                disabled={qty >= product.stock}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
            {product.stock > 0 && <span className="detail-stock-count">{product.stock} pieces available</span>}
          </div>

          <div className="detail-actions">
            <button className="btn btn-outline" onClick={handleAdd} disabled={product.stock === 0}>
              <ShoppingCart size={16} /> {product.stock === 0 ? "Out of stock" : "Add to Cart"}
            </button>
            <button className="btn btn-primary" onClick={handleBuyNow} disabled={product.stock === 0}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="detail-related">
          <h2>You might also like</h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={(prod) => onOpenProduct(prod, relatedTrail(prod))} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
