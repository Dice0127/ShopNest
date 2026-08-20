import { formatPrice } from "../utils/currency";
import { useState, type FormEvent } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { useCart } from "../CartContext";
import { useToast } from "../ToastContext";
import { useDialog } from "../utils/useDialog";
import type { ApplyCouponResult, CartItem } from "../types";
import "./CartDrawer.css";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { items, subtotal, shipping, tax, discount, total, coupon, applyCoupon, removeCoupon, setQty, removeItem, addItem } = useCart();
  const { showToast } = useToast();
  const [code, setCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<ApplyCouponResult | null>(null);
  const panelRef = useDialog(open, onClose);

  if (!open) return null;

  const handleApply = (e: FormEvent) => {
    e.preventDefault();
    const result = applyCoupon(code);
    setCouponMsg(result);
    if (result.ok) setCode("");
  };

  const handleRemove = (item: CartItem) => {
    removeItem(item.id);
    showToast(`Removed ${item.name}`, {
      label: "Undo",
      onClick: () => addItem(item, item.qty),
    });
  };

  return (
    <div className="drawer-overlay">
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-panel" role="dialog" aria-modal="true" aria-label="Shopping cart" ref={panelRef} tabIndex={-1}>
        <div className="drawer-header">
          <h3>Your Cart ({items.reduce((s, i) => s + i.qty, 0)})</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <ShoppingBag size={40} />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            items.map((i) => (
              <div key={i.id} className="cart-line">
                <img className="cart-line-img" src={i.img} alt={i.name} />
                <div className="cart-line-info">
                  <div className="cart-line-name">{i.name}</div>
                  <div className="cart-line-meta">{formatPrice(i.price)} each</div>
                  <div className="cart-line-controls">
                    <button className="cart-qty-btn" onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease quantity">
                      <Minus size={12} />
                    </button>
                    <span className="cart-line-qty">{i.qty}</span>
                    <button className="cart-qty-btn" onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase quantity">
                      <Plus size={12} />
                    </button>
                    <button className="cart-line-remove" onClick={() => handleRemove(i)} aria-label={`Remove ${i.name}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="cart-line-price">{formatPrice(i.qty * i.price)}</div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-summary">
            <form className="coupon-row" onSubmit={handleApply}>
              <div className="coupon-input-wrap">
                <Tag size={14} />
                <input
                  placeholder="Enter coupon code"
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setCouponMsg(null); }}
                  aria-label="Coupon code"
                />
              </div>
              <button type="submit" className="btn btn-outline coupon-apply-btn">Apply</button>
            </form>
            {couponMsg && (
              <div className={`coupon-msg ${couponMsg.ok ? "is-ok" : "is-error"}`}>{couponMsg.message}</div>
            )}
            {coupon && (
              <div className="coupon-applied">
                <span>"{coupon.code}" applied — {coupon.label}</span>
                <button type="button" onClick={removeCoupon}>Remove</button>
              </div>
            )}

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row">
                <span>Discount</span>
                <span className="free">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span className={shipping === 0 ? "free" : ""}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="drawer-footer-actions">
              <button className="btn btn-primary btn-block" onClick={onCheckout}>
                Checkout
              </button>
              <button className="continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
