import { Check } from "lucide-react";

const STEPS = ["Shipping", "Payment", "Review", "Confirmation"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="step-indicator">
      {STEPS.map((label, i) => (
        <div key={label} className="step-indicator-fragment">
          <div className={`step-indicator-item ${i === current ? "is-active" : ""} ${i < current ? "is-done" : ""}`}>
            <span className="step-indicator-circle">{i < current ? <Check size={14} /> : i + 1}</span>
            <span className="step-indicator-label">{label}</span>
          </div>
          {i < STEPS.length - 1 && <div className="step-indicator-line" />}
        </div>
      ))}
    </div>
  );
}
