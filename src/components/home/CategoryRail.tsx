import { ChevronRight } from "lucide-react";
import { categoryLabel, categoryIcon } from "../../data/categoryMeta";

interface CategoryRailProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

export default function CategoryRail({ categories, onSelectCategory }: CategoryRailProps) {
  return (
    <aside className="home-categories-card">
      <div className="home-categories-scroll">
        {categories.map((cat) => {
          const Icon = categoryIcon(cat);
          return (
            <button key={cat} className="home-category-row" onClick={() => onSelectCategory(cat)}>
              <span className="home-category-icon"><Icon size={14} /></span>
              <span className="home-category-name">{categoryLabel(cat)}</span>
              <ChevronRight size={15} className="home-category-chevron" />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
