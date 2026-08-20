import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { CartProvider } from "../CartContext";
import { ToastProvider } from "../ToastContext";
import CheckoutFlow from "./CheckoutFlow";
import type { CartItem } from "../types";

// Exercises ShippingStep, PaymentStep, ReviewStep and ConfirmationStep
// together as a user would experience them, instead of testing each step
// in isolation — this is the path that actually matters (can someone buy
// something?), and it's the kind of regression a unit test per component
// wouldn't catch (e.g. a prop name drifting between steps).

const seededItem: CartItem = {
  id: "p1",
  name: "Wireless Headphones",
  price: 1999,
  stock: 5,
  category: "electronics",
  rating: 4.5,
  reviews: 20,
  dateAdded: new Date().toISOString(),
  img: "https://example.com/headphones.jpg",
  desc: "",
  oldPrice: null,
  qty: 1,
};

function seedCart(items: CartItem[]) {
  window.localStorage.setItem("shopnest:cart", JSON.stringify(items));
}

function renderCheckout(overrides: Partial<Parameters<typeof CheckoutFlow>[0]> = {}) {
  const onDone = vi.fn();
  const onCancel = vi.fn();
  const onEmptyCart = vi.fn();
  render(
    <CartProvider>
      <ToastProvider>
        <CheckoutFlow onDone={onDone} onCancel={onCancel} onEmptyCart={onEmptyCart} {...overrides} />
      </ToastProvider>
    </CartProvider>
  );
  return { onDone, onCancel, onEmptyCart };
}

function fill(labelText: string, value: string) {
  fireEvent.change(screen.getByLabelText(labelText), { target: { value } });
  fireEvent.blur(screen.getByLabelText(labelText));
}

describe("CheckoutFlow integration", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("redirects away via onEmptyCart when the cart is empty", () => {
    const { onEmptyCart } = renderCheckout();
    expect(onEmptyCart).toHaveBeenCalled();
  });

  it("walks a seeded cart through shipping, payment, and review to a confirmed order", async () => {
    seedCart([seededItem]);
    const { onEmptyCart } = renderCheckout();

    // -- Shipping step --
    expect(screen.getByRole("heading", { name: "Shipping Information" })).toBeInTheDocument();
    expect(onEmptyCart).not.toHaveBeenCalled();

    fill("Full name", "Juan Dela Cruz");
    fill("Email address", "juan@example.com");
    fill("Street address", "123 Rizal St");
    fill("City", "Quezon City");
    fill("State", "NCR");
    fill("ZIP code", "1100");
    fill("Phone number", "09171234567");
    fireEvent.click(screen.getByRole("button", { name: "Continue to Payment" }));

    // -- Payment step --
    await waitFor(() => expect(screen.getByRole("heading", { name: "Payment Method" })).toBeInTheDocument());

    fill("Name on card", "Juan Dela Cruz");
    fireEvent.change(screen.getByLabelText("Card number"), { target: { value: "4242424242424242" } });
    fireEvent.blur(screen.getByLabelText("Card number"));
    fireEvent.change(screen.getByLabelText("Expiry (MM/YY)"), { target: { value: "1230" } });
    fireEvent.blur(screen.getByLabelText("Expiry (MM/YY)"));
    fill("CVV", "123");
    fireEvent.click(screen.getByRole("button", { name: "Continue to Review" }));

    // -- Review step --
    await waitFor(() => expect(screen.getByRole("heading", { name: "Review Your Order" })).toBeInTheDocument());
    // The order summary should reflect the seeded cart item, not a placeholder.
    expect(screen.getAllByText("Wireless Headphones").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Place Order" }));

    // ReviewStep shows a brief "Placing order…" state before confirming.
    expect(screen.getByRole("button", { name: "Placing order…" })).toBeDisabled();

    // -- Confirmation step --
    await waitFor(
      () => expect(screen.getByRole("heading", { name: "Order placed successfully!" })).toBeInTheDocument(),
      { timeout: 3000 }
    );
    expect(screen.getByText(/confirmation email has been sent to juan@example.com/i)).toBeInTheDocument();

    // Placing the order clears the cart.
    expect(JSON.parse(window.localStorage.getItem("shopnest:cart") || "[]")).toEqual([]);
  });

  it("blocks progressing past the shipping step when required fields are invalid", () => {
    seedCart([seededItem]);
    renderCheckout();

    fireEvent.click(screen.getByRole("button", { name: "Continue to Payment" }));

    // Still on the shipping step — validation should have blocked the transition.
    expect(screen.getByRole("heading", { name: "Shipping Information" })).toBeInTheDocument();
    expect(screen.getByText("Full name is required")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
  });
});
