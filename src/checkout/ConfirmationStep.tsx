import { CheckCircle2 } from "lucide-react";

interface ConfirmationStepProps {
  orderId: string;
  email: string;
  onContinue: () => void;
}

export default function ConfirmationStep({ orderId, email, onContinue }: ConfirmationStepProps) {
  return (
    <div className="confirmation">
      <div className="confirmation-icon">
        <CheckCircle2 size={34} color="var(--success)" />
      </div>
      <h2>Order placed successfully!</h2>
      <div className="confirmation-order-id">Order #{orderId}</div>
      <p className="sub">
        Thank you for your purchase. A confirmation email has been sent to {email}.
        You'll receive a shipping update once your order is on its way.
      </p>
      <button className="btn btn-primary confirmation-continue-btn" onClick={onContinue}>
        Continue Shopping
      </button>
    </div>
  );
}
