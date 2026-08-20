import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { useCatalog } from "../../CatalogContext";
import { categoryLabel } from "../../data/categoryMeta";
import { useOutsideClick } from "../../utils/useOutsideClick";

const MAX_SUGGESTIONS = 6;

interface Suggestion {
  type: "product" | "category";
  label: string;
  value: string;
}

interface SearchBarProps {
  query: string;
  onSearchSubmit: (value: string) => void;
}

export default function SearchBar({ query, onSearchSubmit }: SearchBarProps) {
  const { products, categories } = useCatalog();

  // What's typed in the box — kept separate from the submitted `query` so
  // typing only drives suggestions and never filters products by itself.
  const [term, setTerm] = useState(query || "");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Keep the box in sync when the submitted query changes elsewhere
  // (e.g. navigating home, or picking a category clears it).
  useEffect(() => {
    setTerm(query || "");
  }, [query]);

  useOutsideClick(formRef, () => setSuggestOpen(false), suggestOpen);

  const suggestions = useMemo<Suggestion[]>(() => {
    const q = term.trim().toLowerCase();
    if (!q) return [];
    const nameMatches = products
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, MAX_SUGGESTIONS)
      .map((p): Suggestion => ({ type: "product", label: p.name, value: p.name }));
    const categoryMatches = categories
      .filter((c) => categoryLabel(c).toLowerCase().includes(q))
      .slice(0, MAX_SUGGESTIONS - nameMatches.length)
      .map((c): Suggestion => ({ type: "category", label: categoryLabel(c), value: categoryLabel(c) }));
    return [...nameMatches, ...categoryMatches].slice(0, MAX_SUGGESTIONS);
  }, [term, products, categories]);

  const runSearch = (value: string) => {
    const val = value.trim();
    if (!val) return;
    setSuggestOpen(false);
    onSearchSubmit?.(val);
  };

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    runSearch(term);
  };

  const pickSuggestion = (value: string) => {
    setTerm(value);
    runSearch(value);
  };

  return (
    <form className="navbar-search" onSubmit={submitSearch} ref={formRef} role="search">
      <input
        placeholder="Search for products..."
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setSuggestOpen(true);
        }}
        onFocus={() => term.trim() && setSuggestOpen(true)}
        aria-label="Search products"
        role="combobox"
        aria-expanded={suggestOpen && suggestions.length > 0}
        aria-controls="navbar-search-listbox"
        aria-autocomplete="list"
        autoComplete="off"
      />
      <button type="submit" className="navbar-search-btn" aria-label="Search">
        <Search size={16} />
      </button>

      {suggestOpen && suggestions.length > 0 && (
        <div className="navbar-search-suggestions" id="navbar-search-listbox" role="listbox">
          {suggestions.map((s, i) => (
            <button
              type="button"
              role="option"
              aria-selected={false}
              key={`${s.type}-${s.value}-${i}`}
              className="navbar-search-suggestion"
              onClick={() => pickSuggestion(s.value)}
            >
              <Search size={13} />
              <span>{s.label}</span>
              {s.type === "category" && <span className="navbar-search-suggestion-tag">Category</span>}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
