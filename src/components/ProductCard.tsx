import { formatPrice } from "../utils/currency";
import { getDiscountPercent } from "../utils/productMath";
import type { MouseEvent } from "react";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../CartContext";
import { useToast } from "../ToastContext";
import { useWishlist } from "../WishlistContext";
import type { Layout, Product } from "../types";
import "./ProductGrid.css";

interface ProductCardProps {
  product: Product;
  onOpen: (product: Product) => void;
  layout?: Layout;
}

export default function ProductCard({ product, onOpen, layout = "grid" }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { isWishlisted, toggle } = useWishlist();
  const discount = getDiscountPercent(product);
  const outOfStock = product.stock === 0;
  const wished = isWishlisted(product.id);

  const handleAdd = (e: MouseEvent) => {
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product, 1);
    showToast(`${product.name} added to cart`);
  };

  const handleWish = (e: MouseEvent) => {
    e.stopPropagation();
    toggle(product.id);
    showToast(wished ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`);
  };

  return (
    <div
      className={`product-card ${layout === "list" ? "is-list" : ""}`}
      onClick={() => onOpen(product)}
    >
      <div className="product-card-img-wrap">
        {discount && <span className="product-card-badge">-{discount}%</span>}
        <img className="product-card-img" src={product.img} alt={product.name} loading="lazy" />
        <button
          className={`product-card-wish ${wished ? "is-active" : ""}`}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWish}
        >
          <Heart size={15} fill={wished ? "currentColor" : "none"} />
        </button>
        {outOfStock && <div className="product-card-oos">Out of stock</div>}
      </div>
      <div className="product-card-body">
        <button
          type="button"
          className="product-card-name product-card-name-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(product);
          }}
        >
          {product.name}
        </button>
        <div className="product-card-desc">{product.desc}</div>
        <div className="product-card-rating">
          <Star size={13} fill="var(--star)" color="var(--star)" />
          {product.rating} ({product.reviews})
        </div>
        <div className="product-card-price-row">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {product.oldPrice && <span className="product-card-oldprice">{formatPrice(product.oldPrice)}</span>}
        </div>
        <button className="product-card-add" onClick={handleAdd} disabled={outOfStock}>
          <ShoppingCart size={14} /> {outOfStock ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
