import { Link } from "react-router-dom";
import { CreditCard, Wallet, Truck, ShieldCheck } from "lucide-react";
import { useCatalog } from "../CatalogContext";
import { categoryLabel } from "../data/categoryMeta";
import { storeConfig } from "../data/products";
import "./Footer.css";

const SOCIAL_LINKS = ["Facebook", "Instagram", "X", "TikTok"];

export default function Footer() {
  const { categories } = useCatalog();
  const featuredCategories = categories.slice(0, 6);
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-col site-footer-about">
          <span className="site-footer-brand">{storeConfig.name}</span>
          <p>
            A frontend portfolio project — a shopping experience built with React and TypeScript,
            not a real storefront. Browse, add to cart, and try checkout; nothing is actually purchased.
          </p>
        </div>

        <div className="site-footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/shop?deals=1">Today's Deals</Link></li>
            <li><Link to="/top-products">Top Products</Link></li>
            <li><Link to="/discover">Daily Discover</Link></li>
          </ul>
        </div>

        <div className="site-footer-col">
          <h4>Categories</h4>
          <ul>
            {featuredCategories.map((cat) => (
              <li key={cat}>
                <Link to={`/shop?category=${encodeURIComponent(cat)}`}>{categoryLabel(cat)}</Link>
              </li>
            ))}
            <li><Link to="/discover">View all categories</Link></li>
          </ul>
        </div>

        <div className="site-footer-col">
          <h4>Customer Service</h4>
          {/* No backend behind these yet — listed for completeness, not linked,
              so the footer doesn't promise support that isn't there. */}
          <ul className="site-footer-inert">
            <li>Help Center</li>
            <li>Order Tracking</li>
            <li>Returns &amp; Refunds</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>

      <div className="site-footer-trust">
        <div className="site-footer-trust-item">
          <ShieldCheck size={18} />
          <span>Simulated secure checkout</span>
        </div>
        <div className="site-footer-trust-item">
          <Truck size={18} />
          <span>Free shipping over ₱{storeConfig.freeShippingThreshold.toLocaleString()}</span>
        </div>
        <div className="site-footer-trust-item">
          <CreditCard size={18} />
          <span>Cards accepted</span>
        </div>
        <div className="site-footer-trust-item">
          <Wallet size={18} />
          <span>E-wallets accepted</span>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>&copy; {year} {storeConfig.name}. Portfolio demo project — not a real store.</span>
        <div className="site-footer-social">
          <span className="site-footer-social-label">Follow</span>
          {SOCIAL_LINKS.map((name) => (
            <span key={name} className="site-footer-social-pill">{name}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
