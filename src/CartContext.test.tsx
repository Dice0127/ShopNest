import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { CartProvider, useCart } from "./CartContext";
import { storeConfig } from "./data/products";
import type { ApplyCouponResult, Product } from "./types";

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

const product = (overrides: Partial<Product> = {}): Product => ({
  id: "p1",
  name: "Test Product",
  price: 500,
  stock: 10,
  category: "test",
  rating: 0,
  reviews: 0,
  dateAdded: new Date().toISOString(),
  img: "",
  desc: "",
  oldPrice: null,
  ...overrides,
});

describe("CartContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts empty", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("adds an item and computes subtotal", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(product(), 2));
    expect(result.current.count).toBe(2);
    expect(result.current.subtotal).toBe(1000);
  });

  it("increments quantity when adding the same product again", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(product(), 1));
    act(() => result.current.addItem(product(), 1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.qty).toBe(2);
  });

  it("removes an item when quantity is set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(product(), 1));
    act(() => result.current.setQty("p1", 0));
    expect(result.current.items).toEqual([]);
  });

  it("charges flat shipping below the free-shipping threshold", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(product({ price: 100 }), 1));
    expect(result.current.subtotal).toBeLessThan(storeConfig.freeShippingThreshold);
    expect(result.current.shipping).toBe(storeConfig.shippingFlat);
  });

  it("waives shipping at or above the free-shipping threshold", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(product({ price: storeConfig.freeShippingThreshold }), 1));
    expect(result.current.shipping).toBe(0);
  });

  it("applies a percent-off coupon to the subtotal", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(product({ price: 1000 }), 1));
    act(() => {
      const res = result.current.applyCoupon("SAVE10");
      expect(res.ok).toBe(true);
    });
    expect(result.current.discount).toBe(100);
  });

  it("rejects an invalid coupon code", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    let res: ApplyCouponResult | undefined;
    act(() => {
      res = result.current.applyCoupon("NOTREAL");
    });
    expect(res?.ok).toBe(false);
    expect(result.current.coupon).toBeNull();
  });

  it("waives shipping with a FREESHIP coupon regardless of subtotal", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(product({ price: 100 }), 1));
    act(() => result.current.applyCoupon("FREESHIP"));
    expect(result.current.shipping).toBe(0);
  });

  it("computes tax on the discounted subtotal, and total as subtotal - discount + shipping + tax", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(product({ price: storeConfig.freeShippingThreshold }), 1));
    act(() => result.current.applyCoupon("SAVE10"));

    const discountedSubtotal = result.current.subtotal - result.current.discount;
    const expectedTax = discountedSubtotal * storeConfig.taxRate;
    expect(result.current.tax).toBeCloseTo(expectedTax, 5);
    expect(result.current.total).toBeCloseTo(discountedSubtotal + result.current.shipping + expectedTax, 5);
  });

  it("clears items and coupon on clear()", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(product(), 1));
    act(() => result.current.applyCoupon("SAVE10"));
    act(() => result.current.clear());
    expect(result.current.items).toEqual([]);
    expect(result.current.coupon).toBeNull();
  });

  it("persists cart items to localStorage", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(product(), 3));
    const stored = JSON.parse(window.localStorage.getItem("shopnest:cart") ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].qty).toBe(3);
  });
});
