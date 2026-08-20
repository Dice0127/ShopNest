import type { Product } from "../types";

const API_URL = "https://dummyjson.com/products?limit=0";

// dummyjson prices are in USD — convert to PHP so the whole catalog reflects
// realistic Philippine peso pricing instead of just relabeling USD figures.
const USD_TO_PHP = 58;

interface DummyJsonProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  reviews?: unknown[];
  stock?: number;
  meta?: { createdAt?: string };
  thumbnail?: string;
  images?: string[];
  description?: string;
}

interface DummyJsonResponse {
  products: DummyJsonProduct[];
}

function toPhp(usd: number | null): number | null {
  if (usd == null) return null;
  const converted = usd * USD_TO_PHP;
  // Shopee-style psychological pricing: round down to the nearest peso, end in .99
  return Math.max(0, Math.floor(converted) - 1) + 0.99;
}

function toOldPrice(price: number, discountPercentage?: number): number | null {
  if (!discountPercentage || discountPercentage <= 0) return null;
  const original = price / (1 - discountPercentage / 100);
  return Math.round(original * 100) / 100;
}

function mapProduct(p: DummyJsonProduct): Product {
  const priceUsd = p.price;
  const oldPriceUsd = toOldPrice(p.price, p.discountPercentage);
  return {
    id: `dj-${p.id}`,
    name: p.title,
    category: p.category, // raw slug, e.g. "mens-shirts" — prettified for display via categoryMeta
    price: toPhp(priceUsd) ?? 0,
    oldPrice: oldPriceUsd != null ? toPhp(oldPriceUsd) : null,
    rating: Math.round((p.rating || 0) * 10) / 10,
    reviews: p.reviews?.length || Math.max(8, Math.round((p.id * 37) % 180)),
    stock: p.stock ?? 0,
    dateAdded: p.meta?.createdAt || new Date().toISOString(),
    img: p.thumbnail || p.images?.[0] || "",
    desc: p.description || "",
  };
}

export async function fetchCatalog(): Promise<Product[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
  const data: DummyJsonResponse = await res.json();
  const products = (data.products || []).map(mapProduct);
  return products;
}
