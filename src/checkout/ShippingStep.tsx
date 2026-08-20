import { useState, type ChangeEvent, type FormEvent } from "react";
import { useFieldValidation } from "../utils/useFieldValidation";
import type { ShippingInfo, ValidatorMap } from "../types";

const VALIDATORS: ValidatorMap<ShippingInfo> = {
  fullName: (v) => (!v.trim() ? "Full name is required" : null),
  email: (v) => (!/^\S+@\S+\.\S+$/.test(v) ? "Enter a valid email address" : null),
  address: (v) => (!v.trim() ? "Address is required" : null),
  city: (v) => (!v.trim() ? "City is required" : null),
  state: (v) => (!v.trim() ? "State is required" : null),
  zip: (v) => (!/^\d{4,6}$/.test(v.trim()) ? "Enter a valid ZIP code" : null),
  phone: (v) => (!/^[\d\s+()-]{7,}$/.test(v.trim()) ? "Enter a valid phone number" : null),
};

interface ShippingStepProps {
  data: ShippingInfo;
  onNext: (data: ShippingInfo) => void;
}

export default function ShippingStep({ data, onNext }: ShippingStepProps) {
  const [form, setForm] = useState<ShippingInfo>(data);
  const { errors, handleBlur, handleChange, validateAll } = useFieldValidation<ShippingInfo>(VALIDATORS);

  const set = (key: keyof ShippingInfo) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const next = { ...form, [key]: value };
    setForm(next);
    handleChange(key, value, next);
  };

  const onBlur = (key: keyof ShippingInfo) => (e: ChangeEvent<HTMLInputElement>) => handleBlur(key, e.target.value, form);

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (validateAll(form)) onNext(form);
  };

  return (
    <div className="checkout-card">
      <h2>Shipping Information</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-field full">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" className={`form-input ${errors.fullName ? "has-error" : ""}`} value={form.fullName} onChange={set("fullName")} onBlur={onBlur("fullName")} aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "fullName-error" : undefined} />
            {errors.fullName && <span className="form-error" id="fullName-error">{errors.fullName}</span>}
          </div>
          <div className="form-field full">
            <label htmlFor="email">Email address</label>
            <input id="email" className={`form-input ${errors.email ? "has-error" : ""}`} value={form.email} onChange={set("email")} onBlur={onBlur("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
            {errors.email && <span className="form-error" id="email-error">{errors.email}</span>}
          </div>
          <div className="form-field full">
            <label htmlFor="address">Street address</label>
            <input id="address" className={`form-input ${errors.address ? "has-error" : ""}`} value={form.address} onChange={set("address")} onBlur={onBlur("address")} aria-invalid={!!errors.address} aria-describedby={errors.address ? "address-error" : undefined} />
            {errors.address && <span className="form-error" id="address-error">{errors.address}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="city">City</label>
            <input id="city" className={`form-input ${errors.city ? "has-error" : ""}`} value={form.city} onChange={set("city")} onBlur={onBlur("city")} aria-invalid={!!errors.city} aria-describedby={errors.city ? "city-error" : undefined} />
            {errors.city && <span className="form-error" id="city-error">{errors.city}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="state">State</label>
            <input id="state" className={`form-input ${errors.state ? "has-error" : ""}`} value={form.state} onChange={set("state")} onBlur={onBlur("state")} aria-invalid={!!errors.state} aria-describedby={errors.state ? "state-error" : undefined} />
            {errors.state && <span className="form-error" id="state-error">{errors.state}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="zip">ZIP code</label>
            <input id="zip" className={`form-input ${errors.zip ? "has-error" : ""}`} value={form.zip} onChange={set("zip")} onBlur={onBlur("zip")} aria-invalid={!!errors.zip} aria-describedby={errors.zip ? "zip-error" : undefined} />
            {errors.zip && <span className="form-error" id="zip-error">{errors.zip}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone number</label>
            <input id="phone" className={`form-input ${errors.phone ? "has-error" : ""}`} value={form.phone} onChange={set("phone")} onBlur={onBlur("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
            {errors.phone && <span className="form-error" id="phone-error">{errors.phone}</span>}
          </div>
        </div>

        <div className="checkout-actions">
          <span />
          <button type="submit" className="btn btn-primary">Continue to Payment</button>
        </div>
      </form>
    </div>
  );
}
