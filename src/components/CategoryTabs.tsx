import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { categoryLabel } from "../data/categoryMeta";

// How many category tabs show inline before the rest collapse into
// "See All Categories". Kept low enough that even the longest category
// labels ("Mobile Accessories", "Kitchen Accessories") fit without
// truncating, and one lower than a full row so the last tab never gets
// visually cut off at the edge of the scroll area.
const VISIBLE_TABS = 9;

interface CategoryTabsProps {
  categories: string[];
  active: string | null;
  onSelect: (category: string) => void;
}

// Scrollable row of category tabs + "See All Categories" overflow menu.
// Shared by the Top Products page and Shop's Today's Deals view.
export default function CategoryTabs({ categories, active, onSelect }: CategoryTabsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const visibleTabs = categories.slice(0, VISIBLE_TABS);
  const overflowTabs = categories.slice(VISIBLE_TABS);
  const activeInOverflow = active != null && overflowTabs.includes(active);

  const select = (cat: string) => {
    onSelect(cat);
    setMenuOpen(false);
  };

  return (
    <div className="top-products-tabs">
      <div className="top-products-tabs-scroll" role="tablist">
        {visibleTabs.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={active === cat}
            className={`top-products-tab ${active === cat ? "is-active" : ""}`}
            onClick={() => select(cat)}
          >
            {categoryLabel(cat)}
          </button>
        ))}
      </div>

      {overflowTabs.length > 0 && (
        <div
          className="top-products-more"
          ref={menuRef}
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <button
            type="button"
            className={`top-products-tab top-products-more-btn ${activeInOverflow ? "is-active" : ""}`}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            See All Categories <ChevronDown size={14} />
          </button>
          {menuOpen && (
            <div className="top-products-menu">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`top-products-menu-item ${active === cat ? "is-active" : ""}`}
                  onClick={() => select(cat)}
                >
                  {categoryLabel(cat)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
