import { formatPrice } from "../utils/currency";
import { useCart } from "../CartContext";

export default function OrderSummary() {
  const { items, subtotal, shipping, tax, total, discount, coupon } = useCart();

  return (
    <div className="summary-card">
      <h3>Order Summary</h3>
      <div className="summary-item-list">
        {items.map((i) => (
          <div key={i.id} className="summary-item-row">
            <img src={i.img} alt={i.name} />
            <span className="name">{i.name}</span>
            <span className="qty">×{i.qty}</span>
            <span className="price">{formatPrice(i.price * i.qty)}</span>
          </div>
        ))}
      </div>
      <div className="summary-row summary-row-first">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="summary-row">
          <span>Discount {coupon ? `(${coupon.code})` : ""}</span>
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
    </div>
  );
}
