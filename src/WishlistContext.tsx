import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "./utils/useLocalStorage";
import type { WishlistContextValue } from "./types";

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<string[]>("shopnest:wishlist", []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      count: ids.length,
      isWishlisted: (id) => ids.includes(id),
      toggle: (id) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])),
    }),
    [ids, setIds]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
