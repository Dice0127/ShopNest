import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { CatalogProvider, useCatalog } from "./CatalogContext";
import type { Product } from "./types";

// CatalogContext only depends on fetchCatalog(), so mocking that one
// function lets us drive loading/success/error without touching the
// network — the same seam the real ErrorBoundary/reload UI relies on.
vi.mock("./api/catalog", () => ({
  fetchCatalog: vi.fn(),
}));

import { fetchCatalog } from "./api/catalog";

const mockedFetchCatalog = vi.mocked(fetchCatalog);

const product = (overrides: Partial<Product> = {}): Product => ({
  id: "p1",
  name: "Test Product",
  price: 500,
  stock: 10,
  category: "test-category",
  rating: 4,
  reviews: 12,
  dateAdded: new Date().toISOString(),
  img: "",
  desc: "",
  oldPrice: null,
  ...overrides,
});

// Small consumer that surfaces CatalogContext's state as text/buttons so
// tests can assert on it without reaching into the provider directly.
function CatalogProbe() {
  const { products, categories, loading, error, reload } = useCatalog();
  if (loading) return <p>Loading products…</p>;
  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={reload}>Try again</button>
      </div>
    );
  }
  return (
    <div>
      <p>{products.length} products</p>
      <p>{categories.join(",")}</p>
    </div>
  );
}

describe("CatalogContext", () => {
  beforeEach(() => {
    mockedFetchCatalog.mockReset();
  });

  it("starts in a loading state", () => {
    mockedFetchCatalog.mockReturnValue(new Promise(() => {})); // never resolves
    render(
      <CatalogProvider>
        <CatalogProbe />
      </CatalogProvider>
    );
    expect(screen.getByText("Loading products…")).toBeInTheDocument();
  });

  it("exposes the fetched products and derived, sorted, de-duplicated categories once loaded", async () => {
    mockedFetchCatalog.mockResolvedValue([
      product({ id: "p1", category: "beauty" }),
      product({ id: "p2", category: "smartphones" }),
      product({ id: "p3", category: "beauty" }), // duplicate category
    ]);

    render(
      <CatalogProvider>
        <CatalogProbe />
      </CatalogProvider>
    );

    await waitFor(() => expect(screen.getByText("3 products")).toBeInTheDocument());
    // categories are de-duplicated and sorted alphabetically
    expect(screen.getByText("beauty,smartphones")).toBeInTheDocument();
  });

  it("surfaces an error message when the fetch fails", async () => {
    mockedFetchCatalog.mockRejectedValue(new Error("Failed to load products (500)"));

    render(
      <CatalogProvider>
        <CatalogProbe />
      </CatalogProvider>
    );

    await waitFor(() => expect(screen.getByText("Failed to load products (500)")).toBeInTheDocument());
  });

  it("re-fetches and can recover after calling reload()", async () => {
    mockedFetchCatalog.mockRejectedValueOnce(new Error("Network error"));
    mockedFetchCatalog.mockResolvedValueOnce([product({ id: "p1" })]);

    render(
      <CatalogProvider>
        <CatalogProbe />
      </CatalogProvider>
    );

    await waitFor(() => expect(screen.getByText("Network error")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Try again"));

    await waitFor(() => expect(screen.getByText("1 products")).toBeInTheDocument());
    expect(mockedFetchCatalog).toHaveBeenCalledTimes(2);
  });
});
