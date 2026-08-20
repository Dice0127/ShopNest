import { useEffect, useRef, useState } from "react";
import { Heart, ShoppingCart, Bell, HelpCircle } from "lucide-react";
import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";
import { useToast } from "../ToastContext";
import BrandMark from "./BrandMark";
import LanguageSwitcher from "./navbar/LanguageSwitcher";
import SearchBar from "./navbar/SearchBar";
import AccountMenu from "./navbar/AccountMenu";
import "./Navbar.css";

interface NavbarProps {
  query: string;
  onSearchSubmit: (value: string) => void;
  onCartOpen: () => void;
  onGoHome: () => void;
  onGoWishlist: () => void;
}

export default function Navbar({ query, onSearchSubmit, onCartOpen, onGoHome, onGoWishlist }: NavbarProps) {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { showToast } = useToast();
  const [cartBump, setCartBump] = useState(false);
  const prevCount = useRef(count);

  // Bumps the cart badge briefly whenever the item count goes up, so
  // "Add to Cart" feels like it did something even though the drawer
  // doesn't open automatically.
  useEffect(() => {
    if (count > prevCount.current) {
      setCartBump(true);
      const t = setTimeout(() => setCartBump(false), 320);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  return (
    <header className="navbar">
      <div className="navbar-topbar">
        <div className="container navbar-topbar-inner">
          <LanguageSwitcher />
          <button className="navbar-topbar-link" onClick={() => showToast("Help Center coming soon")}>
            <HelpCircle size={13} /> Help
          </button>
        </div>
      </div>

      <div className="container navbar-inner">
        <a href="#" onClick={(e) => { e.preventDefault(); onGoHome(); }} className="navbar-logo">
          <BrandMark size={26} />
          ShopNest
        </a>

        <SearchBar query={query} onSearchSubmit={onSearchSubmit} />

        <div className="navbar-actions">
          <button className="navbar-icon-btn" aria-label="Notifications" onClick={() => showToast("No new notifications")}>
            <Bell size={19} />
          </button>
          <button className="navbar-icon-btn" aria-label="Wishlist" onClick={onGoWishlist}>
            <Heart size={19} />
            {wishCount > 0 && <span className="navbar-cart-badge">{wishCount}</span>}
          </button>
          <button className={`navbar-icon-btn ${cartBump ? "is-bumping" : ""}`} aria-label="Open cart" onClick={onCartOpen}>
            <ShoppingCart size={19} />
            {count > 0 && <span className="navbar-cart-badge">{count}</span>}
          </button>

          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
