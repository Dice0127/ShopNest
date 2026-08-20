import { formatPrice } from "../utils/currency";
import { X, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCatalog } from "../CatalogContext";
import { useWishlist } from "../WishlistContext";
import { useCart } from "../CartContext";
import { useToast } from "../ToastContext";
import { useDialog } from "../utils/useDialog";
import type { Product } from "../types";
import "./CartDrawer.css";

interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenProduct: (product: Product) => void;
}

export default function WishlistDrawer({ open, onClose, onOpenProduct }: WishlistDrawerProps) {
  const { products } = useCatalog();
  const { ids, toggle } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const panelRef = useDialog(open, onClose);

  if (!open) return null;

  const items = ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const handleRemove = (p: Product) => {
    toggle(p.id);
    showToast(`Removed ${p.name} from wishlist`, {
      label: "Undo",
      onClick: () => toggle(p.id),
    });
  };

  const handleAdd = (p: Product) => {
    if (p.stock === 0) return;
    addItem(p, 1);
    showToast(`${p.name} added to cart`);
  };

  const handleOpen = (p: Product) => {
    onClose();
    onOpenProduct(p);
  };

  return (
    <div className="drawer-overlay">
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel" role="dialog" aria-modal="true" aria-label="Wishlist" ref={panelRef} tabIndex={-1}>
        <div className="drawer-header">
          <h3>Your Wishlist ({items.length})</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Close wishlist">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <Heart size={40} />
              <p>You haven't saved any products yet.</p>
            </div>
          ) : (
            items.map((p) => (
              <div key={p.id} className="cart-line">
                <img
                  className="cart-line-img is-clickable"
                  src={p.img}
                  alt=""
                  onClick={() => handleOpen(p)}
                />
                <div className="cart-line-info">
                  <button
                    type="button"
                    className="cart-line-name is-clickable cart-line-name-btn"
                    onClick={() => handleOpen(p)}
                  >
                    {p.name}
                  </button>
                  <div className="cart-line-meta">{formatPrice(p.price)}</div>
                  <div className="cart-line-controls">
                    <button
                      className="btn btn-outline btn-compact"
                      onClick={() => handleAdd(p)}
                      disabled={p.stock === 0}
                    >
                      <ShoppingCart size={13} /> {p.stock === 0 ? "Out of stock" : "Add to Cart"}
                    </button>
                    <button className="cart-line-remove" onClick={() => handleRemove(p)} aria-label={`Remove ${p.name}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
