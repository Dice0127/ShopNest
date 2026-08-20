import { useMemo } from "react";
import type { HeroSlide } from "../components/HeroCarousel";
import type { Product } from "../types";

/**
 * Builds the Home page's hero carousel slides. Pulls real product photos
 * from the catalog instead of stock imagery, so each promo actually
 * reflects what's in the store and its CTA leads somewhere real (a
 * category or the deals view). Only slides that found matching product
 * photos are kept — an empty visual would look broken rather than just
 * less busy.
 */
export function useHeroSlides(
  products: Product[],
  deals: Product[],
  onSelectCategory: (category: string | null) => void,
  onGoDeals: () => void
): HeroSlide[] {
  return useMemo(() => {
    const imagesFor = (cats: string[], count = 3) =>
      products.filter((p) => cats.includes(p.category)).slice(0, count).map((p) => p.img);

    const slides: HeroSlide[] = [
      {
        eyebrow: "Summer Sale",
        heading: "Discover the Best Tech & Gadgets",
        subtext: "Up to 40% off on selected smartphones, laptops, and accessories.",
        ctaLabel: "Shop Now",
        onCta: () => onSelectCategory("smartphones"),
        images: imagesFor(["smartphones", "laptops", "mobile-accessories"]),
        theme: "blue",
      },
      {
        eyebrow: "New Season",
        heading: "Refresh Your Wardrobe",
        subtext: "Fresh arrivals in women's dresses, shoes, and accessories.",
        ctaLabel: "Shop Now",
        onCta: () => onSelectCategory("womens-dresses"),
        images: imagesFor(["womens-dresses", "womens-shoes", "womens-bags"]),
        theme: "rose",
      },
      {
        eyebrow: "Self-Care Sale",
        heading: "Glow Up for Less",
        subtext: "Skincare, beauty, and fragrance favorites at their best prices.",
        ctaLabel: "Shop Now",
        onCta: () => onSelectCategory("beauty"),
        images: imagesFor(["beauty", "skin-care", "fragrances"]),
        theme: "lavender",
      },
      {
        eyebrow: "Payday Sale",
        heading: "Biggest Deals of the Month",
        subtext: "Today's Deals — the steepest discounts, while supplies last.",
        ctaLabel: "Shop Deals",
        onCta: onGoDeals,
        images: deals.slice(0, 3).map((p) => p.img),
        theme: "gold",
      },
    ];

    return slides.filter((s) => s.images.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, deals, onSelectCategory, onGoDeals]);
}
