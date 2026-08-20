import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCart } from "../CartContext";
import StepIndicator from "./StepIndicator";
import OrderSummary from "./OrderSummary";
import ShippingStep from "./ShippingStep";
import PaymentStep from "./PaymentStep";
import ReviewStep from "./ReviewStep";
import ConfirmationStep from "./ConfirmationStep";
import type { PaymentInfo, ShippingInfo } from "../types";
import "./Checkout.css";

const EMPTY_SHIPPING: ShippingInfo = { fullName: "", email: "", address: "", city: "", state: "", zip: "", phone: "" };
const EMPTY_PAYMENT: PaymentInfo = { method: "card", cardName: "", cardNumber: "", expiry: "", cvv: "" };

interface CheckoutFlowProps {
  onDone: () => void;
  onCancel: () => void;
  onEmptyCart?: () => void;
}

export default function CheckoutFlow({ onDone, onCancel, onEmptyCart }: CheckoutFlowProps) {
  const { items, clear } = useCart();
  const [step, setStep] = useState(0);
  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING);
  const [payment, setPayment] = useState<PaymentInfo>(EMPTY_PAYMENT);
  const [orderId, setOrderId] = useState("");

  // Guard: you shouldn't be able to land on checkout with nothing to buy.
  // Skipped once step reaches 3 (confirmation) since placing an order
  // clears the cart on purpose at that point.
  useEffect(() => {
    if (items.length === 0 && step < 3) {
      onEmptyCart?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, step]);

  const handlePlaceOrder = () => {
    setOrderId(String(Math.floor(10000 + Math.random() * 90000)));
    clear();
    setStep(3);
  };

  if (items.length === 0 && step < 3) {
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        {step < 3 && (
          <div className="checkout-topbar">
            <StepIndicator current={step} />
            <button type="button" className="checkout-cancel" onClick={onCancel}>
              <X size={16} /> Cancel
            </button>
          </div>
        )}

        {step === 3 ? (
          <ConfirmationStep orderId={orderId} email={shipping.email} onContinue={onDone} />
        ) : (
          <div className="checkout-shell">
            <OrderSummary />
            <div className="checkout-main">
              {step === 0 && <ShippingStep data={shipping} onNext={(d) => { setShipping(d); setStep(1); }} />}
              {step === 1 && (
                <PaymentStep data={payment} onNext={(d) => { setPayment(d); setStep(2); }} onBack={() => setStep(0)} />
              )}
              {step === 2 && (
                <ReviewStep
                  shipping={shipping}
                  payment={payment}
                  onBack={() => setStep(1)}
                  onEditStep={(i) => setStep(i)}
                  onPlaceOrder={handlePlaceOrder}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
