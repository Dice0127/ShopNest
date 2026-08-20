import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import { fetchCatalog } from "./api/catalog";
import type { CatalogContextValue, Product } from "./types";

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCatalog()
      .then((list) => {
        if (!cancelled) setProducts(list);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong loading products.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    products.forEach((p) => {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        list.push(p.category);
      }
    });
    return list.sort();
  }, [products]);

  const value = useMemo<CatalogContextValue>(
    () => ({ products, categories, loading, error, reload }),
    [products, categories, loading, error, reload]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
