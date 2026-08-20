import { formatPrice } from "../utils/currency";
import { useState } from "react";
import { useCart } from "../CartContext";
import type { PaymentInfo, ShippingInfo } from "../types";

interface ReviewStepProps {
  shipping: ShippingInfo;
  payment: PaymentInfo;
  onBack: () => void;
  onEditStep: (step: number) => void;
  onPlaceOrder: () => void;
}

export default function ReviewStep({ shipping, payment, onBack, onEditStep, onPlaceOrder }: ReviewStepProps) {
  const { items } = useCart();
  const [placing, setPlacing] = useState(false);

  const cardLast4 = payment.method === "card" ? payment.cardNumber.replace(/\s/g, "").slice(-4) : null;

  const handlePlace = () => {
    setPlacing(true);
    setTimeout(() => {
      onPlaceOrder();
    }, 1400);
  };

  return (
    <div className="checkout-card">
      <h2>Review Your Order</h2>

      <div className="review-section">
        <div className="review-section-title">
          Shipping to
          <button className="review-edit-link" onClick={() => onEditStep(0)}>Edit</button>
        </div>
        <p className="review-line">
          {shipping.fullName}<br />
          {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}<br />
          {shipping.email} · {shipping.phone}
        </p>
      </div>

      <div className="review-section">
        <div className="review-section-title">
          Payment method
          <button className="review-edit-link" onClick={() => onEditStep(1)}>Edit</button>
        </div>
        <p className="review-line">
          {payment.method === "card" ? `Card ending in ${cardLast4} — ${payment.cardName}` : "PayPal"}
        </p>
      </div>

      <div className="review-section">
        <div className="review-section-title">Items ({items.reduce((s, i) => s + i.qty, 0)})</div>
        {items.map((i) => (
          <div key={i.id} className="review-item-row">
            <span>{i.qty} × {i.name}</span>
            <span>{formatPrice(i.qty * i.price)}</span>
          </div>
        ))}
      </div>

      <div className="checkout-actions">
        <button type="button" className="btn btn-outline" onClick={onBack} disabled={placing}>Back</button>
        <button type="button" className="btn btn-primary" onClick={handlePlace} disabled={placing}>
          {placing ? "Placing order…" : "Place Order"}
        </button>
      </div>
    </div>
  );
}
