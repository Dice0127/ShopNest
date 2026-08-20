import { createContext, useContext, useMemo, type ReactNode } from "react";
import { storeConfig } from "./data/products";
import { useLocalStorageReducer } from "./utils/useLocalStorageReducer";
import { useLocalStorage } from "./utils/useLocalStorage";
import type { AppliedCoupon, ApplyCouponResult, CartAction, CartContextValue, CartItem, Coupon, Product } from "./types";

const CartContext = createContext<CartContextValue | null>(null);

const COUPONS: Record<string, Coupon> = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  SAVE20: { type: "percent", value: 20, label: "20% off" },
  FREESHIP: { type: "freeship", value: 0, label: "Free shipping" },
};

function reducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((i) => i.id === action.product.id);
      const qtyToAdd = action.qty || 1;
      if (existing) {
        return state.map((i) => (i.id === action.product.id ? { ...i, qty: i.qty + qtyToAdd } : i));
      }
      return [...state, { ...action.product, qty: qtyToAdd }];
    }
    case "SET_QTY":
      return state
        .map((i) => (i.id === action.id ? { ...i, qty: Math.max(0, action.qty) } : i))
        .filter((i) => i.qty > 0);
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useLocalStorageReducer<CartItem[], CartAction>("shopnest:cart", reducer, []);
  const [coupon, setCoupon] = useLocalStorage<AppliedCoupon | null>("shopnest:coupon", null);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    let shipping = items.length === 0 ? 0 : subtotal >= storeConfig.freeShippingThreshold ? 0 : storeConfig.shippingFlat;
    let discount = 0;
    if (coupon) {
      if (coupon.type === "percent") discount = subtotal * (coupon.value / 100);
      if (coupon.type === "freeship") shipping = 0;
    }
    const tax = Math.max(subtotal - discount, 0) * storeConfig.taxRate;
    const total = Math.max(subtotal - discount, 0) + shipping + tax;

    const applyCoupon = (code: string): ApplyCouponResult => {
      const key = code.trim().toUpperCase();
      if (!key) return { ok: false, message: "Enter a coupon code" };
      const found = COUPONS[key];
      if (!found) return { ok: false, message: "Invalid coupon code" };
      setCoupon({ code: key, ...found });
      return { ok: true, message: `Applied "${key}" — ${found.label}` };
    };
    const removeCoupon = () => setCoupon(null);

    return {
      items,
      count,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      coupon,
      applyCoupon,
      removeCoupon,
      addItem: (product: Product, qty?: number) => dispatch({ type: "ADD", product, qty }),
      setQty: (id: string, qty: number) => dispatch({ type: "SET_QTY", id, qty }),
      removeItem: (id: string) => dispatch({ type: "REMOVE", id }),
      clear: () => {
        dispatch({ type: "CLEAR" });
        setCoupon(null);
      },
    };
  }, [items, coupon, dispatch, setCoupon]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
