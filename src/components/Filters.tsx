import { formatPrice } from "../utils/currency";
import { Star, List } from "lucide-react";
import { useCatalog } from "../CatalogContext";
import { categoryLabel } from "../data/categoryMeta";
import type { Dispatch, SetStateAction } from "react";
import type { FilterState } from "../types";
import "./Filters.css";

interface FiltersProps {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  maxPrice: number;
}

export default function Filters({ filters, setFilters, maxPrice }: FiltersProps) {
  const { products, categories } = useCatalog();

  const toggleCategory = (cat: string) => {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat],
    }));
  };

  // Clears just the category selection, staying on the current page (Shop
  // or Discover) so you see all products there — paginated, not a wall of
  // scroll — rather than being redirected somewhere else.
  const showAllCategories = () => {
    setFilters((f) => ({ ...f, categories: [] }));
  };

  const clearAll = () => {
    setFilters({ categories: [], priceMin: 0, priceMax: maxPrice, minRating: 0, inStockOnly: false });
  };

  const countFor = (cat: string) => products.filter((p) => p.category === cat).length;

  return (
    <aside className="filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <button className="filters-clear" onClick={clearAll}>Clear all</button>
      </div>

      <fieldset className="filter-group">
        <legend className="sr-only">Categories</legend>
        <button type="button" onClick={showAllCategories} className="filter-all-categories">
          <List size={16} />
          <span>All Categories</span>
        </button>
        <div className="filter-categories-scroll">
          {categories.map((cat) => (
            <label key={cat} className="filter-checkbox-row">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {categoryLabel(cat)}
              <span className="count">{countFor(cat)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="filter-group">
        <div className="filter-group-title">Price Range</div>
        <div className="filter-price-inputs">
          <div className="filter-price-field">
            <label htmlFor="filter-price-min">Min</label>
            <input
              id="filter-price-min"
              type="number"
              min={0}
              max={filters.priceMax}
              value={filters.priceMin}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value) || 0, filters.priceMax);
                setFilters((f) => ({ ...f, priceMin: Math.max(0, val) }));
              }}
            />
          </div>
          <span className="filter-price-sep">–</span>
          <div className="filter-price-field">
            <label htmlFor="filter-price-max">Max</label>
            <input
              id="filter-price-max"
              type="number"
              min={filters.priceMin}
              max={maxPrice}
              value={filters.priceMax}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value) || 0, filters.priceMin);
                setFilters((f) => ({ ...f, priceMax: Math.min(maxPrice, val) }));
              }}
            />
          </div>
        </div>
        <div className="filter-price-values">
          <span>{formatPrice(filters.priceMin)}</span>
          <span>{formatPrice(filters.priceMax)}</span>
        </div>
        <input
          type="range"
          className="filter-range"
          aria-label="Maximum price"
          min={0}
          max={maxPrice}
          step={50}
          value={filters.priceMax}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), filters.priceMin);
            setFilters((f) => ({ ...f, priceMax: val }));
          }}
        />
      </div>

      <fieldset className="filter-group">
        <legend className="filter-group-title">Customer Rating</legend>
        {[5, 4, 3, 2, 1].map((r) => (
          <label key={r} className="filter-stars-row">
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === r}
              onChange={() => setFilters((f) => ({ ...f, minRating: f.minRating === r ? 0 : r }))}
            />
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} fill={i < r ? "var(--star)" : "none"} color="var(--star)" />
            ))}
            & up
          </label>
        ))}
      </fieldset>

      <div className="filter-group">
        <div className="filter-toggle-row">
          <span>In stock only</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilters((f) => ({ ...f, inStockOnly: e.target.checked }))}
              aria-label="In stock only"
            />
            <span className="switch-track" />
          </label>
        </div>
      </div>
    </aside>
  );
}
