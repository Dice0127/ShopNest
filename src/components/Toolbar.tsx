import { LayoutGrid, List } from "lucide-react";
import { SORTS } from "../utils/sorting";
import type { Layout, SortValue } from "../types";

interface ToolbarProps {
  sort: SortValue;
  setSort: (sort: SortValue) => void;
  layout: Layout;
  setLayout: (layout: Layout) => void;
}

// Sort dropdown + grid/list toggle — identical markup was duplicated across
// Shop, Discover, and TopProducts. Now shared.
export default function Toolbar({ sort, setSort, layout, setLayout }: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-right">
        <span className="toolbar-sort-label">Sort by:</span>
        <select
          className="toolbar-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortValue)}
          aria-label="Sort products"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <div className="view-toggle" role="group" aria-label="Toggle layout">
          <button
            type="button"
            className={layout === "grid" ? "is-active" : ""}
            aria-label="Grid view"
            onClick={() => setLayout("grid")}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            className={layout === "list" ? "is-active" : ""}
            aria-label="List view"
            onClick={() => setLayout("list")}
          >
            <List size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
