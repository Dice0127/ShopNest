// Central place for shared types used across the app.
// Import this wherever a Product, CartItem, etc. is needed:
//   import type { Product } from "../types";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviews: number;
  stock: number;
  dateAdded: string;
  img: string;
  desc: string;
}

export interface StoreConfig {
  name: string;
  taxRate: number;
  freeShippingThreshold: number;
  shippingFlat: number;
}

// ---- Cart ----

export interface CartItem extends Product {
  qty: number;
}

export type CouponType = "percent" | "freeship";

export interface Coupon {
  type: CouponType;
  value: number;
  label: string;
}

export interface AppliedCoupon extends Coupon {
  code: string;
}

export interface ApplyCouponResult {
  ok: boolean;
  message: string;
}

export type CartAction =
  | { type: "ADD"; product: Product; qty?: number }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" };

export interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  coupon: AppliedCoupon | null;
  applyCoupon: (code: string) => ApplyCouponResult;
  removeCoupon: () => void;
  addItem: (product: Product, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

// ---- Wishlist ----

export interface WishlistContextValue {
  ids: string[];
  count: number;
  isWishlisted: (id: string) => boolean;
  toggle: (id: string) => void;
}

// ---- Toast ----

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: number;
  message: string;
  action?: ToastAction;
}

export interface ToastContextValue {
  showToast: (message: string, action?: ToastAction) => void;
}

// ---- Catalog ----

export interface CatalogContextValue {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

// ---- Filters / sorting ----

export interface FilterState {
  categories: string[];
  priceMin: number;
  priceMax: number;
  minRating: number;
  inStockOnly: boolean;
}

export type SortValue = "featured" | "price-asc" | "price-desc" | "rating" | "newest" | "name";

export type Layout = "grid" | "list";

// ---- Checkout ----

export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export type PaymentMethod = "card" | "paypal";

export interface PaymentInfo {
  method: PaymentMethod;
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export type FieldValidator<T> = (
  value: string,
  allValues: T
) => string | null;

export type ValidatorMap<T> = {
  [K in keyof T]?: FieldValidator<T>;
};

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
