import { ChevronLeft, ChevronRight } from "lucide-react";
import { pageWindow } from "../utils/pageWindow";
import "./Discover.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export default function Pagination({ page, totalPages, onPageChange, label = "Pages" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const goTo = (n: number) => {
    if (n < 1 || n > totalPages || n === page) return;
    onPageChange(n);
  };

  return (
    <nav className="discover-pagination" aria-label={label}>
      <button className="discover-page-nav" onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Previous page">
        <ChevronLeft size={16} />
      </button>

      {pageWindow(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="discover-page-gap">…</span>
        ) : (
          <button
            key={p}
            className={`discover-page-btn ${p === page ? "is-active" : ""}`}
            onClick={() => goTo(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button className="discover-page-nav" onClick={() => goTo(page + 1)} disabled={page === totalPages} aria-label="Next page">
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
