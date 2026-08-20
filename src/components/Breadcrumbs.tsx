import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { categoryLabel } from "../data/categoryMeta";
import type { Product } from "../types";
import "./Breadcrumbs.css";

export interface Crumb {
  label: string;
  /** Route to link to. Omit for the current page (renders as plain text). */
  to?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

/**
 * Builds the crumb trail for a product detail page, given an optional
 * "section" crumb representing where the user came from (Today's Deals,
 * Top Products, Discover, Shop, etc). Always ends with
 * Home > [source?] > category > product name, so the trail reflects the
 * actual browsing path instead of always defaulting to a generic
 * Home > Category > Product.
 *
 * `categoryTo` lets the caller override where the category crumb links to
 * (e.g. back into Today's Deals filtered by that category, instead of the
 * plain Shop page) so the trail stays consistent with where you came from.
 */
export function buildProductCrumbs(product: Product, source?: Crumb, categoryTo?: string): Crumb[] {
  return [
    { label: "Home", to: "/" },
    ...(source ? [source] : []),
    { label: categoryLabel(product.category), to: categoryTo ?? `/shop?category=${encodeURIComponent(product.category)}` },
    { label: product.name },
  ];
}

// Shared breadcrumb trail, e.g. Home > Smartphones > iPhone X.
// Used across Shop, Discover, Top Products, and Product Detail so
// navigation history reads consistently everywhere in the app.
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={`${item.label}-${i}`}>
            {i > 0 && <ChevronRight size={13} className="breadcrumb-sep" aria-hidden="true" />}
            {isLast || !item.to ? (
              <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
            ) : (
              <Link to={item.to}>{item.label}</Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
