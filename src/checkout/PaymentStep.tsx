import { useState, type FormEvent, type FocusEvent } from "react";
import { CreditCard, Wallet } from "lucide-react";
import { useFieldValidation } from "../utils/useFieldValidation";
import type { PaymentInfo, PaymentMethod, ValidatorMap } from "../types";

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

const CARD_VALIDATORS: ValidatorMap<PaymentInfo> = {
  cardName: (v) => (!v.trim() ? "Required" : null),
  cardNumber: (v) => (v.replace(/\s/g, "").length !== 16 ? "Card number must be 16 digits" : null),
  expiry: (v) => {
    if (!/^\d{2}\/\d{2}$/.test(v)) return "Use MM/YY format";
    const mm = Number(v.split("/")[0]);
    if (mm < 1 || mm > 12) return "Invalid month";
    return null;
  },
  cvv: (v) => (!/^\d{3,4}$/.test(v) ? "3–4 digits" : null),
};

interface PaymentStepProps {
  data: PaymentInfo;
  onNext: (data: PaymentInfo) => void;
  onBack: () => void;
}

export default function PaymentStep({ data, onNext, onBack }: PaymentStepProps) {
  const [form, setForm] = useState<PaymentInfo>(data);
  const { errors, handleBlur, handleChange, validateAll } = useFieldValidation<PaymentInfo>(CARD_VALIDATORS);

  const setMethod = (method: PaymentMethod) => setForm({ ...form, method });

  const setField = (key: keyof PaymentInfo, value: string) => {
    const next = { ...form, [key]: value };
    setForm(next);
    handleChange(key, value, next);
  };

  const onBlur = (key: keyof PaymentInfo) => (e: FocusEvent<HTMLInputElement>) => handleBlur(key, e.target.value, form);

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (form.method !== "card" || validateAll(form)) onNext(form);
  };

  return (
    <div className="checkout-card">
      <h2>Payment Method</h2>

      <div className="payment-methods">
        <button type="button" className={`payment-method-btn ${form.method === "card" ? "is-active" : ""}`} onClick={() => setMethod("card")}>
          <CreditCard size={16} /> Credit / Debit Card
        </button>
        <button type="button" className={`payment-method-btn ${form.method === "paypal" ? "is-active" : ""}`} onClick={() => setMethod("paypal")}>
          <Wallet size={16} /> PayPal
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {form.method === "card" ? (
          <div className="form-grid">
            <div className="form-field full">
              <label htmlFor="cardName">Name on card</label>
              <input
                id="cardName"
                className={`form-input ${errors.cardName ? "has-error" : ""}`}
                value={form.cardName}
                onChange={(e) => setField("cardName", e.target.value)}
                onBlur={onBlur("cardName")}
                aria-invalid={!!errors.cardName}
                aria-describedby={errors.cardName ? "cardName-error" : undefined}
              />
              {errors.cardName && <span className="form-error" id="cardName-error">{errors.cardName}</span>}
            </div>
            <div className="form-field full">
              <label htmlFor="cardNumber">Card number</label>
              <input
                id="cardNumber"
                className={`form-input ${errors.cardNumber ? "has-error" : ""}`}
                placeholder="0000 0000 0000 0000"
                value={form.cardNumber}
                onChange={(e) => setField("cardNumber", formatCardNumber(e.target.value))}
                onBlur={onBlur("cardNumber")}
                aria-invalid={!!errors.cardNumber}
                aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
              />
              {errors.cardNumber && <span className="form-error" id="cardNumber-error">{errors.cardNumber}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="expiry">Expiry (MM/YY)</label>
              <input
                id="expiry"
                className={`form-input ${errors.expiry ? "has-error" : ""}`}
                placeholder="MM/YY"
                value={form.expiry}
                onChange={(e) => setField("expiry", formatExpiry(e.target.value))}
                onBlur={onBlur("expiry")}
                aria-invalid={!!errors.expiry}
                aria-describedby={errors.expiry ? "expiry-error" : undefined}
              />
              {errors.expiry && <span className="form-error" id="expiry-error">{errors.expiry}</span>}
            </div>
            <div className="form-field">
              <label htmlFor="cvv">CVV</label>
              <input
                id="cvv"
                className={`form-input ${errors.cvv ? "has-error" : ""}`}
                placeholder="123"
                value={form.cvv}
                onChange={(e) => setField("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                onBlur={onBlur("cvv")}
                aria-invalid={!!errors.cvv}
                aria-describedby={errors.cvv ? "cvv-error" : undefined}
              />
              {errors.cvv && <span className="form-error" id="cvv-error">{errors.cvv}</span>}
            </div>
          </div>
        ) : (
          <p className="payment-paypal-note">
            You'll be redirected to PayPal to complete payment after review (simulated — no real redirect in this demo).
          </p>
        )}

        <div className="checkout-actions">
          <button type="button" className="btn btn-outline" onClick={onBack}>Back</button>
          <button type="submit" className="btn btn-primary">Continue to Review</button>
        </div>
      </form>
    </div>
  );
}
