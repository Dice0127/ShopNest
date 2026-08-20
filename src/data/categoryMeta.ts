import type { LucideIcon } from "lucide-react";
import {
  Palette, Droplet, Armchair, ShoppingBasket, Home as HomeIcon, UtensilsCrossed, Laptop,
  Shirt, Footprints, Watch, Cable, Bike, HeartPulse, Smartphone, Dumbbell, Glasses,
  Tablet, Car, Backpack, Gem, Tag,
} from "lucide-react";

interface CategoryEntry {
  label: string;
  icon: LucideIcon;
}

const CATEGORY_META: Record<string, CategoryEntry> = {
  beauty: { label: "Beauty", icon: Palette },
  fragrances: { label: "Fragrances", icon: Droplet },
  furniture: { label: "Furniture", icon: Armchair },
  groceries: { label: "Groceries", icon: ShoppingBasket },
  "home-decoration": { label: "Home Decoration", icon: HomeIcon },
  "kitchen-accessories": { label: "Kitchen Accessories", icon: UtensilsCrossed },
  laptops: { label: "Laptops", icon: Laptop },
  "mens-shirts": { label: "Men's Shirts", icon: Shirt },
  "mens-shoes": { label: "Men's Shoes", icon: Footprints },
  "mens-watches": { label: "Men's Watches", icon: Watch },
  "mobile-accessories": { label: "Mobile Accessories", icon: Cable },
  motorcycle: { label: "Motorcycle", icon: Bike },
  "skin-care": { label: "Skin Care", icon: HeartPulse },
  smartphones: { label: "Smartphones", icon: Smartphone },
  "sports-accessories": { label: "Sports Accessories", icon: Dumbbell },
  sunglasses: { label: "Sunglasses", icon: Glasses },
  tablets: { label: "Tablets", icon: Tablet },
  tops: { label: "Tops", icon: Shirt },
  vehicle: { label: "Vehicles", icon: Car },
  "womens-bags": { label: "Women's Bags", icon: Backpack },
  "womens-dresses": { label: "Women's Dresses", icon: Shirt },
  "womens-jewellery": { label: "Women's Jewellery", icon: Gem },
  "womens-shoes": { label: "Women's Shoes", icon: Footprints },
  "womens-watches": { label: "Women's Watches", icon: Watch },
};

export function categoryLabel(slug: string): string {
  if (CATEGORY_META[slug]) return CATEGORY_META[slug].label;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function categoryIcon(slug: string): LucideIcon {
  return CATEGORY_META[slug]?.icon || Tag;
}
