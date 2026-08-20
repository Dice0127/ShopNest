# ShopNest

A React + Vite storefront demo: product browsing, filters, cart, wishlist, and a multi-step checkout flow, priced in PHP.

## Stack notes

- **Routing**: React Router (`react-router-dom`) — real URLs per page (`/`, `/shop`, `/product/:id`, `/wishlist`, `/checkout`), shareable/deep-linkable, browser back/forward works.
- **Persistence**: cart, applied coupon, and wishlist persist to `localStorage` via small reusable hooks (`src/utils/useLocalStorage.ts`, `src/utils/useLocalStorageReducer.ts`), so a refresh doesn't wipe the cart.
- **Testing**: Vitest + React Testing Library. Run `npm test` (single run) or `npm run test:watch`. Covers cart totals math (subtotal/discount/shipping/tax), coupon logic, and the localStorage persistence hooks.

## Known limitations

This is a frontend demo, not a production storefront:

- **Checkout is simulated.** The payment step doesn't talk to a real processor, and the order ID on the confirmation screen is randomly generated client-side — no order is actually persisted anywhere.
- **Catalog comes from a public demo API** ([dummyjson.com](https://dummyjson.com)), converted to PHP pricing at fetch time. There's no backend of my own and no admin/inventory system.
- **No authentication or user accounts.** Cart and wishlist are scoped to the browser via `localStorage`, not to a logged-in user.

## Scripts

```
npm run dev        # start dev server
npm run build       # production build
npm run preview     # preview the production build
npm test            # run the test suite once
npm run test:watch  # run tests in watch mode
npm run lint         # oxlint
```

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
