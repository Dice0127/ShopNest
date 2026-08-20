import { Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
  useSearchParams,
  useParams,
} from "react-router-dom";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";
import { ToastProvider } from "./ToastContext";
import { CatalogProvider, useCatalog } from "./CatalogContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import ErrorBoundary from "./components/ErrorBoundary";
import type { Crumb } from "./components/Breadcrumbs";
import type { Product } from "./types";
import "./AppShell.css";

// Route-level code splitting: Home stays eager since it's the landing page,
// everything else loads on demand so the initial bundle stays small.
const Shop = lazy(() => import("./components/Shop"));
const Discover = lazy(() => import("./components/Discover"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const TopProducts = lazy(() => import("./components/TopProducts"));
const CheckoutFlow = lazy(() => import("./checkout/CheckoutFlow"));
const NotFound = lazy(() => import("./components/NotFound"));

function RouteFallback() {
  return (
    <div className="app-state-screen">
      <div className="app-state-spinner" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

interface LayoutProps {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
}

// Navbar + CartDrawer/WishlistDrawer live outside the routed page content so
// they persist across navigations; page content renders via <Outlet />.
function Layout({ cartOpen, setCartOpen, wishlistOpen, setWishlistOpen }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = location.pathname === "/shop" ? searchParams.get("q") || "" : "";

  const handleSearchSubmit = (val: string) => {
    if (!val.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(val)}`);
  };

  const isCheckout = location.pathname === "/checkout";

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {!isCheckout && (
        <Navbar
          query={query}
          onSearchSubmit={handleSearchSubmit}
          onCartOpen={() => setCartOpen(true)}
          onGoHome={() => navigate("/")}
          onGoWishlist={() => setWishlistOpen(true)}
        />
      )}

      <main id="main-content">
        <Suspense fallback={<RouteFallback />}>
          <ErrorBoundary key={location.pathname} onReset={() => navigate(0)}>
            <Outlet />
          </ErrorBoundary>
        </Suspense>
      </main>

      {!isCheckout && <Footer />}
      {!isCheckout && <ChatWidget />}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          navigate("/checkout");
        }}
      />

      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        onOpenProduct={(p) => navigate(`/product/${p.id}`)}
      />
    </>
  );
}

function HomeRoute() {
  const navigate = useNavigate();
  return (
    <Home
      onSelectCategory={(cat) => navigate(cat ? `/shop?category=${encodeURIComponent(cat)}` : "/shop")}
      onGoDeals={() => navigate("/shop?deals=1")}
      onOpenProduct={(p: Product, crumbs?: Crumb[]) => navigate(`/product/${p.id}`, crumbs ? { state: { breadcrumb: crumbs } } : undefined)}
      onGoTopProducts={() => navigate("/top-products")}
      onGoDiscover={() => navigate("/discover")}
    />
  );
}

function TopProductsRoute() {
  const navigate = useNavigate();
  return <TopProducts onOpenProduct={(p, crumbs) => navigate(`/product/${p.id}`, crumbs ? { state: { breadcrumb: crumbs } } : undefined)} />;
}

function ShopRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || null;
  const dealsOnly = searchParams.get("deals") === "1";

  return (
    <Shop
      query={query}
      categoryFilter={categoryFilter}
      dealsOnly={dealsOnly}
      onOpenProduct={(p, crumbs) => navigate(`/product/${p.id}`, crumbs ? { state: { breadcrumb: crumbs } } : undefined)}
    />
  );
}

function DiscoverRoute() {
  const navigate = useNavigate();
  return <Discover onOpenProduct={(p, crumbs) => navigate(`/product/${p.id}`, crumbs ? { state: { breadcrumb: crumbs } } : undefined)} />;
}

function ProductDetailRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { products } = useCatalog();
  const product = products.find((p) => p.id === id);
  const breadcrumb = (location.state as { breadcrumb?: Crumb[] } | null)?.breadcrumb;

  if (!product) {
    return (
      <div className="app-state-screen">
        <AlertTriangle size={32} />
        <h2>Product not found</h2>
        <button className="btn btn-primary" onClick={() => navigate("/")}>Back to home</button>
      </div>
    );
  }

  return (
    <ProductDetail
      product={product}
      breadcrumb={breadcrumb}
      onBack={() => navigate(-1)}
      onOpenProduct={(p, crumbs) => navigate(`/product/${p.id}`, crumbs ? { state: { breadcrumb: crumbs } } : undefined)}
      onBuyNow={() => navigate("/checkout")}
    />
  );
}

function CheckoutRoute() {
  const navigate = useNavigate();
  return (
    <CheckoutFlow
      onDone={() => navigate("/")}
      onCancel={() => navigate(-1)}
      onEmptyCart={() => navigate("/shop", { replace: true })}
    />
  );
}

function NotFoundRoute() {
  const navigate = useNavigate();
  return <NotFound onGoHome={() => navigate("/")} />;
}

function AppRoutes({ cartOpen, setCartOpen, wishlistOpen, setWishlistOpen }: LayoutProps) {
  const { loading, error, reload } = useCatalog();

  if (error) {
    return (
      <div className="app-state-screen">
        <AlertTriangle size={32} />
        <h2>Couldn't load products</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={reload}>
          <RefreshCw size={15} /> Try again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app-state-screen">
        <div className="app-state-spinner" />
        <p>Loading products…</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout cartOpen={cartOpen} setCartOpen={setCartOpen} wishlistOpen={wishlistOpen} setWishlistOpen={setWishlistOpen} />}>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/shop" element={<ShopRoute />} />
        <Route path="/top-products" element={<TopProductsRoute />} />
        <Route path="/discover" element={<DiscoverRoute />} />
        <Route path="/product/:id" element={<ProductDetailRoute />} />
        <Route path="/checkout" element={<CheckoutRoute />} />
        <Route path="*" element={<NotFoundRoute />} />
      </Route>
    </Routes>
  );
}

function AppShell() {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  return (
    <AppRoutes
      cartOpen={cartOpen}
      setCartOpen={setCartOpen}
      wishlistOpen={wishlistOpen}
      setWishlistOpen={setWishlistOpen}
    />
  );
}

export default function App(): ReactNode {
  return (
    <BrowserRouter>
      <CatalogProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <ScrollToTop />
              <AppShell />
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </CatalogProvider>
    </BrowserRouter>
  );
}
