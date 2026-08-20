import { describe, it, expect } from "vitest";
import { formatPrice } from "./currency";

describe("formatPrice", () => {
  it("formats a positive number as PHP currency with 2 decimals", () => {
    expect(formatPrice(199.5)).toBe("₱199.50");
  });

  it("formats zero correctly", () => {
    expect(formatPrice(0)).toBe("₱0.00");
  });

  it("rounds to 2 decimal places", () => {
    expect(formatPrice(10.999)).toBe("₱11.00");
  });

  it("treats non-numeric input as 0", () => {
    expect(formatPrice(undefined)).toBe("₱0.00");
    expect(formatPrice(null)).toBe("₱0.00");
    expect(formatPrice("not a number")).toBe("₱0.00");
  });

  it("formats large numbers without a thousands separator", () => {
    expect(formatPrice(2899.99)).toBe("₱2899.99");
  });
});
